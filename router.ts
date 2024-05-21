import { Router, NextFunction, Request, Response } from 'express'
import { HttpError, Status, Task } from './models'
import { MongoClient, ObjectId } from 'mongodb'

const router = Router()

const url = 'mongodb+srv://ziyashamsi:STNxqygM4qgK44AY@cluster0.gnokgvu.mongodb.net'

router.post('/task', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.title) return next(new HttpError('Parameter title required in body.', 400))
    if (!req.body.status) return next(new HttpError('Parameter status required in body.', 400))
    if (req.body.status != 'To Do' && req.body.status != 'In Progress' && req.body.status != 'Done') {
        return next(new HttpError('Invalid Status: Status can be either \'To Do\', \'In Progress\' or \'Done\'.', 400))
    }

    const newTask: Task = {
        title: req.body.title,
        status: req.body.status,
        description: req.body.description ? req.body.description : ''
    }

    const client = new MongoClient(url)
    let result
    try {
        await client.connect()
        const db = client.db('pesto')
        result = await db.collection<Task>('tasks').insertOne(newTask)
    } catch (error) {
        return next(new HttpError('Could not add task.', 500))
    }
    client.close()

    return res.status(200).json({ id: result.insertedId, message: 'Successfully added task.' })
})

router.get('/task', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.status) return next(new HttpError('Query Parameter status required.', 400))
        
    const status: Status | 'All' = req.query.status as Status | 'All'

    const client = new MongoClient(url)
    let result: Task[]

    try {
        await client.connect()
        const db = client.db('pesto')
        if (status === 'All') result = await db.collection<Task>('tasks').find({}).toArray()
        else result = await db.collection<Task>('tasks').find({ status: status }).toArray()
    } catch (error) {
        return next(new HttpError('Could not get tasks.', 500))
    }
    client.close()

    return res.status(200).json(result)
})

router.put('/task/:id', async(req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) return next(new HttpError('Parameter id required.', 400))

    const client = new MongoClient(url)
    try {
        await client.connect()
        const db = client.db('pesto')
        const task = await db.collection<Task>('tasks').findOne({ _id: new ObjectId(req.params.id) }) as Task
        if (!task) return next(new HttpError(`Invalid ID: ${req.params.id} does not exist.`, 400))
        await db.collection<Task>('tasks').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { 
            title: req.body.title ? req.body.title : task.title,
            status: req.body.status? req.body.status : task.status,
            description: req.body.description ? req.body.description : task.description
        }})
    } catch (error) {
        return next(new HttpError('Could not update task.', 500))
    }
    client.close()

    return res.status(200).json({ id: req.params.id, message: 'Successfully updated task.' })
})

router.delete('/task/:id', async(req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) return next(new HttpError('Parameter id required.', 400))

    const client = new MongoClient(url)
    try {
        await client.connect()
        const db = client.db('pesto')
        await db.collection<Task>('tasks').deleteOne({ _id: new ObjectId(req.params.id) })
    } catch (error) {
        return next(new HttpError('Could not delete task.', 500))
    }
    client.close()

    return res.status(200).json({ id: req.params.id, message: 'Successfully deleted task.' })
})

export default router
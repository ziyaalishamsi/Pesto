import express, { NextFunction, Request, Response } from 'express'
import router from './router'
import { json } from 'body-parser'
import { HttpError } from './models'

const app = express()

app.use(json())

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

    next()
})

app.use(router)

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({ message: err.message || 'An unknown error occured.'})
})

app.listen(8000, '127.0.0.1', () => {
    console.log('My server is running on port 8000')
})
import React, { useEffect, useState } from "react"
import { Status, Task } from "../models"
import Card from "./Card.tsx"
import './Tasks.css'
import Loader from "./Loader.tsx"

interface TasksProps {
    update(task: Task, openDialog: boolean): void
    status: Status | 'All'
    reload: boolean
}

const Tasks: React.FC<TasksProps> = props => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [tasks, setTasks] = useState<Task[]>([])

    const getTasks = async () => {
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:8000/task?status=${props.status}`)
            const responseData = await response.json()
            if(!response.ok) throw new Error(responseData.message)
            setTasks(responseData)
        } catch (error) {
            setError(error.message)
        }
        setLoading(false)
    }
    useEffect(() => {
        getTasks()
    }, [props.status, props.reload, tasks])

    const deleteTask = async (task: Task) => {
        setLoading(true)
        try {
            await fetch(`http://localhost:8000/task/${task._id}`, {method: 'DELETE'})
            setTasks(tasks.filter(el => el._id !== task._id))
        } catch (error) {
            setError(error.message)
        }
        setLoading(false)
    }

    return (
    <React.Fragment>
        {loading && <Loader />}
        {!loading && error.length && <Card title={error}/>}
        {!loading && !error.length && !tasks.length && <Card title="No Tasks Created"/>}
        {!loading && !error.length && tasks.map(task => <Card key={task._id} task={task} update={props.update.bind(null, task, false)} delete={deleteTask}/>)}
    </React.Fragment>)
}

export default Tasks
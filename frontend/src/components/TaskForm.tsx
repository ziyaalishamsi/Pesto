import React, { useState } from "react"
import './TaskForm.css'
import { Status, Task } from "../models"

interface TaskFormProps {
    open: boolean
    task?: Task
    close(): void
    update(): void
}

const TaskForm: React.FC<TaskFormProps> = props => {
    const [title, setTitle] = useState(props.task ? props.task.title : '')
    const [status, setStatus] = useState<Status>(props.task ? props.task.status : 'To Do')
    const [description, setDescription] = useState(props.task ? props.task.description : '')
    const [error, setError] = useState('')

    const changeTitle = event => {
        setTitle(event.target.value)
    }

    const changeDescrition = event => {
        setDescription(event.target.value)
    }
    
    const changeStatus = event => {
        setStatus(event.target.value)
    }

    const submit = async () => {
        try {
            await fetch(`http://localhost:8000/task${props.task ? `/${props.task._id}` : ''}`, {
                method: props.task ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    status,
                    description
                })
            })
        } catch (error) {
            setError(error.message)
        }
        if(!error.length) props.update()
    }

    return <dialog open={props.open} className="taskDialog">
        <div className="taskForm">
            <input
                id='title'
                type='text'
                placeholder='Title'
                value={title}
                onChange={changeTitle}
            />
            <select name="formStatus" id="formStatus" className="formStatus" onChange={changeStatus} value={status}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>
            <textarea
                id='description'
                rows={6}
                placeholder='Description'
                value={description}
                onChange={changeDescrition}
            />
            <div className="actions">
                <button className="actionButton" disabled={!title.length} onClick={submit}>{props.task ? 'Update Task' : 'Add Task'}</button>
                <button className="actionButton" onClick={props.close}>Cancel</button>
            </div>
        </div>
    </dialog>
}

export default TaskForm
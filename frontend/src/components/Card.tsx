import React from "react"
import { Task } from "../models"
import Icon from "@mdi/react"
import { mdiDelete } from "@mdi/js"
import './Card.css'

interface CardProps {
    title?: string
    task?: Task
    update?(task: Task): void
    delete?(task: Task): void
}

const Card: React.FC<CardProps> = props => {
    return <div className="card" onClick={props.update && props.update.bind(null, props.task, true)}>
        <div className="container">
            <p className="taskStatus">{props.task ? props.task.status : ''}</p>
            <h4><b>{props.task ? props.task.title : props.title || 'No Tasks Created'}</b></h4>
            <button className="deleteButton" onClick={props.delete && props.delete.bind(null, props.task, false)}>
                {props.task && <Icon
                    color="red"
                    path={mdiDelete}
                    size={1}
                />}
            </button>
        </div>
    </div>
}

export default Card
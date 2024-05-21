import './Header.css'
import React, { useState } from "react"
import Icon from '@mdi/react'
import { mdiPlus } from '@mdi/js'
import { Status } from '../models'

interface HeaderProps {
    addTask(): void
    filterStatus(status: Status | 'All'): void
}

const Header: React.FC<HeaderProps> = props => {

    const [status, setStatus] = useState<Status | 'All'>('All')

    const changeStatus = event => {
        setStatus(event.target.value)
        props.filterStatus(event.target.value)
    }

    return <header className="header">
        <select name="status" id="status" className='addStatus' value={status} onChange={changeStatus}>
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
        </select>    
        <h1 className='addTitle'>Tasks</h1>
        <button className="addButton" onClick={props.addTask}>
            <Icon 
                path={mdiPlus}
                size={0.7}
                color="black"
                className='addIcon'
            />
            Add Task
        </button>
    </header>
}

export default Header
import React, { useState } from 'react'
import Header from './components/Header.tsx'
import Tasks from './components/Tasks.tsx'
import TaskForm from './components/TaskForm.tsx'
import { Task, Status } from './models.ts'

const App: React.FC = () => {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined)
  const [currentStatus, setCurrentStatus] = useState<Status | 'All'>('All')
  const [reload, setReload] = useState(false)

  const openDialog = () => {
    setShowTaskForm(true)
  }

  const closeDialog = () => {
    setShowTaskForm(false)
  }

  const updateTask = (task: Task, openDialog: boolean) => {
    if (openDialog) {
      setCurrentTask(task)
      setShowTaskForm(true)
    }
  }

  const filterTasks = (status: Status | 'All') => {
    setCurrentStatus(status)
  }

  const reloadTasks = () => {
    setShowTaskForm(false)
    setCurrentTask(undefined)
    setReload(!reload)
  }

  return <React.Fragment>
    <Header addTask={openDialog} filterStatus={filterTasks}/>
    {showTaskForm && <TaskForm open={showTaskForm} task={currentTask} close={closeDialog} update={reloadTasks}/>}
    <Tasks update={updateTask} status={currentStatus} reload={reload}/>
  </React.Fragment>
}

export default App;

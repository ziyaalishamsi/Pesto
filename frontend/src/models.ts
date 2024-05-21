export type Status = 'To Do' | 'Done' | 'In Progress'

export interface Task {
    _id: string,
    title: string,
    status: Status,
    description: string
}
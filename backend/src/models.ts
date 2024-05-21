export type Status = 'To Do' | 'In Progress' | 'Done'

export interface Task {
    title: string,
    status: Status,
    description: { type: String, required: false}
}

export class HttpError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}
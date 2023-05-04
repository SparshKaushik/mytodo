export interface fauth_t {
    uid: string,
    displayName: string | null,
    email: string | null,
    emailVerified: boolean,
    profile: string | null
}

export interface task_t {
    name: string,
    description: string,
    status: string,
    createdAt: number,
}

export enum taskStatus {
    ToDo = 'todo',
    Doing = 'doing',
    Done = 'done'
}

export interface task_t {
	id: string;
	name: string;
	description: string;
	status: string;
	createdAt: Date;
}

export enum taskStatus {
	ToDo = 'todo',
	Doing = 'doing',
	Done = 'done'
}

export interface modalStore_t {
	component: any;
	props: any;
	isLoading: boolean;
}

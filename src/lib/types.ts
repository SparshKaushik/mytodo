export interface task_t {
	id: string;
	name: string;
	description: string;
	status: string;
	createdAt: number;
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

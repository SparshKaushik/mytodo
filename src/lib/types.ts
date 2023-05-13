import type { Item } from "svelte-dnd-action";

export interface task_t {
	id: string;
	name: string;
	description: string;
	status: string;
	createdAt: Date;
	milestones?: milestone_t[];
}

export interface milestone_t {
	name: string;
	status: taskStatus.ToDo | taskStatus.Done;
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

export interface taskList_t {
	todo: Item[];
	doing: Item[];
	done: Item[];
}
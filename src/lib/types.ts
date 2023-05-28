import type { Item } from 'svelte-dnd-action';

export interface user_t {
	id: string;
	name: string;
	folders: folder_t[];
}

export interface task_t {
	id: string;
	name: string;
	description: string;
	status: string;
	createdAt: Date;
	milestones?: milestone_t[];
	folder: string;
}

export interface milestone_t {
	name: string;
	status: taskStatus.ToDo | taskStatus.Done;
}

export interface newmilestone_t {
	name: string | undefined;
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

export interface folder_t {
	icon: string;
	name: string;
}
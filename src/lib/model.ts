import { supabase } from '../supabase';
import { taskStatus, type task_t } from './types';
import { isSaving, toDoStore } from './stores';
import { closeModal } from './utils';

export const taskHandlers = {
	getTasks: (user_id: string) => {
		supabase
			.from('tasks')
			.select('*')
			.eq('owner', user_id)
			.then((data) => {
				console.log(data);
				let tasks: task_t[] = [];
				data.data?.forEach((task) => {
					tasks = [
						...tasks,
						{
							id: task.id,
							name: task.name,
							description: task.desc,
							status: task.status,
							createdAt: task.created_at
						}
					];
				});
				toDoStore.set(tasks);
			});
	},
	updateTaskStatus: (id: string, status: taskStatus) => {
		isSaving.set(true);
		toDoStore.update((tasks) => {
			return tasks.map((task) => {
				if (task.id === id) {
					return {
						...task,
						status
					};
				}
				return task;
			});
		});
		supabase
			.from('tasks')
			.update({ status })
			.eq('id', id)
			.then((data) => {
				console.log(data);
			});
		isSaving.set(false);
		setTimeout(() => {
			isSaving.set(null);
		}, 1000);
	},
	addTask: (name: string, description: string, user_id: string) => {
		isSaving.set(true);
		supabase
			.from('tasks')
			.insert({
				name,
				desc: description,
				owner: user_id,
				status: taskStatus.ToDo
			})
			.then(() => {
				taskHandlers.getTasks(user_id);
				closeModal();
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
	},
	deleteTask: (id: string, user_id: string) => {
		isSaving.set(true);
		supabase
			.from('tasks')
			.delete()
			.eq('id', id)
			.eq('owner', user_id)
			.then(() => {
				taskHandlers.getTasks(user_id);
				closeModal();
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
	},
	updateTaskDescription: (id: string, description: string, user_id: string) => {
		isSaving.set(true);
		toDoStore.update((tasks) => {
			return tasks.map((task) => {
				if (task.id === id) {
					return {
						...task,
						description
					};
				}
				return task;
			});
		});
		supabase
			.from('tasks')
			.update({ desc: description })
			.eq('id', id)
			.then((data) => {
				console.log(data);
			});
		isSaving.set(false);
		setTimeout(() => {
			isSaving.set(null);
		}, 1000);
	}
};

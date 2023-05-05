import { supabase } from '../supabase';
import type { taskStatus, task_t } from './types';
import { isSaving, toDoStore } from './stores';

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
	updateTask: (id: string, status: taskStatus) => {
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
	}
};

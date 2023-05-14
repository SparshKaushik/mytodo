import { supabase } from '../supabase';
import { taskStatus, type milestone_t, type task_t, type newmilestone_t } from './types';
import { isSaving, toDoStore } from './stores';
import { closeModal } from './utils';

export const taskHandlers = {
	getTasks: (user_id: string) => {
		supabase
			.from('tasks')
			.select('*')
			.eq('owner', user_id)
			.then((data) => {
				let tasks: task_t[] = [];
				data.data?.forEach((task) => {
					tasks = [
						...tasks,
						{
							id: task.id,
							name: task.name,
							description: task.desc,
							status: task.status,
							createdAt: new Date(task.created_at)
						}
					];
				});
				tasks.sort((a, b) => {
					return b.createdAt.getTime() - a.createdAt.getTime();
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
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
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
		description = description.trim();
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
			.then(() => {
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
	},
	addMilestone: (milestones: milestone_t[], milestone: newmilestone_t, id: string) => {
		if (milestone.name === undefined || milestone.name.trim() === '')
			return milestones;
		const updatedmilestones = [ ...milestones, {
			name: milestone.name as string,
			status: taskStatus.ToDo
		}];
		supabase.from('tasks').update({ milestones: updatedmilestones }).eq('id', id).then(() => {
			isSaving.set(false);
			setTimeout(() => {
				isSaving.set(null);
			}, 1000);
		});
		return updatedmilestones;
	},
	toggleMileStoneStatus: (milestones: milestone_t[], milestone: milestone_t, id: string) => {
		const updatedmilestones = milestones.map((m) => {
			if (m.name === milestone.name) {
				return {
					...m,
					status: m.status === taskStatus.Done ? taskStatus.ToDo : taskStatus.Done
				};
			}
			return m;
		});
		supabase.from('tasks').update({ milestones: updatedmilestones }).eq('id', id).then(() => {
			isSaving.set(false);
			setTimeout(() => {
				isSaving.set(null);
			}, 1000);
		});
		return updatedmilestones;
	},
	deleteMilestone: (milestones: milestone_t[], milestone: milestone_t, id: string) => {
		const updatedmilestones = milestones.filter((m) => m.name !== milestone.name);
		supabase.from('tasks').update({ milestones: updatedmilestones }).eq('id', id).then(() => {
			isSaving.set(false);
			setTimeout(() => {
				isSaving.set(null);
			}, 1000);
		});
		return updatedmilestones;
	}
};

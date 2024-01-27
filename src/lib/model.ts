import { supabase } from '../supabase';
import {
	taskStatus,
	type milestone_t,
	type task_t,
	type newmilestone_t,
	type folder_t
} from './types';
import { folderStore, isLoading, isSaving, toDoStore, userStore } from './stores';
import { closeModal } from './utils';
import toast from 'svelte-french-toast';
import { goto } from '$app/navigation';

export const taskHandlers = {
	getTasks: (user_id: string, folder: string) => {
		supabase
			.from('tasks')
			.select('*')
			.eq('owner', user_id)
			.eq('folder', folder)
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
							createdAt: new Date(task.created_at),
							folder: task.folder
						}
					];
				});
				tasks.sort((a, b) => {
					return b.createdAt.getTime() - a.createdAt.getTime();
				});
				toDoStore.set(tasks);
				isLoading.set(false);
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
	addTask: (name: string, description: string, user_id: string, folder: string) => {
		isSaving.set(true);
		supabase
			.from('tasks')
			.insert({
				name,
				desc: description,
				owner: user_id,
				status: taskStatus.ToDo,
				folder
			})
			.then(() => {
				taskHandlers.getTasks(user_id, folder);
				closeModal();
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
	},
	deleteTask: (id: string, user_id: string, folder: string) => {
		isSaving.set(true);
		supabase
			.from('tasks')
			.delete()
			.eq('id', id)
			.eq('owner', user_id)
			.then(() => {
				taskHandlers.getTasks(user_id, folder);
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
		if (milestone.name === undefined || milestone.name.trim() === '') return milestones;
		const updatedmilestones = [
			...milestones,
			{
				name: milestone.name as string,
				status: taskStatus.ToDo
			}
		];
		supabase
			.from('tasks')
			.update({ milestones: updatedmilestones })
			.eq('id', id)
			.then(() => {
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
		supabase
			.from('tasks')
			.update({ milestones: updatedmilestones })
			.eq('id', id)
			.then(() => {
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
		return updatedmilestones;
	},
	moveMilestoneUp: (milestones: milestone_t[], milestone: milestone_t, id: string) => {
		const index = milestones.findIndex((m) => m.name === milestone.name);
		if (index === 0) return milestones;
		const updatedmilestones = [...milestones];
		updatedmilestones[index] = updatedmilestones[index - 1];
		updatedmilestones[index - 1] = milestone;
		supabase
			.from('tasks')
			.update({ milestones: updatedmilestones })
			.eq('id', id)
			.then(() => {
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
		return updatedmilestones;
	},
	moveMilestoneDown: (milestones: milestone_t[], milestone: milestone_t, id: string) => {
		const index = milestones.findIndex((m) => m.name === milestone.name);
		if (index === milestones.length - 1) return milestones;
		const updatedmilestones = [...milestones];
		updatedmilestones[index] = updatedmilestones[index + 1];
		updatedmilestones[index + 1] = milestone;
		supabase
			.from('tasks')
			.update({ milestones: updatedmilestones })
			.eq('id', id)
			.then(() => {
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
		return updatedmilestones;
	},
	deleteMilestone: (milestones: milestone_t[], milestone: milestone_t, id: string) => {
		const updatedmilestones = milestones.filter((m) => m.name !== milestone.name);
		supabase
			.from('tasks')
			.update({ milestones: updatedmilestones })
			.eq('id', id)
			.then(() => {
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
		return updatedmilestones;
	},
	changeFolder: (folder: string, id: string, user_id: string) => {
		isSaving.set(true);
		supabase
			.from('tasks')
			.update({ folder })
			.eq('id', id)
			.eq('owner', user_id)
			.then(() => {
				taskHandlers.getTasks(user_id, folder);
				closeModal();
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
	}
};

export const userHandlers = {
	getUserData: (user_id: string, metadata: any) => {
		supabase
			.from('users')
			.select('*')
			.eq('id', user_id)
			.then((data) => {
				if (data.data) {
					const user = data.data[0];
					userStore.set({
						id: user.id,
						name: user.name,
						folders: user.folders
					});
				} else {
					metadata &&
						supabase
							.from('users')
							.insert({ id: user_id, name: metadata.name ? metadata.name : '' });
				}
			});
	}
};

export const folderHandlers = {
	addFolder: (name: string, folders: folder_t[], user_id: string) => {
		isSaving.set(true);
		supabase
			.from('users')
			.update({
				folders: JSON.stringify([
					...folders,
					{
						icon: '📁',
						name
					}
				])
			})
			.eq('id', user_id)
			.then(() => {
				userHandlers.getUserData(user_id, null);
				closeModal();
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
	},
	deleteFolder: (name: string, folders: folder_t[], user_id: string) => {
		folders = folders.filter((f) => f.name !== name);
		isSaving.set(true);
		supabase
			.from('users')
			.update({ folders: JSON.stringify(folders) })
			.eq('id', user_id)
			.then(() => {
				if (folders.length > 0) {
					folderStore.set(folders[0].name);
				}
				userHandlers.getUserData(user_id, null);
				closeModal();
				isSaving.set(false);
				setTimeout(() => {
					isSaving.set(null);
				}, 1000);
			});
		supabase.from('tasks').delete().eq('folder', name);
	}
};

export const authHandlers = {
	login: async (email: string, password: string) => {
		await supabase.auth
			.signInWithPassword({
				email: email,
				password: password
			})
			.catch((error) => {
				console.log(error);
			});
	},
	register: async (name: string, email: string, password: string) => {
		await supabase.auth
			.signUp({
				email: email,
				password: password,
				options: {
					data: {
						name: name
					}
				}
			})
			.then((user) => {
				toast.success('Account created successfully');
				toast.success('Please check your email for verification');
				supabase
					.from('users')
					.insert({
						id: user.data.user?.id,
						name: name,
						folders: JSON.stringify(['/'])
					})
					.then(() => {
						goto('/login');
					});
			})
			.catch((error) => {
				console.log(error);
			});
	},
	logout: async () => {
		await supabase.auth.signOut();
		localStorage.clear();
		window.location.reload();
	}
};

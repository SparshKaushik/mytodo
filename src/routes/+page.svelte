<script lang="ts">
	import './page.scss';

	import { dndzone, type Item } from 'svelte-dnd-action';
	import { goto } from '$app/navigation';
	import { authStore, folderStore, isEditing, isLoading, modalStore, toDoStore } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';
	import NavBar from '../components/NavBar.svelte';
	import { flip } from 'svelte/animate';
	import { taskHandlers } from '$lib/model';
	import { taskStatus, type taskList_t, type modalStore_t } from '$lib/types';
	import TaskView from '../components/modals/TaskView.svelte';
	import { visualDate } from '$lib/utils';
	import Folders from '../components/modals/Folders.svelte';
	import { supabase } from '../supabase';
	import Resetpwd from '../components/modals/Resetpwd.svelte';

	const flipDurationMs = 300;
	const dropTargetStyle = {};
	let modal: modalStore_t | null, isediting: boolean;

	let taskList: taskList_t = {
		todo: [],
		doing: [],
		done: []
	};

	$: taskList.todo = $toDoStore
		.filter((task) => task.status === taskStatus.ToDo)
		.map((task) => {
			return { id: task.id, name: task.name };
		});
	$: taskList.doing = $toDoStore
		.filter((task) => task.status === taskStatus.Doing)
		.map((task) => {
			return { id: task.id, name: task.name };
		});
	$: taskList.done = $toDoStore
		.filter((task) => task.status === taskStatus.Done)
		.map((task) => {
			return { id: task.id, name: task.name };
		});

	$: modal = $modalStore;
	$: isediting = $isEditing;

	let tasksChannel: any;

	$: if ($folderStore) {
		isLoading.set(true);
		$authStore && taskHandlers.getTasks($authStore.user.id, $folderStore);
		tasksChannel && tasksChannel.unsubscribe();
		tasksChannel = supabase
			.channel('table-filter-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'tasks',
					filter: `owner=eq.${$authStore?.user.id}`
				},
				() => taskHandlers.getTasks($authStore?.user.id!, $folderStore)
			)
			.subscribe();
	}

	onMount(() => {
		setTimeout(() => {
			$authStore ? isLoading.set(false) : goto('/login');
			$authStore?.user.id && taskHandlers.getTasks($authStore.user.id, $folderStore);
		}, 0);
		window &&
			document.addEventListener('keypress', (e) => {
				if (e.key === '/') {
					const activeElement = document.activeElement;
					if (
						// @ts-ignore
						activeElement?.contentEditable !== 'true' &&
						activeElement?.tagName !== 'INPUT' &&
						activeElement?.tagName !== 'TEXTAREA' &&
						!isediting &&
						!modal
					) {
						modalStore.set({
							component: Folders,
							props: {
								isStandalone: true
							},
							isLoading: false
						});
					}
				}
			});
	});

	onDestroy(() => {
		tasksChannel.unsubscribe();
	});

	function handleConsider(e: { detail: { items: Item[] } }, status: taskStatus) {
		if (status === taskStatus.ToDo) {
			taskList.todo = e.detail.items;
		} else if (status === taskStatus.Doing) {
			taskList.doing = e.detail.items;
		} else if (status === taskStatus.Done) {
			taskList.done = e.detail.items;
		}
	}
	function handleFinalize(e: { detail: { items: Item[] } }, status: taskStatus) {
		e.detail.items.forEach((item) => {
			let thisTask = $toDoStore.find((task) => task.id === item.id);
			thisTask?.status !== status && taskHandlers.updateTaskStatus(item.id, status);
		});
		handleConsider(e, status);
	}

	function getDateTime(id: string) {
		return $toDoStore.find((task) => task.id === id)?.createdAt || '';
	}
</script>

<NavBar />
<section class="main">
	{#each [taskStatus.ToDo, taskStatus.Doing, taskStatus.Done] as status}
		<div class="todolist">
			<div class="heading">{status}</div>
			<section
				class="tasks"
				use:dndzone={{ items: taskList[status], dropTargetStyle: dropTargetStyle }}
				on:consider={(e) => handleConsider(e, status)}
				on:finalize={(e) => handleFinalize(e, status)}
			>
				{#each taskList[status] as item (item.id)}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="task"
						animate:flip={{ duration: flipDurationMs }}
						on:click={() => {
							modalStore.set({
								component: TaskView,
								props: { taskId: item.id },
								isLoading: true
							});
						}}
					>
						<div class="details">
							<span class="name">{item.name}</span>
							<span class="created">{visualDate(new Date(getDateTime(item.id)))}</span>
						</div>
					</div>
				{/each}
			</section>
		</div>
	{/each}
</section>

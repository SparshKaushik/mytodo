<script lang="ts">
	import './page.scss';

	import { dndzone, type Item } from 'svelte-dnd-action';
	import { goto } from '$app/navigation';
	import { authStore, isLoading, modalStore, toDoStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import NavBar from '../components/NavBar.svelte';
	import { flip } from 'svelte/animate';
	import { taskHandlers } from '$lib/model';
	import { taskStatus } from '$lib/types';
	import TaskView from '../components/modals/TaskView.svelte';
	import { visualDate } from '$lib/utils';

	let toDo: Item[], doing: Item[], done: Item[];
	const flipDurationMs = 300;
	const dropTargetStyle = {};

	$: toDo = $toDoStore
		.filter((task) => task.status === taskStatus.ToDo)
		.map((task) => {
			return { id: task.id, name: task.name };
		});
	$: doing = $toDoStore
		.filter((task) => task.status === taskStatus.Doing)
		.map((task) => {
			return { id: task.id, name: task.name };
		});
	$: done = $toDoStore
		.filter((task) => task.status === taskStatus.Done)
		.map((task) => {
			return { id: task.id, name: task.name };
		});

	onMount(() => {
		$authStore ? isLoading.set(false) : goto('/login');
	});

	function handleConsider(e: { detail: { items: Item[] } }, status: taskStatus) {
		if (status === taskStatus.ToDo) {
			toDo = e.detail.items;
		} else if (status === taskStatus.Doing) {
			doing = e.detail.items;
		} else if (status === taskStatus.Done) {
			done = e.detail.items;
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
		return $toDoStore.find(task => task.id === id)?.createdAt || '';
	}

	onMount(() => {
		$authStore?.user.id && taskHandlers.getTasks($authStore.user.id);
	});
</script>

<NavBar />
<section class="main">
	<div class="todolist">
		<div class="heading">ToDo</div>
		<section
			class="tasks"
			use:dndzone={{ items: toDo, dropTargetStyle: dropTargetStyle }}
			on:consider={(e) => handleConsider(e, taskStatus.ToDo)}
			on:finalize={(e) => handleFinalize(e, taskStatus.ToDo)}
		>
			{#each toDo as item (item.id)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="task" animate:flip={{ duration: flipDurationMs }} on:click={
					() => {
						modalStore.set({
							component: TaskView,
							props: { taskId: item.id },
							isLoading: true
						})
					}
				}>
					<div class="details">
						<span class="name">{item.name}</span>
						<span class="created">{visualDate(new Date(getDateTime(item.id)))}</span>
					</div>
				</div>
			{/each}
		</section>
	</div>
	<div class="todolist">
		<div class="heading">Doing</div>
		<section
			class="tasks"
			use:dndzone={{ items: doing, dropTargetStyle }}
			on:consider={(e) => handleConsider(e, taskStatus.Doing)}
			on:finalize={(e) => handleFinalize(e, taskStatus.Doing)}
		>
			{#each doing as item (item.id)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="task" animate:flip={{ duration: flipDurationMs }} on:click={
					() => {
						modalStore.set({
							component: TaskView,
							props: { taskId: item.id },
							isLoading: true
						})
					}
				}>
					<div class="details">
						<span class="name">{item.name}</span>
						<span class="created">13th Bruh 2022</span>
					</div>
				</div>
			{/each}
		</section>
	</div>
	<div class="todolist">
		<div class="heading">Done</div>
		<section
			class="tasks"
			use:dndzone={{ items: done, dropTargetStyle }}
			on:consider={(e) => handleConsider(e, taskStatus.Done)}
			on:finalize={(e) => handleFinalize(e, taskStatus.Done)}
		>
			{#each done as item (item.id)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="task" animate:flip={{ duration: flipDurationMs }} on:click={
					() => {
						modalStore.set({
							component: TaskView,
							props: { taskId: item.id },
							isLoading: true
						})
					}
				}>
					<div class="details">
						<span class="name">{item.name}</span>
						<span class="created">13th Bruh 2022</span>
					</div>
				</div>
			{/each}
		</section>
	</div>
</section>

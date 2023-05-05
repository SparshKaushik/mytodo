<script lang="ts">
	import './page.scss';

	import { dndzone, type Item } from 'svelte-dnd-action';
	import { goto } from '$app/navigation';
	import { authStore, isLoading, modalStore, toDoStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import NavBar from '../components/NavBar.svelte';
	import IconButton from '../components/IconButton.svelte';
	import { flip } from 'svelte/animate';
	import { taskHandlers } from '$lib/model';
	import { taskStatus } from '$lib/types';

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
			thisTask?.status !== status && taskHandlers.updateTask(item.id, status);
		});
		handleConsider(e, status);
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
			on:consider={e => handleConsider(e, taskStatus.ToDo)}
			on:finalize={e => handleFinalize(e, taskStatus.ToDo)}
		>
			{#each toDo as item (item.id)}
				<div class="task" animate:flip={{ duration: flipDurationMs }}>
					<div class="details">
						<span class="name">{item.name}</span>
						<span class="created">13th Bruh 2022</span>
					</div>
					<div class="actions">
						<IconButton>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</IconButton>
						<IconButton>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
							</svg>
						</IconButton>
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
			on:consider={e => handleConsider(e, taskStatus.Doing)}
			on:finalize={e => handleFinalize(e, taskStatus.Doing)}
		>
			{#each doing as item (item.id)}
				<div class="task" animate:flip={{ duration: flipDurationMs }}>
					<div class="details">
						<span class="name">{item.name}</span>
						<span class="created">13th Bruh 2022</span>
					</div>
					<div class="actions">
						<IconButton>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</IconButton>
						<IconButton>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
							</svg>
						</IconButton>
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
			on:consider={e => handleConsider(e, taskStatus.Done)}
			on:finalize={e => handleFinalize(e, taskStatus.Done)}
		>
			{#each done as item (item.id)}
				<div class="task" animate:flip={{ duration: flipDurationMs }}>
					<div class="details">
						<span class="name">{item.name}</span>
						<span class="created">13th Bruh 2022</span>
					</div>
					<div class="actions">
						<IconButton>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</IconButton>
						<IconButton>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
							</svg>
						</IconButton>
					</div>
				</div>
			{/each}
		</section>
	</div>
</section>

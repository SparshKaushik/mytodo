<script lang="ts">
	import './page.scss';

	import { dndzone, type Item } from 'svelte-dnd-action';
	import { goto } from '$app/navigation';
	import { authStore, isLoading, modalStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import NavBar from '../components/NavBar.svelte';
	import IconButton from '../components/IconButton.svelte';
	import { flip } from 'svelte/animate';

	let toDo: Item[], doing: Item[], done: Item[];
	const flipDurationMs = 300;
	const dropTargetStyle = {};

	toDo = [
		{ id: 1, name: 'Task 1' },
		{ id: 2, name: 'Task 2' }
	];
	doing = [
		{ id: 1, name: 'Task 1' },
		{ id: 2, name: 'Task 2' }
	];
	done = [
		{ id: 1, name: 'Task 1' },
		{ id: 2, name: 'Task 2' }
	];

	onMount(() => {
		$authStore ? isLoading.set(false) : goto('/login');
	});

	function handletoDO(e: { detail: { items: Item[] } }) {
		toDo = e.detail.items;
	}
	function handledoing(e: { detail: { items: Item[] } }) {
		doing = e.detail.items;
	}
	function handledone(e: { detail: { items: Item[] } }) {
		done = e.detail.items;
	}
</script>

<NavBar />
<section class="main">
	<div class="todolist">
		<div class="heading">ToDo</div>
		<section
			class="tasks"
			use:dndzone={{ items: toDo, dropTargetStyle: dropTargetStyle }}
			on:consider={handletoDO}
			on:finalize={handletoDO}
		>
			{#each toDo as item (item.id)}
				<div class="task" animate:flip={{ duration: flipDurationMs }}>
					<div class="details">
						<span class="name">{item.name}</span>
						<!-- <span class="description"></span> -->
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
		<div class="heading">ToDo</div>
		<section
			class="tasks"
			use:dndzone={{ items: doing, dropTargetStyle }}
			on:consider={handledoing}
			on:finalize={handledoing}
		>
			{#each doing as item (item.id)}
				<div class="task" animate:flip={{ duration: flipDurationMs }}>
					<div class="details">
						<span class="name">{item.name}</span>
						<!-- <span class="description"></span> -->
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
		<div class="heading">ToDo</div>
		<section
			class="tasks"
			use:dndzone={{ items: done, dropTargetStyle }}
			on:consider={handledone}
			on:finalize={handledone}
		>
			{#each done as item (item.id)}
				<div class="task" animate:flip={{ duration: flipDurationMs }}>
					<div class="details">
						<span class="name">{item.name}</span>
						<!-- <span class="description"></span> -->
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

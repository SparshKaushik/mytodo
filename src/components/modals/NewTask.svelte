<script lang="ts">
	import { taskHandlers } from '$lib/model';
	import { authStore, folderStore } from '$lib/stores';
	import { closeModal } from '$lib/utils';
	import IconButton from '../IconButton.svelte';
	import Input from '../Input.svelte';

	let name: string, desc: string;
</script>

<div class="header">
	<span class="heading"> New Task </span>
	<IconButton on:click={closeModal}>
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	</IconButton>
</div>
<div class="body">
	<div class="form">
		<Input type="text" placeholder="Task Name" bind:inputValue={name} />
		<Input type="textarea" placeholder="Description" bind:inputValue={desc} />
	</div>
	<div class="bottom">
		<button
			on:click={() => {
				$authStore?.user.id && taskHandlers.addTask(name, desc, $authStore?.user.id, $folderStore);
			}}>Add</button
		>
	</div>
</div>

<style lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 0.5rem;

		.heading {
			font-size: 1.1rem;
			font-weight: 600;
			line-height: 1.25rem;
		}
	}

	.body {
		height: 100%;

		display: flex;
		flex-direction: column;

		padding: 0.5rem;
		gap: 1rem;
		overflow: auto;

		:global(.input) {
			min-height: inherit;
			border: 1px solid #a0a0a0;
		}

		.form {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		.bottom {
			align-self: center;

			button {
				font-size: 0.9rem;
				padding: 0.75rem 1.5rem;
			}
		}
	}
</style>

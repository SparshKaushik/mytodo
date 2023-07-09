<script lang="ts">
	import IconButton from './IconButton.svelte';

	export let type: string = 'text';
	export let placeholder: string | null;
	export let inputValue: any;
	export let inputNode: HTMLInputElement | HTMLTextAreaElement | null = null;

	export let onEnter: () => void = () => {
		return;
	};

	let isPasswordVisible: boolean = false;

	export function focusAction() {
		inputNode && inputNode.focus();
	}

	function typeAction(node: HTMLInputElement) {
		if (type === 'password') node.type = isPasswordVisible ? 'text' : 'password';
		else node.type = type;
	}
</script>

<div class="input">
	<slot />
	{#if type !== 'textarea'}
		<input
			use:typeAction
			{placeholder}
			bind:value={inputValue}
			bind:this={inputNode}
			on:keypress={(e) => {
				if (e.key === 'Enter') {
					onEnter();
				}
			}}
		/>
	{:else}
		<textarea
			{placeholder}
			bind:value={inputValue}
			bind:this={inputNode}
			on:keypress={(e) => {
				if (e.key === 'Enter') {
					onEnter();
				}
			}}
		/>
	{/if}
	{#if type == 'password'}
		<IconButton
			on:click={() => {
				isPasswordVisible = !isPasswordVisible;
				// @ts-ignore
				typeAction(inputNode);
			}}
		>
			{#if isPasswordVisible}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
					<circle cx="12" cy="12" r="3" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M2 2L22 22" />
					<path
						d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
					/>
					<path
						d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
					/>
				</svg>
			{/if}
		</IconButton>
	{/if}
</div>

<style lang="scss">
	.input {
		display: flex;
		align-items: center;
		gap: 1rem;

		padding: 0px 20px;

		background-color: #1d1b20;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
		border-radius: 5px;

		input,
		textarea {
			width: 100%;
			height: inherit;

			background: transparent;
			outline: none;
			border: none;

			padding: 15px 0px;

			color: white;
			font-size: 1rem;
		}

		textarea {
			resize: vertical;
		}
	}
</style>

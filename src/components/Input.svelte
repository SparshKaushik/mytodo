<script lang="ts">
	export let type: string = 'text';
	export let placeholder: string | null;
	export let inputValue: any;
	export let inputNode: HTMLInputElement | HTMLTextAreaElement | null = null;
	export let onEnter: () => void = () => {
		return;
	};

	export function focusAction() {
		inputNode && inputNode.focus();
	}

	function typeAction(node: HTMLInputElement) {
		node.type = type;
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
</div>

<style lang="scss">
	.input {
		display: flex;
		align-items: center;

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

			padding: 15px 20px;

			color: white;
			font-size: 1rem;

			&:only-child {
				padding: 15px 0px;
			}
		}

		textarea {
			resize: vertical;
		}
	}
</style>

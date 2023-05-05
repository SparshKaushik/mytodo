<script lang="ts">
	export let type: string = 'text';
	export let placeholder: string | null;
	export let inputValue: any;

	function typeAction(node: HTMLInputElement) {
		node.type = type;
	}
</script>

<div class="input">
	<slot />
	<input use:typeAction {placeholder} bind:value={inputValue} />
</div>

<style lang="scss">
	.input {
		display: flex;
		align-items: center;

		padding: 0px 20px;

		background-color: #1d1b20;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		border-radius: 5px;

		input {
			width: 100%;

			background: transparent;
			outline: none;
			border: none;

			padding: 15px 20px;

			color: white;
			font-size: 1rem;
		}
	}
</style>

<script lang="ts">
	let className: string = "";
	export {className as class};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class={className}>
	<slot />
</div>

<style lang="scss">
	div {
		display: flex;
		align-items: center;
		justify-content: center;

		padding: 0rem 0.25rem;
		border-radius: 1rem;

		cursor: pointer;

		transition: all;
		transition-duration: 200ms;
	}
</style>

<script lang="ts">
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click>
	<slot />
</div>

<style lang="scss">
	div {
		display: flex;
		align-items: center;
		justify-content: center;

		padding: 0.25rem;
		border-radius: 1rem;

		cursor: pointer;

		transition: all;
		transition-duration: 200ms;

		&:hover {
			background-color: #36343b;
		}
	}
</style>

<script lang="ts">
	import { fly } from 'svelte/transition';

	let className = "";

	export { className as class }
</script>

<div in:fly={{ y: 5, duration: 200 }} out:fly={{ y: 5, duration: 200 }} class={className}>
	<slot />
</div>

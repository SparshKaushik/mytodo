<script lang="ts">
	import { fly } from 'svelte/transition';
</script>

<div in:fly={{ y: 5, duration: 200 }} out:fly={{ y: 5, duration: 200 }}>
	<slot />
</div>

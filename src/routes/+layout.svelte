<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '../supabase';
	import { authStore, isLoading } from '$lib/stores';
	import { Toaster } from 'svelte-french-toast';
	import './layout.scss';
	import Modal from '../components/modals/Modal.svelte';

	onMount(() => {
		supabase.auth.onAuthStateChange((event, session) => {
			authStore.set(session);
		});
	});
</script>

<Toaster />
<Modal />
<div id="root" class=" {$isLoading && 'isLoading'}">
	<slot />
</div>
{#if $isLoading}
	<div class="loading">
		<span class="loader" />
	</div>
{/if}

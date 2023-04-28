<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore, isLoading } from '$lib/stores';
	import { onMount } from 'svelte';
	import NavBar from '../components/NavBar.svelte';

	onMount(()=> {
		$authStore ? isLoading.set(false) : goto('/login');
	})
</script>

<NavBar />
<section class="" />

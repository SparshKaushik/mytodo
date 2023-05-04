<script lang="ts">
	import { onMount } from "svelte";
	import { supabase } from "../supabase";
	import { authStore, isLoading } from "$lib/stores";
	import { Toaster } from "svelte-french-toast";
    import "./layout.scss"

    onMount(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            authStore.set(session);
        });
    })
</script>

<Toaster />
<div id="root" class=" {$isLoading && "isLoading"}">
    <slot />
</div>
{#if $isLoading}
    <div class="loading">
        <span class="loader"></span>
    </div>
{/if}
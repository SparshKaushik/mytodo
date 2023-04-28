<script lang="ts">
	import { onMount } from "svelte";
	import { auth } from "../firebase";
	import { authStore, isLoading } from "$lib/stores";
	import { Toaster } from "svelte-french-toast";
    import "./layout.scss"

    onMount(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                authStore.set({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    profile: user.photoURL
                })
            }
        })
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
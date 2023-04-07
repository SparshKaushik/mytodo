<script lang="ts">
	import { onMount } from "svelte";
	import { auth } from "../firebase";
	import { authStore } from "$lib/stores";

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
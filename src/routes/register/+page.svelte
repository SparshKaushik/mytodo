<script lang="ts">
	import './page.scss';
	import { goto } from '$app/navigation';
	import { authStore, isLoading } from '$lib/stores';
	import Input from '../../components/Input.svelte';
	import Button from '../../components/Button.svelte';
	import toast from 'svelte-french-toast';
	import { authHandlers } from '$lib/model';

	$: if ($authStore) {
		goto('/');
	} else {
		isLoading.set(false);
	}
	isLoading.set(false);

	let name: string, email: string, password: string, cpassword: string;
</script>

<section class="register">
	<div class="registerContainer">
		<h2>Hallo !</h2>
		<Input type="text" placeholder="Full Name" bind:inputValue={name}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg
			>
		</Input>
		<Input type="email" placeholder="Email Address" bind:inputValue={email}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path
					d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
				/><polyline points="22,6 12,13 2,6" /></svg
			>
		</Input>
		<Input type="password" placeholder="Password" bind:inputValue={password}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path
					d="M7 11V7a5 5 0 0 1 10 0v4"
				/></svg
			>
		</Input>
		<Input type="password" placeholder="Confirm Password" bind:inputValue={cpassword}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path
					d="M7 11V7a5 5 0 0 1 10 0v4"
				/></svg
			>
		</Input>
		<div class="actions">
			<Button
				text="Register"
				on:click={async () => {
					if (password === cpassword) {
						await authHandlers.register(name, email, password);
					} else {
						toast.error("Your Passwords Doesn't Match");
					}
				}}
			/>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div>Already Have an Account ? <span on:click={() => goto('/login')}>Login</span></div>
		</div>
	</div>
</section>

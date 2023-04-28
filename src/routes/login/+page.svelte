<script lang="ts">
	import "./page.scss"
	
	import { goto } from "$app/navigation";
	import { authHandlers, authStore, isLoading } from "$lib/stores";
	import Input from "../../components/Input.svelte";
	import Button from "../../components/Button.svelte";
	import FlyIn from "../../components/Transitions/FlyIn.svelte";

	$: $authStore ? goto('/') : isLoading.set(false);

	let email: string, password: string;
</script>

<section class="login">
	<FlyIn>
		<form class="loginContainer">
			<h2>Hallo! Welcome Back</h2>
			<Input type="text" placeholder="Email Address" bind:inputValue={email}>
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
			<div class="actions">
				<Button
					text="Login"
					on:click={async () => {
						await authHandlers.login(email, password);
					}}
				/>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div>Don't Have an Account ? <span on:click={() => goto('/register')}>Register</span></div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div><span on:click={() => goto('/forgotpwd')}>Forgot Password</span></div>
			</div>
		</form>
	</FlyIn>
</section>
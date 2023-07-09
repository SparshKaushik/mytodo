<script lang="ts">
	import Input from '../../components/Input.svelte';
	import Button from '../../components/Button.svelte';
	import { authStore } from '$lib/stores';
	import { supabase } from '../../supabase';
	import toast from 'svelte-french-toast';
	import { closeModal } from '$lib/utils';

	let email: string, password: string, confirmPassword: string;
	let resetButtonMail: any;
</script>

<div class="loginContainer">
	<h2>Oops! Forgot Password?</h2>
	{#if $authStore}
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
			>
				<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
				<path d="M7 11V7a5 5 0 0 1 10 0v4" />
			</svg>
		</Input>
		<Input type="password" placeholder="Confirm Password" bind:inputValue={confirmPassword}>
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
			>
				<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
				<path d="M7 11V7a5 5 0 0 1 10 0v4" />
			</svg>
		</Input>
		<div class="actions">
			<Button
				text="Reset"
				on:click={async () => {
					if (password === confirmPassword) {
						if (password.length >= 8) {
							supabase.auth
								.updateUser({
									password
								})
								.then(() => {
									toast.success('Password Updated Successfully');
									closeModal();
								})
								.catch((err) => {
									toast.error(err.message);
								});
						} else {
							toast.error('Password must be at least 8 characters long');
						}
					} else {
						toast.error('Passwords do not match');
					}
				}}
			/>
		</div>
	{:else}
		<Input
			type="text"
			placeholder="Email Address"
			bind:inputValue={email}
			onEnter={() => {
				resetButtonMail.click();
			}}
		>
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
			>
				<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
				<polyline points="22,6 12,13 2,6" />
			</svg>
		</Input>
		<div class="actions">
			<Button
				text="Reset"
				bind:button={resetButtonMail}
				on:click={async () => {
					supabase.auth
						.resetPasswordForEmail(email, {
							redirectTo: 'https://kuchkare.vercel.app/login'
						})
						.then((e) => {
							if (e.error) {
								toast.error(e.error.message);
							} else {
								toast.success('Password Reset Email Sent Successfully');
								closeModal();
							}
						});
				}}
			/>
		</div>
	{/if}
</div>

<style lang="scss">
	.loginContainer {
		min-width: 30vw;

		background-color: #0f0d13;
		border-radius: 1rem;
		padding: 2rem;

		display: flex;
		flex-direction: column;
		gap: 2rem;

		h2 {
			padding: 0;
			margin: 0;
		}

		.actions {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10px;

			div {
				font-size: 0.9rem;
			}
		}
	}
</style>

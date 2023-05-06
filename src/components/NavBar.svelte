<script lang="ts">
	import { authStore, isSaving, modalStore } from '$lib/stores';
	import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui';
	import FlyIn from './Transitions/FlyIn.svelte';
	import Loader from './Loader.svelte';
	import NewTask from './modals/NewTask.svelte';
</script>

<div class="navbar">
	<div class="start">
		<div class="heading">My ToDo List</div>
		<div class="saving">
			{#if $isSaving}
				<Loader />
				Saving
			{:else if $isSaving === false}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
				Saved
			{/if}
		</div>
	</div>
	<div class="end">
		<button
			on:click={() => {
				modalStore.set({
					component: NewTask,
					props: {},
					isLoading: false
				});
			}}>New Task</button
		>
		<Popover style="position: relative;">
			<PopoverButton
				style="background: none;color: inherit;border: none;padding: 0;font: inherit;cursor: pointer;outline: inherit;"
			>
				<div class="profile">
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
						><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle
							cx="12"
							cy="7"
							r="4"
						/></svg
					>
					<div class="info">
						<span>{$authStore?.user.email}</span>
						<span>{$authStore?.user.last_sign_in_at}</span>
					</div>
				</div>
			</PopoverButton>
			<PopoverPanel style="position: absolute; z-index: 10;right: 0;">
				<FlyIn>
					<div class="popoverProfile">
						<div class="item">
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
								><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9" /></svg
							>
							<span>Logout</span>
						</div>
					</div>
				</FlyIn>
			</PopoverPanel>
		</Popover>
	</div>
</div>

<style lang="scss">
	.navbar {
		width: auto;

		background-color: #211f26;

		padding: 1rem 2rem;

		display: flex;
		align-items: center;
		justify-content: space-between;

		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

		.start {
			display: flex;
			align-items: center;

			gap: 1rem;

			div {
				display: flex;
				align-items: center;

				&.saving {
					display: flex;
					align-items: center;
					font-size: 0.75rem;

					gap: 0.5rem;

					svg {
						width: 1rem;
						height: 1rem;
					}
				}
			}

			.heading {
				font-size: 1.25rem;
			}
		}

		.end {
			height: 100%;

			display: flex;
			align-items: center;

			gap: 1rem;

			.profile {
				display: flex;
				align-items: center;
				gap: 1rem;

				// img {
				// 	width: auto;
				// 	height: 32px;
				// 	border-radius: 1rem;
				// }

				.info {
					width: 100%;

					display: flex;
					flex-direction: column;
					align-items: start;

					@media screen and (max-width: 768px) {
						display: none;
					}

					span {
						font-size: 0.75rem;
					}
				}
			}

			.popoverProfile {
				width: fit-content;
				margin-top: 0.5rem;

				display: flex;
				flex-direction: column;

				background-color: #2b2930;
				border-radius: 12px;
				box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

				.item {
					display: flex;
					gap: 1rem;

					padding: 0.75rem 1.5rem;

					cursor: pointer;

					transition: all;
					transition-duration: 300ms;

					&:not(:last-child) {
						border-bottom: solid 1px #938f99;

						&:hover {
							border-radius: 10px 10px 0 0;
						}
					}

					&:hover {
						background-color: rgba($color: #000000, $alpha: 0.2);
						border-radius: 0 0 10px 10px;
					}
				}
			}
		}
	}
</style>

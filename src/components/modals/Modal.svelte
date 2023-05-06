<script lang="ts">
	import { modalStore } from '$lib/stores';
	import { closeModal } from '$lib/utils';
	import { onMount } from 'svelte';
	import FlyIn from '../Transitions/FlyIn.svelte';
	import { fade } from 'svelte/transition';
	import Loader from '../Loader.svelte';

	let ModalComponent: any;

	modalStore.subscribe((value) => {
		ModalComponent = value?.component;
	});

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		});

		document.addEventListener('click', (e) => {
			if (e.target === document.querySelector('.ModalContainer')) {
				closeModal();
			}
		});
	});

	$: console.log($modalStore);
</script>

<div>
	{#if $modalStore}
		<div class="ModalContainer" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
			<FlyIn>
				<div class="Modal">
					{#if $modalStore?.isLoading}
						<div class="modal-loading">
							<Loader />
						</div>
					{/if}
					<div class="content {$modalStore.isLoading ? 'isloading' : ''}">
						<svelte:component this={ModalComponent} />
					</div>
				</div>
			</FlyIn>
		</div>
	{/if}
</div>

<style lang="scss">
	.ModalContainer {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 10;

		display: flex;
		align-items: center;
		justify-content: center;

		background-color: rgba($color: #000000, $alpha: 0.5);

		.Modal {
			width: 40vw;
			height: 50vh;

			background-color: #1d1b20;

			padding: 1rem;
			border-radius: 1rem;

			display: flex;
			flex-direction: column;

			.content {
				width: inherit;
				height: inherit;

				display: flex;
				flex-direction: column;
				gap: 1rem;

				&.isloading {
					display: none;
				}
			}

			.modal-loading {
				width: 100%;
				height: 100%;

				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>

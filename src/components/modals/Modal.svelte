<script lang="ts">
	import { modalStore } from "$lib/stores";
	import { closeModal } from "$lib/utils";
	import { onMount } from "svelte";

	let ModalComponent: any;

	modalStore.subscribe((value) => {
		ModalComponent = value?.component;
	});

	onMount(() => {
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				closeModal();
			}
		});

		document.addEventListener("click", (e) => {
			if (e.target === document.querySelector(".ModalContainer")) {
				closeModal();
			}
		});
	});
</script>

<div>
	{#if $modalStore}
		<div class="ModalContainer">
			<div class="Modal">
				<svelte:component this={ModalComponent} />
			</div>
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
			min-width: 40vw;
			min-height: 50vh;

			background-color: #1d1b20;

			padding: 1rem;
			border-radius: 1rem;

			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>

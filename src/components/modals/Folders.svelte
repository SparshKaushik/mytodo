<script lang="ts">
	import { onMount } from 'svelte';
	import IconButton from '../IconButton.svelte';
	import Input from '../Input.svelte';
	import { folderStore, isSaving, modalStore, userStore } from '$lib/stores';
	import { closeModal } from '$lib/utils';
	import { folderHandlers, taskHandlers } from '$lib/model';
	import type { folder_t } from '$lib/types';
	import { fade } from 'svelte/transition';
	import { get } from 'svelte/store';

	let folderInput: any;
	let inputValue: string;
	let folders: folder_t[] = [];
	let selectedIndex = 0;
	let isChangingFolder = false;
	let taskid: string;

	onMount(() => {
		if (get(modalStore)?.props.isChangingFolder) {
			isChangingFolder = true;
			taskid = get(modalStore)?.props.taskId;
		}
		setTimeout(() => {
			folderInput.focusAction();
		}, 100);
		folders = Object.values($userStore.folders);
	});

	$: if (inputValue) {
		folders = Object.values($userStore.folders)
			.filter((folder) => folder.name.toLowerCase().includes(inputValue.toLowerCase()))
			.sort((a, b) => a.name.localeCompare(b.name));
	} else {
		folders = Object.values($userStore.folders);
	}

	window &&
		window.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowDown') {
				selectedIndex = selectedIndex === folders.length - 1 ? 0 : selectedIndex + 1;
			} else if (e.key === 'ArrowUp') {
				selectedIndex = selectedIndex === 0 ? folders.length - 1 : selectedIndex - 1;
			}
		});
</script>

{#if isChangingFolder}
	<center style="font-size: 1.1rem; font-weight: 500;padding: 1rem 0;">
		Move "{get(modalStore)?.props.taskName}" to
	</center>
{/if}

<div class="FolderModal">
	<div class="input-wrapper">
		<Input
			placeholder="Folder Name"
			bind:this={folderInput}
			bind:inputValue
			onEnter={() => {
				if (folders[selectedIndex]?.name) {
					if (isChangingFolder) {
						taskHandlers.changeFolder(folders[selectedIndex]?.name, taskid, $userStore.id);
					}
					folderStore.set(folders[selectedIndex]?.name);
					closeModal();
				} else if (inputValue) {
					if (isChangingFolder) {
						return;
					}
					folderHandlers.addFolder(inputValue, $userStore.folders, $userStore.id);
					folderStore.set(inputValue);
					closeModal();
				}
			}}
		/>
		{#if (!Object.values($userStore.folders).find((folder) => folder.name === inputValue) || $isSaving) && inputValue && !isChangingFolder}
			<IconButton
				class="add-folder"
				on:click={() => {
					if (inputValue) {
						folderHandlers.addFolder(inputValue, $userStore.folders, $userStore.id);
						folderStore.set(inputValue);
					}
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M11 21H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h5l2 3h9a2 2 0 0 1 2 2v2M19 15v6M16 18h6"
					/>
				</svg>
			</IconButton>
		{/if}
	</div>
	<div class="folders">
		{#each folders as folder, index}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="folder {index === selectedIndex && 'selected'}"
				on:click={() => {
					if (isChangingFolder) {
						taskHandlers.changeFolder(folder.name, taskid, $userStore.id);
					}
					folderStore.set(folder.name);
					closeModal();
				}}
				transition:fade={{ duration: 100 }}
			>
				<div class="folder-name">{folder.icon}</div>
				<div class="folder-name">{folder.name}</div>
				<div class="folder-actions">
					<IconButton
						on:click={() => {
							confirm('Are you sure you want to delete this folder?') &&
								folderHandlers.deleteFolder(folder.name, $userStore.folders, $userStore.id);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="3 6 5 6 21 6" />
							<path
								d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
							/>
							<line x1="10" y1="11" x2="10" y2="17" />
							<line x1="14" y1="11" x2="14" y2="17" />
						</svg>
					</IconButton>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.FolderModal {
		min-width: 40vw;
		// background-color: #3B383E;

		padding: 1rem;
		border-radius: 1rem;

		display: flex;
		flex-direction: column;
		gap: 1rem;

		overflow: auto;

		// background: #0F0D13;
		background-color: rgba($color: #000000, $alpha: 0.1);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.05);

		@media screen and (max-width: 768px) {
			min-width: 80vw;
		}

		.input-wrapper {
			display: grid;
			grid-template-columns: 1fr min-content;

			:global(.add-folder) {
				padding: 0.5rem 0.75rem;
				margin-left: 0.5rem;
			}
		}

		.folders {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;

			.folder {
				display: grid;
				grid-template-columns: min-content 1fr min-content;
				gap: 0.5rem;

				padding: 0.9rem 1.25rem;
				border-radius: 5px;

				background-color: rgba(59, 56, 62);

				transition: all 0.2s ease-in-out;
				cursor: pointer;

				&.selected {
					background-color: rgba(59, 56, 62, 0.5);
				}

				.folder-name {
					font-size: 1.1rem;
				}

				.folder-actions {
					display: flex;
					align-items: center;
					gap: 0.5rem;
				}
			}
		}
	}

	svg {
		height: 1.2rem;
		width: 1.2rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2px;
	}
</style>

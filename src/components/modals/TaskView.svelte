<script lang="ts">
	import type { modalStore_t, task_t } from '$lib/types';
	import { closeModal } from '$lib/utils';
	import { onMount } from 'svelte';
	import IconButton from '../IconButton.svelte';
	import { supabase } from '../../supabase';
	import { authStore, modalStore } from '$lib/stores';
	import { taskHandlers } from '$lib/model';
	import { draw } from 'svelte/transition';

	let task: task_t;
	let isEditing: boolean = false;
	let descriptionDiv: HTMLDivElement;
	let editingTimeout: any;

	onMount(() => {
		supabase
			.from('tasks')
			.select('*')
			.eq('id', $modalStore?.props.taskId)
			.then((data) => {
				if (data.data?.length === 1) {
					task = {
						id: data.data[0].id,
						name: data.data[0].name,
						description: data.data[0].desc,
						status: data.data[0].status,
						createdAt: data.data[0].created_at
					};
				}
				modalStore.update((value: any) => {
					return {
						...value,
						isLoading: false
					};
				});
			});
	});
</script>

{#if task}
	<div class="header">
		<span class="heading">
			{task?.name} <br />
			<span class="created">Created At : {new Date(task.createdAt).toLocaleString()}</span>
		</span>
		<div class="end">
			{#if isEditing}
				<div class="editing">
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
						class="edit-pencil"
					>
						<path d="M16 3 L21 8 L8 21 L3 21 L3 16 L16 3 Z" />
					</svg>
					<span> Editing </span>
				</div>
			{/if}
			<IconButton
				on:click={() => {
					$authStore?.user.id && taskHandlers.deleteTask(task?.id, $authStore?.user.id);
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
			<IconButton on:click={closeModal}>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</IconButton>
		</div>
	</div>
	<div class="body">
		<div
			class="description {isEditing ? 'editing' : ''}"
			on:dblclick={() => {
				isEditing = true;
			}}
			contenteditable={isEditing}
			on:blur={() => {
				$authStore?.user.id &&
					taskHandlers.updateTaskDescription(
						task?.id,
						descriptionDiv.innerText,
						$authStore?.user.id
					);
				isEditing = false;
			}}
			bind:this={descriptionDiv}
			on:input={() => {
				clearTimeout(editingTimeout);
				editingTimeout = setTimeout(() => {
					$authStore?.user.id &&
						taskHandlers.updateTaskDescription(
							task?.id,
							descriptionDiv.innerText,
							$authStore?.user.id
						);
				}, 3000);
			}}
		>
			{task?.description}
		</div>
	</div>
{/if}

<style lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 0.5rem;

		.heading {
			font-size: 1.1rem;
			font-weight: 600;
			line-height: 1.25rem;
		}

		.created {
			font-size: 0.6rem;
			font-weight: 600;
			line-height: 0.75rem;
			color: #a0a0a0;
		}

		.end {
			display: flex;
			align-items: center;

			gap: 0.5rem;

			.editing {
				display: flex;
				align-items: center;
				gap: 0.25rem;

				padding: 0.25rem 0.5rem;
				border-radius: 0.25rem;
				background-color: rgba($color: #fff, $alpha: 0.2);

				.edit-pencil {
					path {
						stroke-dasharray: 54;
						animation: draw 6s ease-in-out forwards infinite;
					}
					@keyframes draw {
						0% {
							stroke-dashoffset: 0;
						}
						25% {
							stroke-dashoffset: 54;
						}
						50% {
							stroke-dashoffset: 108;
						}
						75% {
							stroke-dashoffset: 54;
						}
						100% {
							stroke-dashoffset: 0;
						}
					}
				}

				span {
					font-size: 0.75rem;
					font-weight: 600;
					line-height: 1rem;
				}
			}

			svg {
				width: 1.25rem;
				height: 1.25rem;
			}
		}
	}

	.body {
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: auto;

		.description {
			height: 100%;
			font-size: 1rem;
			font-weight: 400;
			padding: 0.25rem;
			white-space: pre-wrap;

			&.editing {
				border: 1px solid #a0a0a0;
				border-radius: 0.25rem;
			}

			&:focus {
				outline: none;
			}
		}
	}
</style>

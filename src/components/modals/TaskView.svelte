<script lang="ts">
	import { taskStatus, type modalStore_t, type task_t, type milestone_t } from '$lib/types';
	import { closeModal } from '$lib/utils';
	import { onMount } from 'svelte';
	import IconButton from '../IconButton.svelte';
	import { supabase } from '../../supabase';
	import { authStore, isSaving, modalStore } from '$lib/stores';
	import { taskHandlers } from '$lib/model';

	let task: task_t;
	let isEditing: boolean = false;
	let descriptionDiv: HTMLDivElement;
	let editingTimeout: any;

	let newMilestone: milestone_t = {
		name: 'New Milestone',
		status: taskStatus.ToDo
	};

	function getTask() {
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
						createdAt: data.data[0].created_at,
						milestones: data.data[0].milestones ? data.data[0].milestones.length === 0 ? undefined : data.data[0].milestones : undefined
					};
				}
				modalStore.update((value: any) => {
					return {
						...value,
						isLoading: false
					};
				});
			});
	}

	onMount(() => {
		getTask();
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
			{#if !task.milestones}
				<IconButton
					on:click={() => {
						task.milestones = [];
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
						<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
						<line x1="4" y1="22" x2="4" y2="15" />
					</svg>
				</IconButton>
			{/if}
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
		{#if task.description !== ''}
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
					}, 5000);
				}}
			>
				{task?.description}
			</div>
		{/if}
		{#if task.milestones}
			<div class="milestones">
				{#each task.milestones as milestone}
					<div class="milestone">
						<div class="start">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<IconButton
								on:click={() => {
									if (task.milestones)
										// @ts-ignore
										task.milestones =
											taskHandlers.toggleMileStoneStatus(task.milestones, milestone, task.id) ||
											task.milestones;
								}}
							>
								{#if milestone.status === taskStatus.ToDo}
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
									</svg>
								{:else if milestone.status === taskStatus.Done}
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<polyline points="9 11 12 14 22 4" />
										<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
									</svg>
								{/if}
							</IconButton>
							<div class="name">{milestone.name}</div>
						</div>
						<div class="end">
							<IconButton
								on:click={() => {
									if (task.milestones)
										task.milestones = taskHandlers.deleteMilestone(
											task.milestones,
											milestone,
											task.id
										);
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</IconButton>
						</div>
					</div>
				{/each}
				<div class="milestone">
					<div class="start">
						<IconButton
							on:click={() => {
								let tempNewMileStone = { ...newMilestone };
								if (task.milestones)
									task.milestones = taskHandlers.addMilestone(
										task.milestones,
										tempNewMileStone,
										task.id
									);
								newMilestone.name = '';
							}}
						>
							<svg viewBox="0 0 24 24">
								<line x1="12" y1="5" x2="12" y2="19" />
								<line x1="5" y1="12" x2="19" y2="12" />
							</svg>
						</IconButton>
						<div
							class="name"
							contenteditable="true"
							bind:innerText={newMilestone.name}
							on:keypress={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									let tempNewMileStone = { ...newMilestone };
									if (task.milestones)
										task.milestones = taskHandlers.addMilestone(
											task.milestones,
											tempNewMileStone,
											task.id
										);
									newMilestone.name = '';
								}
							}}
						>
							New Milestone
						</div>
					</div>
				</div>
			</div>
		{/if}
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

		.milestones {
			display: flex;
			flex-direction: column;
			margin-top: 1rem;

			&:only-child {
				.milestone {
					&:first-child {
						border-top: none;
						padding-top: 0;
					}
				}
			}

			.milestone {
				display: flex;
				align-items: center;
				padding: 0.5rem;
				justify-content: space-between;

				&:first-child {
					padding-top: 1rem;
					border-top: 1px solid #a0a0a0;
				}

				svg {
					height: 1rem;
					width: 1rem;
					fill: none;
					stroke: currentColor;
					stroke-width: 2px;
				}

				.start {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					width: 100%;

					.name {
						font-size: 1rem;
						font-weight: 400;
						width: 100%;

						&:is([contenteditable='true']) {
							border: 1px solid #a0a0a0;
							border-radius: 0.25rem;
						}
					}
				}

				.end {
					display: flex;
					align-items: center;
					gap: 0.5rem;
				}
			}
		}
	}
</style>

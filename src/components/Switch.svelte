<script lang="ts">
	export let checked: boolean = false;
	export let checkedText: string = "";
	export let uncheckedText: string = "";
</script>

<div
	class="switch {checked ? 'active' : ''}"
	on:click={() => {
		checked = !checked;
	}}
	on:keypress={(e) => {
		if (e.key === 'Enter') {
			checked = !checked;
		}
	}}
>
	<span class="checkedtext">{checkedText}</span>
	<div class="toggle" />
	<span class="uncheckedtext">{uncheckedText}</span>
</div>

<style lang="scss">
	.switch {
		width: 4rem;
		height: 2.5rem;
		position: relative;

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;

		border-radius: 20px;
		padding: 0rem 0.5rem;

		background: rgba(255, 255, 255, 0.2);
		cursor: pointer;

		&.active {
			
			.toggle {
				background-position: -25px 0;
				transform: translateX(2.25rem);
			}
		}

		.toggle {
			width: 2rem;
			height: 2rem;

			position: absolute;
			border-radius: 50%;

			background: url('/ct.webp') no-repeat;
			background-size: cover;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

			transition: transform 0.4s ease-in-out, 0.4s ease background-position;
		}

		.checkedtext,
		.uncheckedtext {
			font-size: 0.75rem;
			overflow-wrap: break-word;
		}
	}
</style>

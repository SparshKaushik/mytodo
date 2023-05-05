<script lang="ts">
	export let text: string;
</script>

<button class="btn" on:click>{text}</button>

<style lang="scss">
	button {
		--color: #60a5fa;
		font-family: inherit;
		display: inline-block;
		width: 8em;
		height: 2.6em;
		position: relative;
		overflow: hidden;
		border: none;
		transition: color 0.5s;
		z-index: 1;
		font-size: 17px;
		border-radius: 6px;
		font-weight: 500;
		color: var(--color);
		background-color: #1d1b20;
		cursor: pointer;
	}

	button:before {
		content: '';
		position: absolute;
		z-index: -1;
		background: var(--color);
		height: 150px;
		width: 200px;
		border-radius: 50%;
	}

	button:hover {
		color: #fff;
		border: none;
	}

	button:before {
		top: 100%;
		left: 100%;
		transition: all 0.7s;
	}

	button:hover:before {
		top: -30px;
		left: -30px;
	}

	button:active:before {
		background: var(--color);
		transition: background 0s;
	}
</style>

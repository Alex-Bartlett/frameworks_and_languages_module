<script>
	// Svelte Feature: Component Properties
	// https://svelte.dev/docs/svelte-components
	export let name;
	export let type;
	export let label;
	export let placeholder;
</script>

<div class="flex flex-col md:flex-grow-0">
	<label for={name} class="mb-2 font-bold">{label}</label>
	<input
		class="px-2 py-1 bg-zinc-700 rounded-md outline outline-zinc-500 outline-2 hover:outline-orange-500 hover:outline-2 focus:outline-orange-500 focus:outline-4 transition-all ease-out duration-75"
		{type}
		{name}
		{placeholder}
	/>
</div>

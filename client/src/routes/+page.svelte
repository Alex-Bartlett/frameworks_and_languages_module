<script>
	// Svelte Feature: Stores
	// https://svelte.dev/docs/svelte-store
	import { page } from "$app/stores";
	import Listings from "$lib/components/Listings.svelte";
	// Retrieve the api parameter from url
	const api = $page.url.searchParams.get("api");
</script>

<svelte:head>
	<title>Freecycle</title>
</svelte:head>

<!-- Tailwind Feature: Breakpoint styles 
https://tailwindcss.com/docs/responsive-design
-->
<header
	class="flex flex-auto flex-wrap place-content-between items-center mx-5 sm:px-5 py-5 mb-5 sm:mb-10 border-b border-zinc-400"
	role="navigation"
>
	<h1 class="text-4xl">Freecycle</h1>
	<span class="text-base">
		<b>Connection status:</b>
		<!-- Svelte Feature: Logic Blocks
		https://svelte.dev/docs/logic-blocks
		 -->
		{#if api}
			<span class="text-green-400"> Connected to {api}</span>
		{:else}
			<span class="text-red-400"> Unconnected</span>
		{/if}
	</span>
</header>

<!-- Svelte Feature: Custom components 
https://svelte.dev/docs/svelte-components
-->
<Listings urlAPI={api} />

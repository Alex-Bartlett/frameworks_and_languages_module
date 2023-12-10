<script>
	// Svelte Feature: Lifecycle Functions
	// https://svelte.dev/docs/svelte#onmount
	import { onMount } from "svelte";

	import Input from "./Input.svelte";
	export let urlAPI; // urlAPI is given as an attribute of this component (see ../../routes/+page.svelte)

	let items = [];

	function getItems() {
		fetch(urlAPI + "/items", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => res.json())
			.then((json) => (items = json))
			.catch((err) => console.error("Error on get: ", err));
	}

	function postItem(e) {
		/**
		 * Svelte supplies the form element on a submit event, so the form data
		 * must be retrieved and iterated over to create the item object.
		 * https://www.thisdot.co/blog/handling-forms-in-svelte
		 */
		const formData = new FormData(e.target);
		/**
		 * Clear the form input values after submitting
		 * https://stackoverflow.com/questions/73308546/clear-input-field-in-svelte-after-form-submission
		 */
		e.target.reset();

		let item = {};
		// Put form data into expected object format
		for (let field of formData) {
			const [key, value] = field;
			item[key] = value; // Key = input name, Value = input value
		}

		console.log(JSON.stringify(item));
		fetch(urlAPI + "/item", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(item),
		})
			.then((res) => {
				console.log(res);
				res.json();
			})
			.then((json) => {
				console.log("Post sent the following: ", JSON.stringify(json));
				getItems();
			})
			.catch((err) => console.error("Error on post: ", err));
	}

	function deleteItem(id) {
		fetch(`${urlAPI}/item/${id}`, {
			method: "DELETE",
		})
			.then((res) => {
				console.log(res);
				getItems();
			})
			.catch((err) => console.error("Error on delete: ", err));
	}

	onMount(() => {
		console.log(urlAPI);
		// Only attempt to get items if the api param is supplied
		if (urlAPI) {
			getItems();
		}
	});
</script>

<main class="has-text-light mx-5 sm:mx-10">
	<h2 class="text-2xl mb-2">Create new listing</h2>
	<!-- Svelte Feature: Component Events
	https://svelte.dev/docs/component-directives#on-eventname
	-->
	<form on:submit|preventDefault={postItem}>
		<div class="grid gap-4 sm:w-2/3 md:w-auto md:grid-cols-2 lg:w-1/2">
			<Input
				name="user_id"
				type="text"
				label="User ID"
				placeholder="User ID"
			/>
			<Input
				name="description"
				type="text"
				label="Description"
				placeholder="Description"
			/>
			<Input
				name="keywords"
				type="text"
				label="Keywords"
				placeholder="Keyword1, Keyword2, etc"
			/>
			<Input
				name="image"
				type="text"
				label="Image"
				placeholder="Image URL"
			/>
			<Input
				name="lat"
				type="text"
				label="Latitude"
				placeholder="Latitude"
			/>
			<Input
				name="lon"
				type="text"
				label="Longitude"
				placeholder="Longitude"
			/>
			<Input
				name="date_from"
				type="date"
				label="Date from"
				placeholder="Date from"
			/>
			<Input
				name="date_to"
				type="date"
				label="Date to"
				placeholder="Date to"
			/>
		</div>
		<!-- Tailwind Feature: State Styling
		https://tailwindcss.com/docs/hover-focus-and-other-states
		-->
		<input
			class="mt-8 px-8 py-1 rounded-xl border-2 border-orange-500 bg-none hover:bg-orange-500 focus:bg-orange-500 text-lg font-bold hover:cursor-pointer transition-colors ease-out duration-150"
			data-action="create_item"
			type="submit"
			value="Create"
		/>
	</form>

	<h2 class="text-2xl mt-10 mb-2">Current Listings</h2>
	{#if items.length}
		<ul
			class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
		>
			{#each items as item}
				<li class="">
					<div class="rounded-xl bg-zinc-700">
						{#if item.image}
							<img
								src={item.image}
								alt="Image of {item.user_id}"
								data-field="image"
								class="rounded-t-xl"
							/>
						{/if}
						<div class="p-4">
							<h3 class="text-xl" data-field="id">
								{item.id}<span>. {item.user_id}</span>
							</h3>
							<p class="mt-2" data-field="description">
								{item.description}
							</p>
							<div class="font-bold mt-2">Keywords</div>
							<ul class="list-disc list-inside">
								{#if item.keywords.length}
									{#each item.keywords as kw}
										<li>{kw}</li>
									{/each}
								{:else}
									<i>None specified </i>
								{/if}
							</ul>
							<div>
								<b>From:</b>
								<div data-field="date_from">
									{item.date_from}
								</div>
							</div>
							<div>
								<b>Until:</b>
								<div data-field="date_to">{item.date_to}</div>
							</div>
							<button
								on:click={deleteItem(item.id)}
								class="rounded-xl border-2 border-red-500 px-4 py-1 mt-4 hover:bg-red-500 focus:bg-red-500 transition-colors ease-out duration-150"
								data-action="delete">Delete</button
							>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<i>No listings found</i>
	{/if}
</main>

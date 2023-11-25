<script>
  import { onMount } from "svelte";
  import Input from "./Input.svelte";
  export let urlAPI;

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
    let item = {};

    for (let field of formData) {
      const [key, value] = field;
      item[key] = value;
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
    if (urlAPI) {
      getItems();
    }
  });
</script>

<main class="has-text-light mx-5 sm:mx-10">
  <h2 class="text-2xl mb-2">Create new listing</h2>
  <form on:submit|preventDefault={postItem}>
    <div>
      <Input name="user_id" type="text" label="User ID" placeholder="User ID" />
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
      <Input name="image" type="text" label="Image" placeholder="Image URL" />
      <Input name="lat" type="text" label="Latitude" placeholder="Latitude" />
      <Input name="lon" type="text" label="Longitude" placeholder="Longitude" />
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
        placeholder="Date tos"
      />
    </div>
    <input
      class="btn btn-primary mt-3"
      data-action="create_item"
      type="submit"
      value="Create"
    />
  </form>

  <ul>
    {#each items as item}
      <li>{JSON.stringify(item)}</li>
      <button
        on:click={deleteItem(item.id)}
        class="btn btn-danger"
        data-action="delete">Delete</button
      >
    {/each}
  </ul>
</main>

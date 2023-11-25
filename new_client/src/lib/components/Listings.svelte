<script>
  import { onMount } from "svelte";
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

<main class="has-text-light">
  <form on:submit|preventDefault={postItem}>
    <div class="">
      <label for="user_id" class="label">User ID</label>
      <input class="control" type="text" name="user_id" placeholder="User ID" />
    </div>
    <div class="">
      <label for="description" class="label">Description</label>
      <input
        class="control"
        type="text"
        name="description"
        placeholder="Description"
      />
    </div>
    <div class="">
      <label for="keywords" class="label">Keywords</label>
      <input
        class="control"
        type="text"
        name="keywords"
        placeholder="Keyword1, Keyword2, etc"
      />
    </div>
    <div class="">
      <label for="image" class="label">Image URL</label>
      <input class="control" type="text" name="image" placeholder="Image URL" />
    </div>
    <div class="">
      <label for="lat" class="label">Latitude</label>
      <input class="control" type="text" name="lat" placeholder="Latitude" />
    </div>
    <div class="">
      <label for="long" class="label">Longitude</label>
      <input class="control" type="text" name="lon" placeholder="Longitude" />
    </div>
    <div class="">
      <label for="date_from" class="label">Date from</label>
      <input
        class="control"
        type="date"
        name="date_from"
        placeholder="Date from"
      />
    </div>
    <div class="">
      <label for="date_to" class="label">Date to</label>
      <input class="control" type="date" name="date_to" placeholder="Date to" />
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

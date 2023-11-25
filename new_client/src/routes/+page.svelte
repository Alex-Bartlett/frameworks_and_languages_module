<script>
  import { page } from "$app/stores";
  import Listings from "$lib/components/Listings.svelte";
  const api = $page.url.searchParams.get("api");
</script>

<svelte:head>
  <title>Freecycle</title>
</svelte:head>

<header class="navbar has-background-primary" role="navigation">
  <div class="navbar-brand">
    <a href="/" class="navbar-item">
      <h1 class="title has-text-white">Freecycle</h1>
    </a>
  </div>
  <div class="navbar-menu">
    <div class="navbar-end">
      <div class="navbar-item">
        <span class="">
          <b>Connection status:</b>
          {#if api}
            <span> Connected to {api}</span>
          {:else}
            <span> Unconnected</span>
          {/if}
        </span>
      </div>
    </div>
  </div>
</header>

<Listings urlAPI={api} />

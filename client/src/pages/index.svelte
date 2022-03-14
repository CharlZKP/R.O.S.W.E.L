<script lang="ts">
import Home from "./Home.svelte";
import { _ } from "svelte-i18n";
</script>

<svelte:head>
  <title>{$_("page.home.title")} | ROSWEL-TH</title>
</svelte:head>
<Home />

<script lang="ts">
export let href = ''
</script>

<!-- <a href="{href}" class="py-5 px-3 text-white hover:text-green-100">
	<slot />
</a> -->

<a
	href="{href}"
	class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
	><slot />
</a>

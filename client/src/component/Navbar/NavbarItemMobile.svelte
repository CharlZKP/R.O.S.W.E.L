<script lang="ts">
	export let href = "";
</script>

<!-- <a href="{href}" class="py-5 px-3 text-white hover:text-white">
	<slot>
		
	</slot>
</a> -->


<a
	href="{href}"
	class="bg-purple-900 text-white block px-3 py-2 rounded-md text-base font-medium"
	aria-current="page">
	<slot/>
</a>
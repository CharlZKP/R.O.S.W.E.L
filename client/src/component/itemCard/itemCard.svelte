
<script lang="ts">
	import ItemCardItem from './itemCardItem.svelte';
	export let items = [];
	export let title = 'Item List';
</script>


<div class="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-700 w-full">
	<p class="font-bold text-lg text-black dark:text-white">
		{title}
	</p>
	<ul>
		{#each items as item}
			<ItemCardItem 
				image="{item.image}"
				text_title="{item.name}"
				text_explain={item.explain}
			/>
		{/each}
	</ul>
</div>

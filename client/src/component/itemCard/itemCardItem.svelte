<script lang="ts">
	export let heading_action = function() {};
	export let image;
	export let text_title;
	export let text_explain = '';
</script>

<li class="flex items-center my-6 space-x-2">
	<button on:click|stopPropagation="{heading_action}" class="block relative">
		<img alt="item image" src="{image}" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</button>
	<div class="flex flex-col">
		<span class="text-md text-gray-900 font-semibold dark:text-white ml-2">
			{text_title}
		</span>
		<span class="text-md text-gray-400 dark:text-gray-300 ml-2">
			{text_explain}
		</span>
	</div>
</li>
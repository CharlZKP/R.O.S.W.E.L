<script lang="ts">
	export let store_id = ''
	export let url_prefix = '/store/';
	export let categories = [];
	export let special_tags = [];
	export let store_name = '';
	export let cover_img = '';
	export let available_time = [];
	export let rating = 0;
	export let latitude = 0;
	export let longitude = 0;
	export let verified = false;

	import { url } from '@roxi/routify'

	let starList:any = [
		false,
		false,
		false,
		false,
		false
	]

	for(let i = 0; i < 5; i++){
		if(Math.floor(rating) > i){
			starList[i] = true;
		}
	}

	import StarIcon from '../util/star.svelte';
	import StarFilledIcon from '../util/starFilled.svelte';
	
	
	let category_name = '';

	if(categories !== null && categories.length > 0)
	{
		for(let i in categories)
		{
			category_name += categories[i] + ', ';
		}
	}

	$: if(special_tags === null || typeof special_tags === 'undefined' || (typeof special_tags !== 'string' && !(special_tags && typeof special_tags === 'object' && 'length' in special_tags)))
	{
		special_tags = [];
	}

	//console.log('store name: ', store_name);
	//console.log('special_tags: ', special_tags);

</script>

<a href="{$url(url_prefix+store_id)}">
	<div class="flex flex-col">
		<div
			style="background-image: url({cover_img})"
			class="bg-cover bg-center mb-3 py-20 mt-10"
		></div>
		<h3 class="text-lg font-bold">{store_name}</h3>
		<span class="border-t py-2 mt-3 text-xs opacity-50 border-gray-400 align-middle">
			{#if verified}
				<span class="px-2 py-1 ml-1 text-base rounded text-white bg-purple-600 font-medium">
					Verified
				</span>
			{/if}

			
			{#each special_tags as tag}
				
				<span class="px-2 py-1 ml-1 text-base rounded text-white bg-pink-500 font-xs">
					{tag}
				</span>
			{/each}
			


			{category_name}

			<span class="float-right">
				<ul class="flex items-center gap-x-1">
					{#each starList as star}
						{#if star === true}
							<StarFilledIcon />
						{:else}
							<StarIcon />
						{/if}
					{/each}
					
				</ul>
			</span>
		</span>
	</div>
</a>

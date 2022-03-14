<script lang="ts">
	import { getManagingStores } from '../../../services/storeManager'

	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import StoreBlock from '../../../component/store/storeBlock.svelte'
	import Fuse from 'fuse.js'
	import { goto } from '@roxi/routify';
	
	let stores:any = [];
	let all_stores:any = [];
	let fuse_instance:any = null;
	let search_txt:string = '';

	let show_stores = false;
	
	//function rand int between 0 and 5
	function rand_int(min, max) 
	{ 
		// min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	function rand_string(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}


	onMount(() => {
		console.log('test-test-test')
		console.log('bef stores: ', stores);
		if(true)
		{
			console.log('Fetching store')
			//getStoreList(geo_coords[1], geo_coords[0]).then((api_stores) => {
			getManagingStores().then((api_stores) => {
				console.log('api_stores: ', api_stores)
				stores = api_stores;
				all_stores = api_stores;
				show_stores = true;

				fuse_instance = new Fuse(all_stores, {
					keys: ['store.name', 'store.specialTag']
				})
				
				console.log('stores: ', stores);
			});

		}
		
	});

	function get_img(real:any)
	{
		if(typeof real === 'undefined' || real === null || real.length === 0)
		{
			return '/dist/image/general/store_default.jpg'
		}

		return real;
	}


	function do_search_process()
	{
		if(search_txt.trim().length === 0)
		{
			stores = all_stores;
			return;
		}

		stores = fuse_instance.search(search_txt);
		//console.log(stores);
		for (let i in stores)
		{
			//rearrange into the same store object list type
			stores[i] = stores[i].item;
		}
		console.log('stores in search', stores);
	}

	function logStore()
	{
		
		console.log('in tag stores: ', stores);
		return "";
			
	}

</script>



<!-- List all store under user account -->


<div class="bg-gray-800 w-full py-5 flex items-center justify-center">
	<input
		bind:value="{search_txt}"
		name="searchTerm"
		type="Search"
		class="input rounded-md border-0 py-2 px-1.5 w-3/4 md:w-7/12"
		placeholder="Search Restaurants..."
	/>
	
	<button on:click={do_search_process} type="button" class="w-[10%] py-2 px-4 flex justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
		<svg width="20" height="20" class="svg-icon" viewBox="0 0 20 20">
			<path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
		</svg>
		Search
	</button>

	
</div>

{#if !show_stores}
	<center>
		<div class="bg-white w-1/2 mx-auto mt-10 p-2 sm:p-4 sm:h-64 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-5 select-none ">
			<div class="h-52 sm:h-full sm:w-72 rounded-xl bg-gray-200 animate-pulse">
			</div>
			<div class="flex flex-col flex-1 gap-5 sm:p-2">
				<div class="flex flex-1 flex-col gap-3">
					<div class="bg-gray-200 w-full animate-pulse h-14 rounded-2xl">
					</div>
					<div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl">
					</div>
					<div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl">
					</div>
					<div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl">
					</div>
					<div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl">
					</div>
				</div>
				<div class="mt-auto flex gap-3">
					<div class="bg-gray-200 w-20 h-8 animate-pulse rounded-full">
					</div>
					<div class="bg-gray-200 w-20 h-8 animate-pulse rounded-full">
					</div>
					<div class="bg-gray-200 w-20 h-8 animate-pulse rounded-full ml-auto">
					</div>
				</div>
			</div>
		</div>
	</center>

{:else}
	{#if stores.length === 0}
		<!-- No store -->
		<center>
			<div class="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-800 w-64 mt-16 m-auto">
				<div class="w-full h-full text-center">
					<div class="flex h-full flex-col justify-between">
						<svg class="h-12 w-12 mt-4 m-auto text-green-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
							</path>
						</svg>
						<p class="text-gray-600 dark:text-gray-100 text-md py-2 px-6">
							{$_('page.store_manager.edit_store.content.no_store')}
						</p>
						<div class="flex items-center justify-between gap-4 w-full mt-8">
							<button 
								type="button" class="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
								on:click={$goto('/storeManager/create-store')}
							>
								{$_('page.store_manager.edit_store.content.create_store')}
							</button>
						</div>
					</div>
				</div>
			</div>
		</center>
	
	{:else}
		<div class="max-w-screen-2xl mx-auto mt-8 pb-20">
			<div class="grid md:grid-cols-3 gap-x-5 gap-y-10">

				{#each stores as store}
					<StoreBlock
						store_id="{store.store.id}"
						url_prefix="/storeManager/edit-store/"
						categories="{[]}"
						special_tags="{store.store.specialTag}"
						store_name="{store.store.name}"
						cover_img="{get_img(store.store.img)}"
						available_time="{store.store.availableTime}"
						rating="{store.store.rating}"
						latitude="{store.store.locationLatLong.coordinates[0]}"
						longitude="{store.store.locationLatLong.coordinates[1]}"
						verified="{store.store.verified}"
					/>
				{/each}

				
			</div>
		</div>
	{/if}

	
{/if}
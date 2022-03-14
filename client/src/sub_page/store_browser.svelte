<script lang="ts">
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { getStoreList } from '../services/store';
	import StoreBlock from '../component/store/storeBlock.svelte'
	import Fuse from 'fuse.js'

	import Geolocation from "svelte-geolocation";
	
	
	let do_fake = true;

	let stores = [];
	let all_stores = [];
	let fuse_instance:any = null;
	let search_txt:string = '';
	
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

	let getPosition = false

	let geo_coords:any = false;
	let geo_success = false;
	let fetching_store = false;

	function getGeoLocation() {
		console.log('getGeoLocation was called')
		getPosition = true
		// $: geolocation?.getGeolocationPosition({ enableHighAccuracy: true });
	}

	$: console.log('getPosition: ', getPosition);
	$: console.log('geo_success: ', geo_success);

	$: if (geo_success) {
		//geo_coords[0] //geo_coords => [longitude, latitude]
		//geo_coords[1] //geo_coords => [longitude, latitude]
		console.log(geo_coords) //  -90 to 90 for latitude and -180 to 180 for longitude.

		let lat = geo_coords[1];
		let long = geo_coords[0];

		if(do_fake) {
			lat = "18.80465475251844" //rand_int(-90, 90);
			long = "98.95503657714208" //rand_int(-180, 180);
		}

		if(!fetching_store)
		{
			fetching_store = true;
			console.log('Fetching store')
			//getStoreList(geo_coords[1], geo_coords[0]).then((api_stores) => {
			getStoreList(lat, long).then((api_stores) => {
				stores = api_stores;
				all_stores = api_stores;
				fuse_instance = new Fuse(all_stores, {
					keys: ['store.name', 'store.specialTag']
				})

				//bad hack
				setTimeout(() => {
					fetching_store = false;
				}, 2000)
				
			});

		}
		

		// console.log(geo_success);
		setTimeout(() => {
			getPosition = false
		}, 700)
	}

	onMount(() => {
		getGeoLocation();
	})

	

	function rand_img(real:any)
	{
		if(!do_fake)
		{
			return real;
		}

		let img_list=[
			"https://images.unsplash.com/photo-1571302461036-2dcc20213610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudCxzdG9yZXx8fHx8fDE2NDUzMzU0NzA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1513226800728-a25cff14018a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudCxzdG9yZXx8fHx8fDE2NDUzMzU2MTQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1551529834-525807d6b4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudCxzdG9yZXx8fHx8fDE2NDUzMzU4NjY&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1473213110592-19430a217c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudCxzdG9yZXx8fHx8fDE2NDUzMzU5MDA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1600397905749-2911203d3a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudCxzdG9yZXx8fHx8fDE2NDUzMzU5MjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1527596428171-7885b82c91c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudCxzdG9yZXx8fHx8fDE2NDUzMzU5Mjk&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1518481852452-9415b262eba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudCxzdG9yZXx8fHx8fDE2NDUzMzU5MzI&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1635230657218-5aaa3a7eb522?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZSxmb29kfHx8fHx8MTY0NTMzNTk0Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1530062845289-9109b2c9c868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZSxmb29kfHx8fHx8MTY0NTMzNTk1MQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1438401817917-ee9dc33fe6af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZSxmb29kfHx8fHx8MTY0NTMzNTk2OA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1445116572660-236099ec97a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZSxmb29kfHx8fHx8MTY0NTMzNTk3Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1429681601148-75510b2cef43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZSxmb29kfHx8fHx8MTY0NTMzNTk3Ng&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1591261730587-6901c2b24b76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZSxpY2VjcmVhbXx8fHx8fDE2NDUzMzU5NjI&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1575623811814-dfbb2c13e4ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDUzMzU5Njg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1445116572660-236099ec97a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDUzMzU5NzU&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1493857671505-72967e2e2760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDUzMzU5ODc&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1514933651103-005eec06c04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDUzMzU5OTA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1559314809-0d155014e29e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGhhaWZvb2R8fHx8fHwxNjQ1MzM1OTk0&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1593871141144-332fa4adcf11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGhhaWZvb2R8fHx8fHwxNjQ1MzM2MDAw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1559314809-0d155014e29e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGhhaWZvb2R8fHx8fHwxNjQ1MzM2MDAz&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1564675533183-b1a836ec6537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGhhaWZvb2R8fHx8fHwxNjQ1MzM2MDA1&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1554054204-b2f70b09d031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGhhaWZvb2R8fHx8fHwxNjQ1MzM2MDA5&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1552538962-40822613a09d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGhhaWZvb2R8fHx8fHwxNjQ1MzM2MDEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1641715850737-95e767faebb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGhhaWZvb2R8fHx8fHwxNjQ1MzM2MDE4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1627373717516-0f4bb24c487d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aWNlY3JlYW18fHx8fHwxNjQ1MzM2MDU3&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aWNlY3JlYW18fHx8fHwxNjQ1MzM2MDY0&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1564583445607-4d54b80e4c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aWNlY3JlYW18fHx8fHwxNjQ1MzM2MDY3&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1477691251658-ee086a3adcac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aWNlY3JlYW18fHx8fHwxNjQ1MzM2MDY5&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1532598065077-cf9ee59bf91f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aWNlY3JlYW18fHx8fHwxNjQ1MzM2MDcx&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1612949075181-0bd0d8339ad8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29mZmVlLGNhZmV8fHx8fHwxNjQ1MzM2MDgx&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1502719414926-613118be79d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29mZmVlLGRyaW5rc3x8fHx8fDE2NDUzMzYwOTc&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1624888350532-ac7ecf305b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29mZmVlLGRyaW5rc3x8fHx8fDE2NDUzMzYxMDE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1517705770913-e28886bac93a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29mZmVlLGRyaW5rc3x8fHx8fDE2NDUzMzYxMDM&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
			"https://images.unsplash.com/photo-1535644396010-e89b5bfafd15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29mZmVlLGRyaW5rc3x8fHx8fDE2NDUzMzYxMDY&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
		]

		return img_list[rand_int(0, img_list.length-1)]
	}

	function get_tags(real:any)
	{
		if(!do_fake)
		{
			return real;
		}

		let available_tags = [
			'Good Review',
			'Half Half',
			'Raw Chana',
			'Sponsored',
			'Recommended'
		]

		let count = rand_int(0, 2);

		let tags:any = [];
		for(let i = 0; i < count; i++)
		{
			let temp_rand = available_tags[rand_int(0, available_tags.length-1)];
			if(!tags.includes(temp_rand))
			{
				tags.push(temp_rand);
			}
		}

		return tags;
	}

	function get_verified(real:any)
	{
		if(!do_fake)
		{
			return real;
		}

		return (rand_int(0, 2) === 1);
	}

	//https://source.unsplash.com/random/500x500/?cafe,food
	//https://source.unsplash.com/random/500x500/?restaurant,food

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
	}

	//TODO - Make part of this to be a component so that it could be use somewhere else and remove redundancy in the code such as in the store edit 
</script>

<Geolocation
	getPosition="{getPosition}"
	bind:coords="{geo_coords}"
	bind:success="{geo_success}"
/>

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

{#if geo_coords == false || typeof geo_coords == 'undefined'}
	<center>
		<div class="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-800 w-64 mt-16 m-auto">
			<div class="w-full h-full text-center">
				<div class="flex h-full flex-col justify-between">
					<svg class="h-12 w-12 mt-4 m-auto text-green-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
						</path>
					</svg>
					<p class="text-gray-600 dark:text-gray-100 text-md py-2 px-6">
						{$_('subpage.store_browser.content.no_location')}
					</p>
					<div class="flex items-center justify-between gap-4 w-full mt-8">
						<button 
							type="button" class="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
							on:click={getGeoLocation}
						>
							{$_('subpage.store_browser.content.try_again')}
						</button>
					</div>
					<div>
						<p class="text-gray-600 dark:text-gray-100 text-sm py-2 px-6">
							{$_('subpage.store_browser.content.geo_not_working')} <a class="text-blue-500" href="https://support.google.com/chrome/answer/142065?hl=en" target="_blank">Chrome</a> 
						</p>
					</div>
				</div>
			</div>
		</div>
	</center>
{/if}

<div class="max-w-screen-2xl mx-auto mt-8 pb-20">
	<div class="grid md:grid-cols-3 gap-x-5 gap-y-10">

		
		{#each stores as store}
			<StoreBlock
				store_id="{store.store.id}"
				categories="{[]}"
				special_tags="{get_tags(store.store.specialTag)}"
				store_name="{store.store.name}"
				cover_img="{rand_img("")}"
				available_time="{store.store.availableTime}"
				rating="{rand_int(0, 5)}"
				latitude="{store.store.locationLatLong.coordinates[0]}"
				longitude="{store.store.locationLatLong.coordinates[1]}"
				verified="{get_verified(store.store.verified)}"
			/>
		{/each}
		
			
	</div>
</div>

<script lang="ts">
	import ItemBlock from '../../../../component/store/itemBlock.svelte';
	import { _ } from 'svelte-i18n';
	import { userInfo } from '../../../../stores/userInfo'
	import { isActive, url } from '@roxi/routify'
	import { getStore, getStoreItemList } from '../../../../services/store'
	import { updateOnLeave } from '../../../../services/storeManager'
	import { onMount } from 'svelte';
	import { params } from '@roxi/routify'
	import Geolocation from "svelte-geolocation";
	import { goto } from '@roxi/routify';
	import { toast } from '@zerodevx/svelte-toast';
	import { theme } from '../../../../constants/toastTheme';

	let position:any = false;
	
	//console.log($params.store_id);
	let store_id = $params.store_id;
	let storeItems = [];
	let show_store = false;
	let isOnLeave = true;
	let store:any = false;
	let stars = [
		false,
		false,
		false,
		false,
		false
	]

	let store_distance:any = 'unknown';

	let editable = false;

	userInfo.useLocalStorage();

	//haversine formula
	function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
		// console.log('lat long', lat1, lon1, lat2, lon2);
		lat1 = parseFloat(lat1);
		lon1 = parseFloat(lon1);
		lat2 = parseFloat(lat2);
		lon2 = parseFloat(lon2);
		
		let R = 6371; // Radius of the earth in km
		let dLat = deg2rad(lat2-lat1);  // deg2rad below
		let dLon = deg2rad(lon2-lon1); 
		let a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
			Math.sin(dLon/2) * Math.sin(dLon/2)
			; 
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		let d = R * c; // Distance in km
		return d;
	}

	function deg2rad(deg) {
		return deg * (Math.PI/180)
	}

	onMount(() => {
		getStore(store_id).then((ret) => {
			
			if(ret)
			{
				
				console.log(ret);
				show_store = true;
				store=ret;
				isOnLeave = ret.store.onLeave;
				if(ret.extra_data.is_owner)
				{
					editable = true;
				}
				for(let i = 0; i < 5; i++)
				{
					if(Math.floor(ret.store.rating) > i)
					{
						stars[i] = true;
					}
				}

				getStoreItemList(store_id).then((ret2) => {
					if(ret2)
					{
						storeItems = ret2;
					}
				});
					
			}
		})
	});

	$: if(position !== false)
	{
		store_distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, store.store.locationLatLong.coordinates[1], store.store.locationLatLong.coordinates[0]);
		store_distance += ' km';
	}

	function do_update_on_leave()
	{
		updateOnLeave(store_id, !isOnLeave).then((ret) => {
			if(ret)
			{
				toast.push($_('page.store_manager.edit_store.store.toast.update_on_leave.success'), theme.success)
			}
		});
	}
	
	let goto_edit_item_maker = function(item_id)
	{
		return () => { $goto('/storeManager/edit-store/' + store_id + '/item/' + item_id) };
	}
</script>

<svelte:head>
	<title>{$_('page.store_manager.edit_store.store.title')} | ROSWEL-TH</title>
</svelte:head>


{#if show_store}

	{#if !editable}
		
		<div class="bg-pink-600 dark:bg-gray-800">
			<div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between flex-wrap">
					<div class="w-0 flex-1 flex items-center">
						<span class="flex p-2 rounded-lg bg-pink-800 dark:bg-black">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="h-6 w-6 text-white" viewBox="0 0 1792 1792">
								<path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z">
								</path>
							</svg>
						</span>
						<p class="ml-3 font-medium text-white truncate">
							<span class="md:hidden">
								{$_('page.store_manager.edit_store.store.content.banner.warning')}
							</span>
							<span class="hidden md:inline">
								{$_('page.store_manager.edit_store.store.content.banner.not_your_store')}
							</span>
						</p>
					</div>
					<div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
						<button on:click="{$goto('/storeManager/create-store')}" class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-pink-600 dark:text-gray-800 bg-white hover:bg-pink-50">
							{$_('page.store_manager.edit_store.store.content.banner.create_store')}
						</button>
					</div>
					<!-- <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
						<button type="button" class="-mr-1 flex p-2 rounded-md hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
							<span class="sr-only">
								Dismiss
							</span>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-6 w-6 text-white" viewBox="0 0 1792 1792">
								<path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z">
								</path>
							</svg>
						</button>
					</div> -->
				</div>
			</div>
		</div>

	{/if}

	<Geolocation getPosition bind:position />

	

	<center>
		<div class="bg-white dark:bg-gray-800 w-10/12 h-80 mt-10 rounded-lg p-4 mb-6 shadow sm:inline-block">
			<div class="flex items-start text-left">
				<div>
					<img alt="store pic" src="/dist/image/general/store_default.jpg" class="max-w-full max-h-full mx-auto">
				</div>
				<div class="ml-6">
					<div class="flex items-baseline">
						<span class="text-gray-600 dark:text-gray-200 font-bold">
							{store.store.name}
						</span>

						
						
					</div>
					<div class="flex items-center mt-1">
						
						{#each stars as star}
							{#if star}
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 1792 1792">
									<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
									</path>
								</svg>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 1792 1792">
									<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
									</path>
								</svg>
							{/if}
							
						{/each}
						
					</div>
					
					{#if editable}
						<!-- on off button for store on leave -->
						
						<div class="mb-3">
							<span class="text-gray-400 font-medium">
								On leave
							</span>
							<div class="relative inline-block w-10 mr-2 align-middle select-none">
								<input on:click="{do_update_on_leave}" bind:checked={isOnLeave} type="checkbox" name="toggle" id="Blue" class="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
								<label for="Blue" class="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
								</label>
							</div>
						</div>

						
						<button on:click={$goto('/storeManager/edit-store/'+store_id+'/item/new')} type="button" class=" w-40 py-2 px-4 flex justify-center items-center  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="mx-auto" fill="white" viewBox="0 0 1792 1792">
								<path d="M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z">
								</path>
							</svg>
							{$_('page.store_manager.edit_store.store.content.add_new_item')}
						</button>


					{:else}
						<div class="mb-3">
							<span class="text-gray-400 font-medium">
								{((store.store.onLeave) ?  $_('page.store.browse.content.on_leave') : $_('page.store.browse.content.open'))}
							</span>
						</div>


					{/if}

					<div class="mt-3">
						<!-- <p class="mt-1 max-w-xs dark:text-white">
							My first job of scanning photos at the Memories 2 Digital Photo Scanning was fantastic. She completed the work quickly while I was waiting. Thanks for a great service..
						</p> -->
						<span> Distance: {store_distance} <span title="Displacement" class="text-gray-300">?</span> </span>
						
					</div>


				</div>
			</div>
		</div>
	</center>


	<div class="max-w-screen-2xl w-10/12 mx-auto mt-8 pb-20">
		<div class="grid md:grid-cols-4 gap-x-5 gap-y-10">
			{#each storeItems as item}
				<ItemBlock 
					item_name = "{item.name}"
					item_description = "{item.details}"
					item_price="{item.price}"
					item_image="{item.image}"
					btn_text="{$_('page.store_manager.edit_store.store.content.edit_item')}"
					btn_action="{goto_edit_item_maker(item.id)}"
				/>
			{/each}
			
		</div>
	</div>
{:else}
		
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

{/if}


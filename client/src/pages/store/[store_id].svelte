<script lang="ts">
	import PopupAlert from './../../component/util/popup_alert.svelte';
	import ItemBlock from './../../component/store/itemBlock.svelte';
	import { _ } from 'svelte-i18n';
	import { userInfo } from '../../stores/userInfo'
	import { goto, isActive, url } from '@roxi/routify'
	import { getStore, getStoreItemList } from '../../services/store'
	import { onMount } from 'svelte';
	import { params } from '@roxi/routify'
	import Geolocation from "svelte-geolocation";
	import { basket } from '../../stores/basket';
	import BasketBtn from '../../component/basketBtn.svelte';
	import Basket from '../../sub_page/basket.svelte';
import { toast } from '@zerodevx/svelte-toast';
import { theme } from '../../constants/toastTheme';

	let position:any = false;

	basket.useLocalStorage();
	
	//console.log($params.store_id);
	let store_id = $params.store_id;
	let storeItems = [];
	let storeItemsIndexed = {};
	let show_store = false;
	let store:any = false;
	let stars = [
		false,
		false,
		false,
		false,
		false
	]

	
	let show_popup = false;
	let popup_collision_params = {
		title: $_('component.alert.store_collision.can_not_add_to_basket'),
		description: $_('component.alert.store_collision.reason'),
		btn_1_action: function() {
			console.log('btn_1_action');
		},
		btn_1_txt: $_('component.alert.store_collision.button.delete'),
		btn_2_action: function() {
			show_popup = false;
		},
		btn_2_txt: $_('component.alert.store_collision.button.no')
	}

	let basket_open = false;

	let store_distance:any = 'unknown';


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
						for(let i in ret2)
						{
							storeItemsIndexed[ret2[i].id] = ret2[i];
						}
					}
				});
			}
		})
	});

	$: if(position !== false)
	{

		// console.log('position', position);	
		// console.log('lat long in if ', position.coords.latitude, position.coords.longitude, store.store.locationLatLong.coordinates[1], store.store.locationLatLong.coordinates[0]);
		store_distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, store.store.locationLatLong.coordinates[1], store.store.locationLatLong.coordinates[0]);
		store_distance += ' km';
	}
	


	//basket part
	function add_to_basket(store_id:any, item_id:any)
	{
		// console.log('add to basket: ', store_id, item_id);
		if(!$basket.hasOwnProperty(item_id))
		{
			let temp_basket_item = {
				id: item_id,
				for_store_id: store_id,
				name: storeItemsIndexed[item_id].name,
				image: storeItemsIndexed[item_id].image,
				details: storeItemsIndexed[item_id].details,
				price: storeItemsIndexed[item_id].price,
				quantity: 1
				//seems sad but this is almost all of the storeItemsIndexed[item_id] T_T
			}

			$basket[item_id] = temp_basket_item;
			toast.push($_('page.store.browse.toast.added_to_basket'), theme.info);
			
		}
		else
		{
			//increment item quantity
			$basket[item_id].quantity++;
			toast.push($_('page.store.browse.toast.added_to_basket'), theme.info);
		}
	}

	function add_to_basket_helper(store_id:any, item_id:any)
	{
		console.log('add to basket helper: ', store_id, item_id);
		console.log('basket len', Object.keys($basket).length);
		if(Object.keys($basket).length > 0)
		{
			// console.log(' [add b] basket store id: ', $basket[Object.keys($basket)[0]].for_store_id)
			// console.log(' [add b] store id: ', store_id)
			if($basket[Object.keys($basket)[0]].for_store_id === store_id)
			{
				add_to_basket(store_id, item_id);
			}
			else
			{
				popup_collision_params.btn_1_action = function () {
					$basket = {};
					add_to_basket(store_id, item_id);
					show_popup = false;
				};

				show_popup = true;
			}
		}
		else
		{
			add_to_basket(store_id, item_id);
		}
	}
</script>

<svelte:head>
	<title>{$_('page.store.browse.title')} | ROSWEL-TH</title>
</svelte:head>


{#if show_store}

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
						<span class="text-gray-500 dark:text-gray-300  ml-2 text-sm">
							{((store.store.onLeave) ?  $_('page.store.browse.content.on_leave') : $_('page.store.browse.content.open'))}
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
				{#if item.onShow}
					<ItemBlock 
						item_name = "{item.name}"
						item_description = "{item.details}"
						item_price="{item.price}"
						item_image="{item.image}"
						btn_action="{() => { add_to_basket_helper(item.for_store_id, item.id) }}"
					/>
				{/if}
				
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

<!-- basket btn -->
<BasketBtn bind:basket_open />

<!-- basket view -->
<Basket bind:basket_open />

<PopupAlert {...popup_collision_params} bind:show_popup />
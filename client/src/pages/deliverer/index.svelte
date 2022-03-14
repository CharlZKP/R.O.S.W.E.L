<script lang="ts">
	import OrderList from '../../component/orderList/order_list.svelte';
	import { goto } from "@roxi/routify";
	import { userInfo } from "../../stores/userInfo";
	import { toast } from "@zerodevx/svelte-toast";
	import { theme } from "../../constants/toastTheme";
	import { _ } from 'svelte-i18n';
	import { getUnassignedOrder } from '../../services/order'
	import { onMount } from "svelte";
	import Geolocation from "svelte-geolocation";

	let order_list = [];
	let position:any = false;

	let lat;
	let long;

	$: if(position !== false)
	{
		lat = position.coords.latitude;
		long = position.coords.longitude;
		getUnassignedOrder(lat, long).then((res) => {
			console.log('unassigned orders: ', res);
			if(res)
			{
				order_list = res;
			}
		})
	}
	

	onMount(() => {
		
	});

</script>

<!-- bulletin board -->
<svelte:head>
	<title>{$_('page.deliverer.bulletin.title')} | ROSWEL-TH</title>
</svelte:head>

<Geolocation getPosition bind:position />

<!-- <div class="shadow-lg rounded-2xl bg-white dark:bg-gray-800 p-4">
	<div class="flex-row gap-4 flex justify-center items-center">
		
		<div class="flex p-2 flex-col cursor-pointer shadow-lg rounded-2xl bg-orange-200 " on:click|stopPropagation="{$goto('/deliverer/order')}">
			<span class="text-gray-600 dark:text-white text-lg font-medium" >
				Active Order
			</span>
			<span class="text-gray-400 text-xs">
				Active Order you've accepted
			</span>
		</div>
	</div>
</div> -->

<OrderList list_heading="All Orders" bind:order_list mode="bulletin"/>

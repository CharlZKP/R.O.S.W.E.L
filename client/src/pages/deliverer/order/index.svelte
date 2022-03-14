<script lang="ts">
	import OrderList from '../../../component/orderList/order_list.svelte';
	import { goto } from "@roxi/routify";
	import { userInfo } from "../../../stores/userInfo";
	import { toast } from "@zerodevx/svelte-toast";
	import { theme } from "../../../constants/toastTheme";
	import { _ } from 'svelte-i18n';
	import { getActiveDelivererOrderList } from '../../../services/order'
	import { onMount } from "svelte";

	let order_list = [];
	let position:any = false;
	

	onMount(() => {
		// get(lat, long).then((res) => {
		// 	console.log('unassigned orders: ', res);
		// 	if(res)
		// 	{
		// 		order_list = res;
		// 	}
		// })
		getActiveDelivererOrderList().then((res) => {
			console.log('unassigned orders: ', res);
			if(res)
			{
				order_list = res;
			}
		})
	});

</script>

<svelte:head>
	<title>{$_('page.deliverer.order.list.title')} | ROSWEL-TH</title>
</svelte:head>


<OrderList list_heading="Active Accepted Orders" bind:order_list mode="deliverer_order_list"/>
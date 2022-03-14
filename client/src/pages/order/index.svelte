<script lang="ts">
	import OrderList from '../../component/orderList/order_list.svelte';
	import { goto } from "@roxi/routify";
	import { userInfo } from "../../stores/userInfo";
	import { toast } from "@zerodevx/svelte-toast";
	import { theme } from "../../constants/toastTheme";
	import { _ } from 'svelte-i18n';
	import { getOnGoingOrder } from "../../services/order";
	import { onMount } from "svelte";

	let order_list = [];

	onMount(() => {
		getOnGoingOrder().then((res) => {
			console.log('on going orders: ', res);
			if(res)
			{
				order_list = res;
			}
		})
	});

</script>


<svelte:head>
	<title>{$_('page.order.order_list.title')} | ROSWEL-TH</title>
</svelte:head>

<OrderList list_heading="Active Orders" bind:order_list mode="order_list"/>
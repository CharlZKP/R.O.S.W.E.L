<script lang="ts">
	import OrderList from '../../component/orderList/order_list.svelte';
	import { goto } from "@roxi/routify";
	import { userInfo } from "../../stores/userInfo";
	import { toast } from "@zerodevx/svelte-toast";
	import { theme } from "../../constants/toastTheme";
	import { _ } from 'svelte-i18n';
	import { getAllCustomerOrder } from "../../services/order";
	import { onMount } from "svelte";

	let order_list = [];

	onMount(() => {
		getAllCustomerOrder().then((res) => {
			console.log('on going orders: ', res);
			if(res)
			{
				order_list = res;
			}
		})
	});

</script>


<svelte:head>
	<title>{$_('page.order.order_history.title')} | ROSWEL-TH</title>
</svelte:head>

<OrderList list_heading="Orders" bind:order_list mode="order_list"/>
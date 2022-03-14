<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { userInfo } from '../../stores/userInfo'
	import { isActive, url } from '@roxi/routify'
	import Store_browser from "../../sub_page/store_browser.svelte"
	import VerifyCheckCard from "../../component/verifyCheckCard.svelte"
	import BasketBtn from '../../component/basketBtn.svelte';
	import Basket from '../../sub_page/basket.svelte';
	
	let basket_open = false;
	
	userInfo.useLocalStorage();
	console.log($userInfo);


	if($userInfo === false)
	{
		//The user got here without redirect --> should check how this happened
	}




	let isActiveDeliverer = false;
	if($userInfo.deliverer !== null)//TODO - fix this
	{
		isActiveDeliverer = true;
	}

	if(!$userInfo.emailConfirmed)
	{

	}

</script>

<svelte:head>
	<title>{$_('page.dashboard.title')} | ROSWEL-TH</title>
</svelte:head>

{#if !$userInfo.emailConfirmed || !$userInfo.phoneNoConfirmed}
	<center class="mt-10">
		<VerifyCheckCard bind:email_verified={$userInfo.emailConfirmed} bind:phone_verified={$userInfo.phoneNoConfirmed}/>
	</center>
{:else}
	<!-- SHOW dashboard -->
	<Store_browser />

	<!-- basket btn -->
	<BasketBtn bind:basket_open while_has_item={true} />
	<!-- basket view -->
	<Basket bind:basket_open />
{/if}
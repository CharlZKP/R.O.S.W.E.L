<script lang="ts">
	import { goto } from '@roxi/routify'
	import { _ } from 'svelte-i18n'
	import BasketItem from '../component/basket/item.svelte'
	import { basket } from '../stores/basket'
	import { fade, fly } from 'svelte/transition';
	import { toast } from '@zerodevx/svelte-toast';
	import { theme } from '../constants/toastTheme';
	import { createOrder } from '../services/order';
	import Geolocation from "svelte-geolocation";

	basket.useLocalStorage()
	if(typeof $basket !== 'object' )
	{
		basket.set({});
		//$basket = {};

	}

	export let basket_open = false;
	export let tip_amount = 10;

	let position:any = false;

	
	console.log('basket', $basket)

	let basket_list = [];
	let total_basket_price = 0;
	let total_to_pay = 0;

	basket.subscribe(value => {
		basket_list = [];
		total_basket_price = 0;
		for(let i in value) {
			basket_list.push(value[i])
			total_basket_price += (value[i].price * value[i].quantity)
		}
	});

	$: if(total_basket_price || tip_amount)
	{
		total_to_pay = total_basket_price + tip_amount;
	}

	let delete_item = function (item_id:string) {
		return () => { 
			console.log('deleting item: ' + item_id)
			delete $basket[item_id] 
			$basket = $basket; //Neet this to trigger the change / update
		}
	}

	function do_create_order() {
		if(basket_list.length == 0)
		{
			toast.push($_('subpage.basket.toast.basket_empty'), theme.error);
			return;
		}
		else
		{
			let order_item_list = [];
			for(let i in basket_list)
			{
				let temp_order_item = {
					id: basket_list[i].id,
					amount: basket_list[i].quantity
				}

				order_item_list.push(temp_order_item);
			}
			
			let lat = 0;
			let long = 0;

			if(position !== false)
			{
				lat = position.coords.latitude;
				long = position.coords.longitude;
			}

			createOrder(order_item_list, tip_amount, String(lat), String(long)).then((ret) => {
				if(ret)
				{
					//console.log('ret create order', ret);
					toast.push($_('subpage.basket.toast.order_success'), theme.success);
					
					//clear basket
					$basket = {};
					//basket.set({});

					//$goto('/order/' + ret.id); - I dont know why but this causes the website to bug out
				}
				else
				{
					toast.push($_('subpage.basket.toast.order_failed'), theme.error);
				}
			})
		}
	}

</script>

	<!-- <svelte:head>
		<title>{$_('page.basket.title')} | ROSWEL-TH</title>
	</svelte:head> -->

{#if basket_open}

	<Geolocation getPosition bind:position />
	<div
		class="fixed inset-0 overflow-hidden"
		aria-labelledby="slide-over-title"
		role="dialog"
		aria-modal="true"
	>
		<div class="absolute inset-0 overflow-hidden" transition:fade="{{ duration: 500 }}">
			<!--
				Background overlay, show/hide based on slide-over state.

				Entering: "ease-in-out duration-500"
					From: "opacity-0"
					To: "opacity-100"
				Leaving: "ease-in-out duration-500"
					From: "opacity-100"
					To: "opacity-0"
			-->
			<div
				on:click|stopPropagation = {() => {basket_open = false}}
				class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				aria-hidden="true"
			></div>

			<div class="fixed inset-y-0 right-0 pl-10 max-w-full flex" transition:fly="{{ x: 200, duration: 500 }}">
				<!--
					Slide-over panel, show/hide based on slide-over state.

					Entering: "transform transition ease-in-out duration-500 sm:duration-700"
						From: "translate-x-full"
						To: "translate-x-0"
					Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
						From: "translate-x-0"
						To: "translate-x-full"
				-->
				<div class="w-screen max-w-md">
					<div
						class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll"
					>
						<div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
							<div class="flex items-start justify-between">
								<h2
									class="text-lg font-medium text-gray-900"
									id="slide-over-title"
								>
									{$_('subpage.basket.content.shopping_cart')}
								</h2>
								<div class="ml-3 h-7 flex items-center">
									<button
										on:click|stopPropagation = {() => {basket_open = false}}
										type="button"
										class="-m-2 p-2 text-gray-400 hover:text-gray-500"
									>
										<span class="sr-only">Close panel</span>
										<!-- Heroicon name: outline/x -->
										<svg
											class="h-6 w-6"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"></path>
										</svg>
									</button>
								</div>
							</div>

							<div class="mt-8">
								<div class="flow-root">
									<ul
										role="list"
										class="-my-6 divide-y divide-gray-200"
									>
										

										{#each basket_list as basket_item}
											<BasketItem 
												item_id="{basket_item.id}"
												item_name="{basket_item.name}"
												quantity="{basket_item.quantity}"
												item_price="{basket_item.price}"
												item_image="{basket_item.image}"
												btn_action="{delete_item(basket_item.id)}"
											/>
										{/each}

										

										<!-- More products... -->
									</ul>
								</div>
							</div>
						</div>

						<div class="border-t border-gray-200 py-6 px-4 sm:px-6">
							<div
								class="flex justify-between text-base font-medium text-gray-900"
							>
								<p>Tip</p>
								<p><input type="number" step="0.01" class="border-gray-600 border-2 rounded-lg w-16" bind:value="{tip_amount}"> THB</p>
							</div>

							<div
								class="flex justify-between text-base font-medium text-gray-900"
							>
								<p>{$_('subpage.basket.content.total')}</p>
								<p>{total_to_pay} THB</p>
							</div>
							<!-- <p class="mt-0.5 text-sm text-gray-500">
								Shipping and taxes calculated at checkout.
							</p> -->
							<div class="mt-6">
								<button
									disabled="{basket_list.length === 0}"
									on:click|stopPropagation="{do_create_order}"
									class="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
								>
									{$_('subpage.basket.content.checkout')}
								</button>
							</div>
							<!-- <div
								class="mt-6 flex justify-center text-sm text-center text-gray-500"
							>
								<p>
									or <button
										type="button"
										class="text-indigo-600 font-medium hover:text-indigo-500"
										>Continue Shopping<span aria-hidden="true">
											&rarr;</span
										></button
									>
								</p>
							</div> -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

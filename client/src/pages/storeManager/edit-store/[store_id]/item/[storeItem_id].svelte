<script lang="ts">
	import { params } from '@roxi/routify'
	import { onMount } from 'svelte';
	import { getStore, getStoreItem } from '../../../../../services/store'
	import { _ } from 'svelte-i18n';
	import { goto } from '@roxi/routify';
	import { updateItemOnShow } from '../../../../../services/storeManager';
	import { toast } from '@zerodevx/svelte-toast';	
	import { theme } from '../../../../../constants/toastTheme';

	let store_id = $params.store_id;
	let storeItem_id = $params.storeItem_id;
	let storeItem = null;
	let store;
	let editable:boolean | null = null;
	let item_onshow = false;
	let item_not_found = true;

	let item_name = '';
	let item_price:any = 0;
	let item_desc = '';

	//TODO - bad hack to fetch only one item from store (Fix this later)
	onMount(() => {
		getStore(store_id).then((ret) => {
			if(ret)
			{
				console.log(ret);
				store=ret;
				if(ret.extra_data.is_owner)
				{
					editable = true;
					getStoreItem(storeItem_id).then((ret2) => {
						if(ret2)
						{
							storeItem = ret2;

							item_not_found = false;
							item_name = storeItem.name;
							item_price = storeItem.price;
							item_desc = storeItem.details;
							item_onshow = storeItem.onShow;
							console.log('[ FETCH ] On show: ' + item_onshow);
							return;
						}
						else
						{
							editable = false;
						}
					});
				}
				else
				{
					editable = false;
				}
			}
			else
			{
				editable = false;
			}
			
		})
	});

	// function save_item()
	// {
	// 	item_name = item_name.trim();
	// 	item_desc = item_desc.trim();
	// 	item_price = (isNaN(item_price)) ? parseFloat(item_price) : item_price;

	// 	if(item_name.length == 0 || item_desc.length == 0)
	// 	{
	// 		toast.push($_('page.store_manager.edit_store.store.toast.pls_input_all_fields'), theme.error);
	// 		return;
	// 	}

		
	// 	createStoreItem(store_id, item_name, item_desc, item_price).then((ret) => {
	// 		if(ret)
	// 		{
	// 			toast.push($_('page.store_manager.edit_store.store.toast.item_added'), theme.success);
				
	// 		}
	// 		else
	// 		{
	// 			toast.push($_('page.store_manager.edit_store.store.toast.item_not_added'), theme.error);
	// 		}
	// 	})
		
	// }

	function do_update_on_show()
	{
		
		console.log('On show: ' + !item_onshow);
		updateItemOnShow(storeItem_id, !item_onshow).then((ret) => {
			if(ret)
			{
				toast.push($_('page.store_manager.edit_store.store.item.edit.toast.item_on_show_updated'), theme.success);
			}
			else
			{
				toast.push($_('page.store_manager.edit_store.store.item.edit.toast.item_on_show_not_updated'), theme.error);
			}
		})
	}

</script>

<svelte:head>
	<title>{$_('page.store_manager.edit_store.store.item.edit.title')} | ROSWEL-TH</title>
</svelte:head>



{#if editable === false}
	
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

{:else if editable === true}
	
	{#if item_not_found}
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
							{$_('page.store_manager.edit_store.store.item.edit.content.item_info')}
						</p>
						<div class="flex items-center justify-between gap-4 w-full mt-8">
							<button 
								type="button" class="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
								on:click={$goto('/storeManager/edit-store/' + store_id + '/item/new')}
							>
								{$_('page.store_manager.edit_store.store.item.edit.content.create_item')}
							</button>
						</div>
					</div>
				</div>
			</div>
		</center>
	{:else}
		

		<section class="h-screen bg-gray-100 bg-opacity-50">
			<div class="container max-w-2xl mx-auto shadow-md md:w-3/4">
				<div
					class="p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5"
				>
					<!-- <div class="max-w-sm mx-auto md:w-full md:mx-0">
						<div class="inline-flex items-center space-x-4">
							<a href="#" class="block relative">
								<img
									alt="profil"
									src="/images/person/1.jpg"
									class="mx-auto object-cover rounded-full h-16 w-16 "
								/>
							</a>
							<h1 class="text-gray-600">Charlie</h1>
						</div>
					</div> -->
					<div class="float-right">
						<div class="mb-3">
							<span class="text-gray-400 font-medium">
								On show
							</span>
							<div class="relative inline-block w-10 mr-2 align-middle select-none">
								<input on:click="{do_update_on_show}" bind:checked={item_onshow} type="checkbox" name="toggle" id="Blue" class="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
								<label for="Blue" class="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
								</label>
							</div>
						</div>
					</div>
				</div>
				<div class="space-y-6 bg-white">
					
					<div
						class="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0"
					>
						<h2 class="max-w-sm mx-auto md:w-1/3">{$_('page.store_manager.edit_store.store.item.content.item_info')}</h2>
						<div class="max-w-sm mx-auto space-y-5 md:w-2/3">
							<div>
								<div class=" relative ">
									<input
										type="text"
										bind:value={item_name}
										class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
										placeholder="{$_('page.store_manager.edit_store.store.item.content.name')}"
										disabled={true}
									/>
								</div>
							</div>
							<div>
								<div class=" relative ">
									<input
										type="text"
										bind:value={item_desc}
										class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
										placeholder="{$_('page.store_manager.edit_store.store.item.content.description')}"
										disabled={true}
									/>
								</div>
							</div>
						</div>
					</div>

					<hr />

					<div
						class="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0"
					>
						<h2 class="max-w-sm mx-auto md:w-1/3">{$_('page.store_manager.edit_store.store.item.content.price')}</h2>
						<div class="max-w-sm mx-auto md:w-2/3">
							<div class=" relative ">
								<input
									bind:value={item_price}
									type="number"
									step="0.01"
									class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
									placeholder="{$_('page.store_manager.edit_store.store.item.content.price')}"
									disabled={true}
								/>
							</div>
						</div>
					</div>

					<!-- <hr />

					<div class="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
						<button
							on:click={save_item}
							class="py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
						>
							{$_('page.store_manager.edit_store.store.item.content.save')}
						</button>
					</div> -->
				</div>
			</div>
		</section>
	{/if}

{:else}
	
	<div class="bg-white rounded w-96 mx-auto rounded-2xl shadow-lg">
		<div class="bg-gray-200 h-48 p-3 overflow-hidden animate-pulse">
		</div>
		<div class="h- p-3">
			<div class="grid grid-cols-3 gap-4 mt-2">
				<div class="h-8 bg-gray-200 rounded animate-pulse">
				</div>
				<div class="h-8 bg-gray-200 rounded animate-pulse">
				</div>
				<div class="h-8 bg-gray-200 rounded animate-pulse">
				</div>
				<div class="h-8 col-span-2 bg-gray-200 rounded animate-pulse">
				</div>
				<div class=" h-8 bg-gray-200 rounded animate-pulse">
				</div>
				<div class="...">
				</div>
				<div class="col-span-2 ...">
				</div>
			</div>
		</div>
	</div>

{/if}
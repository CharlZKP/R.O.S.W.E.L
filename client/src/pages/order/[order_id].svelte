<script lang="ts">
	import PopupAlert from './../../component/util/popup_alert.svelte';
	import BottomNav from './../../component/bottomNav/bottomNav.svelte';
	import ItemCard from '../../component/itemCard/itemCard.svelte';
	import { goto, url } from "@roxi/routify";
	import { userInfo } from "../../stores/userInfo";
	import { toast } from "@zerodevx/svelte-toast";
	import { theme } from "../../constants/toastTheme";
	import { _ } from 'svelte-i18n';
	import { params } from '@roxi/routify'
	import { onMount } from 'svelte';
	import { getOrder, cancelOrder, addTip } from '../../services/order';
	import { io } from "socket.io-client";
	import { getStoreItem } from '../../services/store';
	import Map from '@svelte-parts/map'
	import Marker from '@svelte-parts/map/marker'
	import Tiles from '@svelte-parts/map/tiles'
	import { server_base_url } from '../../services/Api'
	import DetailCard from '../../component/detailCard/card.svelte'
	import DetailCardItem from '../../component/detailCard/item.svelte'
	import moment from 'moment'


	let socket = null;

	let show_cancel_popup = false;

	let order_id = $params.order_id;
	console.log('order id: ' + order_id);

	let current_view = '';
	
	let btn_1_action = function () {
		current_view = 'order_info';
	};

	let btn_2_action = function () {
		current_view = 'map';
	};

	let btn_3_action = null;

	let btn_4_action = function () {
		show_cancel_popup = true;
	};

	function do_cancel_order()
	{
		cancelOrder(order_id).then((res) => {
			//console.log(res);
			if (res) 
			{
				toast.push($_('page.order.order_details.toast.cancel_order_success'), theme.success);
				
			} 
			else 
			{
				toast.push($_('page.order.order_details.toast.cancel_order_failed'), theme.error);
			}

			show_cancel_popup = false;
		});
	}

	let btn_1_txt = $_('page.order.order_details.content.nav.order_info');
	let btn_2_txt = $_('page.order.order_details.content.nav.map');//'Map';
	let btn_3_txt = $_('page.order.order_details.content.nav.call');//'Call';
	let btn_4_txt = $_('page.order.order_details.content.nav.cancel');//'Cancel';
	
	let items = [];
	let order_data = null;

	let default_view_lat = 18.8046684;
	let default_view_long = 98.9550333;
	
	let deliverer_lat:any = null;
	let deliverer_long:any = null;

	let customer_long:any = null;
	let customer_lat:any = null;

	let customer_location_map_url = 'Not Available';

	function update_cancel_btn()
	{
		const allowed_order_status = [
			'Finding deliverer',
			'Heading to store',
		];

		if (!allowed_order_status.includes(order_data.status))
		{
			btn_4_action = null;
		}
	}

	function create_socket(order_id)
	{
		console.log('Creating socket');
		socket = io(server_base_url, {
			reconnectionDelayMax: 10000,
			reconnectionAttempts: 20,
			withCredentials: true,
		});

		socket.on("connect", () => {
			//console.log(socket.id); // "G5p5..."
			console.log('socket connected');

			socket.emit('join_room', {
				room_name: order_id,
				room_type: "order room"
			}, function(data){
				console.log(data);
				if(data.success)
				{
					console.log('successfully joined a room');
				}
			});

		});

		socket.on("notify", (data) => {

			console.log('notify', data);

			if(data.type === 'order_cancel')
			{
				//order_id
				toast.push('Order has been cancelled', theme.warning);
				order_data.status = 'Cancelled';
				update_cancel_btn();
			}
			else if(data.type === 'tip_increased')
			{
				//currentTip
				toast.push('Tip has been increased to: ' + data.currentTip, theme.info);
				order_data.tipAmount = data.currentTip;
			}
			else if(data.type === 'deliverer_change_status')
			{
				//status
				//delivererLocation

				toast.push('Status has been updated to: ' + data.status, theme.info);
				order_data.status = data.status;

				deliverer_lat = data.delivererLocation.lat;
				deliverer_long = data.delivererLocation.long;

				update_cancel_btn();
			}
		});

		socket.on('force_disconnect', (txt) => {
			console.log('Force disconnect, reason: ' + txt);
			//toast.push('You have been disconnected from the server', theme.error);
		});

		
	}

	function geo_url_maker(lat, long, text)
	{
		let temp_obj:any = navigator.platform;

		//@ts-ignore
		if(navigator.userAgentData)
		{
			//@ts-ignore
			temp_obj = navigator.userAgentData;
		}
		if( (temp_obj.platform.indexOf("iPhone") != -1) || (temp_obj.platform.indexOf("iPod") != -1) || (temp_obj.platform.indexOf("iPad") != -1))
	 	{
			return '<a href="maps://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' + lat + ',' + long + '">' + text + '</a>';
		}
    	else
		{
			return '<a href="https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' + lat + ',' + long + '">' + text + '</a>';
		}
		//return store_location_map_url = '<a href="geo:' + long + ',' + lat + '" target="_blank">' + text + '</a>';
	}

	onMount(() => {
		getOrder(order_id, 'customer').then(async (res) => {
			if(res.success)
			{
				order_data = res.order;
				console.log(order_data)
				create_socket(order_id);

				if(order_data.delivererLatLong.coordinates !== null)
				{
					deliverer_lat = order_data.delivererLatLong.coordinates[1];
					deliverer_long = order_data.delivererLatLong.coordinates[0];
				}

				if(res.phone_no !== null)
				{
					btn_3_action = function () {
						window.open('tel:+' + res.phone_no);
					};
					console.log('Phone Number Button Enabled');
				}
				
				/*
				latitude in degrees is -90 and +90
				Longitude is in the range -180 and +180
				*/
				customer_long = order_data.customerLatLong.coordinates[0];
				customer_lat = order_data.customerLatLong.coordinates[1];
				customer_location_map_url = geo_url_maker(customer_lat, customer_long, $_('page.order.order_details.content.order_info.customer_lat_long'));
				

				for(let i in order_data.orderItem)
				{
					await getStoreItem(order_data.orderItem[i].storeItem_id).then((res2) => {
						
						if(res2.image === null)
						{
							res2.image = '/dist/image/general/no_image.jpg';
							res2.explain = order_data.orderItem[i].pricePerItem + ' x ' + order_data.orderItem[i].amount + ' = ' + (order_data.orderItem[i].amount*order_data.orderItem[i].pricePerItem).toFixed(2) + ' THB'
						}
						items.push(res2);
					});
				}
				//items = res.orderItem
				current_view = 'order_info';

				update_cancel_btn();

				/*
				if(order_data.status === 'Cancelled' || order_data.status === 'Complete')
				{
					btn_1_action = null;
					btn_2_action = null;
					// btn_3_action = null;
					btn_4_action = null;
				}
				*/
				
			}
			else
			{
				current_view = 'error';
				btn_1_action = null;
				btn_2_action = null;
				btn_3_action = null;
				btn_4_action = null;
			}
		});
	});


	//addTip(order_id: string, tip_amount: number)

</script>


<svelte:head>
	<title>{$_('page.order.order_details.title')} | ROSWEL-TH</title>
	<link rel="stylesheet" href="/dist/leaflet/leaflet.css" />
</svelte:head>

<BottomNav bind:btn_1_action bind:btn_2_action bind:btn_3_action bind:btn_4_action bind:btn_1_txt bind:btn_2_txt bind:btn_3_txt bind:btn_4_txt>
	<div slot="content">
		{#if current_view == 'order_info'}

			<DetailCard extra_class="mb-6">
				<span class="text-lg" slot="heading">
					{$_('page.order.order_details.content.order_info.heading')}
				</span>

				<itemGroup slot="rows">
					<DetailCardItem>
						<span class="text-lg" slot="key">
							{$_('page.order.order_details.content.order_info.customer_lat_long')}
						</span>

						<span class="text-lg" slot="value">
							{@html customer_location_map_url}
						</span>
					</DetailCardItem>
					<DetailCardItem type="even">
						<span class="text-lg" slot="key">
							{$_('page.order.order_details.content.order_info.tip_amount')}
						</span>

						<span class="text-lg" slot="value">
							{order_data.tipAmount}
						</span>
					</DetailCardItem>
					<DetailCardItem>
						<span class="text-lg" slot="key">
							{$_('page.order.order_details.content.order_info.total_price')}
						</span>

						<span class="text-lg" slot="value">
							{order_data.totalPrice + order_data.tipAmount}
						</span>
					</DetailCardItem>
					<DetailCardItem type="even">
						<span class="text-lg" slot="key">
							{$_('page.order.order_details.content.order_info.create_time')}
						</span>

						<span class="text-lg" slot="value">
							{moment(order_data.startsTime).format('MM-DD-YYYY HH:mm:ss')}
						</span>
					</DetailCardItem>
					<DetailCardItem>
						<span class="text-lg" slot="key">
							{$_('page.order.order_details.content.order_info.end_time')}
						</span>

						<span class="text-lg" slot="value">
							{ (order_data.endsTime == null) ? "-" : moment(order_data.endsTime).format('MM-DD-YYYY HH:mm:ss')}
						</span>
					</DetailCardItem>
					<DetailCardItem type="even">
						<span class="text-lg" slot="key">
							{$_('page.order.order_details.content.order_info.note')}
						</span>

						<span class="text-lg" slot="value">
							{(order_data.orderNote == null) ? "-" : order_data.orderNote}
						</span>
					</DetailCardItem>
				</itemGroup>
			</DetailCard>

		
			
			<div class="shadow-lg rounded-2xl max-w-xl p-4 bg-gray-200 flex justify-between items-center font-bold">
				<p class="text-sm">
					{$_('page.order.order_details.content.order_status')}:
					
					<span class="px-4 py-2  text-base rounded-full text-black border border-black undefined ">
						{order_data.status}
					</span>
				</p>
				
			</div>

			<ItemCard
				bind:items
				title={$_('page.order.order_details.content.title')}
			/>
		{:else if current_view == 'map'}
			<div class="w-full h-4/5 mt-4">
				<Map width="100%" height="70vh" zoom="16" lon={default_view_long} lat={default_view_lat}>
					<Tiles />
					{#if deliverer_lat !== null && deliverer_long !== null}
						<Marker lon={deliverer_long} lat={deliverer_lat} popup="Deliverer" />
					{/if}

					{#if customer_lat !== null && customer_long !== null}
						<Marker lon={customer_long} lat={customer_lat} popup="You" />
					{/if}
					
				</Map>
			</div>
		{:else if current_view == 'error'}
			
			<div class="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-800 w-64 mt-16 m-auto">
				<div class="w-full h-full text-center">
					<div class="flex h-full flex-col justify-between">
						<svg class="h-12 w-12 mt-4 m-auto text-green-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
							</path>
						</svg>
						<p class="text-gray-600 dark:text-gray-100 text-md py-2 px-6">
							<!-- order not found text -->
							{$_('page.order.order_details.content.error.order_not_found')}
						</p>
						<div class="flex items-center justify-between gap-4 w-full mt-8">
							<button 
								type="button" class="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
								on:click={$goto('/order')}
							>
								<!-- go to order text -->
								{$_('page.order.order_details.content.error.to_order_list')}
							</button>
						</div>
					</div>
				</div>
			</div>

		{:else}
			 <!-- else content here -->
		{/if}

		<div class="h-20">

		</div>
		
	</div>

	<div slot="btn_1_svg">
		<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 mx-auto" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 17.981h-13l-7 5.02v-5.02h-4v-16.981h24v16.981zm-2-14.981h-20v12.981h4v3.125l4.357-3.125h11.643v-12.981zm-9 6.001v5h-2v-5h2zm-1-1.5c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25z"/></svg>
	</div>

	<div slot="btn_2_svg">
		<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 mx-auto" viewBox="0 0 24 24"><path d="M12 0c-3.148 0-6 2.553-6 5.702 0 4.682 4.783 5.177 6 12.298 1.217-7.121 6-7.616 6-12.298 0-3.149-2.851-5.702-6-5.702zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm12 16l-6.707-2.427-5.293 2.427-5.581-2.427-6.419 2.427 4-9 3.96-1.584c.38.516.741 1.08 1.061 1.729l-3.523 1.41-1.725 3.88 2.672-1.01 1.506-2.687-.635 3.044 4.189 1.789.495-2.021.465 2.024 4.15-1.89-.618-3.033 1.572 2.896 2.732.989-1.739-3.978-3.581-1.415c.319-.65.681-1.215 1.062-1.731l4.021 1.588 3.936 9z"/></svg>
	</div>

	<div slot="btn_3_svg">
		<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 mx-auto" viewBox="0 0 24 24"><path d="M18.48 22.926l-1.193.658c-6.979 3.621-19.082-17.494-12.279-21.484l1.145-.637 3.714 6.467-1.139.632c-2.067 1.245 2.76 9.707 4.879 8.545l1.162-.642 3.711 6.461zm-9.808-22.926l-1.68.975 3.714 6.466 1.681-.975-3.715-6.466zm8.613 14.997l-1.68.975 3.714 6.467 1.681-.975-3.715-6.467z"/></svg>
	</div>

	<div slot="btn_4_svg">
		<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 mx-auto" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/></svg>
	</div>
</BottomNav>



<PopupAlert 
	bind:show_popup={show_cancel_popup}
	title={"Cancel Order"}
	description={"Do you really want to delete this order?"}
	btn_1_action={do_cancel_order}
	btn_1_txt={"Confirm Cancel Order"}
	btn_2_action={() => {show_cancel_popup = false}}
	btn_2_txt={"No, keep it"}
/>
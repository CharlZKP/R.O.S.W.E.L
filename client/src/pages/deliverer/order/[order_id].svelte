<script lang="ts">
	import PopupAlert from '../../../component/util/popup_alert.svelte';
	import BottomNav from '../../../component/bottomNav/bottomNav.svelte';
	import ItemCard from '../../../component/itemCard/itemCard.svelte';
	import { goto, url } from "@roxi/routify";
	import { userInfo } from "../../../stores/userInfo";
	import { toast } from "@zerodevx/svelte-toast";
	import { theme } from "../../../constants/toastTheme";
	import { _ } from 'svelte-i18n';
	import { params } from '@roxi/routify'
	import { onMount } from 'svelte';
	import { getOrder, cancelOrder, delivererChangableStatus, delivererChangeStatus } from '../../../services/order';
	import { io } from "socket.io-client";
	import { getStore, getStoreItem } from '../../../services/store';
	import { server_base_url } from '../../../services/Api'
	import DetailCard from '../../../component/detailCard/card.svelte'
	import DetailCardItem from '../../../component/detailCard/item.svelte'
	import moment from 'moment'
	import Geolocation from "svelte-geolocation";


	let socket = null;

	let show_change_status_popup = false;

	let order_id = $params.order_id;
	console.log('order id: ' + order_id);

	let current_view = '';
	
	let btn_1_action = function () {
		current_view = 'item_list';
	};

	let btn_2_action = function () {
		current_view = 'order_info';
	};

	let btn_3_action = null;

	let btn_4_action = function () {
		show_change_status_popup = true;
	};

	let deliverer_current_status:delivererChangableStatus;

	let btn_1_txt = $_('page.deliverer.order.details.content.nav.item_list');
	let btn_2_txt = $_('page.deliverer.order.details.content.nav.order_info');
	let btn_3_txt = $_('page.deliverer.order.details.content.nav.call');//'Call';
	let btn_4_txt = $_('page.deliverer.order.details.content.nav.change_status');//'Change Status';
	
	let items = [];
	let order_data = null;

	let default_view_lat = 18.8046684;
	let default_view_long = 98.9550333;
	
	let deliverer_lat:any = null;
	let deliverer_long:any = null;

	let customer_long:any = null;
	let customer_lat:any = null;

	let store_long:any = null;
	let store_lat:any = null;

	let store_search_query:any = '';

	let customer_location_map_url = 'Not Available';
	let store_location_map_url = 'Not Available';
	let store_query_map_url = 'Not Available';

	let position:any = false;

	//let status_svg = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 mx-auto" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z"/></svg>';

	function update_change_status_btn_active()
	{
		const allowed_order_status = [
			'Heading to store',
			'Package received',
			'Goods in transit',
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
				room_type: "order room",
				special_1: "deliverer",
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
				update_change_status_btn_active()
				//disable change status btn
				btn_4_action = null;
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

				//TODO - Check THIS
				toast.push('Status has been updated to: ' + data.status, theme.info);
				order_data.status = data.status;

				deliverer_lat = data.delivererLocation.lat;
				deliverer_long = data.delivererLocation.long;

				update_change_status()
				update_change_status_btn_active();
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

	function map_query_url_maker(query, text)
	{
		let temp_obj:any = navigator.platform;

		/*
		//replace all spacebar with +
		query = query.replace(/\s/g, '+');
		*/

		let temp_query = encodeURI(query);

		//@ts-ignore
		if(navigator.userAgentData)
		{
			//@ts-ignore
			temp_obj = navigator.userAgentData;
		}
		if( (temp_obj.platform.indexOf("iPhone") != -1) || (temp_obj.platform.indexOf("iPod") != -1) || (temp_obj.platform.indexOf("iPad") != -1))
	 	{
			return '<a href="maps://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' + temp_query + '">' + text + '</a>';
		}
    	else
		{
			return '<a href="https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' + temp_query + '">' + text + '</a>';
		}
		//return store_location_map_url = '<a href="geo:' + long + ',' + lat + '" target="_blank">' + text + '</a>';
	}

	onMount(() => {
		getOrder(order_id, 'deliverer').then(async (res) => {
			if(res.success)
			{
				order_data = res.order;
				console.log(order_data)
				create_socket(order_id);

				deliverer_current_status = switch_deliverer_status(order_data.status);
				console.log('deliverer_current_status: ' + deliverer_current_status);

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
				customer_location_map_url = geo_url_maker(customer_lat, customer_long, $_('page.order.order_details.content.order_info.customer_lat_long'))
				
				

				let temp_did_once_on_item = false;
				for(let i in order_data.orderItem)
				{
					await getStoreItem(order_data.orderItem[i].storeItem_id).then((res2) => {
						
						if(!temp_did_once_on_item)
						{
							//console.log('first store item: ', res2);
							temp_did_once_on_item = true;
							//Fetch 1 Item Description for the store and then fetch the store for the location
							//fetch store
							getStore(res2.for_store_id).then((res3) => {
								store_long = res3.store.locationLatLong.coordinates[0];
								store_lat = res3.store.locationLatLong.coordinates[1];
								store_search_query = res3.store.locationSearchQuery;
								store_location_map_url = geo_url_maker(store_lat, store_long, $_('page.deliverer.order.details.content.order_info.store_lat_long'));
								store_query_map_url = map_query_url_maker(store_search_query, store_search_query);
							});
							
						}

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

				update_change_status_btn_active();

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

	let xvg_going = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 mx-auto" fill-rule="evenodd" clip-rule="evenodd"><path d="M6.804 10.336l1.181-2.331-.462-1.005h-4.523v-1h5.992c.238 0 .5.19.5.5 0 .311-.26.5-.5.5h-.368l.47 1h6.483l-.841-2h3.243c.823.005 1.49.675 1.49 1.5 0 .828-.672 1.5-1.5 1.5-.711 0-.727-1 0-1 .239 0 .5-.189.5-.5 0-.239-.189-.5-.5-.5h-1.727l1.324 3.209c.454-.136.936-.209 1.434-.209 2.76 0 5 2.24 5 5s-2.24 5-5 5c-2.759 0-5-2.24-5-5 0-1.906 1.069-3.564 2.64-4.408l-.43-1.039-4.493 5.947h-1.742c-.251 2.525-2.384 4.5-4.975 4.5-2.759 0-5-2.24-5-5s2.241-5 5-5c.636 0 1.244.119 1.804.336zm-.455.897c-.421-.151-.876-.233-1.349-.233-2.207 0-4 1.792-4 4s1.793 4 4 4c2.038 0 3.723-1.528 3.97-3.5h-3.103c-.174.299-.497.5-.867.5-.551 0-1-.448-1-1 0-.533.419-.97.946-.998l1.403-2.769zm10.675.29c-1.208.688-2.024 1.988-2.024 3.477 0 2.208 1.792 4 4 4s4-1.792 4-4-1.792-4-4-4c-.363 0-.716.049-1.05.14l1.182 2.869c.49.064.868.484.868.991 0 .552-.448 1-1 1-.551 0-1-.448-1-1 0-.229.077-.44.207-.609l-1.183-2.868zm-9.783.164l-1.403 2.766.029.047h3.103c-.147-1.169-.798-2.183-1.729-2.813zm.454-.898c1.254.804 2.126 2.152 2.28 3.711h.998l-2.455-5.336-.823 1.625zm7.683-1.789h-5.839l2.211 4.797 3.628-4.797zm-14.378 0h4v-1h-4v1zm1-4h4v-1h-4v1z"/></svg>';
	let xvg_received = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 mx-auto" viewBox="0 0 24 24"><path d="M13.838 8.076l-.171.098v.858l.171-.098v-.858zm1.412.054l-.171.098v-.859l.171-.098v.859zm-4.367-8.13l-4.883 2.758v5.753l6.125 3.489 4.875-2.775v-5.754l-6.117-3.471zm-.001 1.149l4.557 2.585-.851.458-4.511-2.589.805-.454zm.618 9.344l-4.5-2.563v-4.095l4.5 2.609v4.049zm.509-4.91l-4.43-2.569 1.022-.584 4.409 2.61-1.001.543zm3.991 3.06l-3.5 1.993v-4.181l1-.539v1.428l1.5-.844v-1.393l1-.539v4.075zm-2.453.458l-.175.098v-.858l.175-.099v.859zm.702-.401l-.172.098v-.859l.172-.098v.859zm.287-.163l-.171.098v-.859l.171-.098v.859zm.292-.166l-.175.099v-.859l.175-.099v.859zm5.172 5.004v-3.213c0-.77.506-1.162 1.008-1.162.498 0 .992.383.992 1.163v4.086c0 .796-.071 1.179-.573 2.092-.793 1.441-2.242 4.807-2.242 7.66h-5.002s-.559-2.759-.763-3.942c-.411-2.377.126-3.471 1.109-4.485 1.021-1.053 1.527-1.551 1.995-2.035 1.081-1.121 2.552.194 1.694 1.222-.468.561-1.624 1.803-1.901 2.171-.268.356.231.857.624.447.573-.599 1.905-2.083 2.365-2.618.443-.517.694-.829.694-1.386zm-16 0v-3.213c0-.77-.506-1.162-1.008-1.162-.498 0-.992.383-.992 1.163v4.086c0 .796.071 1.179.573 2.092.793 1.441 2.242 4.461 2.242 7.66h5.002s.559-2.759.763-3.942c.411-2.377-.126-3.471-1.109-4.485-1.021-1.053-1.527-1.551-1.995-2.035-1.081-1.121-2.552.194-1.694 1.222.468.561 1.624 1.803 1.901 2.171.268.356-.231.857-.624.447-.573-.599-1.905-2.083-2.365-2.618-.443-.517-.694-.829-.694-1.386z"/></svg>';
	let xvg_transit = xvg_going;
	let xvg_complete = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 mx-auto" viewBox="0 0 24 24"><path d="M10.041 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591zm-8.704-10.5c1.11-2.158 2.878-3.985 5.164-5.162l.766 1.848c-1.779.954-3.17 2.394-4.075 4.082l-1.855-.768zm5.932 14.307c-1.689-.905-3.127-2.295-4.082-4.075l-1.848.765c1.175 2.287 3.003 4.055 5.162 5.167l.768-1.857zm-4.847-5.923c-.584-1.933-.549-3.933.005-5.767l-1.857-.769c-.374 1.171-.57 2.401-.57 3.648 0 1.215.186 2.446.573 3.654l1.849-.766zm5.928-14.311l.766 1.849c1.933-.584 3.934-.549 5.767.005l.77-1.856c-1.173-.375-2.402-.571-3.649-.571-1.215 0-2.445.186-3.654.573zm8.381 2.619c1.688.905 3.127 2.295 4.081 4.074l1.848-.766c-1.176-2.286-3.003-4.053-5.161-5.165l-.768 1.857zm4.847 5.922c.584 1.933.549 3.934-.005 5.768l1.856.77c.375-1.171.57-2.401.57-3.648 0-1.215-.186-2.447-.573-3.656l-1.848.766zm-.77 7.617c-.905 1.688-2.295 3.127-4.074 4.082l.766 1.849c2.286-1.176 4.054-3.004 5.164-5.162l-1.856-.769zm-5.923 4.847c-1.934.584-3.934.55-5.768-.005l-.77 1.857c1.172.374 2.402.57 3.65.57 1.215 0 2.445-.186 3.653-.572l-.765-1.85z"/></svg>';
	
	function switch_deliverer_status(status:string)
	{
		//console.log('status: ', status);
		if( status.trim() == 'Heading to store')
		{
			return delivererChangableStatus.headingToStore;
		}
		else if( status.trim() == 'Package received')
		{
			return delivererChangableStatus.packageReceived;
		}
		else if( status.trim() == 'Goods in transit')
		{
			return delivererChangableStatus.inTransit;
		}
		else if( status.trim() == 'Complete')
		{
			return delivererChangableStatus.complete;
		}
	}

	function get_deliverer_next_status(current_status:delivererChangableStatus): delivererChangableStatus
	{
		if(current_status == delivererChangableStatus.headingToStore)
		{
			return delivererChangableStatus.packageReceived;
		}
		else if(current_status == delivererChangableStatus.packageReceived)
		{
			return delivererChangableStatus.inTransit;
		}
		else //if(current_status == delivererChangableStatus.inTransit)
		{
			return delivererChangableStatus.complete;
		}
	}

	function update_change_status()
	{
		deliverer_current_status = switch_deliverer_status(order_data.status);

		/*
		if(get_deliverer_next_status(deliverer_current_status) == delivererChangableStatus.headingToStore)
		{
			return status_svg = xvg_going;
		}
		else if(get_deliverer_next_status(deliverer_current_status) == delivererChangableStatus.packageReceived)
		{
			return status_svg = xvg_received;
		}
		else if(get_deliverer_next_status(deliverer_current_status) == delivererChangableStatus.inTransit)
		{
			return status_svg = xvg_transit;
		}
		else if(get_deliverer_next_status(deliverer_current_status) == delivererChangableStatus.complete)
		{
			return status_svg = xvg_complete;
		}
		*/
	}
	
	function change_to_next_status()
	{
		let lat;
		let long;
		if(position !== false)
		{
			lat = position.coords.latitude;
			long = position.coords.longitude;
		}
		else
		{
			toast.push('Unable to get your location', theme.error);
			return;
		}

		delivererChangeStatus(order_id, get_deliverer_next_status(deliverer_current_status), String(lat), String(long)).then((res) => {
			if(res)
			{
				toast.push($_('page.deliverer.order.details.toast.change_status_success'), theme.success);
				update_change_status();
				show_change_status_popup = false;
			}
			else
			{
				toast.push($_('page.deliverer.order.details.toast.change_status_failed'), theme.error);
				show_change_status_popup = false;
			}
		})
	}

</script>


<svelte:head>
	<title>{$_('page.deliverer.order.details.title')} | ROSWEL-TH</title>
</svelte:head>

<Geolocation getPosition bind:position />

<BottomNav bind:btn_1_action bind:btn_2_action bind:btn_3_action bind:btn_4_action bind:btn_1_txt bind:btn_2_txt bind:btn_3_txt bind:btn_4_txt>
	<div slot="content">
		{#if current_view == 'item_list'}
			
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
		{:else if current_view == 'order_info'}

			<DetailCard extra_class="mb-6">
				<span class="text-lg" slot="heading">
					{$_('page.order.order_details.content.order_info.heading')}
				</span>

				<itemGroup slot="rows">
					<DetailCardItem>
						<span class="text-lg" slot="key">
							{$_('page.deliverer.order.details.content.order_info.order_status')}
						</span>

						<span class="font-bold text-2xl" slot="value">
							{order_data.status}
						</span>
					</DetailCardItem>
					<DetailCardItem type="even">
						<span class="text-lg" slot="key">
							{$_('page.deliverer.order.details.content.order_info.store_location')}
						</span>

						<span class="text-lg" slot="value">
							{@html store_location_map_url} / {@html store_query_map_url}
						</span>
					</DetailCardItem>
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
		<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 mx-auto" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 17h-12v-2h12v2zm0-4h-12v-2h12v2zm0-4h-12v-2h12v2z"/></svg>
	</div>

	<div slot="btn_2_svg">
		<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 mx-auto" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 17.981h-13l-7 5.02v-5.02h-4v-16.981h24v16.981zm-2-14.981h-20v12.981h4v3.125l4.357-3.125h11.643v-12.981zm-9 6.001v5h-2v-5h2zm-1-1.5c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25z"/></svg>
	</div>

	<div slot="btn_3_svg">
		<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-2 mx-auto" viewBox="0 0 24 24"><path d="M18.48 22.926l-1.193.658c-6.979 3.621-19.082-17.494-12.279-21.484l1.145-.637 3.714 6.467-1.139.632c-2.067 1.245 2.76 9.707 4.879 8.545l1.162-.642 3.711 6.461zm-9.808-22.926l-1.68.975 3.714 6.466 1.681-.975-3.715-6.466zm8.613 14.997l-1.68.975 3.714 6.467 1.681-.975-3.715-6.467z"/></svg>
	</div>

	<div slot="btn_4_svg">
		{#if get_deliverer_next_status(deliverer_current_status) == delivererChangableStatus.headingToStore}
			<!-- not possible -->
			{@html xvg_going} 
		{:else if get_deliverer_next_status(deliverer_current_status) == delivererChangableStatus.packageReceived}
			{@html xvg_received}
		{:else if get_deliverer_next_status(deliverer_current_status) == delivererChangableStatus.inTransit}
			{@html xvg_transit}
		{:else if get_deliverer_next_status(deliverer_current_status) == delivererChangableStatus.complete}
			{@html xvg_complete}
		{/if}
		
	</div>
</BottomNav>



<PopupAlert 
	bind:show_popup={show_change_status_popup}
	title={"Change Status"}
	description={"Do you want to change the status to " + get_deliverer_next_status(deliverer_current_status) + "?"}
	btn_1_action={change_to_next_status}
	btn_1_txt={"Confirm Change"}
	btn_2_action={() => {show_change_status_popup = false}}
	btn_2_txt={"No"}
/>
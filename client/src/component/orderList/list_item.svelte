<script lang="ts">
	import PopupAlert from "../util/popup_alert.svelte";
	import { goto } from "@roxi/routify";
	import moment from 'moment';
	import { acceptOrder } from '../../services/deliverer'
	import { toast } from "@zerodevx/svelte-toast";
	import { theme } from "../../constants/toastTheme";
	import { getStore, getStoreItem } from '../../services/store'
	
	export let item;
	export let btn_click = function () {
		$goto('/order/' + item.id);
	};
	export let btn_txt = "View"

	let popup_title;
	let popup_desc;
	let show_popup = false;
	
	
	let col1_txt = 0;
	for(let i = 0; i < item.orderItem.length; i++) {
		col1_txt += item.orderItem[i].amount
		console.log('item ' + + i + ' order amnt: ' + item.orderItem[i].amount)
	}
	let col2_txt = item.totalPrice + item.tipAmount
	let col3_txt = moment(item.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
	//export let status_txt_field = 'status'
	export let col4_txt = item.status;

	export let mode = 'order_list'; //bulletin,order_list,deliverer_order_list

	export let lat;
	export let long;

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

	let store_long;
	let store_lat;

	
	

	let storeItem_id = item.orderItem[0].storeItem_id;
	//bad hack
	getStoreItem(storeItem_id).then((ret) => {
		if(ret)
		{
			getStore(ret.for_store_id).then((ret2) => {
				store_long = ret2.store.locationLatLong.coordinates[0];
				store_lat = ret2.store.locationLatLong.coordinates[1];
			});
		}
	});

	function do_accept_order() {
		acceptOrder(item.id,String(lat),String(long)).then((ret) => {
			if(ret)
			{
				toast.push('Successfully accept the order', theme.success)
				$goto('/deliverer/order/' + item.id);
			}
			else
			{
				toast.push('Failed to accept the order', theme.error)
				// failed
			}
		});
	}

	if(mode === 'bulletin')
	{
		btn_click = function () {
			popup_title = "Accepting Order"
			popup_desc = "discount: " + item.discountAmount + " Tip: " + item.tipAmount + " Total: " + col2_txt + " Displacement: " + getDistanceFromLatLonInKm(lat,long,store_lat,store_long) + " km";
			show_popup = true;
		};

		btn_txt = 'Accept Order'
		col4_txt = item.tipAmount
	}
	else if(mode === 'order_list')
	{

	}
	else if(mode === 'deliverer_order_list')
	{
		btn_click = function () {
			$goto('/deliverer/order/' + item.id);
		};
	}

</script>

<tr>
	<td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
		<div class="flex items-center">
			<div class="flex-shrink-0">
				<!-- <div href="#" class="block relative">
					<img alt="profil" src="/images/person/8.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
				</div> -->
			</div>
			<div class="ml-3">
				<p class="text-gray-900 whitespace-no-wrap">
					{col1_txt}
				</p>
			</div>
		</div>
	</td>
	<td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
		<p class="text-gray-900 whitespace-no-wrap">
			{col2_txt}
		</p>
	</td>
	<td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
		<p class="text-gray-900 whitespace-no-wrap">
			{col3_txt}
		</p>
	</td>
	<td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
		<span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
			<span aria-hidden="true" class="absolute inset-0 bg-green-200 opacity-50 rounded-full">
			</span>
			<span class="relative">
				{col4_txt}
			</span>
		</span>
	</td>
	<td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
		<button on:click|stopPropagation={btn_click} class="text-indigo-600 hover:text-indigo-900">
			{btn_txt}
		</button>
	</td>
</tr>

<PopupAlert 
	bind:show_popup
	title={popup_title}
	description={popup_desc}
	btn_1_action={do_accept_order}
	btn_1_txt={"Accept Order"}
	btn_2_action={() => {show_popup = false}}
	btn_2_txt={"Close"}
/>
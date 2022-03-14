<script lang="ts">
	import { fade } from 'svelte/transition'
	import Geolocation from 'svelte-geolocation'
	import { _ } from 'svelte-i18n';
	import { toast } from "@zerodevx/svelte-toast";
	import { theme } from "../../constants/toastTheme";
	import { updateOpenTime, createStore } from '../../services/storeManager'
	
	let dateQuantity = 1

	let storeDetails = {
		name: '',
		locationText: '',
		locationLat: 0,
		locationLong: 0,
		//locationLatLong: '',
		locationSearchQuery: '',
		//img: '',
		availableTime: [],
	}

	// let storeImg = "";
	let storeAvailableTime = ''
	/*
		[
			Mon,9:00,18:00,
			Tue,9:00,18:00,
			Wed,9:00,18:00,
			Thur,9:00,18:00,
			Fri,9:00,18:00,
			Sat,10:00,17:00,
			Sun,10:00,17:00
		]
		*/

	const daysList = [
		['Monday', 'Mon', 'yellow-300'],
		['Tuesday', 'Tue', 'pink-500'],
		['Wednesday', 'Wed', 'green-500'],
		['Thursday', 'Thur', 'amber-500'],
		['Friday', 'Fri', 'sky-500'],
		['Saturday', 'Sat', 'violet-500'],
		['Sunday', 'Sun', 'rose-600'],
	]

	let tickedStoreAvailableTime = []


	let tempStoreAvailableTime = {
		Mon: {
			start: '',
			end: '',
		},
		Tue: {
			start: '',
			end: '',
		},
		Wed: {
			start: '',
			end: '',
		},
		Thur: {
			start: '',
			end: '',
		},
		Fri: {
			start: '',
			end: '',
		},
		Sat: {
			start: '',
			end: '',
		},
		Sun: {
			start: '',
			end: '',
		},
	}

	let enableSearchQuery = false
	let getPosition = false

	let geo_coords
	let geo_success

	// setInterval(() => {
	// 	console.log('getPosition' + getPosition);
	// 	console.log(geo_success);
	// 	console.log(geo_coords);
	// }, 1000)

	function getGeoLocation() {
		getPosition = true
		// $: geolocation?.getGeolocationPosition({ enableHighAccuracy: true });
	}

	$: if (geo_success) {
		storeDetails.locationLat = geo_coords[1] //geo_coords => [longitude, latitude]
		storeDetails.locationLong = geo_coords[0] //geo_coords => [longitude, latitude]
		console.log(geo_coords)
		// console.log(geo_success);
		setTimeout(() => {
			getPosition = false
		}, 1000)
	}

	function addStoreProcess() {
		// console.log(tickedStoreAvailableTime)
		// console.log(tempStoreAvailableTime)
		for (let i in tempStoreAvailableTime) {
			if (
				tempStoreAvailableTime[i].start != '' &&
				tempStoreAvailableTime[i].end != ''
			) {
				storeDetails.availableTime.push(
					i +
						',' +
						tempStoreAvailableTime[i].start +
						',' +
						tempStoreAvailableTime[i].end
				)
			}
		}
		console.log(storeDetails)

		//send to the backend
		createStore(storeDetails.name, storeDetails.locationText, storeDetails.locationSearchQuery, String(storeDetails.locationLat), String(storeDetails.locationLong)).then((res:any) => {
			if(res !== false)
			{
				toast.push($_('page.store_manager.create_store.toast.create_store_success'), theme.success);
				//save store available time
				if(storeDetails.availableTime.length > 0)
				{
					updateOpenTime(res, storeDetails.availableTime).then((res2) => {
						toast.push($_('page.store_manager.create_store.toast.update_time_success'), theme.success);
					});
				}
			}
			else
			{
				toast.push($_('page.store_manager.create_store.toast.create_store_failed'), theme.error);
			}
		})

	}

	//Showing a location in a native map app
	//	geo:longitude,laditude
	//navigate using gMap:
	//	http://maps.google.com/maps?daddr=18.802106,98.966708
	//	google.navigation:q=18.802106,98.966708
</script>

<svelte:head>
  <title>{$_('page.store_manager.create_store.title')} | ROSWEL-TH</title>
</svelte:head>


<div>
	<div
		class="flex flex-col w-lg px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10"
	>
		<div
			class="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white"
		>
			{$_('page.store_manager.create_store.content.title')}
		</div>

		<div class="p-6 mt-8">
			<div id="create_store_wrapper">
				<div class="flex flex-col mb-2">
					<div class=" relative ">
						<input
							type="text"
							bind:value="{storeDetails.name}"
							placeholder="Store Name"
							class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
						/>
					</div>
				</div>
				
				<div class="flex flex-col mb-2">
					<div class=" relative ">
						<input
							type="text"
							bind:value="{storeDetails.locationText}"
							placeholder="Direction Explaination"
							class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
							/>
					</div>
				</div>

				<div class="flex gap-4 mb-2">
					<div class=" relative ">
						<span class="py-2 px-4 shadow-sm text-base "> Latitude </span>
						<input
							class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
							type="number"
							min="-90.0"
							max="90.0"
							step="any"
							bind:value="{storeDetails.locationLat}"
							placeholder="Location Latitude"
						/>
					</div>
					<div class=" relative ">
						<span class="py-2 px-4 shadow-sm text-base "> Longitude </span>
						<input
							class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
							type="number"
							min="-180.0"
							max="180.0"
							step="any"
							bind:value="{storeDetails.locationLong}"
							placeholder="Location Latitude"
						/>
					</div>

					
					<button on:click="{getGeoLocation}" type="button" class="py-4 px-6  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-36 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full">
						{$_('page.store_manager.create_store.content.get_location')}
					</button>

					<Geolocation
						getPosition="{getPosition}"
						bind:coords="{geo_coords}"
						bind:success="{geo_success}"
					/>

				</div>

				<div class="font-bold">
					{ $_('page.store_manager.create_store.content.opening_hours') }
				</div>

				<div class="flex items-left justify-left mt-6">
					

					<div>

						{#each daysList as [fullDay, day, color]}

							<label class="flex items-left space-x-3 mb-3">
								<input
									type="checkbox"
									name="checked-demo"
									bind:group="{tickedStoreAvailableTime}"
									value="{day}"
									class="form-tick appearance-none bg-white bg-check h-6 w-6 border border-gray-300 rounded-md checked:bg-{color} checked:border-transparent focus:outline-none"
								/>
								<span class="text-gray-700 dark:text-white font-normal">
									{fullDay}
								</span>
							</label>
							{#if tickedStoreAvailableTime.includes(day)}
								<span transition:fade="{{ duration: 200 }}">
									<input
										type="time"
										bind:value="{tempStoreAvailableTime[day].start}"
										placeholder="Open Time"
									/>
									<input
										type="time"
										bind:value="{tempStoreAvailableTime[day].end}"
										placeholder="Close Time"
									/>
								</span>
							{/if}
							<br />
						{/each}
						
						
						
					</div>
				</div>


				<div class="flex w-full my-4">
					<button
						on:click={addStoreProcess}
						type="submit"
						class="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
					>
						{$_('page.store_manager.create_store.content.add_a_new_store')}
					</button>
				</div>
			</div>
			
		</div>
	</div>
</div>

<!-- 
<div id="addStoreForm">
	<input
		type="text"
		bind:value="{storeDetails.name}"
		placeholder="Store Name"
	/><br />
	<input
		type="text"
		bind:value="{storeDetails.locationText}"
		placeholder="Direction Explaination"
	/><br />
	<input
		type="number"
		min="-90"
		max="90"
		bind:value="{storeDetails.locationLat}"
		placeholder="Location Latitude"
	/><br />
	<input
		type="number"
		min="-180"
		max="180"
		bind:value="{storeDetails.locationLong}"
		placeholder="Location Latitude"
	/><br />
	<button on:click="{getGeoLocation}"> Get geolocation </button>

	<Geolocation
		getPosition="{getPosition}"
		bind:coords="{geo_coords}"
		bind:success="{geo_success}"
	/>

	<div>
		<input
			type="checkbox"
			id="enableSearchQueryBox"
			bind:checked="{enableSearchQuery}"
		/>
		<label for="enableSearchQueryBox">Enable Map Search Query</label><br />

		{#if enableSearchQuery}
			<input
				transition:fade
				type="text"
				bind:value="{storeDetails.locationSearchQuery}"
				placeholder="Map Search Query"
			/><br />
		{/if}
	</div>

	<div id="avaliableDateWrapper">
		{#each daysList as [fullDay, day, color]}
			<input
				type="checkbox"
				id="daySelector_{day}"
				bind:group="{tickedStoreAvailableTime}"
				value="{day}"
			/>
			<label for="daySelector_{day}">
				{fullDay}
			</label>
			{#if tickedStoreAvailableTime.includes(day)}
				<span transition:fade>
					<input
						type="time"
						bind:value="{tempStoreAvailableTime[day].start}"
						placeholder="Open Time"
					/>
					<input
						type="time"
						bind:value="{tempStoreAvailableTime[day].end}"
						placeholder="Close Time"
					/>
				</span>
			{/if}
			<br />
		{/each}
	</div>
</div>

<div>
	<button on:click="{addStoreProcess}"> Add Store </button>
</div> -->


<!-- Just to let tailwind generate the damn color -->
<input type="checkbox" class="checked:bg-yellow-300" style="display: none;"/>
<input type="checkbox" class="checked:bg-pink-500" style="display: none;"/>
<input type="checkbox" class="checked:bg-green-500" style="display: none;"/>
<input type="checkbox" class="checked:bg-amber-500" style="display: none;"/>
<input type="checkbox" class="checked:bg-sky-500" style="display: none;"/>
<input type="checkbox" class="checked:bg-violet-500" style="display: none;"/>
<input type="checkbox" class="checked:bg-rose-600" style="display: none;"/>
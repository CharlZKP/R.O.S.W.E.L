<script lang="ts">
	import { _ } from 'svelte-i18n'

	export let item_id = "";
	export let item_name = "";
	export let name_click_action:any = false;
	export let item_option_txt = "";
	export let quantity_txt = $_('component.basket.item.quantity');//"Qty";
	export let quantity = 1;
	export let item_price = 0;
	export let item_image = "/dist/image/general/no_image.jpg"; //https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg
	export let btn_action = function () {};
	export let btn_text = $_('component.basket.item.remove');
	export let price_unit = $_('component.basket.item.thb');//THB

	export let warning_txt = "";

	$: if(item_image === null || typeof item_image === "undefined" || item_image === ""){
		item_image = "/dist/image/general/no_image.jpg";
	}



	function click_on_name()
	{
		if(typeof name_click_action === "function")
		{
			name_click_action();
		}
	}

</script>


<li class="py-6 flex">
	<div
		class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden"
	>
		<img
			src="{item_image}"
			alt="Item Image"
			class="w-full h-full object-center object-cover"
		/>
	</div>

	<div class="ml-4 flex-1 flex flex-col">
		<div>
			<div
				class="flex justify-between text-base font-medium text-gray-900"
			>
				<h3>
					<span class:cursor-pointer={(typeof name_click_action === 'function')} on:click|stopPropagation={click_on_name}> {item_name} </span>
				</h3>
				<p class="ml-4">{item_price} {price_unit}</p>
			</div>
			<p class="mt-1 text-sm text-gray-500">{item_option_txt}</p>
		</div>
		<div class="flex-1 flex items-end justify-between text-sm">
			<p class="text-gray-500">{quantity_txt} {quantity}
				{#if warning_txt.length > 0}
					<!-- <span data-tooltip-target="tooltip-light" data-tooltip-style="light" class="inline-block px-2 py-1 text-base rounded text-white  font-medium w-2">
						
					</span>
					<div id="tooltip-light" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 shadow-sm opacity-0 tooltip">
						Tooltip content
						<div class="tooltip-arrow" data-popper-arrow></div>
					</div> -->
					<svg class="fill-yellow-300 inline-block" width="20" height="20" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
						viewBox="0 0 612.002 612.002" style="enable-background:new 0 0 612.002 612.002;" xml:space="preserve">
						<g>
							<path d="M512.376,584.192H99.624c-35.959,0-68.162-18.593-86.14-49.732s-17.981-68.325,0-99.467L219.862,77.542
								c17.978-31.139,50.181-49.732,86.14-49.732s68.162,18.593,86.14,49.732l206.375,357.451c17.981,31.142,17.981,68.325,0,99.467
								S548.333,584.192,512.376,584.192z M306.002,56.396c-25.625,0-48.571,13.25-61.384,35.439L38.241,449.286
								c-12.812,22.192-12.81,48.689,0,70.88s35.759,35.439,61.384,35.439h412.749c25.625,0,48.571-13.25,61.384-35.439
								c12.812-22.189,12.812-48.689,0-70.88L367.383,91.835C354.573,69.643,331.627,56.396,306.002,56.396z M555.493,450.902
								L356.5,106.234c-10.54-18.258-29.418-29.155-50.498-29.155c-21.083,0-39.961,10.9-50.501,29.155L56.507,450.902
								c-10.543,18.258-10.54,40.055,0,58.311c10.54,18.255,29.418,29.155,50.501,29.155h397.987c21.083,0,39.961-10.9,50.501-29.155
								C566.036,490.957,566.033,469.157,555.493,450.902z M269.963,213.788c0-19.87,16.166-36.036,36.036-36.036
								s36.036,16.166,36.036,36.036v116.947c0,19.871-16.166,36.036-36.036,36.036s-36.036-16.166-36.036-36.036V213.788z
								M305.999,473.068c-20.362,0-36.928-16.566-36.928-36.928s16.566-36.928,36.928-36.928s36.928,16.566,36.928,36.928
								S326.361,473.068,305.999,473.068z"/>
						</g>
					</svg>
				{/if}
			</p>


			<div class="flex">
				<button
					on:click|stopPropagation="{btn_action}"
					type="button"
					class="font-medium text-indigo-600 hover:text-indigo-500"
					>{btn_text}</button
				>
			</div>
		</div>
	</div>
</li>

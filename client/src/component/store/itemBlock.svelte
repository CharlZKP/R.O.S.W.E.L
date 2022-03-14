<script lang="ts">

	export let item_name = "";
	export let item_description = "";
	export let item_price = 0;
	export let item_image = "/dist/image/general/no_image.jpg";
	export let btn_action = function () {};
	export let btn_text = "";

	if(item_image === null)
	{
		item_image = "/dist/image/general/no_image.jpg";
	}

</script>




<div class="shadow-lg rounded-2xl  bg-white w-64 m-auto p-2">
	<img src="{item_image}" alt="item image" class="w-32 p-4 h-36 m-auto"/>
	<div class="bg-red-300 m-3 p-4 rounded-lg">
		<p class="text-black text-xl font-bold ">
			{item_name}
		</p>
		<p class="text-black text-xs">
			{item_description}
		</p>
		<div class="flex items-center justify-between ">
			<p class="text-black">
				{item_price} THB
			</p>
			<button on:click|stopPropagation="{btn_action}" type="button" class="w-10 h-10 text-base font-medium rounded-full text-white bg-amber-900 hover:bg-amber-900">
				{#if btn_text.length == 0}
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="mx-auto" fill="white" viewBox="0 0 1792 1792">
						<path d="M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z">
						</path>
					</svg>
				{:else}
					{btn_text}
				{/if}
				
			</button>
		</div>
	</div>
</div>

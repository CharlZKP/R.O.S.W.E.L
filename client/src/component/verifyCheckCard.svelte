<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from "@roxi/routify";
	import GreenTick from './util/green_tick.svelte';
	import RedX from './util/red_x.svelte';
	export let email_verified = false;
	export let phone_verified = false;

	let percentage = 0;

	if((email_verified && phone_verified)) {
		percentage = 100;
	} else if((!email_verified && phone_verified) || (email_verified && !phone_verified) ){
		percentage = 50;
	} else if(!email_verified && !phone_verified) {
		percentage = 0;
	}
	
	let Email_icon = email_verified ? GreenTick : RedX;
	let Phone_icon = phone_verified ? GreenTick : RedX;

</script>



<div class="shadow-lg rounded-2xl w-64 bg-white dark:bg-gray-800 p-4">
	<p class="text-gray-800 dark:text-gray-50 text-xl font-medium mb-4">
		{$_('component.verify_check_card.title')}
	</p>
	<div class="text-gray-900 dark:text-white text-3xl font-bold">
		<div>
			<div class="bg-white rounded-lg w-56 shadow block p-4 m-auto">
				<div class="w-full h-4 bg-gray-400 rounded-full">
					<div class="w-1/2 h-full text-center text-xs text-white bg-green-500 rounded-full" class:hidden={(percentage <= 0)} class:w-full={(percentage == 100)}>
						{percentage}%
					</div>
				</div>
			</div>
		</div>
	</div>
	<ul class="text-sm text-gray-600 dark:text-gray-100 w-full mt-6 mb-6">
		<li class="mb-3 flex items-center ">
			<Email_icon />
			{$_('component.verify_check_card.with_email')}
		</li>
		<li class="mb-3 flex items-center ">
			<Phone_icon />
			{$_('component.verify_check_card.with_phone')}
		</li>
	</ul>

	{#if !phone_verified}
		<button on:click={() => { $goto('/phone-verify')}} type="button" class="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
			{$_('component.verify_check_card.to_phone_verify')}
		</button>
	{/if}
	
</div>

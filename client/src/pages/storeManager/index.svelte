<script lang="ts">
	import { goto } from '@roxi/routify'
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
  <title>{$_('page.store_manager.index.title')} | ROSWEL-TH</title>
</svelte:head>


<div class="w-[48%] inline-block">

	<div class="rounded-lg shadow-lg overflow-hidden mb-4">
		<div class="px-6 py-8 h-full bg-white dark:bg-gray-800 sm:p-10 sm:pb-6">
			
			<button on:click={$goto('./create-store')} type="button" class="text-9xl pb-12 py-2 px-4 h-full bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  opacity-70 cursor-pointer rounded-lg ">
				{$_('page.store_manager.index.content.create_store')}
			</button>

		</div>

	</div>

</div>

<div class="w-[48%] inline-block">

	<div class="rounded-lg shadow-lg overflow-hidden mb-4">
		<div class="px-6 py-8 h-full bg-white dark:bg-gray-800 sm:p-10 sm:pb-6">
			
			<button on:click={$goto('./edit-store')} type="button" class="text-9xl pb-12 py-2 px-4 h-full bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  opacity-70 cursor-pointer rounded-lg ">
				{$_('page.store_manager.index.content.edit_store')}
			</button>

		</div>

	</div>

</div>
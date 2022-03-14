<script lang="ts">
	import { _ } from 'svelte-i18n';
    import { verificationEmailRequest } from '../../services/verification';

    function resend_verification_code()
    {
        verificationEmailRequest();
    }
</script>

<svelte:head>
	<title>{$_('page.email-verify.index.title')} | ROSWEL-TH</title>
</svelte:head>

<div class="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-800 w-64 mt-16 m-auto">
	<div class="w-full h-full text-center">
		<div class="flex h-full flex-col justify-between">
			<svg class="h-12 w-12 mt-4 m-auto text-green-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
				</path>
			</svg>
			<p class="text-gray-600 dark:text-gray-100 text-md py-2 px-6">
				{$_('page.email-verify.index.content.how_to')}
			</p>
			<div class="flex items-center justify-between gap-4 w-full mt-8">
				<button 
					type="button" class="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
					on:click={resend_verification_code}
				>
					{$_('page.email-verify.index.content.resend_btn')}
				</button>
			</div>
		</div>
	</div>
</div>



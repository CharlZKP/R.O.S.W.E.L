
<script lang="ts">
	import { params } from '@roxi/routify'
	import { userInfo } from '../../stores/userInfo'
	import { goto } from '@roxi/routify'
	import { verificationEmailVerify } from '../../services/verification'
	import { _ } from 'svelte-i18n';


	userInfo.useLocalStorage();
	
	
	console.log('params:');
	console.log($params.code);
	let verificationCode = $params.code;
	console.log('code: ' + verificationCode);

	let color_success = false;

	let verificationResultTxt = '';
	
	verificationEmailVerify(verificationCode).then((result) => {

		if(result === 1)
		{
			console.log('Verification success');
			//TODO: show success message
			verificationResultTxt = $_('page.email-verify.code_page.content.success_txt');
			color_success = true;
		}
		else
		{
			console.log('Verification failed');
			console.log(result);
			
			if(result === "Incorrect code")
			{
				verificationResultTxt = $_('page.email-verify.code_page.content.incorrect_code');
			}
			else
			{
				verificationResultTxt = result;
			}
		}
	})
	
</script>


<svelte:head>
	<title>{$_('page.email-verify.code_page.title')} | ROSWEL-TH</title>
</svelte:head>


<div class="relative">
    <div class="h-screen w-full z-10 inset-0 overflow-y-auto">
        <div class="absolute w-full h-full inset-0 bg-gray-500 opacity-75">
        </div>
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            </span>
            <div class="inline-block relative overflow-hidden transform transition-all sm:align-middle sm:max-w-lg" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div>
                    <div class="rounded-lg p-8 bg-white shadow">
                        <div class="bg-white dark:bg-gray-800 ">
                            <div class="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
                                <h2 class="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
                                    <span class="block">
                                        Verification:
                                    </span>
                                    <span class="block" class:text-red-500={color_success !== true} class:text-green-500={color_success === true}>
                                        {verificationResultTxt}
                                    </span>
                                </h2>
                                <div class="lg:mt-0 lg:flex-shrink-0">
                                    <div class="mt-12 inline-flex rounded-md shadow">
                                        <button on:click={() => { $goto('/customer/dashboard') }} type="button" class="py-4 px-6  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                            {$_('page.email-verify.code_page.content.back_to_dashboard')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>




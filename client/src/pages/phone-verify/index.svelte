<script lang="ts">
import { onMount } from 'svelte'
import { toast } from "@zerodevx/svelte-toast";
import { theme } from "../../constants/toastTheme";
import { verificationPhoneRequest, verificationPhoneVerify } from '../../services/verification'
import { _ } from 'svelte-i18n';
import { userInfo } from '../../stores/userInfo'
import { goto } from "@roxi/routify";

userInfo.useLocalStorage();

let phone_no: string = "";
let phone_no_input:string;

function check_phone_no_input() {
	return /^((\+66|0)(\d{1,2}\-?\d{3}\-?\d{3,4}))$/.test(phone_no_input)
}

function send_otp_request_process()
{
	if(check_phone_no_input())
	{
		//send phone otp request
		verificationPhoneRequest(phone_no_input).then((result) => {
			if(result === 1)
			{
				toast.push($_('page.phone-verify.toast.request.success'), theme.success);
				phone_no = phone_no_input;
			}
		});
	}
	else
	{
		toast.push("Invalid phone number type", theme.error);
	}
}




function getOTPCodeInput()
{
	let otp_code = "";
	const inputs = document.querySelectorAll('#otp > *[id]')
	for (let i = 0; i < inputs.length; i++) {
		// @ts-ignore
		otp_code += inputs[i].value;
	}

	if(otp_code.length !== 6)
	{
		return false;
	}
	
	return otp_code;
}


function confirm_otp_process()
{
	let otp_code = getOTPCodeInput();
	if(otp_code === false)
	{
		toast.push($_('page.phone-verify.toast.invalid_otp_code'), theme.error);
		return;
	}

	verificationPhoneVerify(otp_code).then((result) => {
		if(result === 1)
		{
			toast.push($_('page.phone-verify.toast.verify.success'), theme.success);
			phone_no = phone_no_input;
			$goto("/customer/dashboard");
		}
	});
}

//get last 4 character
// function getLastNChar(text: string, num: number = 4) {
// 	return text.slice(text.length - num);
// }

let otp_input_listener_added = false;

// $: if(phone_no != "" && !otp_input_listener_added)
// {
// 	OTPInput();
// }

function OTPInput() {
	//console.log("OTPInput add event listener");
	otp_input_listener_added = true;
	const inputs = document.querySelectorAll('#otp > *[id]')
	//console.log('inputs n: ', inputs.length);
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('keydown', function (event) {
			//@ts-ignore
			if (event.key === 'Backspace') {
				//@ts-ignore
				inputs[i].value = ''
				//@ts-ignore
				if (i !== 0) inputs[i - 1].focus()
			} else {
				//@ts-ignore
				if (i === inputs.length - 1 && inputs[i].value !== '') {
					return true
					//@ts-ignore
				} else if (event.keyCode > 47 && event.keyCode < 58) {
					//@ts-ignore
					inputs[i].value = event.key
					//@ts-ignore
					if (i !== inputs.length - 1) inputs[i + 1].focus()
					event.preventDefault()
					//@ts-ignore
				} else if (event.keyCode > 64 && event.keyCode < 91) {
					//@ts-ignore
					inputs[i].value = String.fromCharCode(event.keyCode)
					//@ts-ignore
					if (i !== inputs.length - 1) inputs[i + 1].focus()
					event.preventDefault()
					//@ts-ignore
				} else if (event.keyCode >= 96 && event.keyCode <= 105) {
					//@ts-ignore
					inputs[i].value = String(event.keyCode-96)
					//@ts-ignore
					if (i !== inputs.length - 1) inputs[i + 1].focus()
					event.preventDefault()
				}
			}
		})
	}
}

onMount(() => {
	OTPInput()
})

</script>


<svelte:head>
	<title>{$_('page.phone-verify.title')} | ROSWEL-TH</title>
</svelte:head>



{#if $userInfo.phoneNoConfirmed === true}
	<!-- If verified -->

<div class="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-800 w-64 mt-16 m-auto">
	<div class="w-full h-full text-center">
		<div class="flex h-full flex-col justify-between">
			<svg class="h-12 w-12 mt-4 m-auto text-green-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
				</path>
			</svg>
			<p class="text-gray-600 dark:text-gray-100 text-md py-2 px-6">
				{$_('page.phone-verify.content.verified.title')}
			</p>
			<div class="flex items-center justify-between gap-4 w-full mt-8">
				<button 
					type="button" class="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
					on:click={$goto('/customer/dashboard')}
				>
					{$_('page.phone-verify.content.verified.go_to_dashboard')}
				</button>
			</div>
		</div>
	</div>
</div>

{:else if phone_no.length == 0}
	<!-- If not -> haven't sent the OTP yet -->
	<center>
		<div class="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">
			<div>
				<h2 class="text-gray-800 text-3xl font-semibold mb-5">
					{$_('page.phone-verify.content.request.title')}
				</h2>
				<form
					on:submit|preventDefault={() => {}}
					class="flex flex-col md:flex-row w-3/4 md:w-full max-w-sm md:space-x-3 space-y-3 md:space-y-0 justify-center"
				>
					<div class=" relative ">
						<input
							type="text"
							class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
							placeholder="Phone Number"
							bind:value={phone_no_input}
						/>
					</div>
					<button
						class="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
						type=""
						on:click={send_otp_request_process}
						
					>
						{$_('page.phone-verify.content.request.send_otp')}
					</button>
				</form>
			</div>
			<div class="flex justify-end mt-4">
				<span class="text-xl font-medium text-indigo-500 cursor-pointer" on:click={() => phone_no = " "}>
					{$_('page.phone-verify.content.request.already_have_a_code')}
				</span>
			</div>
		</div>
	</center>
{:else}
	<!-- Moved out -->
{/if}
	<!-- code sent, start verify -->
	<div class="py-20 px-3" class:hidden="{( phone_no.length == 0)}">
		<div class="container mx-auto">
			<div class="max-w-sm mx-auto md:max-w-lg">
				<div class="w-full">
					<div class="bg-[#f9eedc] h-80 py-3 rounded text-center">
						<h1 class="text-2xl font-bold">{$_('page.phone-verify.content.verify.title')}</h1>
						<div class="flex flex-col mt-4">
							<span
								>{$_('page.phone-verify.content.verify.enter_label')}</span
							>
							<span class="font-bold">{ phone_no }</span>
						</div>
						<div
							id="otp"
							class="flex flex-row justify-center text-center px-2 mt-5 font-bold"
						>
							<input
								class="m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="first"
								maxlength="1"
							/>
							<input
								class="m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="second"
								maxlength="1"
							/>
							<input
								class="m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="third"
								maxlength="1"
							/>
							<input
								class="m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="fourth"
								maxlength="1"
							/>
							<input
								class="m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="fifth"
								maxlength="1"
							/>
							<input
								class="m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="sixth"
								maxlength="1"
							/>
						</div>
						<div class="flex justify-center text-center mt-5">
							<button
								type="button"
								class="py-2 px-4 w-40 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full"
								on:click={confirm_otp_process}
							>
								{$_('page.phone-verify.content.verify.verify_button')}
							</button>
						</div>
						<div class="flex justify-center text-center mt-5">
							<button
								class="flex items-center text-blue-700 hover:text-blue-900 cursor-pointer"
							>
								<span class="font-bold" on:click={() => phone_no = ""}>{$_('page.phone-verify.content.verify.resend_otp')}</span>
								<i class="bx bx-caret-right ml-1"> </i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


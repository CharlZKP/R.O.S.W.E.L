<script>
// const urlParams = new URLSearchParams(window.location.search)
// const userId = urlParams.get('userId')

import { onMount } from 'svelte'
import { params } from '@roxi/routify'
import { toast } from '@zerodevx/svelte-toast'
import { theme } from '../../../../constants/toastTheme'
import { getAllKYCPending, changeKycStatus, getUserKYC } from '../../../../services/admin'

let kyc;

let fullname
let idCardNo
let idCardImageFront
let idCardImageBack
let selfieImage
let extraImage
let userId = $params.user_id;
let ThaiIDOAuthMatch = false;
let idCardNoSuffix = "";

console.log('user_id: ', userId);

onMount(async () => {
	const res = await getUserKYC(userId)
	if (typeof res.success !== 'undefined' && res.success)
	{
		if(res.hasKYC)
		{
			kyc = res.kyc
			fullname = kyc.firstName + ' ' + kyc.lastName
			idCardNo = kyc.idCardNo
			idCardImageFront = kyc.idCardImage
			idCardImageBack = kyc.idCardImageBack
			selfieImage = kyc.selfieImage
			extraImage = kyc.extraImage
			ThaiIDOAuthMatch = kyc.id_check.kyc_compare_result;
			idCardNoSuffix = kyc.id_check.suffix
		}
		else
		{
			toast.push('This user doesn\'t have KYC information', theme.error)
		}
		
	}
	else
	{
		toast.push('Fail to get KYC', theme.error)
	}
	
})
</script>

{#key kyc}
	<div class="flex justify-center items-center w-screen my-8">
		<div class="w-5/6 flex flex-col justify-center items-center">
			<div
				class="flex-row py-6 w-full bg-purple-600 text-white font-bold text-2xl text-center"
			>
				USER ID: {userId}
			</div>
			<div class="flex-row flex w-full">
				<div class="flex-col flex w-1/2">
					<div
						class="w-full py-6 pl-6 text-[#E01DAF] text-xl font-bold"
					>
						<span class="inline-block mr-2">Full Name</span>
						<input
							class="inline-block border-solid border-b-4 border-[#2EB086] px-4 py-2 text-center"
							bind:value="{fullname}"
							type="text"
						/>
						<!-- <button
							class="ml-2 inline-block bg-yellow-400 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
						>
							EDIT 🔧
						</button> -->
					</div>
				</div>
				<div class="flex-col flex w-1/2">
					<div class="w-full py-6 text-[#E01DAF] text-xl font-bold">
						<span class="inline-block mr-2">ID Card Number</span>
						<input
							class="inline-block border-solid border-b-4 border-[#2EB086] px-4 py-2 text-center"
							bind:value="{idCardNo}"
							type="text"
						/>
						<!-- <button
							class="ml-2 inline-block bg-yellow-400 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
						>
							EDIT 🔧
						</button> -->
					</div>
				</div>
			</div>
			<div class="flex-row flex w-full">
				<div class="flex-col flex w-full">
					<div class="w-full py-6 text-[#E01DAF] text-xl font-bold">
						<span class="inline-block mr-2">Match with CMU OAuth: </span>
						<span class="inline-block ml-2 text-bold" class:text-red-500={ThaiIDOAuthMatch !== true} class:text-green-500={ThaiIDOAuthMatch === true}>{ThaiIDOAuthMatch} ({idCardNoSuffix})</span>
					</div>
				</div>
			</div>
			<div class="flex-row flex w-full h-80">
				<div class="flex-col flex w-1/4">
					<div class="flex h-3/4 w-full">
						<img
							src="{idCardImageFront}"
							alt=""
							class="object-contain w-full h-full"
						/>
					</div>
					<div class="flex h-1/4 w-full">
						<input type="file" class="inline-block" />
					</div>
				</div>
				<div class="flex-col flex w-1/4">
					<div class="flex h-3/4 w-full">
						<img
							src="{idCardImageBack}"
							alt=""
							class="object-contain w-full h-full"
						/>
					</div>
					<div class="flex h-1/4 w-full">
						<input type="file" class="inline-block" />
					</div>
				</div>
				<div class="flex-col flex w-1/4">
					<div class="flex h-3/4 w-full">
						<img
							src="{selfieImage}"
							alt=""
							class="object-contain w-full h-full"
						/>
					</div>
					<div class="flex h-1/4 w-full">
						<input type="file" class="inline-block" />
					</div>
				</div>
				<div class="flex-col flex w-1/4">
					<div class="flex h-3/4 w-full">
						<img
							src="{extraImage}"
							alt=""
							class="object-contain w-full h-full"
						/>
					</div>
					<div class="flex h-1/4 w-full">
						<input type="file" class="inline-block" />
					</div>
				</div>
			</div>
			<div class="flex-row flex w-full justify-center items-center">
				{#if typeof kyc === 'undefined' || kyc.approved_date === null}
					<!-- Approve & deny Button -->
					<button
						class="mx-4 inline-block bg-green-400 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-blue-500 rounded transition-all ease-in-out"
						on:click="{() => changeKycStatus(userId, 'approved')}"
					>
						APPROVE ✔️
					</button>
					<button
						on:click="{() => changeKycStatus(userId, 'rejected')}"
						class="mx-4 inline-block bg-red-400 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-blue-500 rounded transition-all ease-in-out"
					>
						REJECTE ❌
					</button>
				{:else}
					<span
						class="mx-4 inline-block hover:bg-blue-400 hover:text-white font-bold py-2 px-4  rounded"
					>
						APPROVED ✔️: {kyc.approved_date}
						By: {kyc.approved_by_name}
					</span>
				{/if}
				
			</div>
		</div>
	</div>
{/key}

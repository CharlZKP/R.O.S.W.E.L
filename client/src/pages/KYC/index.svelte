<script lang="ts" defer>
import { kycGetInfo, initial, saveChange } from "../../services/kyc";
import { onMount } from "svelte";
import { toast } from "@zerodevx/svelte-toast";

let firstName = "";
let lastName = "";
let idCardNumber = "";
let idCardImageFront, idCardImageBack, selfieImage, extraImage;

let saveChangeBtn = {
	disabled: false,
	txt: "SAVE CHANGES"//"NO CHANGE NEEDED TO BE SAVE"
}


let noneImg = "https://icon-library.com/images/none-icon/none-icon-0.jpg";
let idCardImageBack_bgImage = noneImg;
let idCardImageFront_bgImage = noneImg;
let selfieImage_bgImage = noneImg;
let extraImage_bgImage = noneImg;

onMount(async () => {
	kycGetInfo().then((res:any) => {
		if(res.hasKYC)
		{
			firstName = res.kyc.firstName || "";
			lastName = res.kyc.lastName || "";
			idCardNumber = res.kyc.idCardNo || "";

			
			res.kyc.extraImage ? extraImage_bgImage = (res.kyc.extraImage) : extraImage_bgImage = noneImg;
			res.kyc.idCardImage ? idCardImageFront_bgImage = (res.kyc.idCardImage) : idCardImageFront_bgImage = noneImg;
			res.kyc.idCardImageBack ? idCardImageBack_bgImage = (res.kyc.idCardImageBack) : idCardImageBack_bgImage = noneImg;
			res.kyc.selfieImage ? selfieImage_bgImage = (res.kyc.selfieImage) : selfieImage_bgImage = noneImg;
		}
		else
		{
			initial().then((res2:any) => {
				if (res2.success === true) {
					kycGetInfo().then((res3:any) => {
						if(res3.hasKYC)
						{
							firstName = res3.kyc.firstName || "";
							lastName = res3.kyc.lastName || "";
							idCardNumber = res3.kyc.idCardNo || "";
						}
					});
				}
			});
		}
	});
	
});

const validateIdCard = function (id:any) {
	//https://github.com/jukbot/thai-citizen-id-validator
	
	if(id==null||id.length!==13||!/^[0-9]\d+$/.test(id))return!1;let i,sum=0;for((i=0),(sum=0);i<12;i++)
	{	
		sum+=parseInt(id.charAt(i))*(13-i)
	}
	let check=(11-sum%11)%10;
	if(check===parseInt(id.charAt(12)))
	{	
		return!0
	}
	return!1
	
}

const submit = () => {
	const formData = new FormData();
	if (idCardImageFront != "" && typeof idCardImageFront !== "undefined")
		formData.append("idCardImageFront", idCardImageFront[0]);
	if (idCardImageBack != "" && typeof idCardImageBack !== "undefined")
		formData.append("idCardImageBack", idCardImageBack[0]);
	if (selfieImage != "" && typeof selfieImage !== "undefined")
		formData.append("selfieImage", selfieImage[0]);
	if (extraImage != "" && typeof extraImage !== "undefined")
		formData.append("extraImage", extraImage[0]);

	if(!validateIdCard(idCardNumber))
	{

		return toast.push("Error, ID Card Number is not valid", {
			theme: {
				background: "#a8002d",
				color: "white"
			}
		});
	}
	saveChange(idCardNumber, formData);
};
</script>

<svelte:head>
  <title>KYC | ROSWEL-TH</title>
</svelte:head>

<div class="flex justify-center align-middle mt-10">
	<div class="container mx-auto">
		<div class="grid grid-cols-1 xl:grid-cols-4">
			<div class="xl:col-start-1 xl:col-end-5 px-4 mb-16">
				<div
					class="w-full bg-white rounded-xl overflow-hidden shadow-md p-4 undefined"
				>
					<div
						class="bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white grid items-center w-full h-24 py-4 px-8  shadow-lg-purple undefined"
					>
						<div class="w-full flex items-center justify-between">
							<h2 class="text-white text-2xl">My Account</h2>
						</div>
					</div>
					<div class="p-4 undefined">
						<form on:submit|preventDefault="{submit}">
							<h6
								class="text-purple-500 text-sm mt-3 mb-6 font-light uppercase"
							>
								User Information
							</h6>
							<div class="flex flex-wrap mt-10">
								<div class="w-full lg:w-6/12 pr-4 mb-10 font-light">
									<div class="w-full relative h-11">
										<input
											disabled
											type="text"
											placeholder="First Name"
											bind:value="{firstName}"
											class="px-2 bg-gray-100 w-full h-full text-gray-800 leading-normal shadow-none outline-none focus:outline-none focus:ring-0 focus:text-gray-800 false mt-input-purple-500 mt-input"
										/>
										<label
											class="text-black absolute left-0 -top-10 w-full h-full border border-t-0 border-l-0 border-r-0 border-b-1 border-gray-300 pointer-events-none"
											><span
												class="false absolute top-1/4 transition-all duration-300"
												>First Name</span
											></label
										>
									</div>
								</div>
								<div class="w-full lg:w-6/12 pl-4 mb-10 font-light">
									<div class="w-full relative h-11">
										<input
											disabled
											type="text"
											placeholder="Last name"
											bind:value="{lastName}"
											class="px-2 bg-gray-100 w-full h-full text-gray-800 leading-normal shadow-none outline-none focus:outline-none focus:ring-0 focus:text-gray-800 false mt-input-purple-500 mt-input"
										/>
										<label
											class="text-black absolute left-0 -top-10 w-full h-full border border-t-0 border-l-0 border-r-0 border-b-1 border-gray-300 pointer-events-none"
											><span
												class="false absolute top-1/4 transition-all duration-300"
												>Last Name</span
											></label
										>
									</div>
								</div>
							</div>
							<h6 class="text-purple-500 text-sm my-6 font-light uppercase">
								Information
							</h6>
							<div class="flex flex-wrap mt-10">



								<div class="w-full lg:w-12/12 mb-16 font-light">
									<div class="w-full relative h-11">
										<input
											type="text"
											bind:value="{idCardNumber}"
											placeholder="ID Card Number"
											class="px-2 border-b border-solid border-gray-400 w-full h-full text-gray-800 leading-normal shadow-none outline-none focus:outline-none focus:ring-0 focus:text-gray-800 false mt-input-purple-500 mt-input bg-transparent "
										/>
									</div>
								</div>



								<div class="flex flex-col items-center justify-center max-w-sm mx-auto">
									<div class="w-60 h-60 overflow-hidden bg-gray-300 bg-center bg-cover rounded-lg shadow-md" >
										<!-- svelte-ignore a11y-img-redundant-alt -->
										<img
											src="{idCardImageFront_bgImage}"
											class="object-cover"
											alt="id card image back"
										/>
									</div>

									<div class="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
										<h3 class="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">ID Card Image Front</h3>
											
										<div class="flex items-center justify-between px-3 py-2 bg-gray-200 dark:bg-gray-700">
											
											<span class="font-bold text-gray-800 dark:text-gray-200 w-8">{((typeof idCardImageFront !== "undefined") ? idCardImageFront[0].name : "-")}</span>
											<button class="px-2 py-1 text-xs font-semibold text-white uppercase transition-colors duration-200 transform bg-gray-800 rounded hover:bg-gray-700 dark:hover:bg-gray-600 focus:bg-gray-700 dark:focus:bg-gray-600 focus:outline-none">
												Pick a file
											</button>
											<input type="file" bind:files="{idCardImageFront}" accept=".jpg, .jpeg, .png" class="absolute block opacity-0 pin-r pin-t">
										</div>
									</div>
								</div>




								<div class="flex flex-col items-center justify-center max-w-sm mx-auto">
									<div class="w-60 h-60 overflow-hidden bg-gray-300 bg-center bg-cover rounded-lg shadow-md" >
										<!-- svelte-ignore a11y-img-redundant-alt -->
										<img
											src="{idCardImageBack_bgImage}"
											class="object-cover"
											alt="id card image back"
										/>
									</div>

									<div class="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
										<h3 class="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">ID Card Image Back</h3>
											
										<div class="flex items-center justify-between px-3 py-2 bg-gray-200 dark:bg-gray-700">
											
											<span class="font-bold text-gray-800 dark:text-gray-200 w-8">{((typeof idCardImageBack !== "undefined") ? idCardImageBack[0].name : "-")}</span>
											<button class="px-2 py-1 text-xs font-semibold text-white uppercase transition-colors duration-200 transform bg-gray-800 rounded hover:bg-gray-700 dark:hover:bg-gray-600 focus:bg-gray-700 dark:focus:bg-gray-600 focus:outline-none">
												Pick a file
											</button>
											<input type="file" bind:files="{idCardImageBack}" accept=".jpg, .jpeg, .png" class="absolute block opacity-0 pin-r pin-t">
										</div>
									</div>
								</div>
								
								

								<div class="flex flex-col items-center justify-center max-w-sm mx-auto">
									<div class="w-60 h-60 overflow-hidden bg-gray-300 bg-center bg-cover rounded-lg shadow-md" >
										<!-- svelte-ignore a11y-img-redundant-alt -->
										<img
											src="{selfieImage_bgImage}"
											class="object-cover"
											alt="id card image back"
										/>
									</div>

									<div class="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
										<h3 class="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">Selfie Image</h3>
											
										<div class="flex items-center justify-between px-3 py-2 bg-gray-200 dark:bg-gray-700">
											
											<span class="font-bold text-gray-800 dark:text-gray-200 w-8">{((typeof selfieImage !== "undefined") ? selfieImage[0].name : "-")}</span>
											<button class="px-2 py-1 text-xs font-semibold text-white uppercase transition-colors duration-200 transform bg-gray-800 rounded hover:bg-gray-700 dark:hover:bg-gray-600 focus:bg-gray-700 dark:focus:bg-gray-600 focus:outline-none">
												Pick a file
											</button>
											<input type="file" bind:files="{selfieImage}" accept=".jpg, .jpeg, .png" class="absolute block opacity-0 pin-r pin-t">
										</div>
									</div>
								</div>



								<div class="flex flex-col items-center justify-center max-w-sm mx-auto">
									<div class="w-60 h-60 overflow-hidden bg-gray-300 bg-center bg-cover rounded-lg shadow-md" >
										<!-- svelte-ignore a11y-img-redundant-alt -->
										<img
											src="{extraImage_bgImage}"
											class="object-cover"
											alt="id card image back"
										/>
									</div>

									<div class="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
										<h3 class="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">Extra Image</h3>
											
										<div class="flex items-center justify-between px-3 py-2 bg-gray-200 dark:bg-gray-700">
											
											<span class="font-bold text-gray-800 dark:text-gray-200 w-8">{((typeof extraImage !== "undefined") ? extraImage[0].name : "-")}</span>
											<button class="px-2 py-1 text-xs font-semibold text-white uppercase transition-colors duration-200 transform bg-gray-800 rounded hover:bg-gray-700 dark:hover:bg-gray-600 focus:bg-gray-700 dark:focus:bg-gray-600 focus:outline-none">
												Pick a file
											</button>
											<input type="file" bind:files="{extraImage}" accept=".jpg, .jpeg, .png" class="absolute block opacity-0 pin-r pin-t">
										</div>
									</div>
								</div>

								
							</div>
							<br>
							<div class="flex flex-wrap justify-center align-middle">
								<button
									class="bg-gradient-to-tr from-purple-500 to-purple-700 text-white text-xl px-8 py-4 rounded-lg disabled:bg-purple-400"
									disabled="{saveChangeBtn.disabled}"
								>
									{ saveChangeBtn.txt }
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

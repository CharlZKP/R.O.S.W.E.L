<script lang="ts">
	import { CMUOauthLoginRequest } from "../../services/auth";
	import { toast } from "@zerodevx/svelte-toast";
	import { theme } from "../../constants/toastTheme";
	import { goto } from "@roxi/routify";
	import { _ } from 'svelte-i18n';

	function DoCMUOauthLoginRequest() {
		console.log("Requesting Oauth Login");
		CMUOauthLoginRequest().then((res) => {
			window.location.href = res.url; //TODO uncomment this
		});
	}

	/* FOR FAKE LOGIN */
	import Api from "../../services/Api";
	import { CMUOauthLogin } from "../../services/auth";
	import { userInfo } from "../../stores/userInfo";

	userInfo.useLocalStorage();

	const fake_credentials = {
		student: {
			data: "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",
			loginString: "ef5yMs8k3B2GpEcPAI9lgzYS",
		},
		professor: {
			data: "C/JXjlnKGgFS3082RExqThqA/1n7ZWKqGuKvk51+8F6iX7bK7QevuYdDvn/J7Y47tTjAHJnfk6/l8WrlCkW3sgaVY93m4g4BTEzzc4dc/JUQ0lvYhXtbbT0NALiXGie4gjBX2s5rWUdp/7x5xFn+JbDR22wOzK1UOfzxwRZXfoTlF9ockU5fRkH+lzP+SJhynOQ2JKcp8zI+y8P4arV7hCZa13wJv3dtSPWuyW1kmNPRY9WxLHar1IKRIc8Kxw7EUXd8pY+pnC7eJDtPrFxaDXfVnOLNszkwkBOKIUvyItLYD85AsfOPnQJc00jt8grevWdeuxPHJ4iIuQSkGCtW5m7rnc2nuAiaGs7xz7BK9rHKPRXW5WoeiEWDLQ3cLt7sPI7/dzGMbz2q2/6vJ02vD3B+dw9RvgHE2+pxxZ/kNjmriiFWBTpo9MuMp3wgKThY0bCb7yxGVKoKLAzM5QhYQzHyF85W8dHVRo8pH7s2QhAmx+UUuyyUZtdfoUEiNuX68hxUmkfmj6spe8gsMlduoIRwBapPyeSPtENMStMcRydscqzxISk0JCAD03Lj80XPcBY1ImnkMRxqnRRxroyNHru1HZ3NSVmWKEqv6ISE775g2qVjHaW/ge1DJr5hwgcHwXgHIxZagvAG7HD0d2TUbRRclt2TeB4BlxwZGv0uDZIB75omuUo4flU7eHwLRrfQjkmSW46ijXi5em9ScXgeA2HCog26uDbpzmQtDE/smO/z8/V5+n+LuuDTzkPCQ3tP70APx6E67lquzyInW3JpiSJsZOJAQhtEEMYnK6v5CM6VNb2nDvsEFQNetNhhz8UYO9o/JKvPBtG2yhkjHWupFJMy29N+oLHBxFhUMxwR15WwpQKxk2o7AsreSBH9LHOx9U7NEZX9GVY28vtGFZCINxLcNsP6EjtirrYM5a4cMMGcpNiL4lGAhK1l408O1N0n631b568+b6Q/ehsfb/4iDW0PM0hWRuFS/r1OuXftj498uNvjljtqN+qRtoJPubjfoPRm4T5O6t14Hvzh69IMY2HVc2MGT/gNpRsLLRAPz5X5VOsjsicsw43zX0mRPO4s/Q2wFjrtMVGQHWzfanm1Jpwm8lDtTSMrSpMFj7N8YKBRp8dtyRjs4YiljJkGwOvBQnfW1BLyIAZ0/psfK/9pMhFrLt5ejEhBSygO8WaGelY=",
			loginString: "MY1LQzqC9n4wTvAFrOyWPHhZ",
		},
		alumni: {
			data: "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",
			loginString: "ionCO2fPZdEQTLBck5J319Iz",
		},
	};

	async function DoFakeCMUOauthLoginRequest() {
		CMUOauthLoginRequest().then((res) => {
			console.log(res.url);

			const picked_cred = fake_credentials.student;

			Api.post(`/oauth/callback`, {
				data: picked_cred.data,
			}).then(() => {
				CMUOauthLogin(picked_cred.loginString).then((result) => {
					if (result.success === true) {
						$userInfo = result.user;
						$goto("/customer/dashboard");
					} else {
						console.log("Login Error");
					}
				});
			});
		});
	}

	import { login } from "../../services/auth";
	import Navbar from "../../component/Navbar/Navbar.svelte";

	let email = "";
	let password = "";

	const signin = () => {
		login(email, password).then((res) => {
			if (res.success) {
				toast.push($_('page.auth.login.toast.success'), theme.success);
				return $goto("/customer/dashboard");
			}
			toast.push(
				res.message || "These credentials do not match our records",
				theme.error
			);
		});
	};
</script>


<svelte:head>
	<title>{$_('page.auth.login.title')} | ROSWEL-TH</title>
</svelte:head>



<Navbar />

<div class="bg-purple-100 min-h-screen flex flex-col">
	<div
		class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2"
	>
		<div class="bg-darkPurple px-6 py-8 rounded shadow-md text-white w-full">
			<h1 class="mb-8 text-3xl text-center">{$_('page.auth.login.content.title')}</h1>
			<form on:submit|preventDefault="{signin}">
				<input
					type="text"
					class="block text-black border border-grey-light w-full p-3 rounded mb-4"
					name="email"
					bind:value="{email}"
					placeholder="{$_('page.auth.login.content.input.email')}"
				/>

				<input
					type="password"
					class="block border text-black border-grey-light w-full p-3 rounded mb-4"
					name="password"
					bind:value="{password}"
					placeholder="{$_('page.auth.login.content.input.password')}"
				/>

				<button
					class="w-full text-center py-3 rounded bg-green-500 text-white font-bold hover:bg-green-600 focus:outline-none my-1"
					>{$_('page.auth.login.content.button')}</button
				>
			</form>
			<div class="flex justify-center mt-4 px-1 flex-col">
				<img
					class="cursor-pointer hover:brightness-90 brightness-100"
					on:click="{DoCMUOauthLoginRequest}"
					src="/dist/image/CMUOAuth/Login-CMU-Short.png"
					alt="Login with CMU Account"
				/>

				<button on:click="{DoFakeCMUOauthLoginRequest}" class="mt-2 hidden"
					>Fake Login</button
				>
			</div>
		</div>
		<div
			class="text-grey-dark mt-6 cursor-pointer"
			on:click="{$goto('/auth/signup')}"
		>
			{$_('page.auth.login.content.to_register')}
		</div>
	</div>
</div>

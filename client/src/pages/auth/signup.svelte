<script lang="ts">
import { goto } from "@roxi/routify";
import { registerUser } from "../../services/auth";
import { toast } from "@zerodevx/svelte-toast";
import { theme } from "../../constants/toastTheme";
import Navbar from "../../component/Navbar/Navbar.svelte";
import { _ } from 'svelte-i18n';

let fullname = "";
let email = "";
let password = "";
let confirmPassword = "";

const register = () => {
	if (password !== confirmPassword) {
		toast.push($_('page.auth.signup.toast.pass_not_match'), theme.error);
		console.log("Passwords do not match");
		return;
	}

	if(email.trim().toLowerCase().endsWith('@cmu.ac.th')){
		toast.push($_('page.auth.signup.toast.block_cmu_email'), theme.warning);
		console.log("CMU email");
		return;
	}

	registerUser(fullname, email, password).then((res) => {
		if (res.success) {
			toast.push($_('page.auth.signup.toast.register_success'), theme.success);
			return $goto("/auth/login");
		}
		toast.push($_('page.auth.signup.toast.register_failed'), theme.error);
	});
};
</script>

<svelte:head>
	<title>{$_('page.auth.signup.title')} | ROSWEL-TH</title>
</svelte:head>


<Navbar />

<div class="bg-purple-100 min-h-screen flex flex-col">
	<div
		class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2"
	>
		<div class="bg-darkPurple px-6 py-8 rounded shadow-md text-white w-full">
			<h1 class="mb-8 text-3xl text-center">{$_('page.auth.signup.content.title')}</h1>
			<form on:submit|preventDefault="{register}">
				<input
					type="text"
					class="block text-black border border-grey-light w-full p-3 rounded mb-4"
					name="fullname"
					bind:value="{fullname}"
					placeholder="{$_('page.auth.signup.content.input.fullname')}"
				/>

				<input
					type="text"
					class="block text-black border border-grey-light w-full p-3 rounded mb-4"
					name="email"
					bind:value="{email}"
					placeholder="{$_('page.auth.signup.content.input.email')}"
				/>

				<input
					type="password"
					class="block border text-black border-grey-light w-full p-3 rounded mb-4"
					name="password"
					bind:value="{password}"
					placeholder="{$_('page.auth.signup.content.input.password')}"
				/>
				<input
					type="password"
					class="block border text-black border-grey-light w-full p-3 rounded mb-4"
					name="confirm_password"
					bind:value="{confirmPassword}"
					placeholder="{$_('page.auth.signup.content.input.confirm_password')}"
				/>

				<button
					class="w-full text-center py-3 rounded bg-green-500 text-white font-bold hover:bg-green-600 focus:outline-none my-1"
					>{$_('page.auth.signup.content.create_account')}</button
				>
			</form>

			<div class="text-center text-sm text-grey-dark mt-4">
				{$_('page.auth.signup.content.by_signing_up')}
				<a
					class="no-underline border-b border-grey-dark text-grey-dark"
					href="/"
				>
					{$_('page.auth.signup.content.terms_of_service')}
				</a>
				{$_('page.auth.signup.content.and')}
				<a
					class="no-underline border-b border-grey-dark text-grey-dark"
					href="/"
				>
					{$_('page.auth.signup.content.privacy_policy')}
				</a>
			</div>
		</div>

		<div
			class="text-grey-dark mt-6 cursor-pointer"
			on:click="{$goto('/auth/login')}"
		>
			{$_('page.auth.signup.content.to_login')}
		</div>
	</div>
</div>

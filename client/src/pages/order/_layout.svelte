<script lang="ts">
	import { goto } from "@roxi/routify";
	import { userInfo } from "../../stores/userInfo";
	import { getUserData } from "../../services/userData";
	import Navbar from "../../component/Navbar/Navbar.svelte";
	import { checkLogin } from "../../services/checkLogin";

	async function checkLoginHelper()
	{
		let ret = await checkLogin(true, false);

		if(ret === -2)
		{
			$goto("/auth/login");
			return false;
		}
		else if(ret === -1)
		{
			$goto("/customer/dashboard");
			return false;
		}
		else if(ret === 1)
		{
			return true;
		}
		else// if(ret === 0)
		{
			return false;
		}

	}
	
	
	

</script>


{#await checkLoginHelper()}
	<!-- <p>...waiting</p> -->
{:then show}
	{#if show}
		<Navbar />
		<slot />
	{/if}
{:catch error}
	<!-- <p style="color: red">{error.message}</p> -->
	<!-- {$goto("/error")} -->
{/await}

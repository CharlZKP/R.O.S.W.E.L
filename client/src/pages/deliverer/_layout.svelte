<script lang="ts">
	import SideBar from './../../component/SideBar/SideBar.svelte';
	import { goto, url } from "@roxi/routify";
	import { userInfo } from "../../stores/userInfo";
	import { getUserData } from "../../services/userData";
	import Navbar from "../../component/Navbar/Navbar.svelte";
	import { checkLogin } from "../../services/checkLogin";
	import { toast } from "@zerodevx/svelte-toast";
	import { theme } from "../../constants/toastTheme";
	import { _ } from 'svelte-i18n';


	async function checkLoginHelper()
	{
		let ret = await checkLogin(true, true);

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


	let deliverer_check_login = async () =>
	{
		let ret = await checkLoginHelper();
		userInfo.useLocalStorage();//just to make sure

		if(ret === false)
		{
			return false;
		}
		else
		{
			//check if user is a deliverer here
			if($userInfo.deliverer !== null && $userInfo.deliverer.status === "Verified" && $userInfo.deliverer.active === true)
			{
				return true;
			}
			else
			{
				//you are not a deliverer
				toast.push($_('general.notice.not_a_deliverer'), theme.error)
				return false;
			}

		}
	}
	
	let prop = {
		sidebar: [
			{
				name: 'Deliverer Dashboard',
				url: $url('/deliverer'),
				active: false,
			},
			{
				name: 'Active Order',
				url: $url('/deliverer/order'),
				active: false,
			},
		],
	}
	

</script>


{#await deliverer_check_login()}
	<!-- <p>...waiting</p> -->
{:then show}
	{#if show}
		<Navbar />
		<!-- <div class="absolute left-0">
			<SideBar prop="{prop}" />
			<slot />
		</div> -->
		<slot />
		
	{/if}
{:catch error}
	<!-- <p style="color: red">{error.message}</p> -->
	<!-- {$goto("/error")} -->
{/await}

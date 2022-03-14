
<script lang="ts">
	import { params } from '@roxi/routify'
	import { CMUOauthLogin } from '../../services/auth'
	import { userInfo } from '../../stores/userInfo'
	import { goto } from '@roxi/routify'
	userInfo.useLocalStorage();

	let login_string = $params.login_string;
	
	CMUOauthLogin(login_string).then((result) => {
		/*
		success: true,
		user: user_obj_ret
		*/
		if(result.success === true)
		{
			$userInfo = result.user;
			$goto('/customer/dashboard');
		}
		else
		{

			//TODO Show error when login failed
			//error
			//Login Error
			console.log('Login Error');
		}
	})
	
</script>
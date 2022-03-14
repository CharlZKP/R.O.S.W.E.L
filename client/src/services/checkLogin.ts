import { userInfo } from "../stores/userInfo";
import { getUserData } from "./userData";
import { goto } from "@roxi/routify";

export async function checkLogin(forceDoRequest: boolean = true, need_verification: boolean = false)
{
	console.log("check login");

	let makeRequest = async () =>
	{
		return await getUserData().then((userData: any) =>
		{
			if (userData === -1)
			{
				//$goto("/auth/login");
				return -2;
			} 
			else if (userData === 0)
			{
				//some error
				return 0;
			} 
			else
			{
				userInfo.set(userData);

				if (need_verification)
				{
					if (!userData.emailConfirmed || !userData.phoneNoConfirmed)
					{
						//$goto("/customer/dashboard");
						return -1;
						//return false;
					}
					//reason: "Email or Phone number not verified"
				}

				//return true;
				return 1;
			}

			//return false;
			return 0;
		});
	};


	//@ts-ignore        Donno why but TS is confused about this userVal value
	return await userInfo.useLocalStorage().then((userVal: any) =>
	{
		if (!forceDoRequest)
		{
			if (userVal !== false)
			{
				//TODO - need to check the emailConfirmed and phoneNoConfirmed here too
				return true;
				
			} 
			else
			{
				return makeRequest();
			}
		} else
		{
			return makeRequest();
		}
	});
};
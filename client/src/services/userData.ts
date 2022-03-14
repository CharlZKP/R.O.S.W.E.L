import Api from "./Api";

// https://dev.to/lukocastillo/svelte-3-how-to-connect-your-app-with-a-rest-api-axios-2h4e



export async function getUserData()
{
	try
	{
		const response = await Api.get("/user/retrieve");
		//console.log(response);//test api response

		
		if (response.success === true)
		{
			return response.user;
		}
		else
		{
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				console.log(response.error.message);
				//re-login
				return -1;
			}
			else
			{
				return 0;
			}
			
		}

	} 
	catch (error)
	{
		console.error(error);
		return 0;
	}
};

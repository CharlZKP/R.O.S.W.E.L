import Api from "./Api";
import { toast } from "@zerodevx/svelte-toast";
import { theme } from "../constants/toastTheme";

export async function verificationEmailRequest()
{
	try
	{
		const response = await Api.post(`/verification/email/request`, {
			
		});

		if (response.success === true)
		{
			toast.push("Verification email sent", theme.success);
			return 1;
		}
		else
		{
			toast.push(response.message, theme.error);
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				console.log(response.error.message);
				//re-login
				return -1;
			}
			else
			{
				return response.message;
			}
		}

	} 
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
	}
};


export async function verificationEmailVerify(code:string)
{
	try
	{
		const response = await Api.post(`/verification/email/verify`, {
			code
		});

		if (response.success === true)
		{
			toast.push("Your email has been verified", theme.success);
			return 1;
		}
		else
		{
			toast.push(response.message, theme.error);
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				console.log(response.error.message);
				//re-login
				return -1;
			}
			else
			{
				return response.message;
			}
		}

	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
	}
};


export async function verificationPhoneRequest(phoneNo:string)
{
	try
	{
		const response = await Api.post(`/verification/phone/request`, {
			phoneNo
		});

		if (response.success === true)
		{
			//toast.push("Phone verification code sent", theme.success);
			return 1;
		}
		else
		{
			toast.push(response.message, theme.error);
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				console.log(response.error.message);
				//re-login
				return -1;
			}
			else
			{
				return response.message;
			}
		}

	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
	}
};


export async function verificationPhoneVerify(code:string)
{
	try
	{
		const response = await Api.post(`/verification/phone/verify`, {
			code
		});

		if (response.success === true)
		{
			//toast.push("Your phone number has been verified", theme.success);
			return 1;
		}
		else
		{
			toast.push(response.message, theme.error);
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				console.log(response.error.message);
				//re-login
				return -1;
			}
			else
			{
				return response.message;
			}
		}

	}
	catch (error)
	{
		console.error(error);
	}
};

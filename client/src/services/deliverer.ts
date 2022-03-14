import Api from "./Api";
import { toast } from "@zerodevx/svelte-toast";
import { theme } from "../constants/toastTheme";



export async function acceptOrder(order_id: string, location_lat: string, location_long: string): Promise<boolean>
{
	try
	{
		const response = await Api.post("/deliverer/accept-order", {
			order_id,
			location_lat,
			location_long,
		});

		if (response.success === true)
		{
			return true;
		}
		else
		{
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				toast.push("Please login before proceed", theme.error);
				return false;
			}
			else
			{
				toast.push(response.message, theme.error);
				return false;
			}
		}

	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
		return false;
	}
};



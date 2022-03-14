import Api from "./Api";
import { toast } from "@zerodevx/svelte-toast";
import { theme } from "../constants/toastTheme";


//Deliverer only
export async function getUnassignedOrder(location_lat:string, location_long:string)
{
	try
	{
		const response = await Api.post("/order/unassigned/list", {
			location_lat,
			location_long
		});
		

		if (response.success === true)
		{
			return response.orders;
		}
		else
		{
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				toast.push("Please login before proceed", theme.error);
				return [];
			}
			else
			{
				toast.push(response.message, theme.error);
				return [];
			}
		}

	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
		return [];
	}
};



export async function createOrder(order_items: any, tip_amount: number, location_lat:string, location_long:string)
{
	try
	{
		const response = await Api.post("/order/create", {
			order_items,
			tip_amount,
			location_lat,
			location_long
		});



		if (response.success !== true)
		{
			toast.push(response.message, theme.error);
			return false;
		}

		return response.order;

	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
		return false;
	}
};



function typeSwitcher(type: string)
{
	let temp_type = 'customer';
	if (type.trim().toLowerCase() === 'deliverer')
	{
		temp_type = 'deliverer';
	}

	return temp_type;
}

export async function getOrder(order_id: string, type:string)
{
	try
	{
		const response = await Api.post("/order/get", {
			order_id,
			search_type: typeSwitcher(type)
		});
		
		if (response.success === true)
		{
			return response;//.order; 
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


//customer only
export async function cancelOrder(order_id: string): Promise<boolean>
{
	try
	{
		const response = await Api.post("/order/cancel", {
			order_id,
			search_type: "customer"
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




export async function addTip(order_id: string, tip_amount: number): Promise<boolean>
{
	try
	{
		const response = await Api.post("/order/tip/add", {
			order_id,
			search_type: "customer",
			tip_amount
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



export enum delivererChangableStatus
{
	headingToStore = 'Heading to store',
	packageReceived = 'Package received',
	inTransit = 'Goods in transit',
	complete = 'Complete',
}

export async function delivererChangeStatus(order_id: string, status: delivererChangableStatus, location_lat: string, location_long:string): Promise<boolean>
{
	try
	{
		//console.log('status', status);
		//return false;
		
		const response = await Api.post("/order/status/change", {
			order_id,
			search_type: "deliverer",
			status: status,
			location_lat,
			location_long
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




export async function getOnGoingOrder()
{
	try
	{
		const response = await Api.post("/order/get/my-order/current", {});

		if (response.success === true)
		{
			return response.orders; //TODO - check if this is the right key
		}
		else
		{
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				toast.push("Please login before proceed", theme.error);
				return [];
			}
			else
			{
				toast.push(response.message, theme.error);
				return [];
			}
		}

	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
		return [];
	}
};



export async function getAllCustomerOrder()
{
	try
	{
		const response = await Api.post("/order/get/my-order/all", {});

		if (response.success === true)
		{
			return response.orders; //TODO - check if this is the right key
		}
		else
		{
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				toast.push("Please login before proceed", theme.error);
				return [];
			}
			else
			{
				toast.push(response.message, theme.error);
				return [];
			}
		}

	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
		return [];
	}
};



export async function getActiveDelivererOrderList()
{
	try
	{
		const response = await Api.post("/order/deliverer/active/list", {});

		if (response.success === true)
		{
			return response.orders; //TODO - check if this is the right key
		}
		else
		{
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				toast.push("Please login before proceed", theme.error);
				return [];
			}
			else
			{
				toast.push(response.message, theme.error);
				return [];
			}
		}

	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
		return [];
	}
};

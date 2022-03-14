import Api from "./Api";
import { toast } from "@zerodevx/svelte-toast";
import { theme } from "../constants/toastTheme";

export async function getManagingStores()
{
	try
	{
		const response = await Api.post("/store/managing/get/list", {});
		//console.log(response);//test api response

		if (response.success === true)
		{
			return response.stores;
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



export async function createStore(name: string, loc_txt: string, search_query: string, loc_lat: string, loc_long: string):Promise<boolean>
{
	try
	{
		const response = await Api.post("/store/create", {
			store_name: name,
			location_txt: loc_txt,
			location_search_query: search_query,
			location_lat: loc_lat,
			location_long: loc_long
		});



		if (response.success !== true)
		{
			toast.push(response.message, theme.error);
			return false;
		}

		return response.store_id;

	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
		return false;
	}
};


export async function updateOpenTime(store_id: string, open_time: Array<string>):Promise<boolean>
{
	try
	{
		const response = await Api.post("/store/update/open-time", {
			store_id,
			open_time
		});
		//console.log(response);//test api response

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



export async function updateOnLeave(store_id: string, onLeave: boolean): Promise<boolean>
{
	try
	{
		const response = await Api.post("/store/update/on-leave", {
			store_id,
			on_leave: onLeave
		});
		//console.log(response);//test api response

		if (response.success === true)
		{
			return true;
		}
		else
		{
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				toast.push('Please login before proceed', theme.error);
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




//------------------- Store Item


export async function createStoreItem(store_id: string, item_name: string, item_details:string, item_price:number): Promise<boolean>
{
	try
	{
		const response = await Api.post("/store-item/create", {
			store_id,
			item_name,
			item_details,
			item_price
		});


		if (response.success !== true)
		{
			toast.push(response.message, theme.error);
		}
		

		return response.success;

	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
		return false;
	}
};



export async function updateItemOnShow(store_item_id: string, onShow: boolean): Promise<boolean>
{
	try
	{
		const response = await Api.post("/store-item/update/on-show", {
			store_item_id,
			on_show: onShow
		});
		//console.log(response);//test api response

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

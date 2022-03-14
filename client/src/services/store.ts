import Api from "./Api";
import { toast } from "@zerodevx/svelte-toast";
import { theme } from "../constants/toastTheme";

export async function getStoreList(lat:string, long:string)
{
	try
	{
		const response = await Api.post("/store/get/list", {
			lat,
			long
		});
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


export async function getStore(store_id:string)
{
	try
	{
		const response = await Api.post("/store/get", {
			store_id
		});

		if (response.success === true)
		{
			return response.store;
		}
		else
		{
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				toast.push("Please login before proceed", theme.error);
				return null;
			}
			else
			{
				toast.push(response.message, theme.error);
				return null;
			}
		}
	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
		return null;
	}
};


export async function getStoreItemList(store_id: string)
{
	try
	{
		const response = await Api.post("/store/item/list", {
			store_id
		});

		if (response.success === true)
		{
			return response.store_items;
		}
		else
		{
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				toast.push("Please login before proceed", theme.error);
				return null;
			}
			else
			{
				toast.push(response.message, theme.error);
				return null;
			}
		}
	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
		return null;
	}
};

export async function getStoreItem(storeItem_id: string)
{
	try
	{
		//console.log('storeItem_id', storeItem_id);
		const response = await Api.post("/store-item/get", {
			store_item_id: storeItem_id
		});

		if (response.success === true)
		{
			return response.storeItem;
		}
		else
		{
			if (typeof response.error !== 'undefined' && response.error.code === 'NotAuthen001')
			{
				toast.push("Please login before proceed", theme.error);
				return null;
			}
			else
			{
				toast.push(response.message, theme.error);
				return null;
			}
		}
	}
	catch (error)
	{
		toast.push("Unknown Error", theme.error);
		console.error(error);
		return null;
	}
}
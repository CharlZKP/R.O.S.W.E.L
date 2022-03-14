import { writable, get } from 'svelte/store';
import lzString from 'lz-string';
export const createWritableStore = (key, startValue) =>
{
	const { subscribe, set, update } = writable(startValue);
	// let newStore = writable(startValue);
	// const { subscribe, set } = newStore;
	return {
		subscribe,
		set,
		update,
		useLocalStorage: () =>
		{
			return new Promise((resolve, reject) =>
			{
				const json = localStorage.getItem(key);
				if (json)
				{
					let temp_val = JSON.parse(lzString.decompress(json));
					set(temp_val);
					resolve(temp_val);
				}

				subscribe(current =>
				{
					localStorage.setItem(key, lzString.compress(JSON.stringify(current)));
				});

				if (!json)
				{
					set(startValue);
					resolve(startValue);
				}
			});
		}
	};
}

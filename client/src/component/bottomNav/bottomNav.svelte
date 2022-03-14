<script lang="ts">

	export let btn_1_action: Function | null = null;
	export let btn_2_action: Function | null = null;
	export let btn_3_action: Function | null = null;
	export let btn_4_action: Function | null = null;
	export let btn_1_txt = '';
	export let btn_2_txt = '';
	export let btn_3_txt = '';
	export let btn_4_txt = '';

	let btn_1_disabled:boolean = false;
	let btn_2_disabled:boolean = false;
	let btn_3_disabled:boolean = false;
	let btn_4_disabled:boolean = false;

	$: if(btn_1_action == null)
	{
		btn_1_disabled = true;
	}
	else
	{
		btn_1_disabled = false;
	}

	$: if(btn_2_action == null)
	{
		btn_2_disabled = true;
	}
	else
	{
		btn_2_disabled = false;
	}

	$: if(btn_3_action == null)
	{
		btn_3_disabled = true;
	}
	else
	{
		btn_3_disabled = false;
	}

	$: if(btn_4_action == null)
	{
		btn_4_disabled = true;
	}
	else
	{
		btn_4_disabled = false;
	}

	function action_check(action: Function | null)
	{
		if(action != null)
		{
			action();
		}
	}

	function btn_1_action_wrapper()
	{
		//console.log('BTN 1 Pressed');
		action_check(btn_1_action);
	}

	function btn_2_action_wrapper()
	{
		//console.log('BTN 2 Pressed');
		action_check(btn_2_action);
	}

	function btn_3_action_wrapper()
	{
		//console.log('BTN 3 Pressed');
		action_check(btn_3_action);
	}

	function btn_4_action_wrapper()
	{
		//console.log('BTN 4 Pressed');
		action_check(btn_4_action);
	}

</script>


<div class="min-h-screen bg-white p-5 text-black">
	<slot name="content">

	</slot>
</div>

<!-- fixed nav -->
<nav class="fixed bottom-0 inset-x-0 bg-purple-300 flex justify-between text-sm text-blue-900 uppercase font-mono">

	<button on:click|stopPropagation="{btn_1_action_wrapper}" disabled="{btn_1_disabled}" class="w-full block py-5 px-3 text-center hover:bg-blue-200 hover:text-blue-800  disabled:hover:bg-slate-300 disabled:bg-slate-300 transition duration-300">
		<slot name="btn_1_svg">
			<svg class="w-6 h-6 mb-2 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
				<path fill="#fff" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
			</svg>
		</slot>
		{btn_1_txt}
	</button>

	<button on:click|stopPropagation="{btn_2_action_wrapper}" disabled="{btn_2_disabled}" class="w-full block py-5 px-3 text-center hover:bg-blue-200 hover:text-blue-800 disabled:hover:bg-slate-300 disabled:bg-slate-300 transition duration-300">
		<slot name="btn_2_svg">
			<svg class="w-6 h-6 mb-2 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
			</svg>
		</slot>
		{btn_2_txt}
	</button>

	<button on:click|stopPropagation="{btn_3_action_wrapper}" disabled="{btn_3_disabled}" class="w-full block py-5 px-3 text-center hover:bg-blue-200 hover:text-blue-800 disabled:hover:bg-slate-300 disabled:bg-slate-300 transition duration-300">
		<slot name="btn_3_svg">
			<svg class="w-6 h-6 mb-2 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
			</svg>
		</slot>
		{btn_3_txt}
	</button>

	<button on:click|stopPropagation="{btn_4_action_wrapper}" disabled="{btn_4_disabled}" class="w-full block py-5 px-3 text-center hover:bg-blue-200 hover:text-blue-800 disabled:hover:bg-slate-300 disabled:bg-slate-300 transition duration-300">
		<slot name="btn_4_svg">
			<svg class="w-6 h-6 mb-2 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
			</svg>
		</slot>
		{btn_4_txt}
	</button>

</nav>
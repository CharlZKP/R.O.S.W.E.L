<script lang="ts">
	import { userInfo } from '../../stores/userInfo'
	import { goto } from '@roxi/routify'

	userInfo.useLocalStorage();
	let isActiveDeliverer = false;
	if($userInfo.deliverer !== null)//TODO - fix this
	{
		isActiveDeliverer = true;
	}

	function registerAsDeliverer()
	{
		$goto("/KYC");
	}

</script>

<h1 class="text-lg">
	Deliverer - Sign Up
</h1>

{#if isActiveDeliverer}
	<div class="alert alert-danger">
		You are already signed up as a deliverer.
	</div>
{:else}
	<button on:click="{registerAsDeliverer}" class="bg-green-200">Register</button>
{/if}
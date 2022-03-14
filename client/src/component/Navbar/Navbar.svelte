<script defer async>
import NavbarItem from './NavbarItem.svelte'
import NavbarItemMobile from './NavbarItemMobile.svelte'
import { url } from '@roxi/routify'
import { clickOutside } from '../../helper/clickOutside'
import { userInfo } from '../../stores/userInfo'
import { goto } from '@roxi/routify'
import { onMount } from 'svelte'
import { _ } from 'svelte-i18n'
import { slide } from 'svelte/transition';

userInfo.useLocalStorage()
let userType

let loggedInContent = [
	['/customer/dashboard', $_('nav.text.dashboard')],
	['/storeManager', $_('nav.text.store_manager')],
	['/order', $_('nav.text.on_going_orders')],
	['/order/history', $_('nav.text.order_history')],
]


let delivererMenu = [
	['/KYC', $_('nav.text.kyc')],
	['/deliverer', $_('nav.text.deliverer_dashboard')],
	['/deliverer/order', $_('nav.text.deliverer_active_order')],
]




onMount(async () => {
	if ($userInfo != false) {
		userType = $userInfo.userType
	}

	//let userData = await getUserData()
	//userType = userData.userType
})

let navbarToggle = false

</script>

<nav class="bg-darkPurple">
	<div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
		<div class="relative flex items-center justify-between h-16">
			<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
				<!-- Mobile menu button-->
				<button
					on:click={() => { navbarToggle = !navbarToggle }}
					type="button"
					class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
					aria-controls="mobile-menu"
					aria-expanded="false"
				>
					<span class="sr-only">Open menu</span>
					<!--
            Icon when menu is closed.

            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
          -->
		  <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <!--
            Icon when menu is open.

            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
          -->
          <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
				</button>
			</div>
			<div
				class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
			>
				<div class="flex-shrink-0 flex items-center">
					<img
								src="/dist/image/logo/ROSWEL_logo_wbg.png"
								alt=""
								class="block lg:hidden h-8 w-auto"
								aria-hidden="true"
							/>
					<img
								src="/dist/image/logo/ROSWEL_logo_wbg.png"
								alt=""
								class="hidden lg:block h-8 w-auto"
								aria-hidden="true"
							/>
				</div>
				<div class="hidden sm:block sm:ml-6">
					<div class="flex space-x-4">
						<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
						<NavbarItem href="{$url('/')}"
							>{$_('nav.text.home')}</NavbarItem
						>

						{#if $userInfo !== false}
							{#each loggedInContent as [path, name]}
								<NavbarItem href="{$url(path)}"
									>{name}</NavbarItem
								>
							{/each}
						{/if}

						{#if $userInfo.CMUOAuthAccountType === 'Student Account'}
							{#each delivererMenu as [path, name]}
								<NavbarItem href="{$url(path)}"
									>{name}</NavbarItem
								>
							{/each}
						{/if}

						{#if userType === 'Admin Account'}
							<NavbarItem href="{$url('/admin')}"
								>Admin</NavbarItem
							>
						{/if}
					</div>
				</div>
			</div>
			<div
				class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
			>
				

				<!-- Profile dropdown -->
				<div class="ml-3 relative">
					<div>
						<div class="hidden md:flex items-center space-x-1">
							{#if $userInfo == false}
								<a
									href="{$url('/auth/login')}"
									class="py-2 px-3 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded transition duration-300"
									>{$_('nav.text.login')}</a
								>
								<a
									href="{$url('/auth/signup')}"
									class="py-2 px-3 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded transition duration-300"
									>{$_('nav.text.signup')}</a
								>
							{:else}
								<button
									on:click="{() => $goto('/auth/logout')}"
									class="py-2 px-3 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded transition duration-300"
									>{$_('nav.text.logout')}</button
								>
							{/if}
						</div>
						<!-- <button
							type="button"
							class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
							id="user-menu-button"
							aria-expanded="false"
							aria-haspopup="true"
						>
							<span class="sr-only">Settings</span>
							<img
								class="h-8 w-8 rounded-full"
								src="/dist/image/nav/Settings-icon.png"
								alt="settings"
							/>
						</button> -->
					</div>

					<!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          -->
					<!-- <div
						class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="user-menu-button"
						tabindex="-1"
					>
						<a
							href="#"
							class="block px-4 py-2 text-sm text-gray-700"
							role="menuitem"
							tabindex="-1"
							id="user-menu-item-0">Your Profile</a
						>
						<a
							href="#"
							class="block px-4 py-2 text-sm text-gray-700"
							role="menuitem"
							tabindex="-1"
							id="user-menu-item-2">Sign out</a
						>
					</div> -->
				</div>
			</div>
		</div>
	</div>

	{#if navbarToggle}
		<!-- Mobile menu, show/hide based on menu state. -->
		<div class="sm:hidden duration-150" transition:slide|local id="mobile-menu">
			<div class="px-2 pt-2 pb-3 space-y-1">
				<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
					<NavbarItemMobile href="{$url('/')}"
								>{$_('nav.text.home')}</NavbarItemMobile
							>
							
					{#if $userInfo !== false}
						{#each loggedInContent as [path, name]}
							<NavbarItemMobile href="{$url(path)}"
								>{name}</NavbarItemMobile
							>
						{/each}
					{/if}

					{#if $userInfo.CMUOAuthAccountType === 'Student Account'}
						{#each delivererMenu as [path, name]}
							<NavbarItemMobile href="{$url(path)}"
								>{name}</NavbarItemMobile
							>
						{/each}
					{/if}

					{#if userType === 'Admin Account'}
						<NavbarItemMobile href="{$url('/admin')}"
							>Admin</NavbarItemMobile
						>
					{/if}

					{#if $userInfo == false}
						<NavbarItemMobile href="{$url('/auth/login')}"
							>{$_('nav.text.login')}</NavbarItemMobile
						>
						<NavbarItemMobile href="{$url('/auth/signup')}"
							>{$_('nav.text.signup')}</NavbarItemMobile
						>
						
					{:else}
						<NavbarItemMobile href="{$url('/auth/logout')}"
							>{$_('nav.text.logout')}</NavbarItemMobile
						>
					{/if}
				
			</div>
		</div>
	{/if}
	
</nav>

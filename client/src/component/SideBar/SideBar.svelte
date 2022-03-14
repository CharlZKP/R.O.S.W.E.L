<script>
export let prop = {}
</script>

<div
	class="h-screen hidden lg:block my-4 ml-4 shadow-lg relative w-80 inline-block"
>
	<div class="bg-white h-full rounded-2xl dark:bg-gray-700">
		<nav class="mt-6">
			<div>
				{#each prop.sidebar as item}
					<a
						class="{item.active
							? 'bg-gradient-to-r from-white to-blue-100'
							: ''} w-full font-thin uppercase text-blue-500 flex items-center p-4 my-2 transition-colors duration-200 justify-start border-r-4 border-blue-500 dark:from-gray-700 dark:to-gray-800 border-r-4 border-blue-500"
						href="{item.url}"
						on:click="{() => {
							prop.sidebar.forEach((item) => {
								item.active = false
							})
							item.active = true
						}}"
					>
						<span class="text-left">
							<svg
								width="20"
								height="20"
								fill="currentColor"
								viewBox="0 0 2048 1792"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M1070 1178l306-564h-654l-306 564h654zm722-282q0 182-71 348t-191 286-286 191-348 71-348-71-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z"
								>
								</path>
							</svg>
						</span>
						<span class="mx-4 text-sm font-normal">
							{item.name}
						</span>
					</a>
				{/each}
			</div>
		</nav>
	</div>
</div>
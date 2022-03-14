<script lang="ts">
	export let extra_class = "";
</script>


<div class="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg {extra_class}">
	<div class="px-4 py-5 sm:px-6">
		<h3 class="text-lg leading-6 font-medium text-gray-900">
			<slot name="heading">
				
			</slot>
		</h3>
		<p class="mt-1 max-w-2xl text-sm text-gray-500">
			<slot name="description">
			
			</slot>
		</p>
	</div>
	<div class="border-t border-gray-200">
		<dl>
			<slot name="rows">
			
			</slot>
		</dl>
	</div>
</div>

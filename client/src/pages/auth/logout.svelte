<script lang="ts">
	import { goto } from "@roxi/routify";
	import { logout } from "../../services/auth";
	import { userInfo } from "../../stores/userInfo";
	logout().then((result) => {
		console.log(result);
		userInfo.set(false);
		$goto("/");
	});
</script>

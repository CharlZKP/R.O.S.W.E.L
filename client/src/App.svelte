<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<script lang="ts">
import { Router } from "@roxi/routify";
import { routes } from "../.routify/routes.js";
import init_i18n from "./i18n";
import { SvelteToast } from "@zerodevx/svelte-toast";

const langs = ["en", "th"];
const default_lang = "en";

const fragment = location.pathname.split("/")[1];
const lang = langs.includes(fragment) ? fragment : default_lang;
const langPath = `/${lang}`;

//console.log("lang: " + lang);
init_i18n(lang);

const router_config = {
  urlTransform: {
    //add the language prefix for the browser
    apply: (url) => langPath + url,
    //remove the language prefix for Routify
    remove: (url) => url.replace(langPath, ""),
  },
};

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} 
else 
{
  document.documentElement.classList.remove('dark')
}

// Whenever the user explicitly chooses light mode
localStorage.theme = 'light'

// Whenever the user explicitly chooses dark mode
//localStorage.theme = 'dark'

// Whenever the user explicitly chooses to respect the OS preference
//localStorage.removeItem('theme')

</script>

<SvelteToast />

<Router routes="{routes}" config="{router_config}" />

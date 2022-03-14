import
	{
		register,
		init
	} from 'svelte-i18n';

let INIT_OPTIONS = {
	fallbackLocale: 'en',
	initialLocale: 'th',
	loadingDelay: 200,
	formats: {},
	warnOnMissingMessages: true,
};

//console.log("INIT_OPTIONS", INIT_OPTIONS);

register('en', () => import('./lang/en.json'));
register('th', () => import('./lang/th.json'));

function init_i18n(lang = 'th') {
	INIT_OPTIONS.initialLocale = lang;
	
	init(INIT_OPTIONS);
}

export default init_i18n;


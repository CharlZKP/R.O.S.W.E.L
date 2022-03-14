importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

/*
use this if you want to use workbox.* inside of event handlers or asynchronous functions.
workbox.loadModule('workbox-strategies');
*/


const match = ({ url, event }) =>
{
	if (url.pathname === '/example')
	{
		return {
			name: 'Workbox',
			type: 'guide',
		};
	}
};





// --------------------------- Google font
workbox.routing.registerRoute(
	({ url }) => url.origin === 'https://fonts.googleapis.com',
	new workbox.routing.StaleWhileRevalidate({
		cacheName: 'google-fonts-stylesheets',
	})
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
	({ url }) => url.origin === 'https://fonts.gstatic.com',
	new CacheFirst({
		cacheName: 'google-fonts-webfonts',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
			new ExpirationPlugin({
				maxAgeSeconds: 60 * 60 * 24 * 365,
				maxEntries: 30,
			}),
		],
	})
);





/*
registerRoute(
	({ url }) => url.origin === self.location.origin &&
		url.pathname.startsWith('/static/'),
	new StaleWhileRevalidate()
);




registerRoute(
	({ url }) => url.origin === 'https://hacker-news.firebaseio.com',
	new NetworkFirst({
		networkTimeoutSeconds: 3,
		cacheName: 'stories',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 50,
				maxAgeSeconds: 5 * 60, // 5 minutes
			}),
		],
	})
);

*/

workbox.routing.registerRoute(
	({ request }) => url.origin === self.location.origin && request.destination === 'image',
	new workbox.strategies.StaleWhileRevalidate({
		plugins: [
			new workbox.strategies.ExpirationPlugin({
				//maxEntries: 50,
				maxAgeSeconds:  60 * 60 * 24,
			}),
		]
	})
);


workbox.routing.registerRoute(
	({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/dist/build/'),
	new workbox.routing.StaleWhileRevalidate()
);

/*
registerRoute(
	match,
	new strategies.StaleWhileRevalidate()
);

registerRoute(
	match,
	new strategies.NetworkFirst()
);

registerRoute(
	match,
	new strategies.CacheFirst()
);

registerRoute(
	match,
	new strategies.NetworkOnly()
);

registerRoute(
	match,
	new strategies.CacheOnly()
);

*/
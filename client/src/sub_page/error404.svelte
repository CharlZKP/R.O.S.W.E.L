<script lang="ts">
	import { _ } from 'svelte-i18n'
	import { url } from '@roxi/routify'
</script>

<svelte:head>
  <title>{$_('page.error404.title')} | ROSWEL-TH</title>
</svelte:head>

<div class="wrapper">
	<h1>{$_('page.error404.content.heading')}</h1>
	<p>
		{$_('page.error404.content.explaination')}
	</p>

	<div class="buttons">
		<!-- <a href="#">back</a> -->
		<a href={$url('/Home')}>{$_('page.error404.content.home_button')}</a>
	</div>
</div>

<div id="footer404">
	404 - Page Not Found
</div>

<style>
	*,
	:before,
	:after {
		box-sizing: border-box;
	}

	#footer404
	{
		position: absolute;
		bottom: 0;
		width: 98%;
		text-align: center;
		font-size: 0.8em;
		color: rgb(0, 0, 0);
		padding: 0.5em;
	}

	.wrapper {
		flex-grow: 2;
		width: 40vw;
		max-width: 500px;
		margin: 0 auto;
	}

	h1 {
		margin: 0;
		font-size: 6em;
		font-weight: 100;
	}

	p {
		width: 95%;
		font-size: 1.5em;
		line-height: 1.4;
	}

	.buttons {
		margin-top: 20px;
		white-space: nowrap;
		display: inline-block;
	}

	span {
		display: block;
		text-transform: uppercase;
		color: #b9ddfb;
		letter-spacing: 1.5px;
		text-align: center;
	}

	a {
		display: inline-block;
		padding: 0.8em 1em;
		margin-right: 1em;
		margin-bottom: 1em;
		border: 3px solid #b9ddfb;
		color: #138ff2;
		font-weight: 500;
		text-transform: uppercase;
		text-decoration: none;
		letter-spacing: 0.2em;
		position: relative;
		overflow: hidden;
		transition: 0.3s;
	}
	a:hover {
		color: #e3f2fd;
	}
	a:hover:before {
		top: 0;
	}
	a:before {
		content: "";
		background: #138ff2;
		height: 100%;
		width: 100%;
		position: absolute;
		top: -100%;
		left: 0;
		transition: 0.3s;
		z-index: -1;
	}

	/* @media (max-width: 600px) {
		body {
			margin: 0 5vw;
		}
	} */
</style>

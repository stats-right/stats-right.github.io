<script lang="ts">
	import '../app.css';
	
	let { children } = $props();

	const GITHUB_URL = "https://github.com/stats-right/stats-right.github.io/issues/new?template=add-statistic.md";
</script>

<svelte:head>
  <!-- Common meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#78501b" />
  
  <!-- Default meta information (will be overridden on specific pages) -->
  <meta name="robots" content="index, follow" />
</svelte:head>

<div class="bg-rs-brown text-rs-parchment py-1 text-center text-sm px-5">
    <span>This is an open source project. <a href={GITHUB_URL} class="font-medium hover:text-rs-gold transition-colors" target="_blank" rel="noopener"><b class="underline">Contribute new statistics</b> or view the source code on GitHub</a></span>
</div>

{@render children()}

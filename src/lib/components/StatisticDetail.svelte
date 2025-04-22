<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { browser } from '$app/environment';
	import TagChip from './TagChip.svelte';
	import type { Statistic } from '../stores/statisticsStore';

	// Props
	export let statistic: Statistic;
	export let isOpen: boolean = false;
	export let standalone: boolean = false; // New prop for standalone mode

	// Event dispatcher
	const dispatch = createEventDispatcher();

	// State
	let currentUrl = '';
	let copyFeedback = '';
	let showFeedback = false;

	onMount(() => {
		// Only access window in the browser
		if (browser) {
			currentUrl = window.location.href;
		}
	});

	// Methods
	function close() {
		dispatch('close');
	}

	function showCopyFeedback(message: string) {
		copyFeedback = message;
		showFeedback = true;
		setTimeout(() => {
			showFeedback = false;
		}, 2000);
	}

	// Handle clicking outside the modal to close it
	function handleOutsideClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			close();
		}
	}

	// Handle escape key to close the modal
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && !standalone) {
			close();
		}
	}

	// Create share URLs safely
	function getTwitterShareUrl() {
		if (!browser) return '#';
		return `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(statistic.title || 'Check out this statistic!')}`;
	}

	function copyToClipboard() {
		if (browser) {
			navigator.clipboard.writeText(currentUrl)
				.then(() => showCopyFeedback('URL copied!'))
				.catch(err => console.error('Could not copy URL: ', err));
		}
	}

	async function copyImageToClipboard() {
		if (browser && statistic.imageUrl) {
			try {
				const response = await fetch(statistic.imageUrl);
				const blob = await response.blob();
				
				// For modern browsers supporting clipboard API
				if (navigator.clipboard && navigator.clipboard.write) {
					const item = new ClipboardItem({
						[blob.type]: blob
					});
					await navigator.clipboard.write([item]);
					showCopyFeedback('Image copied!');
				} else {
					// Fallback for browsers not supporting clipboard.write
					const img = document.createElement('img');
					img.src = statistic.imageUrl;
					
					const canvas = document.createElement('canvas');
					img.onload = () => {
						canvas.width = img.width;
						canvas.height = img.height;
						const ctx = canvas.getContext('2d');
						if (ctx) {
							ctx.drawImage(img, 0, 0);
							
							canvas.toBlob((blob) => {
								if (blob) {
									navigator.clipboard.write([
										new ClipboardItem({
											[blob.type]: blob
										})
									]).then(() => {
										showCopyFeedback('Image copied!');
									}).catch(err => {
										console.error('Could not copy image: ', err);
										showCopyFeedback('Failed to copy image on your browser. This has to be done manually instead');
									});
								}
							});
						}
					};
				}
			} catch (err) {
				console.error('Could not copy image: ', err);
				showCopyFeedback('Failed to copy image on your browser. This has to be done manually instead');
			}
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- Standalone mode (direct URL access) -->
	<div class="bg-rs-parchment rs-panel w-full overflow-hidden rounded-lg shadow-lg">
		<!-- Feedback toast for copy actions -->
		{#if showFeedback}
			<div transition:fade="{{ duration: 200 }}" class="fixed top-6 right-6 bg-rs-brown text-white py-2 px-4 rounded-lg shadow-lg z-50">
				{copyFeedback}
			</div>
		{/if}
		
		<!-- Image header -->
		<div class="flex flex-col md:flex-row">
			<div class="relative md:w-3/5">
				<a href={statistic.imageUrl} target="_blank">
					<img
						src={statistic.imageUrl}
						alt={statistic.title || 'Statistical visualization'}
						class="h-full max-h-[80vh] w-full object-contain"
					/>
					<div class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
						Click to open in full size
					</div>
				</a>
			</div>

			<!-- Content section -->
			<div class="max-h-[80vh] overflow-y-auto md:w-2/5">
				<div class="p-6">
					<!-- Title (only visible on desktop) -->
					{#if statistic.title}
					<h2 class="text-rs-brown mb-4 text-2xl font-bold">
						{statistic.title || 'Untitled Statistic'}
					</h2>
					{/if}

					<!-- Tags section -->
					<div class="mb-4 flex flex-wrap gap-2">
						{#each [...(statistic.tags?.visible || []), ...(statistic.tags?.hidden || [])] as tag}
							<TagChip {tag} />
						{/each}
					</div>

					<!-- Description -->
					{#if statistic.description}
						<div class="text-rs-text mb-6 leading-relaxed whitespace-pre-line">
							{statistic.description}
						</div>
					{/if}

					<!-- Source information -->
					{#if statistic.source || statistic.sourceUrl}
						<div class="bg-rs-parchment-dark border-rs-brown-light mb-6 rounded-lg border-2 p-4">
							<h3 class="text-rs-brown-dark mb-2 flex items-center text-sm font-bold">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mr-1 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								Citation Source
							</h3>
							{#if statistic.source && statistic.sourceUrl}
								<a
									href={statistic.sourceUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="text-rs-gold-dark hover:text-rs-highlight flex items-center underline"
								>
									{statistic.source}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="ml-1 h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
										/>
									</svg>
								</a>
							{:else if statistic.source}
								<p class="text-rs-text">{statistic.source}</p>
							{:else if statistic.sourceUrl}
								<a
									href={statistic.sourceUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="text-rs-gold-dark hover:text-rs-highlight flex items-center underline"
								>
									{statistic.sourceUrl}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="ml-1 h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
										/>
									</svg>
								</a>
							{/if}
						</div>
					{/if}

					<!-- Social sharing section -->
					<div class="bg-rs-parchment-dark border-rs-brown-light my-4 rounded-lg border-2 p-4">
						<h3 class="text-rs-brown-dark mb-2 flex items-center text-sm font-bold">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
								/>
							</svg>
							Share
						</h3>
						<div class="flex space-x-2">
							<a
								href={getTwitterShareUrl()}
								target="_blank"
								rel="noopener noreferrer"
								class="social-btn text-rs-gold-dark hover:text-rs-highlight relative group"
								aria-label="Share on Twitter"
							>
								<span class="tooltip">Share on X</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
									/>
								</svg>
							</a>
							<button
								class="social-btn text-rs-gold-dark hover:text-rs-highlight relative group"
								on:click={copyToClipboard}
								aria-label="Copy link"
							>
								<span class="tooltip">Copy URL</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
									/>
								</svg>
							</button>
							<button
								class="social-btn text-rs-gold-dark hover:text-rs-highlight relative group"
								on:click={copyImageToClipboard}
								aria-label="Copy image"
							>
								<span class="tooltip">Copy Image</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</button>
						</div>
					</div>

					<!-- Links section -->
					{#if statistic.links && statistic.links.length > 0}
						<div class="mb-6">
							<h3 class="text-rs-brown mb-3 text-lg font-semibold">Related Links</h3>
							<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
								{#each statistic.links as link}
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										class="group border-rs-brown-light hover:bg-rs-parchment-dark flex items-center rounded-lg border-2 p-3 transition-colors overflow-hidden"
										download={link.type === 'download' ? '' : null}
									>
										<div class="shrink-0 mr-3">
											{#if link.type === 'download'}
												<div class="bg-rs-gold-light text-rs-brown rounded-full p-2">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-5 w-5"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
														/>
													</svg>
												</div>
											{:else}
												<div class="bg-rs-parchment-light text-rs-brown rounded-full p-2">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-5 w-5"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													>
														<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
														<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
													</svg>
												</div>
											{/if}
										</div>
										<div class="min-w-0 flex-1 overflow-hidden">
											<div class="text-rs-brown group-hover:text-rs-highlight font-medium text-ellipsis overflow-hidden whitespace-nowrap">
												{link.label}
											</div>
											<div class="text-rs-brown-light truncate text-xs">
												{link.url}
											</div>
										</div>
									</a>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.statistic-detail-modal {
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		border: 3px solid #78501b;
	}

	.close-button {
		background-color: rgba(120, 80, 27, 0.7);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background-color: rgba(120, 80, 27, 0.9);
		transform: scale(1.1);
	}

	/* Social button styles */
	.social-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(231, 219, 188, 0.5);
		border-radius: 50%;
		width: 36px;
		height: 36px;
		transition: all 0.2s ease;
	}

	.social-btn:hover {
		background-color: rgba(201, 168, 58, 0.3);
		transform: translateY(-2px);
	}
	
	.social-btn:active {
		transform: translateY(0);
		background-color: rgba(201, 168, 58, 0.5);
	}
	
	/* Tooltip styles */
	.tooltip {
		visibility: hidden;
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		background-color: rgba(120, 80, 27, 0.9);
		color: #f9f5e7;
		text-align: center;
		padding: 4px 8px;
		border-radius: 4px;
		white-space: nowrap;
		font-size: 12px;
		margin-bottom: 6px;
		opacity: 0;
		transition: opacity 0.2s, visibility 0.2s;
		pointer-events: none;
		z-index: 10;
	}
	
	.tooltip::after {
		content: "";
		position: absolute;
		top: 100%;
		left: 50%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: rgba(120, 80, 27, 0.9) transparent transparent transparent;
	}
	
	.group:hover .tooltip {
		visibility: visible;
		opacity: 1;
	}

	/* Ensure scrollbar styling is consistent */
	:global(.statistic-detail-modal *::-webkit-scrollbar) {
		width: 8px;
	}

	:global(.statistic-detail-modal *::-webkit-scrollbar-track) {
		background: #e6ddbf;
	}

	:global(.statistic-detail-modal *::-webkit-scrollbar-thumb) {
		background-color: #78501b;
		border-radius: 20px;
	}
</style>

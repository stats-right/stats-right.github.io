<script lang="ts">
  let { 
    tag, 
    highlighted = false, 
    removable = false,
    onRemove = undefined
  } = $props();
</script>

<span class="tag-chip text-xs px-2 py-1 rounded-full inline-flex items-center gap-1"
      class:highlighted>
  {tag}
  {#if removable && onRemove}
    <button 
      type="button"
      on:click={() => onRemove(tag)} 
      class="ml-1 text-rs-brown hover:text-rs-brown-dark" 
      aria-label={`Remove ${tag} tag`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>
    </button>
  {/if}
</span>

<style>
  .tag-chip {
    background-image: linear-gradient(to bottom, #e6ddbf, #d9cca1);
    border: 2px solid #78501b;
    color: #3c2e13;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .tag-chip:hover {
    background-image: linear-gradient(to bottom, #d9cca1, #c0b38a);
  }
  
  .tag-chip.highlighted {
    background-image: linear-gradient(to bottom, #c9a83a, #a98c30);
    color: #3c2e13;
    border-color: #593c15;
  }
</style> 
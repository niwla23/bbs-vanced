<script lang="ts">
	export let appearance: 'normal' | 'primary' | 'danger' | 'none' = 'none';
	let userClass = '';
	export { userClass as class };

	const additionalClassNames = {
		normal: 'p-4 bg-dark',
		primary: 'p-4 bg-primary text-on-primary',
		danger: 'p-4 bg-red-700',
		none: '!border-none'
	}[appearance];
</script>

<button
	class="w-full rounded-md border border-colborder transform transition-all active:scale-95 hover:opacity-90 {additionalClassNames} {userClass}"
	on:click
>
	<slot />
</button>

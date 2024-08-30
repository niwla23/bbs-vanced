<script lang="ts">
	// we do not talk about this

	export let appearance: 'normal' | 'primary' | 'danger' | 'none' = 'none';
	let userClass = '';
	export { userClass as class };
	export let disabled = false;

	// not a typo, it has reasons...
	function getExtraClassNames(appearanc: typeof appearance, disabled: boolean) {
		const additionalClassNamesPre = {
			normal: 'p-4 bg-dark',
			primary: 'p-4 bg-primary text-on-primary',
			danger: 'p-4 bg-red-700',
			none: '!border-none'
		}[appearance];
		const extra = disabled ? ' text-gray-800' : '';

		return additionalClassNamesPre + extra;
	}

	$: additionalClassNames = getExtraClassNames(appearance, disabled);
</script>

<button
	class="w-full rounded-md border border-colborder transform transition-all active:scale-95 hover:opacity-90 {additionalClassNames} {userClass}"
	{disabled}
	on:click
>
	<slot />
</button>

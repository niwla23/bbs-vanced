<script lang="ts">
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import UiButton from '@/lib/UiButton.svelte';
	import { getAuthenticatedPocketBase } from '@/lib/clientAuth';
	import { loadScript } from '@paypal/paypal-js';
	import type Client from 'pocketbase';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';

	let paypal;
	let pb: Client;
	let promoCode = '';
	let promoPrice: number | null = null;

	async function checkPromoCode() {
		const result = await fetch(`/api/orders/checkPromoCode?code=${promoCode}`);
		const data = await result.json();
		if (data.error) {
			Swal.fire('Code nicht gefunden');
			return;
		}
		promoPrice = data.price;
	}

	async function activatePaypal() {
		pb = await getAuthenticatedPocketBase();

		if (!env.PUBLIC_PAYPAL_CLIENT_ID) throw new Error('no paypal client id');
		paypal = await loadScript({ clientId: env.PUBLIC_PAYPAL_CLIENT_ID, currency: 'EUR' });
		if (!paypal) throw new Error('where paypal??');
		const buttons = paypal.Buttons({
			async createOrder() {
				try {
					if (!pb.authStore.model) throw new Error('no user logged in');

					const url = new URL('/api/orders', window.location.origin);
					url.searchParams.append('userId', pb.authStore.model.id);
					if (promoCode != '') {
						url.searchParams.append('promoCode', promoCode);
					}
					const response = await fetch(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						}
					});

					const orderData = await response.json();
					console.log('orderData', orderData);

					if (orderData.id) {
						return orderData.id;
					} else {
						const errorDetail = orderData?.details?.[0];
						const errorMessage = errorDetail
							? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
							: JSON.stringify(orderData);

						throw new Error(errorMessage);
					}
				} catch (error) {
					console.error(error);
					alert(`Could not initiate PayPal Checkout...<br><br>${error}`);
				}
			},

			async onApprove(data, actions) {
				try {
					const response = await fetch(`/api/orders/capture?orderId=${data.orderID}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						}
					});

					const orderData = await response.json();
					// Three cases to handle:
					//   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
					//   (2) Other non-recoverable errors -> Show a failure message
					//   (3) Successful transaction -> Show confirmation or thank you message

					const errorDetail = orderData?.details?.[0];

					if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
						// (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
						// recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
						return actions.restart();
					} else if (errorDetail) {
						// (2) Other non-recoverable errors -> Show a failure message
						throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
					} else if (!orderData.purchase_units) {
						throw new Error(JSON.stringify(orderData));
					} else {
						// (3) Successful transaction -> Show confirmation or thank you message
						// Or go to another URL:  actions.redirect('thank_you.html');
						const transaction =
							orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
							orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
						Swal.fire(`Kauf erfolgreich! Bitte App neustarten.`);
						localStorage.setItem('hasPro', 'true');
						console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
						goto('/');
					}
				} catch (error) {
					console.error(error);
					Swal.fire(`Sorry, your transaction could not be processed...<br><br>${error}`);
				}
			}
		});
		await buttons.render('#paypal_buttons');
	}

	onMount(async () => {
		await activatePaypal();
	});
</script>

<div class="w-full h-full grid justify-center items-center">
	<div class="flex flex-col gap-1 p-4">
		<p class="pb-2">
			PRO für {pb ? pb.authStore.model?.email : 'wird geladen'} kaufen
		</p>
		<label class="">
			<p>Promo-Code</p>
			<div class="flex">
				<input placeholder="ABCDEF" bind:value={promoCode} class="p-1 bg-dark rounded-md w-full" />
				<UiButton appearance="primary" class="!p-2 flex-1 rounded-l-none" on:click={checkPromoCode}>
					Anwenden
				</UiButton>
			</div>
		</label>
		{#if promoPrice}
			<div class="flex justify-between gap-2">
				<p>Rabatt</p>
				<p class="text-xl text-center">
					{(Number(env.PUBLIC_PRO_PRICE) - promoPrice).toFixed(2)}€
				</p>
			</div>
		{/if}
		<div class="flex justify-between items-baseline gap-2 pb-4">
			<p>Preis</p>
			<p class="font-bold text-primary text-xl text-center">
				{promoPrice?.toFixed(2) || Number(env.PUBLIC_PRO_PRICE).toFixed(2)}€
			</p>
		</div>
		<small>
			Mit dem Kauf stimmst du den <a href="/legal/agb" class="underline">AGB</a>
			zu.
		</small>
		<div id="paypal_buttons" />
		<a class="bg-darkest rounded-md p-4 text-center underline" href="/activatePro/key">
			Ich habe einen Lizenzschlüssel
		</a>
	</div>
</div>

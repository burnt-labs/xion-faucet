<template>
	<div>
		<div class="bg-dark-opacity">
			<!-- Step 1: Add your Xion Testnet Address -->
			<div class="text-center">
				<h2>Add your Xion Address</h2>
				<div class="tooltip top">
					<span class="tooltip-text">
						Please enter your Xion wallet address which we'll use to transfer your testnet tokens.<br />
						It should begin with "xion1".
					</span>
				</div>
				<div class="txt-details">
					<p>
						If you’re a developer aiming to test the functionality of the Xion network or set up a node on
						testnet, you can obtain XION testnet tokens using this faucet.
					</p>
				</div>
				<v-form ref="form" v-model="isValid">
					<v-col cols="12">
						<v-card class="mb-12 col-auto" color="lighten-1">
							<v-text-field v-model="walletAddress" autocomplete="wallet-address"
								label="Xion Wallet Address" :hint="`Example: ${faucetAddress}`" required class="col-12"
								:rules="addressRules" />
						</v-card>
					</v-col>
				</v-form>

				<!-- Step 2: Verification Challenge -->
				<v-form v-if="walletAddress && isValid" @submit.prevent="submitForm">
					<NuxtTurnstile ref="turnstile" v-model="verificationToken" data-refresh-timeout="manual" />
					<v-btn type="submit" class="btn btn-primary d-block mx-auto" :disabled="isButtonDisabled">
						{{ isLoading ? 'Loading...' : 'Continue' }}
					</v-btn>
				</v-form>
			</div>
		</div>

		<v-alert icon="mdi-shield-lock-outline" prominent dismissible text type="info" v-model="errorNonExistingAddress"
			transition="scale-transition" class="mt-3" outlined>
			<b>Address is not in the expected format for this chain or does not exist.</b>
		</v-alert>
		<v-alert icon="mdi-shield-lock-outline" prominent dismissible text type="warning" v-model="errorRecaptcha"
			transition="scale-transition" class="mt-3" outlined>
			<b>You haven't passed the reCaptcha Verification challenge yet.</b>
		</v-alert>
		<v-alert icon="mdi-alert-circle-outline" prominent dismissible text type="error" v-if="hasError"
			transition="scale-transition" class="mt-3" outlined>
			<b>An error occurred: {{ errorMessage }} (Status Code: {{ statusCode }})</b>
		</v-alert>
		<v-alert icon="mdi-check-circle-outline" prominent dismissible text type="success" v-model="isSuccess"
			transition="scale-transition" class="mt-3" outlined>
			<b>Done! Your requested tokens should have arrived at your provided address ({{ faucetAmountGiven }} {{
				faucetDenom }}).</b>
		</v-alert>

		<!-- Reset Button -->
		<v-btn v-if="isSuccess" @click="resetAllForms" class="btn btn-secondary d-block mx-auto mt-4">
			Reset
		</v-btn>
	</div>
</template>

<script>
const faucetDenom = process.env.NUXT_PUBLIC_FAUCET_DENOM || 'uxion';
const faucetAmountGiven = process.env.NUXT_PUBLIC_FAUCET_AMOUNT_GIVEN || 2000000;
const faucetAddress = process.env.NUXT_PUBLIC_FAUCET_ADDRESS || 'xion14yy92ae8eq0q3ezy9nasumt65hwdgryvpkf0a4';

export default {
	data() {
		return {
			isLoading: false,
			verificationToken: null,
			walletAddress: '',
			hasError: false,
			isSuccess: false,
			isValid: false,
			statusCode: null,
			errorNonExistingAddress: false,
			errorRecaptcha: false,
			addressRules: [
				value => !!value || `Required.\n Example: ${faucetAddress}`,
				value => /^(xion)1[a-z0-9]{38,64}$/.test(value) || 'Invalid xion address format.',
			],
		};
	},
	computed: {
		isButtonDisabled() {
			return this.isLoading || !this.isValid || !this.verificationToken || !this.walletAddress;
		}
	},
	methods: {
		resetForm() {
			this.isLoading = false;
			this.verificationToken = null;
			this.$refs.turnstile?.reset();
		},
		resetAllForms() {
			this.isValid = false;
			this.walletAddress = '';
			this.isLoading = false;
			this.isSuccess = false;
			this.resetForm();
		},
		async throwError(message, status, interval = 10000) {
			this.hasError = true;
			this.statusCode = status;
			this.errorMessage = message;
			this.resetForm();
			setTimeout(() => {
				this.hasError = false;
				this.statusCode = null;
				this.errorMessage = '';
			}, interval);
		},
		async submitForm() {
			this.isLoading = true;
			const response = await this.fetchApiCredit();
			const result = await response.json();
			if (response.status !== 200 || result.code !== 0) {
				return this.throwError(result.message, result.status);
			}
			this.isSuccess = true;
			this.isLoading = false;
			this.resetForm();
		},
		async fetchApiCredit() {
			return $fetch.native(`/api/credit`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token: this.verificationToken,
					denom: faucetDenom,
					address: this.walletAddress || faucetAddress,
				}),
			});
		},
	}
};
</script>

<style scoped>
.cf-turnstile {
	margin: 0 auto 20px;
	width: 304px;
}

.bg-dark-opacity {
	background: rgba(48, 48, 48, 0.9) !important;
	max-width: 700px;
	margin: 0 auto;
	padding: 20px;
	border-radius: 8px;
}

.txt-details {
	text-align: center;
}

.tooltip {
	position: relative;
	display: inline-block;
	cursor: pointer;
}

.tooltip .tooltip-text {
	visibility: hidden;
	width: 200px;
	background-color: #333;
	color: #fff;
	text-align: center;
	border-radius: 6px;
	padding: 5px 0;
	position: absolute;
	z-index: 1;
	bottom: 125%;
	left: 50%;
	margin-left: -100px;
	opacity: 0;
	transition: opacity 0.3s;
}

.tooltip:hover .tooltip-text {
	visibility: visible;
	opacity: 1;
}

.btn {
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}

.btn-primary {
	background-color: #007bff;
	color: white;
}

.btn-secondary {
	background-color: #6c757d;
	color: white;
}

@media only screen and (max-width: 992px) {
	.bg-dark-opacity {
		width: 85%;
	}
}

@media only screen and (max-width: 576px) {
	.bg-dark-opacity {
		width: 100%;
	}
}
</style>

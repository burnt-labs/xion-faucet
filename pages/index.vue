<template>
	<div v-if="isLoading" class="loading-overlay">
		<v-img src="./assets/img/shadowy.gif" class="loading-image" />
	</div>
	<!-- Step 1: Add your Xion Testnet Address -->
	<div v-else class="bg-dark-opacity">
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
						<v-text-field v-model="walletAddress" autocomplete="wallet-address" label="Xion Wallet Address"
							:hint="`Example: ${$config.public[selected]?.address || $config.public.faucet.address}`"
							required class="col-12" :rules="[
								(value: string) => !!value || `Required.\n Example: ${$config.public[selected]?.address || $config.public.faucet.address}`,
								(value: string) => /^(xion)1[a-z0-9]{38,64}$/.test(value) || 'Invalid xion address format.',
							]" />
					</v-card>
				</v-col>
			</v-form>

			<!-- Step 2: Verification Challenge -->
			<v-form @submit.prevent="submitForm">
				<NuxtTurnstile ref="turnstile" v-model="verificationToken" data-refresh-timeout="manual" />
				<v-btn v-if="!isSuccess" type="submit" class="btn btn-primary d-block mx-auto"
					:disabled="isButtonDisabled">
					{{ isLoading ? 'Loading...' : 'Continue' }}
				</v-btn>
				<v-btn v-else @click="resetAllForms" class="btn btn-secondary d-block mx-auto mt-4">
					Reset
				</v-btn>
			</v-form>
		</div>
	</div>
	<div>
		<v-alert shaped dismissible icon="mdi-shield-lock-outline" type="info" transition="scale-transition"
			v-model="errorNonExistingAddress" class="mt-1">
			Address is not in the expected format for this chain or does not exist.
		</v-alert>
		<v-alert shaped dismissible icon="mdi-shield-lock-outline" type="warning" transition="scale-transition"
			v-model="errorRecaptcha" class="mt-1">
			You haven't passed the reCaptcha Verification challenge yet.
		</v-alert>
		<v-alert shaped dismissible icon="mdi-alert-circle-outline" type="error" transition="scale-transition"
			v-model="hasError" class="mt-1">
			An error occurred: {{ errorMessage }} (Status Code: {{ statusCode }})
		</v-alert>
		<v-alert shaped dismissible icon="mdi-alert-circle-outline" type="info" transition="scale-transition"
			v-model="isLoading" class="mt-1">
			Sending Tokens...
		</v-alert>
		<v-alert shaped dismissible icon="mdi-check-circle-outline" type="success" transition="scale-transition"
			v-model="isSuccess" class="mt-1">
			Success! Your {{ recievedAmount }} {{ recievedDenom }} have been delivered to the address: &nbsp;
			<a :href="`https://explorer.burnt.com/${selected}/account/${walletAddress}`" target="_blank">
				{{ walletAddress }}
			</a>
		</v-alert>
	</div>
</template>


<script lang="ts">

export default {
	data() {
		return {
			isLoading: false,
			verificationToken: '',
			walletAddress: '',
			hasError: false,
			isSuccess: false,
			isValid: false,
			statusCode: null,
			errorNonExistingAddress: false,
			errorRecaptcha: false,
			errorMessage: '',
			recievedAmount: this.$config.public.faucet.amountGiven,
			recievedDenom: this.$config.public.faucet.denom,
			imageExists: false,



		};
	},
	mounted() {
		this.checkImageExists(this.$config.public.sendImage);
	},
	computed: {
		isButtonDisabled() {
			return this.isLoading || !this.isValid || !this.verificationToken || !this.walletAddress;
		}
	},
	props: {
		selected: {
			type: String,
			required: true,
		},
	},
	methods: {
		checkImageExists(url: string) {
			const img = new Image();
			img.onload = () => {
				this.imageExists = true;
			};
			img.onerror = () => {
				this.imageExists = false;
			};
			img.src = url;
		},
		resetForm() {
			this.isLoading = false;
			this.verificationToken = '';
			this.$refs.turnstile?.reset();
		},
		resetAllForms() {
			this.isValid = false;
			this.walletAddress = '';
			this.isLoading = false;
			this.isSuccess = false;
			this.recievedAmount = this.$config.public.faucet.amountGiven;
			this.recievedDenom = this.$config.public.faucet.denom;
			this.resetForm();
		},
		async throwError(message: any, status: null, interval = 10000) {
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
			if (result.convertedAmount) {
				this.recievedAmount = result.convertedAmount.amount;
				this.recievedDenom = result.convertedAmount.denom;
			} else if (result.amount) {
				this.recievedAmount = result.amount;
				this.recievedDenom = result.denom;
			}
			this.isSuccess = true;
			this.isLoading = false;
			this.resetForm();
		},
		async fetchApiCredit() {
			return $fetch.native(`/api/credit?chainId=${this.selected}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token: this.verificationToken,
					denom: this.$config.public.faucet.denom,
					address: this.walletAddress
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

.loading-overlay {
	top: 0;
	width: 100%;
	height: 100%;
	max-height: 500px;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	z-index: 9999;
	padding-top: 20px;
	/* Adjust this value as needed */
}

.loading-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.bg-dark-opacity {
	max-width: 700px;
	background: rgba(48, 48, 48, 0.9) !important;
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
	.loading-overlay {
		width: 85%;
	}

	.bg-dark-opacity {
		width: 85%;
	}
}

@media only screen and (max-width: 576px) {
	.loading-overlay {
		width: 100%;
	}

	.bg-dark-opacity {
		width: 100%;
	}
}
</style>

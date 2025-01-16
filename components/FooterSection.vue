<template>
	<v-footer class="page-footer" relative>
		<div class="social-links">
			<a href="https://x.com/burnt_xion" class="social-links__icon" target="_blank" aria-label="Twitter">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img">
					<title>Follow us on Twitter</title>
					<path
						d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z">
					</path>
				</svg>
			</a>
			<a href="https://discord.com/invite/burnt" class="social-links__icon" target="_blank" aria-label="Discord">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512" role="img">
					<title>Join us on Discord</title>
					<path
						d="M20.317 2.156A19.791 19.791 0 0 0 15.432.64a.074.074 0 0 0-.079.038c-.21.375-.444.864-.608 1.249a18.271 18.271 0 0 0-5.487 0 12.644 12.644 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.516.07.07 0 0 0-.032.027C.533 6.832-.32 11.366.099 15.843a.083.083 0 0 0 .031.057 19.902 19.902 0 0 0 5.993 3.03.078.078 0 0 0 .084-.029 14.22 14.22 0 0 0 1.226-1.994.075.075 0 0 0-.041-.105 13.109 13.109 0 0 1-1.872-.893.077.077 0 0 1-.008-.127c.126-.095.252-.193.372-.292a.074.074 0 0 1 .078-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.01c.12.098.245.197.372.292.044.032.04.1-.006.127-.598.35-1.22.645-1.873.892a.077.077 0 0 0-.041.106c.36.698.772 1.363 1.225 1.994a.076.076 0 0 0 .084.028 19.836 19.836 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03ZM8.02 13.117c-1.182 0-2.157-1.086-2.157-2.419S6.82 8.28 8.02 8.28c1.21 0 2.176 1.095 2.157 2.42 0 1.332-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419s.955-2.419 2.157-2.419c1.21 0 2.176 1.095 2.157 2.42 0 1.332-.946 2.418-2.157 2.418Z">
					</path>
				</svg>
			</a>
			<a href="https://t.me/xion_announcements" class="social-links__icon" target="_blank" aria-label="Telegram">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" role="img">
					<title>Follow us on Telegram</title>
					<path
						d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z">
					</path>
				</svg>
			</a>
			<a href="https://github.com/burnt-labs" class="social-links__icon" target="_blank" aria-label="GitHub">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512" role="img">
					<title>Follow us on GitHub</title>
					<path
						d="M186.1 328.7c0 20.9-10.9 55.1-36.7 55.1s-36.7-34.2-36.7-55.1 10.9-55.1 36.7-55.1 36.7 34.2 36.7 55.1zM480 278.2c0 31.9-3.2 65.7-17.5 95-37.9 76.6-142.1 74.8-216.7 74.8-75.8 0-186.2 2.7-225.6-74.8-14.6-29-20.2-63.1-20.2-95 0-41.9 13.9-81.5 41.5-113.6-5.2-15.8-7.7-32.4-7.7-48.8 0-21.5 4.9-32.3 14.6-51.8 45.3 0 74.3 9 108.8 36 29-6.9 58.8-10 88.7-10 27 0 54.2 2.9 80.4 9.2 34-26.7 63-35.2 107.8-35.2 9.8 19.5 14.6 30.3 14.6 51.8 0 16.4-2.6 32.7-7.7 48.2 27.5 32.4 39 72.3 39 114.2zm-64.3 50.5c0-43.9-26.7-82.6-73.5-82.6-18.9 0-37 3.4-56 6-14.9 2.3-29.8 3.2-45.1 3.2-15.2 0-30.1-.9-45.1-3.2-18.7-2.6-37-6-56-6-46.8 0-73.5 38.7-73.5 82.6 0 87.8 80.4 101.3 150.4 101.3h48.2c70.3 0 150.6-13.4 150.6-101.3zm-82.6-55.1c-25.8 0-36.7 34.2-36.7 55.1s10.9 55.1 36.7 55.1 36.7-34.2 36.7-55.1-10.9-55.1-36.7-55.1z">
					</path>
				</svg>
			</a>
		</div>
		<p class="footer-text">
			&copy; {{ new Date().getFullYear() }} <a href="https://xion.burnt.com" rel="noopener"
				target="_blank">XION</a> - The User-First Blockchain

		</p>
	</v-footer>
</template>

<script>
export default {
	name: 'FooterSection',
};
</script>

<style scoped>
.page-footer {
	width: 100%;
	display: block;
	background: rgba(48, 48, 48, 0.8);
}

.social-links {
	width: 100%;
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.social-links__icon {
	background-color: transparent;
	border-radius: 4px;
	display: inline-block;
	margin: 0 0.7rem 0.35rem 0;
	padding: 0.7rem;
	cursor: pointer;
}

.social-links svg {
	fill: #fff;
	width: 40px;
	height: 40px;
	transition: fill 0.2s ease-in-out;
}

.social-links svg:hover {
	fill: #FE5000;
}

.footer-text {
	text-align: center;
	font-size: 18px;
}

@media only screen and (max-width: 992px) {
	.social-links svg {
		width: 30px;
		height: 30px;
	}
}

@media only screen and (max-width: 576px) {
	.social-links__icon {
		margin: 0;
	}
}

@media only screen and (max-width: 480px) {
	.social-links__icon {
		padding: 0.7rem 0
	}
}
</style>

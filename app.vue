<template>
  <v-app class="vapp-background">
    <header-section :faucet-status="faucetStatus" :status-color="faucetStatusColor" :items="items"
      v-model:selected="selected" />
    <v-main class="main-container">
      <v-container class="main-container">
        <NuxtPage :selected="selected" />
      </v-container>
    </v-main>
    <footer-section />
  </v-app>
</template>

<script>
import HeaderSection from './components/HeaderSection.vue';
import FooterSection from './components/FooterSection.vue';

useHead({
  title: 'Xion Testnet Faucet',
  meta: [
    {
      name: 'description',
      content: 'Xion Testnet Faucet',
    },
    {
      name: 'keywords',
      content: 'Xion, Testnet, Faucet',
    },
  ],
});

export default {
  name: 'DefaultLayout',
  components: {
    HeaderSection,
    FooterSection,
  },
  data() {
    return {
      faucetStatus: '',
      faucetStatusColor: '',
      items: ['xion-testnet-1', "xion-testnet-2"],
      selected: 'xion-testnet-2',
    };
  },
  watch: {
    selected(newValue) {
      this.updateFaucetStatus();
    },
    selectedValue(newValue) {
      this.$emit('update:selected', newValue);
    }
  },
  mounted() {
    this.startFaucetStatusPolling();
  },
  methods: {
    async startFaucetStatusPolling() {
      const interval = 30000;
      await this.updateFaucetStatus();
      setTimeout(() => {
        this.startFaucetStatusPolling();
      }, interval);
    },

    async updateFaucetStatus() {
      try {
        const status = await $fetch(`/api/status?chainId=${this.selected}`);
        if (status.status === 'ok') {
          this.faucetStatusColor = 'green';
          this.faucetStatus = 'Operational';
          return;
        }
      } catch (error) {
        console.error('Error fetching status:', error);
      }
      this.faucetStatusColor = 'red';
      this.faucetStatus = 'Down';
    },
  },
};
</script>

<style scoped>
.vapp-background {
  background: url('./assets/img/bg4.png') no-repeat center center;
  background-size: cover;
  font-family: 'Nunito', sans-serif;
}

.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75vh;
  padding: 50px 0;
}
</style>

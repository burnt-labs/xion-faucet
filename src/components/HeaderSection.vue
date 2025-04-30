<template>
  <div id="header">
    <div class="flex-cont-header">
      <div class="status-header-left">
        <img class="main-img-logo" src="../assets/img/xion-Logo-White.png" alt="logo" />
      </div>
      <h1 class="testnet-header">Xion Testnet Faucet</h1>
      <div class="status-header">
        <desktop-status :faucet-status="faucetStatus" :status-color="statusColor" :items="items" :selected="selected"
          @update:selected="$emit('update:selected', $event)" />
        <mobile-status-dialog :faucet-status="faucetStatus" :status-color="statusColor" :items="items"
          :selected="selected" @update:selected="$emit('update:selected', $event)" />
      </div>
    </div>
  </div>
</template>

<script>
import DesktopStatus from './DesktopStatus.vue';
import MobileStatusDialog from './MobileStatusDialog.vue';

export default {
  name: 'HeaderSection',
  components: {
    DesktopStatus,
    MobileStatusDialog,
  },
  props: {
    faucetStatus: String,
    statusColor: String,
    items: Array,
    selected: String,
  },
};
</script>

<style scoped>
#header {
  width: 100%;
  display: block;
  background: rgba(48, 48, 48, 0.8);
  padding-top: 20px;
  z-index: 100;
}

.flex-cont-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.status-header {
  margin-top: -30px;
  padding: 7px 15px 0 0;
  width: 250px;
}

.status-header-left {
  width: 250px;
}

.main-img-logo {
  width: 150px;
  display: block;
  padding-left: 15px;
}

@media only screen and (max-width: 992px) {
  .main-img-logo {
    width: 120px;
    margin: 0 auto;
  }

  .status-header,
  .status-header-left {
    width: auto;
  }
}

@media only screen and (max-width: 756px) {
  .testnet-header {
    font-size: 30px;
  }
}

@media only screen and (max-width: 576px) {
  .main-img-logo {
    width: 80px;
    margin: 0;
  }

  .testnet-header {
    font-size: 24px;
  }
}
</style>

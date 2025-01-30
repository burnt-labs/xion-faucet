<template>
  <div class="desktop-status">
    <v-select class="select-chain mr-3" v-model="selectedValue" :items="items" outlined></v-select>
    <div class="faucet-status">
      <h4 class="status-title">
        Faucet Status:
        <span class="status-text">
          <span class="status-label">{{ faucetStatus }}</span>
          <v-tooltip top>
            <template #activator="{ props }">
              <v-icon v-bind="props" :color="statusColor" small>
                mdi-circle
              </v-icon>
            </template>
            <span>{{ faucetStatus }}</span>
          </v-tooltip>
        </span>
      </h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesktopStatus',
  props: {
    faucetStatus: String,
    statusColor: String,
    items: Array,
    selected: String,
  },
  data() {
    return {
      selectedValue: this.selected
    };
  },
  watch: {
    selected(newValue) {
      this.selectedValue = newValue;
    },
    selectedValue(newValue) {
      this.$emit('update:selected', newValue);
    }
  }
};
</script>

<style scoped>
.desktop-status {
  overflow: visible;
  display: block;
  height: 100px;
}

.status-title {
  font-weight: 300;
}

.status-text {
  display: inline-flex;
  align-items: center;
}

.select-chain {
  max-width: 225px;
}

.faucet-status {
  justify-items: center;
  margin-top: -20px;
}

/* Combining all media queries into one */
@media only screen and (max-width: 992px) {
  .desktop-status {
    display: none;
  }
}
</style>

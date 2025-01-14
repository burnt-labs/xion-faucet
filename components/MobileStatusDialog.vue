<template>
  <div class="mobile-status-div">
    <v-dialog v-model="dialog" width="auto">
      <!-- Use a more straightforward approach for the activator -->
      <template v-slot:activator="{ on }">
        <v-btn icon :color="statusColor" @click="toggleDialog">
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5 lighten-2"></v-card-title>
        <v-card-text class="mt-2">
          <div class="faucet-comp-status">
            <v-select class="select-chain mr-3" :value="selected" :items="items" outlined
              @input="$emit('update:selected', $event)"></v-select>
            <h4 class="font-weight-light">
              Faucet Status:
              <span class="status-text-col">
                <span class="mr-1">{{ faucetStatus }}</span>
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
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'MobileStatusDialog',
  props: {
    faucetStatus: String,
    statusColor: String,
    items: Array,
    selected: String
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    toggleDialog() {
      this.dialog = !this.dialog;
    }
  }
};
</script>

<style scoped>
.mobile-status-div {
  display: none;
}

.faucet-comp-status {
  justify-items: center;
  margin-top: -20px;
}

.select-chain {
  min-width: 225px;
}

@media only screen and (max-width: 992px) {
  .mobile-status-div {
    display: block;
    width: 100px;
  }
}

@media only screen and (max-width: 756px),
only screen and (max-width: 576px),
only screen and (max-width: 480px) {
  .mobile-status-div {
    display: block;
  }
}

@media only screen and (max-width: 576px) {
  .mobile-status-div {
    width: 60px;
  }
}
</style>

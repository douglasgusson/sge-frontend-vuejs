<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped class="d-print-none">
      <v-list dense>
        <v-list-item :key="i" v-for="(route, i) in $router.options.routes" link :to="route.path">
          <v-list-item-content>
            <v-list-item-title>{{ route.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left class="d-print-none">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>SGE</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer class="d-print-none" app>
      <span>SGE &copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  props: {
    source: String,
  },

  data: () => ({
    drawer: null,
  }),

  created() {
    this.$vuetify.theme.dark = false;
  },
};
</script>

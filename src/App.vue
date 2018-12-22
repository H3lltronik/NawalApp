<template>
  <v-app>
    <v-navigation-drawer app fixed v-model="drawer" v-if="authorizedAccess" dark>
      <v-list>
        <v-list-tile avatar to="viewTherapy">
          <v-list-tile-avatar>
            <v-icon>notes</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>Ver citas</v-list-tile-title>
        </v-list-tile>
        <v-list-tile avatar to="registerTheraphy">
          <v-list-tile-avatar>
            <v-icon>edit</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>Registrar citas</v-list-tile-title>
        </v-list-tile>
        <v-list-tile avatar @click="onLogout" class="hidden-sm-and-up" to="/">
          <v-list-tile-avatar>
            <v-icon>lock</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>Cerrar Sesion</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="primary" app fixed>
      <v-toolbar-side-icon @click="drawer = !drawer" v-if="authorizedAccess"></v-toolbar-side-icon>
      <v-avatar
        size="40"
      >
        <img src="../static/logo.png" alt="alt">
      </v-avatar>
      <v-toolbar-title class="white--text">Nawal Services</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only" v-if="authorizedAccess">
        <v-btn color="dark" flat @click="onLogout" to="/">
          <v-icon left>lock</v-icon>
          <div right>Cerrar sesion</div>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
    }
  },
  computed: {
    isUserLogedIn () {
      return this.$store.getters.getUser
    },
    authorizedAccess () {
      let acceso = (this.$store.getters.getUser !== null && this.$store.getters.getUser !== undefined)
      this.authorized = acceso
      return acceso
    }
  },
  name: 'App'
}
</script>

<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
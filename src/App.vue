<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app>
    <v-navigation-drawer app temporary v-model="drawer" v-if="!isUserLoggedIn">
      <v-list>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content v-text="'Главная'"></v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="search">
          <v-list-tile-action>
            <v-icon>search</v-icon>
          </v-list-tile-action>
          <v-list-tile-content v-text="'Поиск пользователей'"></v-list-tile-content>
        </v-list-tile>
        <v-list-group no-action sub-group value="true">
          <template v-slot:activator="">
            <v-list-tile>
              <v-list-tile-title>sane55ek@gmail.com</v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-tile v-for="(item, i) in dropdownList" :key="i" :to="item.url">
            <v-list-tile-title :to="item.url">{{item.title}}</v-list-tile-title>
            <v-list-tile-content class="menu-icon">
              <v-icon>{{item.icon}}</v-icon>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content v-text="'Выйти'"></v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer app temporary v-model="drawer" v-else>
      <v-list>
        <v-list-tile to="/login">
          <v-list-tile-action>
            <v-icon>lock</v-icon>
          </v-list-tile-action>
          <v-list-tile-content v-text="'Войти'"></v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/register">
          <v-list-tile-action>
            <v-icon>face</v-icon>
          </v-list-tile-action>
          <v-list-tile-content v-text="'Регистрация'"></v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark color="primary" v-if="!isUserLoggedIn">
      <v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" class="pointer">
          <v-spacer></v-spacer>
          <v-icon left>library_books</v-icon>
          Plan Build
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <!-- *************************** LOGGED ****************************** !-->
        <v-scale-transition>
          <v-text-field
            v-model="searchText"
            label="Поиск пользователей"
            clearable
            v-show="searchOn"
            dark
            color="white"
            style="width: 500px;"
          ></v-text-field>
        </v-scale-transition>
        <v-btn flat icon @click="searchOn=false" v-if="searchOn">
          <v-icon>cancel</v-icon>
        </v-btn>
        <v-btn flat icon @click="searchOn=true" v-else>
          <v-icon>search</v-icon>
        </v-btn>
        <v-menu bottom origin="center center" transition="scale-transition">
          <template v-slot:activator="{ on }">
            <v-btn color="white" dark v-on="on" flat>
              sane55ek@gmail.com
            </v-btn>
          </template>
          <v-list>
            <v-list-tile v-for="(item, i) in dropdownList" :key="i" :to="item.url">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-content class="menu-icon">
                <v-icon >{{item.icon}}</v-icon>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn @click="onLogout" flat>
          <v-icon left>exit_to_app</v-icon>
          Выйти
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-toolbar app dark color="primary" v-else>
      <v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" class="pointer">
          <v-spacer></v-spacer>
          <v-icon left>library_books</v-icon>
          Plan Build
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <!-- ************************* NOT LOGGED **************************** !-->
        <v-btn to="/login" flat>
          <v-icon left>lock</v-icon>
          Войти
        </v-btn>
        <v-btn to="/register" flat>
          <v-icon left>face</v-icon>
          Регистрация
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <template v-if="error">
      <v-snackbar
        :multi-line="true"
        :timeout="5000"
        @input="closeError"
        :value="true"
        color="error"
      >
        {{error}}
        <v-btn
          dark
          flat
          @click="closeError"
        >
          Close
        </v-btn>
      </v-snackbar>
    </template>

  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      searchOn: false,
      searchText: ''
    }
  },
  methods: {
    closeError () {
      this.$store.dispatch('clearError')
    },
    onLogout () {
      this.$store.dispatch('logoutUser')
      this.$router.push('/')
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    dropdownList () {
      return [
        { title: 'Пользователь', icon: 'account_circle', url: '/user' },
        { title: 'Ячейки', icon: 'border_all', url: '/cells' },
        { title: 'Заполнение', icon: 'edit', url: '/fill' }
      ]
    },
    isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn
    }
  }
}
</script>

<style>
  .pointer {
    cursor: pointer;
  }
  .menu-icon {
    min-width: 25px;
  }
</style>

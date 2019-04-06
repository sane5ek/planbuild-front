<template>
  <v-container fluid>
    <v-layout v-if="!loading" wrap>
      <v-text-field
        class="hidden-md-and-up"
        v-model="search"
        label="Поиск пользователей"
        clearable
        color="primary"
        @keyup.enter="goSearch"
        lazy
        autofocus
      ></v-text-field>
      <v-flex sm12 md6 lg4 class="px-1 mb-4" v-for="user in users" :key="user.email">
        <v-card color="primary" class="white--text">
          <v-layout column text-xs-center justify-center align-center>
              <v-card-title primary-title>
                <div>
                  <div class="headline font-weight-bold mb-2">{{ user.email }}</div>
                  <div class="subheading mb-2">{{ user.last_name + ' ' + user.first_name}}</div>
                  <div class="subheading font-italic font-weight-bold" v-if="user.fields ==='default'">Поля по умолчанию</div>
                  <div class="subheading font-italic font-weight-bold" v-else-if="user.fields ==='user'">Собственные поля</div>
                  <div class="subheading font-italic font-weight-bold" v-else>Поля пользователя {{user.fields}}</div>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn v-if="user.fields !== 'default' && user.fields !== userEmail" @click="onAdopt(user.email)" outline flat dark>Заимствовать</v-btn>
                <v-btn v-else disabled flat dark></v-btn>
              </v-card-actions>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex sm12 md12 lg12 class="px-1 mb-4" v-if="users.length === 0">
        <v-alert
          :value="true"
          color="primary"
          icon="new_releases"
        >
          Пользователей по такому запросу не найдено
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          :size="100"
          :width="4"
          color="secondary"
          indeterminate
        ></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    users () {
      return this.$store.getters.foundUsers
    },
    search: {
      get () {
        return this.$store.getters.search
      },
      set (value) {
        this.$store.dispatch('setSearch', value)
      }
    },
    userEmail () {
      return this.$store.getters.user.email
    }
  },
  methods: {
    goSearch () {
      this.$store.dispatch('loadUsers')
      this.$refs.searchInput.$el.focus()
    },
    onAdopt (email) {
      this.$store.dispatch('adoptFields', email)
    }
  },
  beforeCreate () {
    this.$store.dispatch('loadUsers')
  }
}
</script>

<style scoped>

</style>

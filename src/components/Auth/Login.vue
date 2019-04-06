<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Вход в аккаунт</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid" ref="form" validation>
              <v-text-field
                prepend-icon="person"
                name="email"
                label="Электронная почта"
                type="email"
                v-model="email"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Пароль"
                type="password"
                v-model="password"
                :counter="6"
                :rules="passwordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="onSubmit"
              :disabled="!valid"
              :loading="loading"
            >Войти</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      valid: false,
      emailRules: [
        v => !!v || 'Адрес электронной почты не может быть пустым',
        v => /.+@.+/.test(v) || 'Адрес электронной почты должен быть введен корректно'
      ],
      passwordRules: [
        v => !!v || 'Пароль не может быть пустым',
        v => v.length >= 6 || 'Пароль должен состоять из шести или более символов'
      ]
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        const user = {
          username: this.email,
          password: this.password
        }
        this.$store.dispatch('loginUser', user)
          .then((response) => {
            this.$store.dispatch('loadUserInfo')
            this.$router.push('/')
          })
          .catch((e) => {})
      }
    }
  },
  created () {
    if (this.$route.query['loginError']) {
      this.$store.dispatch('setError', 'Войдите в аккаунт чтобы получить доступ к данной странице.')
    }
  }
}
</script>

<style scoped>

</style>

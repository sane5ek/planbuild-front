<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Регистрация</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-text-field
                prepend-icon="person"
                name="first_name"
                label="Имя"
                type="text"
                v-model="firstName"
                :rules="firstNameRules"
              ></v-text-field>
              <v-text-field
                prepend-icon="perm_identity"
                name="last_name"
                label="Фамилия"
                type="text"
                v-model="lastName"
                :rules="lastNameRules"
              ></v-text-field>
              <v-select
                v-model="post"
                :items="posts"
                label="Выберите должность"
                prepend-icon="assignment_ind"
                :rules="postRules"
              ></v-select>
              <v-text-field
                type="number"
                v-model="salary"
                prepend-icon="attach_money"
                step="0.5"
                label="Ставка"
                min="0.5"
                max="5"
              ></v-text-field>
              <v-select
                v-model="title"
                :items="titles"
                label="Выберите ученое звание"
                prepend-icon="account_balance"
                :rules="titleRules"
              ></v-select>
              <v-select
                v-model="degree"
                :items="degrees"
                label="Выберите ученую степень"
                prepend-icon="school"
                clearable
              ></v-select>
              <v-text-field
                prepend-icon="email"
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
              <v-text-field
                prepend-icon="lock"
                name="confirm-password"
                label="Подтверждение пароля"
                type="password"
                v-model="confirmPassword"
                :counter="6"
                :rules="confirmPasswordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="onSubmit"
              :disabled="!valid || loading"
              :loading="loading"
            >Создать аккаунт</v-btn>
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
      firstName: '',
      lastName: '',
      email: '',
      post: '',
      salary: 1,
      degree: '',
      title: '',
      password: '',
      confirmPassword: '',
      valid: false,
      emailRules: [
        v => !!v || 'Адрес электронной почты не может быть пустым',
        v => /.+@.+/.test(v) || 'Адрес электронной почты должен быть введен корректно'
      ],
      passwordRules: [
        // не должен быть похож на другую личную информацию
        // не может состоять только из цифр
        // должен быть сложным
        v => !!v || 'Пароль не может быть пустым',
        v => v.length >= 6 || 'Пароль должен состоять из шести или более символов'
      ],
      confirmPasswordRules: [
        v => !!v || 'Подтверждение пароля не может быть пустым',
        v => v === this.password || 'Введенные пароли должны совпадать'
      ],
      postRules: [
        v => this.posts.includes(v) || 'Выберите должность из списка'
      ],
      titleRules: [
        v => this.titles.includes(v) || 'Выберите ученое звание из списка'
      ],
      firstNameRules: [
        v => !!v || 'Имя не может быть пустым'
      ],
      lastNameRules: [
        v => !!v || 'Фамилия не может быть пустой'
      ]
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    posts () {
      return this.$store.getters.posts
    },
    degrees () {
      return this.$store.getters.degrees
    },
    titles () {
      return this.$store.getters.titles
    }
  },
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        const user = {
          firstName: this.firstName,
          lastName: this.lastName,
          post: this.post,
          salary: this.salary,
          degree: this.degree,
          title: this.title,
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('registerUser', user)
          .then(() => {
            this.$router.push('/')
          })
          .catch(() => {})
      }
    }
  }
}
</script>

<style scoped>

</style>

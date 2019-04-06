<template>
  <v-container fluid fill-height>
    <v-layout justify-center row wrap>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-4 mr-2 mb-3">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Личные данные</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="personalValid" ref="personalForm" lazy-validation>
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
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="onPersonalSubmit"
              :disabled="!personalValid || loading"
              :loading="loading"
            >Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-4 mr-2 mb-3">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Электронная почта</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="emailValid" ref="emailForm" lazy-validation>
              <v-text-field
                prepend-icon="email"
                name="email"
                label="Новый адрес электронной почты"
                type="email"
                v-model="email"
                :rules="emailRules">
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="onEmailSubmit"
              :disabled="!emailValid || loading"
              :loading="loading"
            >Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-4 mb-3">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Пароль</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="passwordValid" ref="passwordForm" lazy-validation>
              <v-text-field
                prepend-icon="lock"
                name="oldPassword"
                label="Старый пароль"
                type="password"
                v-model="oldPassword"
                :counter="6"
                :rules="passwordRules"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Новый пароль"
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
              @click="onPasswordSubmit"
              :disabled="!passwordValid || loading"
              :loading="loading"
            >Сохранить
            </v-btn>
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
      oldPassword: '',
      password: '',
      confirmPassword: '',
      personalValid: false,
      emailValid: false,
      passwordValid: false,
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
      degreeRules: [
        v => this.degrees.includes(v) || 'Выберите ученую степень из списка'
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
    },
    firstName: {
      get () {
        return this.$store.getters.firstName
      },
      set (value) {
        this.$store.dispatch('setFirstName', value)
      }
    },
    lastName: {
      get () {
        return this.$store.getters.lastName
      },
      set (value) {
        this.$store.dispatch('setLastName', value)
      }
    },
    post: {
      get () {
        return this.$store.getters.post
      },
      set (value) {
        this.$store.dispatch('setPost', value)
      }
    },
    degree: {
      get () {
        return this.$store.getters.degree
      },
      set (value) {
        this.$store.dispatch('setDegree', value)
      }
    },
    title: {
      get () {
        return this.$store.getters.title
      },
      set (value) {
        this.$store.dispatch('setTitle', value)
      }
    },
    salary: {
      get () {
        return this.$store.getters.salary
      },
      set (value) {
        this.$store.dispatch('setSalary', value)
      }
    }
  },
  methods: {
    onPersonalSubmit () {
      if (this.$refs.personalForm.validate()) {
        this.$store.dispatch('editUser')
          .then(() => {
          })
          .catch(() => {
          })
      }
    },
    onEmailSubmit () {
      if (this.$refs.emailForm.validate()) {
        const email = {
          email: this.email
        }
        this.$store.dispatch('editEmail', email)
          .then(() => {
          })
          .catch(() => {
          })
      }
    },
    onPasswordSubmit () {
      if (this.$refs.passwordForm.validate()) {
        const password = {
          oldPassword: this.oldPassword,
          newPassword: this.password
        }
        this.$store.dispatch('editPasswordUser', password)
          .then(() => {
          })
          .catch(() => {
          })
      }
    }
  }
}
</script>

<style scoped>

</style>

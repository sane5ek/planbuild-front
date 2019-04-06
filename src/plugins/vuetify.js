import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#217346',
    secondary: colors.green.base,
    accent: colors.lime.base,
    error: colors.red.base,
    warning: colors.yellow.base,
    info: colors.teal.base,
    success: colors.lightGreen.darken4
  }
})

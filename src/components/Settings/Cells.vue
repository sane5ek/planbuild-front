<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid>
    <v-layout justify-center row wrap>
      <v-flex xs12 sm12 md12>
        <v-alert v-if="fieldsOwner === 'default'"
                 :value="true"
                 color="primary"
                 class="text-xs-center normal-height"
        >
          Вы используете поля по умолчанию. Сохраните, чтобы создать свои поля
        </v-alert>
        <v-alert v-else-if="fieldsOwner === 'user'"
                 :value="true"
                 color="primary"
                 class="text-xs-center cursor-pointer"
                 @click="setDefaultFields"
        >
          Вы используете свои поля. Пользователи могут заимствовать настройки ниже.
          Чтобы вернуть поля по умолчанию, нажмите на это сообщение
        </v-alert>
        <v-alert v-else
                 :value="true"
                 color="primary"
                 class="text-xs-center cursor-pointer"
                 @click="setDefaultFields"
        >
          Вы используете поля пользователя {{fieldsOwner}}.
          Чтобы вернуть поля по умолчанию, нажмите на это сообщение
        </v-alert>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-card>
          <v-card-text>
            <v-layout justify-space-between wrap>
              <v-flex xs12 sm12>
                <v-select @change="reloadFields" label="Выберите курсы" :items="courseSelect"
                          v-model="courseSelected"></v-select>
              </v-flex>
              <v-flex xs12 sm12>
                <v-select @change="reloadFields" label="Выберите тип" :items="studyTypeSelect"
                          v-model="studyTypeSelected"></v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-data-table
            :headers="headers"
            :items="settingsFields"
            class="elevation-1"
            hide-actions
            v-if="!loading"
          >
            <template v-slot:items="props">
              <td class="text-xs-right">
                <v-edit-dialog
                  :return-value.sync="props.item.loadName"
                  large
                  lazy
                  persistent
                  cancel-text="Отменить"
                  save-text="Сохранить"
                >
                  <div>{{ props.item.loadName }}</div>
                  <template v-slot:input>
                    <div class="mt-3 title">Изменить имя нагрузки</div>
                  </template>
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.loadName"
                      label="Имя нагрузки"
                      single-line
                      counter
                      autofocus
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </td>
              <td class="text-xs-left">{{ props.item.planName }}</td>
              <td class="text-xs-right">
                <v-edit-dialog
                  :return-value.sync="props.item.loadColumn"
                  large
                  lazy
                  persistent
                  cancel-text="Отменить"
                  save-text="Сохранить"
                >
                  <div>{{ props.item.loadColumn }}</div>
                  <template v-slot:input>
                    <div class="mt-3 title">Изменить колонку нагрузки</div>
                  </template>
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.loadColumn"
                      label="Колонка нагрузки"
                      single-line
                      autofocus
                      type="number"
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </td>
              <td class="text-xs-left">{{ props.item.planColumn }}</td>
            </template>
            <template v-slot:no-data>
              <td class="text-xs-center" colspan="4">Поля отсутсвуют. Скорее всего, что-то не так</td>
            </template>
          </v-data-table>
          <v-layout row v-else>
            <v-flex xs12 class="text-xs-center pb-5">
              <v-progress-circular
                :size="100"
                :width="4"
                color="secondary"
                indeterminate
              ></v-progress-circular>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-btn
        color="primary"
        @click="onSave"
        :disabled="loading"
        :loading="loading"
        large
      >Сохранить
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      courseSelect: [
        'Первый и первый магистров',
        'Второй, третий и четвертый',
        'Первый и первый магистров заочного отделения',
        'Второй, третий и четвертый заочного отделения'
      ],
      studyTypeSelect: [
        'Бюджет',
        'Договор'
      ],
      courseSynonym: [
        '1_1M',
        '2_4',
        '1_1MZAO',
        '2_4ZAO'
      ],
      studyTypeSynonym: [
        false,
        true
      ],
      courseSelected: '',
      studyTypeSelected: '',
      headers: [
        { text: 'Имя в нагрузке', value: 'loadName', align: 'left', width: '50%' },
        { text: 'Имя в плане', value: 'planName', align: 'left', width: '50%' },
        { text: 'Колонка в нагрузке', value: 'loadColumn', align: 'left', width: '1%' },
        { text: 'Колонка в плане', value: 'planColumn', align: 'left', width: '1%' }
      ]
    }
  },
  computed: {
    fieldsOwner () {
      return this.$store.getters.fieldsOwner
    },
    settingsFields () {
      return this.$store.getters.settingsFields
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    setDefaultFields () {
      if (window.confirm('Вы точно хотите установить поля по умолчанию?')) {
        this.$store.dispatch('loadDefaultFields')
      }
    },
    reloadFields () {
      this.$store.dispatch('loadSettingsFields', {
        'courseType': this.courseSynonym[this.courseSelect.indexOf(this.courseSelected)],
        'studyType': this.studyTypeSynonym[this.studyTypeSelect.indexOf(this.studyTypeSelected)]
      })
    },
    onSave () {
      this.$store.dispatch('saveRawSettingsFields')
    }
  },
  created () {
    this.courseSelected = this.courseSelect[0]
    this.studyTypeSelected = this.studyTypeSelect[0]
    this.$store.dispatch('loadRawSettingsFields')
    this.reloadFields()
  }
}
</script>

<style scoped>
  .cursor-pointer {
    cursor: pointer;
  }
</style>

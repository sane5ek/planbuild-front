<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <template>
      <v-tabs
        dark
        color="primary"
        show-arrows
        grow
        v-model="activeTab"
      >
        <v-tabs-slider color="yellow"></v-tabs-slider>

        <v-tab
          v-for="item in items"
          :key="item"
          disabled
        >
          {{item}}
        </v-tab>

        <v-tabs-items touchless>
          <v-tab-item
            :key="items[0]"
            class="pt-4"
          >
            <v-layout v-if="!loading" justify-center align-space-around row wrap>
              <v-flex sm12 md12 xs12>
                <vue-dropzone
                  ref="dropzone"
                  id="dropzone"
                  :options="dropzoneOptions"
                  @vdropzone-success="checkFile"
                  @vdropzone-removed-file="removeFile"
                ></vue-dropzone>
              </v-flex>
              <v-btn large
                     color="primary mb-3 mt-3"
                     @click="loadSubjects"
                     ref="loadSubjectsButton"
                     :disabled="!this.$store.getters.payloadFile"
              >
                Загрузить предметы
              </v-btn>
            </v-layout>
            <v-layout row v-else>
              <v-flex xs12 class="text-xs-center pt-5">
                <v-progress-circular
                  :size="100"
                  :width="4"
                  color="secondary"
                  indeterminate
                ></v-progress-circular>
              </v-flex>
            </v-layout>
          </v-tab-item>
          <v-tab-item
            :key="items[1]"
            class="pt-4"
          >
            <v-layout v-if="!loading" justify-center align-space-around row wrap>
              <v-flex sm12 md12 xs12>
                <template>
                  <v-data-table
                    v-model="stSelected"
                    :headers="stHeaders"
                    :items="stSubjects"
                    :pagination.sync="stPagination"
                    select-all
                    item-key="number"
                    class="elevation-1"
                    hide-actions
                  >
                    <template v-slot:headers="props">
                      <tr>
                        <th
                          v-for="stHeader in props.headers"
                          :key="stHeader.text"
                          :class="['column sortable', stPagination.descending ? 'desc' : 'asc', stHeader.value === stPagination.sortBy ? 'active' : '']"
                          @click="changeSort(stHeader.value)"
                          :width="stHeader.width"
                          :align="stHeader.align"
                        >
                          {{ stHeader.text }}
                          <v-icon small>arrow_upward</v-icon>
                        </th>
                        <th width="1%">
                          <v-checkbox
                            :input-value="props.all"
                            :indeterminate="props.indeterminate"
                            primary
                            hide-details
                            @click.stop="toggleAll"
                          ></v-checkbox>
                        </th>
                      </tr>
                    </template>
                    <template v-slot:items="props">
                      <tr :active="props.selected" @click="props.selected = !props.selected">
                        <td class="text-xs-left">{{ props.item.number }}</td>
                        <td class="text-xs-left">{{ props.item.subject }}</td>
                        <td class="text-xs-left">{{ props.item.semester }}</td>
                        <td class="text-xs-left">{{ props.item.course }}</td>
                        <td>
                          <v-checkbox
                            :input-value="props.selected"
                            primary
                            hide-details
                          ></v-checkbox>
                        </td>
                      </tr>
                    </template>
                    <template v-slot:no-data>
                      <td class="text-xs-center" colspan="5">Предметы не найдены</td>
                    </template>
                  </v-data-table>
                </template>
              </v-flex>
              <v-btn large
                     color="primary mb-3 mt-3"
                     @click="nextTab"
              >
                Далее
              </v-btn>
            </v-layout>
            <v-layout row v-else>
              <v-flex xs12 class="text-xs-center pt-5">
                <v-progress-circular
                  :size="100"
                  :width="4"
                  color="secondary"
                  indeterminate
                ></v-progress-circular>
              </v-flex>
            </v-layout>
          </v-tab-item>
          <v-tab-item
            :key="items[2]"
            class="pt-4"
          >
            <v-layout v-if="!loading" justify-center align-space-around row wrap>
              <v-flex sm12 offset-md2 md8 xs12 class="my-border">
                <template>
                  <div>
                    <v-toolbar flat color="white">
                      <v-toolbar-title>Курсовые и дипломные работы</v-toolbar-title>
                      <v-divider
                        class="mx-2"
                        inset
                        vertical
                      ></v-divider>
                      <v-spacer></v-spacer>
                      <v-dialog persistent v-model="cDialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                          <v-btn color="primary" dark class="mb-2" v-on="on">Добавить</v-btn>
                        </template>
                        <v-card>
                          <v-card-title>
                            <span class="headline">{{ cFormTitle }}</span>
                          </v-card-title>

                          <v-card-text>
                            <v-container grid-list-md>
                              <v-layout wrap>
                                <v-flex xs12 sm6 md4>
                                  <v-select :items="cSelect" label="Выберите тип" v-model="cEditedItem.iType"></v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                  <v-text-field v-model="cEditedItem.semester" label="Семестр"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                  <v-text-field v-model="cEditedItem.count" label="Количество"></v-text-field>
                                </v-flex>
                              </v-layout>
                            </v-container>
                          </v-card-text>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="cClose">Отменить</v-btn>
                            <v-btn color="blue darken-1" flat @click="cSave">Сохранить</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-toolbar>
                    <v-data-table
                      :headers="cHeaders"
                      :items="cWorks"
                      class="elevation-1 my-border-top"
                      hide-actions
                      :pagination.sync="cPagination"
                    >
                      <template v-slot:headers="props">
                        <th
                          v-for="cHeader in props.headers"
                          :key="cHeader.text"
                          :class="['column sortable', cPagination.descending ? 'desc' : 'asc', cHeader.value === cPagination.sortBy ? 'active' : '']"
                          @click="changeSort(cHeader.value)"
                          :width="cHeader.width"
                          :align="cHeader.align"
                        >
                          {{ cHeader.text }}
                          <v-icon small>arrow_upward</v-icon>
                        </th>
                      </template>
                      <template v-slot:items="props">
                        <td class="text-xs-left">{{ props.item.iType }}</td>
                        <td class="text-xs-left">{{ props.item.semester }}</td>
                        <td class="text-xs-left">{{ props.item.count }}</td>
                        <td class="justify-center layout px-0">
                          <v-icon
                            small
                            class="mr-2"
                            @click="cEditItem(props.item)"
                          >
                            edit
                          </v-icon>
                          <v-icon
                            small
                            @click="cDeleteItem(props.item)"
                          >
                            delete
                          </v-icon>
                        </td>
                      </template>
                      <template v-slot:no-data>
                        <td class="text-xs-center" colspan="3">Вы не руководите работами в этом году</td>
                      </template>
                    </v-data-table>
                  </div>
                </template>
              </v-flex>
              <v-flex md2></v-flex>
              <v-btn large
                     md6
                     color="primary mb-3 mt-3"
                     @click="createPlan"
                >
                  Создать план
                </v-btn>
            </v-layout>
            <v-layout row v-else>
              <v-flex xs12 class="text-xs-center pt-5">
                <v-progress-circular
                  :size="100"
                  :width="4"
                  color="secondary"
                  indeterminate
                ></v-progress-circular>
              </v-flex>
            </v-layout>
          </v-tab-item>
          <v-tab-item
            :key="items[3]"
            class="pt-4"
          >
            <v-layout v-if="!loading" justify-center align-space-around row wrap>
              <v-flex sm12 md12 xs12>
                <div class="text-xs-center headline text--primary">Ваш план готов. Если загрузка не началась автоматически, воспользуйтесь кнопкой ниже</div>
              </v-flex>
                <v-btn fab dark large color="primary mt-4 mb-4" @click="forceDownload">
                  <v-icon dark>get_app</v-icon>
                </v-btn>
              <v-flex sm12 md12 xs12>
                <div class="text-xs-center headline text--primary">Если хотите создать ещё один план, можете воспользоваться кнопкой ниже</div>
              </v-flex>
              <v-btn fab dark large color="primary mt-4 mb-4" @click="newPlan">
                <v-icon dark>autorenew</v-icon>
              </v-btn>
            </v-layout>
            <v-layout row v-else>
              <v-flex xs12 class="text-xs-center pt-5">
                <v-progress-circular
                  :size="100"
                  :width="4"
                  color="secondary"
                  indeterminate
                ></v-progress-circular>
              </v-flex>
            </v-layout>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </template>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  components: {
    vueDropzone: vue2Dropzone
  },
  data () {
    return {
      activeTab: null,
      items: [
        'Загрузка файла', 'Выбор предметов', 'Ввод работ', 'Результат'
      ],
      payloadFile: null,

      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      stExpand: false,
      dropzoneOptions: {
        url: 'http://127.0.0.1:8000/api/main/upload',
        method: 'put',
        success: (file, response) => {
          this.$store.commit('setLoadFilename', response.filename)
        },
        addRemoveLinks: true,
        maxFiles: 1,
        createImageThumbnails: false,
        acceptedFiles: '.xlsx,.xls',
        dictDefaultMessage: 'Нажмите чтобы выбрать файл или перетащите его сюда',
        dictFallbackMessage: 'Ваш браузер не поддерживает drag\'n\'drop загрузку.',
        dictFallbackText: 'Пожалуйста, используйте форму ниже для отправки вашего файла как в старые-добрые.',
        dictFileTooBig: 'Файл слишком большой ({{filesize}}МБ). Максимальный размер файла: {{maxFilesize}}МБ.',
        dictInvalidFileType: 'Вы не можете загружать файлы этого типа.',
        dictResponseError: 'Сервер ответил с кодом {{statusCode}}.',
        dictCancelUpload: 'Отменить загрузку',
        dictUploadCanceled: 'Загрузка отменена.',
        dictCancelUploadConfirmation: 'Вы действительно хотите отменить загрузку?',
        dictRemoveFile: 'Удалить файл',
        dictRemoveFileConfirmation: null,
        dictMaxFilesExceeded: 'Вы не можете загрузить больше одного файла.',
        dictFileSizeUnits: {
          tb: 'ТБ', gb: 'ГБ', mb: 'МБ', kb: 'КБ', b: 'байт'
        }
      },

      stPagination: {
        sortBy: 'number',
        rowsPerPage: -1
      },
      stHeaders: [
        { text: 'Номер', value: 'number', width: '1%', align: 'left' },
        { text: 'Предмет', value: 'subject', width: '50%', align: 'left' },
        { text: 'Семестр', value: 'semester', width: '1%', align: 'left' },
        { text: 'Курс', value: 'course', width: '1%', align: 'left' }
      ],

      cHeaders: [
        {
          text: 'Тип работы',
          align: 'left',
          sortable: false,
          value: 'iType',
          width: '50%'
        },
        { text: 'Семестр', value: 'semester', align: 'left', width: '25%' },
        { text: 'Количество студентов', value: 'count', align: 'left', width: '25%' }
      ],
      cEditedIndex: -1,
      cEditedItem: {
        iType: 'Курсовая',
        semester: 0,
        count: 0
      },
      cSelect: [
        'Курсовая',
        'Дипломная'
      ],
      cDefaultItem: {
        iType: 'Курсовая',
        semester: 0,
        count: 0
      },
      cDialog: false,
      cPagination: {
        sortBy: 'name',
        rowsPerPage: -1
      }
    }
  },
  methods: {
    checkFile () {
      const files = this.$refs.dropzone.getAcceptedFiles()
      if (files.length === 1) {
        this.$store.dispatch('setPayloadFile', files[0])
      }
    },
    removeFile () {
      this.$store.dispatch('setPayloadFile', null)
    },

    toggleAll () {
      if (this.stSelected.length) {
        this.stSelected = []
      } else {
        this.stSelected = this.stSubjects.slice()
      }
    },
    changeSort (column) {
      if (this.stPagination.sortBy === column) {
        this.stPagination.descending = !this.stPagination.descending
      } else {
        this.stPagination.sortBy = column
        this.stPagination.descending = false
      }
    },

    cEditItem (item) {
      this.cEditedIndex = this.cWorks.indexOf(item)
      this.cEditedItem = Object.assign({}, item)
      this.cDialog = true
    },
    cDeleteItem (item) {
      const index = this.cWorks.indexOf(item)
      confirm('Вы действительно хотите удалить эту запись?') && this.cWorks.splice(index, 1)
    },
    cClose () {
      this.cDialog = false
      setTimeout(() => {
        this.cEditedItem = Object.assign({}, this.cDefaultItem)
        this.cEditedIndex = -1
      }, 300)
    },
    cSave () {
      if (isNaN(this.cEditedItem.semester) || isNaN(this.cEditedItem.count)) {
        this.$store.dispatch('setError', 'Семестр и количество студентов должны быть числовыми значениями.')
        return
      }
      if (this.cEditedIndex > -1) {
        Object.assign(this.cWorks[this.cEditedIndex], this.cEditedItem)
      } else {
        this.cWorks.push(this.cEditedItem)
      }
      this.cClose()
    },

    loadSubjects () {
      this.$store.dispatch('loadSubjects')
        .then(() => {
          this.activeTab = 1
        })
        .catch(() => {})
    },
    nextTab () {
      this.activeTab = 2
    },
    createPlan () {
      this.$store.dispatch('createPlan')
        .then(() => {
          this.activeTab = 3
        })
        .catch(() => {})
    },
    newPlan () {
      this.$store.dispatch('setStSelected', [])
      this.$store.dispatch('setStSubjects', [])
      this.$store.dispatch('setCWorks', [])
      this.$store.dispatch('setLoadFilename', '')
      this.activeTab = 0
    },
    forceDownload () {
      this.$store.dispatch('forceDownload')
    }
  },
  computed: {
    cFormTitle () {
      return this.cEditedIndex === -1 ? 'Добавить' : 'Редактировать'
    },
    loading () {
      return this.$store.getters.loading
    },
    cWorks: {
      get () {
        return this.$store.getters.cWorks
      },
      set (value) {
        this.$store.commit('setCWorks', value)
      }
    },
    stSelected: {
      get () {
        return this.$store.getters.stSelected
      },
      set (value) {
        this.$store.commit('setStSelected', value)
      }
    },
    stSubjects: {
      get () {
        return this.$store.getters.stSubjects
      },
      set (value) {
        this.$store.commit('setStSubjects', value)
      }
    }
  },
  watch: {
    cDialog (val) {
      val || this.cClose()
    }
  },
  created () {
    // this.$store.dispatch('setLoading', true)
  },
  beforeDestroy () {
    this.newPlan()
  }
}

</script>

<style>
  .vue-dropzone .dz-preview .dz-details {
    background-color: rgba(33, 115, 70, 1) !important;
  }

  table.v-table thead tr th {
    font-size: 14px;
  }

  table.v-table tbody tr td {
    font-size: 14px;
  }
</style>

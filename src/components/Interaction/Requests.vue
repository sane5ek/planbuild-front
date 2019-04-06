<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid>
    <v-layout v-if="!loading" row justify-center align-start wrap>
      <v-flex sm12 md10 mb-3 class="my-border">
      <template>
        <div>
          <v-toolbar flat color="white">
            <v-toolbar-title>Входящие запросы</v-toolbar-title>
            <v-divider
              class="mx-2"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-data-table
            :headers="inHeaders"
            :items="inRequests"
            class="elevation-1 my-border-top"
            :pagination.sync="inPagination"
            sortable
          >
            <template v-slot:headers="props">
              <th
                v-for="inHeader in props.headers"
                :key="inHeader.id"
                :class="['column sortable', inPagination.descending ? 'desc' : 'asc', inHeader.value === inPagination.sortBy ? 'active' : '']"
                @click="inChangeSort(inHeader.value)"
                :width="inHeader.width"
                :align="inHeader.align"
                :sortable="inHeader.sortable"
              >
                {{ inHeader.text }}
                <v-icon small>arrow_upward</v-icon>
              </th>
            </template>
            <template v-slot:items="props" >
              <td class="text-xs-left">{{ props.item.id }}</td>
              <td class="text-xs-left">{{ props.item.user }}</td>
              <td class="text-xs-left">{{ props.item.date }}</td>
              <td class="text-xs-left">{{ getStatus(props.item.status) }}</td>
              <td class="text-xs-left justify-center layout px-0">
                <v-icon
                  small
                  class="mr-2"
                  @click="acceptRequest(props.item.id)"
                  v-if="props.item.status === null"
                >
                  done
                </v-icon>
                <v-icon
                  small
                  @click="declineRequest(props.item.id)"
                  v-if="props.item.status === null"
                >
                  delete
                </v-icon>
              </td>
            </template>
            <template v-slot:no-data>
              <td  class="text-xs-center" colspan="5">У вас нет входящих запросов</td>
            </template>
          </v-data-table>
        </div>
      </template>
      </v-flex>
      <v-flex sm12 md10 class="my-border">
        <template>
          <div>
            <v-toolbar flat color="white">
              <v-toolbar-title>Исходящие запросы</v-toolbar-title>
              <v-divider
                class="mx-2"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-data-table
              :headers="outHeaders"
              :items="outRequests"
              class="elevation-1 my-border-top"
              :pagination.sync="outPagination"
              sortable
            >
              <template v-slot:headers="props">
                <th
                  v-for="outHeader in props.headers"
                  :key="outHeader.id"
                  :class="['column sortable', outPagination.descending ? 'desc' : 'asc', outHeader.value === outPagination.sortBy ? 'active' : '']"
                  @click="outChangeSort(outHeader.value)"
                  :width="outHeader.width"
                  :align="outHeader.align"
                  :sortable="outHeader.sortable"
                >
                  {{ outHeader.text }}
                  <v-icon small>arrow_upward</v-icon>
                </th>
              </template>
              <template v-slot:items="props" >
                <td class="text-xs-left">{{ props.item.id }}</td>
                <td class="text-xs-left">{{ props.item.user }}</td>
                <td class="text-xs-left">{{ props.item.date }}</td>
                <td class="text-xs-left">{{ getStatus(props.item.status) }}</td>
                <td class="text-xs-left justify-center layout px-0">
                  <v-icon
                    small
                    @click="cancelRequest(props.item.id)"
                    v-if="props.item.status === null"
                  >
                    delete
                  </v-icon>
                </td>
              </template>
              <template v-slot:no-data>
                <td  class="text-xs-center" colspan="5">У вас нет исходящих запросов</td>
              </template>
            </v-data-table>
          </div>
        </template>
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
  data () {
    return {
      inHeaders: [
        { text: 'ID', value: 'id', align: 'left', width: '1%', sortable: true },
        { text: 'Отправитель', value: 'user', align: 'left', width: '50%', sortable: true },
        { text: 'Дата отправки', value: 'date', align: 'left', width: '35%', sortable: true },
        { text: 'Состояние', value: 'status', align: 'left', width: '5%', sortable: true },
        { text: '', value: '', align: 'left', width: '25%', sortable: false }
      ],
      inPagination: {
        sortBy: 'id',
        descending: 'desc',
        rowsPerPage: 5
      },
      outHeaders: [
        { text: 'ID', value: 'id', align: 'left', width: '1%', sortable: true },
        { text: 'Получатель', value: 'user', align: 'left', width: '50%', sortable: true },
        { text: 'Дата отправки', value: 'date', align: 'left', width: '35%', sortable: true },
        { text: 'Состояние', value: 'status', align: 'left', width: '5%', sortable: true },
        { text: '', value: '', align: 'left', width: '25%', sortable: false }
      ],
      outPagination: {
        sortBy: 'id',
        descending: 'desc',
        rowsPerPage: 5
      }
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    inRequests () {
      return this.$store.getters.inRequests
    },
    outRequests () {
      return this.$store.getters.outRequests
    }
  },
  methods: {
    acceptRequest (id) {
      this.$store.dispatch('acceptRequest', id)
    },
    declineRequest (id) {
      this.$store.dispatch('declineRequest', id)
    },
    cancelRequest (id) {
      this.$store.dispatch('cancelRequest', id)
    },
    getStatus (status) {
      switch (status) {
        case true:
          return 'Подтвержден'
        case false:
          return 'Отклонен'
        default:
          return 'Обрабатывается'
      }
    },
    inChangeSort (column) {
      if (this.inPagination.sortBy === column) {
        this.inPagination.descending = !this.inPagination.descending
      } else {
        this.inPagination.sortBy = column
        this.inPagination.descending = false
      }
    },
    outChangeSort (column) {
      if (this.outPagination.sortBy === column) {
        this.outPagination.descending = !this.outPagination.descending
      } else {
        this.outPagination.sortBy = column
        this.outPagination.descending = false
      }
    }
  },
  beforeCreate () {
    this.$store.dispatch('loadRequests')
  }
}
</script>

<style>
  .my-border {
    border: 1px solid gray;
  }
  .my-border-top {
    border-top: 1px solid gray;
  }
</style>

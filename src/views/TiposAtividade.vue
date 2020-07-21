<template>
  <v-data-table :headers="headers" :items="tipos" sort-by="calories" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Tipos de Atividade</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Novo</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.descricao" label="Descrição"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchRecords">Recarregar</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import TiposAtividadeService from "../service/domain/TipoAtividadeService";
const service = TiposAtividadeService.build();

const textos = {
  novo: "Novo Tipo",
  edicao: "Edição de Tipo",
  exclusao: "Deseja mesmo remover este Tipo?"
};

export default {
  name: "TiposAtividade",
  components: {},

  data: () => ({
    dialog: false,
    headers: [
      { text: "ID", value: "id" },
      { text: "Descrição", value: "descricao" },
      { text: "Ações", align: "end", value: "actions", sortable: false }
    ],
    tipos: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {}
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? textos.novo : textos.edicao;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.fetchRecords();
  },

  methods: {
    fetchRecords() {
      service.search({}).then(this.fetchRecodsSuccess);
    },

    fetchRecodsSuccess(response) {
      if (Array.isArray(response.rows)) {
        this.tipos = response.rows;
        return;
      }
      this.tipos = [];
    },

    editItem(item) {
      this.editedIndex = this.tipos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.tipos.indexOf(item);
      if (confirm(textos.exclusao)) {
        service.destroy(item).then(this.tipos.splice(index, 1));
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        
        service
          .update(this.editedItem)
          .then(Object.assign(this.tipos[this.editedIndex], this.editedItem));
      } else {
        service
          .create(this.editedItem)
          .then(response => this.tipos.push(response));
      }
      this.close();
    }
  }
};
</script>

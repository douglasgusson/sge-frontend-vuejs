<template>
  <v-data-table :headers="headers" :items="palestrantes" sort-by="calories" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Palestrantes</v-toolbar-title>
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
                    <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.cpf" label="CPF"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.instituicao" label="Instituição"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea label="Minicurrículo" auto-grow v-model="editedItem.minicurriculo"></v-textarea>
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
        <v-dialog v-model="dialogExcluir" max-width="430px">
          <v-card>
            <v-card-title class="headline">Deseja mesmo remover este Item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeExcluir">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemComfirm">Sim</v-btn>
              <v-spacer></v-spacer>
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
      <v-btn color="primary" @click="initialize">Recarregar</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import PalestranteService from "../service/domain/PalestranteService";
const service = PalestranteService.build();

const textos = {
  novo: "Novo Palestrante",
  edicao: "Edição de Palestrante",
  exclusao: "Deseja mesmo remover este Palestrante?",
};

export default {
  name: "Palestrantes",
  components: {},

  data: () => ({
    dialog: false,
    dialogExcluir: false,
    headers: [
      { text: "ID", value: "id" },
      { text: "Nome", align: "start", value: "nome" },
      { text: "CPF", align: "center", value: "cpf" },
      { text: "Instituição", align: "center", value: "instituicao" },
      { text: "Minicurrículo", align: "center", value: "minicurriculo" },
      { text: "Ações", align: "end", value: "actions", sortable: false },
    ],
    palestrantes: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? textos.novo : textos.edicao;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogExcluir(val) {
      val || this.closeExcluir();
    },
  },

  created() {
    this.fetchRecords();
  },

  methods: {
    initialize() {
      this.fetchRecords();
    },

    fetchRecords() {
      service.search({}).then(this.fetchRecodsSuccess);
    },

    fetchRecodsSuccess(response) {
      if (Array.isArray(response.rows)) {
        this.palestrantes = response.rows;
        return;
      }
      this.palestrantes = [];
    },

    editItem(item) {
      this.editedIndex = this.palestrantes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.palestrantes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogExcluir = true;
    },

    deleteItemComfirm() {
      service
        .destroy(this.editedItem)
        .then(this.palestrantes.splice(this.editedIndex, 1));
      this.closeExcluir();
    },

    closeExcluir() {
      this.dialogExcluir = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
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
          .then(
            Object.assign(this.palestrantes[this.editedIndex], this.editedItem)
          );
      } else {
        service
          .create(this.editedItem)
          .then((response) => this.palestrantes.push(response));
      }
      this.close();
    },
  },
};
</script>

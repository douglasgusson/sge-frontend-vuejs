<template>
  <v-data-table :headers="headers" :items="participantes" sort-by="calories" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Participantes</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="800px">
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
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="editedItem.login" label="Login"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.senha"
                      :append-icon="mostraSenha ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="mostraSenha ? 'text' : 'password'"
                      name="input-10-1"
                      label="Senha"
                      counter
                      @click:append="mostraSenha = !mostraSenha"
                    ></v-text-field>
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
      <v-btn color="primary" @click="initialize">Recarregar</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import ParticipanteService from "../service/domain/ParticipanteService";
const service = ParticipanteService.build();

const textos = {
  novo: "Novo Participante",
  edicao: "Edição de Participante",
  exclusao: "Deseja mesmo remover este Participante?"
};

export default {
  name: "Participantes",
  components: {},

  data: () => ({
    dialog: false,
    headers: [
      { text: "ID", value: "id" },
      { text: "Nome", align: "start", value: "nome" },
      { text: "CPF", align: "center", value: "cpf" },
      { text: "Instituição", align: "center", value: "instituicao" },
      { text: "Ações", align: "end", value: "actions", sortable: false }
    ],
    mostraSenha: false,
    participantes: [],
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
    this.initialize();
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
        this.participantes = response.rows;
        return;
      }
      this.participantes = [];
    },

    editItem(item) {
      this.editedIndex = this.participantes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.participantes.indexOf(item);
      if (confirm(textos.exclusao)) {
        service.destroy(item).then(this.participantes.splice(index, 1));
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
          .then(
            Object.assign(this.participantes[this.editedIndex], this.editedItem)
          );
      } else {
        service
          .create(this.editedItem)
          .then(response => this.participantes.push(response));
      }
      this.close();
    }
  }
};
</script>

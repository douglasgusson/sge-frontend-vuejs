<template>
  <v-data-table :headers="headers" :items="atividades" sort-by="calories" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Atividades</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">Novo</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-combobox
                      v-model="editedItem.evento"
                      item-text="titulo"
                      :items="eventos"
                      label="Evento"
                      clearable
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12" sm="8">
                    <v-text-field v-model="editedItem.titulo" label="Título"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-menu
                      ref="menuDataInicial"
                      v-model="menuDataInicial"
                      :close-on-content-click="false"
                      :return-value.sync="dataInicial"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dataInicial"
                          label="Data inicial"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="dataInicial" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menuDataInicial = false">Cancel</v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menuDataInicial.save(dataInicial)"
                        >OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-menu
                      ref="menuDataFinal"
                      v-model="menuDataFinal"
                      :close-on-content-click="false"
                      :return-value.sync="dataFinal"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dataFinal"
                          label="Data final"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="dataFinal" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menuDataFinal = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.menuDataFinal.save(dataFinal)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12">
                    <v-combobox
                      v-model="editedItem.palestrantes"
                      item-text="nome"
                      :items="palestrantes"
                      label="Palestrantes"
                      multiple
                      clearable
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-combobox
                      v-model="editedItem.tipoAtividade"
                      item-text="descricao"
                      :items="tipos"
                      label="Tipo"
                      clearable
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-combobox
                      v-model="editedItem.local"
                      item-text="nome"
                      :items="locais"
                      label="Local"
                      clearable
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="editedItem.descricao" auto-grow label="Descrição"></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="close">Cancelar</v-btn>
              <v-btn color="success" text @click="save">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon color="blue" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon color="red" small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Recarregar</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import EventoService from "../service/domain/EventoService";
import TipoAtividadeService from "../service/domain/TipoAtividadeService";
import LocalService from "../service/domain/LocalService";
import PalestranteService from "../service/domain/PalestranteService";
import AtividadeService from "../service/domain/AtividadeService";

const eventoService = EventoService.build();
const tipoAtividadeService = TipoAtividadeService.build();
const localService = LocalService.build();
const palestranteService = PalestranteService.build();
const atividadeService = AtividadeService.build();

const textos = {
  novo: "Nova Atividade",
  edicao: "Edição de Atividade",
  exclusao: "Deseja mesmo remover esta Atividade?"
};

export default {
  name: "Atividades",
  components: {},

  data: vm => ({
    dialog: false,
    headers: [
      { text: "ID", value: "id" },
      { text: "Título", align: "start", value: "titulo" },
      { text: "Tipo", align: "center", value: "tipoAtividade.descricao" },
      { text: "Descrição", align: "center", value: "descricao" },
      { text: "Data/Hora de início", align: "center", value: "inicio" },
      { text: "Data/Hora de término", align: "center", value: "fim" },
      { text: "Ações", align: "end", value: "actions", sortable: false }
    ],

    dataInicial: new Date().toISOString().substr(0, 10),
    dataFinal: new Date().toISOString().substr(0, 10),

    dataInicialFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dataFinalFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),

    menuDataInicial: false,
    menuDataFinal: false,

    atividades: [],
    locais: [],
    tipos: [],
    palestrantes: [],
    eventos: [],

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
    },

    horarioInicial() {
      this.editedItem.horarioInicial = this.horarioInicial;
    },

    dataInicial() {
      // this.dataInicialFormatted = this.formatDate(this.dataInicial);
      this.editedItem.inicio = this.dataInicial;
    },

    dataFinal() {
      // this.dataFinalFormatted = this.formatDate(this.dataFinal);
      this.editedItem.fim = this.dataFinal;
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.fetchRecordsEventos();
      this.fetchRecordsTipos();
      this.fetchRecordsLocais();
      this.fetchRecordsPalestrantes();
      this.fetchRecordsAtividades();
    },

    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },

    parseDate(date) {
      console.log(date);
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    fetchRecordsAtividades() {
      atividadeService.search({}).then(this.fetchRecodsAtividadesSuccess);
    },

    fetchRecordsEventos() {
      eventoService.search({}).then(this.fetchRecodsEventosSuccess);
    },

    fetchRecordsPalestrantes() {
      palestranteService.search({}).then(this.fetchRecodsPalestrantesSuccess);
    },

    fetchRecordsTipos() {
      tipoAtividadeService.search({}).then(this.fetchRecodsTiposSuccess);
    },

    fetchRecordsLocais() {
      localService.search({}).then(this.fetchRecodsLocalSuccess);
    },

    fetchRecodsAtividadesSuccess(response) {
      if (Array.isArray(response.rows)) {
        this.atividades = response.rows;
        return;
      }
      this.atividades = [];
    },

    fetchRecodsEventosSuccess(response) {
      if (Array.isArray(response.rows)) {
        this.eventos = response.rows;
        return;
      }
      this.eventos = [];
    },

    fetchRecodsPalestrantesSuccess(response) {
      if (Array.isArray(response.rows)) {
        this.palestrantes = response.rows;
        return;
      }
      this.palestrantes = [];
    },

    fetchRecodsTiposSuccess(response) {
      if (Array.isArray(response.rows)) {
        this.tipos = response.rows;
        return;
      }
      this.tipos = [];
    },

    fetchRecodsLocalSuccess(response) {
      if (Array.isArray(response.rows)) {
        this.locais = response.rows;
        return;
      }
      this.locais = [];
    },

    editItem(item) {
      this.editedIndex = this.atividades.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.atividades.indexOf(item);
      if (confirm(textos.exclusao)) {
        atividadeService.destroy(item).then(this.atividades.splice(index, 1));
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
        atividadeService
          .update(this.editedItem)
          .then(
            Object.assign(this.atividades[this.editedIndex], this.editedItem)
          );
      } else {
        atividadeService
          .create(this.editedItem)
          .then(response => this.atividades.push(response));
      }
      this.close();
    }
  }
};
</script>

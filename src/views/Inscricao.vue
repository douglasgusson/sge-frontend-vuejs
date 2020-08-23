<template>
  <v-data-table :headers="headers" :items="inscricoes" sort-by="calories" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ viewTitle }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="720px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nova</v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-combobox
                      v-model="editedItem.participante"
                      item-text="nome"
                      :items="participantes"
                      label="Participante"
                      clearable
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                      v-model="evento"
                      @change="filtrarAtividades"
                      item-text="titulo"
                      :items="eventos"
                      label="Evento"
                      clearable
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                      v-model="editedItem.atividade"
                      item-text="titulo"
                      :items="atividadesFiltradas"
                      label="Atividades"
                      clearable
                    ></v-combobox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      v-model="alert.show"
                      dismissible
                      elevation="2"
                      type="error"
                    >{{ alert.message }}</v-alert>
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

    <template v-slot:body.append>
      <tr>
        <td></td>
        <td>
          <v-combobox
            v-model="filtroEvento"
            item-text="titulo"
            @change="filtrarAtividades"
            :items="eventos"
            label="Evento"
            clearable
          ></v-combobox>
        </td>
        <td>
          <v-combobox
            v-model="filtroAtividade"
            item-text="titulo"
            :items="atividadesFiltradas"
            label="Atividade"
            clearable
          ></v-combobox>
        </td>
        <td></td>
      </tr>
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Recarregar</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import InscricaoService from "../service/domain/InscricaoService";
import ParticipanteService from "../service/domain/ParticipanteService";
import EventoService from "../service/domain/EventoService";
import AtividadeService from "../service/domain/AtividadeService";

const inscricaoService = InscricaoService.build();
const participanteService = ParticipanteService.build();
const eventoService = EventoService.build();
const atividadeService = AtividadeService.build();

const textos = {
  titulo: "Inscrições",
  novo: "Nova inscrição",
  edicao: "Edição de inscrição",
  exclusao: "Deseja mesmo remover este Evento?",
};

export default {
  name: "Inscricoes",
  components: {},

  data() {
    return {
      dialog: false,
      inscricoes: [],
      atividades: [],
      atividadesFiltradas: [],
      eventos: [],
      participantes: [],
      evento: null,

      alert: {
        show: false,
        message: "",
      },

      filtroEvento: null,
      filtroAtividade: null,

      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? textos.novo : textos.edicao;
    },

    viewTitle() {
      return textos.titulo;
    },

    headers() {
      return [
        { text: "Participante", align: "start", value: "participante.nome" },
        {
          text: "Evento",
          align: "center",
          value: "atividade.evento.titulo",
          filter: (value) => {
            if (!this.filtroEvento) return true;
            return value == this.filtroEvento.titulo;
          },
        },
        {
          text: "Atividade",
          align: "center",
          value: "atividade.titulo",
          filter: (value) => {
            if (!this.filtroAtividade) return true;
            return value == this.filtroAtividade.titulo;
          },
        },
        { text: "Ações", align: "end", value: "actions", sortable: false },
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.fetchRecordsInscricoes();
      this.fetchRecordsParticipantes();
      this.fetchRecordsEventos();
      this.fetchRecordsAtividades();
    },

    fetchRecordsEventos() {
      eventoService.search({}).then(this.fetchRecodsSuccessEventos);
    },

    fetchRecodsSuccessEventos(response) {
      if (Array.isArray(response.rows)) {
        this.eventos = response.rows;
        return;
      }
      this.eventos = [];
    },

    fetchRecordsParticipantes() {
      participanteService.search({}).then(this.fetchRecodsSuccessParticipantes);
    },

    fetchRecodsSuccessParticipantes(response) {
      if (Array.isArray(response.rows)) {
        this.participantes = response.rows;
        return;
      }
      this.participantes = [];
    },

    fetchRecordsAtividades() {
      atividadeService.search({}).then(this.fetchRecodsSuccessAtividades);
    },

    fetchRecodsSuccessAtividades(response) {
      if (Array.isArray(response.rows)) {
        this.atividades = response.rows;
        return;
      }
      this.atividades = [];
    },

    filtrarAtividades(evento) {
      const filtro = (atividade) =>
        evento ? atividade.evento.id == evento.id : false;
      this.atividadesFiltradas = this.atividades.filter(filtro);
      this.editedItem.atividade = null;
    },

    fetchRecordsInscricoes() {
      inscricaoService.search({}).then(this.fetchRecodsSuccessInscricoes);
    },

    fetchRecodsSuccessInscricoes(response) {
      if (Array.isArray(response.rows)) {
        this.inscricoes = response.rows;
        return;
      }
      this.inscricoes = [];
    },

    editItem(item) {
      this.limparFiltros();
      this.editedIndex = this.eventos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    limparFiltros() {
      this.filtroEvento = null;
      this.filtroAtividade = null;
      this.evento = null;
      this.atividadesFiltradas = [];
    },

    deleteItem(item) {
      const index = this.inscricoes.indexOf(item);
      if (confirm(textos.exclusao)) {
        inscricaoService.destroy(item).then(this.inscricoes.splice(index, 1));
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.alert = {
          show: false,
          message: "",
        };
      });
    },

    save() {
      if (this.editedIndex > -1) {
        inscricaoService
          .update(this.editedItem)
          .then((response) => {
            Object.assign(this.inscricoes[this.editedIndex], response);
            this.close();
          })
          .catch((error) => {
            const erro = JSON.parse(error.response.data);
            this.alert.show = true;
            this.alert.message = erro.message;
          });
      } else {
        inscricaoService
          .create(this.editedItem)
          .then((response) => {
            this.inscricoes.push(response);
            this.close();
            this.fetchRecordsInscricoes();
          })
          .catch((error) => {
            const erro = JSON.parse(error.response.data);
            this.alert.show = true;
            this.alert.message = erro.message;
          });
      }
    },
  },
};
</script>


<template>
  <v-container fluid>
    <v-data-table :headers="headers" :items="inscricoes" sort-by="calories" class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-icon
          v-if="!item.presencaConfirmada"
          color="green"
          small
          title="Confirmar presença"
          class="mr-2"
          @click="save(item)"
        >mdi-check</v-icon>
        <v-icon
          v-else
          color="red"
          small
          title="Remover presença"
          class="mr-2"
          @click="save(item)"
        >mdi-close-circle</v-icon>
        <v-icon
          color="yellow"
          small
          title="Gerar certificado"
          @click="gerarCertificado(item)"
        >mdi-star</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Recarregar</v-btn>
      </template>
    </v-data-table>
    <v-row>
      <v-col cols="12">
        <v-alert v-model="alert.show" dismissible elevation="2" type="error">{{ alert.message }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import InscricaoService from "../service/domain/InscricaoService";

const inscricaoService = InscricaoService.build();

export default {
  name: "Participacoes",
  components: {},

  data: () => ({
    headers: [
      { text: "Participante", align: "start", value: "participante.nome" },
      { text: "Atividade", align: "center", value: "atividade.titulo" },
      { text: "Presença", align: "center", value: "presencaConfirmada" },
      { text: "Ações", align: "end", value: "actions", sortable: false },
    ],

    alert: {
      show: false,
      message: "",
    },

    inscricoes: [],
  }),

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.fetchRecordsInscricoes();
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

    gerarCertificado(item) {
      if (item.presencaConfirmada) {
        const id = item.id;
        this.$router.push({ name: "Certificado", params: { id } });
      } else {
        this.alert.message = `A presença do(a) ${item.participante.nome} na atividade ${item.atividade.titulo} não foi confirmada`;
        this.alert.show = true;
      }
    },

    save(inscricao) {
      inscricao.presencaConfirmada = !inscricao.presencaConfirmada;
      inscricaoService
        .update(inscricao)
        .then(() => {})
        .catch(() => {});
    },
  },
};
</script>

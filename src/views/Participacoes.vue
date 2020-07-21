<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="participacoes"
      item-key="name"
      show-select
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Participações</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mr-2">Registrar presença</v-btn>
          <v-btn color="success">Gerar certificado</v-btn>
        </v-toolbar>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "participacoes",
  components: {},

  data: () => ({
    selected: [],
    headers: [
      { text: "Participante", align: "start", value: "participante" },
      { text: "Atividade", align: "center", value: "atividade" },
      { text: "Presença", align: "center", value: "presenca" }
    ],

    participacoes: []
  }),

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.participacoes = [
        {
          participante: "Douglas Gusson",
          atividade: "Palestra: Internet das coisas",
          presenca: true
        }
      ];
    }
  }
};
</script>

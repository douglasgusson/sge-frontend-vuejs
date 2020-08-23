<template>
  <v-container>
    <h1>Home</h1>
    <v-row>
      <v-col cols="6">
        <v-card max-width="480" class="mx-auto" outlined>
          <v-card-title>Inscrições por atividade</v-card-title>
          <chart-horizontal-bar :chart-data="chartDataInscricoes" />
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card max-width="480" class="mx-auto" outlined>
          <v-card-title>Participações por atividade</v-card-title>
          <chart-horizontal-bar :chart-data="chartDataParticipacoes" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChartHorizontalBar from "@/components/ChartHorizontalBar.vue";
import AtividadeService from "../service/domain/AtividadeService";

const atividadeService = AtividadeService.build();

export default {
  name: "Home",
  components: {
    ChartHorizontalBar,
  },
  data() {
    return {
      chartDataParticipacoes: {
        labels: [],
        datasets: [
          {
            label: "",
            data: [],
          },
        ],
      },

      chartDataInscricoes: {
        labels: [],
        datasets: [
          {
            label: "",
            data: [],
          },
        ],
      },
    };
  },

  methods: {
    initialize: function () {
      atividadeService.findTotalInscricoesPorAtividade().then(
        ((response) => {
          if (response) {
            this.chartDataInscricoes.datasets[0].label = "Quantidade";
            response.forEach((el) => {
              this.chartDataInscricoes.labels.push(el[1]);
              this.chartDataInscricoes.datasets[0].data.push(el[2]);
            });
          }
        }).bind(this)
      );

      atividadeService.findTotalParticipacoesPorAtividade().then(
        ((response) => {
          if (response) {
            this.chartDataParticipacoes.datasets[0].label = "Quantidade";
            response.forEach((el) => {
              this.chartDataParticipacoes.labels.push(el[1]);
              this.chartDataParticipacoes.datasets[0].data.push(el[2]);
            });
          }
        }).bind(this)
      );
    },
  },

  created() {
    this.initialize();
  },
};
</script>

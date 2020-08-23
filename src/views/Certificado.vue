<template>
  <div>
    <h1 class="text-center">Certificado</h1>
    <hr />
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>

    <div>
      <p class="subtitle-2 text-center">
        Certificamos que {{ inscricao.participante.nome }}, portador do CPF {{ inscricao.participante.cpf }}
        participou da atividade {{ inscricao.atividade.titulo }}, realizada no dia {{ inscricao.atividade.dataInicio }}
        durante o evento {{ inscricao.atividade.evento.titulo }}.
      </p>
      <p class="text-center">Organização</p>
    </div>

    <div class="text-center d-print-none">
      <v-btn @click="imprimirCertificado" class="ma-2" outlined color="indigo">Imprimir</v-btn>
    </div>
  </div>
</template>


<script>
import InscricaoService from "../service/domain/InscricaoService";

const inscricaoService = InscricaoService.build();

export default {
  name: "Certificado",

  data() {
    return {
      inscricao: {},
    };
  },

  methods: {
    initialize() {
      this.fetchRecordInscricao();
    },

    fetchRecordInscricao() {
      inscricaoService
        .read({ id: this.$route.params.id })
        .then(this.fetchRecodSuccessInscricao);
    },

    fetchRecodSuccessInscricao(response) {
      this.inscricao = response;
    },

    imprimirCertificado() {
      window.print();
    },
  },

  created() {
    this.initialize();
  },
};
</script>
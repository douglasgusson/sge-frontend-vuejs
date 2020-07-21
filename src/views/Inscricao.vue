<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ formTitle }}</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-select
              :items="eventos"
              v-model="editedItem.evento"
              item-text="titulo"
              label="Evento"
            ></v-select>
          </v-col>
          <v-col cols="9">
            <v-select :items="atividades" item-text="titulo" label="Atividades"></v-select>
          </v-col>
          <v-col cols="3">
            <v-btn tile outlined color="primary">
              <v-icon left>mdi-plus</v-icon>Add
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th colspan="2">Atividades</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in atividades" :key="item.titulo">
                    <td>{{ item.titulo }}</td>
                    <td class="text-right">
                      <v-btn icon color="red">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
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
</template>

<script>
export default {
  name: "Atividades",
  components: {},

  data: () => ({

    atividades: [],

    eventos: [
      { titulo: "Jacitec", inicio: "25/06/2020", fim: "28/06/2020" },
      { titulo: "SINF", inicio: "14/09/2020", fim: "20/09/2020" },
      { titulo: "Contrata Ifes", inicio: "10/11/2020", fim: "16/11/2020" }
    ],

    editedIndex: -1,
    editedItem: {},
    defaultItem: {}
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nova" : "Edição";
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
      this.atividades = [
        {
          titulo: "Palestra sobre IoT",
          descricao: "Internet das coisas",
          inicio: "25/11/2020 14:30",
          fim: "25/11/2020 15:45",
          tipo: { descricao: "Palestra" }
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.atividades.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.atividades.indexOf(item);
      confirm("Deseja mesmo remover esta Atividade?") &&
        this.atividades.splice(index, 1);
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
        Object.assign(this.atividades[this.editedIndex], this.editedItem);
      } else {
        this.atividades.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>

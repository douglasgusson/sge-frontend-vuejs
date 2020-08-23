<script>
import { HorizontalBar } from "vue-chartjs";

export default {
  extends: HorizontalBar,
  name: "ChartHorizontalBar",
  props: ["chartData"],
  data() {
    return {
      options: {
        responsive: true,
        lineTension: 1,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                padding: 25,
              },
            },
          ],
        },
      },
    };
  },

  updated() {
    this.update();
  },

  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
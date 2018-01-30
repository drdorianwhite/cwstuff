<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'Coinchart',
  extends: Line,
  mounted () {
    this.renderChart({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Bitcoin Price',
        backgroundColor: '#000000',
        data: [1, 2, 3, 4, 3, 2, 2, 4, 5, 3, 2, 4, 6]
      }]
    })
  }
}
</script>
<style>
canvas {
    height: 100px !important;
    width: 40% !important;
}
</style>
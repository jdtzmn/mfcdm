import { promisify } from 'util'
import { writeFile } from 'fs'
import { CanvasRenderService } from 'chartjs-node-canvas'
const ChartDataLabels = require('chartjs-plugin-datalabels')
import { ChartConfiguration } from '..'

const writeFileAsync = promisify(writeFile)

// Define canvas dimensions
const width = 600
const height = 600

// Specify default configuration

const fontStyle = {
  fontColor: 'black',
  fontSize: 18
}

const defaultConfiguration = {
  options: {
    legend: {
      labels: fontStyle
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          ...fontStyle
        }
      }],
      xAxes: [{
        ticks: fontStyle
      }]
    },
    layout: {
      padding: 24
    }
  }
}

// Specify ChartJS options
const chartCallback = (ChartJS: any) => {
  ChartJS.defaults.global.responsive = true
  ChartJS.defaults.global.maintainAspectRatio = false
  ChartJS.plugins.register({
    beforeDraw: (chartInstance: any) => {
      const ctx = chartInstance.chart.ctx
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height)
    }
  })
  ChartJS.plugins.register(ChartDataLabels)
}

// Create canvas render service
const canvasRenderService = new CanvasRenderService(width, height, chartCallback)

// Export the canvas
const exportGraph = async (config: ChartConfiguration, path: string) => {
  const image = await canvasRenderService.renderToBuffer({
    ...defaultConfiguration,
    ...config
  })
  return writeFileAsync(path, image)
}

export default exportGraph

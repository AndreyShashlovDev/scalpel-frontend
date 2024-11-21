import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AnalyticsChartUiModel } from '../model/AnalyticsChartUiModel.ts'

export interface SwapPriceChartProps {
  model: AnalyticsChartUiModel
}

export const SwapPriceChartView = ({model}: SwapPriceChartProps) => {

  return (
    <ResponsiveContainer width='95%' height='30%'>
        <LineChart
          data={model.data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            name='Token price'
            type='monotone'
            dataKey='currencyBPrice'
            connectNulls={true}
            stroke='#8884d8'
            label={'heee'}
            activeDot={{r: 8}}
          />
          <Line name='USDT swap' type='monotone' dataKey='currencyASwapPrice' stroke='#82ca9d' connectNulls={true} />
          <Line name='Token swap' type='monotone' dataKey='currencyBSwapPrice' stroke='red' connectNulls={true} />
        </LineChart>
      </ResponsiveContainer>
  )
}

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styled from 'styled-components'
import { AnalyticsChartUiModel } from '../model/AnalyticsChartUiModel.ts'

const ResponsiveContainerWrapper = styled(ResponsiveContainer)`
  width: 100%;
  height: 100%;
`

export interface SwapPriceChartProps {
  model: AnalyticsChartUiModel
}

export const SwapPriceChartView = ({model}: SwapPriceChartProps) => {

  return (
    <ResponsiveContainerWrapper>
        <LineChart data={model.data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis
            allowDecimals={true}
            scale={'log'}
            domain={['auto', 'auto']}
          />
          <Tooltip />
          <Legend />
          <Line
            dot={false}
            name='Token price'
            type='monotone'
            dataKey='currencyBPrice'
            connectNulls={true}
            stroke='#8884d8'
            activeDot={{r: 8}}
          />
          <Line name='USDT swap' type='monotone' dataKey='currencyASwapPrice' stroke='#82ca9d' connectNulls={true} />
          <Line name='Token swap' type='monotone' dataKey='currencyBSwapPrice' stroke='red' connectNulls={true} />
        </LineChart>
      </ResponsiveContainerWrapper>
  )
}

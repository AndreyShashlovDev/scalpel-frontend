import { useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'
import { ComponentSize } from '../../../../common/app-ui/presentation/ComponentSize.ts'
import { LoadingView } from '../../../../common/app-ui/presentation/LoadingView.tsx'
import { PageLayoutView } from '../../../../common/app-ui/presentation/PageLayoutView.tsx'
import useObservable from '../../../../hooks/useObservable.ts'
import { getDIValue } from '../../../../Injections.ts'
import { AnalyticsRange } from '../data/analytics-repository/AnalyticsRange.ts'
import { AnalyticsPagePresenter } from '../domain/AnalyticsPagePresenter.ts'
import '../domain/AnalyticsPagePresenterModule.ts'
import { SwapPriceChartView } from './components/SwapPriceChartView.tsx'

const Container = styled(PageLayoutView)`
  overflow: hidden;
  height: 100vh;
`

const ChartTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({theme}) => theme.size.fontSize.medium};
  padding: 12px;
`

const RangeSelectorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 32px;
  gap: 8px;

  font-size: ${({theme}) => theme.size.fontSize.medium};

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
`
const ChartContainer = styled.div`
  width: 95%;
  height: 300px;
`

export interface AnalyticsPageProps {
  strategyHash?: string
}

export const AnalyticsPageView = ({strategyHash}: AnalyticsPageProps) => {

  const presenter = useMemo(() => getDIValue(AnalyticsPagePresenter), [])
  const chartModel = useObservable(presenter.getChartModel(), undefined)
  const isLoading = useObservable(presenter.getIsLoading(), true)

  useLayoutEffect(() => {
    if (strategyHash) {
      presenter.setStrategyHash(strategyHash)
    }

    presenter.init()

    return () => presenter.destroy()
  }, [strategyHash, presenter])

  return (
    <Container
      refresh={() => presenter.refresh()}
      fetched={!isLoading}
    >
      {
        (isLoading) ? <LoadingView size={ComponentSize.STANDARD} /> : undefined
      }
      {
        (!isLoading && !chartModel)
          ? <div>Something when wrong</div>
          : chartModel
            ? (
              <div>
                <ChartTitleContainer>
                  <div>Show latest {Math.round(chartModel.data.length / 144)} days</div>
                  <RangeSelectorContainer>
                    <div onClick={() => presenter.onChartRangeChange(AnalyticsRange.DAY)}>1d</div>
                    <div onClick={() => presenter.onChartRangeChange(AnalyticsRange.WEEK)}>7d</div>
                    <div onClick={() => presenter.onChartRangeChange(AnalyticsRange.MONTH)}>30d</div>
                    <div onClick={() => presenter.onChartRangeChange(AnalyticsRange.ALL)}>ALL</div>
                  </RangeSelectorContainer>
                </ChartTitleContainer>
                <ChartContainer>
                  <SwapPriceChartView model={chartModel} />
                </ChartContainer>
              </div>
            )
            : undefined
      }
    </Container>
  )
}

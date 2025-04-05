import { useObservable, usePresenter } from 'flexdi/react'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import { RouterPath } from '../../../common/router/domain/ApplicationRouter.ts'
import { AnalyticsRange } from '../data/analytics-repository/AnalyticsRange.ts'
import { AnalyticsPagePresenter } from '../domain/AnalyticsPagePresenter.ts'
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
`
const ChartContainer = styled.div`
  width: 95%;
  height: 300px;
`

const ChartDateRangeContainer = styled.div<{ $selected: boolean }>`
  text-decoration: ${({$selected}) => $selected ? 'underline' : 'unset'};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
`

export const AnalyticsPageView = () => {

  const queryParams = useParams()
  const presenter = usePresenter(
    AnalyticsPagePresenter,
    {strategyHash: queryParams[RouterPath.OrderAnalytics.params.strategyHash] ?? ''}
  )
  const chartModel = useObservable(presenter.getChartModel(), undefined)
  const selectedChartRange = useObservable(presenter.getSelectedChartRange(), undefined)
  const isLoading = useObservable(presenter.getIsLoading(), true)

  const onBackButtonHandler = useCallback(() => {
    presenter.onBackButtonClick()
  }, [presenter])

  return (
    <>
      <PageHeaderView
        text={'Analytics'}
        hasMainMenu={false}
        hasBackButton={true}
        onBackButtonClick={onBackButtonHandler}
      />
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
                    <div>Show {Math.round(chartModel.data.length / 144)} of {chartModel.maxDays} days.</div>
                    <RangeSelectorContainer>
                      <ChartDateRangeContainer
                        $selected={selectedChartRange === AnalyticsRange.DAY}
                        onClick={() => presenter.onChartRangeChange(AnalyticsRange.DAY)}
                      >
                        1d
                      </ChartDateRangeContainer>
                      <ChartDateRangeContainer
                        $selected={selectedChartRange === AnalyticsRange.WEEK}
                        onClick={() => presenter.onChartRangeChange(AnalyticsRange.WEEK)}
                      >
                        7d
                      </ChartDateRangeContainer>
                      <ChartDateRangeContainer
                        $selected={selectedChartRange === AnalyticsRange.MONTH}
                        onClick={() => presenter.onChartRangeChange(AnalyticsRange.MONTH)}
                      >
                        30d
                      </ChartDateRangeContainer>
                      <ChartDateRangeContainer
                        $selected={selectedChartRange === AnalyticsRange.ALL}
                        onClick={() => presenter.onChartRangeChange(AnalyticsRange.ALL)}
                      >
                        ALL
                      </ChartDateRangeContainer>
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
    </>
  )
}

export default AnalyticsPageView

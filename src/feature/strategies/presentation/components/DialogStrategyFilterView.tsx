import { ForwardedRef, forwardRef, useState } from 'react'
import styled from 'styled-components'
import { AppButton } from '../../../../common/app-ui/AppButton.tsx'
import AppSwitchView from '../../../../common/app-ui/AppSwitchView.tsx'
import { BasicDialogView, DialogCallback } from '../../../../common/app-ui/dialog/BasicDialogView.tsx'
import { PageHeaderView } from '../../../../common/app-ui/PageHeaderView.tsx'
import StrategiesFilter from '../../domain/model/StrategiesFilter.ts'

const ContentContainer = styled.div`
  width: 100%;
`

const ItemsContainer = styled.div`
  width: 100%;
`

const FilterStatusItemContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 16px;
  padding: 8px;
  width: 100%;
`

const FooterContainer = styled.div`
  margin-top: 8px;
  padding: 16px 8px 8px;
  border-top: 1px solid white;
`

type CallBackDataType = {
  filter: StrategiesFilter
}

export interface DialogStrategyFilterCallBack extends DialogCallback<CallBackDataType> {}

export interface DialogStrategyFilterProps {
  onChangeFilter: (filter: StrategiesFilter) => void
}

export const DialogStrategyFilterView = forwardRef((
  {onChangeFilter}: DialogStrategyFilterProps,
  ref: ForwardedRef<DialogStrategyFilterCallBack>
) => {
  const [data, setData] = useState<CallBackDataType>()

  return (
    <BasicDialogView
      isFullScreen={false}
      title={<PageHeaderView text={`Filter`} hasMainMenu={false} />}
      // @ts-expect-error is ok
      ref={ref}
      // @ts-expect-error is ok
      onOpen={(data: CallBackDataType) => {
        if (data) {
          setData(data)
        }
      }}
      content={
        <ContentContainer>
          <ItemsContainer>
            {data?.filter.statusFilterItems.map(item => (
                <FilterStatusItemContainer key={item.key}>
                  {item.alias}
                  <AppSwitchView
                    isOn={data?.filter.selectedStatus.has(item.key)}
                    onToggle={(isOn) => {
                      const selectedItems = new Set(data?.filter.selectedStatus ?? [])

                      if (isOn) {
                        selectedItems.add(item.key)
                      } else {
                        selectedItems.delete(item.key)
                      }

                      if (selectedItems.size > 0) {
                        setData({filter: data.filter.copy({selectedStatus: selectedItems})})
                      }
                    }}
                  />
                </FilterStatusItemContainer>
              )
            )}
          </ItemsContainer>
          <FooterContainer>
          <AppButton
            onClick={() => {
              // @ts-expect-error dsdsd
              ref?.current?.closeDialog()
              onChangeFilter(data!.filter!)
            }}
            text={'Apply'}
          />
          </FooterContainer>
        </ContentContainer>
      }
    />
  )
})

import { memo, useRef } from 'react'
import { NumericFormat } from 'react-number-format'

export interface AppNumberInputProps {
  defValue?: number,
  prefix?: string
  suffix?: string,
  allowNegative?: boolean
  decimals?: number
  maxAmount?: number
  onChange: (value: number | undefined) => void
  max?: number
  min?: number
  allowEmptyValue?: boolean
  defaultValue?: number | undefined
}

const MemoNumericFormat = memo(NumericFormat)

export const AppNumberInputView = memo(({
  prefix,
  suffix,
  onChange,
  decimals,
  allowNegative,
  allowEmptyValue,
  defaultValue,
  min,
  max,
  ...props
}: AppNumberInputProps) => {
  const val = useRef<number | undefined>(defaultValue)

  return (
    <MemoNumericFormat
      allowLeadingZeros
      prefix={prefix}
      allowNegative={allowNegative}
      suffix={suffix}
      decimalScale={decimals}
      defaultValue={defaultValue}
      value={(() => {
        return allowEmptyValue ? val.current : Math.max(val.current ?? min ?? 0, min ?? 0)
      })()}
      isAllowed={(v) => {
        return (max === undefined || max >= (v.floatValue ?? 0)) &&
          (min === undefined || min <= (v.floatValue ?? min))
      }}
      decimalSeparator={','}
      thousandSeparator={' '}
      onBlur={() => onChange(val.current)}
      onValueChange={(values) => {
        val.current = values.floatValue

        if (!values.floatValue && !allowEmptyValue) {
          onChange(min ?? 0)
          return
        }
      }}
      {...props}
    />
  )
})

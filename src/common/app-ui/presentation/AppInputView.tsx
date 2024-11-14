import { useRef } from 'react'
import { NumericFormat } from 'react-number-format'

export interface AppInputProps {
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

export const AppInputView = ({
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
}: AppInputProps) => {
  const val = useRef<number | undefined>(defaultValue)

  return (
    <NumericFormat
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
      onValueChange={(values) => {
        val.current = values.floatValue

        if (!values.floatValue && !allowEmptyValue) {
          onChange(min ?? 0)
          return
        }

        onChange(values.floatValue)
      }}
      {...props}
    />
  )
}

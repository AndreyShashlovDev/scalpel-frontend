import { StrategyOptionsData, StrategyOptionsProps } from './StrategyOptionsProps.ts'

export interface ClassicScalpelOptionsData extends StrategyOptionsData {
  buyMaxPrice: number | undefined
  growDiffPercentsUp: number
  growDiffPercentsDown: number
}

export const ClassicScalpelOptionsView = ({onChange}: StrategyOptionsProps<ClassicScalpelOptionsData>) => {

  console.log(onChange)
  return <div>Classic options</div>
}

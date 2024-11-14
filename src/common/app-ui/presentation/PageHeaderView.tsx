import styled from 'styled-components'
import { AppTitleView } from './AppTitleView.tsx'

export const PageHeaderView = styled(AppTitleView)`
  //padding: 10px 16px 0 16px;
  position: sticky;
  height: ${({theme}) => theme.size.header};
  text-align: center;
  background: ${({theme}) => theme.color.background};
  font-size: large;
  border-bottom-color: grey;
  border-bottom-width: 1px;
  border-bottom-style: solid;
`

import { createContext, ReactNode, useContext, useState } from 'react'

export interface AppContextInterface {
  visibilityAppMenu: boolean,
  seVisibilityAppMenu: (value: boolean) => void
}

const AppContext = createContext<AppContextInterface>({
  visibilityAppMenu: false,
  seVisibilityAppMenu: () => {}
})

export function useApp() {
  return useContext(AppContext)
}

export const AppProvider = ({children}: { children: ReactNode }) => {

  const [visibilityAppMenu, seVisibilityAppMenu] = useState(false)

  return (
    <AppContext.Provider
      value={{
        visibilityAppMenu,
        seVisibilityAppMenu
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

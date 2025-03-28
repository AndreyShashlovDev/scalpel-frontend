import { domAnimation, LazyMotion, m } from 'framer-motion'
import {
  forwardRef,
  memo,
  ReactElement,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import styled from 'styled-components'

const Container = styled(m.div)`
`

export interface ListItem {
  hash: string
}

export interface ListItemHolder<T extends ListItem> {
  item: T
  onItemClick: (hash: string, viewId: number, data?: unknown) => void
}

export interface ListItemsProps<T extends ListItem> {
  items: T[]
  onNextFetch: () => void
  hasNext: boolean
  onItemClick: (hash: string, viewId: number, data?: unknown) => void
}

export type Direction = 'top' | 'bottom' | 'unknown'

export interface InfiniteScrollListProps<T extends ListItem> {
  items: T[]
  getHolderView: (
    item: T,
    index: number,
    ref: (element: HTMLElement | null) => void
  ) => ReactElement
  onNextFetch: () => void
  hasNext: boolean
  loadingElement: ReactElement
  defaultIndexSelected?: number
  initialScrollY?: number
  scrollParent?: RefObject<HTMLDivElement | undefined>
}

const InfiniteScrollListView = memo(forwardRef((
  {
    items,
    getHolderView,
    onNextFetch,
    hasNext,
    loadingElement,
    defaultIndexSelected,
    scrollParent,
    initialScrollY,
    ...props
  }: InfiniteScrollListProps<ListItem>, ref
) => {
  const itemRefs = useRef(new Map<string, HTMLElement>())
  const refSetterCache = useRef(new Map<string, (element: HTMLElement | null) => void>())
  const callNextFetch = useRef(false)
  const [isEndReached, setIsEndReached] = useState(false)
  const wasInit = useRef(false)

  const findTopMargin = useCallback(() => {
    const firstEl = itemRefs.current.get(items[0]?.hash)
    return Math.abs(window.scrollY - Math.abs(firstEl?.getBoundingClientRect().top ?? 0))
  }, [items])

  const findNextIndex = () => {
    const margin = findTopMargin()

    for (let i = 0; i < items.length; i++) {
      const element = itemRefs.current.get(items[i]?.hash)

      if (element) {
        const rect = element.getBoundingClientRect()

        if (rect.top > margin * 1.1) {
          return i
        }
      }
    }
  }

  const moveToIndex = useCallback((index: number, to: Direction, smooth: boolean = true) => {
    const element = itemRefs.current.get(items[index]?.hash)

    if (element) {
      // for inner scroll
      if (scrollParent?.current) {
        const elementRect = element.getBoundingClientRect()
        const parentRect = scrollParent.current.getBoundingClientRect()
        const parentScrollTop = scrollParent.current.scrollTop
        const relativeElementTop = elementRect.top - parentRect.top + parentScrollTop
        const relativeElementBottom = elementRect.bottom - parentRect.top + parentScrollTop
        const targetScrollTop = to === 'top' ? relativeElementTop : relativeElementBottom - parentRect.height

        scrollParent.current.scrollTo({
          top: index <= 0 ? 0 : targetScrollTop,
          behavior: smooth ? 'smooth' : 'instant'
        })

      } else {
        const topMargin = findTopMargin()
        const rect = element.getBoundingClientRect()
        const elementPosition = (to === 'top' ? rect.top : rect.bottom) + window.scrollY
        const scrollY = elementPosition - topMargin

        window.scrollTo({
          top: index <= 0 ? 0 : scrollY,
          behavior: smooth ? 'smooth' : 'instant'
        })
      }
    }
  }, [findTopMargin, items, scrollParent])

  useImperativeHandle(ref, () => ({
    findNextIndex,
    moveToIndex,
  }))

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (initialScrollY && items.length > 0 && !wasInit.current) {
          wasInit.current = true
          window.scrollTo({top: initialScrollY, behavior: 'instant'})
        }

        if (entry.isIntersecting) {
          const currentHash = entry.target.getAttribute('data-key')

          if (items[items.length - 1]?.hash === currentHash) {
            setIsEndReached(true)

            if (!callNextFetch.current && hasNext) {
              callNextFetch.current = true
              onNextFetch()
            }
          }
        }
      })
    }, {root: null, threshold: 0})

    callNextFetch.current = false

    observer.disconnect()

    itemRefs.current.forEach((value) => {
      observer.unobserve(value)
    })

    items.forEach((item) => {
      const element = itemRefs.current.get(item.hash)

      if (element) {
        element.setAttribute('data-key', item.hash)
        observer.observe(element)
      }
    })

    if (defaultIndexSelected && items.length > 0 && !wasInit.current) {
      wasInit.current = true
      moveToIndex(defaultIndexSelected, 'bottom', false)
    }

    const currentHashes = new Set(items.map(item => item.hash))

    Array.from(refSetterCache.current.keys()).forEach(hash => {
      if (!currentHashes.has(hash)) {
        refSetterCache.current.delete(hash)
      }
    })

    const itemsRefs = itemRefs.current

    return () => {
      itemsRefs.forEach((element) => {
        if (element) {
          observer.unobserve(element)
        }
      })

      observer.disconnect()
      callNextFetch.current = false
    }
  }, [isEndReached, onNextFetch, hasNext, initialScrollY, moveToIndex, defaultIndexSelected, items])

  const getRefSetter = useCallback((hash: string) => {
    let setter = refSetterCache.current.get(hash)

    if (!setter) {
      setter = (element: HTMLElement | null) => {
        if (element) {
          itemRefs.current.set(hash, element)
          element.setAttribute('data-key', hash)
        } else {
          itemRefs.current.delete(hash)
        }
      }
      refSetterCache.current.set(hash, setter)
    }

    return setter
  }, [])

  const renderedItems = useMemo(() => {
    return items.map((item, index) =>
      getHolderView(item, index, getRefSetter(item.hash))
    )
  }, [items, getHolderView, getRefSetter])

  return (
    <LazyMotion features={domAnimation} strict>
      <Container {...props}>
        {renderedItems}
        {isEndReached && hasNext && loadingElement}
      </Container>
    </LazyMotion>
  )
}))

export default InfiniteScrollListView

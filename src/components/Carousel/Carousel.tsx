/** @jsxImportSource @emotion/react */
import React, {
  useRef,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import {
  useSpring,
  config,
  AnimationResult,
} from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useCustomEventsModule } from '../modules'
import { SlideToItemFnProps, SlideActionType } from './types'
import { useMount } from '../utils'
import {
  CarouselContainer,
  CarouselItem,
  CarouselTrack,
  CarouselWrapper,
  Div,
  NextButton,
  PrevButton,
} from './Carousel.styled'

export interface CarouselProps {
  children: ReactNode
  isInfinite?: boolean
  hasNavigation?: boolean
  draggingSlideTreshold?: number
  springConfig?: typeof config
  shouldResizeOnWindowResize?: boolean
  carouselSlideAxis?: 'x' | 'y'
  itemsPerSlide?: number
  initialActiveItem?: number
  initialStartingPosition?: 'start' | 'center' | 'end'
  disableGestures?: boolean
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  hasNavigation,
  isInfinite = false,
  draggingSlideTreshold = 100,
  springConfig = config.default,
  shouldResizeOnWindowResize = true,
  carouselSlideAxis = 'x',
  itemsPerSlide = 1,
  initialActiveItem = 0,
  initialStartingPosition = 'start',
  disableGestures = false,
}) => {
  const lastItemReached = useRef(false)
  const slideActionType = useRef<SlideActionType>('next')
  const activeItem = useRef(initialActiveItem)
  const mainCarouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const carouselTrackWrapperRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const isAnimating = useRef(false)
  const windowIsHidden = useRef(false)
  const currentWindowWidth = useRef(0)

  const childArray = React.Children.toArray(children)
  const internalChildren = isInfinite
    ? [...childArray, ...childArray, ...childArray]
    : childArray

  const { emitObservable } = useCustomEventsModule()

  const [carouselStyles, setCarouselStyles] = useSpring(() => ({
    y: 0,
    x: 0,
    config: springConfig,
  }))

  const getSlideValue = useCallback(() => {
    if (!carouselTrackWrapperRef.current) {
      return 0
    }
    const carouselItem = carouselTrackWrapperRef.current
      .firstChild as HTMLElement

    if (!carouselItem) {
      throw Error('No carousel items available!')
    }

    return carouselSlideAxis === 'x'
      ? carouselItem.getBoundingClientRect().width
      : carouselItem.getBoundingClientRect().height
  }, [carouselSlideAxis])

  const adjustCarouselWrapperPosition = useCallback(
    (ref: HTMLDivElement) => {
      const positionProperty =
        carouselSlideAxis === 'x' ? 'left' : 'top'
      const getDefaultPositionValue = () =>
        getSlideValue() * childArray.length
      const setPosition = (v: number) => {
        ref.style.top = '0px'
        ref.style.left = '0px'
        ref.style[positionProperty] = `-${v}px`
      }
      const setStartPosition = () =>
        setPosition(getDefaultPositionValue())
      const setCenterPosition = () =>
        setPosition(
          getDefaultPositionValue() -
            getSlideValue() * Math.round((itemsPerSlide - 1) / 2),
        )
      const setEndPosition = () =>
        setPosition(
          getDefaultPositionValue() -
            getSlideValue() * Math.round(itemsPerSlide - 1),
        )

      if (itemsPerSlide > 1) {
        switch (initialStartingPosition) {
          case 'center':
            setCenterPosition()
            break
          case 'end':
            setEndPosition()
            break
          default:
            setStartPosition()
        }
      } else {
        setStartPosition()
      }
    },
    [
      carouselSlideAxis,
      getSlideValue,
      initialStartingPosition,
      childArray.length,
      itemsPerSlide,
    ],
  )

  const handleResize = useCallback(() => {
    if (window.innerWidth === currentWindowWidth.current) {
      return
    }
    currentWindowWidth.current = window.innerWidth

    setCarouselStyles.start({
      immediate: true,
      x: 0,
      y: 0,
    })
    setCarouselStyles.start({
      immediate: true,
      [carouselSlideAxis]: -(getSlideValue() * activeItem.current),
    })

    if (isInfinite) {
      adjustCarouselWrapperPosition(carouselTrackWrapperRef.current!)
    }
  }, [
    adjustCarouselWrapperPosition,
    carouselSlideAxis,
    getSlideValue,
    setCarouselStyles,
    isInfinite,
  ])

  useEffect(() => {
    if (shouldResizeOnWindowResize) {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [handleResize, shouldResizeOnWindowResize])

  useEffect(() => {
    if (carouselTrackWrapperRef.current) {
      carouselTrackWrapperRef.current.style.top = '0px'
      carouselTrackWrapperRef.current.style.left = '0px'
    }
  }, [carouselSlideAxis])

  useMount(() => {
    currentWindowWidth.current = window.innerWidth
    const handleVisibilityChange = () => {
      windowIsHidden.current = document.hidden
    }
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    )
    return () =>
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      )
  })

  useMount(() => {
    if (
      initialActiveItem > 0 &&
      initialActiveItem <= childArray.length
    ) {
      slideToItem({ to: initialActiveItem, immediate: true })
      activeItem.current = initialActiveItem
    }
  })

  useEffect(() => {
    if (carouselTrackWrapperRef.current) {
      const items = carouselTrackWrapperRef.current.querySelectorAll(
        '.pegasus-carousel-item',
      )
      const lastItem = items[items.length - 1]
      const observer = new IntersectionObserver(
        entries => {
          const lastItemEntry = entries[0]
          lastItemReached.current = lastItemEntry.isIntersecting
        },
        { threshold: 1 },
      )
      observer.observe(lastItem)
      return () => observer.unobserve(lastItem)
    }
  }, [itemsPerSlide])

  const bindDrag = useDrag(
    props => {
      const isDragging = props.dragging
      const movement =
        props.movement[carouselSlideAxis === 'x' ? 0 : 1]

      const currentSlidedValue = -(
        getSlideValue() * getCurrentActiveItem()
      )

      const resetAnimation = () => {
        setCarouselStyles.start({
          [carouselSlideAxis]: currentSlidedValue,
        })
      }

      if (isDragging) {
        setCarouselStyles.start({
          [carouselSlideAxis]: currentSlidedValue + movement,
        })

        emitObservable({
          eventName: 'onDrag',
          ...props,
        })

        const prevItemTreshold = movement > draggingSlideTreshold
        const nextItemTreshold = movement < -draggingSlideTreshold

        if (nextItemTreshold) {
          if (!isInfinite && getIsLastItem()) {
            resetAnimation()
          } else {
            slideToNextItem()
          }
          props.cancel()
        } else if (prevItemTreshold) {
          if (!isInfinite && getIsFirstItem()) {
            resetAnimation()
          } else {
            slideToPrevItem()
          }
          props.cancel()
        }
      }

      if (props.last) {
        resetAnimation()
      }
    },
    {
      enabled: !disableGestures,
    },
  )

  const getCurrentActiveItem = () => activeItem.current
  const getIsFirstItem = () => getCurrentActiveItem() === 0
  const getIsLastItem = () =>
    getCurrentActiveItem() === childArray.length - 1

  const slideToItem = ({
    from,
    to,
    immediate = false,
    onRest = () => {},
  }: SlideToItemFnProps) => {
    if (!immediate) {
      activeItem.current = to
      isAnimating.current = true
      emitObservable({
        eventName: 'onSlideStartChange',
        nextItem: to,
        slideActionType: slideActionType.current,
      })
    }

    const getFromValue = () =>
      from ? { from: { [carouselSlideAxis]: from } } : {}

    setCarouselStyles.start({
      ...getFromValue(),
      to: { [carouselSlideAxis]: -(getSlideValue() * to) },
      immediate,
      onRest: (val: AnimationResult) => {
        if (val.finished) {
          isDragging.current = false
          isAnimating.current = false
          onRest()

          if (!immediate) {
            emitObservable({
              eventName: 'onSlideChange',
              currentItem: getCurrentActiveItem(),
              slideActionType: slideActionType.current,
            })
          }
        }
      },
    })
  }

  const slideToPrevItem = () => {
    if (
      (!isInfinite && getCurrentActiveItem() === 0) ||
      windowIsHidden.current
    )
      return

    slideActionType.current = 'prev'
    if (getIsFirstItem()) {
      slideToItem({
        from: -(
          Math.abs(
            getWrapperFromValue(carouselTrackWrapperRef.current!),
          ) +
          getSlideValue() * childArray.length
        ),
        to: childArray.length - 1,
      })
    } else {
      slideToItem({ to: getCurrentActiveItem() - 1 })
    }
  }

  const slideToNextItem = () => {
    if (
      (!isInfinite &&
        getCurrentActiveItem() === internalChildren.length - 1) ||
      windowIsHidden.current ||
      lastItemReached.current
    )
      return

    slideActionType.current = 'next'
    if (getIsLastItem()) {
      slideToItem({
        from:
          getWrapperFromValue(carouselTrackWrapperRef.current!) +
          getSlideValue() * childArray.length,
        to: 0,
      })
    } else {
      slideToItem({ to: getCurrentActiveItem() + 1 })
    }
  }

  const getWrapperFromValue = (element: HTMLDivElement) => {
    if (element.style.transform === 'none') return 0
    const values = element.style.transform.split(/\w+\(|\);?/)
    return Number(
      values[1]
        .split(/,\s?/g)
        [carouselSlideAxis === 'x' ? 0 : 1].replace('px', ''),
    )
  }

  return (
    <CarouselContainer>
      {hasNavigation && (
        <Div>
          <PrevButton onClick={slideToPrevItem}>Prev</PrevButton>
          <NextButton onClick={slideToNextItem}>Next</NextButton>
        </Div>
      )}

      <CarouselWrapper ref={mainCarouselWrapperRef}>
        <CarouselTrack
          {...bindDrag()}
          style={{
            flexDirection:
              carouselSlideAxis === 'x' ? 'row' : 'column',
            ...carouselStyles,
          }}
          ref={ref => {
            if (ref) {
              carouselTrackWrapperRef.current = ref
              if (isInfinite) {
                adjustCarouselWrapperPosition(ref)
              }
            }
          }}
        >
          {internalChildren.map((child, index) => (
            <CarouselItem
              key={index}
              className="pegasus-carousel-item"
              itemsPerSlide={itemsPerSlide}
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselTrack>
      </CarouselWrapper>
    </CarouselContainer>
  )
}

export default Carousel

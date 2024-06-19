import {
    SpringConfig,
    TransitionFrom,
    TransitionTo,
  } from 'react-spring'
  
  export type ReactSpringCarouselItem = {
    id: string
    renderItem: React.ReactNode
  }
  
  type BaseCarouselSharedProps = {
    withLoop?: boolean
    disableGestures?: boolean
    draggingSlideTreshold?: number
    springConfig?: SpringConfig
    items: ReactSpringCarouselItem[]
  }
  
  export type UseSpringCarouselProps = BaseCarouselSharedProps & {
    shouldResizeOnWindowResize?: boolean
    carouselSlideAxis?: 'x' | 'y'
    itemsPerSlide?: number
    initialActiveItem?: number
    initialStartingPosition?: 'start' | 'center' | 'end'
  }
    
  export type SlideToItemFnProps = {
    from?: number
    to: number
    newIndex?: number
    immediate?: boolean
    onRest?(): void
  }
  
  export type SpringAnimationProps = {
    initial: TransitionFrom<ReactSpringCarouselItem>
    from: TransitionFrom<ReactSpringCarouselItem>
    enter: TransitionTo<ReactSpringCarouselItem>
    leave: TransitionTo<ReactSpringCarouselItem>
  }
  
  export type UseTransitionCarouselProps = BaseCarouselSharedProps & {
    toPrevItemSpringProps?: SpringAnimationProps
    toNextItemSpringProps?: SpringAnimationProps
    springAnimationProps?: SpringAnimationProps
  }
  
  type BaseContextSharedProps = {
    getIsPrevItem(id: string): boolean
    getIsNextItem(id: string): boolean
    slideToNextItem(): void
    slideToPrevItem(): void
    getIsAnimating(): boolean
    slideToItem(item: string | number): void
    getIsActiveItem(id: string): boolean
    getCurrentActiveItem(): {
      id: string
      index: number
    }
    useListenToCustomEvent: UseListenToCustomEvent
  }
  
  export type UseSpringCarouselContextProps = BaseContextSharedProps & {
    getIsDragging(): boolean
  }
  
  export type UseTransitionCarouselContextProps = BaseContextSharedProps & {
    activeItem: number
  }
  
  import { FullGestureState } from '@use-gesture/react'
  
  export type SlideActionType = 'prev' | 'next'
  
  type OnSlideStartChange = {
    eventName: 'onSlideStartChange'
    nextItem: number
    slideActionType: SlideActionType
  }
  type OnSlideChange = {
    eventName: 'onSlideChange'
    currentItem: number
    slideActionType: SlideActionType
  }
  
  type OnDrag = Omit<FullGestureState<'drag'>, 'event'> & {
    eventName: 'onDrag'
  }
  
  type OnFullscreenChange = {
    eventName: 'onFullscreenChange'
    isFullscreen: boolean
  }
  
  type OnLeftSwipe = {
    eventName: 'onLeftSwipe'
  }
  
  type OnRightSwipe = {
    eventName: 'onRightSwipe'
  }
  
  export type EmitObservableFn = (
    data:
      | OnSlideStartChange
      | OnSlideChange
      | OnDrag
      | OnFullscreenChange
      | OnLeftSwipe
      | OnRightSwipe,
  ) => void
  
  export type EventsObservableProps =
    | OnSlideStartChange
    | OnSlideChange
    | OnDrag
    | OnFullscreenChange
    | OnLeftSwipe
    | OnRightSwipe
  
  export type ObservableCallbackFn = (
    data: EventsObservableProps,
  ) => void
  
  export type UseListenToCustomEvent = (
    fn: ObservableCallbackFn,
  ) => void
import { useEffect, useRef } from 'react'
import { Subject } from 'rxjs'
import type {
  EventsObservableProps,
  ObservableCallbackFn,
  EmitObservableFn,
} from '../Carousel/types'

export function useCustomEventsModule() {
  const eventsObserverRef = useRef(
    new Subject<EventsObservableProps>(),
  )

  function useListenToCustomEvent(fn: ObservableCallbackFn) {
    useEffect(() => {
      const subscribe = eventsObserverRef.current.subscribe(fn)
      return () => subscribe.unsubscribe()
    }, [fn])
  }

  const emitObservable: EmitObservableFn = data => {
    eventsObserverRef.current.next(data)
  }

  return {
    useListenToCustomEvent,
    emitObservable,
  }
}
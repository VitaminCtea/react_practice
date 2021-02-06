import { useReducer, useEffect, useRef, Reducer } from 'react' 

export const useTimer = <T extends number>(timestamp: T) => {
    type State = { dd: T; mm: T; hh: T; ss: T }
    type Action = { type: 'SET_TIME' | 'DECREASE_SECOND'; payload?: State }

    const decreaseSecond = <S extends State>(state: S): S => {
        let { dd: day, hh: hour, mm: minutes, ss: seconds } = state

        ;(
            seconds > 0 ? seconds-- : 
            minutes > 0 ? (seconds = 59 as T) && minutes-- : 
            hour > 0 ? (minutes = seconds = 59 as T) && hour-- : 
            day > 0 ? (minutes = seconds = 59 as T) && (hour = 23 as T) && day-- : 
            day
        ) as T

        return { dd: day, hh: hour, mm: minutes, ss: seconds } as S
    }

    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'SET_TIME': return action.payload
            case 'DECREASE_SECOND': return decreaseSecond(state)
            default: return state
        }
    }

    const initialState: State = { dd: 0 as T, hh: 0 as T, mm: 0 as T, ss: 0 as T }
    const [ timer, dispatch ] = useReducer(reducer as Reducer<State, Action>, initialState)

    useEffect(() => {
        const timeDate = new Date(timestamp).getTime()
        const timeState: State = {
            dd: (timeDate / (1000 * 60 * 60 * 24) | 0) as T,
            hh: ((timeDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) | 0) as T,
            mm: ((timeDate % (1000 * 60 * 60)) / (1000 * 60) | 0) as T,
            ss: ((timeDate % (1000 * 60)) / 1000 | 0) as T
        }
        dispatch({ type: 'SET_TIME', payload: timeState })
    }, [ timestamp ])

    useInterval(() => dispatch({ type: 'DECREASE_SECOND' }), timestamp)

    return timer
}

export const useInterval = (callback: () => void, timestamp: number, delay: number = 1000) => {
    const savedCallback = useRef<typeof callback>()
    const savedTimer = useRef<any>(null!)
    const savedCount = useRef<number>(0)
    const toSecond = timestamp / 1000

    useEffect(() => {
        savedCallback.current = callback
    }, [ callback ])

    useEffect(() => {
        const tick = () => {
            if (savedCallback.current) {
                savedCallback.current!()
                ++savedCount.current >= toSecond && clearInterval(savedTimer.current)
            }
        }
        savedTimer.current = setInterval(tick, delay)
        return () => clearInterval(savedTimer.current)
    }, [ delay, toSecond ])
}

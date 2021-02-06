import React from 'react'
import ReactDOM from 'react-dom'

// import App from './App'
import { Board } from './drag/Board'
import { observe } from './drag/Game'
import './index.css'

const rank = <T extends number>(val: T, arr: T[]): T => {
    let low: T = 0 as T
    let high: T = arr.length - 1 as T
    while (low <= high) {
        const mid: T = low + ((high - low) / 2 | 0) as T
        if (val < arr[mid]) high = mid - 1 as T
        else if (val > arr[mid]) low = mid + 1 as T
        else return mid
    }
    return -1 as T
}

const getIntegerPair = <T extends number>(arr: T[]): T => {
    const sortArray: T[] = arr.sort((a, b) => a - b)
    const len: number = sortArray.length
    let cnt: number = 0
    for (let i: number = 0; i < len; i++) 
        if (rank(-arr[i], sortArray) > i) cnt++
    return cnt as T
}

console.log(getIntegerPair([ 10, 2, 4, -10, 8, -2 ]))

observe(knightPosition => 
    ReactDOM.render(
        <Board knightPosition={ knightPosition } />, 
        document.getElementById('root'), 
        () => console.log('更新了!')
    )
)

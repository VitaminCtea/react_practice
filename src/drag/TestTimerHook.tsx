import React from 'react'
import { useTimer } from '../hook'

const fillZero = (num: number, digit: number = 2) => '000000000'.substring(0, digit - (num + '').length) + num

export const TestTimerHook = () => {
    const { dd, hh, mm, ss } = useTimer(86400000)
    return (
        <p>
            Test the countdown timer hook: { fillZero(dd) }: { fillZero(hh) }: { fillZero(mm) }: { fillZero(ss) }
        </p>
    )
}
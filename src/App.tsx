import React from 'react'

import ErrorBoundary from './ErrorBoundary'
import BuggyCounter from './BuggyCounter'

import './App.css'

import './factory_pattern'
import './adapter_pattern'
import './decorator_pattern'
import './composite_pattern'
import './flyweight_pattern'
import './iterator_pattern'

/**
 * 辅助函数
 * 以防止访问未提供其值的Context。通过使用API，不必提供默认值，也不必检查未定义的内容
 * @returns { Array } 返回一个数组(需使用const断言来表明返回的是一个数组，否则默认是联合类型)
 */
const createContext = <A extends {} | null>() => {
    const ctx = React.createContext<A | undefined>(undefined)
    const useCtx = () => {
        /**
         * 接收一个context对象(React.createContext的返回值)并返回该context的当前值。
         * 当前的context由上层组件中距离当前组件最近<MyContext.Provider>的prop决定
         * 
         * 当组件上层最近的<MyContext.Provider>更新时，该Hook会触发重渲染，并使用最新传递给MyContext provider的context value值。
         * 即使祖先使用react.memo或shouldComponentUpdate，也会在组件本身使用useContext时重新渲染
         * 
         * useContext(MyContext)
         * 
         * 调用useContext的组件总会在context值变化时重新渲染。如果重渲染组件的开销较大，你可以通过使用memoization来优化。
         */
        const c = React.useContext(ctx)
        if (!c) throw new Error('useCtx must be inside a Provider with a value')
        return c
    }
    return [ useCtx, ctx.Provider ] as const
}

const [ useCurrentUserName, CurrentUserProvider ] = createContext<string>()

const EnthusasticGreeting = () => {
    const currentUser = useCurrentUserName()
    return <div>HELLO { currentUser!.toUpperCase() }</div>
}

const createCtx = <A extends any>(defaultValue: A) => {
    type UpdateType = React.Dispatch<React.SetStateAction<typeof defaultValue>>
    const defaultUpdate: UpdateType = () => defaultValue
    const ctx = React.createContext({ state: defaultValue, update: defaultUpdate })
    function Provider(props: React.PropsWithChildren<{}>) {
        if (!props.children) throw new Error('The props must contain children nodes inside')
        const [ state, update ] = React.useState(defaultValue)
        return <ctx.Provider value={{ state, update }} { ... props } />
    }
    return [ ctx, Provider ] as const
}

const [ ctx, TextProvider ] = createCtx('someText')

const Component = () => {
    const { state, update } = React.useContext(ctx)
    const change = (e: React.FormEvent) => {
        const target = e.target as typeof e.target & { value: string }
        update(target.value)
    }
    return (
        <label>
            { state }:
            <input type="text" onChange={ change } />
        </label>
    )
}

function App() {
	return (
        <div className="App">
            <ErrorBoundary>
                <BuggyCounter />
                <BuggyCounter />
            </ErrorBoundary>
            <CurrentUserProvider value="Anders">
                <EnthusasticGreeting />
            </CurrentUserProvider>
            <TextProvider>
                <Component />
            </TextProvider>
        </div>
    )
}

export default App

import React, { useRef, useImperativeHandle, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Knight } from './Knight'
import { moveKnight, canMoveKnight } from './Game'
import { BoardSquare } from './BoardSquare'

import { TestTimerHook } from './TestTimerHook'

type Options = {
	[K in 'noImplicitAny' | 'strictNullChecks' | 'strictFunctionTypes']?: boolean
}

const stringEnumeration: Options = {
	noImplicitAny: true,
}

type World = 'world'
type Greeting = `hello ${World}`
const result: Greeting = 'hello world'

type Color = 'red' | 'blue'
type Quantity = 'one' | 'two'
type SeussFish = `${Quantity | Color} fish`

const seussFish: SeussFish = 'two fish'

type VerticalAlignment = 'top' | 'middle' | 'bottom'
type HorizontalAlignment = 'left' | 'center' | 'right'

// Takes
//   | "top-left"    | "top-center"    | "top-right"
//   | "middle-left" | "middle-center" | "middle-right"
//   | "bottom-left" | "bottom-center" | "bottom-right"

declare function setAlignment(value: `${VerticalAlignment}-${HorizontalAlignment}`): void

type PropEventSource<T> = {
	on<K extends string & keyof T>(eventName: `${K}Changed`, callback: (newValue: T[K]) => void): void
}

/// Create a "watched object" with an 'on' method
/// so that you can watch for changes to properties.
function makeWatchedObject<T>(obj: T): T & PropEventSource<T>
function makeWatchedObject<T>(obj: T): T & PropEventSource<T> {
	return {
		...obj,
		on<K extends string & keyof T>(eventName: `${K}Changed`, callback: (newValue: T[K]) => void) {
			callback(('firstNameChanged' as unknown) as T[K])
		},
	}
}
const person = makeWatchedObject({ firstName: 'Homer', age: 42, location: 'SpringField' })
person.on('firstNameChanged', () => console.log('字符串接口测试'))

type EnthusiasticGreeting<T extends string> = `${Uppercase<T>}`
type KEY = EnthusiasticGreeting<'hello'>

const key: KEY = 'HELLO'

type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }
interface Person {
	name: string
	age: number
	location: string
}

type LazyPerson = Getters<Person>

type RemoveKindField<T> = { [K in keyof T as Exclude<K, 'kind'>]: T[K] }
interface Circle {
	kind: 'circle'
	radius: number
}

type KindlessCircle = RemoveKindField<Circle>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type Result = UnionToIntersection<{ a: string } | { b: number }>

type TestFunc<T> = T extends any ? (k: T) => void : never
type NewTestFunc<T> = TestFunc<T> extends (k: infer I) => void ? I : never

type NewTestFunc2 = NewTestFunc<string | number>

type Flatten<T> = T extends (infer U)[] ? U : never
type T0 = [string, number]

type T1 = Flatten<T0>

type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer U ? U : any
const myReturnType = (...args: any) => true

type T2 = MyReturnType<typeof myReturnType>

interface Counter {
	(start: number): string
	interval: number
	reset(): void
}

const counter = (function () {} as unknown) as Counter
counter.interval = 120
counter.reset = () => {}
console.log(counter.interval)

interface Part {
	id: number
	name: string
	subparts: Part[]
	firstFn: (brand: string) => void
	anotherFn: (channel: string) => string
}

/**
 * # 以上面Part为例：
 * & { [K in keyof T]: T[K] extends Function ? K : never } 结果为 { first: 'firstFn', anotherFn: 'anotherFn' }
 * % { [K in keyof T]: T[K] extends Function ? K : never }[keyof T] 结果为 'firstFn' | 'anotherFn'，(后面的keyof T 还是取得每个属性返回的值)
 * $ Pick<T, FunctionPropertyNames<T>> 另一个意思为 Pick<Part, 'firstFn' | 'anotherFn'>
 */
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>

type fnNames = FunctionPropertyNames<Part>
type FnProperties = FunctionProperties<Part>

const isString = (s: unknown): s is string => typeof s === 'string'
const toUpperCase = (s: unknown) => isString(s) && s.toUpperCase()

type ObjectDescriptor<D, M> = {
	data?: D
	methods?: M & ThisType<D & M>
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
	const data: object = desc.data || {}
	const methods: object = desc.methods || {}
	return { ...data, ...methods } as D & M
}

const structure = makeObject({
	data: { x: 0, y: 0 },
	methods: {
		moveBy(dx: number, dy: number) {
			this.x += dx
			this.y += dy
		},
	},
})

structure.x = 110
structure.y = 220
structure.moveBy(5, 5)

console.log(structure)

function assertIsString(val: any): asserts val is string {
	if (typeof val !== 'string') throw new TypeError('Not a string!')
}

const isPureLetters = (str: string) => /[A-Za-z]+/.test(str)
const checkLetters = (str: string) => {
	if (!isPureLetters(str)) throw new TypeError('Strings must be pure letter combinations')
}
const toLowerCase = (str: string) => str.toLowerCase()
const replace = (str: string) => str.replace(/(^[a-z]|\s+[a-z])/g, (match) => match.trim().toUpperCase())

function capitalize(str: any): never | string {
	assertIsString(str)
	checkLetters(str)
	return replace(toLowerCase(str))
}

console.log(capitalize('hello world name'))

const dataSource = [
    { category: '指南', name: '设计原则', content: '一致' },
	{ category: '指南', name: '设计原则', content: '反馈' },
	{ category: '指南', name: '设计原则', content: '效率' },
	{ category: '指南', name: '设计原则', content: '可控' },
	{ category: '指南', name: '设计原则', content: '正规' },
	{ category: '指南', name: '导航', content: '侧向导航' },
	{ category: '指南', name: '导航', content: '顶部导航' },
	{ category: '组件', name: 'Basic', content: 'Layout' },
	{ category: '组件', name: 'Basic', content: 'Color' },
	{ category: '组件', name: 'Basic', content: 'Typography' },
	{ category: '组件', name: 'Basic', content: 'Icon' },
	{ category: '组件', name: 'Basic', content: 'Button' },
	{ category: '组件', name: 'From', content: 'Radio' },
	{ category: '组件', name: 'From', content: 'Checkbox' },
	{ category: '组件', name: 'From', content: 'Input' },
	{ category: '组件', name: 'From', content: 'Select' },
	{ category: '组件', name: 'Data', content: 'Table' },
	{ category: '组件', name: 'Data', content: 'Tag' },
	{ category: '组件', name: 'Data', content: 'Progress' },
	{ category: '组件', name: 'Data', content: 'Tree' },
	{ category: '组件', name: 'Notice', content: 'Alert' },
	{ category: '组件', name: 'Notice', content: 'Loading' },
	{ category: '组件', name: 'Notice', content: 'Message' },
	{ category: '组件', name: 'Notice', content: 'MessageBox' },
	{ category: '组件', name: 'Notice', content: 'Notification' },
	{ category: '资源', name: 'Axure Components' },
	{ category: '资源', name: 'Sketch Templates' },
    { category: '资源', name: '组件交互文档' },
]

const fixedStructure = {} as any
const classification = (obj: { [PropName: string]: any }) => {
	const paths = Object.values(obj)
    let newObj = fixedStructure
    for (let i = 0; i < paths.length; i++) {
        if (!(paths[i] in newObj)) newObj[paths[i]] = {}
        if (i === paths.length - 2) {
            newObj[paths[i]] = []
            break
        }
        newObj = newObj[paths[i]]
    }
    return fixedStructure
}

const getClassificationResult = (data: any[], primaryField: string) => data.reduce((result, current) => 
    current[primaryField] in result ? result : classification(current), 
    {}
)

const isObject = (obj: unknown): obj is Object => typeof obj === 'object' && obj !== null && obj.constructor === Object

const conversionStructure = (data: any[], primaryField: string) => {
    const classificationResult = getClassificationResult(data, primaryField)
    data.forEach(item => {
        const { category, name, content } = item
		const collection = classificationResult[category][name]
        const keys = Object.keys(classificationResult[category])

        if (collection && Array.isArray(collection) && keys.some(item => item === name)) collection.push(content)
        if (!content) classificationResult[category].push(name)
    })
	return classificationResult
}

const toNest = (data: any[], primaryField: string = Object.keys(dataSource[0])[0]) => {
	const structure = conversionStructure(data, primaryField)
	const generator = (structure: ReturnType<typeof conversionStructure>) => {
		const result = [] as any
        for (let key in structure)
            result.push(
                { 
                    label: key, 
                    children: isObject(structure[key]) ? 
                        generator(structure[key]) : 
                            structure[key].map((content: string) => ({ label: content }))
                }
            )
		return result
	}
	return generator(structure)
}

const t0 = performance.now()
console.log(toNest(dataSource))
const t1 = performance.now()
console.log(t1 - t0, 'milliseconds')

const ONE_SQUARE_SIZE: number = 60

const renderSquare = <T extends number>(i: T, knightPosition: T[]) => {
	const x = i % 8
	const y = (i / 8) | 0
	return (
		<div
			key={i}
			style={{
				width: `${ONE_SQUARE_SIZE}px`,
				height: `${ONE_SQUARE_SIZE}px`,
			}}
			onClick={() => handleSquareClick(x, y)}
		>
			<BoardSquare x={x} y={y}>
				{renderPiece(x, y, knightPosition)}
			</BoardSquare>
		</div>
	)
}

const renderPiece = (x: number, y: number, [knightX, knightY]: number[]) => {
	if (x === knightX && y === knightY) return <Knight />
}

const handleSquareClick = (toX: number, toY: number) => canMoveKnight(toX, toY) && moveKnight(toX, toY)

let FancyInput = (props: { [PropName: string]: any }, ref: React.Ref<any>) => {
	const inputRef = useRef(null)
	useImperativeHandle(ref, () => ({ focus: () => (inputRef.current! as HTMLInputElement).focus() }))
	return <input ref={inputRef} {...props} placeholder="请输入一些文字~~" style={{ margin: '10px 0 0 10px' }} />
}

FancyInput = React.forwardRef(FancyInput) as any

type JSXInterface = {
	type: string | Function
	props: {
		[PropName: string]: any
		children: JSXInterface[]
	}
}
class VDom {
	public type: JSXInterface['type'] = ''
	public props: JSXInterface['props'] = { children: [] }
	public style?: { [PropName: string]: any } = {}
}

const parserToVDom = (dom: HTMLElement): any => {
	const vDom = new VDom()
	if (dom.attributes && dom.hasAttributes()) {
		const len = dom.attributes.length
		for (let i: number = 0; i < len; i++) {
			const attribute = dom.attributes[i]
			;(vDom as VDom & { [PropsName: string]: any }).props[attribute.name] =
				attribute.name === 'style'
					? attribute.value.split('; ').reduce((result, current) => {
							const [attr, val] = current.split(':')
							result[attr] = val.replace(/^\s+|\s+$/, '')
							return result
					  }, {} as JSXInterface['props'] & { [PropsName: string]: any })
					: attribute.value
		}
		vDom.style = { ...vDom.props.style }
		delete vDom.props.style
	} else delete vDom.style

	vDom.type = dom.nodeName.toLowerCase()

	if (dom.nodeType === 3 && dom.nodeValue) vDom.props.children = [dom.nodeValue as JSXInterface & string]
	else vDom.props.children = Array.from(dom.childNodes).map((d) => parserToVDom(d as HTMLElement))

	return vDom
}

const div = document.createElement('div')
const p = document.createElement('p')

div.textContent = '我是div'
div.id = 'div'
div.style.margin = '10px'
div.style.position = 'relative'
p.style.border = '1px solid red'
p.innerHTML = '你好'

div.appendChild(p)

console.log(parserToVDom(div))

/**
 * & 思路：
 * $ 记数组的全部元素之和为total, 当遍历到第i个元素时, 设其左侧元素之和为sum，则其右侧元素之和为total - nums(i) - sum。
 * # 左右侧元素相等即为sum = total - nums(i) - sum，移项的结果为: 2 * sum + nums(i) = total
 *
 * @param arr { number[] } 数据
 * @returns 中心索引(即：在中心索引的左侧所有数字之和等于中心索引右侧所有数字之和，返回-1代表没有找到)
 */
const pivotIndex = (arr: number[]): number => {
	const total = arr.reduce((result, current) => result + current, 0)
	let sum: number = 0
	for (let i: number = 0; i < arr.length; i++) {
		if (2 * sum + arr[i] === total) return i
		sum += arr[i]
	}
	return -1
}

const centerIndexArray = [1, 7, 3, 6, 5, 6]
const noCenterIndexArray = [1, 2, 3]

console.log(`找到的中心索引为: ${pivotIndex(centerIndexArray)}`)
console.log(`找到的中心索引为: ${pivotIndex(noCenterIndexArray)}`)

export const Board = ({ knightPosition }: { knightPosition: number[] }) => {
	const ref = useRef(null)

	useEffect(() => {
		if (ref.current) (ref.current! as HTMLInputElement).focus()
	})

	return (
		<>
			<DndProvider backend={HTML5Backend}>
				<div
					style={{
						width: '480px',
						height: '480px',
						display: 'flex',
						flexWrap: 'wrap',
					}}
				>
					{Array.apply(null, ({ length: 64 } as unknown) as []).map((item, index) =>
						renderSquare(index, knightPosition)
					)}
				</div>
			</DndProvider>
			<FancyInput ref={ref} />
			<TestTimerHook />
		</>
	)
}

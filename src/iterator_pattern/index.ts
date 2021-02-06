type CustomIterator<T> = { current(): T; next(): T; key(): number | string; valid(): boolean; rewind(): void }
type CreateIterator<T = CustomIterator<string>> = { getIterator(): T; getReverseIterator(): T }
type CustomCollection = { getItems(): any; getCount(): number; addItem(item: string, val?: any): void } & CreateIterator
type CustomObject = { [ PropName: string ]: any }

const isObject = (data: any) => Object.prototype.toString.call(data) === '[object Object]'

export class AlphabeticalOrderIterator implements CustomIterator<string> {
    private position: number = 0
    private reverse: boolean = false
    private data!: any[] | string | { [ PropName: string ]: any }
    private isObjectData: boolean = false
    private keys!: string[]
    private length: number

    public constructor(collection: CustomCollection, reverse: boolean = false) {
        this.data = collection.getItems()

        if (isObject(this.data)) {
            this.isObjectData = true
            this.keys = Object.keys(this.data)
            this.length = this.keys.length
        } else this.length = this.data.length

        this.reverse = reverse

        if (reverse) this.position = this.length - 1
    }

    public rewind() {
        this.position = this.reverse ? this.length - 1 : 0
    }

    public current(): any {
        if (this.isObjectData) return (this.data as CustomObject)[this.keys[this.position]]
        return (this.data as any[] | string)[this.position]
    }

    public key(): number | string {
        if (this.isObjectData) return this.keys[this.position]
        return this.position
    }

    public next(): string {
        const item = 
            this.isObjectData ? (this.data as CustomObject)[this.keys[this.position]] : (this.data as any[] | string)[this.position]
        this.position += this.reverse ? -1 : 1
        return item
    }

    public valid(): boolean {
        if (this.reverse) return this.position >= 0
        return this.position < this.length
    }
}

abstract class BaseCollection implements CustomCollection {
    public getIterator(): CustomIterator<string> {
        return new AlphabeticalOrderIterator(this)
    }

    public getReverseIterator(): CustomIterator<string> {
        return new AlphabeticalOrderIterator(this, true)
    }

    public abstract getItems(): CustomObject | string | any[]
    public abstract addItem(item: string, val?: any): void
    public abstract getCount(): number
}

class ArrayCollection extends BaseCollection {
    private items: string[] = []

    public getItems(): string[] {
        return this.items
    }

    public getCount(): number {
        return this.items.length
    }

    public addItem(item: string): void {
        this.items.push(item)
    }
}

class ObjectCollection extends BaseCollection {
    private items: CustomObject = {}

    public getItems(): CustomObject {
        return this.items
    }

    public getCount(): number {
        return Object.keys(this.items).length
    }

    public addItem(item: string, val: any): void {
        this.items[item] = val
    }
}

class StringCollection extends BaseCollection {
    private str: string = 'abcd'
    public addItem(newStr: string): string {
        return this.str += newStr
    }
    public getCount(): number {
        return this.str.length
    }
    public getItems(): string {
        return this.str
    }
}

const traverse = (title: string, Collection: { new(): CustomCollection }, callback?: (c: CustomCollection) => void) => {
    console.group(`遍历${ title }`)
    
    const collection = new Collection()

    if (callback && typeof callback === 'function') callback(collection)

    const iterator = collection.getIterator()
    console.log('Straight traversal')
    while (iterator.valid()) console.log(iterator.next())

    console.log('<<<------------------------------->>>')

    console.log('Reverse traversal')
    const iteratorReverse = collection.getReverseIterator()
    while (iteratorReverse.valid()) console.log(iteratorReverse.next())

    console.groupEnd()
}

console.group('迭代器模式')

const objectData = [ { key: '1', val: 'hel' }, { key: '2', val: 'hell' }, { key: '3', val: 'hello' } ]
const arrayData = [ 'First', 'Second', 'Third' ]

traverse('字符串', StringCollection)
traverse('对象', ObjectCollection, collection => objectData.forEach(({ key, val }) => collection.addItem(key, val)))
traverse('数组', ArrayCollection, collection => arrayData.forEach(item => collection.addItem(item)))

console.groupEnd()

type FlyweightInterface = { operation(uniqueState: any): void }
export class Flyweight implements FlyweightInterface {
    private sharedState: any
    public constructor(sharedState: any) {
        this.sharedState = sharedState
    }

    public operation(uniqueState: any): void {
        const s = JSON.stringify(this.sharedState)
        const u = JSON.stringify(uniqueState)
        console.log(`Flyweight: Displaying shared (${ s }) and unique (${ u }) state.`)
    }
}

class FlyweightFactory {
    private flyweights: { [ key: string ]: Flyweight } = {}
    public constructor(initialFlyweights: string[][]) {
        initialFlyweights.forEach(state => this.flyweights[this.getKey(state)] = new Flyweight(state))
    }
    
    private getKey(state: string[]): string {
        return state.join('_')
    }

    public getFlyweight(sharedState: string[]): Flyweight {
        const key = this.getKey(sharedState)
        if (!(key in this.flyweights)) {
            console.log('FlyweightFactory: Can\'t find a flyweight, creating new one.')
            this.flyweights[key] = new Flyweight(sharedState)
        } else console.log('FlyweightFactory: Reusing existing flyweight.')
        return this.flyweights[key]
    }

    public listFlyweights(): void {
        const count = Object.keys(this.flyweights).length
        console.log(`\nFlyweightFactory: I have ${ count } flyweights.`)
        for (const key in this.flyweights) console.log(key)
    }
}

const factory = new FlyweightFactory([
    [ 'Chevrolet', 'Camaro2018', 'pink' ],
    [ 'Mercedes Benz', 'C300', 'black' ],
    [ 'Mercedes Benz', 'C500', 'red' ],
    [ 'BMW', 'M5', 'red' ],
    [ 'BMW', 'X6', 'white' ]
])

factory.listFlyweights()

const addCarToPoliceDatabase = (ff: FlyweightFactory, plates: string, owner: string, brand: string, model: string, color: string) => {
    console.log('\nClient: Adding a car to database.')
    const flyweight = ff.getFlyweight([ brand, model, color ])
    flyweight.operation([ plates, owner ])
}

console.group('%c享元模式', 'color: yellow')
addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'M5', 'red')
addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'X1', 'red')

factory.listFlyweights()
console.groupEnd()

let examCarNum: number = 0
class ExamCar {
    public carId: number
    public carType: string
    public usingState: boolean

    public constructor(carType: number) {
        examCarNum++
        this.carId = examCarNum
        this.carType = !!carType ? '手动挡' : '自动挡'
        this.usingState = false
    }

    public examine(candidateId: number): Promise<void> {
        return new Promise<void>(resolve => {
            this.usingState = true
            console.log(`考生${ candidateId } 开始在${ this.carType }驾考车${ this.carId }上考试`)
            setTimeout(() => {
                this.usingState = false
                console.log(`%c考生${ candidateId } 在${ this.carType }驾考车${ this.carId }上考试完毕`, 'color: #f40')
                resolve()
            }, Math.random() * 2000)
        })
    }
}

class Queue<T> {
    private queue: T[] = []

    public enqueue(val: T) {
        this.queue[this.queue.length] = val
    }

    public dequeue(): null | T {
        if (this.isEmpty()) return null
        return this.queue.shift() as T
    }

    public size(): number {
        return this.queue.length
    }

    public isEmpty(): boolean {
        return this.queue.length === 0
    }
}

class ManualExamCarPool {
    private readonly _pool: ExamCar[] = []
    private readonly _candidateQueue: Queue<number> = new Queue()

    registerAllCandidates(candidateList: number[]): void {
        candidateList.forEach(candidateId => this.registerCandidate(candidateId))
    }

    registerCandidate(candidateId: number): void {
        const examCar = this.getManualExamCar()
        if (examCar) {
            examCar.examine(candidateId).then(() => {
                const nextCandidateId = this._candidateQueue.size() && this._candidateQueue.dequeue()
                nextCandidateId && this.registerCandidate(nextCandidateId)
            })
        } else this._candidateQueue.enqueue(candidateId)
    }

    initManualExamCar(manualExamCarNum: number): void {
        for (let i: number = 1; i <= manualExamCarNum; i++) this._pool.push(new ExamCar(i & 1))
    }

    getManualExamCar(): ExamCar {
        return this._pool.find(car => !car.usingState)!
    }
}

const manualExamCarPool = new ManualExamCarPool()
manualExamCarPool.initManualExamCar(3)
manualExamCarPool.registerAllCandidates([ 1, 2, 3 ])

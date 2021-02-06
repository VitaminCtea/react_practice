class Target {
    public request() {
        return 'Target: The default target\'s behavior.'
    }
}

class Adaptee {
    public specificRequest() {
        return '.eetpadA eht fo roivaheb laicepS'
    }
}

export class Adapter {
    public adapter: Adaptee
    public constructor(adapter: Adaptee) {
        this.adapter = adapter
    }

    public request() {
        const result = this.adapter.specificRequest().split('').reverse().join('')
        return `Adapter: (TRANSLATED) ${result}`
    }
}

const clientCode = (target: Target) => console.log(target.request())

console.group('%c适配器模式', 'color: pink')

console.log('Client: I can work just fine with the Target objects:')
const target = new Target()
clientCode(target)

console.log('<<<------------------------------->>>')

const adaptee = new Adaptee()
console.log('Client: The Adaptee class has a weird interface. See, I don\'t understand it:');
console.log(`Adaptee: ${ adaptee.specificRequest() }`)

console.log('<<<------------------------------->>>')

console.log('Client: But I can work with it via the Adapter:')
const adapter = new Adapter(adaptee)
clientCode(adapter)

console.groupEnd()

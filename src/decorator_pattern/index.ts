type Component = { operation(): string }

export class ConcreteComponent implements Component {
    public operation(): string {
        return 'ConcreteComponent'
    }
}

class Decorator implements Component {
    protected component: Component
    public constructor(component: Component) {
        this.component = component
    }
    public operation(): string {
        return this.component.operation()
    }
}

class ConcreteDecoratorA extends Decorator implements Component {
    public operation(): string {
        return `ConcreteDecoratorA(${ super.operation() })`
    }
}

class ConcreteDecoratorB extends Decorator implements Component {
    public operation(): string {
        return `ConcreteDecoratorB(${ super.operation() })`
    }
}

const client = (component: Component) => console.log(`Result: ${ component.operation() }`)
const simple = new ConcreteComponent()
console.group('%c装饰器模式', 'color: orange')
console.log('Client: I\'ve got a simple component')
client(simple)
console.log('<<<------------------------------->>>')

const decorator1 = new ConcreteDecoratorA(simple)
const decorator2 = new ConcreteDecoratorB(decorator1)
console.log('Client: Now I\'ve got a decorated component')
client(decorator2)
console.groupEnd()

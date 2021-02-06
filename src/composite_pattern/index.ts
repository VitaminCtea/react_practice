export abstract class Component {
    protected parent: Component | null = null

    public setParent(parent: Component) {
        this.parent = parent
    }

    public getParent(): Component | null {
        return this.parent
    }

    public add(component: Component): void {}
    public remove(component: Component): void {}
    public isComposite(): boolean { return false }

    public abstract operation(): string
}

class Leaf extends Component {
    public operation(): string {
        return 'leaf'
    }
}

class Composite extends Component {
    protected children: Component[] = []

    public add(component: Component): void {
        this.children.push(component)
        component.setParent(this)
    }

    public remove(component: Component): void {
        this.children.splice(this.children.indexOf(component), 1)
    }

    public isComposite(): boolean { return true }

    public operation(): string {
        return `Branch(${ this.children.map(component => component.operation()).join('+') })`
    }
}

const clientCode = (component: Component) => console.log(`RESULT: ${ component.operation() }`)
const clientCode2 = <T extends Component>(component1: T, component2: T) => {
    if (component1.isComposite()) component1.add(component2)
    console.log(`RESULT: ${ component1.operation() }`)
}

const simple = new Leaf()

console.group('%c组合模式', 'color: cornflowerBlue')
console.log('Client: I\'ve got a simple component')
clientCode(simple)

console.log('<<<------------------------------->>>')

const tree = new Composite()
const branch1 = new Composite()
branch1.add(new Leaf())
branch1.add(new Leaf())

const branch2 = new Composite()
branch2.add(new Leaf())

tree.add(branch1)
tree.add(branch2)
console.log('Client: Now I\'ve got a composite tree')
clientCode(tree)

console.log('<<<------------------------------->>>')

console.log('Client: I don\'t need to check the components classes even when managing the tree')
clientCode2(tree, simple)
console.log(tree)

console.groupEnd()

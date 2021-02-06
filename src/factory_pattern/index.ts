export abstract class Creator {
    public abstract factoryMethod(): Product
    public someOperation(): string {
        const product = this.factoryMethod()
        return `Creator: The same creator's code has just worked with ${ product.operation() }`
    }
}

type Product = { operation(): string }

const createConcreteProduct = (name: 'ConcreteProduct1' | 'ConcreteProduct2') => class implements Product {
    operation(): string {
        return `{ Result of the ${ name } }`
    }
}

const concreteCreator = (ConcreteProduct: { new (): Product }) => class extends Creator {
    public factoryMethod(): Product {
        return new ConcreteProduct()
    }
}

const ConcreteProduct1 = createConcreteProduct('ConcreteProduct1')
const ConcreteProduct2 = createConcreteProduct('ConcreteProduct2')

const ConcreteCreator1 = concreteCreator(ConcreteProduct1)
const ConcreteCreator2 = concreteCreator(ConcreteProduct2)

const clientCode = (creator: Creator) => {
    console.log('Client: I\'m not aware of the creator\'s class, but it still works.')
    console.log(creator.someOperation())
}

const factoryPattern = () => {
    console.log('App: Launched with the ConcreteCreator1.')
    clientCode(new ConcreteCreator1())
    console.log('<<<------------------------------->>>')

    console.log('App: launched with the ConcreteCreator2.')
    clientCode(new ConcreteCreator2())
    console.log('<<<------------------------------->>>')
}

factoryPattern()

type HouseholdFactory<T = string> = {
    createChair(): T
    createSofa(): T
    createCoffeeTable(): T
}

type StyleName = '现代' | '维多利亚' | '装饰风艺术'
const createFactory = (style: StyleName) => class Factory implements HouseholdFactory {
    public createChair() { 
        return `${ style }椅子`
    }

    public createSofa() { 
        return `${ style }沙发`
    }

    public createCoffeeTable() { 
        return `${ style }咖啡桌`
    }
}

const ModernFactory = createFactory('现代')
const VictorianFactory = createFactory('维多利亚')
const ArtDecoFactory = createFactory('装饰风艺术')

const application = (name: 'Modern' | 'Victorian' | 'ArtDeco', product: 'chair' | 'sofa' | 'coffeeTable') => {
    let factory: HouseholdFactory
    switch (name) {
        case 'Modern': factory = new ModernFactory(); break
        case 'Victorian': factory = new VictorianFactory(); break
        case 'ArtDeco': factory = new ArtDecoFactory(); break
        default: throw new Error('未知的家具产品.')
    }
    const productName = (factory as any)[`create${ product.charAt(0).toUpperCase() + product.substring(1) }`]()
    console.log(productName)
}

const runApplication = () => application('Victorian', 'coffeeTable')

runApplication()

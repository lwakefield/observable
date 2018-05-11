const Observable = require('./index.js')

test('can initialize Observable', () => {
    class Foo extends Observable { }

    const foo = new Foo()
    expect(foo).toBeDefined()
    expect(foo.bar).toBeUndefined()
    foo.bar = 'baz'
    expect(foo.bar).toEqual('baz')
})

test('uses __getattr__ works with no predefined props', () => {
    class Foo extends Observable {
        __getattr__ (prop) {
            return 'baz'
        }
    }

    const foo = new Foo()
    expect(foo.bar).toEqual('baz')
})

test('does not use __getattr__ works with predefined props', () => {
    class Foo extends Observable {
        __getattr__ (prop) { return 'baz' }
    }

    const foo = new Foo()
    foo.bar = 'qux'
    expect(foo.bar).toEqual('qux')
})

test('always uses __getattribute__', () => {
    class Foo extends Observable {
        __getattribute__ (prop) {
            return 'baz'
        }
    }

    const foo = new Foo()
    expect(foo.bar).toEqual('baz')

    foo.bar = 'qux'
    expect(foo.bar).toEqual('baz')
})

test('always uses __setattr__', () => {
    class Foo extends Observable {
        __setattr__ (prop, value) {
            this.__data[prop] = `baz-${value}`
            return true
        }
        __getattr__ (prop) {
            // lazily initialize __data
            if (typeof this.__data === 'undefined') {
                this.__data = {}
            }

            return prop === '__data' ? this.__data : this.__data[prop]
        }
    }

    const foo = new Foo()
    expect(foo.__data).toEqual({})
    expect(foo.bar).toBeUndefined()

    foo.bar = 'baz'
    expect(foo.bar).toEqual('baz-baz')
})

test('@observable', () => {
    const observable = Observable.decorator

    @observable
    class Foo {
        __getattribute__ (prop) {
            return 'baz'
        }
    }

    const foo = new Foo()
    expect(foo.bar).toEqual('baz')
})

function Observable () {
    const handlers = {
        set (obj, prop, val) {
            if ('__setattr__' in obj) {
                return obj.__setattr__(prop, val)
            }

            obj[prop] = val
        },
        get (obj, prop) {
            if ('__getattribute__' in obj) {
                return obj.__getattribute__(prop)
            }

            if (prop in obj) {
                return obj[prop]
            }

            if ('__getattr__' in obj) {
                return obj.__getattr__(prop)
            }

            return obj[prop]
        }
    }

    return new Proxy(this, handlers)
}

module.exports = Observable
module.exports.default = Observable
module.exports.decorator = function (Class) {
    return function (...args) {
        const instance = new Class(...args)
        return Observable.call(instance)
    }
}

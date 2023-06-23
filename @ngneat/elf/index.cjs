'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rxjs = require('rxjs');
var operators = require('rxjs/operators');

function createState(...propsFactories) {
  const result = {
    config: {},
    state: {}
  };

  for (const {
    config,
    props
  } of propsFactories) {
    Object.assign(result.config, config);
    Object.assign(result.state, props);
  }

  return result;
}

const batchInProgress = new rxjs.BehaviorSubject(false);
const batchDone$ = batchInProgress.asObservable().pipe(operators.filter(inProgress => !inProgress), operators.take(1));
function emitOnce(cb) {
  if (!batchInProgress.getValue()) {
    batchInProgress.next(true);
    const value = cb();
    batchInProgress.next(false);
    return value;
  }

  return cb();
}

// this is internal object that's not exported to public API
const elfHooksRegistry = {};

class ElfHooks {
  registerPreStoreUpdate(fn) {
    elfHooksRegistry.preStoreUpdate = fn;
  }

  registerPreStateInit(fn) {
    elfHooksRegistry.preStateInit = fn;
  }

}

const elfHooks = new ElfHooks();

const registry = new Map();
const registryActions = new rxjs.Subject();
const registry$ = registryActions.asObservable(); // @internal

function addStore(store) {
  registry.set(store.name, store);
  registryActions.next({
    type: 'add',
    store
  });
} // @internal

function removeStore(store) {
  registry.delete(store.name);
  registryActions.next({
    type: 'remove',
    store
  });
}
function getStore(name) {
  return registry.get(name);
}
function getRegistry() {
  return registry;
}
function getStoresSnapshot() {
  const stores = {};
  registry.forEach((store, key) => {
    stores[key] = store.getValue();
  });
  return stores;
}

class Store extends rxjs.BehaviorSubject {
  constructor(storeDef) {
    super(storeDef.state);
    this.storeDef = storeDef;
    this.batchInProgress = false;
    this.context = {
      config: this.getConfig()
    };
    this.state = this.getInitialState(storeDef.state);
    this.initialState = this.getValue();
    addStore(this);
  }

  get name() {
    return this.storeDef.name;
  }

  getInitialState(state) {
    if (elfHooksRegistry.preStateInit) {
      return elfHooksRegistry.preStateInit(state, this.name);
    }

    return state;
  }

  getConfig() {
    return this.storeDef.config;
  }

  query(selector) {
    return selector(this.getValue());
  }

  update(...reducers) {
    const currentState = this.getValue();
    let nextState = reducers.reduce((value, reducer) => {
      value = reducer(value, this.context);
      return value;
    }, currentState);

    if (elfHooksRegistry.preStoreUpdate) {
      nextState = elfHooksRegistry.preStoreUpdate(currentState, nextState, this.name);
    }

    if (nextState !== currentState) {
      this.state = nextState;

      if (batchInProgress.getValue()) {
        if (!this.batchInProgress) {
          this.batchInProgress = true;
          batchDone$.subscribe(() => {
            super.next(this.state);
            this.batchInProgress = false;
          });
        }
      } else {
        super.next(this.state);
      }
    }
  }

  getValue() {
    return this.state;
  }

  reset() {
    this.update(() => this.initialState);
  }

  combine(observables) {
    let hasChange = true;
    const buffer = {};
    return new rxjs.Observable(observer => {
      for (const [key, query] of Object.entries(observables)) {
        observer.add(query.subscribe(value => {
          buffer[key] = value;
          hasChange = true;
        }));
      }

      return this.subscribe({
        next() {
          if (hasChange) {
            observer.next(buffer);
            hasChange = false;
          }
        },

        error(e) {
          observer.error(e);
        },

        complete() {
          observer.complete();
        }

      });
    });
  }

  destroy() {
    removeStore(this);
    this.reset();
  }

  next(value) {
    this.update(() => value);
  } // eslint-disable-next-line @typescript-eslint/no-empty-function


  error() {} // eslint-disable-next-line @typescript-eslint/no-empty-function


  complete() {}

}

function createStore(storeConfig, ...propsFactories) {
  const {
    state,
    config
  } = createState(...propsFactories);
  const {
    name
  } = storeConfig;
  return new Store({
    name,
    state,
    config
  });
}

function coerceArray(value) {
  return Array.isArray(value) ? value : [value];
}
function isFunction(value) {
  return typeof value === 'function';
}
function isUndefined(value) {
  return value === undefined;
}
function isString(value) {
  return typeof value === 'string';
}
function capitalize(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}
function isObject(item) {
  return typeof item === 'object' && !Array.isArray(item) && item !== null;
}
function deepFreeze(o) {
  Object.freeze(o);
  const oIsFunction = typeof o === 'function';
  const hasOwnProp = Object.prototype.hasOwnProperty;
  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (hasOwnProp.call(o, prop) && (oIsFunction ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments' : true) && o[prop] !== null && (typeof o[prop] === 'object' || typeof o[prop] === 'function') && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });
  return o;
}

/**
 *
 * Update a root property of the state
 *
 * @example
 *
 * store.update(setProp('foo', 'bar'))
 *
 * @example
 *
 * store.update(setProp('count', count => count + 1))
 *
 */

function setProp(key, value) {
  return function (state) {
    return Object.assign({}, state, {
      [key]: isFunction(value) ? value(state[key]) : value
    });
  };
}
/**
 *
 * Update a root property of the state
 *
 * @example
 *
 * store.update(setProps({ count: 1, bar: 'baz'}))
 *
 * @example
 *
 * store.update(setProps(state => ({
 *   count: 1,
 *   nested: {
 *     ...state.nested,
 *     foo: 'bar'
 *   }
 * })))
 *
 */

function setProps(props) {
  return function (state) {
    return Object.assign({}, state, isFunction(props) ? props(state) : props);
  };
}

function select(mapFn) {
  return rxjs.pipe(operators.map(mapFn), operators.distinctUntilChanged());
}
function head() {
  return operators.map(arr => arr[0]);
}
function distinctUntilArrayItemChanged() {
  return operators.distinctUntilChanged((prevCollection, currentCollection) => {
    if (prevCollection === currentCollection) {
      return true;
    }

    if (prevCollection.length !== currentCollection.length) {
      return false;
    }

    const isOneOfItemReferenceChanged = currentCollection.some((item, i) => {
      return prevCollection[i] !== item;
    }); // return false means there is a change and we want to call next()

    return !isOneOfItemReferenceChanged;
  });
}
const asap = () => operators.debounceTime(0, rxjs.asapScheduler);
function filterNil() {
  return operators.filter(value => value !== null && value !== undefined);
}

function propsFactory(key, {
  initialValue: propsFactoryInitialValue,
  config
}) {
  let initialValue = propsFactoryInitialValue;
  const normalizedKey = capitalize(key);
  return {
    [`with${normalizedKey}`](value = initialValue) {
      return {
        props: {
          [key]: value
        },
        config
      };
    },

    [`set${normalizedKey}InitialValue`](value) {
      initialValue = value;
    },

    [`set${normalizedKey}`](value) {
      return function (state) {
        const newVal = isFunction(value) ? value(state) : value;

        if (newVal === state[key]) {
          return state;
        }

        return Object.assign({}, state, {
          [key]: newVal
        });
      };
    },

    [`update${normalizedKey}`](value) {
      return function (state) {
        const newVal = isFunction(value) ? value(state) : value;

        if (newVal === state[key]) {
          return state;
        }

        return Object.assign({}, state, {
          [key]: isObject(newVal) ? Object.assign({}, state[key], newVal) : newVal
        });
      };
    },

    [`reset${normalizedKey}`]() {
      return function (state) {
        return Object.assign({}, state, {
          [key]: initialValue
        });
      };
    },

    [`select${normalizedKey}`]() {
      return select(state => state[key]);
    },

    [`get${normalizedKey}`](state) {
      return state[key];
    }

  };
}

function propsArrayFactory(key, options) {
  const normalizedKey = capitalize(key);
  const base = propsFactory(key, options);
  return Object.assign({}, base, {
    [`add${normalizedKey}`](items) {
      return function (state) {
        return Object.assign({}, state, {
          [key]: arrayAdd(state[key], items)
        });
      };
    },

    [`remove${normalizedKey}`](items) {
      return function (state) {
        return Object.assign({}, state, {
          [key]: arrayRemove(state[key], items)
        });
      };
    },

    [`toggle${normalizedKey}`](items) {
      return function (state) {
        return Object.assign({}, state, {
          [key]: arrayToggle(state[key], items)
        });
      };
    },

    [`update${normalizedKey}`](predicateOrIds, obj) {
      return function (state) {
        return Object.assign({}, state, {
          [key]: arrayUpdate(state[key], predicateOrIds, obj)
        });
      };
    },

    [`in${normalizedKey}`](item) {
      return state => inArray(state[key], item);
    }

  });
}
function arrayAdd(arr, items) {
  return [...arr, ...coerceArray(items)];
}
function arrayRemove(arr, items) {
  const toArray = coerceArray(items);
  return arr.filter(current => !toArray.includes(current));
}
function arrayToggle(arr, items) {
  const toArray = coerceArray(items);
  const result = [...arr];
  toArray.forEach(item => {
    const i = result.indexOf(item);
    i > -1 ? result.splice(i, 1) : result.push(item);
  });
  return result;
}
function inArray(arr, item) {
  return arr.includes(item);
}
function arrayUpdate(arr, item, newItem) {
  return arr.map(current => {
    return current === item ? newItem : current;
  });
}

function withProps(props) {
  return {
    props,
    config: undefined
  };
}

let __DEV__ = true;
function enableElfProdMode() {
  __DEV__ = false;
} // @internal

function isDev() {
  return __DEV__;
}

exports.Store = Store;
exports.asap = asap;
exports.capitalize = capitalize;
exports.coerceArray = coerceArray;
exports.createState = createState;
exports.createStore = createStore;
exports.deepFreeze = deepFreeze;
exports.distinctUntilArrayItemChanged = distinctUntilArrayItemChanged;
exports.elfHooks = elfHooks;
exports.emitOnce = emitOnce;
exports.enableElfProdMode = enableElfProdMode;
exports.filterNil = filterNil;
exports.getRegistry = getRegistry;
exports.getStore = getStore;
exports.getStoresSnapshot = getStoresSnapshot;
exports.head = head;
exports.isDev = isDev;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isString = isString;
exports.isUndefined = isUndefined;
exports.propsArrayFactory = propsArrayFactory;
exports.propsFactory = propsFactory;
exports.registry$ = registry$;
exports.select = select;
exports.setProp = setProp;
exports.setProps = setProps;
exports.withProps = withProps;

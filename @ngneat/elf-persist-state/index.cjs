'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rxjs = require('rxjs');
var operators = require('rxjs/operators');

function persistState(store, options) {
  var _options$key;

  const defaultOptions = {
    source: store => store,
    preStoreInit: value => value,
    key: (_options$key = options.key) != null ? _options$key : `${store.name}@store`,

    runGuard() {
      return typeof window !== 'undefined';
    }

  };
  const merged = Object.assign({}, defaultOptions, options);

  if (!(merged.runGuard != null && merged.runGuard())) {
    return {
      initialized$: rxjs.of(false),

      unsubscribe() {//
      }

    };
  }

  const {
    storage
  } = options;
  const initialized = new rxjs.ReplaySubject(1);
  const loadFromStorageSubscription = rxjs.from(storage.getItem(merged.key)).subscribe(value => {
    if (value) {
      store.update(state => {
        return merged.preStoreInit(Object.assign({}, state, value));
      });
    }

    initialized.next(true);
    initialized.complete();
  });
  const saveToStorageSubscription = merged.source(store).pipe(operators.skip(1), operators.switchMap(value => storage.setItem(merged.key, value))).subscribe();
  return {
    initialized$: initialized.asObservable(),

    unsubscribe() {
      saveToStorageSubscription.unsubscribe();
      loadFromStorageSubscription.unsubscribe();
    }

  };
}

function createStorage(storage) {
  if (!storage) {
    return;
  }

  return {
    getItem(key) {
      const v = storage.getItem(key);
      return rxjs.of(v ? JSON.parse(v) : v);
    },

    setItem(key, value) {
      storage.setItem(key, JSON.stringify(value));
      return rxjs.of(true);
    },

    removeItem(key) {
      storage.removeItem(key);
      return rxjs.of(true);
    }

  };
} // we need to wrap the access to window.localStorage and window.sessionStorage in a try catch
// because localStorage can be disabled, or be denied by a security rule
// as soon as we access the property, it throws an error


const tryGetLocalStorage = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
  } catch (_unused) {// eslint-disable-next-line no-empty
  }

  return undefined;
};

const localStorageStrategy = createStorage(tryGetLocalStorage());

const tryGetSessionStorage = () => {
  try {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage;
    }
  } catch (_unused2) {// eslint-disable-next-line no-empty
  }

  return undefined;
};

const sessionStorageStrategy = createStorage(tryGetSessionStorage());

function excludeKeys(keys) {
  return rxjs.pipe(operators.map(state => {
    return Object.keys(state).reduce((toSave, key) => {
      if (!keys.includes(key)) {
        toSave[key] = state[key];
      }

      return toSave;
    }, {});
  }));
}

exports.excludeKeys = excludeKeys;
exports.localStorageStrategy = localStorageStrategy;
exports.persistState = persistState;
exports.sessionStorageStrategy = sessionStorageStrategy;

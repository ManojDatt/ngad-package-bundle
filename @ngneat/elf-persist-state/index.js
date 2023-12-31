import { of, ReplaySubject, from, pipe } from 'rxjs';
import { skip, switchMap, map } from 'rxjs/operators';

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
      initialized$: of(false),

      unsubscribe() {//
      }

    };
  }

  const {
    storage
  } = options;
  const initialized = new ReplaySubject(1);
  const loadFromStorageSubscription = from(storage.getItem(merged.key)).subscribe(value => {
    if (value) {
      store.update(state => {
        return merged.preStoreInit(Object.assign({}, state, value));
      });
    }

    initialized.next(true);
    initialized.complete();
  });
  const saveToStorageSubscription = merged.source(store).pipe(skip(1), switchMap(value => storage.setItem(merged.key, value))).subscribe();
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
      return of(v ? JSON.parse(v) : v);
    },

    setItem(key, value) {
      storage.setItem(key, JSON.stringify(value));
      return of(true);
    },

    removeItem(key) {
      storage.removeItem(key);
      return of(true);
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
  return pipe(map(state => {
    return Object.keys(state).reduce((toSave, key) => {
      if (!keys.includes(key)) {
        toSave[key] = state[key];
      }

      return toSave;
    }, {});
  }));
}

export { excludeKeys, localStorageStrategy, persistState, sessionStorageStrategy };

import { isFunction, capitalize, coerceArray, isDev, select, isUndefined, distinctUntilArrayItemChanged, propsFactory, propsArrayFactory } from '@ngneat/elf';
import { pipe } from 'rxjs';
import { map, distinctUntilChanged, switchMap } from 'rxjs/operators';

function buildEntities(entities, idKey) {
  const asObject = {};
  const ids = [];

  for (const entity of entities) {
    const id = entity[idKey];
    ids.push(id);
    asObject[id] = entity;
  }

  return {
    ids,
    asObject
  };
}
function findIdsByPredicate(state, ref, predicate) {
  const {
    idsKey,
    entitiesKey
  } = ref;
  const entities = state[entitiesKey];
  return state[idsKey].filter(id => predicate(entities[id]));
}
function findEntityByPredicate(state, ref, predicate) {
  const {
    idsKey,
    entitiesKey
  } = ref;
  const entities = state[entitiesKey];
  const id = state[idsKey].find(id => {
    return predicate(entities[id]);
  });
  return entities[id];
}
function checkPluck(entity, pluck) {
  if (entity && pluck) {
    return isFunction(pluck) ? pluck(entity) : entity[pluck];
  } else {
    return entity;
  }
}

function getIdKey(context, ref) {
  return context.config[ref.idKeyRef];
}
class EntitiesRef {
  constructor(config) {
    this.idKeyRef = 'idKey';
    this.entitiesKey = config.entitiesKey;
    this.idsKey = config.idsKey;
    this.idKeyRef = config.idKeyRef;
  }

}
function entitiesPropsFactory(feature) {
  const idKeyRef = feature ? `idKey${capitalize(feature)}` : 'idKey';
  const ref = new EntitiesRef({
    entitiesKey: feature ? `${feature}Entities` : 'entities',
    idsKey: feature ? `${feature}Ids` : 'ids',
    idKeyRef: idKeyRef
  });

  function propsFactory(config) {
    let entities = {};
    let ids = [];
    const idKey = (config == null ? void 0 : config.idKey) || 'id';

    if (config != null && config.initialValue) {
      ({
        ids,
        asObject: entities
      } = buildEntities(config.initialValue, idKey));
    }

    return {
      props: {
        [ref.entitiesKey]: entities,
        [ref.idsKey]: ids
      },
      config: {
        [idKeyRef]: idKey
      }
    };
  }

  return {
    [`${feature}EntitiesRef`]: ref,
    [`with${capitalize(feature)}Entities`]: propsFactory
  };
}
const {
  withEntities,
  EntitiesRef: defaultEntitiesRef
} = entitiesPropsFactory('');
const {
  UIEntitiesRef,
  withUIEntities
} = entitiesPropsFactory('UI');

/**
 *
 * Remove entities
 *
 * @example
 *
 * store.update(deleteEntities(1))
 *
 * store.update(deleteEntities([1, 2, 3])
 *
 */

function deleteEntities(ids, options = {}) {
  return function (state) {
    const {
      ref: {
        idsKey,
        entitiesKey
      } = defaultEntitiesRef
    } = options;
    const idsToRemove = coerceArray(ids);
    const newEntities = Object.assign({}, state[entitiesKey]);
    const newIds = state[idsKey].filter(id => !idsToRemove.includes(id));

    for (const id of idsToRemove) {
      Reflect.deleteProperty(newEntities, id);
    }

    return Object.assign({}, state, {
      [entitiesKey]: newEntities,
      [idsKey]: newIds
    });
  };
}
/**
 *
 * Remove entities by predicate
 *
 * @example
 *
 * store.update(deleteEntitiesByPredicate(entity => entity.count === 0))
 *
 */

function deleteEntitiesByPredicate(predicate, options = {}) {
  return function reducer(state, context) {
    const ids = findIdsByPredicate(state, options.ref || defaultEntitiesRef, predicate);

    if (ids.length) {
      return deleteEntities(ids, options)(state, context);
    }

    return state;
  };
}
/**
 *
 * Remove all entities
 *
 * @example
 *
 * store.update(deleteAllEntities())
 *
 */

function deleteAllEntities(options = {}) {
  return function reducer(state) {
    const {
      ref: {
        idsKey,
        entitiesKey
      } = defaultEntitiesRef
    } = options;
    return Object.assign({}, state, {
      [entitiesKey]: {},
      [idsKey]: []
    });
  };
}

/**
 *
 * Add entities
 *
 * @example
 *
 * store.update(addEntities(entity))
 *
 * store.update(addEntities([entity, entity]))
 *
 * store.update(addEntities([entity, entity]), { prepend: true })
 *
 */

function addEntities(entities, options = {}) {
  return function (state, context) {
    const {
      prepend = false,
      ref = defaultEntitiesRef
    } = options;
    const {
      entitiesKey,
      idsKey
    } = ref;
    const idKey = getIdKey(context, ref);
    const asArray = coerceArray(entities);
    if (!asArray.length) return state;

    if (isDev()) {
      throwIfEntityExists(asArray, idKey, state, entitiesKey);
      throwIfDuplicateIdKey(asArray, idKey);
    }

    const {
      ids,
      asObject
    } = buildEntities(asArray, idKey);
    return Object.assign({}, state, {
      [entitiesKey]: Object.assign({}, state[entitiesKey], asObject),
      [idsKey]: prepend ? [...ids, ...state[idsKey]] : [...state[idsKey], ...ids]
    });
  };
}
/**
 *
 * Add entities using fifo
 *
 * @example
 *
 *
 * store.update(addEntitiesFifo([entity, entity]), { limit: 3 })
 *
 */

function addEntitiesFifo(entities, options) {
  return function (state, context) {
    const {
      ref = defaultEntitiesRef,
      limit
    } = options;
    const {
      entitiesKey,
      idsKey
    } = ref;
    const currentIds = state[idsKey];
    let normalizedEntities = coerceArray(entities);
    let newState = state;

    if (normalizedEntities.length > limit) {
      // Remove new entities that pass the limit
      normalizedEntities = normalizedEntities.slice(normalizedEntities.length - limit);
    }

    const total = currentIds.length + normalizedEntities.length; // Remove exiting entities that passes the limit

    if (total > limit) {
      const idsRemove = currentIds.slice(0, total - limit);
      newState = deleteEntities(idsRemove)(state, context);
    }

    const {
      ids,
      asObject
    } = buildEntities(normalizedEntities, getIdKey(context, ref));
    return Object.assign({}, state, {
      [entitiesKey]: Object.assign({}, newState[entitiesKey], asObject),
      [idsKey]: [...newState[idsKey], ...ids]
    });
  };
}

function throwIfEntityExists(entities, idKey, state, entitiesKey) {
  entities.forEach(entity => {
    const id = entity[idKey];

    if (state[entitiesKey][id]) {
      throw Error(`Entity already exists. ${idKey} ${id}`);
    }
  });
}

function throwIfDuplicateIdKey(entities, idKey) {
  const check = new Set();
  entities.forEach(entity => {
    const id = entity[idKey];

    if (check.has(id)) {
      throw Error(`Duplicate entity id provided. ${idKey} ${id}`);
    }

    check.add(id);
  });
}

/**
 *
 * Set entities
 *
 * @example
 *
 * store.update(setEntities([entity, entity]))
 *
 */

function setEntities(entities, options = {}) {
  return function (state, context) {
    const {
      ref = defaultEntitiesRef
    } = options;
    const {
      entitiesKey,
      idsKey
    } = ref;
    const {
      ids,
      asObject
    } = buildEntities(entities, getIdKey(context, ref));
    return Object.assign({}, state, {
      [entitiesKey]: asObject,
      [idsKey]: ids
    });
  };
}
function setEntitiesMap(entities, options = {}) {
  return setEntities(Object.values(entities), options);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

/**
 *
 * Get the entities collection
 *
 * @example
 *
 * store.query(getAllEntities())
 *
 */

function getAllEntities(options = {}) {
  const {
    ref: {
      entitiesKey,
      idsKey
    } = defaultEntitiesRef
  } = options;
  return function (state) {
    return state[idsKey].map(id => state[entitiesKey][id]);
  };
}
/**
 *
 * Get the entities and apply filter/map
 *
 * @example
 *
 * store.query(getAllEntitiesApply())
 *
 */

function getAllEntitiesApply(options) {
  const {
    ref: {
      entitiesKey,
      idsKey
    } = defaultEntitiesRef,
    filterEntity = () => true,
    mapEntity = e => e
  } = options;
  return function (state) {
    const result = [];

    for (const id of state[idsKey]) {
      const entity = state[entitiesKey][id];

      if (filterEntity(entity)) {
        result.push(mapEntity(entity));
      }
    }

    return result;
  };
}
/**
 *
 * Get an entity
 *
 * @example
 *
 * store.query(getEntity(1))
 *
 */

function getEntity$1(id, options = {}) {
  return function (state) {
    const {
      ref: {
        entitiesKey
      } = defaultEntitiesRef
    } = options;
    return state[entitiesKey][id];
  };
}
/**
 *
 * Check whether the entity exist
 *
 * @example
 *
 * store.query(hasEntity(1))
 *
 */

function hasEntity(id, options = {}) {
  return function (state) {
    const {
      ref: {
        entitiesKey
      } = defaultEntitiesRef
    } = options;
    return Reflect.has(state[entitiesKey], id);
  };
}
/**
 *
 * Get the entities ids
 *
 * @example
 *
 * store.query(getEntitiesIds())
 *
 */

function getEntitiesIds(options = {}) {
  return function (state) {
    const {
      ref: {
        idsKey
      } = defaultEntitiesRef
    } = options;
    return state[idsKey];
  };
}

const _excluded = ["updater", "creator"];

function toModel(updater, entity) {
  if (isFunction(updater)) {
    return updater(entity);
  }

  return Object.assign({}, entity, updater);
}
/**
 *
 * Update entities
 *
 * @example
 *
 * store.update(updateEntities(id, { name }))
 * store.update(updateEntities(id, entity => ({ ...entity, name })))
 * store.update(updateEntities([id, id, id], { open: true }))
 *
 */


function updateEntities(ids, updater, options = {}) {
  return function (state) {
    const {
      ref: {
        entitiesKey
      } = defaultEntitiesRef
    } = options;
    const updatedEntities = {};

    for (const id of coerceArray(ids)) {
      updatedEntities[id] = toModel(updater, state[entitiesKey][id]);
    }

    return Object.assign({}, state, {
      [entitiesKey]: Object.assign({}, state[entitiesKey], updatedEntities)
    });
  };
}
/**
 *
 * Update entities by predicate
 *
 * @example
 *
 * store.update(updateEntitiesByPredicate(entity => entity.count === 0))
 *
 */

function updateEntitiesByPredicate(predicate, updater, options = {}) {
  return function (state, context) {
    const ids = findIdsByPredicate(state, options.ref || defaultEntitiesRef, predicate);

    if (ids.length) {
      return updateEntities(ids, updater, options)(state, context);
    }

    return state;
  };
}
/**
 *
 * Update all entities
 *
 * @example
 *
 * store.update(updateAllEntities({ name }))
 * store.update(updateAllEntities(entity => ({ ...entity, name })))
 *
 */

function updateAllEntities(updater, options = {}) {
  return function (state, context) {
    const {
      ref: {
        idsKey
      } = defaultEntitiesRef
    } = options;
    return updateEntities(state[idsKey], updater, options)(state, context);
  };
}
/**
 *
 * Update entities that exists, add those who don't
 *
 * @example
 *
 */

function upsertEntitiesById(ids, _ref) {
  let {
    updater,
    creator
  } = _ref,
      options = _objectWithoutPropertiesLoose(_ref, _excluded);

  return function (state, context) {
    const updatedEntitiesIds = [];
    const newEntities = [];
    const asArray = coerceArray(ids);
    if (!asArray.length) return state;

    for (const id of asArray) {
      if (hasEntity(id, options)(state)) {
        updatedEntitiesIds.push(id);
      } else {
        let newEntity = creator(id);

        if (options.mergeUpdaterWithCreator) {
          newEntity = toModel(updater, newEntity);
        }

        newEntities.push(newEntity);
      }
    }

    const newState = updateEntities(updatedEntitiesIds, updater, options)(state, context);
    return addEntities(newEntities, options)(newState, context);
  };
}
/**
 *
 * Merge entities that exists, add those who don't
 * Make sure all entities have an id
 *
 * @example
 *
 * // single entity
 * store.update(upsertEntities({ id: 1, completed: true }))
 *
 * // or multiple entities
 * store.update(upsertEntities([{ id: 1, completed: true }, { id: 2, completed: true }]))
 *
 * // or using a custom ref
 * store.update(upsertEntities([{ id: 1, open: true }], { ref: UIEntitiesRef }))
 *
 */

function upsertEntities(entities, options = {}) {
  return function (state, context) {
    const {
      prepend = false,
      ref = defaultEntitiesRef
    } = options;
    const {
      entitiesKey,
      idsKey
    } = ref;
    const idKey = getIdKey(context, ref);
    const asObject = {};
    const ids = [];
    const entitiesArray = coerceArray(entities);

    if (!entitiesArray.length) {
      return state;
    }

    for (const entity of entitiesArray) {
      const id = entity[idKey]; // if entity exists, merge update, else add

      if (hasEntity(id, options)(state)) {
        asObject[id] = Object.assign({}, state[entitiesKey][id], entity);
      } else {
        ids.push(id);
        asObject[id] = entity;
      }
    }

    const updatedIds = !ids.length ? {} : {
      [idsKey]: prepend ? [...ids, ...state[idsKey]] : [...state[idsKey], ...ids]
    };
    return Object.assign({}, state, updatedIds, {
      [entitiesKey]: Object.assign({}, state[entitiesKey], asObject)
    });
  };
}
/**
 * Update entities ids
 *
 * @example
 *
 * // Update a single entity id
 * store.update(updateEntitiesIds(1, 2));
 *
 * // Update multiple entities ids
 * store.update(updateEntitiesIds([1, 2], [10, 20]));
 *
 * // Update entity id using a custom ref
 * store.update(updateEntitiesIds(1, 2, { ref: UIEntitiesRef }));
 *
 */

function updateEntitiesIds(oldId, newId, options = {}) {
  return function (state, context) {
    const oldIds = coerceArray(oldId);
    const newIds = coerceArray(newId);

    if (oldIds.length !== newIds.length) {
      throw new Error('The number of old and new ids must be equal');
    }

    const {
      ref = defaultEntitiesRef
    } = options;
    const idProp = getIdKey(context, ref);
    const updatedEntities = Object.assign({}, state[ref.entitiesKey]);

    for (let i = 0; i < oldIds.length; i++) {
      const oldVal = oldIds[i];
      const newVal = newIds[i];

      if (state[ref.entitiesKey][newVal]) {
        throw new Error(`Updating id "${oldVal}". The new id "${newVal}" already exists`);
      }

      const oldEntity = state[ref.entitiesKey][oldVal];
      const updated = Object.assign({}, oldEntity, {
        [idProp]: newVal
      });
      updatedEntities[newVal] = updated;
      Reflect.deleteProperty(updatedEntities, oldVal);
    }

    const updatedStateIds = state[ref.idsKey].slice();
    let processedIds = 0;

    for (let i = 0; i < updatedStateIds.length; i++) {
      const currentId = updatedStateIds[i];

      for (let j = 0; j < oldIds.length; j++) {
        const oldVal = oldIds[j];
        const newVal = newIds[j];

        if (currentId === oldVal) {
          updatedStateIds[i] = newVal;
          processedIds++;
          break;
        }
      }

      if (processedIds === oldIds.length) {
        break;
      }
    }

    return Object.assign({}, state, {
      [ref.entitiesKey]: updatedEntities,
      [ref.idsKey]: updatedStateIds
    });
  };
}

/**
 *
 * Move entity
 *
 * @example
 *
 * store.update(moveEntity({ fromIndex: 2, toIndex: 3}))
 *
 */

function moveEntity(options) {
  return function (state) {
    const {
      fromIndex,
      toIndex,
      ref: {
        idsKey,
        entitiesKey
      } = defaultEntitiesRef
    } = options;
    const ids = state[idsKey].slice();
    ids.splice(toIndex < 0 ? ids.length + toIndex : toIndex, 0, ids.splice(fromIndex, 1)[0]);
    return Object.assign({}, state, {
      [entitiesKey]: Object.assign({}, state[entitiesKey]),
      [idsKey]: ids
    });
  };
}

function untilEntitiesChanges(key) {
  return distinctUntilChanged((prev, current) => {
    return prev[key] === current[key];
  });
}
/**
 *
 * Observe entities
 *
 * @example
 *
 * store.pipe(selectAllEntities())
 *
 * store.pipe(selectAllEntities({ ref: UIEntitiesRef }))
 *
 */

function selectAllEntities(options = {}) {
  const {
    ref: {
      entitiesKey,
      idsKey
    } = defaultEntitiesRef
  } = options;
  return pipe(untilEntitiesChanges(entitiesKey), map(state => state[idsKey].map(id => state[entitiesKey][id])));
}
/**
 *
 * Observe entities object
 *
 * @example
 *
 * store.pipe(selectEntities())
 *
 * store.pipe(selectEntities({ ref: UIEntitiesRef }))
 *
 */

function selectEntities(options = {}) {
  const {
    ref: {
      entitiesKey
    } = defaultEntitiesRef
  } = options;
  return select(state => state[entitiesKey]);
}
/**
 *
 * Observe entities and apply filter/map
 *
 * @example
 *
 * store.pipe(selectAllEntitiesApply({
 *   map: (entity) => new Todo(entity),
 *   filter: entity => entity.completed
 * }))
 *
 *
 */

function selectAllEntitiesApply(options) {
  const {
    ref: {
      entitiesKey,
      idsKey
    } = defaultEntitiesRef,
    filterEntity = () => true,
    mapEntity = e => e
  } = options;
  return pipe(untilEntitiesChanges(entitiesKey), map(state => {
    const result = [];

    for (const id of state[idsKey]) {
      const entity = state[entitiesKey][id];

      if (filterEntity(entity)) {
        result.push(mapEntity(entity));
      }
    }

    return result;
  }));
}

function selectEntity(id, options = {}) {
  const {
    ref: {
      entitiesKey
    } = defaultEntitiesRef,
    pluck
  } = options;
  return pipe(untilEntitiesChanges(entitiesKey), select(state => getEntity(state[entitiesKey], id, pluck)));
}
function getEntity(entities, id, pluck) {
  const entity = entities[id];

  if (isUndefined(entity)) {
    return undefined;
  }

  if (!pluck) {
    return entity;
  }

  return checkPluck(entity, pluck);
}
function selectEntityByPredicate(predicate, options) {
  const {
    ref = defaultEntitiesRef,
    pluck,
    idKey = 'id'
  } = options || {};
  const {
    entitiesKey
  } = ref;
  let id;
  return pipe(select(state => {
    if (isUndefined(id)) {
      const entity = findEntityByPredicate(state, ref, predicate);
      id = entity && entity[idKey];
    }

    return state[entitiesKey][id];
  }), map(entity => entity ? checkPluck(entity, pluck) : undefined), distinctUntilChanged());
}

/**
 *
 * Observe the first entity
 *
 * @example
 *
 * store.pipe(selectFirst())
 *
 */

function selectFirst(options = {}) {
  const {
    ref: {
      entitiesKey,
      idsKey
    } = defaultEntitiesRef
  } = options;
  return select(state => state[entitiesKey][state[idsKey][0]]);
}

/**
 *
 * Observe the last entity
 *
 * @example
 *
 * store.pipe(selectLast())
 *
 */

function selectLast(options = {}) {
  const {
    ref: {
      entitiesKey,
      idsKey
    } = defaultEntitiesRef
  } = options;
  return select(state => state[entitiesKey][state[idsKey][state[idsKey].length - 1]]);
}

function selectMany(ids, options = {}) {
  const {
    ref: {
      entitiesKey
    } = defaultEntitiesRef,
    pluck
  } = options;
  return pipe(select(state => state[entitiesKey]), map(entities => {
    if (!ids.length) return [];
    const filtered = [];

    for (const id of ids) {
      const entity = getEntity(entities, id, pluck);
      if (!isUndefined(entity)) filtered.push(entity);
    }

    return filtered;
  }), distinctUntilArrayItemChanged());
}
function selectManyByPredicate(predicate, options) {
  const {
    ref: {
      entitiesKey,
      idsKey
    } = defaultEntitiesRef,
    pluck
  } = options || {};
  return pipe(untilEntitiesChanges(entitiesKey), select(state => {
    const filteredEntities = [];
    state[idsKey].forEach((id, index) => {
      const entity = state[entitiesKey][id];

      if (predicate(entity, index)) {
        filteredEntities.push(checkPluck(entity, pluck));
      }
    });
    return filteredEntities;
  }), distinctUntilArrayItemChanged());
}

/**
 *
 * Observe the entities collection size
 *
 * @example
 *
 * store.pipe(selectEntitiesCount())
 *
 */

function selectEntitiesCount(options = {}) {
  const {
    ref: {
      idsKey
    } = defaultEntitiesRef
  } = options;
  return select(state => state[idsKey].length);
}
/**
 *
 * Observe the entities collection size  that pass the predicate
 *
 * @example
 *
 * store.pipe(selectEntitiesCountByPredicate(entity => entity.completed))
 *
 */

function selectEntitiesCountByPredicate(predicate, options = {}) {
  const ref = options.ref || defaultEntitiesRef;
  return pipe(untilEntitiesChanges(ref.entitiesKey), map(state => findIdsByPredicate(state, ref, predicate).length), distinctUntilChanged());
}
/**
 *
 * Return the entities collection size
 *
 * @example
 *
 * store.query(getEntitiesCount())
 *
 */

function getEntitiesCount(options = {}) {
  return function (state) {
    const {
      ref: {
        idsKey
      } = defaultEntitiesRef
    } = options;
    return state[idsKey].length;
  };
}
/**
 *
 * Return the entities collection size that pass the predicate
 *
 * @example
 *
 * store.query(getEntitiesCountByPredicate(entity => entity.completed))
 *
 */

function getEntitiesCountByPredicate(predicate, options = {}) {
  return function (state) {
    const ref = options.ref || defaultEntitiesRef;
    return findIdsByPredicate(state, ref, predicate).length;
  };
}

function unionEntities(idKey = 'id') {
  return map(state => {
    return state.entities.map(entity => {
      return Object.assign({}, entity, state.UIEntities[entity[idKey]]);
    });
  });
}

function unionEntitiesAsMap(idKey = 'id') {
  return map(state => {
    return Object.fromEntries(state.entities.map(entity => {
      return [entity[idKey], Object.assign({}, entity, state.UIEntities[entity[idKey]])];
    }));
  });
}

const {
  selectActiveId,
  setActiveId,
  withActiveId,
  resetActiveId,
  getActiveId
} = propsFactory('activeId', {
  initialValue: undefined
});
function selectActiveEntity(options = {}) {
  const {
    ref = defaultEntitiesRef
  } = options;
  return function (source) {
    return source.pipe(selectActiveId()).pipe(switchMap(id => source.pipe(selectEntity(id, {
      ref
    }))));
  };
}
function getActiveEntity(options = {}) {
  const {
    ref: {
      entitiesKey
    } = defaultEntitiesRef
  } = options;
  return function (state) {
    return state[entitiesKey][getActiveId(state)];
  };
}
const {
  setActiveIds,
  resetActiveIds,
  withActiveIds,
  selectActiveIds,
  toggleActiveIds,
  removeActiveIds,
  addActiveIds,
  getActiveIds
} = propsArrayFactory('activeIds', {
  initialValue: []
});
function selectActiveEntities(options = {}) {
  const {
    ref = defaultEntitiesRef
  } = options;
  return function (source) {
    return source.pipe(selectActiveIds()).pipe(switchMap(ids => source.pipe(selectMany(ids, {
      ref
    }))));
  };
}
function getActiveEntities(options = {}) {
  const {
    ref: {
      entitiesKey
    } = defaultEntitiesRef
  } = options;
  return function (state) {
    const result = [];

    for (const id of getActiveIds(state)) {
      const entity = state[entitiesKey][id];

      if (entity) {
        result.push(entity);
      }
    }

    return result;
  };
}

export { EntitiesRef, UIEntitiesRef, addActiveIds, addEntities, addEntitiesFifo, deleteAllEntities, deleteEntities, deleteEntitiesByPredicate, entitiesPropsFactory, getActiveEntities, getActiveEntity, getActiveId, getActiveIds, getAllEntities, getAllEntitiesApply, getEntitiesCount, getEntitiesCountByPredicate, getEntitiesIds, getEntity$1 as getEntity, hasEntity, moveEntity, removeActiveIds, resetActiveId, resetActiveIds, selectActiveEntities, selectActiveEntity, selectActiveId, selectActiveIds, selectAllEntities, selectAllEntitiesApply, selectEntities, selectEntitiesCount, selectEntitiesCountByPredicate, selectEntity, selectEntityByPredicate, selectFirst, selectLast, selectMany, selectManyByPredicate, setActiveId, setActiveIds, setEntities, setEntitiesMap, toggleActiveIds, unionEntities, unionEntitiesAsMap, updateAllEntities, updateEntities, updateEntitiesByPredicate, updateEntitiesIds, upsertEntities, upsertEntitiesById, withActiveId, withActiveIds, withEntities, withUIEntities };

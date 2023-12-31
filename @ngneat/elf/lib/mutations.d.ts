import { Reducer } from './store';
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
export declare function setProp<S extends Record<string, any>, K extends keyof S>(key: K, value: S[K] | ((current: S[K]) => S[K])): Reducer<S>;
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
export declare function setProps<S extends Record<string, any>, V extends Partial<S>>(props: V | ((state: S) => V)): Reducer<S>;

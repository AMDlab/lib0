export function create(): Map<any, any>;
export function copy<X, Y>(m: Map<X, Y>): Map<X, Y>;
export function setIfUndefined<V, K, MAP extends Map<K, V>>(map: MAP, key: K, createT: () => V): V;
export function map<K, V, R>(m: Map<K, V>, f: (arg0: V, arg1: K) => R): R[];
export function any<K, V>(m: Map<K, V>, f: (arg0: V, arg1: K) => boolean): boolean;
export function all<K, V>(m: Map<K, V>, f: (arg0: V, arg1: K) => boolean): boolean;
//# sourceMappingURL=map.d.ts.map
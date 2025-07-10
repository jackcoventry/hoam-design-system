/**
 * Groups the elements of an array based on the result of a key-generating function.
 *
 * @template T - The type of elements in the input array.
 * @template K - The type of keys returned by the keyGetter function.
 * @param list - The array of items to group.
 * @param keyGetter - A function that takes an item and returns its grouping key.
 * @returns A Map where each key is a grouping key and the value is an array of items with that key.
 *
 * @example
 * const data = [{type: 'a', value: 1}, {type: 'b', value: 2}, {type: 'a', value: 3}];
 * const grouped = groupBy(data, item => item.type);
 * // grouped is Map { 'a' => [{type: 'a', value: 1}, {type: 'a', value: 3}], 'b' => [{type: 'b', value: 2}] }
 */

function groupBy<T, K>(list: T[], keyGetter: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export default groupBy;

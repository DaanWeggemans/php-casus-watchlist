export type ObjectArray<TKey extends string | number, TValue> = {
    [key in TKey]: TValue
}
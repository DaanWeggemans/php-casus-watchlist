export function updateArray<TValue extends { id: string, index: number }>(value: TValue, array: TValue[]) {
    const old_value = array.find(x => x.id == value.id);
    if (!old_value) return array;

    return array.map((item: TValue) => {
        if (item.id == value.id)
            return { ...value };

        if (old_value.index > value.index && item.index >= value.index && item.index < old_value.index)
            return { ...item, index: item.index + 1 };

        if (old_value.index < value.index && item.index > old_value.index && item.index <= value.index)
            return { ...item, index: item.index - 1 };

        return item;
    });
}
export function updateArray<TValue extends { id: string, index: number }>(value: TValue | undefined, array: TValue[]) {
    const old_value = array.find(x => x.id == value?.id);
    if (!value || !old_value) return array.sort((a: TValue, b: TValue) => a.index - b.index).map((item: TValue, index: number) => ({
        ...item,
        index: index + 1
    }));

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
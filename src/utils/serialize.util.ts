

export const serializeMany = <T extends { id: bigint }>(items: T[]) => {
    return items.map((item) => ({
        ...item,
        id: String(item.id)
    }));
};

export const serializeOne = <T extends {id: bigint}>(item: T) => ({
    ...item,
    id: String(item.id)
});
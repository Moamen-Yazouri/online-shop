
type WithId = { id: bigint };
type WithMerchantId = { id: bigint; merchantId: bigint | null };

export const serializeMany = <T extends WithId | WithMerchantId>(items: T[]) => {
    return items.map((item) => (
        'merchantId' in item && item.merchantId
        ?   {
                ...item,
                id: String(item.id),
                merchantId: String(item.merchantId)
        }
        :   {
            ...item,
            id: String(item.id)
        }
    ));
};

export const serializeOne = <T extends WithId | WithMerchantId>(item: T) => (        
        'merchantId' in item && item.merchantId
        ?   {
                ...item,
                id: String(item.id),
                merchantId: String(item.merchantId)
        }
        :   {
            ...item,
            id: String(item.id)
    });
const findIncluded = (id, type, included, depth) => {
    const data = included.find(i => i.id === id && i.type === type);
    // eslint-disable-next-line no-use-before-define
    return data ? normalize(data, included, depth) : {};
};

const normalizeRelationships = (relationships, included, depth) => {
    if(depth == 0){
        return relationships;
    }
    depth--;

    const flattenedRelationships = Object.entries(relationships)
        .filter(([, value]) => value && value.data)
        .map(([propertyName, value]) => {
            const isArray = Array.isArray(value.data);
            return {
                [propertyName]: isArray
                    ? value.data.map(d => ({
                        ...d,
                        ...findIncluded(d.id, d.type, included, depth)
                    }))
                    : {
                        id: value.data.id,
                        type: value.data.type,
                        ...findIncluded(value.data.id, value.data.type, included, depth)
                    }
            };
        })
        .reduce((acc, current) => {
            return { ...acc, ...current };
        }, {});

    return flattenedRelationships;
};

const normalize = (data = {}, included = [], depth) => {
    const { id, type, attributes = {}, relationships = {} } = data;

    const normalizedAttributes = { id, type, ...attributes };

    const normalizedRelationships = normalizeRelationships(
        relationships,
        included,
        depth
    );

    return {
        ...normalizedAttributes,
        ...normalizedRelationships
    };
};

const normalizeResponse = ({ data, included = [], meta = {} }, depth = 10) => {
    if (Array.isArray(data)) {
        return {
            data: data.map(d => normalize(d, included, depth)),
            ...meta
        };
    }

    return {
        ...normalize(data, included, depth),
        ...meta
    };
};

export default normalizeResponse;

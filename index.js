const findIncluded = (id, type, included) => {
    const data = included.find(i => i.id === id && i.type === type);
    // eslint-disable-next-line no-use-before-define
    return data ? normalize(data, included) : {};
};

const normalizeRelationships = (relationships, included) => {
    const flattenedRelationships = Object.entries(relationships)
        .filter(([, value]) => value && value.data)
        .map(([propertyName, value]) => {
            const isArray = Array.isArray(value.data);
            return {
                [propertyName]: isArray
                    ? value.data.map(d => ({
                        ...d,
                        ...findIncluded(d.id, d.type, included)
                    }))
                    : {
                        id: value.data.id,
                        type: value.data.type,
                        ...findIncluded(value.data.id, value.data.type, included)
                    }
            };
        })
        .reduce((acc, current) => {
            return { ...acc, ...current };
        }, {});

    return flattenedRelationships;
};

const normalize = (data = {}, included = []) => {
    const { id, type, attributes = {}, relationships = {} } = data;

    const normalizedAttributes = { id, type, ...attributes };

    const normalizedRelationships = normalizeRelationships(
        relationships,
        included
    );

    return {
        ...normalizedAttributes,
        ...normalizedRelationships
    };
};

const normalizeResponse = ({ data, included = [], meta = {} }) => {
    if (Array.isArray(data)) {
        return {
            data: data.map(d => normalize(d, included)),
            ...meta
        };
    }

    return {
        ...normalize(data, included),
        ...meta
    };
};

module.exports = normalizeResponse;

let normalizeResponse = require("./");

describe("jsonApiNormalizer", () => {
  it("maps id and type", () => {
    const { id, type } = normalizeResponse({
      data: {
        id: 123,
        type: "obj"
      }
    });

    expect(id).toBe(123);
    expect(type).toBe("obj");
  });

  it("maps attributes", () => {
    const { attribute1, attribute2 } = normalizeResponse({
      data: {
        attributes: {
          attribute1: 123,
          attribute2: 321
        }
      }
    });

    expect(attribute1).toBe(123);
    expect(attribute2).toBe(321);
  });

  it("maps relationships", () => {
    const { relationship1 } = normalizeResponse({
      data: {
        relationships: {
          relationship1: {
            data: {
              id: 123,
              type: "relationship_type"
            }
          }
        }
      }
    });

    expect(relationship1.id).toBe(123);
    expect(relationship1.type).toBe("relationship_type");
  });

  it("maps collection relationships", () => {
    const { relationship1 } = normalizeResponse({
      data: {
        relationships: {
          relationship1: {
            data: [
              {
                id: 123,
                type: "relationship_type"
              }
            ]
          }
        }
      }
    });

    expect(relationship1[0].id).toBe(123);
    expect(relationship1[0].type).toBe("relationship_type");
  });

  it("maps included attributes into relationships", () => {
    const { relationship1 } = normalizeResponse({
      data: {
        relationships: {
          relationship1: {
            data: {
              id: 123,
              type: "relationship_type"
            }
          }
        }
      },
      included: [
        {
          id: 123,
          type: "relationship_type",
          attributes: {
            attribute1: "abc"
          }
        }
      ]
    });

    expect(relationship1.id).toBe(123);
    expect(relationship1.type).toBe("relationship_type");
    expect(relationship1.attribute1).toBe("abc");
  });

  it("maps included attributes into collection relationships", () => {
    const { relationship1 } = normalizeResponse({
      data: {
        relationships: {
          relationship1: {
            data: [
              {
                id: 123,
                type: "relationship_type"
              }
            ]
          }
        }
      },
      included: [
        {
          id: 123,
          type: "relationship_type",
          attributes: {
            attribute1: "abc"
          }
        }
      ]
    });

    expect(relationship1[0].id).toBe(123);
    expect(relationship1[0].type).toBe("relationship_type");
    expect(relationship1[0].attribute1).toBe("abc");
  });

  it("maps nested included attributes into relationships", () => {
    const { relationship1 } = normalizeResponse({
      data: {
        relationships: {
          relationship1: {
            data: {
              id: 123,
              type: "relationship_type"
            }
          }
        }
      },
      included: [
        {
          id: 123,
          type: "relationship_type",
          attributes: {
            attribute1: "abc"
          },
          relationships: {
            nestedRelationship: {
              data: {
                id: 456,
                type: "nested_relationship_type"
              }
            }
          }
        },
        {
          id: 456,
          type: "nested_relationship_type",
          attributes: {
            attribute2: "cba"
          }
        }
      ]
    });

    expect(relationship1.id).toBe(123);
    expect(relationship1.type).toBe("relationship_type");
    expect(relationship1.attribute1).toBe("abc");
    expect(relationship1.nestedRelationship.id).toBe(456);
    expect(relationship1.nestedRelationship.type).toBe(
      "nested_relationship_type"
    );

    expect(relationship1.nestedRelationship.attribute2).toBe("cba");
  });
});

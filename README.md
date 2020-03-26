# JSONAPI Flattener

Simple tool for flattening JSON api responses into simpler objects.


## Features:


* Flattens the attributes object to properties on the parent

e.g.

```json
{
  "data": 
  {
    "id": 1,
    "type": "person",
    "attributes": {
      "name": "bob",
      "age": 12
    }
  }
}
```

to

```json
{
  "data": {
    "id": 1,
    "type": "person",
    "name": "bob",
    "age": 12
  }
}
```


* Includes relationships as direct properties on the original object, maps in data from included resources

e.g.

```json
{
  "data": {
    "id": 1,
    "type": "person",
    "realtionships": {
      "friend": {
        "data": {
          "id": 2,
          "type": "person"
        }
      }
    }
  },
  "included": [
    {
      "id": 2,
      "type": "person",
      "attributes": {
        "name": "sally",
        "age": 14
      }
    }
  ]
}
```

to

```json
{
  "data": {
    "id": 1,
    "type": "person",
    "friend": {
      "id": 2,
      "type": "person",
      "name": "sally",
      "age": 14
    }
  }
}
```

* Recursively include nested relationships

* Handles collection types also
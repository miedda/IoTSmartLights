export const LightStateSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "building": {
        "type": "integer"
      },
      "time": {
        "type": "integer"
      },
      "startTime": {
        "type": "integer"
      },
      "state": {
        "type": "boolean"
      }
    },
    "required": [
      "id",
      "building",
      "time",
      "startTime",
      "state"
    ]
  }
  
  export const LightSpecificationSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "building": {
        "type": "integer"
      },
      "location": {
        "type": "string"
      },
      "time": {
        "type": "integer"
      }
    },
    "required": [
      "id",
      "building",
      "location",
      "time"
  ]
}
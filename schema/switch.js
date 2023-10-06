export const SwitchStateSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "id": {
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
      "time",
      "startTime",
      "state"
    ]
  }

export const SwitchSpecificationSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "id": {
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
    "location",
    "time"
  ]
}
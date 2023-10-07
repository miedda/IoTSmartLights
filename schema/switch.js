export const SwitchStateSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "lightId": {
        "type": "string"
      },
      "time": {
        "type": "integer"
      },
      "state": {
        "type": "boolean"
      }
    },
    "required": [
      "lightId",
      "time",
      "state"
    ]
  }
  
  export const SwitchSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "buildingId": {
        "type": "string"
      },
      "location": {
        "type": "string"
      },
      "startTime": {
        "type": "integer"
      },
      "time": {
        "type": "integer"
      }
  },
  "required": [
    "buildingId",
    "location",
    "startTime",
    "time"
  ]
}
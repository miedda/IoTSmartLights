export const BuildingSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "time": {
        "type": "integer"
      },
      "address": {
        "type": "string"
      },
      "organisation": {
        "type": "string"
      }
    },
    "required": [
      "id",
      "time",
      "address",
      "organisation"
    ]
  }
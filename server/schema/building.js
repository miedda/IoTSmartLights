export const BuildingSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
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
      "time",
      "address",
      "organisation"
    ]
  }
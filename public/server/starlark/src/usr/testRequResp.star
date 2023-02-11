def main(input):
  return {
    "resp1": input.Requ["param1"],
    "resp2": input.Requ["param2"],
    "resp3": input.Requ["param3"],
    "config1": input.Json["old"]["string"],
    "config2": input.Json["old"]["number"],
    "config3": input.Json["aa"],
    "scriptType":"Starlark",
  }
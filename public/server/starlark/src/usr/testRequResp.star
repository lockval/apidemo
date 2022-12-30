def main(input):
  return {
    "resp1": input.Requ["param1"],
    "resp2": input.Requ["param2"],
    "resp3": input.Requ["param3"],
    "config1": globalThis.JSON["string"],
    "config2": globalThis.JSON["number"],
    "scriptType":"Starlark",
  }
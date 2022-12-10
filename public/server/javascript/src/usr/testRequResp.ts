import { Dict, DBOperate } from "../libs/lockvalserver"

export function main(input: DBOperate<any>) {
  const resp = {
    resp1: input.Requ.param1,
    resp2: input.Requ.param2,
    resp3: input.Requ.param3,
    config1: globalThis.ExcelConfig.string,
    config2: globalThis.ExcelConfig.number,
    scriptType:"JavaScript",
  }
  return resp
}

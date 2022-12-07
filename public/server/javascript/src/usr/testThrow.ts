import { Dict, DBOperate } from "../libs/lockvalserver"


function doSomething(input: DBOperate<any>) {
  input.Throw(2,"Nothing changed") // In any case, just call Throw, the call will be terminated
}


export function main(input: DBOperate<any>) {
  input.GetSubVal(input.UID, "mBase", "Count")
  input.GetAndLock()

  let c = input.GetResp.IDKey[input.UID]?.KeySub["mBase"]?.SubVal["Count"]

  let ci = Number(c)
  ci++
  c = ci.toString()

  input.PutSubVal(input.UID, "mBase", "Count", c)

  doSomething(input)

  input.PutAndUnlock()

  return {}
}

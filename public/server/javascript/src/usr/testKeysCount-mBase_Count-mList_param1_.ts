import { Dict, DBOperate } from "../libs/lockvalserver"

export function main(input: DBOperate<any>) {

  let CountVal = input.Requ["Cookie_mBase_Count"]
  let paramVal = input.Requ["Cookie_mList_param1_"]

  input.GetSubVal(input.UID, "mDict", CountVal, paramVal)
  input.GetAndLock()

  let c = input.GetResp.IDKey[input.UID]?.KeySub["mDict"]?.SubVal[CountVal]

  let ci = Number(c)
  ci++
  c = ci.toString()

  let c2 = input.GetResp.IDKey[input.UID]?.KeySub["mDict"]?.SubVal[paramVal]

  let ci2 = Number(c2)
  ci2++
  c2 = ci2.toString()

  input.PutSubVal(input.UID, "mDict", CountVal, c, paramVal, c2, )
  input.PutAndUnlock()

  return { Hello: "JS" }
}

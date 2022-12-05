import { Dict, DBOperate } from "../libs/lockvalserver"

export function main(input: DBOperate<any>) {
  input.GetSubVal(input.UID, "mList", "") //get nothing
  input.GetSubVal(input.UID, "mListSlave", "") //get nothing
  input.GetAndLock()

  input.PutSubVal(
    input.UID,
    "mList",
    "1", input.Requ.first,
    "2", input.Requ.second,
  ).List(5).Link("mListSlave") //limit 5 and link mListSlave

  input.PutSubVal(
    input.UID,
    "mListSlave",
    "1", input.Requ.first + "_" + input.Requ.first,
    "2", input.Requ.second + "_" + input.Requ.second,
  ).List(5)

  input.PutAndUnlock()

  return {}
}

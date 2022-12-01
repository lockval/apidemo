import { Dict, DBOperate } from "../libs/lockvalserver";

export function main(input: DBOperate<any>) {
  input.GetSubVal(input.UID, "mList", ""); //get nothing
  input.GetAndLock();

  input.PutSubVal(
    input.UID,
    "mList",
    "1", "mydata",
  ).List(0).Clear(); //clear and push data
  input.PutAndUnlock();

  return {};
}

import { Dict, DBOperate } from "../lockvalserver";

export function main(input: DBOperate<any>) {
  input.GetSubVal(input.UID, "mList", ""); //get nothing
  input.GetAndLock();

  input.PutSubVal(
    input.UID,
    "mList",
    "1", "A",
    "2", "B",
  ).List(-input.Requ.n); //Note that here are negative numbers
  input.PutAndUnlock();

  return {};
}

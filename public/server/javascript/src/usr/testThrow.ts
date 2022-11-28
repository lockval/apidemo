import { Dict, DBOperate } from "../lockvalserver";

export function main(input: DBOperate<any>) {
  input.GetSubVal(input.UID, "mBase", "Count");
  input.GetAndLock();

  let c = input.GetResp.IDKey[input.UID]?.KeySub["mBase"]?.SubVal["Count"];

  let ci = Number(c);
  ci++;
  c = ci.toString();

  input.Throw(2,"my message")

  input.PutSubVal(input.UID, "mBase", "Count", c);
  input.PutAndUnlock();

  return {};
}

import { Dict, DBOperate } from "../libs/lockvalserver";

export function main(input: DBOperate<any>) {
  input.GetSubVal(input.UID, "mList"); //get all
  // input.GetSubVal(input.UID, "mList","key1","key2"); //get "key1" and "key2"
  input.GetSubValAll(input.UID, "mList"); //get all

  input.GetAndLock();

  input.DiscardAndUnlock();

  const resp = {};
  for (const k in input.GetResp.IDKey[input.UID]?.KeySub["mList"]?.SubVal) {
    resp[k] = input.GetResp.IDKey[input.UID]?.KeySub["mList"]?.SubVal[k];
  }
  return resp;
}

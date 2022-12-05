def main(input):
  input.GetSubVal(input.UID, "mList", "") # get nothing
  input.GetAndLock()

  c = input.GetResp.IDKey[input.UID].KeySub["mBase"].SubVal["Count"]

  input.PutSubVal(
    input.UID,
    "mList",
    "1", input.Requ.first,
    "2", input.Requ.second,
  ).List(5) # limit 5
  input.PutAndUnlock()

  return {}
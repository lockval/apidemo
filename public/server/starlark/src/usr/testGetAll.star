def main(input):
  input.GetSubVal(input.UID, "mList") #This is get all
  # input.GetSubVal(input.UID, "mList","key1","key2") #get "key1" and "key2"
  input.GetSubValAll(input.UID, "mList") #This is also get all

  input.GetAndLock()

  input.DiscardAndUnlock() # like PutAndUnlock, but does not modify any data

  resp = {}

  if not input.GetResp.IDKey[input.UID]:
    return resp
  if not input.GetResp.IDKey[input.UID].KeySub["mList"]:
    return resp

  for k in list(input.GetResp.IDKey[input.UID].KeySub["mList"].SubVal):
    resp[k] = input.GetResp.IDKey[input.UID].KeySub["mList"].SubVal[k]
  # or you can do
  # def keysCallback(k):
  #   resp[k] = input.GetResp.IDKey[input.UID].KeySub["mList"].SubVal[k]
  # globalThis.Builtin.MapKeys(input.GetResp.IDKey[input.UID].KeySub["mList"].SubVal, keysCallback)

  return resp
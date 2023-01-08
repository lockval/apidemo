def main(input):

  CountVal = input.Requ["Cookie_mBase_Count"]
  paramVal = input.Requ["Cookie_mList_param1_"]

  input.GetSubVal(input.UID, "mDict", CountVal, paramVal)
  input.GetAndLock()

  c = input.GetResp.IDKey[input.UID].KeySub["mDict"].SubVal[CountVal]

  if c=="":
    c="0"
  ci = int(c)
  ci+=1
  c = str(ci)

  c2 = input.GetResp.IDKey[input.UID].KeySub["mDict"].SubVal[paramVal]

  if c2=="":
    c2="0"
  ci2 = int(c2)
  ci2+=1
  c2 = str(ci2)

  input.PutSubVal(input.UID, "mDict", CountVal, c, paramVal, c2)
  input.PutAndUnlock()

  return {"Hello":"Starlark"}
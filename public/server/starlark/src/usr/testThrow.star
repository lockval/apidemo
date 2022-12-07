def main(input):
  input.GetSubVal(input.UID, "mBase", "Count")
  input.GetAndLock()

  c = input.GetResp.IDKey[input.UID].KeySub["mBase"].SubVal["Count"]

  if c=="":
    c="0"
  ci = int(c)
  ci+=1
  c = str(ci)

  

  input.PutSubVal(input.UID, "mBase", "Count", c)

  input.Throw(2,"Nothing changed")

  input.PutAndUnlock()

  return {"Hello":"Starlark"}
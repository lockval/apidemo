def main(input):
  input.GetSubVal(input.UID, "mBase", "Count")
  input.GetAndLock()

  c = input.GetResp.IDKey[input.UID].KeySub["mBase"].SubVal["Count"]

  if c=="":
    c="0"
  ci = int(c)
  ci-=int(input.Requ["n"])
  c = str(ci)

  input.PutSubVal(input.UID, "mBase", "Count", c)
  input.PutAndUnlock()

  return {"Hello":"Starlark"}


def doSomething(input):
  input.Throw(2,"Nothing changed") # In any case, just call Throw, the call will be terminated

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

  doSomething(input)

  input.PutAndUnlock()

  return {"Hello":"Starlark"}
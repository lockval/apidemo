def main(input):
  input.GetSubVal(input.UID, "mList", "").Random(1).Link("mListSlave") #get Random and mListSlave is same key
  input.GetSubVal(input.UID, "mListSlave", "") 
  input.GetAndLock()

  input.DiscardAndUnlock()

  return {"v":input.GetResp.IDKey[input.UID].KeySub}
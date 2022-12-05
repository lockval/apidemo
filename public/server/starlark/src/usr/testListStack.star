def main(input):
  input.GetSubVal(input.UID, "mList", "") # get nothing
  input.GetAndLock()

  input.PutSubVal(
    input.UID,
    "mList",
    "1", "A",
    "2", "B",
  ).List(-int(input.Requ["n"])) # Note that here are negative numbers
  input.PutAndUnlock()

  return {}
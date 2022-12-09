def main(input):
	getopt = input.GetSubVal(input.UID, "mList", "")  #get nothing
	getopt.Group()                                    #Count the number of the same value
	getopt.Len()                                      #Get the number of all kv
	getopt.Max(5, 10)                                 #Get 5 key values not greater than 10
	getopt.Min(5, 10)                                 #Get 5 key values not less    than 10
	getopt.Random(5)                                  #Randomly pick 5
	getopt.Range(-2)                                  #Get the first 2 data
	getopt.Search("1")                                #Get the key value whose value is "1"
	getopt.Sum()                                      #sum all values
	getopt.Unique()                                   #Get data with unique values

	input.GetAndLock()

	input.DiscardAndUnlock()

	resp = {
		"SubVal": input.GetResp.IDKey[input.UID].KeySub["mList"].SubVal, #get nothing
		"Group":  input.GetResp.IDKey[input.UID].KeySub["mList"].Group,  #Count the number of the same value
		"Len":    input.GetResp.IDKey[input.UID].KeySub["mList"].Len,    #Get the number of all kv
		"Max":    input.GetResp.IDKey[input.UID].KeySub["mList"].Max,    #Get 5 key values not greater than 10
		"Min":    input.GetResp.IDKey[input.UID].KeySub["mList"].Min,    #Get 5 key values not less    than 10
		"Random": input.GetResp.IDKey[input.UID].KeySub["mList"].Random, #Randomly pick 5
		"Range":  input.GetResp.IDKey[input.UID].KeySub["mList"].Range,  #Get the first 2 data
		"Search": input.GetResp.IDKey[input.UID].KeySub["mList"].Search, #Get the key value whose value is "1"
		"Sum":    input.GetResp.IDKey[input.UID].KeySub["mList"].Sum,    #sum all values
		"Unique": input.GetResp.IDKey[input.UID].KeySub["mList"].Unique, #Get data with unique values
	}

	return resp
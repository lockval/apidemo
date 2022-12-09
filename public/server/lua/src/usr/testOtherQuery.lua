return require("umd").define({
    "exports",
    "other/utils",
}, function(exports, utils)

    function exports.main(input)

        local getopt = input.GetSubVal(input.UID, "mList", "")  --get nothing
        getopt:Group()                                          --Count the number of the same value
        getopt:Len()                                            --Get the number of all kv
        getopt:Max(5, 10)                                       --Get 5 key values not greater than 10
        getopt:Min(5, 10)                                       --Get 5 key values not less    than 10
        getopt:Random(5)                                        --Randomly pick 5
        getopt:Range(-2)                                        --Get the first 2 data
        getopt:Search("1")                                      --Get the key value whose value is "1"
        getopt:Sum()                                            --sum all values
        getopt:Unique()                                         --Get data with unique values

        input.GetAndLock()

        input.DiscardAndUnlock()

        local resp = {}
        resp["SubVal"] = input.GetResp.IDKey[input.UID].KeySub["mList"].SubVal --get nothing
        resp["Group"] =  input.GetResp.IDKey[input.UID].KeySub["mList"].Group  --Count the number of the same value
        resp["Len"] =    input.GetResp.IDKey[input.UID].KeySub["mList"].Len    --Get the number of all kv
        resp["Max"] =    input.GetResp.IDKey[input.UID].KeySub["mList"].Max    --Get 5 key values not greater than 10
        resp["Min"] =    input.GetResp.IDKey[input.UID].KeySub["mList"].Min    --Get 5 key values not less    than 10
        resp["Random"] = input.GetResp.IDKey[input.UID].KeySub["mList"].Random --Randomly pick 5
        resp["Range"] =  input.GetResp.IDKey[input.UID].KeySub["mList"].Range  --Get the first 2 data
        resp["Search"] = input.GetResp.IDKey[input.UID].KeySub["mList"].Search --Get the key value whose value is "1"
        resp["Sum"] =    input.GetResp.IDKey[input.UID].KeySub["mList"].Sum    --sum all values
        resp["Unique"] = input.GetResp.IDKey[input.UID].KeySub["mList"].Unique --Get data with unique values


        return resp
    end

end)

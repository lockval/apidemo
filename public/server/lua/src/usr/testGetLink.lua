return require("umd").define({
    "exports",
    "other/utils",
}, function(exports, utils)

    function exports.main(input)

        input.GetSubVal(input.UID, "mList", ""):Random(1):Link("mListSlave") --get Random and mListSlave is same key
        input.GetSubVal(input.UID, "mListSlave", "") 
        input.GetAndLock()

        input.DiscardAndUnlock()
        local resp={}
        resp["v"]=input.GetResp.IDKey[input.UID].KeySub
        return resp
    end

end)

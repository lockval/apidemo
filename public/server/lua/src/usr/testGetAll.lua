return require("umd").define({
    "exports",
    "other/utils",
}, function(exports, utils)

    function exports.main(input)

        input.GetSubVal(input.UID, "mList") --This is get all
        -- input.GetSubVal(input.UID, "mList","key1","key2") --get "key1" and "key2"
        input.GetSubValAll(input.UID, "mList") --This is also get all

        input.GetAndLock()

        input.DiscardAndUnlock() -- like PutAndUnlock, but does not modify any data

        local resp = {}

        if(not(input.GetResp.IDKey[input.UID])) then
            return resp
        end
        if(not(input.GetResp.IDKey[input.UID].KeySub["mList"])) then
            return resp
        end

        -- You can't use pairs to iterate over userdata, so we provide Builtin.MapKeys
        _G.Builtin.MapKeys(input.GetResp.IDKey[input.UID].KeySub["mList"].SubVal,function(k)
            resp[k]=input.GetResp.IDKey[input.UID].KeySub["mList"].SubVal[k]
        end)


        return resp
    end

end)

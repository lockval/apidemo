return require("umd").define({
    "exports",
}, function(exports)

    function exports.GetResp(input, IDKey, KeySub, SubVal)

        local k = input.GetResp.IDKey[IDKey]
        if k == nil then
            return ""
        end

        local s = k.KeySub[KeySub]
        if s == nil then
            return ""
        end

        local v = s.SubVal[SubVal]
        if v == nil then
            return ""
        end
        return v

    end

end)

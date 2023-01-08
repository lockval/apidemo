return require("umd").define({
    "exports",
    "other/helper",
}, function(exports, helper)

    function exports.main(input)
        local CountVal = input.Requ["Cookie_mBase_Count"]
        local paramVal = input.Requ["Cookie_mList_param1_"]

        input.GetSubVal(input.UID, "mDict", CountVal, paramVal)
        input.GetAndLock()

        local c = helper.GetResp(input, input.UID, "mDict", CountVal)
        if c == "" then
            c = "0"
        end
        local ci = tonumber(c)
        ci = ci + 1
        c = tostring(ci)

        local c2 = helper.GetResp(input, input.UID, "mDict", paramVal)
        if c2 == "" then
            c2 = "0"
        end
        local ci2 = tonumber(c2)
        ci2 = ci2 + 1
        c2 = tostring(ci2)

        input.PutSubVal(input.UID, "mDict", CountVal, c, paramVal, c2)
        input.PutAndUnlock()

        local retval = {}
        retval.Hello = "Lua"
        return retval
    end

end)

return require("umd").define({
    "exports",
    "other/helper",
}, function(exports, helper)

    local function doSomething(input)
        input.Throw(2,"Nothing changed") -- In any case, just call Throw, the call will be terminated
    end

    function exports.main(input)

        input.GetSubVal(input.UID, "mBase", "Count")
        input.GetAndLock()

        local c = helper.GetResp(input, input.UID, "mBase", "Count")
        if c == "" then
            c = "0"
        end
        local ci = tonumber(c)
        ci = ci + 1
        c = tostring(ci)

        input.PutSubVal(input.UID, "mBase", "Count", c)

        doSomething(input)

        input.PutAndUnlock()

        local retval = {}
        retval.Hello = "Lua"
        return retval
    end

end)

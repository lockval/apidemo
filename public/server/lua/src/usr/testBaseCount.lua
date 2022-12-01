return require("umd").define({
    "exports",
    "other/utils",
}, function(exports, utils)

    function exports.main(input)

        input.GetSubVal(input.UID, "mBase", "Count")
        input.GetAndLock()

        local c = utils.GetResp(input, input.UID, "mBase", "Count")
        if c == "" then
            c = "0"
        end
        local ci = tonumber(c)
        ci = ci + 1
        c = tostring(ci)

        input.PutSubVal(input.UID, "mBase", "Count", c)
        input.PutAndUnlock()

        local retval = {}
        retval.Hello = "Lua"
        return retval
    end

end)

return require("umd").define({
    "exports",
}, function(exports)

    function exports.main(input)

        local retval = {}
        retval.resp1 = input.Requ.param1
        retval.resp2 = input.Requ.param2
        retval.resp3 = input.Requ.param3
        retval.config1 = input.Json.old.string
        retval.config2 = input.Json.old.number
        retval.config3 = input.Json.aa
        retval.scriptType = "Lua"
        return retval
    end

end)

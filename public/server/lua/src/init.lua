return require("umd").define({
    "exports",
}, function(exports)

    function exports.main()
        local retval = {}
        retval["player"]={
            "Base",
            "Timeout",
            "Atomic",
            "ArriveCount",
            "TapCountStruct",
            "TapCountMap",
            "TapCountRecord",
            "TestM1",
            "TestM2",

            "base",
            "watchmap"
        }

        retval["map"]={
            "uid2dmid",
            "color"
        }

        return retval
    end

end)

return require("umd").define({
    "exports",
}, function(exports)

    function exports.main()
        local retval = {}
        retval["player"]={
            "mBase",
            "mList",
            "mListSlave",
        }



        return retval
    end

end)

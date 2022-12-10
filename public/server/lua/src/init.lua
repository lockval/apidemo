return require("umd").define({
    "exports",
}, function(exports)

    function exports.main()
        -- According to the prefix of the id, the corresponding key is publicized, 
        -- and the unpublished key will not be synchronized to the client
        local retval = {}
        retval["player"]={
            "mBase",
            "mList",
            "mListSlave",
        }



        return retval
    end

end)

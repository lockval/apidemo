return require("umd").define({
    "exports",
}, function(exports)

    function exports.main(input)
        -- According to the prefix of the id, the corresponding key is publicized, 
        -- and the unpublished key will not be synchronized to the client
        local retval = {}
        retval["player"]={
            "mBase",
            "mList",
            "mListSlave",
            "mDict",
        }
        retval["globalChat"]={
            "mChatList",
            "mChatID",
        }


        return retval
    end

end)

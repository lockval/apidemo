return require("umd").define({
    "exports",
    "other/utils",
}, function(exports, utils)

    function exports.main(input)

        input.GetSubVal("globalChat:the001", "mChatList", "") -- get nothing
        input.GetSubVal("globalChat:the001", "mChatID", "") -- get nothing
        input.GetAndLock()

        input.PutSubVal(
            "globalChat:the001",
            "mChatList",
            "1", input.Requ.text
        ):List(10):Link("mChatID") -- limit 10 and link mChatID

        input.PutSubVal(
            "globalChat:the001",
            "mChatID",
            "1", input.UID --record my id
        ):List(10) -- limit 10

        input.PutAndUnlock()
        return {}
    end

end)

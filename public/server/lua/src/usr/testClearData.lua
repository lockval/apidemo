return require("umd").define({
    "exports",
    "other/utils",
}, function(exports, utils)

    function exports.main(input)

        input.GetSubVal(input.UID, "mList", "") -- get nothing
        input.GetAndLock()

        input.PutSubVal(
            input.UID,
            "mList",
            "1", "mydata"
        ):List(0):Clear() -- clear and push data
        
        input.PutAndUnlock()
        return {}
    end

end)

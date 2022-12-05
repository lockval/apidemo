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
            "1", input.Requ.first,
            "2", input.Requ.second
        ):List(5) -- limit 5
        
        input.PutAndUnlock()
        return {}
    end

end)

return require("umd").define({
    "exports",
}, function(exports)

    function exports.main(input)
        if input.WATCHUID=="globalChat:the001" then
            return true  -- allow
        end
        return false -- not allow
    end

end)

return require("umd").define({
    "exports",
}, function(exports)

    function exports.main(input)


        local c = _G.G.Sum("a","b")
        local resp={}
        resp["c"]=c
        return resp
    end

end)

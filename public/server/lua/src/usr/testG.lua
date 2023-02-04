return require("umd").define({
    "exports",
}, function(exports)

    function exports.main(input)


        local c = _G.G["lockval"].Sum("a","b")
        local resp={}
        resp["c"]=c
        resp["lang"]="Lua"
        return resp
    end

end)

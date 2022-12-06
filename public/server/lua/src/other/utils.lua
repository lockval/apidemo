return require("umd").define({
    "exports",
}, function(exports)

    function exports.shuffle(tbl)
        for i = #tbl, 2, -1 do
            local j = math.random(i)
            tbl[i], tbl[j] = tbl[j], tbl[i]
        end
        return tbl
    end

    function exports.isin(k, idkey, k1, k2)
        if idkey[k1] == nil then
            return false
        end
        if idkey[k1].KeySub[k2] == nil then
            return false
        end
        if idkey[k1].KeySub[k2].SubVal == nil then
            return false
        end
        if idkey[k1].KeySub[k2].SubVal[k] == nil then
            return false
        end

        return true

    end


end)

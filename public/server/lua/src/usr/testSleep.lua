return require("umd").define({
    "exports",
}, function(exports)

    function exports.main(input)

        --Execute "sys/testItsTime" after setting 3 seconds, pass parameter {n:2}
        local params = {}
        params["n"]=2
        input.Sleep(3000, "uuidXXXX", "sys/testItsTime",params)
        return {}
    end

end)

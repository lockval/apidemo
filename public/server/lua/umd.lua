#!/usr/bin/env lua

-- https://github.com/vanishs/umdlua

local function file_exists(name)
    local f = io.open(name, "r")
    if f ~= nil then io.close(f) return true else return false end
end

local function mysplit(inputstr, sep)
    if sep == nil then
        sep = "%s"
    end
    local t = {}
    for str in string.gmatch(inputstr, "([^" .. sep .. "]+)") do
        table.insert(t, str)
    end
    return t
end

local function httphead(url)
    local cURLcmd = "curl -s -w \"%{http_code}\\n\" -L --head " .. url

    local cURLcmdf = io.popen(cURLcmd, "r")

    if not cURLcmdf then
        return 0
    end

    local lastline = ""
    for cnt in cURLcmdf:lines() do
        lastline = cnt
    end

    cURLcmdf:close()

    return tonumber(lastline)
end

local function isURL(moduleName)
    if moduleName:find("github.com/", 1, true) == 1 then
        return "github.com/"
    end
    return nil
end

if arg and not arg[0]:find("umd.lua") then
    local exports = { ebs = {} }

    local unpack = table.unpack or unpack

    function exports.require(moduleName)
        if string.find(moduleName, "%\\") then
            print("module demo: aa/bb")
            return nil
        end
        if isURL(moduleName) then
            -- https://github.com/vanishs/umdluam1/archive/2a005ee9a6494b783ab4e9e532f44576c0583c2e.zip
            -- github.com/vanishs/umdluam1-2a005ee9a6494b783ab4e9e532f44576c0583c2e/main
            local dircount = 0
            local nowindex = 0
            local dashindex = 0
            for c in moduleName:gmatch(".") do
                nowindex = nowindex + 1
                if c == "/" then
                    dircount = dircount + 1
                    if dircount == 3 then
                        break
                    end
                elseif c == "-" then
                    dashindex = nowindex
                end
            end
            local baseLogName = { moduleName:sub(1, dashindex - 1), moduleName:sub(dashindex + 1, #moduleName) } --github.com/vanishs/umdluam1 2a005ee9a6494b783ab4e9e532f44576c0583c2e/main
            local firstDirIdx = baseLogName[2]:find("/")
            local logName = { baseLogName[2]:sub(1, firstDirIdx - 1), baseLogName[2]:sub(firstDirIdx, #baseLogName[2]) } --2a005ee9a6494b783ab4e9e532f44576c0583c2e main
            local dirs = mysplit(baseLogName[1], "/") --github.com vanishs umdluam1
            dirs[1] = "github/com"
            local userdir = "urlmodules/" .. dirs[1] .. "/" .. dirs[2] .. "/" --urlmodules/github/com/vanishs/
            local zipname = logName[1] .. ".zip" --2a005ee9a6494b783ab4e9e532f44576c0583c2e.zip
            local zippath = userdir .. dirs[3] .. "-" .. zipname --github/com/vanishs/umdluam1-2a005ee9a6494b783ab4e9e532f44576c0583c2e.zip


            if not file_exists(zippath) then

                local url = ""
                local httpcode = 0

                -- url = "https://" .. baseLogName[1] .. "/archive/refs/heads/" .. zipname
                -- httpcode = httphead(url)
                -- if httpcode == 404 then
                url = "https://" .. baseLogName[1] .. "/archive/refs/tags/" .. zipname
                httpcode = httphead(url)
                if httpcode == 404 and #logName[1] == 40 then
                    url = "https://" .. baseLogName[1] .. "/archive/" .. zipname
                    httpcode = httphead(url)
                    if httpcode ~= 200 then
                        print(url .. " HEAD fail,code is:" .. httpcode)
                        return nil
                    end
                elseif httpcode ~= 200 then
                    print(url .. " HEAD fail,code is:" .. httpcode)
                    return nil
                end
                -- elseif httpcode ~= 200 then
                --     print(url .. " HEAD fail,code is:" .. httpcode)
                --     return nil
                -- end

                print(url)
                local cURLcmd = "curl -L " .. url .. " --create-dirs -o " .. zippath
                local suc = os.execute(cURLcmd)
                if suc ~= 0 then
                    print(url .. " GET fail,code is:" .. suc)
                    return nil
                end

                local unzipcmd = "unzip -o " .. zippath .. " -d " .. userdir
                local suc = os.execute(unzipcmd)
                if suc ~= 0 then
                    print(zippath .. " UNZIP fail,code is:" .. suc)
                    return nil
                end
            end


            table.insert(exports.ebs, baseLogName[1] .. "-" .. logName[1] .. "/")
            local m = require("urlmodules/" .. moduleName)
            table.remove(exports.ebs)

            return m
        else
            local eb = exports.ebs[#exports.ebs]
            if not eb then
                eb = ""
            else
                eb = "urlmodules/" .. eb
            end

            local m = require(eb .. moduleName)

            return m
        end
    end

    function exports.define(deps, callback)
        local m = {}
        local dms = {}
        for _, dep in ipairs(deps) do
            if dep == "exports" then
                table.insert(dms, m)
            else
                table.insert(dms, exports.require(dep))
            end
        end
        callback(unpack(dms))
        return m
    end

    return exports

end




if #arg < 3 then
    print("cmd demo: umd.lua src output.lua moduleName...")
    print("cmd demo: umd.lua src myMainFunc moduleName...")
    return
end

local srcDir = arg[1]
srcDir = srcDir .. "/"
table.remove(arg, 1)

local mainFunc = nil
local outputName = arg[1]
if string.find(arg[1], "%.") then
    table.remove(arg, 1)
else
    mainFunc = arg[1]
    outputName = outputName .. ".lua"
    arg[1] = "github.com/vanishs/urlmoduleslua-release001/urlmoduleslua"
end

local bf, err = io.open(outputName, "w")
if bf == nil then
    print(err)
    return
end

if mainFunc then
    bf:write("#!/usr/bin/env lua\n")
    bf:write("urlmodules={};function define(name,deps,callback)urlmodules[name]={deps=deps,callback=callback,exports={}}end\n\n")
end



local loadstring = loadstring or load
local doneModule = {}
local function bundleModule(moduleName)
    if string.find(moduleName, "%\\") then
        print("module demo: aa/bb")
        return false
    end
    if doneModule[moduleName] then
        return true
    end

    local fn = moduleName .. ".lua"
    local eb = ""
    if isURL(moduleName) then
        -- https://github.com/vanishs/umdluam1/archive/2a005ee9a6494b783ab4e9e532f44576c0583c2e.zip
        -- github.com/vanishs/umdluam1-2a005ee9a6494b783ab4e9e532f44576c0583c2e/main
        local dircount = 0
        local nowindex = 0
        local dashindex = 0
        for c in moduleName:gmatch(".") do
            nowindex = nowindex + 1
            if c == "/" then
                dircount = dircount + 1
                if dircount == 3 then
                    break
                end
            elseif c == "-" then
                dashindex = nowindex
            end
        end
        local baseLogName = { moduleName:sub(1, dashindex - 1), moduleName:sub(dashindex + 1, #moduleName) } --github.com/vanishs/umdluam1 2a005ee9a6494b783ab4e9e532f44576c0583c2e/main
        local firstDirIdx = baseLogName[2]:find("/")
        local logName = { baseLogName[2]:sub(1, firstDirIdx - 1), baseLogName[2]:sub(firstDirIdx, #baseLogName[2]) } --2a005ee9a6494b783ab4e9e532f44576c0583c2e main
        local dirs = mysplit(baseLogName[1], "/") --github.com vanishs umdluam1
        dirs[1] = "github/com"
        local userdir = "urlmodules/" .. dirs[1] .. "/" .. dirs[2] .. "/" --urlmodules/github/com/vanishs/
        local zipname = logName[1] .. ".zip" --2a005ee9a6494b783ab4e9e532f44576c0583c2e.zip
        local zippath = userdir .. dirs[3] .. "-" .. zipname --github/com/vanishs/umdluam1-2a005ee9a6494b783ab4e9e532f44576c0583c2e.zip

        if not file_exists(zippath) then

            local url = ""
            local httpcode = 0

            -- url = "https://" .. baseLogName[1] .. "/archive/refs/heads/" .. zipname
            -- httpcode = httphead(url)
            -- if httpcode == 404 then
            url = "https://" .. baseLogName[1] .. "/archive/refs/tags/" .. zipname
            httpcode = httphead(url)
            if httpcode == 404 and #logName[1] == 40 then
                url = "https://" .. baseLogName[1] .. "/archive/" .. zipname
                httpcode = httphead(url)
                if httpcode ~= 200 then
                    print(url .. " HEAD fail,code is:" .. httpcode)
                    return false
                end
            elseif httpcode ~= 200 then
                print(url .. " HEAD fail,code is:" .. httpcode)
                return false
            end
            -- elseif httpcode ~= 200 then
            --     print(url .. " HEAD fail,code is:" .. httpcode)
            --     return false
            -- end

            local cURLcmd = "curl -L " .. url .. " --create-dirs -o " .. zippath
            local suc = os.execute(cURLcmd)
            if suc ~= 0 then
                print(url .. " GET fail,code is:" .. suc)
                return false
            end

            local unzipcmd = "unzip -o " .. zippath .. " -d " .. userdir
            local suc = os.execute(unzipcmd)
            if suc ~= 0 then
                print(zippath .. " UNZIP fail,code is:" .. suc)
                return false
            end
        end


        eb = baseLogName[1] .. "-" .. logName[1] .. "/"
        fn = userdir .. dirs[3] .. "-" .. logName[1] .. "/" .. logName[2] .. ".lua"
    end


    local file, err = io.open(srcDir .. fn, "r")
    if file == nil then
        print(err)
        return false
    end

    io.input(file)

    local l1 = ""
    while not l1:find("}") do
        l1 = l1 .. "\n" .. io.read()
    end

    if l1:find("\nreturn require(\"umd\").define({", 1, true) ~= 1 then
        print("bad module define:" .. fn)
        return false
    end
    local l1tablestart = l1:sub(31)
    local l1table = l1tablestart:sub(1, l1tablestart:find("}"))
    local l1end = l1tablestart:sub(l1tablestart:find("}"), #l1tablestart)
    local imports = loadstring("return " .. l1table)()

    bf:write("define(\"")
    bf:write(moduleName)
    bf:write("\",{\n")

    -- bf:write(l1tablestart)
    if eb ~= "" then
        for i, moduleNameV in ipairs(imports) do
            if moduleNameV ~= "exports" then
                if not isURL(moduleNameV) then
                    moduleNameV = eb .. moduleNameV
                end
            end
            imports[i] = moduleNameV
        end
    end
    for _, moduleNameV in ipairs(imports) do
        bf:write("\"")
        bf:write(moduleNameV)
        bf:write("\",\n")
    end

    bf:write(l1end)

    bf:write("\n")

    local l = io.read()
    while l do
        bf:write(l .. "\n")
        l = io.read()
    end
    bf:write("\n")

    io.close(file)

    doneModule[moduleName] = moduleName

    for _, moduleNameV in ipairs(imports) do
        if moduleNameV ~= "exports" then
            if not bundleModule(moduleNameV) then
                print("bundle fail:" .. moduleNameV)
                return false
            end
        end

    end

    return true

end

for _, moduleNameV in ipairs(arg) do

    if not bundleModule(moduleNameV) then
        print("bundle fail:" .. moduleNameV)
        return
    end


end

if mainFunc then
    bf:write("local m=urlmodules[\"")
    bf:write(arg[1])
    bf:write("\"];local dep=m.deps[2];urlmodules[dep].callback(urlmodules[dep].exports);m.callback(m.exports,urlmodules[dep].exports);m.exports.init();m.exports.run(\"")
    bf:write(arg[2])
    bf:write("\",\"")
    bf:write(mainFunc)
    bf:write("\")\n")
end

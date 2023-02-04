package main

import (
	"GoPluginMagicModule/src"
	"GoPluginMagicModule/src/globalThis"
	"GoPluginMagicModule/src/helper"
	"GoPluginMagicModule/src/sys"
	"GoPluginMagicModule/src/usr"

	"github.com/lockval/go2plugin"
)

var (
	Export map[string]func(*go2plugin.Input) map[string]any = make(map[string]func(*go2plugin.Input) map[string]any)
	Import map[string]any                                   = make(map[string]any)

	mapTrue  map[string]any = make(map[string]any)
	mapFalse map[string]any = nil
)

func init() {

	Export["init"] = initFunc
	Export["login"] = loginFunc
	Export["watch"] = watchFunc

	usr.Export.Range(func(key string, val func(*go2plugin.Input) map[string]any) {
		Export[key] = val
	})
	sys.Export.Range(func(key string, val func(*go2plugin.Input) map[string]any) {
		Export[key] = val
	})

}

func initFunc(*go2plugin.Input) map[string]any {

	globalThis.JSONFILE = Import["JSONFILE"]

	globalThis.Builtin.MakeKSUID = helper.Any2Func[func() string](Import["Builtin"], "MakeKSUID")
	globalThis.Builtin.MapKeys = helper.Any2Func[func(m any, f func(k any))](Import["Builtin"], "MapKeys")
	globalThis.Builtin.WatchKick = helper.Any2Func[func(watchuid string, uid string)](Import["Builtin"], "WatchKick")
	globalThis.Builtin.WatchClear = helper.Any2Func[func(watchuid string)](Import["Builtin"], "WatchClear")

	globalThis.G = helper.Any2type[map[string]any](Import["G"])

	return src.Init()
}
func loginFunc(input *go2plugin.Input) map[string]any {
	src.Login(input)
	return nil
}
func watchFunc(input *go2plugin.Input) map[string]any {
	if src.Watch(input) {
		return mapTrue
	}
	return mapFalse
}

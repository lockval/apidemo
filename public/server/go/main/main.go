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

	globalThis.ExcelConfig = Import["ExcelConfig"]

	globalThis.Builtin.MakeKSUID = helper.Any2Func[func() string](Import["Builtin"], "MakeKSUID")

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

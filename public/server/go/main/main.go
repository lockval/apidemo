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

	globalThis.JSON = Import["JSON"]

	globalThis.Builtin.MakeKSUID = helper.Any2Func[func() string](Import["Builtin"], "MakeKSUID")
	globalThis.Builtin.MapKeys = helper.Any2Func[func(m any, f func(k any))](Import["Builtin"], "MapKeys")
	globalThis.Builtin.WatchKick = helper.Any2Func[func(watchuid string, uid string)](Import["Builtin"], "WatchKick")
	globalThis.Builtin.WatchClear = helper.Any2Func[func(watchuid string)](Import["Builtin"], "WatchClear")

	globalThis.Rand.ExpFloat64 = helper.Any2Func[func() float64](Import["Rand"], "ExpFloat64")
	globalThis.Rand.Float32 = helper.Any2Func[func() float32](Import["Rand"], "Float32")
	globalThis.Rand.Float64 = helper.Any2Func[func() float64](Import["Rand"], "Float64")
	globalThis.Rand.Int = helper.Any2Func[func() int](Import["Rand"], "Int")
	globalThis.Rand.Int31 = helper.Any2Func[func() int32](Import["Rand"], "Int31")
	globalThis.Rand.Int31n = helper.Any2Func[func(n int32) int32](Import["Rand"], "Int31n")
	globalThis.Rand.Int63 = helper.Any2Func[func() int64](Import["Rand"], "Int63")
	globalThis.Rand.Int63n = helper.Any2Func[func(n int64) int64](Import["Rand"], "Int63n")
	globalThis.Rand.Intn = helper.Any2Func[func(n int) int](Import["Rand"], "Intn")
	globalThis.Rand.NormFloat64 = helper.Any2Func[func() float64](Import["Rand"], "NormFloat64")
	globalThis.Rand.Perm = helper.Any2Func[func(n int) []int](Import["Rand"], "Perm")
	globalThis.Rand.Seed = helper.Any2Func[func(seed int64)](Import["Rand"], "Seed")
	globalThis.Rand.Uint32 = helper.Any2Func[func() uint32](Import["Rand"], "Uint32")
	globalThis.Rand.Uint64 = helper.Any2Func[func() uint64](Import["Rand"], "Uint64")

	globalThis.G = Import["G"]

	globalThis.JSON = Import["JSON"]

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

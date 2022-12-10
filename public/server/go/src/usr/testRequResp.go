package usr

import (
	"GoPluginMagicModule/src/globalThis"
	"GoPluginMagicModule/src/helper"

	"github.com/lockval/go2plugin"
)

func (e export) Export_testRequResp(input *go2plugin.Input) map[string]any {

	stringAny := helper.Any2type[map[string]any](globalThis.ExcelConfig)["string"]
	config1 := helper.Any2type[string](stringAny)

	numberAny := helper.Any2type[map[string]any](globalThis.ExcelConfig)["number"]
	config2 := helper.Any2type[float64](numberAny)

	return map[string]any{
		"resp1":      helper.Any2type[string](input.Requ["param1"]),
		"resp2":      helper.Any2type[float64](input.Requ["param2"]),
		"resp3":      helper.Any2type[bool](input.Requ["param3"]),
		"config1":    config1,
		"config2":    config2,
		"scriptType": "Go",
	}
}

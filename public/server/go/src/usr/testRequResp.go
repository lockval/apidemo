package usr

import (
	"GoPluginMagicModule/src/helper"

	"github.com/lockval/go2plugin"
)

func (e export) Export_testRequResp(input *go2plugin.Input) map[string]any {

	aaAny := helper.Any2type[map[string]any](input.Json)["aa"]
	config3 := helper.Any2type[string](aaAny)

	oldAny := helper.Any2type[map[string]any](input.Json)["old"]
	oldMap := helper.Any2type[map[string]any](oldAny)

	config1 := helper.Any2type[string](oldMap["string"])

	config2 := helper.Any2type[float64](oldMap["number"])

	return map[string]any{
		"resp1":      helper.Any2type[string](input.Requ["param1"]),
		"resp2":      helper.Any2type[float64](input.Requ["param2"]),
		"resp3":      helper.Any2type[bool](input.Requ["param3"]),
		"config1":    config1,
		"config2":    config2,
		"config3":    config3,
		"scriptType": "Go",
	}
}

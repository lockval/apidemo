package usr

import (
	"GoPluginMagicModule/src/helper"

	"github.com/lockval/go2plugin"
)

func (e export) Export_testRequResp(input *go2plugin.Input) map[string]any {
	return map[string]any{
		"resp1":      helper.Any2type[string](input.Requ["param1"]),
		"resp2":      helper.Any2type[float64](input.Requ["param2"]),
		"resp3":      helper.Any2type[bool](input.Requ["param3"]),
		"scriptType": "Go",
	}
}

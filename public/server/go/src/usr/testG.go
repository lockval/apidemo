package usr

import (
	"GoPluginMagicModule/src/globalThis"
	"GoPluginMagicModule/src/helper"

	"github.com/lockval/go2plugin"
)

func (e export) Export_testG(input *go2plugin.Input) map[string]any {

	// TODO conv to struct and get func Sum
	_ = globalThis.G

	return helper.RespEmpty
}

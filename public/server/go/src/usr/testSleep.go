package usr

import (
	"GoPluginMagicModule/src/helper"

	"github.com/lockval/go2plugin"
)

func (e export) Export_testSleep(input *go2plugin.Input) map[string]any {

	//Execute "sys/testItsTime" after setting 3 seconds, pass parameter {n:2}
	input.Sleep(3000, "uuidXXXX", "sys/testItsTime", map[string]any{"n": 2})

	return helper.RespEmpty
}

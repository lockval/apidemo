package usr

import (
	"GoPluginMagicModule/src/helper"

	"github.com/lockval/go2plugin"
)

func (e export) Export_testListStack(input *go2plugin.Input) map[string]any {
	input.GetSubVal(input.UID, "mList", "") //get nothing
	input.GetAndLock()

	input.PutSubVal(
		input.UID,
		"mList",
		"1", "A",
		"2", "B",
	).List(-int32(helper.Any2type[float64](input.Requ["n"]))) //Note that here are negative numbers
	input.PutAndUnlock()

	return helper.RespEmpty
}

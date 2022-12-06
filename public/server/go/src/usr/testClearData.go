package usr

import (
	"GoPluginMagicModule/src/helper"

	"github.com/lockval/go2plugin"
)

func (e export) Export_testClearData(input *go2plugin.Input) map[string]any {
	input.GetSubVal(input.UID, "mList", "") //get nothing
	input.GetAndLock()

	input.PutSubVal(
		input.UID,
		"mList",
		"1", "mydata",
	).List(0).Clear() //clear and push data
	input.PutAndUnlock()

	return helper.RespEmpty
}

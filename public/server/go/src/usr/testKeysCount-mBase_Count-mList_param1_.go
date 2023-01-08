package usr

import (
	"GoPluginMagicModule/src/helper"
	"strconv"

	"github.com/lockval/go2plugin"
)

// Note: __ is used here instead of -
func (e export) Export_testKeysCount__mBase_Count__mList_param1_(input *go2plugin.Input) map[string]any {

	CountVal := helper.Any2type[string](input.Requ["Cookie_mBase_Count"])
	paramVal := helper.Any2type[string](input.Requ["Cookie_mList_param1_"])

	input.GetSubVal(input.UID, "mDict", CountVal, paramVal)
	input.GetAndLock()

	c := helper.GetResp(input, input.UID, "mDict", CountVal)
	ci, _ := strconv.Atoi(c)
	ci++
	c = strconv.Itoa(ci)

	c2 := helper.GetResp(input, input.UID, "mDict", paramVal)
	ci2, _ := strconv.Atoi(c2)
	ci2++
	c2 = strconv.Itoa(ci2)

	input.PutSubVal(input.UID, "mDict", CountVal, c, paramVal, c2)
	input.PutAndUnlock()

	return map[string]any{"Hello": "Go"}
}

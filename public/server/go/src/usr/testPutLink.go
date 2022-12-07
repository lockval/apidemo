package usr

import (
	"GoPluginMagicModule/src/helper"

	"github.com/lockval/go2plugin"
)

func (e export) Export_testPutLink(input *go2plugin.Input) map[string]any {
	input.GetSubVal(input.UID, "mList", "")      //get nothing
	input.GetSubVal(input.UID, "mListSlave", "") //get nothing
	input.GetAndLock()

	first := helper.Any2type[string](input.Requ["first"])
	second := helper.Any2type[string](input.Requ["second"])

	input.PutSubVal(
		input.UID,
		"mList",
		"1", first,
		"2", second,
	).List(5).Link("mListSlave") //limit 5 and link mListSlave

	input.PutSubVal(
		input.UID,
		"mListSlave",
		"1", first+"_"+first,
		"2", second+"_"+second,
	).List(5)

	input.PutAndUnlock()

	return helper.RespEmpty
}

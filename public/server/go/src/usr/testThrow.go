package usr

import (
	"GoPluginMagicModule/src/helper"
	"strconv"

	"github.com/lockval/go2plugin"
)

func doSomething(input *go2plugin.Input) {
	input.Throw(2, "Nothing changed") // In any case, just call Throw, the call will be terminated
}

func (e export) Export_testThrow(input *go2plugin.Input) map[string]any {
	input.GetSubVal(input.UID, "mBase", "Count")
	input.GetAndLock()

	c := helper.GetResp(input, input.UID, "mBase", "Count")

	ci, _ := strconv.Atoi(c)
	ci++
	c = strconv.Itoa(ci)

	input.PutSubVal(input.UID, "mBase", "Count", c)

	doSomething(input)

	input.PutAndUnlock()

	return map[string]any{"Hello": "Go"}
}

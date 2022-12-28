package usr

import (
	"GoPluginMagicModule/src/globalThis"
	"GoPluginMagicModule/src/helper"

	"github.com/lockval/go2plugin"
)

func (e export) Export_testG(input *go2plugin.Input) map[string]any {

	// TODO conv to struct and get func Sum
	Sum := helper.Any2Func[func(string, string) string](globalThis.G, "Sum")
	c := Sum("a", "gg")
	return map[string]any{"c": c}
}

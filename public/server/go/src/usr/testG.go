package usr

import (
	"GoPluginMagicModule/src/globalThis"
	"GoPluginMagicModule/src/helper"

	"github.com/lockval/go2plugin"
)

func (e export) Export_testG(input *go2plugin.Input) map[string]any {

	Sum := helper.Any2Func[func(string, string) string](globalThis.G["lockval"], "Sum")
	c := Sum("a", "b")
	return map[string]any{"c": c, "lang": "Go"}
}

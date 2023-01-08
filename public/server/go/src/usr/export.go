package usr

import (
	"reflect"
	"strings"

	"github.com/lockval/go2plugin"
)

type export struct {
	m map[string]func(*go2plugin.Input) map[string]any
}

var Export export

func init() {
	Export.m = make(map[string]func(*go2plugin.Input) map[string]any)
	v := reflect.ValueOf(Export)
	t := reflect.TypeOf(Export)
	for i := 0; i < v.NumMethod(); i++ {
		// mv := v.Method(i)

		mt := t.Method(i)
		f, ok := v.Method(i).Interface().(func(*go2plugin.Input) map[string]any)
		if ok && strings.HasPrefix(mt.Name, "Export_") {
			callName := strings.ReplaceAll(mt.Name[7:], "__", "-")
			Export.m["usr/"+callName] = f
		}
	}
}

func (e *export) Range(f func(key string, val func(*go2plugin.Input) map[string]any)) {
	for k, v := range e.m {
		f(k, v)
	}
}

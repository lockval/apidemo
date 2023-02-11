package src

import (
	"github.com/lockval/go2plugin"
)

func Json(input *go2plugin.Input) map[string]any {
	return map[string]any{
		"aa":  "123",
		"old": input.Json,
	}
}

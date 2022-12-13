package src

import "github.com/lockval/go2plugin"

func Watch(input *go2plugin.Input) bool {
	if input.WATCHUID == "globalChat:the001" {
		return true // allow
	}
	return false // not allow
}

package usr

import (
	"GoPluginMagicModule/src/helper"

	"github.com/lockval/go2plugin"
)

func (e export) Export_testChat(input *go2plugin.Input) map[string]any {
	input.GetSubVal("globalChat:the001", "mChatList", "") //get nothing
	input.GetSubVal("globalChat:the001", "mChatID", "")   //get nothing
	input.GetAndLock()

	text := helper.Any2type[string](input.Requ["text"])

	input.PutSubVal(
		"globalChat:the001",
		"mChatList",
		"1", text,
	).List(20).Link("mChatID") //limit 20 and link mChatID

	input.PutSubVal(
		"globalChat:the001",
		"mChatID",
		"1", input.UID, //record my id
	).List(20) //limit 20

	input.PutAndUnlock()

	return helper.RespEmpty
}

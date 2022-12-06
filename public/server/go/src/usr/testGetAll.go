package usr

import (
	"github.com/lockval/go2plugin"
)

func (e export) Export_testGetAll(input *go2plugin.Input) map[string]any {
	input.GetSubVal(input.UID, "mList") //This is get all
	// input.GetSubVal(input.UID, "mList", "key1", "key2") //get "key1" and "key2"
	input.GetSubValAll(input.UID, "mList") //This is also get all

	input.GetAndLock()

	input.DiscardAndUnlock() // like PutAndUnlock, but does not modify any data

	resp := make(map[string]any)

	if _, ok := input.GetResp.IDKey[input.UID]; !ok {
		return resp
	}
	if _, ok := input.GetResp.IDKey[input.UID].KeySub["mList"]; !ok {
		return resp
	}

	for k, v := range input.GetResp.IDKey[input.UID].KeySub["mList"].SubVal {
		resp[k] = v
	}
	// or you can do
	// globalThis.Builtin.MapKeys(input.GetResp.IDKey[input.UID].KeySub["mList"].SubVal, func(k any) {
	// 	resp[k.(string)] = input.GetResp.IDKey[input.UID].KeySub["mList"].SubVal[k.(string)]
	// })

	return resp
}

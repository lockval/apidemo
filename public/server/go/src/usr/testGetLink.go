package usr

import (
	"github.com/lockval/go2plugin"
)

func (e export) Export_testGetLink(input *go2plugin.Input) map[string]any {
	input.GetSubVal(input.UID, "mList", "").Random(1).Link("mListSlave") //get Random and mListSlave is same key
	input.GetSubVal(input.UID, "mListSlave", "") 
	input.GetAndLock()
  
	input.DiscardAndUnlock()

	return map[string]any{"v": input.GetResp.IDKey[input.UID].KeySub}
}

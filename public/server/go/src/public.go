package src

import "github.com/lockval/go2plugin"

func Public(input *go2plugin.Input) map[string]any {
	// According to the prefix of the id, the corresponding key is publicized,
	// and the unpublished key will not be synchronized to the client
	return map[string]any{
		"player:": []string{
			"mBase",
			"mList",
			"mListSlave",
			"mDict",
		},
		"globalChat:": []string{
			"mChatList",
			"mChatID",
		},
	}
}

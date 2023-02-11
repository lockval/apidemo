package globalThis

var Builtin struct {
	MakeKSUID  func() string                     // MakeKSUID make a id
	MapKeys    func(m any, f func(key any))      // MapKeys range key from map
	WatchKick  func(watchuid string, uid string) // WatchKick kicked off uid in watchuid
	WatchClear func(watchuid string)             // WatchClear kicked off all in watchuid
}

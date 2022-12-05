package globalThis

var Builtin struct {
	MakeKSUID  func() string
	MapKeys    func(m any, f func(k any))
	WatchKick  func(watchuid string, uid string)
	WatchClear func(watchuid string)
}

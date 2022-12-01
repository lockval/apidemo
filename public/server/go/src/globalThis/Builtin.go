package globalThis

var Builtin struct {
	MakeKSUID  func() string
	MapKeys    any
	WatchKick  any
	WatchClear any
}

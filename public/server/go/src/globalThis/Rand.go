package globalThis

var Rand struct {
	ExpFloat64  func() float64
	Float32     func() float32
	Float64     func() float64
	Int         func() int
	Int31       func() int32
	Int31n      func(n int32) int32
	Int63       func() int64
	Int63n      func(n int64) int64
	Intn        func(n int) int
	NormFloat64 func() float64
	Perm        func(n int) []int
	Seed        func(seed int64)
	Uint32      func() uint32
	Uint64      func() uint64
}

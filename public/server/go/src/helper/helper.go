package helper

import (
	"reflect"

	"github.com/lockval/go2plugin"
)

func Any2type[T any](v any) (ret T) {
	if v != nil {
		ret, _ = v.(T)
	}
	return
}

type ANY[T any] struct {
	V any
}

func (v ANY[T]) Map(k string) ANY[T] {
	if v.V != nil {
		m, _ := v.V.(map[string]any)
		if m != nil {
			return ANY[T]{V: m[k]}
		}
		return v
	}
	return v
}

func (v ANY[T]) Slice(idx int) ANY[T] {
	if v.V != nil {
		s, _ := v.V.([]any)
		if s != nil {
			return ANY[T]{V: s[idx]}
		}
		return v
	}
	return v
}

func (v ANY[T]) Value() (ret T) {
	if v.V != nil {
		ret, _ = v.V.(T)
	}
	return
}

func Any2Func[T any](v any, funcName string) (ret T) {
	if v != nil {
		sr := reflect.ValueOf(v)
		if sr.Kind() == reflect.Struct {
			fr := sr.FieldByName(funcName)
			if !fr.IsZero() {
				return fr.Interface().(T)
			}
		}

	}
	return
}

func Any2ANY[T any](v any) ANY[T] {
	return ANY[T]{V: v}
}

func GetResp(input *go2plugin.Input, IDKey, KeySub, SubVal string) string {
	k, ok := input.GetResp.IDKey[IDKey]
	if !ok {
		return ""
	}
	if k.KeySub == nil {
		return ""
	}

	s, ok := k.KeySub[KeySub]
	if !ok {
		return ""
	}
	if s.SubVal == nil {
		return ""
	}

	v, ok := s.SubVal[SubVal]
	if !ok {
		return ""
	}
	return v
}

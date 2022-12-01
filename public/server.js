define("init", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main() {
        return {
            "player:": ["mBase", "mList", "mListSlave"],
        };
    }
    exports.main = main;
});
define("login", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main(input) { }
    exports.main = main;
});
define("watch", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main(input) {
        return false;
    }
    exports.main = main;
});
define("usr/testBaseCount", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main(input) {
        var _a, _b;
        input.GetSubVal(input.UID, "mBase", "Count");
        input.GetAndLock();
        var c = (_b = (_a = input.GetResp.IDKey[input.UID]) === null || _a === void 0 ? void 0 : _a.KeySub["mBase"]) === null || _b === void 0 ? void 0 : _b.SubVal["Count"];
        var ci = Number(c);
        ci++;
        c = ci.toString();
        input.PutSubVal(input.UID, "mBase", "Count", c);
        input.PutAndUnlock();
        return {};
    }
    exports.main = main;
});
define("usr/testClearData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main(input) {
        input.GetSubVal(input.UID, "mList", ""); //get nothing
        input.GetAndLock();
        input.PutSubVal(input.UID, "mList", "1", "mydata").List(0).Clear(); //clear and push data
        input.PutAndUnlock();
        return {};
    }
    exports.main = main;
});
define("usr/testGetAll", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main(input) {
        var _a, _b, _c, _d;
        input.GetSubVal(input.UID, "mList"); //get all
        // input.GetSubVal(input.UID, "mList","key1","key2"); //get "key1" and "key2"
        input.GetSubValAll(input.UID, "mList"); //get all
        input.GetAndLock();
        input.DiscardAndUnlock();
        var resp = {};
        for (var k in (_b = (_a = input.GetResp.IDKey[input.UID]) === null || _a === void 0 ? void 0 : _a.KeySub["mList"]) === null || _b === void 0 ? void 0 : _b.SubVal) {
            resp[k] = (_d = (_c = input.GetResp.IDKey[input.UID]) === null || _c === void 0 ? void 0 : _c.KeySub["mList"]) === null || _d === void 0 ? void 0 : _d.SubVal[k];
        }
        return resp;
    }
    exports.main = main;
});
define("usr/testListQueue", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main(input) {
        input.GetSubVal(input.UID, "mList", ""); //get nothing
        input.GetAndLock();
        input.PutSubVal(input.UID, "mList", "1", input.Requ.first, "2", input.Requ.second).List(5); //limit 5
        input.PutAndUnlock();
        return {};
    }
    exports.main = main;
});
define("usr/testListStack", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main(input) {
        input.GetSubVal(input.UID, "mList", ""); //get nothing
        input.GetAndLock();
        input.PutSubVal(input.UID, "mList", "1", "A", "2", "B").List(-input.Requ.n); //Note that here are negative numbers
        input.PutAndUnlock();
        return {};
    }
    exports.main = main;
});
define("usr/testPutLink", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main(input) {
        input.GetSubVal(input.UID, "mList", ""); //get nothing
        input.GetSubVal(input.UID, "mListSlave", ""); //get nothing
        input.GetAndLock();
        input.PutSubVal(input.UID, "mList", "1", input.Requ.first, "2", input.Requ.second).List(5).Link("mListSlave"); //limit 5 and link mListSlave
        input.PutSubVal(input.UID, "mListSlave", "1", input.Requ.first + "_" + input.Requ.first, "2", input.Requ.second + "_" + input.Requ.second).List(5);
        input.PutAndUnlock();
        return {};
    }
    exports.main = main;
});
define("usr/testRequResp", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main(input) {
        var resp = {
            resp1: input.Requ.param1,
            resp2: input.Requ.param2,
            resp3: input.Requ.param3,
        };
        return resp;
    }
    exports.main = main;
});
define("usr/testThrow", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main(input) {
        var _a, _b;
        input.GetSubVal(input.UID, "mBase", "Count");
        input.GetAndLock();
        var c = (_b = (_a = input.GetResp.IDKey[input.UID]) === null || _a === void 0 ? void 0 : _a.KeySub["mBase"]) === null || _b === void 0 ? void 0 : _b.SubVal["Count"];
        var ci = Number(c);
        ci++;
        c = ci.toString();
        input.Throw(2, "my message");
        input.PutSubVal(input.UID, "mBase", "Count", c);
        input.PutAndUnlock();
        return {};
    }
    exports.main = main;
});

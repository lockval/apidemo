declare type notUndefined = string | number | boolean | symbol | object;
export declare interface Dict<T extends notUndefined = notUndefined> {
  [key: string]: T | undefined;
}

export declare class PutRespSub {
  SubVal: Dict<string>; // In List mode, the modified data will be returned
  Index: number; // current revision number
}
export declare class PutRespKey {
  KeySub: Dict<PutRespSub>;
}
export declare class PutAndUnlockResp {
  IDKey: Dict<PutRespKey>;
}

export declare class GetRespSub {
  SubVal: Dict<string>; //KV query returns
  Range: Dict<string>; //Range query returns
  Search: Dict<string>; //Search query returns
  Max: Dict<string>; //Max query returns
  Min: Dict<string>; //Min query returns
  Random: Dict<string>; //Random query returns
  Unique: Dict<string>; //Unique query returns
  Group: Dict<number>; //Count the number of same value
  Len: number; //total number
  Sum: number; //sum all values
}
export declare class GetRespKey {
  KeySub: Dict<GetRespSub>;
}
export declare class GetAndLockResp {
  IDKey: Dict<GetRespKey>;
}

export declare class GetOpt {
  // Link Associate related KeySub returns SubVal
  Link(...slaveKeys: string[]): GetOpt;
  // Max Find v pieces of data not greater than num
  Max(num: number, v: number): GetOpt;
  // Min Find v pieces of data not less than num
  Min(num: number, v: number): GetOpt;
  // Range >0: Get v pieces of data from back to front
  // Range <0: Get v pieces of data from front to back
  Range(v: number): GetOpt;
  // Search Find data with the same value as v
  Search(v: string): GetOpt;
  // Random Get v pieces of data
  Random(v: number): GetOpt;
  // Sum sum all values
  Sum(): GetOpt;
  // Len total number
  Len(): GetOpt;
  // Unique Get data with unique values
  Unique(): GetOpt;
  // Group Count the number of same value
  Group(): GetOpt;
}
export declare class PutOpt {
  // Clear Clear all kv
  Clear(): PutOpt;
  // List mode
  // <=0 First pop up the val pieces behind the old data
  //  >0 Limit up to val pieces of data, Excess data will be shift out from the front
  List(val: number): PutOpt;
  // Link Associate the related KeySub's put
  Link(...slaveKeys: string[]): PutOpt;
}

export declare class DBOperate<T> {
  UID: string; // which user invoked(call,login)
  KSUID: string; // This is the unique ID of the system call, if there is no value, it must be the user's call(system call)
  Info: string; // This is the Info you brought over when you logged in.(login)
  WATCHUID: string; // This is the observer's ID(watch)
  Requ: T; // User Request Parameters(call)

  // GetAndLock data returns here
  GetResp: GetAndLockResp;

  // Throw throw an error to the client
  Throw(Code: number, Error: string): void;

  // Log Output an arbitrary data to the console
  Log(s: any): void;

  // Sleep Call cmd("xxx/xxx", obj) after timing ms, ksuid:must have value
  Sleep(ms: number, ksuid: string, cmd: string, obj: any): void;

  // GetAndLock Acquire and lock (can only be called once)
  GetAndLock(): void;

  // DiscardAndUnlock discard all edits (can only be called once)
  DiscardAndUnlock(): PutAndUnlockResp;

  // PutAndUnlock change and unlock (can only be called once)
  PutAndUnlock(): PutAndUnlockResp;

  // GetSubValAll Get all the data of the key
  GetSubValAll(id: string, key: string): GetOpt;

  // GetSubVal Get some data, when the subkeys are empty, it is to get all
  GetSubVal(id: string, key: string, ...subkeys: string[]): GetOpt;

  // PutSubVal set key value
  PutSubVal(id: string, key: string, ...kvs: string[]): PutOpt;
}

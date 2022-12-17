import { Dict, DBOperate } from "../libs/lockvalserver"

export function main(input: DBOperate<any>) {
	//Execute "sys/testItsTime" after setting 3 seconds, pass parameter {n:2}
	input.Sleep(3000, "uuidXXXX", "sys/testItsTime",{"n": 2})
  return {}
}

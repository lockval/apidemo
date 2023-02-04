import { Dict, DBOperate } from "../libs/lockvalserver"

export function main(input: DBOperate<any>) {
	let c=globalThis.G["lockval"].Sum("a","b")
	return {"c":c,"lang":"JS"}
}

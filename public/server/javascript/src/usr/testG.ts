import { Dict, DBOperate } from "../libs/lockvalserver"

export function main(input: DBOperate<any>) {
	let c=globalThis.G.Sum("a","b")
	return {"c":c}
}

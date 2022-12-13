import { Dict, DBOperate } from "./libs/lockvalserver"

export function main(input: DBOperate<null>) {
  if(input.WATCHUID=="globalChat:the001"){
    return true // allow
  }
  return false // not allow
}

export function main() {
  // According to the prefix of the id, the corresponding key is publicized, 
  // and the unpublished key will not be synchronized to the client
  return {
    "player:": [
      "mBase",
      "mList",
      "mListSlave",
    ],
  }
}

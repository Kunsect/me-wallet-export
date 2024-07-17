import { WalletManager } from './wallet'
import 'dotenv/config'

const { START_PATH_INDEX, MAX_PATH_INDEX } = process.env

let pathIndex: number = Number(START_PATH_INDEX)
const maxPathIndex: number = Number(MAX_PATH_INDEX)

for (let index = pathIndex; index <= maxPathIndex; index++) {
  const wallet = new WalletManager(index)
  const taproot = wallet.taprootWallet
  const p2wpkh = wallet.p2wpkhWallet

  console.log(`---- Account ${index + 1} ----`)
  console.log(`[Taproot]\naddress: ${taproot.address}\nprivate key: ${taproot.childNode.toWIF()}\n`)
  console.log(`[P2WPKH]\naddress: ${p2wpkh.address}\nprivate key: ${p2wpkh.childNode.toWIF()}\n\n`)
}

import * as bitcoin from 'bitcoinjs-lib'
import * as bip39 from 'bip39'
import * as ecc from 'tiny-secp256k1'
import BIP32Factory, { BIP32Interface } from 'bip32'
import 'dotenv/config'

const MNEMONIC = process.env.MNEMONIC!

bitcoin.initEccLib(ecc)
const bip32 = BIP32Factory(ecc)

export interface ITaprootWallet {
  address: string
  path: string
  childNode: BIP32Interface
  payment: bitcoin.Payment
  internalPubkey: Buffer
  tweakedChildNode: bitcoin.Signer
}

export interface IP2WPKHWallet {
  address: string
  path: string
  childNode: BIP32Interface
  payment: bitcoin.Payment
}

export class WalletManager {
  pathIndex: number

  taprootWallet: ITaprootWallet
  p2wpkhWallet: IP2WPKHWallet

  constructor(pathIndex: number) {
    this.pathIndex = pathIndex

    this.taprootWallet = this.getTaprootWallet()
    this.p2wpkhWallet = this.getP2WPKHWallet()
  }

  private getTaprootWallet(): ITaprootWallet {
    const seed = bip39.mnemonicToSeedSync(MNEMONIC)
    const rootKey = bip32.fromSeed(seed)

    const path = `m/86'/0'/${this.pathIndex}'/0/0`
    const childNode = rootKey.derivePath(path)
    const internalPubkey = childNode.publicKey.subarray(1, 33)

    const payment = bitcoin.payments.p2tr({ internalPubkey })

    const tweakedChildNode = childNode.tweak(bitcoin.crypto.taggedHash('TapTweak', internalPubkey))

    return {
      address: payment.address!,
      path,
      payment,
      childNode,
      internalPubkey,
      tweakedChildNode
    }
  }

  private getP2WPKHWallet(): IP2WPKHWallet {
    const seed = bip39.mnemonicToSeedSync(MNEMONIC)
    const rootKey = bip32.fromSeed(seed)

    const path = `m/84'/0'/${this.pathIndex}'/0/0`
    const childNode = rootKey.derivePath(path)
    const { address } = bitcoin.payments.p2wpkh({ pubkey: childNode.publicKey })

    return {
      address: address!,
      path,
      childNode,
      payment: bitcoin.payments.p2wpkh({ pubkey: childNode.publicKey })
    }
  }
}

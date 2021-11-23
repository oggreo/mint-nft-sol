import { actions, Wallet } from '@metaplex/js'
import { PublicKey } from '@solana/web3.js'
import useCluster from '@/composables/cluster'
import { stringifyPubkeysAndBNsInObject } from './helpers/util'
const { getConnection } = useCluster()

// connection, walet, transactions, signers, options
export async function NFTMintMaster (wallet, uri, maxSupply) {
  const connection = getConnection()
  const result = await actions.mintNFT({
    connection,
    wallet,
    uri,
    maxSupply
  })
  const strResult = stringifyPubkeysAndBNsInObject(result)
  console.log('Minted a new master NFT ', strResult)
  return strResult
}

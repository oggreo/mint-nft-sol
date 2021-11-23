<template>
  <div class="with-title">
      Type of NFT to mint:
    <div class="text-gray-400 mt-2 flex justify-around">
      <label>
        <input type="radio" value="master" v-model="chosenNFTType" />
        <span>Master Edition</span>
      </label>
<!--      <label>-->
<!--        <input type="radio" value="print" v-model="chosenNFTType" />-->
<!--        <span>[Not working yet] Standard Edition (Print)</span>-->
<!--      </label>-->
    </div>
  </div>
  <form v-if="chosenNFTType === 'master'" class="mt-10" @submit.prevent="mintNewMaster">
<!--    {{ uri }}-->
<!--    <div class="nes-field">-->
<!--      <div>-->
<!--        <label for="uri">Arweave / IPFS URI:</label>-->
<!--      </div>-->
<!--      <input type="text" id="uri" class="nes-input"  />-->
<!--    </div>-->
    <div class="mt-5">
      <label for="maxSupply">Max Supply (leave blank for uncapped): </label>
      <input
        type="number"
        id="maxSupply"
        class="border-gray-400 border-solid border-2 w-3/4 md:w-auto"
        v-model="maxSupply"
      />
    </div>
    <button
      class="is-primary mt-6 mb-3 border-2 border-black border-solid hover:bg-gray-700 bg-white hover:text-white text-black font-bold py-2 px-4 rounded"
      :class="{ 'is-disabled': !isConnected && uri !== null }"
      :disabled="!isConnected || uri === null"
      type="submit"
      @click="buttonClicked"
    >
      Mint new Master NFT
    </button>
  </form>
  <!-- Feature in progress -->
  <!--  <label for="toAddress">To address:</label>-->
  <!--  <input id='toAddress' type="text" v-model="toAddress" />-->
  <!--  <button-->
  <!--      class="nes-btn is-primary mt-5"-->
  <!--      :disabled="!isConnected || uri === null"-->
  <!--      type="submit"-->
  <!--      @click="sendNFT"-->
  <!--    >-->
  <!--      Send NFT to this address-->
  <!--    </button>-->
  <div
    v-if="mintResults"
    >
    <p>
      NFT successfully minted !
    </p>
<!--    <p>-->
<!--      {{ mintResults }}-->
<!--      {{ newNFT }}-->
<!--    </p>-->
  </div>
  <div
    v-else
  >
    <p
      v-if="buttonClicked"
    >
      ...Loading
    </p>
  </div>

</template>

<script>
import { ref, defineComponent } from 'vue'
import useError from '../composables/error'
import { NFTMintMaster } from '../common/NFTmint'
import useWallet from '@/composables/wallet'
import useCluster from '@/composables/cluster'
import { NFTGet, TokenGet } from '@/common/NFTGet'
import { Connection, PublicKey, Transaction, Keypair, sendAndConfirmTransaction } from '@solana/web3.js'
import { DEFAULTS } from '../global'
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'

export default defineComponent({
  name: 'NFTMintForm',
  data () {
    return {
      Transaction: Transaction,
      toAddress: null,
      tokenProgramId: TOKEN_PROGRAM_ID,
      buttonClicked: false
    }
  },
  props: {
    uri: {
      type: String,
      required: true
    }
  },
  methods: {
    async sendNFT () {
      if (!this.newToken) {
        return
      }
      const fromTokenAccount = await this.newToken.token.getOrCreateAssociatedAccountInfo(
        this.fromWalletAddress
      )
      const toTokenAccount = await this.newToken.token.getOrCreateAssociatedAccountInfo(
        // this needs to be type PublicKey
        new PublicKey(this.toAddress)
      )
      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          this.tokenProgramId,
          fromTokenAccount.address,
          toTokenAccount.address,
          this.fromWalletAddress,
          [],
          1
        )
      )
      // ths wallet address seems wrong
      // Sign transaction, broadcast, and confirm
      // ...signers: Array<Account>
      // this is already leaked key
      const tempKeypair = Keypair.fromSecretKey(
        Uint8Array.from([
          208, 175, 150, 242, 88, 34, 108, 88, 177, 16, 168, 75, 115, 181, 199, 242, 120, 4, 78, 75, 19,
          227, 13, 215, 184, 108, 226, 53, 111, 149, 179, 84, 137, 121, 79, 1, 160, 223, 124, 241, 202,
          203, 220, 237, 50, 242, 57, 158, 226, 207, 203, 188, 43, 28, 70, 110, 214, 234, 251, 15, 249,
          157, 62, 80
        ])
      )
      const { getClusterURL } = useCluster()
      const connection = new Connection(getClusterURL(), 'confirmed')
      try {
        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [tempKeypair], // might work with this.fromWallet?
          { commitment: 'confirmed' }
        )
      } catch (e) {
        console.log('error', e)
      }
    }
  },
  setup (props) {
    const { isConnected, getWallet, getWalletAddress } = useWallet()
    const { error, clearError, setError, tryConvertToPk } = useError()
    const { getConnection } = useCluster()
    const isLoading = ref(false)
    const mintResults = ref(null)
    const chosenNFTType = ref('master')
    const newNFT = ref(null)
    const newToken = ref(null)
    const fromWalletAddress = ref(null)
    const fromWallet = ref(null)
    const connection = ref(null)

    const clearPreviousResults = () => {
      isLoading.value = false
      mintResults.value = null
      newNFT.value = null
      clearError()
    }
    // -------------------------------- master
    // const uri = ref(null)
    const maxSupply = ref(null)

    const mintNewMaster = async () => {
      clearPreviousResults()
      isLoading.value = true

      // added
      fromWallet.value = getWallet()

      // added
      connection.value = getConnection()
      NFTMintMaster(getWallet(), props.uri, maxSupply.value)
        .then(async (result) => {
          mintResults.value = result
          isLoading.value = false
          await fetchNewNFT()
          // uncomment this for the new feature
          // await fetchNewToken()
        })
        .catch((e) => {
          setError(e)
          isLoading.value = false
        })
    }

    const fetchNewToken = async () => {
      // this will keep failing, while the network updates, for a while so keep retrying
      try {
        const [token] = await TokenGet({
          mint: new PublicKey(mintResults.value.mint)
        })
        newToken.value = token
        fromWalletAddress.value = getWalletAddress()
      } catch (e) {
        await fetchNewToken()
      }
    }
    const fetchNewNFT = async () => {
      // this will keep failing, while the network updates, for a while so keep retrying
      try {
        [newNFT.value] = await NFTGet({
          mint: new PublicKey(mintResults.value.mint)
        })
      } catch (e) {
        await fetchNewNFT()
      }
    }
    return {
      DEFAULTS,
      fromWallet,
      isConnected,
      error,
      chosenNFTType,
      isLoading,
      mintResults,
      newNFT,
      newToken,
      fromWalletAddress,
      connection,
      // master
      maxSupply,
      mintNewMaster
    }
  }
})
</script>

<style scoped>

</style>

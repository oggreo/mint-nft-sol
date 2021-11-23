<template>
  <div id="home" class="grid grid-cols-12 mb-10">
    <div class="col-start-2 col-end-12">
      <div class="border-gray-600 border-b-2 border-solid py-5 flex justify-start">
        <h1 class="text-xl">
          MINT YOUR NFT ON
          <span class="bg-black text-white px-4">
            Solana
          </span>
        </h1>
      </div>
      <div class="grid grid-cols-10 mt-10">
        <div class="px-4 py-2 text-4xl lg:text-7xl font-black col-start-4 col-end-8 text-left break-word bg-black text-white italic">
          HOW TO <br> MINT YOUR NFT <br> ON SOLANA
        </div>
      </div>
      <div class="grid grid-cols-10 mt-6">
        <p class="col-start-2 col-end-10 my-6 break-word text-left">
          This is a simple app to create an NFT on the Solana blockchain.
          It requires no pre-knowledge to use this app. The app is developed with Solana and metaplex js SDK.
          Front-end written with Vue.js.
          This is meant to be for learning purposes.
        </p>
      </div>
      <div class="grid grid-cols-10 rows-3">
        <p class="my-2">
          1.
        </p>
        <p class="col-start-2 col-end-10 my-2 break-word text-left">
          To get started, first you need a SOLANA wallet.
          My recommendation is Phantom which can be downloaded
          <a href="https://phantom.app/" class="font-bold underline" target="_blank">here</a>.
          If you already have one you can skip this part.
        </p>
        <p class="col-start-2 col-end-10 my-2 break-word text-left row-start-2">
          Copy and paste your wallet address (public key) here:
        </p>
        <div class="py-4 col-start-2 col-end-10 row-start-3">
          <input
            placeholder="6aiB61NTeXcQBV7yCiQvxPfo1wnQrr7ti2tPZ5FzHbGz"
            id="uploadedFile"
            v-model="publicKey"
            class="w-3/4 focus:outline-none focus:shadow-outline py-2 px-2 border-black border-2 border-solid"
            type="text"
            ref='uploadedFile'>
        </div>
      </div>

      <div class="grid grid-cols-10 rows-3">
        <p class="my-2">
          2.
        </p>
        <p class="col-start-2 col-end-10 my-2 break-word text-left">
          Next, you need to create an Arweave account.
          Follow the instructions <a href="https://faucet.arweave.net/" class="font-bold underline" target="_blank">here</a> to get free AR.
          You'll need some to get started.
        </p>
        <p class="col-start-2 col-end-10 my-2 break-word text-left row-start-2">
          Make sure to save your new Arweave wallet (.JSON key file). You will need to feed it in the app to
          upload your assets to permaweb.
          <br>
          (Ideally this should be done by authenticating through the browser extension wallet but I haven't
          figured out how to do that yet. If you know how to, DM me on Twitter or send me a PR).
        </p>
        <p class="col-start-2 col-end-10 my-2 break-word text-left row-start-3">
          It usually takes a bit of time until they airdrop you some Arweave so don't panic if you don't get them
          right away.
          <br>
          Once you got it, select your wallet .json here. This wallet will be used locally and will not get sent
          to a server (You can check the code).
        </p>
      </div>

      <div class="grid grid-cols-10 rows-3">
        <p class="my-2">
          3.
        </p>
        <p class="col-start-2 col-end-10 my-2 break-word text-left">
          The asset to be minted was stored on the permaweb, a decentralised immutable storage.
          You can read more about permaweb <a href="https://arweave.medium.com/welcome-to-the-permaweb-ce0e6c73ddfb" class="font-bold underline" target="_blank">here</a>.
        </p>
        <p class="col-start-2 col-end-10 my-2 break-word text-left row-start-2">
          The asset metadata has to conform to a certain standard <a href="https://arweave.medium.com/welcome-to-the-permaweb-ce0e6c73ddfb" class="font-bold underline" target="_blank">standard</a>.
          You can check the metadata of your asset by clicking 'Check here' next to the metadata url.
          Assuming Arweave upload was successful.
        </p>
      </div>
      <div class="grid grid-cols-10 my-10">
        <arweave-upload
          class="col-start-3 col-end-9 border border-solid border-black border-2"
          @imageUploaded="setMetaURI($event)"
          :publicKey="this.publicKey"
        />
        <div
          v-if="metaUri"
        >
        </div>
      </div>
      <div class="grid grid-cols-10 rows-3">
        <p class="my-2">
          4.
        </p>
        <p class="col-start-2 col-end-10 my-2 break-word text-left">
          Now let's open your Phantom wallet and switch to Devnet. Currently chosen Mainnet uses 'actual' SOL
          which is very expensive, so instead we can use a 'testing' network that allows us to play around for free.
          <br>
        </p>
        <ul class="col-start-2 col-end-10 my-2 break-word text-left row-start-2">
          <li>1. Open Phantom</li>
          <li>2. Go to the Settings tab (far right, cog icon)</li>
          <li>3. Click "Change Network"</li>
          <li>4. Change to Devnet</li>
        </ul>
        <p class="col-start-2 col-end-10 my-2 break-word text-left row-start-3">
          Once you are done, air-drop yourself some SOL using a <a href="https://solfaucet.com/" class="font-bold underline" target="_blank">faucet</a>
          and make yourself feel rich (and we also need some for minting)!
          <br>
        </p>
      </div>
      <div class="grid grid-cols-10 rows-3">
        <p class="my-2">
          5.
        </p>
        <p class="col-start-2 col-end-10 my-2 break-word text-left">
          Now comes the fun part. Choose Devnet as the network and connect your Phantom wallet.
          Set a max supply and click 'Mint new Master NFT'!
          <br>
        </p>
      </div>
      <div class="grid grid-cols-10 rows-3 my-10">
        <div
          class="col-start-4 col-end-8 border-black border-2 border-solid py-4"
        >
          <div class="text-xl py-4 font-bold">
            Choose Network: 'Devnet' and Wallet: 'Phantom'
          </div>
          <config-pane
            class="mt-4 col-start-4 col-end-8 row-start-2"
          />
          <NFTMintForm
            class="row-start-3"
            :uri="metaUri"
          />
        </div>
       </div>
      <div class="grid grid-cols-10 rows-3">
        <p class="my-2">
          6.
        </p>
        <p class="col-start-2 col-end-10 my-2 break-word text-left">
          We did it! We minted our first NFT on Solana. It should appear in your wallet now.
          You can check the NFT by going to your wallet and clicking
          The 'Your Collectibles' tab (the second tab on Phantom).
          <br>
        </p>
      </div>
    </div>
  </div>
  <Footer/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ArweaveUpload from '@/components/ArweaveUpload.vue'
import NFTMintForm from '@/components/NFTMintForm.vue'
import { DEFAULTS } from '@/global'
import ConfigPane from '@/components/ConfigPane.vue'
import Footer from "@/components/Footer.vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  components: {
    Footer,
    ConfigPane,
    NFTMintForm,
    ArweaveUpload
  },
  data () {
    return {
      publicKey: null,
      chosenNFTType: 'master',
      metaUri: null
    }
  },
  methods: {
    setMetaURI (metaUri: any) {
      console.log('metaUri', metaUri)
      this.metaUri = metaUri
    }
  }
})
</script>

<style>
#home {
  font-family: 'Inter', sans-serif;
}
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200&display=swap');
</style>

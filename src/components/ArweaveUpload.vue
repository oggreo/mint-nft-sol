<template>
  <div>
    <div class=" my-4 flex justify-start flex-col">
      <h2 class="mt-1 py-4 px-2 text-xl text-left">Select your Arweave wallet .JSON file</h2>
      <input class="py-2 px-2" type="file" ref='uploadedFile' @change="onFileClick">
      <h2 class="py-4 px-2 text-xl text-left">Select the PNG image that you want to mint</h2>
      <input class="py-2 px-2" type="file" @change="onImageSelected">
      <div class="flex justify-around">
        <button
        :class="[this.publicKey === '' || this.publicKey === null ? 'pointer-events-none' : 'pointer-events-auto']"
        class="my-5"
        @click.prevent="uploadToArweave"
      >
        <span
          v-if="this.publicKey === '' || this.publicKey === null"
          class="font-light text-md"
        >
          Provide wallet address
        </span>
        <span
          v-else
          class="font-bold underline text-2xl w-12"
        >
          Upload
        </span>
      </button>
      </div>
    </div>
    <!-- Error -->
    <div v-if="error === true">
      There is an error! Make sure your wallet address is correct,
      selected the correct wallet .JSON file, or the image is in PNG (non-image file, or other extensions will fail).
    </div>
    <!--  Loading  -->
    <div v-if="isUploading === true">
      ...Loading
    </div>
    <!--  Notification  -->
    <div v-if="imageUrl">
      Image successfully uploaded to Arweave!
      <a v-if="imageUrl" :href="this.imageUrl" class="font-bold underline"> Check here </a>
    </div>
    <br>
    <div v-if="metaUrl" class="mb-5">
      MetaData successfully uploaded to Arweave!
      <a v-if="metaUrl" :href="this.metaUrl" class="font-bold underline"> Check here </a>
    </div>
  </div>
</template>

<script>
import Arweave from 'arweave'
import fs from 'fs'

export default {
  name: 'JsonUpload',
  props: {
    publicKey: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      error: null,
      arweave:
        Arweave.init({
          host: 'arweave.net', // Hostname or IP address for a Arweave host
          port: 443, // Port
          protocol: 'https', // Network protocol http or https
          timeout: 20000, // Network request timeouts in milliseconds
          logging: false // Enable network request logging
        }),
      imageUrl: null,
      metaUrl: null,
      wallet: null,
      image: null,
      blob: null,
      isUploading: false,
      meta: [
        {
          Name: '0000',
          personality: 'rad'
        }
      ]
    }
  },
  methods: {
    async runUploadOnArweave (data, contentType, isUploadByChunk = false) {
      const tx = await this.arweave.createTransaction({ data: data }, this.wallet)
      tx.addTag(...contentType)
      await this.arweave.transactions.sign(tx, this.wallet)
      if (isUploadByChunk) {
        const uploader = await this.arweave.transactions.getUploader(tx)
        while (!uploader.isComplete) {
          await uploader.uploadChunk()
          console.log(
           `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
          )
        }
      }
      await this.arweave.transactions.post(tx)
      return tx
    },
    getNFTName (name) {
      return `NFT #${name}`
    },
    getMetadata (name, imageUrl, attributes) {
      return {
        name: this.getNFTName(name),
        symbol: '',
        description: 'My very first NFT',
        seller_fee_basis_points: 500,
        external_url: '',
        attributes,
        collection: {
          name: 'My first NFT',
          family: 'My-first-NFT'
        },
        properties: {
          files: [
            {
              uri: imageUrl,
              type: 'image/png'
            }
          ],
          category: 'image',
          maxSupply: 0,
          creators: [
            {
              address: this.publicKey,
              share: 100
            }
          ]
        },
        image: imageUrl
      }
    },
    getAttributes (props) {
      // map attributes to the proper key/value objects
      const attrs = Object.keys(props).map((key) => {
        return {
          trait_type: key,
          value: props[key]
        }
      })
      return attrs
    },
    onImageSelected (e) {
      if (!e.target.files) {
        return
      }
      const files = e.target.files
      console.log('image', files[0])
      if (files[0].type !== 'image/png') {
        return
      }
      this.file = files[0]
      this.file.arrayBuffer().then(async (arrayBuffer) => {
        const blob = new Blob([new Uint8Array(arrayBuffer)], { type: this.file.type })
        const buffer = await blob.arrayBuffer()
        this.blob = buffer
      })
      this.image = URL.createObjectURL(files[0])
      // console.log('image', this.image)
      // console.log('image', typeof this.image)
      // const fr = new FileReader()
      // var fileBuffer = Buffer.from(this.file)
      // console.log('1', fr.readAsArrayBuffer(this.image))
      // console.log('2', fr.readAsArrayBuffer(this.file))
    },
    startUpload () {
      this.isUploading = true
      this.error = false
    },
    async uploadToArweave () {
      try{
        this.startUpload()
        for (const row of this.meta) {
          // upload image
          const { Name: name, ...props } = row
          const nameByNumber = Number.parseInt(name)
          const newItem = {}
          const contentType = ['Content-Type', 'image/png']
          const data = this.blob
          const { id } = await this.runUploadOnArweave(data, contentType, true)
          const imageUrl = id ? `https://arweave.net/${id}` : undefined
          console.log('imageUrl', imageUrl)
          this.imageUrl = imageUrl
          // upload meta
          const attributes = this.getAttributes(props)
          const metadata = this.getMetadata(name, imageUrl, attributes)
          const metaContentType = ['Content-Type', 'application/json']
          const metadataString = JSON.stringify(metadata)
          const { id: metadataId } = await this.runUploadOnArweave(
            metadataString,
            metaContentType
          )
          const metadataUrl = id
            ? `https://arweave.net/${metadataId}`
            : undefined
          this.metaUrl = metadataUrl
          this.isUploading = false
          this.$emit('imageUploaded', metadataUrl)
        }
      } catch (e) {
        console.log('e', e)
        this.error = true
        this.isUploading = false
      }
    },
    onFileClick (e) {
      if (!e.target.files) {
        return
      }
      const files = e.target.files
      // Create a new FileReader() object
      const reader = new FileReader()
      // Read the file
      reader.onload = e => {
        const result = JSON.parse(e.target.result)
        const formatted = JSON.stringify(result, null, 2)
        this.wallet = result
      }
      reader.readAsText(files[0])
    }
  }
}
</script>

<style scoped>

</style>

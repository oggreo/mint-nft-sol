<template>
    <div class="flex justify-around mb-10">
      <div class="flex flex-col lg:flex-row">
        <div class="is-dark lg:pr-10">
          <select required id="cluster" v-model="chosenCluster">
            <option class="text-gray-500" :value="null">Choose net...</option>
            <option :value="Cluster.Mainnet">Mainnet</option>
            <option :value="Cluster.Devnet">Devnet</option>
            <option :value="Cluster.Testnet">Testnet</option>
            <option :value="Cluster.Localnet">Localnet</option>
          </select>
        </div>
        <div class="is-dark">
          <select required id="wallet" v-model="chosenWallet">
            <option class="text-gray-500" :value="null">Choose wallet..</option>
            <option :value="WalletName.Phantom">Phantom</option>
    <!--        <option :value="WalletName.Sollet">Sollet</option>-->
    <!--        <option :value="WalletName.SolletExtension">Sollet Extension</option>-->
    <!--        <option :value="WalletName.Solflare">Solflare</option>-->
    <!--        <option :value="WalletName.SolflareWeb">Solflare Web</option>-->
          </select>
        </div>
      </div>
  </div>

</template>

<script>
import { computed, defineComponent } from 'vue'
import { WalletName } from '@solana/wallet-adapter-wallets'
import useCluster, { Cluster } from '../composables/cluster'
import useWallet from '../composables/wallet'

export default defineComponent({
  setup () {
    const { cluster, setCluster, getClusterURL } = useCluster()
    const chosenCluster = computed({
      get () {
        return cluster.value
      },
      set (newVal) {
        setCluster(newVal)
      }
    })

    const { getWalletName, setWallet } = useWallet()
    const chosenWallet = computed({
      get () {
        return getWalletName()
      },
      set (newVal) {
        setWallet(newVal, getClusterURL())
      }
    })
    return {
      Cluster,
      chosenCluster,
      WalletName,
      chosenWallet
    }
  }
})
</script>

<style scoped>

</style>

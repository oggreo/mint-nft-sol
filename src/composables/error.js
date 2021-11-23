import { readonly, ref } from 'vue'
import { Keypair, PublicKey } from '@solana/web3.js'
import { programs } from '@metaplex/js'

export default function useError () {
  const error = ref(null)

  const clearError = () => {
    error.value = null
  }

  const setError = (e) => {
    if (e.message === "Cannot read properties of null (reading '_bn')") {
      error.value = new Error('Missing a required field')
      return
    }
    if (e.message === 'unable to get metadata json from url null') {
      error.value = new Error('Missing URI')
      return
    }
    error.value = e
  }

  const tryConvertToPK = (strPk) => {
    if (strPk) {
      try {
        return new PublicKey(strPk)
      } catch (e) {
        error.value = new Error('Bad public key entry. Is it spelled correctly?')
      }
    }
    return null
  }
  return {
    error: readonly(error),
    clearError,
    setError,
    tryConvertToPK
  }
}

# Mint an NFT on SOLANA

[Live page](https://mintnftonsolana.netlify.app/)

![Screenshot 2021-11-24 at 17 25 09](https://user-images.githubusercontent.com/5387810/143286242-e041dec5-e139-4b3b-be2d-4ca5caae9a63.png)

I've recently started diving into Solana and I wanted to build something to learn how everything works.
It uses Solana and Metaplex SDK and heavily inspired and referenced from these beautiful repos ([NFT-armoury](https://github.com/ilmoi/nft-armory), [arweave-image-uploader](https://github.com/thuglabs/arweave-image-uploader/)).

This simple page allows you to mint an PNG image to an NFT. There is no pre-requistes but you will need to install 
[Arweave wallet](https://www.arweave.org/) and [Phantom](https://phantom.app/).

I'll try adding more features as I explore more!

---------

I noticed that you can stil upload to Aweave without having any AR (wallet balance 0). This is because the arweave.net gateway is caching the transaction. So it would fall out of the cache in an hour or so when it fails to be mined.

---------

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

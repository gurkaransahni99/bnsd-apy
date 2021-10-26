const Web3 = require('web3');
const config = require('config');

const pairABI = require('../abis/uniswapPair.json');
const chefABI = require('../abis/masterChef.json');

let web3 = new Web3(new Web3.providers.HttpProvider(config.get('localhost').get('url')));


const initialPools = {
  pools: [
    {
      address: '0x588fcc8306ffdf880e4aa21e615cc52c475d3ba4',
      pair: 'BNS/ETH',
      tradeLink:
      'https://app.uniswap.org/#/add/v2/0x695106Ad73f506f9D0A9650a78019A93149AE07C/ETH',
      rewardMultiple: 8,
      apy: 0,
      value: 0,
    },
    {
      address: '0x155c98c086bba3246e8fb0e184308a62958db917',
      pair: 'BNS/USDT',
      tradeLink:
      'https://app.uniswap.org/#/add/v2/0x695106Ad73f506f9D0A9650a78019A93149AE07C/0xdAC17F958D2ee523a2206206994597C13D831ec7',
      rewardMultiple: 2,
      apy: 0,
      value: 0,
    },
    {
      address: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
      pair: 'ETH/USDT',
      tradeLink:
      'https://app.uniswap.org/#/add/v2/ETH/0xdAC17F958D2ee523a2206206994597C13D831ec7',
      rewardMultiple: 0.2,
      apy: 0,
      value: 0,
    },
    {
      address: '0xce84867c3c02b05dc570d0135103d3fb9cc19433',
      pair: 'SUSHI/ETH',
      tradeLink:
      'https://app.uniswap.org/#/add/v2/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/ETH',
      rewardMultiple: 0.2,
      apy: 0,
      value: 0,
    },
    {
      address: '0xf80758ab42c3b07da84053fd88804bcb6baa4b5c',
      pair: 'sUSD/ETH',
      tradeLink:
      'https://app.uniswap.org/#/add/v2/0x57Ab1ec28D129707052df4dF418D58a2D46d5f51/ETH',
      rewardMultiple: 0.2,
      apy: 0,
      value: 0,
    },
    {
      address: '0x2fdbadf3c4d5a8666bc06645b8358ab803996e28',
      pair: 'YFI/ETH',
      tradeLink:
      'https://app.uniswap.org/#/add/v2/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/ETH',
      rewardMultiple: 0.2,
      apy: 0,
      value: 0,
    },
    {
      address: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
      pair: 'USDC/ETH',
      tradeLink:
      'https://app.uniswap.org/#/add/v2/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/ETH',
      rewardMultiple: 0.2,
      apy: 0,
      value: 0,
    },
    {
      address: '0x76333b38567f78240d6276e5b3985baa6fa5fda5',
      pair: 'BNSD/ETH',
      tradeLink:
      'https://app.uniswap.org/#/add/v2/0x668DbF100635f593A3847c0bDaF21f0a09380188/ETH',
      rewardMultiple: 12,
      apy: 0,
      value: 0,
    },
    {
      address: '0x2336caa76eb0c28597c691679988a5bcf5806e11',
      pair: 'BNSD/UNI',
      tradeLink:
      'https://app.uniswap.org/#/add/v2/0x668DbF100635f593A3847c0bDaF21f0a09380188/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      rewardMultiple: 4,
      apy: 0,
      value: 0,
    },
  ],
};

const masterChef = {
    "chefAddress": "0x0d97bac371c34fbeccbbe64970453346e4e2bab3",
    "tokenAddress": "0x668DbF100635f593A3847c0bDaF21f0a09380188",
    "uni1": "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"
}

const findAPY = async () => {
    const chef = new web3.eth.Contract(
        chefABI,
        masterChef.chefAddress,
    );
    console.log(chef._address)

    for (let i = 0; i < initialPools.pools.length; i++) {
        const pool = new web3.eth.Contract(
            pairABI,
            initialPools.pools[i].address,
        );
        console.log(pool._address)
    }
}

findAPY()
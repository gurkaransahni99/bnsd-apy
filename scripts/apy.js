const Web3 = require('web3');
const config = require('config');
const BN = require('bn.js');

const pairABI = require('../abis/uniswapPair.json');
const chefABI = require('../abis/masterChef.json');
const factoryABI = require('../abis/uniswapFactory.json');
const tokenABI = require('../abis/erc20.json');


let web3 = new Web3(new Web3.providers.HttpProvider(config.get('localhost').get('url')));
const provider = ethers.getDefaultProvider()

// Helper function for toBaseUnit
function isString(s) {
    return (typeof s === 'string' || s instanceof String)
}

// https://ethereum.stackexchange.com/questions/41506/web3-dealing-with-decimals-in-erc20
// Take a value string & decimals to return corresponding representtaion as a BN object
const toBaseUnit = (value, decimals) => {
    if (!isString(value)) {
        throw new Error('Pass strings to prevent floating point precision issues.')
    }
    const ten = new BN(10);
    const base = ten.pow(new BN(decimals));

    // Is it negative?
    let negative = (value.substring(0, 1) === '-');
    if (negative) {
        // eslint-disable-next-line no-param-reassign
        value = value.substring(1);
    }

    if (value === '.') {
        throw new Error(
            `Invalid value ${value} cannot be converted to`
            + ` base unit with ${decimals} decimals.`,
        );
    }

    // Split it into a whole and fractional part
    let comps = value.split('.');
    if (comps.length > 2) { throw new Error('Too many decimal points'); }

    let whole = comps[0]; let
        fraction = comps[1];

    if (!whole) { whole = '0'; }
    if (!fraction) { fraction = '0'; }
    if (fraction.length > decimals) {
        throw new Error('Too many decimal places');
    }

    while (fraction.length < decimals) {
        fraction += '0';
    }

    whole = new BN(whole);
    fraction = new BN(fraction);
    let wei = (whole.mul(base)).add(fraction);

    if (negative) {
        wei = wei.neg();
    }

    return new BN(wei.toString(10), 10);
}

const parseBaseUnit = (value, decimals) => {
    let orig = value;
    if (BN.isBN(value)) {
        value = value.toString()
    }
    if (!isString(value)) {
        throw new Error(`Not a String: ${value} ${decimals} ${orig}`)
    }
    value = BigNumber.from(value)
    return utils.formatUnits(value, decimals)
}

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

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

const uniswapFactory = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"

const findAPY = async (prices) => {
    // const chef = new web3.eth.Contract(
    //     chefABI,
    //     masterChef.chefAddress,
    // );
    chef = new ethers.Contract(
        masterChef.chefAddress,
        chefABI,
        provider,
    );

    console.log(chef.address);

    let poolLength = Number((await chef.poolLength()).toString())
    console.log(poolLength);

    for (let i = 0; i < poolLength; i++) {
        const poolInfo = await chef.poolInfo(i);
        console.log({
            poolInfo
        })
        const pool = new ethers.Contract(
            poolInfo.lpToken,
            pairABI,
            provider,
        );
        console.log(pool.address)

        let annualEthereumBlock = 6400 * 365
        let totalpoolAllocation = await chef.totalAllocPoint()
        let annualReward = annualEthereumBlock * totalpoolAllocation
        let poolWeight = poolInfo.allocPoint

        const perPoolReward = annualReward * (poolWeight / totalpoolAllocation);
        // const perPoolRewardETH = Number(perPoolReward) * prices.bnsdeth * Number("100000000000000000");
        const perPoolRewardETH = toBaseUnit(perPoolReward.toString()).mul(toBaseUnit((prices.bnsdeth* Number("1000000000000000000")).toString()));


        console.log({
            annualEthereumBlock,
            price: toBaseUnit(prices.bnsdeth.toString()).toString(),
            totalpoolAllocation: totalpoolAllocation.toString(),
            annualReward,
            poolWeight: poolWeight.toString(),
            perPoolReward: perPoolReward.toString(),
            perPoolRewardETH: perPoolRewardETH.toString(),
        })

        const token0 = await pool.token0()
        const token1 = await pool.token1();
        const reserve = await pool.getReserves()

        console.log({
            token0,
            token1,
        })

        if (token0 == WETH || token1 == WETH) {
            let reserveValue;
            if (token0 == WETH) {
                reserveValue = reserve._reserve0
            } else {
                reserveValue = reserve._reserve1
            }
            const totalAmountLockedInPoolETH = toBaseUnit(reserveValue.toString()).mul(toBaseUnit("2"));
            const totalSupply = await pool.totalSupply();
            const stakedSupply = await pool.balanceOf(masterChef.chefAddress)
            console.log({
                totalAmountLockedInPoolETH: totalAmountLockedInPoolETH.toString(),
                totalSupply: totalSupply.toString(),
                stakedSupply: stakedSupply.toString(),
            })
            const totalStakedInPoolETH = totalAmountLockedInPoolETH.mul(toBaseUnit(stakedSupply.toString())).div(toBaseUnit(totalSupply.toString()))
            const APY = perPoolRewardETH.mul(toBaseUnit("100")).div(toBaseUnit(totalStakedInPoolETH.toString()))

            console.log({
                totalAmountLockedInPoolETH: totalAmountLockedInPoolETH.toString(),
                totalSupply: totalSupply.toString(),
                perPoolRewardETH: perPoolRewardETH.toString(),
                reserveValue: reserveValue.toString(),
                stakedSupply: stakedSupply.toString(),
                totalStakedInPoolETH: totalStakedInPoolETH.toString(),
                APY: APY.toString(),
            })
        } else {
            const { price, decimal } = await getPrice (token0)
            const reserveValue = reserve._reserve0
            const reserveValueETH = toBaseUnit(reserve._reserve0.toString()).mul(price).div(toBaseUnit("1", decimal.toString()))
            const totalAmountLockedInPoolETH = reserveValueETH.mul(toBaseUnit("2"));
            const totalSupply = await pool.totalSupply();
            const stakedSupply = await pool.balanceOf(masterChef.chefAddress)
            const totalStakedInPoolETH = toBaseUnit(totalAmountLockedInPoolETH.toString()).mul(toBaseUnit(stakedSupply.toString())).div(toBaseUnit(totalSupply.toString()))
            const APY = perPoolRewardETH.mul(toBaseUnit("100")).div(toBaseUnit(totalStakedInPoolETH.toString()))

            console.log({
                price: price.toString(),
                decimal: decimal.toString(),
                totalAmountLockedInPoolETH: totalAmountLockedInPoolETH.toString(),
                totalSupply: totalSupply.toString(),
                perPoolRewardETH: perPoolRewardETH.toString(),
                reserveValue: reserveValue.toString(),
                reserveValueETH: reserveValueETH.toString(),
                stakedSupply: stakedSupply.toString(),
                totalStakedInPoolETH: totalStakedInPoolETH.toString(),
                APY: APY.toString(),
            })
        }
    }
}

const fetchPrice = async _ => {
    const prices = {}

    const BnsdEthPairAddress = '0x76333b38567f78240d6276e5b3985baa6fa5fda5';
    const BnsdUSDTPairAddress = '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852';

    const contract1 = new ethers.Contract(
        BnsdEthPairAddress,
        pairABI,
        provider,
    );
    const contract2 = new ethers.Contract(
        BnsdUSDTPairAddress, 
        pairABI, 
        provider,
    );

    console.log(contract1.address, contract2.address);
    
    const result1 = await contract1.getReserves();
    const result2 = await contract2.getReserves();

    console.log(result1, result2);
    
    const bnsdeth = result1._reserve1 / result1._reserve0;
    prices.bnsdeth = bnsdeth;
    
    // eth/usd approximation by ETH-USDC pair
    const ethusd = (result2._reserve1 / result2._reserve0) * 10 ** (18 - 6);
    prices.ethusd = ethusd;
    
    const bnsdusd = bnsdeth * ethusd;
    
    prices.bnsdusd = bnsdusd;
    return { prices };
};

const getPrice = async (tokenAddress) => {
    factory = new ethers.Contract(
        uniswapFactory,
        factoryABI,
        provider,
    );
    const pairAdd = await factory.getPair(tokenAddress, WETH);
    const pair = new ethers.Contract(
        pairAdd, 
        pairABI, 
        provider,
    );
    const reserves = await pair.getReserves()

    const token0 = await pair.token0()
    const token1 = await pair.token1()
    const token0Contract = new ethers.Contract(
        token0, 
        tokenABI, 
        provider,
    );
    const token1Contract = new ethers.Contract(
        token1, 
        tokenABI, 
        provider,
    );
    const decimal0 = await token0Contract.decimals()
    const decimal1 = await token1Contract.decimals()

    let price

    if (token0 == WETH) {
        price = toBaseUnit(reserves._reserve0.toString()).mul(toBaseUnit("1", decimal1.toString())).div(toBaseUnit(reserves._reserve1.toString()))
        return { price, decimal: decimal1 }
    } else {
        price = toBaseUnit(reserves._reserve1.toString()).mul(toBaseUnit("1", decimal0.toString())).div(toBaseUnit(reserves._reserve0.toString()))
        console.log({
            price: price.toString(),
            x: reserves._reserve0.toString(),
            y: toBaseUnit("1", decimal0.toString()).toString(),
            z: reserves._reserve1.toString()
        })
        return { price, decimal: decimal0 }
    }
}

(async function main() {
    const {prices} = await fetchPrice()
    console.log(prices)
    
    await findAPY(prices)
}())
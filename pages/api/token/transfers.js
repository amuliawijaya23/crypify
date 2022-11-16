import axios from 'axios';

// import ethers
import { ethers } from 'ethers';

// variables
const ETHERSCAN_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_KEY;
const INFURA_URL = process.env.NEXT_PUBLIC_INFURA_URL;

// ethers provider
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const address = req.body.address;
      const start = req.body.start;
      const end = req.body.end;

      const abi = [
        "event Transfer(address indexed from, address indexed to, uint amount)"
      ];

      const [block0, block1] = await Promise.all([
        axios.get(`https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${start}&closest=before&apikey=${ETHERSCAN_KEY}`),
        axios.get(`https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${end}&closest=before&apikey=${ETHERSCAN_KEY}`)
      ]);
      
      const startBlock = parseFloat(block0.data.result);
      const endBlock = parseFloat(block1.data.result);
      
      const contract = new ethers.Contract(address, abi, provider);

      const filterAll = contract.filters.Transfer();
      const transfers = await contract.queryFilter(filterAll, startBlock, endBlock);

      console.log('T', transfers);

      const aggregatedTransfers = await Promise.all(transfers.map(async(t) => (
        {
          blockNumber: t.blockNumber,
          logIndex: t.logIndex,
          transactionHash: t.transactionHash,
          from: t.args.from,
          to: t.args.to,
          // amount: ethers.utils.formatUnits(t.args.amount.toString(), decimals),
          timestamp: await (async () => (await t.getBlock()).timestamp)()
        }
      )));

      res.send(aggregatedTransfers);
    }
  } catch (error) {
    console.error(error.response ? error.response.body : error);
  };
}

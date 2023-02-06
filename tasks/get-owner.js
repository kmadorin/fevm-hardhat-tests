const util = require("util");
const request = util.promisify(require("request"));
const fa = require("@glif/filecoin-address");

task("get-owner", "Gets an owner address of a miner actor.")
  .setAction(async (taskArgs) => {

  async function callRpc(method, params) {
    var options = {
      method: "POST",
      url: "https://api.hyperspace.node.glif.io/rpc/v1",
      // url: "http://localhost:1234/rpc/v0",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: method,
        params: params,
        id: 1,
      }),
    };

    const res = await request(options);
    return JSON.parse(res.body).result;
  }

  const { parseAddress }= await import("@zondax/filecoin-signing-tools/js");

  // full address for t02488 miner
  // https://hyperspace.filfox.info/en/address/t02488
  // const minerAddress = 't02488';
  const minerAddress = 't02488';
  const minerId = fa.newFromString(minerAddress);
  const minerAddressBytes = parseAddress(minerAddress);
  const minerAddressBytesHex = '0x' + minerAddressBytes.toString('hex');

  const SimpleCoinFactory = await ethers.getContractFactory("SimpleCoin");
  const SimpleCoinAddress = '0x58D18A9Df47Be7ccbA305Ae43492817f40Ab882b';
  const simpleCoin = SimpleCoinFactory.attach(SimpleCoinAddress);  
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

  // console.log('minerAddressBytesHex: ', '0x' + minerAddressBytes.toString('hex'));
  // const abiEncodedCall = simpleCoin.interface.functions.encode.getOwner(new Uint8Array(minerAddressBytes));
  console.log('minerAddress: ', minerAddress)
  console.log('minerAddressBytes glif lib:', minerId.bytes);
  console.log('minerAddressBytes zondax lib:', new Uint8Array(minerAddressBytes));
  console.log('isBytes: ', ethers.utils.isBytes(minerAddressBytes));
  console.log('getOwnerEncodedCall: ', simpleCoin.interface.encodeFunctionData("getOwner", [minerAddressBytes]));
  
  let tx = await simpleCoin.getOwner('0x0509B8', {
      gasLimit: 1000000000,
      maxPriorityFeePerGas: priorityFee
  });

  let receipt = await tx.wait();
  // let ownerAddress = await simpleCoin.owner();

  console.log(receipt);
  // console.log(ownerAddress);
})


module.exports = {}
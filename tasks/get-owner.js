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
  const minerAddress = 't02488';
  // const minerAddress = 't2vb6iahjntzweoxb7ozhond4jalwf5azy2xzk2oa';
  const minerId = fa.newFromString(minerAddress);
  const minerAddressBytes = parseAddress(minerAddress);
  const minerAddressBytesHex = '0x' + minerAddressBytes.toString('hex');

  const SimpleCoinFactory = await ethers.getContractFactory("SimpleCoin");
  const SimpleCoinAddress = '0xF776d89b2d788F03C116BC599050124E988eedE2';
  const simpleCoin = SimpleCoinFactory.attach(SimpleCoinAddress);  
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

  // console.log('minerAddressBytesHex: ', '0x' + minerAddressBytes.toString('hex'));
  // const abiEncodedCall = simpleCoin.interface.functions.encode.getOwner(new Uint8Array(minerAddressBytes));
  console.log('minerAddress: ', minerAddress)
  console.log('minerAddressBytes glif lib:', minerId.bytes);
  console.log('minerAddressBytes zondax lib:', minerAddressBytes.toString('hex'));
  console.log('isBytes: ', ethers.utils.isBytes(minerAddressBytes));
  console.log('getOwnerEncodedCall: ', simpleCoin.interface.encodeFunctionData("getOwner", [minerAddressBytes]));
  
  let tx = await simpleCoin.getOwner(minerAddressBytes, {
      maxPriorityFeePerGas: priorityFee
  });

  let receipt = await tx.wait();
  let ownerAddress = await simpleCoin.owner();

  console.log(receipt);
  console.log('ownerAddress: ', ownerAddress);
})


module.exports = {}
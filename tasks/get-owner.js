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

  const MinerAPICallerMockFactory = await ethers.getContractFactory("MinerAPICallerMock");
  const MinerAPICallerMockAddress = '0xB9BBaCF89FA5A451D0A64bb95050C5f6836acb6B';
  // const MinerAPICallerMockAddress = '0x92e42443702a835Dba4103D568959Db89F150715';
  const minerAPICallerMock = MinerAPICallerMockFactory.attach(MinerAPICallerMockAddress);  
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

  // console.log('minerAddressBytesHex: ', '0x' + minerAddressBytes.toString('hex'));
  // const abiEncodedCall = simpleCoin.interface.functions.encode.getOwner(new Uint8Array(minerAddressBytes));
  console.log('minerAddress: ', minerAddress)
  console.log('minerAddressBytes glif lib:', minerId.bytes);
  console.log('minerAddressBytes zondax lib:', minerAddressBytes.toString('hex'));

  const actorId = await minerAPICallerMock.resolveAddressFromBytes(minerAddressBytes);
  console.log('actorId: ', actorId.toString());

  // let tx = await minerAPICallerMock.getOwner(actorId, {
  //     maxPriorityFeePerGas: priorityFee
  // });

  // let receipt = await tx.wait();
  // console.log(receipt);

  let ownerAddress = await minerAPICallerMock.owner();
  console.log('ownerAddress: ', ownerAddress);

  let proposed = await minerAPICallerMock.proposed();
  console.log('proposed: ', proposed);

  // let addressFromActorId = await minerAPICallerMock.resolveAddressFromActorId(actorId);
  // console.log('addressFromActorId:', addressFromActorId.toString());

  const addressFromOwner = await minerAPICallerMock.resolveAddressFromBytes(ownerAddress);
  console.log('addressFromOwner: ', addressFromOwner.toString());

  // let resolveEthAddress2Result = await minerAPICallerMock.resolveEthAddress2('0xe975146D08609310Ed4DB354233533Ad07dDc2F5');
  // console.log('resolveEthAddress2Result:', resolveEthAddress2Result);
  // console.log('resolveEthAddress2Result actorId:', 't0' + resolveEthAddress2Result.toString());

  // let addressFromActorId = await minerAPICallerMock.resolveAddressFromActorId(resolveEthAddress2Result);
  // console.log('addressFromActorId:', addressFromActorId);
})


module.exports = {}
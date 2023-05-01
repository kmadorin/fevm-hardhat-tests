const util = require("util");
const request = util.promisify(require("request"));
const fa = require("@glif/filecoin-address");

task("get-msg-sender", "Get msg sender.")
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

  const MinerAPICallerMockFactory = await ethers.getContractFactory("MinerAPICallerMock");
  const MinerAPICallerMockAddress = '0x945d2B61CB6f5f46B1DF749489e8480eAa6d4fF2';

  const minerAPICallerMock = MinerAPICallerMockFactory.attach(MinerAPICallerMockAddress); 

  // const abiEncodedCall = minerAPICallerMock.interface.encodeFunctionData('saveBLSSender');
  // console.log('abiEncodedCall: ', abiEncodedCall);

  // const abiEncodedCall = minerAPICallerMock.interface.encodeFunctionData('resolveBLSAddress');
  // console.log('abiEncodedCall: ', abiEncodedCall);

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

  // let tx = await minerAPICallerMock.saveBLSSender({
  //     maxPriorityFeePerGas: priorityFee
  // });

  // let receipt = await tx.wait();
  // console.log(receipt);

  let tx = await minerAPICallerMock.resolveBLSAddress({
      maxPriorityFeePerGas: priorityFee
  });

  let receipt = await tx.wait();
  console.log(receipt);

  let lastMsgSender = await minerAPICallerMock.lastMsgSender();
  console.log('lastMsgSender:', lastMsgSender);

  let lastMsgSenderBytes = await minerAPICallerMock.lastMsgSenderBytes();
  console.log('lastMsgSenderBytes:', lastMsgSenderBytes);
})


module.exports = {}
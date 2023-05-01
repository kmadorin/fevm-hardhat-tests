const util = require("util");
const request = util.promisify(require("request"));
const fa = require("@glif/filecoin-address");

task("check-ownership", "check ownership")
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

  const MinerAPICallerMockFactory = await ethers.getContractFactory("MinerAPICallerMock");
  const MinerAPICallerMockAddress = '0xe4Be04cDF07F064d505847B89E6A4BcbdCA47e1F';

  const minerAPICallerMock = MinerAPICallerMockFactory.attach(MinerAPICallerMockAddress); 

  
  const minerAddress = 't02488';
  const minerAddressBytes = parseAddress(minerAddress);

  const actorId = await minerAPICallerMock.resolveAddressFromBytes(minerAddressBytes);
  console.log('actorId: ', actorId.toString());

  const [isIDAddress, id] = await minerAPICallerMock.isIDAddress();
  console.log('isIDAddress: ', isIDAddress, id.toString());

  const [getActorID, actor_id] = await minerAPICallerMock.getActorID();
  console.log('getActorID: ', getActorID, actor_id.toString());




  const isIDAddressEncodedCall = minerAPICallerMock.interface.encodeFunctionData('isIDAddress');
  console.log('isIDAddressEncodedCall: ', isIDAddressEncodedCall);

  const getActorIDEncodedCall = minerAPICallerMock.interface.encodeFunctionData('getActorID');
  console.log('getActorIDEncodedCall: ', getActorIDEncodedCall);

  const checkOwnership3Call = minerAPICallerMock.interface.encodeFunctionData('checkOwnership3', [actorId]);
  console.log('checkOwnership3 Call: ', checkOwnership3Call);

  const checkOwnership4Call = minerAPICallerMock.interface.encodeFunctionData('checkOwnership4', [actorId]);
  console.log('checkOwnership4 Call: ', checkOwnership4Call);

  const checkOwnership5Call = minerAPICallerMock.interface.encodeFunctionData('checkOwnership5', [actorId]);
  console.log('checkOwnership5 Call: ', checkOwnership5Call);

  // const abiEncodedCall2 = minerAPICallerMock.interface.encodeFunctionData('checkOwnership2', [actorId]);
  // console.log('abiEncodedCall checkOwnership2: ', abiEncodedCall2);

  // const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

  // let tx = await minerAPICallerMock.checkOwnership3(actorId, {
  //     maxPriorityFeePerGas: priorityFee
  // });

  // let receipt = await tx.wait();
  // console.log(receipt);

})


module.exports = {}
var express = require('express');
var router = express.Router();
var publicClient = require('../api/client');



router.get('/', function (req, res, next) {
  res.send(getLogs(req.query.chainId));
});
const getLogs = async () => {
  const chainId = 5;
  const filter = await publicClient.createContractEventFilter({
    abi: tankGameABI,
    strict: true,
    fromBlock: BigInt(0),
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
  });
  return await publicClient.getFilterLogs({
    filter,
  });
};

module.exports = router;

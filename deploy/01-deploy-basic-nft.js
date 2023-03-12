const { network, deployments, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function () {
    const { log, deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    log("-----------------------");

    const args = [];
    const basicNft = await deploy("BasicNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    })

    if(!developmentChains.includes(network.name)){
        log("verifying...");
        await verify(basicNft.address, args);
    }
}

module.exports.tags = ["all", "basic", "main"]
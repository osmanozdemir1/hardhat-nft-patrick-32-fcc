const { network, deployments, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const fs = require("fs");


module.exports = async function () {
    const { log, deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let ethUsdPriceFeedAddress;

    if(developmentChains.includes(network.name)) {
        const ethUsdAggregator = await ethers.getContract("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    }
    log("----------------------------------------")
    const lowSvg = await fs.readFileSync("./images/dynamic/frown.svg", { encoding: "utf8" });
    const highSvg = await fs.readFileSync("./images/dynamic/happy.svg", { encoding: "utf8" });
    const args = [ethUsdPriceFeedAddress, lowSvg, highSvg];
    log("deploying dynamic nft contract...");
    const dynamicSvgNft = await deploy("DynamicSvgNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    });

     // Verify the deployment
     if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(dynamicSvgNft.address, args);
    }
}

module.exports.tags = ["all", "dynamicsvg", "main"]
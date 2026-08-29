const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);
  console.log("Network:", hre.network.name);

  const Factory = await hre.ethers.getContractFactory("WrappedTMR");
  const token = await Factory.deploy(deployer.address);
  await token.waitForDeployment();

  console.log("WrappedTMR:", await token.getAddress());
  console.log("Owner/bridge:", deployer.address);
  console.log("Next: transferOwnership(bridge-relayer-address) after your bridge is ready.");
}

main().catch((e) => { console.error(e); process.exit(1); });

import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  console.log("Deploying FoodDonation contract...");

  const foodDonation = await ethers.deployContract("FoodDonation");

  await foodDonation.waitForDeployment();

  const address = await foodDonation.getAddress();

  console.log("FoodDonation deployed successfully!");
  console.log("Contract address:", address);
  console.log("Owner address:", await foodDonation.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

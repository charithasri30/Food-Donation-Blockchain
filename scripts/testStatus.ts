
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const foodDonation = await ethers.getContractAt(
    "FoodDonation",
    contractAddress
  );

  // Use account #1 as the NGO
  const accounts = await ethers.getSigners();
  const ngo = accounts[1];

  // Owner authorizes the NGO
  const owner = accounts[0];
  await (await foodDonation.connect(owner).setNGO(ngo.address)).wait();

  console.log("NGO authorized:", ngo.address);

  // NGO confirms receipt, transit, and distribution
  const ngoContract = foodDonation.connect(ngo);

  await (await ngoContract.updateStatus(1, 1)).wait();
  console.log("Status 1: Received by NGO");

  await (await ngoContract.updateStatus(1, 2)).wait();
  console.log("Status 2: In Transit");

  await (await ngoContract.updateStatus(1, 3)).wait();
  console.log("Status 3: Distributed");

  const donation = await foodDonation.getDonation(1);
  console.log("Final status:", donation.status.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

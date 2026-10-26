
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const foodDonation = await ethers.getContractAt(
    "FoodDonation",
    contractAddress
  );

  console.log("Registering food donation...");

  const tx = await foodDonation.registerDonation(
    "Rice Packets",
    50,
    "2026-12-31",
    "Vijayawada"
  );

  await tx.wait();

  console.log("Donation registered successfully!");

  const donation = await foodDonation.getDonation(1);

  console.log("Donation ID:", donation.id.toString());
  console.log("Food Name:", donation.foodName);
  console.log("Quantity:", donation.quantity.toString());
  console.log("Expiry Date:", donation.expiryDate);
  console.log("Pickup Location:", donation.pickupLocation);
  console.log("Status:", donation.status.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

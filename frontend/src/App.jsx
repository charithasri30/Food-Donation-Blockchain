
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import "./App.css";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ABI = [
  "function donationCount() view returns (uint256)",
  "function registerDonation(string _foodName, uint256 _quantity, string _expiryDate, string _pickupLocation)",
  "function getDonation(uint256 _id) view returns (tuple(uint256 id, address donor, string foodName, uint256 quantity, string expiryDate, string pickupLocation, uint8 status, uint256 createdAt))",
  "function updateStatus(uint256 _id, uint8 _status)",
  "function ngo() view returns (address)",
];

const STATUSES = [
  "Registered",
  "Received by NGO",
  "In Transit",
  "Distributed",
];

const ZERO_ADDRESS = ethers.ZeroAddress;

function App() {
  const [wallet, setWallet] = useState("");
  const [contract, setContract] = useState(null);
  const [isNGO, setIsNGO] = useState(false);
  const [donations, setDonations] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const shortAddress = (address) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const loadDonations = useCallback(async (foodContract) => {
    try {
      const count = await foodContract.donationCount();
      const records = [];

      for (let i = 1; i <= Number(count); i++) {
        try {
          const donation = await foodContract.getDonation(i);

          records.push({
            id: Number(donation.id),
            donor: donation.donor,
            foodName: donation.foodName,
            quantity: Number(donation.quantity),
            expiryDate: donation.expiryDate,
            pickupLocation: donation.pickupLocation,
            status: Number(donation.status),
            createdAt: Number(donation.createdAt),
          });
        } catch (err) {
          console.error(`Could not load donation ${i}:`, err);
        }
      }

      setDonations(records.reverse());
    } catch (err) {
      console.error("Could not load donations:", err);
      setError("Could not load donations. Check your contract and Hardhat node.");
    }
  }, []);

  const clearWallet = useCallback(() => {
    setWallet("");
    setContract(null);
    setIsNGO(false);
    setDonations([]);
  }, []);

  const connectWallet = useCallback(async () => {
    setError("");
    setNotice("");

    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install the MetaMask extension.");
      return;
    }

    try {
      setLoading(true);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        setError("Please select an account in MetaMask.");
        clearWallet();
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 31337n) {
        clearWallet();
        setError(
          "Wrong network. In MetaMask, select your local Hardhat network with Chain ID 31337."
        );
        return;
      }

      const address = accounts[0];
      const signer = await provider.getSigner(address);

      const foodContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );

      const ngoAddress = await foodContract.ngo();

      setWallet(address);
      setContract(foodContract);
      setIsNGO(
        ngoAddress !== ZERO_ADDRESS &&
          ngoAddress.toLowerCase() === address.toLowerCase()
      );

      await loadDonations(foodContract);
      setNotice("Wallet connected successfully.");
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setError(
        err?.reason ||
          err?.shortMessage ||
          err?.message ||
          "Failed to connect wallet."
      );
    } finally {
      setLoading(false);
    }
  }, [clearWallet, loadDonations]);

  // Automatically update the website when the MetaMask account changes.
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      setError("");
      setNotice("");

      if (!accounts || accounts.length === 0) {
        clearWallet();
        setNotice("Wallet disconnected.");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        if (network.chainId !== 31337n) {
          clearWallet();
          setError("Please switch MetaMask to the local Hardhat network (31337).");
          return;
        }

        const address = accounts[0];
        const signer = await provider.getSigner(address);

        const foodContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          ABI,
          signer
        );

        const ngoAddress = await foodContract.ngo();

        setWallet(address);
        setContract(foodContract);
        setIsNGO(
          ngoAddress !== ZERO_ADDRESS &&
            ngoAddress.toLowerCase() === address.toLowerCase()
        );

        await loadDonations(foodContract);
        setNotice("MetaMask account updated.");
      } catch (err) {
        console.error("Account change failed:", err);
        setError(
          "Could not update the selected account. Please reconnect your wallet."
        );
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [clearWallet, loadDonations]);

  const registerDonation = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!contract || !wallet) {
      setError("Please connect your MetaMask wallet first.");
      return;
    }

    if (!foodName.trim() || !quantity || !expiryDate || !pickupLocation.trim()) {
      setError("Please fill in all donation details.");
      return;
    }

    if (Number(quantity) <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    try {
      setLoading(true);

      const transaction = await contract.registerDonation(
        foodName.trim(),
        BigInt(quantity),
        expiryDate,
        pickupLocation.trim()
      );

      setNotice("Transaction submitted. Waiting for confirmation...");
      await transaction.wait();

      await loadDonations(contract);

      setFoodName("");
      setQuantity("");
      setExpiryDate("");
      setPickupLocation("");

      setNotice("Donation registered successfully!");
    } catch (err) {
      console.error("Donation registration failed:", err);
      setError(
        err?.reason ||
          err?.shortMessage ||
          err?.message ||
          "Failed to register donation."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (donation) => {
    if (!contract || !isNGO) {
      setError("Only the registered NGO can update donation status.");
      return;
    }

    if (donation.status >= STATUSES.length - 1) {
      setNotice("This donation is already marked as distributed.");
      return;
    }

    setError("");
    setNotice("");

    try {
      setLoading(true);

      const nextStatus = donation.status + 1;

      const transaction = await contract.updateStatus(
        donation.id,
        nextStatus
      );

      setNotice("Status update submitted. Waiting for confirmation...");
      await transaction.wait();

      await loadDonations(contract);
      setNotice(`Donation #${donation.id} updated to "${STATUSES[nextStatus]}".`);
    } catch (err) {
      console.error("Status update failed:", err);
      setError(
        err?.reason ||
          err?.shortMessage ||
          err?.message ||
          "Failed to update donation status."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalPackets = donations.reduce(
    (total, donation) => total + donation.quantity,
    0
  );

  const distributedPackets = donations
    .filter((donation) => donation.status === STATUSES.length - 1)
    .reduce((total, donation) => total + donation.quantity, 0);

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">♥</span>
          <span>
            <strong>FoodChain</strong>
            <small>Food with a purpose</small>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#impact">Our Impact</a>
          <a href="#donations">Donations</a>
        </nav>

        <button
          className="wallet-button"
          onClick={connectWallet}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : wallet
              ? shortAddress(wallet)
              : "Connect Wallet"}
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">BLOCKCHAIN FOR SOCIAL GOOD</p>
          <h1>
            Share more food.
            <br />
            Waste less.
            <br />
            Change lives.
          </h1>
          <p className="hero-description">
            A transparent food donation platform that connects donors and NGOs
            to help ensure surplus food reaches people who need it.
          </p>

          <div className="hero-actions">
            <a href="#donate" className="primary-button">
              Donate Food
            </a>
            <a href="#donations" className="secondary-button">
              Track Donations
            </a>
          </div>

          <div className="blockchain-note">
            <span className="live-dot" />
            Powered by blockchain transparency
          </div>
        </section>

        {error && (
          <div className="message error-message" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="message success-message" role="status">
            {notice}
          </div>
        )}

        <section className="impact-section" id="impact">
          <div className="section-heading">
            <p className="eyebrow">OUR IMPACT</p>
            <h2>Every donation makes a difference</h2>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <span className="stat-icon">♥</span>
              <h3>{donations.length}</h3>
              <p>Total Donations</p>
            </article>

            <article className="stat-card">
              <span className="stat-icon">♧</span>
              <h3>{totalPackets}</h3>
              <p>Food Packets Donated</p>
            </article>

            <article className="stat-card">
              <span className="stat-icon">✓</span>
              <h3>{distributedPackets}</h3>
              <p>Packets Distributed</p>
            </article>
          </div>
        </section>

        <section className="donate-section" id="donate">
          <div className="section-heading">
            <p className="eyebrow">MAKE A DONATION</p>
            <h2>Share food, spread kindness</h2>
            <p>
              Register available food so an NGO can track its journey.
            </p>
          </div>

          <form className="donation-form" onSubmit={registerDonation}>
            <label htmlFor="foodName">Food Name</label>
            <input
              id="foodName"
              type="text"
              placeholder="e.g. Rice Packets"
              value={foodName}
              onChange={(event) => setFoodName(event.target.value)}
              required
            />

            <label htmlFor="quantity">Quantity (packets)</label>
            <input
              id="quantity"
              type="number"
              min="1"
              placeholder="e.g. 50"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />

            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(event) => setExpiryDate(event.target.value)}
              required
            />

            <label htmlFor="pickupLocation">Pickup Location</label>
            <input
              id="pickupLocation"
              type="text"
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChange={(event) => setPickupLocation(event.target.value)}
              required
            />

            <button
              className="primary-button submit-button"
              type="submit"
              disabled={loading || !wallet}
            >
              {loading ? "Processing..." : "Register Donation"}
            </button>

            {!wallet && (
              <p className="form-hint">
                Connect your MetaMask wallet before registering a donation.
              </p>
            )}
          </form>
        </section>

        <section className="donations-section" id="donations">
          <div className="section-heading">
            <p className="eyebrow">TRANSPARENT TRACKING</p>
            <h2>Donation Journey</h2>
            <p>
              Follow each donation from registration to distribution.
            </p>
          </div>

          <div className="account-info">
            <div>
              <strong>Connected Wallet</strong>
              <p>{wallet ? shortAddress(wallet) : "Not connected"}</p>
            </div>
            <div>
              <strong>Role</strong>
              <p>{wallet ? (isNGO ? "NGO" : "Donor / User") : "—"}</p>
            </div>
            <button
              className="secondary-button"
              onClick={() => contract && loadDonations(contract)}
              disabled={!contract || loading}
            >
              Refresh
            </button>
          </div>

          {donations.length === 0 ? (
            <div className="empty-state">
              <span>♧</span>
              <h3>No donations yet</h3>
              <p>Registered donations will appear here.</p>
            </div>
          ) : (
            <div className="donation-list">
              {donations.map((donation) => (
                <article className="donation-card" key={donation.id}>
                  <div className="donation-card-top">
                    <div>
                      <span className="donation-number">
                        Donation #{donation.id}
                      </span>
                      <h3>{donation.foodName}</h3>
                    </div>

                    <span
                      className={`status-badge status-${donation.status}`}
                    >
                      {STATUSES[donation.status] || "Unknown"}
                    </span>
                  </div>

                  <div className="donation-details">
                    <p>
                      <strong>Quantity:</strong> {donation.quantity} packets
                    </p>
                    <p>
                      <strong>Expiry:</strong> {donation.expiryDate}
                    </p>
                    <p>
                      <strong>Pickup:</strong> {donation.pickupLocation}
                    </p>
                    <p>
                      <strong>Donor:</strong> {shortAddress(donation.donor)}
                    </p>
                  </div>

                  <div className="status-progress">
                    {STATUSES.map((status, index) => (
                      <div
                        className={`progress-step ${
                          index <= donation.status ? "completed" : ""
                        }`}
                        key={status}
                      >
                        <span className="progress-circle">
                          {index < donation.status ? "✓" : index + 1}
                        </span>
                        <small>{status}</small>
                      </div>
                    ))}
                  </div>

                  {isNGO && donation.status < STATUSES.length - 1 && (
                    <button
                      className="primary-button status-button"
                      onClick={() => updateStatus(donation)}
                      disabled={loading}
                    >
                      {loading
                        ? "Updating..."
                        : `Update to ${STATUSES[donation.status + 1]}`}
                    </button>
                  )}

                  {donation.status === STATUSES.length - 1 && (
                    <p className="distributed-note">
                      ✓ This donation has been marked as distributed.
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="transparency-section">
          <p className="eyebrow">TRUST THROUGH TECHNOLOGY</p>
          <h2>Every step. Recorded transparently.</h2>
          <p>
            Donation records and status updates are written to the blockchain,
            helping donors and NGOs track the distribution process.
          </p>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">♥</span>
          <strong>FoodChain</strong>
        </a>
        <p>Share more food. Waste less. Change lives.</p>
        <small>Blockchain-Based Food Donation Tracking System</small>
      </footer>
    </div>
  );
}

export default App;

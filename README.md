# ⛓️ Blockchain-Based Food Donation Tracking System

A web-based food donation tracking system that uses blockchain technology and smart contracts to record, track, and manage food donations transparently.

## 📌 Project Overview

Food donation activities involve food providers, collection teams, charitable organizations, and beneficiaries. Traditional methods often depend on phone calls, messaging applications, registers, and spreadsheets, which can make tracking donations and maintaining consistent records difficult.

The **Blockchain-Based Food Donation Tracking System** uses blockchain technology and smart contracts to maintain traceable donation records and track donation status updates. It allows donors to register food donations and authorized NGOs to update their progress through different stages.

The system uses a Solidity smart contract deployed on a local Hardhat blockchain, with a React.js frontend that interacts with the contract through Ethers.js.

## ✨ Features

- **📝 Donation Registration:** Register food donations with details such as food name, quantity, expiry date, and pickup location.
- **🆔 Unique Donation ID:** Assign a unique identifier to each donation for easy tracking.
- **⛓️ Blockchain Integration:** Store donation records and status updates on the blockchain.
- **🏢 NGO Authorization:** Allow only authorized NGO wallet addresses to perform restricted status updates.
- **📦 Donation Status Tracking:** Track donations through the stages:
  - Registered
  - Received by NGO
  - In Transit
  - Distributed
- **🔍 Donation Tracking:** View donation information and its recorded status.
- **🔐 Access Control:** Use smart contract permissions to restrict authorized operations.
- **🦊 Wallet Integration:** Use MetaMask to connect a wallet and approve blockchain transactions, where configured.
- **🌐 Web-Based Interface:** Interact with the system through a React.js application instead of entering blockchain commands manually.
- **🧪 Local Blockchain Testing:** Develop and test the application using the Hardhat local blockchain.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| JavaScript | Application logic |
| Solidity | Smart contract development |
| Hardhat | Local blockchain development and testing |
| Ethers.js | Communication between the frontend and smart contract |
| Node.js | JavaScript runtime environment |
| npm | Package management |
| MetaMask | Wallet connection and transaction approval |

## 🏗️ System Architecture

The system connects donors, authorized NGOs, and the administrator through a web application and a blockchain smart contract.

```text
       Food Donor / NGO / Administrator
                     |
                     v
             React.js Frontend
                     |
                     v
                Ethers.js
                     |
                     v
                 MetaMask
                     |
                     v
          FoodDonation Smart Contract
                     |
                     v
            Hardhat Blockchain
                     |
                     v
       Donation Records and Status Updates
```

### 🔄 Working Process

1. The donor enters the food donation details through the web interface.
2. The application connects to the user's wallet when required.
3. The smart contract registers the donation and assigns a unique donation ID.
4. The donation information is recorded on the blockchain.
5. The authorized NGO receives the donation and updates its status.
6. The status changes as the donation moves through the transportation and distribution stages.
7. Users can view the recorded donation details and status.

## 📂 Project Structure

The following is an example structure. Update the file names and folders to match your actual GitHub repository.

```text
Blockchain-Based-Food-Donation-Tracking-System/
│
├── contracts/
│   └── FoodDonation.sol
│
├── scripts/
│   └── deploy.js
│
├── test/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── contract.js
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
├── hardhat.config.js
├── package.json
├── .gitignore
└── README.md
```

## ⚙️ Requirements

Install the following software before running the project:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) browser extension, if required by the application
- Visual Studio Code or another code editor

## 🚀 Installation and Setup

### 1. Clone the Repository

Replace the placeholder below with the actual URL of your project repository.

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project folder:

```bash
cd Blockchain-Based-Food-Donation-Tracking-System
```

### 2. Install Dependencies

Install the root project dependencies:

```bash
npm install
```

If the frontend has its own `package.json`, install its dependencies as well:

```bash
cd frontend
npm install
cd ..
```

### 3. Compile the Smart Contract

Run the following command from the folder containing your Hardhat configuration:

```bash
npx hardhat compile
```

This compiles the Solidity smart contract.

### 4. Start the Local Blockchain

Open a terminal in the project root and run:

```bash
npx hardhat node
```

Keep this terminal running while you use the application.

### 5. Deploy the Smart Contract

Open another terminal in the project root and run the deployment command that matches your actual script.

For example, if your deployment file is `scripts/deploy.js`:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed contract address and make sure the frontend uses the correct contract address and ABI.

### 6. Configure MetaMask

If your application uses MetaMask:

1. Add or select the local Hardhat network in MetaMask.
2. Connect the wallet to the application.
3. Use a local development account for testing.
4. Make sure the application and wallet are connected to the same network.

Use only test accounts and development funds when working with a local blockchain.

### 7. Start the Frontend

Run the frontend using the command configured in its `package.json`. For a Vite-based application, this is commonly:

```bash
cd frontend
npm run dev
```

Open the local URL shown in the terminal, commonly `http://localhost:5173`.

**Note:** The commands and file paths above are examples. Use the actual scripts, folder names, and package configuration in your repository. If you restart the local Hardhat blockchain, you may need to redeploy the contract and update the frontend's contract address.

## 🔐 Security and Limitations

- Smart contract permissions restrict certain operations to authorized wallet addresses.
- Blockchain records provide traceability and make recorded information difficult to alter without detection.
- The blockchain does not independently verify whether the entered food details are accurate.
- NGO wallet authorization alone does not prove the real-world identity of an organization.
- A status marked as distributed does not independently prove that the food reached the intended beneficiaries.
- The current local Hardhat setup is mainly intended for development and testing.
- A production deployment would require appropriate security testing, identity verification, reliable hosting, and operational procedures.

## 🌱 Sustainable Development Goal (SDG)

### SDG 2: Zero Hunger

The Blockchain-Based Food Donation Tracking System supports **SDG 2: Zero Hunger**, which aims to end hunger, achieve food security, improve nutrition, and promote sustainable agriculture.

The project contributes to this goal by:

- Improving the tracking of food donations from registration to distribution.
- Helping donors and NGOs maintain organized donation records.
- Supporting better coordination between food providers and charitable organizations.
- Improving the traceability of donated food and its recorded distribution status.
- Supporting efforts to reduce food wastage by making donation information easier to track.

The system supports food donation management, but its actual impact on hunger depends on effective implementation, food safety practices, and successful distribution to people in need.

## 🚀 Future Enhancements

- Deploy the smart contract on a suitable blockchain test network.
- Introduce stronger NGO identity verification.
- Add QR codes for easier donation identification and tracking.
- Provide notifications for pending donations and approaching expiry dates.
- Generate reports on registered and distributed donations.
- Improve the interface for mobile devices.
- Add delivery acknowledgements to support distribution verification.
- Conduct additional smart contract security and performance testing.

## 📚 Learning Outcomes

Through this project, we learned:

- The fundamentals of blockchain technology and smart contracts.
- How to develop and compile smart contracts using Solidity.
- How to use Hardhat for local blockchain development.
- How to connect a React.js frontend to a smart contract using Ethers.js.
- How wallet-based transactions work with MetaMask.
- How access control can be implemented in smart contracts.
- How blockchain can support traceability in food donation management.
- The importance of security, data accuracy, and practical limitations in blockchain applications.

## 👩‍💻 Author

**Arepalli Charitha Sri**

**Roll Number:** 23501A0512

**GitHub Profile:** [@charithasri30](https://github.com/charithasri30)

## 👩‍💻 Author

**Arepalli Charitha Sri**

Roll Number: 23501A0512

GitHub Profile: [@charithasri30](https://github.com/charithasri30)

## 🎥 Project Presentation Video

Watch the presentation video of the **Blockchain-Based Food Donation Tracking System**.

▶️ [Watch Project Presentation Video](https://drive.google.com/file/d/1r8gKmC6tWgwmi-J3Lxt_JsXPkrm-FSPP/view?usp=sharing)

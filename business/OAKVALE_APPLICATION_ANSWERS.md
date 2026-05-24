# Oakvale Invest — Application Form Answers
**Ubuntu Health Vault | May 2026**

---

## What problem are you solving?

South Africa's public healthcare system serves 48 million people across thousands of disconnected facilities — but patient records don't move with the patient. When someone visits a different clinic, their medical history stays behind. Doctors make decisions without critical context. Tests are repeated unnecessarily. Misdiagnoses happen. Paper records are lost, damaged, or destroyed.

Beyond fragmentation, there is no patient ownership. Records are stored in systems patients cannot see, by institutions they cannot always trust. They have no way to know who accessed their file, when, or why. In a country with a deep history of institutional abuse of personal data, this is not a minor inconvenience — it is a genuine barrier to trust and healthcare participation.

Ubuntu Health Vault solves this by giving patients cryptographic ownership of their own health records: encrypted, stored on decentralised infrastructure (IPFS + blockchain), and accessible — via web, SMS, or USSD feature phone — only with the patient's explicit, time-limited consent.

---

## Why does this problem matter to you personally?

I grew up in South Africa watching family members navigate the public healthcare system — sitting in long clinic queues, being told their file couldn't be found, watching doctors make guesses because the history wasn't there. There's a specific kind of helplessness that comes from being in pain and watching a healthcare worker apologise because "the system is down" or "your records are at the other clinic."

What struck me most was the asymmetry: the patient is the most vulnerable person in the room, but they have the least control over the most intimate data about their own body. Their records exist somewhere in a government database they have never seen and cannot access. A stranger can pull that file. The patient often cannot.

I built Ubuntu Health Vault because I believe technology — specifically blockchain, cryptography, and mobile-first design — can flip that asymmetry. The patient should hold the key, literally. Every design decision in this platform comes back to that principle: the patient is in control. Not the clinic. Not the government. Not the startup.

This matters to me not as an abstract mission statement but as something I have lived. That's why I built the entire MVP myself — I couldn't wait for someone else to take it seriously.

---

## How does the solution work? How does it use AI?

**How it works:**

1. A patient creates a crypto wallet — this becomes their health identity, no username or password required.
2. When a doctor uploads a medical record, it is encrypted with AES-256 on the client before it leaves the device. The encrypted file is stored on IPFS (decentralised, tamper-proof storage). Only the file hash is recorded on a smart contract on the Base blockchain.
3. When a healthcare provider needs access, they submit a request. The clinic administrator sends the patient an SMS consent request via Africa's Talking.
4. The patient approves or denies from any phone — including feature phones via USSD (*134*HEALTH#). Consent is time-limited: 24 hours, 7 days, 30 days, or permanent.
5. The smart contract enforces the permission. Every access event is logged immutably on-chain — a full audit trail that neither the clinic nor the platform can alter.
6. Patients can revoke access at any time. Doctors can only see what the patient has approved.

**How it uses automation and data:**

The smart contract is the engine. It automatically enforces access control, expires time-limited permissions, and logs every event without a human gatekeeper. Event-driven architecture means that when the blockchain logs an access request, it automatically triggers an SMS notification to the patient — no polling, no manual process.

The USSD system automates multi-step consent flows on basic feature phones, routing patients through structured menus to grant or deny access without requiring a smartphone or data connection.

**AI (in roadmap):**

The data layer has been deliberately architected to support AI integration. Because records are standardised, encrypted, and cryptographically verified, they are a high-quality source for AI inference. The planned next feature is an AI clinical assistant that surfaces relevant patient history to the treating doctor at the point of care — flagging drug interactions, highlighting chronic conditions, and summarising a longitudinal record that might otherwise take 20 minutes to read. This requires trustworthy, complete, patient-consented data. That is exactly what Ubuntu Health Vault provides.

---

## Why are you the right team to be building this solution?

I built the entire MVP alone — frontend (React, TypeScript), backend (Node.js, Express), smart contracts (Solidity, Hardhat, OpenZeppelin), blockchain integration (Ethers.js, wagmi, WalletConnect), decentralised storage (IPFS via Storacha), and multi-channel communication (Africa's Talking SMS and USSD). This is not a concept deck. It is working software deployed on testnet with full documentation.

The combination of skills this project requires is unusual: deep Web3 engineering, African mobile infrastructure knowledge (Africa's Talking, USSD), security architecture (AES-256, key management), and genuine understanding of the South African public healthcare context. I have all of these, and I built the proof.

Beyond the technical execution, I have lived proximity to this problem. I am building for a community I am part of, in a context I understand, with technology I have already deployed. Most healthcare tech in Africa is built by outsiders who design for an imagined user. I am designing for my community — and I have the receipts to prove it works.

---

## What stage is your startup at?

**MVP** — Fully functional product deployed on Base Sepolia testnet. All core features built and operational. Seeking pilot clinic partnerships to begin live validation.

---

*Full business plan attached. Portfolio and GitHub available on request.*
*Contact: londiwe.user@gmail.com*

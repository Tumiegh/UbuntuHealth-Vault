# Oakvale Invest, Application Form Answers
**Ubuntu Health Vault | May 2026**

---

## What problem are you solving?

South Africa's public healthcare system serves 48 million people across thousands of disconnected facilities, but patient records don't move with the patient. When someone visits a different clinic, their medical history stays behind. Doctors make decisions without critical context. Tests are repeated unnecessarily. Misdiagnoses happen. Paper records are lost, damaged, or destroyed.

Beyond fragmentation, there is no patient ownership. Records are stored in systems patients cannot see, by institutions they cannot always trust. They have no way to know who accessed their file, when, or why. In a country with a deep history of institutional abuse of personal data, this is not a minor inconvenience, it is a genuine barrier to trust and healthcare participation.

Ubuntu Health Vault solves this by giving patients cryptographic ownership of their own health records: encrypted, stored on decentralised infrastructure (IPFS + blockchain), and accessible, via web, SMS, or USSD feature phone, only with the patient's explicit, time-limited consent.

---

## Why does this problem matter to you personally?

I grew up in South Africa watching family members navigate the public healthcare system, sitting in long clinic queues, being told their file couldn't be found, watching doctors make guesses because the history wasn't there. There's a specific kind of helplessness that comes from being in pain and watching a healthcare worker apologise because "the system is down" or "your records are at the other clinic."

What struck me most was the asymmetry: the patient is the most vulnerable person in the room, but they have the least control over the most intimate data about their own body. Their records exist somewhere in a government database they have never seen and cannot access. A stranger can pull that file. The patient often cannot.

I believe technology, specifically blockchain, cryptography, and mobile-first design, can flip that asymmetry. The patient should hold the key, literally. Every design decision in this platform comes back to that principle: the patient is in control. Not the clinic. Not the government. Not the startup.

This matters to me not as an abstract mission statement but as something I have lived. That's what drove our team to build this rather than wait for someone else to take it seriously.

---

## How does the solution work? How does it use AI?

**How it works:**

1. A patient signs in using a **smart account**, an ERC-4337 account abstraction wallet that removes the need for seed phrases or a traditional username/password. Onboarding is as simple as connecting via email or social login, while full cryptographic ownership is preserved under the hood.
2. When a doctor uploads a medical record, it is encrypted with AES-256 on the client before it leaves the device. The encrypted file is stored on IPFS (decentralised, tamper-proof storage). Only the file hash is recorded on a smart contract on the Base blockchain.
3. When a healthcare provider needs access, they submit a request. The clinic administrator sends the patient an SMS consent request via Africa's Talking.
4. The patient approves or denies from any phone, including feature phones via USSD (*134*HEALTH#). Consent is time-limited: 24 hours, 7 days, 30 days, or permanent.
5. The smart contract enforces the permission. Every access event is logged immutably on-chain, a full audit trail that neither the clinic nor the platform can alter.
6. Patients can revoke access at any time. Doctors can only see what the patient has approved.

**How it uses automation and data:**

The smart contract is the engine. It automatically enforces access control, expires time-limited permissions, and logs every event without a human gatekeeper. Event-driven architecture means that when the blockchain logs an access request, it automatically triggers an SMS notification to the patient, no polling, no manual process.

The USSD system automates multi-step consent flows on basic feature phones, routing patients through structured menus to grant or deny access without requiring a smartphone or data connection.

**How it uses AI (implemented):**

AI is live in the platform across three core workflows:

- **Pre-consultation summaries:** Before a patient sees a doctor, an AI model reads the patient's consented record history and generates a concise, structured summary, surfacing chronic conditions, recent test results, and flagged concerns. Doctors arrive at the consultation with context, not a blank page.
- **Appointment and follow-up booking:** After a consultation, the AI analyses the doctor's notes and automatically initiates booking of follow-up appointments or specialist referrals where indicated, reducing the administrative burden on clinic staff and the dropout rate between consultations.
- **Check-up scheduling:** The AI monitors patient records for overdue preventive care (e.g., annual check-ups, chronic disease monitoring intervals) and proactively surfaces scheduling recommendations to the patient and their assigned clinic.

This is possible because Ubuntu Health Vault's data layer, standardised, encrypted, cryptographically verified, and patient-consented, provides the high-quality, longitudinal record that AI inference requires. The same infrastructure that enforces privacy also enables intelligence.

---

## Why are you the right team to be building this solution?

Our team built the entire MVP, frontend (React, TypeScript), backend (Node.js, Express), smart contracts (Solidity, Hardhat, OpenZeppelin), blockchain integration (Ethers.js, wagmi, WalletConnect), decentralised storage (IPFS via Storacha), and multi-channel communication (Africa's Talking SMS and USSD). This is not a concept deck. It is working software deployed on testnet with full documentation.

The combination of skills this project requires is unusual: deep Web3 engineering, African mobile infrastructure knowledge (Africa's Talking, USSD), security architecture (AES-256, key management), and genuine understanding of the South African public healthcare context. Our team brings all of these together, and the working product is the proof.

Beyond the technical execution, we have lived proximity to this problem. We are building for a community we are part of, in a context we understand, with technology we have already deployed. Most healthcare tech in Africa is built by outsiders who design for an imagined user. We are designing for our community, and we have the receipts to prove it works.

---

## What stage is your startup at?

**MVP**, Fully functional product deployed on Base Sepolia testnet. All core features built and operational. Seeking pilot clinic partnerships to begin live validation.

---

*Full business plan attached. Portfolio and GitHub available on request.*
*Contact: londiwe.user@gmail.com*

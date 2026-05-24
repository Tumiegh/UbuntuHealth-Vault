# Ubuntu Health Vault — Business Plan
**Submitted to Oakvale Invest | May 2026**

---

## 01 BUSINESS OVERVIEW

**Name:** Ubuntu Health Vault

**One-sentence description:** Ubuntu Health Vault is a blockchain-powered, patient-controlled medical records platform that gives South Africans secure ownership of their health data while enabling healthcare providers to access complete, verified patient histories via web, SMS, or USSD.

**The Problem**

South Africa's healthcare system is fragmented across thousands of disconnected clinics, hospitals, and private practices. When a patient moves between facilities — as millions do in the public system — their records do not follow them. Doctors make decisions without critical history. Patients are re-tested unnecessarily. Misdiagnoses occur. In rural and peri-urban communities, paper records are lost, stolen, or destroyed. There is no single trusted source of truth that belongs to the patient.

Beyond fragmentation, there is a trust problem. Centralised health databases have been breached. Patients have no visibility into who accessed their records or when. In a country with deep historical mistrust of institutions holding sensitive personal data, centralised control of health records is a barrier to adoption.

This problem affects an estimated 48 million public healthcare users in South Africa — the most vulnerable people, with the least power to advocate for themselves.

**Our Solution**

Ubuntu Health Vault puts the patient in control. Patients own a cryptographic wallet that acts as their digital health identity. Their medical records are encrypted with AES-256 and stored on IPFS (decentralised, tamper-proof storage). Only the encrypted file hash lives on a blockchain smart contract — meaning no single company, government, or server can modify or delete it.

When a doctor or clinic needs access, they send a consent request via SMS. The patient approves or denies from any phone — including basic feature phones via USSD (*134*HEALTH#). Access is time-limited (24 hours, 7 days, 30 days, or permanent), audited on-chain, and revocable at any time. Every access event is logged immutably.

Clinic administrators manage patient check-ins and queues via a web dashboard. Doctors access assigned patient histories through their own portal. The system is role-based, consent-driven, and fully auditable.

**How Automation and Data Are Core to the Solution**

Automation and on-chain data intelligence are foundational, not optional:

- **Smart contract automation** enforces access control rules without a human gatekeeper. Time-based expiry, consent verification, and audit logging all execute automatically on-chain.
- **Event-driven architecture** — blockchain events trigger real-time SMS notifications, keeping patients informed without manual intervention.
- **USSD automation** routes feature-phone users through a decision tree to approve/deny access requests, enabling participation without smartphones or internet.
- **Encrypted data pipeline** automates AES-256 encryption before any file leaves the client, ensuring no unencrypted health data ever touches a server.
- **AI integration (in-roadmap):** The data layer is being designed to support clinical decision support AI — specifically, a model that can flag anomalies in a patient's longitudinal record and surface relevant history to the treating doctor at point of care. Because records are standardised and cryptographically verified, they are a high-quality training and inference source that centralised EMR systems cannot match.

---

## 02 MARKET

**First Customers**

Our go-to-market entry is through community health clinics and NGO-run primary care facilities in peri-urban South Africa (starting in Gauteng and Western Cape). These facilities:
- Lack budget for enterprise EMR systems (Meditech, iMedical)
- Serve high-volume, highly mobile patient populations
- Are motivated by donor/government pressure to improve records quality
- Operate with minimal IT infrastructure — making our no-server, blockchain-native model attractive

Secondary early adopters: occupational health clinics serving mining and manufacturing workers, where multi-site record access is a legal compliance requirement.

**Market Size**

| Segment | Estimate |
|---|---|
| Public healthcare facilities in SA | ~3,900 clinics + 406 hospitals |
| Annual public healthcare patients | ~48 million |
| SA digital health market (2025) | ~USD 580 million |
| Projected SA digital health market (2030) | ~USD 1.4 billion |
| Africa digital health market (2030) | ~USD 11 billion |

We are targeting a slice of the SA EMR/health records market initially, with a clear expansion path to Sub-Saharan Africa. Our primary revenue driver is the clinic subscription tier.

**Why Now**

Three converging forces make this the right moment:

1. **Regulatory:** The Protection of Personal Information Act (POPIA) — now fully in effect — creates real liability for clinics handling patient data insecurely. Our platform provides a compliance-ready architecture.
2. **Infrastructure:** Base (Coinbase's Layer 2) has reduced blockchain transaction costs to near-zero, making per-access on-chain logging economically viable for the first time.
3. **Connectivity:** USSD and SMS penetration in South Africa is near-universal (98% of the adult population has access to a mobile phone), meaning our multi-channel approach reaches patients that app-only solutions cannot.

---

## 03 BUSINESS MODEL

**How We Make Money**

Ubuntu Health Vault operates on a B2B SaaS subscription model targeting healthcare facilities, with a free patient-facing layer.

| Tier | Target | Price (ZAR/month) | Inclusions |
|---|---|---|---|
| Free | Individual patients | R0 | Wallet creation, record storage, access control |
| Clinic Basic | Small clinics (<500 patients) | R1,500/mo | Admin dashboard, SMS consent, up to 500 active patients |
| Clinic Pro | Mid-size clinics (500–5,000 patients) | R4,500/mo | Unlimited patients, analytics, priority support |
| Enterprise | Hospitals / NGO networks | Custom | Multi-site, API access, custom integrations, SLA |

**Pricing Logic**

Clinics currently pay R2,000–R8,000/month for basic practice management software that offers no patient control, no blockchain integrity, and no USSD access. We are price-competitive while offering a meaningfully differentiated product.

**Key Cost Drivers**

- **Africa's Talking SMS/USSD costs** — variable per message/session (~R0.15–0.30/SMS); absorbed at Basic tier, passed through at scale
- **IPFS storage (Storacha)** — low, scales with data volume
- **Base blockchain gas fees** — near-zero on L2; estimated < R0.01 per transaction
- **Engineering team salaries** — primary fixed cost in Year 1
- **Customer support and onboarding** — clinic-side implementation support

---

## 04 TRACTION

**Current Stage:** MVP (fully functional, deployed on testnet)

**What Has Been Built**

- Full React/TypeScript frontend with three role-based dashboards (Admin, Doctor, Patient)
- Express.js backend with encrypted file upload pipeline
- Smart contracts deployed on Base Sepolia testnet (HealthVault.sol — Solidity 0.8.20, OpenZeppelin audited libraries)
- IPFS integration via Storacha for decentralised encrypted file storage
- Africa's Talking SMS and USSD integration (access requests, consent responses, queue notifications)
- AES-256 encryption layer — records encrypted client-side before upload
- WalletConnect/Reown integration for wallet-based authentication
- Comprehensive audit trail on-chain
- Full technical documentation (8 documents, ~3,000+ lines of architecture notes)

**Validation**

- Architecture reviewed against South African POPIA compliance requirements
- Smart contract test suite written and passing
- USSD flow tested against Africa's Talking sandbox
- System designed around real workflow observations at public health clinic queues

**Users / Revenue**

- Currently in pre-revenue testnet phase
- No paying customers yet; actively seeking first pilot clinic partnership
- Revenue to date: R0

---

## 05 THE TEAM

**Londiwe [Surname]** — Founder & Lead Engineer

- Full-stack developer with deep expertise across the entire Ubuntu Health Vault stack: React, TypeScript, Node.js, Solidity, blockchain integration, and IPFS
- Built the complete MVP independently — frontend, backend, smart contracts, and all integrations
- Deep personal connection to the problem (see application questions)
- Contact: londiwe.user@gmail.com

*We are actively seeking a co-founder with a healthcare operations or clinical background to lead go-to-market and clinic partnerships.*

**Why This Team**

The founder has demonstrated the ability to ship a complex, multi-layer technical product — blockchain, decentralised storage, encrypted data pipelines, multi-channel communication — as a solo builder. This is not a slide deck; it is working software. The combination of technical depth (smart contracts, Web3), local market knowledge (Africa's Talking, USSD, South African healthcare context), and mission-driven focus on underserved communities is rare.

---

## 06 FINANCIAL PROJECTIONS

**Key Assumptions**

- Begin paid pilots with 3 clinics at Month 3 (Clinic Basic tier — R1,500/mo each)
- Convert to paid contracts and onboard additional clinics through direct outreach and referrals
- Hire one additional engineer at Month 9 (R25,000/mo)
- SMS/USSD costs absorbed at low volume; become variable at scale
- No significant infrastructure costs (blockchain + IPFS are near-zero at current scale)

**Month 12 Projections**

| | Amount (ZAR) |
|---|---|
| Paying clinics | 15 |
| Monthly Recurring Revenue | R45,000 |
| Annual Revenue Run Rate | R540,000 |
| Monthly Expenses | R55,000 |
| Net Monthly Position | -R10,000 (near breakeven) |

*Primary expenses: 1 additional engineer (R25,000), founder salary (R20,000), marketing/outreach (R5,000), infrastructure (R5,000)*

**Month 24 Projections**

| | Amount (ZAR) |
|---|---|
| Paying clinics | 60 |
| Monthly Recurring Revenue | R200,000 |
| Annual Revenue Run Rate | R2,400,000 |
| Monthly Expenses | R140,000 |
| Net Monthly Position | +R60,000 (profitable) |

*Primary expenses: 3 engineers, 1 sales/partnerships hire, 1 customer success hire*

**Growth Pathway to Month 24**
- Month 3–6: 3 pilot clinics → proof of concept, collect feedback
- Month 6–12: Expand to 15 clinics via referral and NGO/donor network partnerships
- Month 12–18: Launch Clinic Pro tier, pursue first hospital/network deal
- Month 18–24: 60 clinics, begin Sub-Saharan Africa expansion scoping

---

## 07 FUNDING ASK

**Total Amount Requested: R500,000 (approximately USD 27,000)**

**Use of Funds**

| Category | Amount | Purpose |
|---|---|---|
| Engineering | R200,000 | 8 months founder salary to go full-time; complete mainnet deployment |
| Pilot Clinic Onboarding | R80,000 | 3 free/subsidised pilots — onboarding support, hardware if needed |
| Legal & Compliance | R60,000 | POPIA compliance audit, smart contract legal review, company registration |
| Sales & Marketing | R70,000 | Clinic outreach, healthcare conferences, partnerships with NGO networks |
| Infrastructure & Security | R50,000 | Production deployment, security audit of smart contracts, monitoring |
| Working Capital Buffer | R40,000 | 3-month operational reserve |

**Milestones This Funding Will Unlock**

1. **Month 2:** Mainnet deployment (Base mainnet) + security audit complete
2. **Month 3:** First 3 paid pilot clinics signed and live
3. **Month 6:** 10 paying clinics, MRR > R20,000
4. **Month 9:** Hire first additional engineer; begin AI-assisted clinical summary feature
5. **Month 12:** 15 paying clinics, MRR > R45,000, Series A preparation begins

---

## 08 PORTFOLIO & EVIDENCE

**Live MVP (Testnet)**
- GitHub: *[repository link — available on request]*
- Technical Architecture: Full documentation in repository (`TECHNICAL_ARCHITECTURE.md`, 1,000+ lines)
- Smart Contract: Deployed on Base Sepolia testnet
- USSD Interface: Active on Africa's Talking sandbox (*134*HEALTH#)

**Technical Highlights**
- HealthVault.sol — Solidity smart contract with OpenZeppelin security patterns (Ownable, ReentrancyGuard)
- AES-256 client-side encryption before any data leaves the user's device
- Multi-role React dashboards (Admin, Doctor, Patient)
- Full SMS/USSD consent workflow
- 8 technical documentation files (~3,000+ lines of architecture documentation)

**Prior Work & Contributions**
- Full-stack web development across React, Node.js, TypeScript
- Blockchain development (Solidity, Hardhat, Ethers.js)
- Web3 integration (WalletConnect, wagmi, IPFS)
- Built this MVP as a solo full-stack + smart contract engineer

---

*Ubuntu Health Vault — putting health records back in the hands of the people they belong to.*

*Contact: londiwe.user@gmail.com*

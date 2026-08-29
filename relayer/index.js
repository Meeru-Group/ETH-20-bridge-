require("dotenv").config();
const { ethers } = require("ethers");

const EVM_RPC_URL = process.env.EVM_RPC_URL;
const WTMR = process.env.WTMR_CONTRACT_ADDRESS;
const RELAYER_KEY = process.env.RELAYER_PRIVATE_KEY;
const TMR_BRIDGE_URL = process.env.TMR_BRIDGE_URL;

if (!EVM_RPC_URL || !WTMR || !RELAYER_KEY || !TMR_BRIDGE_URL) {
  console.error("Set EVM_RPC_URL, WTMR_CONTRACT_ADDRESS, RELAYER_PRIVATE_KEY and TMR_BRIDGE_URL");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(EVM_RPC_URL);
const wallet = new ethers.Wallet(RELAYER_KEY, provider);

const abi = [
  "function mintFromTMR(bytes32 depositId,address to,uint256 amount) external",
  "function owner() view returns(address)",
  "event DepositMinted(bytes32 indexed depositId,address indexed to,uint256 amount)"
];
const contract = new ethers.Contract(WTMR, abi, wallet);

async function getDeposits() {
  const r = await fetch(`${TMR_BRIDGE_URL}/api/deposits?status=verified&network=evm-testnet`);
  if (!r.ok) throw new Error(`TMR bridge HTTP ${r.status}`);
  return r.json();
}

async function loop() {
  console.log("wTMR testnet relayer:", wallet.address);
  console.log("Contract:", WTMR);
  while (true) {
    try {
      const data = await getDeposits();
      for (const d of (data.deposits || [])) {
        if (!d.depositId || !d.to || !d.amount) continue;
        const tx = await contract.mintFromTMR(
          d.depositId,
          d.to,
          BigInt(d.amount)
        );
        console.log("Mint submitted:", d.depositId, tx.hash);
        await tx.wait();
        console.log("Mint confirmed:", tx.hash);
      }
    } catch (e) {
      console.error("Relayer:", e.message);
    }
    await new Promise(r => setTimeout(r, Number(process.env.POLL_SECONDS || 10) * 1000));
  }
}
loop();
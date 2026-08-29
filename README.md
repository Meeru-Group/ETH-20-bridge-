# TMR Testnet → EVM Testnet Wrapped TMR

This package creates a real ERC-20 **wTMR testnet token** on an EVM testnet such as Sepolia.

## Flow

TMR Testnet deposit
→ bridge verifies deposit
→ relayer
→ `WrappedTMR.mintFromTMR()`
→ wTMR on Sepolia

Reverse:

wTMR burn
→ `BurnRequested` event
→ TMR bridge verifies event
→ releases TMR Testnet

## Important

This is TESTNET only. It does not represent mainnet TMR and has no intended real-world value.

The smart contract prevents the same TMR deposit ID from being minted twice.

## Deploy

```bash
npm install
cp .env.example .env
```

Set a real Sepolia RPC and a testnet deployer private key.

Then:

```bash
npm run compile
npm run deploy
```

After deployment, save the contract address as `WTMR_CONTRACT_ADDRESS`.

## Bridge ownership

Initially the deployer is the contract owner. For a real bridge, transfer ownership to a dedicated bridge/relayer address or, preferably, a multisig controlled by the testnet bridge operators.

## Wallet

Add the deployed contract address to MetaMask or another EVM wallet as a custom token.

Symbol: `wTMR`
Decimals: `18`

## What is still required for a REAL two-way bridge

The EVM contract alone cannot verify a TMR blockchain transaction. You need a TMR-side bridge service that:

1. observes finalized TMR Testnet deposits;
2. validates destination EVM address;
3. prevents replay;
4. exposes verified deposits to the relayer;
5. observes `BurnRequested` on EVM;
6. verifies the event;
7. releases the locked TMR on TMR Testnet.

Do not use the Vercel RPC gateway as the blockchain source of truth. Use the actual TMR Testnet node/API.


## Vercel deployment

The repository now contains a root `index.html` and a valid `vercel.json`, so the Vercel URL `/` serves the testnet bridge UI instead of returning `404 NOT_FOUND`.

For Vercel, deploy the repository root (`ETH-20-bridge--main`) and do not configure an Express entrypoint.

The Vercel page is only the UI/API layer. The real testnet bridge still needs:
- a deployed `WrappedTMR` contract on an EVM testnet;
- a real TMR Testnet verification service;
- a relayer funded only with testnet gas;
- `TMR_BRIDGE_URL` pointing to that real verification service.

Do not put a private key in frontend code or in `index.html`.

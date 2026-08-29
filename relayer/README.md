# wTMR Testnet Relayer

The relayer watches a REAL TMR Testnet bridge API for verified deposits and calls `mintFromTMR()` on Sepolia.

Expected bridge response:

```json
{
  "deposits": [
    {
      "depositId": "0x...",
      "to": "0x...",
      "amount": "100000000000000000000"
    }
  ]
}
```

`amount` is in wTMR base units (18 decimals).

Do not point this relayer at a fake/simulator endpoint if you want a real testnet bridge.

The relayer private key must contain only testnet funds.

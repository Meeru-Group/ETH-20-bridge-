# TMR Bridge API — Testnet

The relayer expects:

`GET /api/deposits?status=verified&network=evm-testnet`

Response:

```json
{
  "deposits": [
    {
      "depositId": "0x32-byte-id",
      "to": "0xEVM_ADDRESS",
      "amount": "1000000000000000000"
    }
  ]
}
```

Requirements:
- `depositId` must be unique and deterministic for the TMR deposit.
- `to` must be a valid EVM address.
- `amount` is 18-decimal wTMR base units.
- Only finalized/verified TMR deposits may be returned.
- Once minted, the bridge must mark the deposit as processed.

For burn events, consume:

`BurnRequested(bytes32 withdrawalId,address from,uint256 amount,string tmrAddress)`

Then verify the EVM transaction and release the corresponding locked TMR on the TMR Testnet.

module.exports = async function handler(req, res) {
  res.status(200).json({
    status: "online",
    network: "tmr-testnet",
    chainId: "TMR-CHAIN-1",
    service: "tmr-evm-testnet-bridge",
    upstreamConfigured: Boolean(process.env.TMR_UPSTREAM_URL)
  });
};

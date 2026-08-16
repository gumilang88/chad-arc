// ARC chain config — flip game uses native USDC (ARC mainnet, chain 5042)
export const ARC = {
  chainId: 5042,
  chainIdHex: "0x13b2",
  chainName: "ARC Mainnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: [
    "https://arc-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8",
    "https://robinlaunchpad.com/rpc/arc/v1",
    "https://arc-rpc.stakeme.pro/",
  ],
  blockExplorerUrls: ["https://arc-mainnet.cloud.blockscout.com"],
};

// Native USDC token interface address on ARC (ERC-20 mirror, 6 decimals)
export const USDC_ARC = "0x3600000000000000000000000000000000000000";

// House wallet — all losing bets land here. Payouts to winners are sent
// manually by the house from this wallet. CHANGE to your receiving address.
export const HOUSE_WALLET = "0x447d76Cf1488A518C142c2bbb4396B43d72C9721";

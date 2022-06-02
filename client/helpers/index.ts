export const btcToSats = (btc: number): string => {
    const sats = (Number(btc) * 100000000);

    return Number(sats).toFixed(0);
}
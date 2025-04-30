import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Slice } from '@ton/core';

export type RevshareWalletConfig = {
    refId: Slice,
    ownerAddress: Address,
    count: number,
    ttlEarn: number,
    ttlWithdraw: number
};

export function revshareWalletConfigToCell(config: RevshareWalletConfig): Cell {
    return beginCell()
    .storeSlice(config.refId)
    .storeAddress(config.ownerAddress)
    .storeUint(config.count, 32)
    .storeUint(config.ttlEarn, 64)
    .storeUint(config.ttlWithdraw, 64)
    .endCell();
}

export class RevshareWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new RevshareWallet(address);
    }

    static createFromConfig(config: RevshareWalletConfig, code: Cell, workchain = 0) {
        const data = revshareWalletConfigToCell(config);
        const init = { code, data };
        return new RevshareWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}

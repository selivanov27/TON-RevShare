import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type RevShareConfig = {
    ownerAddress: Address;
    countWallets: number;
    walletCode: Cell;
};

export function revShareConfigToCell(config: RevShareConfig): Cell {
    return beginCell()
    .storeAddress(config.ownerAddress)
    .storeUint(config.countWallets, 32)
    .storeRef(config.walletCode)
    .endCell();
}

export class RevShare implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new RevShare(address);
    }

    static createFromConfig(config: RevShareConfig, code: Cell, workchain = 0) {
        const data = revShareConfigToCell(config);
        const init = { code, data };
        return new RevShare(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}

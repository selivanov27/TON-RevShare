import { Address, toNano } from '@ton/core';
import { RevShare } from '../wrappers/RevShare';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const revShare = provider.open(RevShare.createFromConfig({
        ownerAddress: provider.sender().address as Address,
        countWallets: 0,
        walletCode: await compile('RevShareWallet')
    }, await compile('RevShare')));

    await revShare.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(revShare.address);
}

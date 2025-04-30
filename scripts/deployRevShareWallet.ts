import { toNano } from '@ton/core';
import { RevShareWallet } from '../wrappers/RevShareWallet';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const revShareWallet = provider.open(RevShareWallet.createFromConfig({}, await compile('RevShareWallet')));

    await revShareWallet.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(revShareWallet.address);

    // run methods on `revShareWallet`
}

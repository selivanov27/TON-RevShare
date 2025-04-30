import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { RevShareWallet } from '../wrappers/RevShareWallet';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('RevShareWallet', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('RevShareWallet');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let revShareWallet: SandboxContract<RevShareWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        revShareWallet = blockchain.openContract(RevShareWallet.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await revShareWallet.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: revShareWallet.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and revShareWallet are ready to use
    });
});

import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { RevShare } from '../wrappers/RevShare';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('RevShare', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('RevShare');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let revShare: SandboxContract<RevShare>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        revShare = blockchain.openContract(RevShare.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await revShare.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: revShare.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and revShare are ready to use
    });
});

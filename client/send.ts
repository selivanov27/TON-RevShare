import { Address, beginCell, toNano, Dictionary, Cell } from "@ton/core";
import { mnemonicToWalletKey, sha256, sign } from "@ton/crypto";
import { TonClient } from "@ton/ton";

const client  = new TonClient({
    endpoint: '', // put your API endpoint
    apiKey: '' // put your API apiKey
});

const walletAddress = Address.parse(''); // Your wallet address
const mnemonic = 'word1, word2, ... word24'; // Your wallet mnemonic

async function main() {
    
    const contractAddress = Address.parse(''); // Address
    const amount = 1; // Amount TON
    const comment = ''; // Comment

    let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
    let seqno = getMethodResult.stack.readNumber(); // get seqno from response
    const mnemonicArray = mnemonic.split(' '); // get array from string
    const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic 

    let internalMessage = beginCell()
        .storeUint(0x18, 6)
        .storeAddress(contractAddress)
        .storeCoins(toNano(amount))
        .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .storeUint(0, 32)
        .storeStringTail(comment)
        .endCell();

    let toSign = beginCell()
        .storeUint(698983191, 32) // subwallet_id | We consider this further
        .storeUint(Math.floor(Date.now() / 1e3) + 5, 32) // Transaction expiration time, + 5 sec
        .storeUint(seqno, 32) // store seqno
        .storeUint(0, 8)
        .storeUint(3, 8) // store mode of our internal transaction
        .storeRef(internalMessage); // store our internalMessage as a reference
        
    let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature

    let body = beginCell()
        .storeBuffer(signature) // store signature
        .storeBuilder(toSign) // store our message
        .endCell();

    let externalMessage = beginCell()
        .storeUint(0b10, 2) // 0b10 -> 10 in binary
        .storeUint(0, 2) // src -> addr_none
        .storeAddress(walletAddress) // Destination address
        .storeCoins(0) // Import Fee
        .storeBit(0) // No State Init
        .storeBit(1) // We store Message Body as a reference
        .storeRef(body) // Store Message Body as a reference
        .endCell();

 await client.sendFile(externalMessage.toBoc());

}

main().finally(() => console.log("send msg"));
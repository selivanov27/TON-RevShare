import { Address, fromNano, toNano } from '@ton/core';
import { TonClient } from "@ton/ton";

const client  = new TonClient({
	endpoint: '', // put your API endpoint
	apiKey: '' // put your API apiKey
});

const contractAddress = Address.parse(''); // Address

(async () => {
	let { stack }  = await client.runMethod(
		contractAddress, 
		'get_wallet_data',
	);

	let init = stack.readBigNumber();
	let count = stack.readBigNumber();
	let ttlEarn = fromNano(stack.readBigNumber());
	let ttlWithdraw = fromNano(stack.readBigNumber());
	let refId = stack.readBigNumber();
	let ownerAddress = stack.readAddress().toString();
	
	console.log('init', init);
	console.log('count', count);
	console.log('ttl_earn', ttlEarn);
	console.log('ttl_withdraw', ttlWithdraw);
	console.log('ref_id', refId);
	console.log('owner_address', ownerAddress);
	
})().catch(e => console.error(e));
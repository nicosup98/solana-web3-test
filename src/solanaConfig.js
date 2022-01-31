
import {  Provider } from '@project-serum/anchor';
import { Connection,clusterApiUrl  } from '@solana/web3.js';

const NETWORK = clusterApiUrl('devnet');

const opts = {
  preflightCommitment: "processed"
}


export async function checkIfWalletIsConnected(){
	try {
		return connectWallet()
	}	catch (err) {
		console.error(err)
	}
}

export async function connectWallet(){
	const { solana } = window
		if(solana && solana.isPhantom) {
			const connection = await solana.connect()
			console.log("connection",connection.publicKey.toString())
			return connection.publicKey.toString()
		} else {
			alert('Solana object not found! Get a Phantom Wallet 👻');
		}
}

export const getProvider = () => {
  const connection = new Connection(NETWORK, opts.preflightCommitment);
  const provider = new Provider(
    connection, window.solana, opts.preflightCommitment,
  );
	return provider;
}
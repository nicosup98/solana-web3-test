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
import { Program, web3 } from '@project-serum/anchor';
import {  PublicKey } from '@solana/web3.js';
import { getProvider } from './solanaConfig'
import idl from './idl/solanatestproject.json'

const { SystemProgram, Keypair } = web3;
const getKeyPair = ()=> {
	const kp = JSON.parse(localStorage.getItem('baseAccount'))
	if(!!kp) {
		const arr = Object.values(kp._keypair.secretKey)
		const secret = new Uint8Array(arr)
		const baseAccount = Keypair.fromSecretKey(secret)
		return baseAccount
	}
	return Keypair.generate()
}
const programID = new PublicKey(idl.metadata.address);
let baseAccount =getKeyPair();


export const getGifList = async() => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
		console.log(2)
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    
    console.log("Got the account", account)
    return account.gifList

  } catch (error) {
    console.log("Error in getGifList: ", error)
    
  }
	return null
}

export const createGifAccount = async () => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping")
    await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });
    console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
		const haveAnAccount = !localStorage.getItem('baseAccount')
		haveAnAccount && localStorage.setItem('baseAccount',JSON.stringify(baseAccount))
    return await getGifList();

  } catch(error) {
    console.log("Error creating BaseAccount account:", error)
  }
}

export const sendGif = async (inputValue)=> {
	try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    await program.rpc.addGif(inputValue, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    console.log("GIF successfully sent to program", inputValue)

    return await getGifList();
  } catch (error) {
    console.log("Error sending GIF:", error)
  }
}
import { Program, web3 } from '@project-serum/anchor';
import {  PublicKey } from '@solana/web3.js';
import { getProvider } from './solanaConfig'
import idl from './idl/solanatestproject.json'

// const { SystemProgram, Keypair } = web3;

const programID = new PublicKey(idl.metadata.address);



export const getGifList = async(baseAccount) => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    
    console.log("Got the account", account)
    return account.gifList

  } catch (error) {
    console.log("Error in getGifList: ", error)
    
  }
	return null
}

export const createGifAccount = async () => {
	const baseAccount = web3.Keypair.generate();
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping")
    await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [baseAccount]
    });
    console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
    await getGifList(baseAccount);

  } catch(error) {
    console.log("Error creating BaseAccount account:", error)
  }
}
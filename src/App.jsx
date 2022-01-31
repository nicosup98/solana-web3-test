import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { checkIfWalletIsConnected,connectWallet } from './solanaConfig'
import { getGifList, createGifAccount } from './gifUtils'
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
	'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
	'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
	'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
]
const App = () => {
	const [walletAddress,setWalletAddress] = useState(null)
	const [inputValue, setInputValue] = useState('');
	const [gifList, setGifList] = useState([]);
	const connect = async ()=> {
		const wallet = await connectWallet()
		setWalletAddress(wallet)
	}
	const NotConnectedContainer = ()=> (
		<button className="cta-button connect-wallet-button" onClick={connect}>
			connect
		</button>
	)
	const onInputChange= (event)=> {
		setInputValue(event.target.value)
	}
	const fetchGisfs = async ()=> {
		const gifs = await getGifList()
		setGifList(gifs)
	}
	const sendGif = async (gifLink) => {
  if (gifLink && gifLink.trim().length > 0) {
    console.log('Gif link:',gifLink );
		setGifList(pv=> [...pv,gifLink])
		setInputValue('');
  } else {
    console.log('Empty input. Try again.');
  }
}
	const ConnectedContainer = () => (
  <>
		{gifList === null ? (
			<div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          create your gif account
        </button>
      </div>
		)
		:
		(
			<div className="connected-container">
    <form
      onSubmit={(event) => {
        event.preventDefault();
				sendGif(inputValue)
      }}
    >
      <input 
				type="text" 
				value={inputValue} 
				placeholder="Enter gif link!" 
				onChange={onInputChange} 
				placeholder="Enter gif link!" />
      <button type="submit" className="cta-button submit-gif-button">Submit</button>
    </form>
    <div className="gif-grid">
      {gifList.map((gif) => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
		)}
	</>
);

	useEffect(()=> {
		const onload = async () => {
		const connection =await checkIfWalletIsConnected()
		setWalletAddress(connection)
	}
	 	window.addEventListener('load', onload);
		return () => window.removeEventListener('load', onLoad);
	}, [])

	useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    
    // Call Solana program here.
	fetchGisfs()
    // Set state
  }
}, [walletAddress]);
  return (
    <div className="App">
      <div className={walletAddress? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
					{walletAddress ? <ConnectedContainer /> : <NotConnectedContainer />}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

import { useState, useEffect, useContext} from 'react';
import {getEthers} from '../utils.js';
import logo from './assets/nav/logo.png';
import ProviderContext from '../context/provider-context';
import { ExternalLink } from 'react-external-link';

const provider = getEthers();
//const { ethers } = require("ethers");

const Header = (props) => {
    const prv = useContext(ProviderContext);
    const [account, setAccount] = useState("Connect");
    
    const connectBtn = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            setAccount(accounts[0]);
        }
    };

    useEffect(() => {
        const init = async () =>{
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                setAccount(accounts[0]);
            }   
        };
        init();
    }, [account]);

    return(
        <div>
            <nav className="navbar navbar-expand-md navbar-dark fixed-top" id="mainNav">
			<div className="container bg-dark bg-gradient bg-opacity-75">
				<a className="navbar-brand" ><img src= {logo} alt="Underground." width="370" height="20" /></a>

				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
					Menu
					<i className="fas fa-bars ms-1"></i>
				</button>
				<div className="collapse navbar-collapse" id="navbarResponsive">
					<ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
						<li className="nav-item">
							<ExternalLink className="nav-btn btn btn-danger btn-sm text-uppercase" href=" https://traderjoexyz.com/trade?outputCurrency=0x8e8148078f913a36c9d8c7fb2da8b479c77c6ba5#/" target="_blank">BUY $BLOOD</ExternalLink>
						</li>
						<li className="nav-item">
							<ExternalLink className="nav-btn btn btn-danger btn-sm text-uppercase" href="https://traderjoexyz.com/pool/0x8E8148078F913a36C9d8C7FB2da8b479c77c6bA5/AVAX#/" target="_blank">GET LP</ExternalLink>
						</li>
						<li className="nav-item">
							<ExternalLink className="nav-btn btn btn-danger btn-sm text-uppercase" href="https://farm.the-u.club/" target="_blank">STAKE LP</ExternalLink>
						</li>
						<li className="nav-item">
							
							<ExternalLink className="nav-btn btn btn-danger btn-sm text-uppercase" href="https://the-u.club/wlhub/">WL SPOTS</ExternalLink>
						</li>
						<a className="nav-btn btn btn-secondary btn-sm text-uppercase">P2E Game</a>
						<li className="nav-item nav-link"><a className="social-link" target="_blank" href="{twitterURL}"><i className="fab fa-twitter"></i></a> <a className="social-link" target="_blank" href="<?= $discordURL ?>"><i className="fab fa-discord"></i></a></li>
						<li className="nav-item">
                                <a id="btn-connect" className="d-inline-block text-truncate nav-btn btn btn-warning btn-sm " style={{width: "90px"}} onClick={connectBtn}>{account}</a>
                        </li>
					</ul>
				</div>
			</div>
		</nav>
        </div>
    )
}
export default Header;
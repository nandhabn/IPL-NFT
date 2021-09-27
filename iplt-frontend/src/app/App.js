import { useEffect, useState } from "react";
import { appReducer, fetchAccountDetails } from "./App.slice";
import { useInjectReducer, useInjectSaga } from "redux-injectors";
import appSaga from "./App.saga";
import './styles.css';
import { Layout, Menu, Row } from "antd";
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./container/Home/Home";
import { MarketPlace } from "./container/MarketPlace/MarketPlace";
import { MintToken } from "./container/MintToken/MintToken";
import SigninButton from './components/Wallet/SignInButton';
import WalletModal from './components/Wallet/WalletModal';
import { useMetamask } from "use-metamask";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";

const { Content, Sider, Header } = Layout;

const App = () => {
  useInjectReducer({ key: "app", reducer: appReducer });
  useInjectSaga({ key: "app", saga: appSaga });

  const { connect, metaState } = useMetamask();
  const [address, setAddress] = useState();
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setAddress(metaState.account[0] && (metaState.account[0].substring(0, 5) + "..." + metaState.account[0].substring(metaState.account[0].length - 3, metaState.account[0].length)).slice(2));
  }, [metaState.account]);

  const connectMetamask = async () => {
    try {
      await connect(ethers.providers.Web3Provider, "any");
    }
    catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (metaState.isConnected) {
      dispatch(fetchAccountDetails(metaState.account));
    }
  }, [dispatch, metaState.account, metaState.isConnected]);

  return (
    <Layout className="App overflow-auto">
      <Header>
        <div className="container-fluid">
          <Row className="row justify-content-between">
            <div className="col-5">
              <p className="logo" style={{ color: "white", fontSize: "15px" }}>
                <img
                  alt=""
                  src="../../public/IPL-Logo.png"
                  style={{ width: "20px" }}
                />{" "}
                Moments
              </p>
            </div>

            <div className="col-3 align-items-center justify-content-center p-3">
              {metaState.isConnected ?
                <SigninButton onClick={e => setShowWalletDetails(true)} btnName={
                  `${address}
            [${metaState.chain.name === 'unknown' ?
                    metaState.chain.id === '97' ?
                      "bsc-test" :
                      "bsc-main"
                    :
                    metaState.chain.name}]`} />
                :
                <SigninButton onClick={connectMetamask} btnName="Connect Wallet" />

              }
              <WalletModal
                setShow={setShowWalletDetails}
                show={showWalletDetails} />
            </div>
          </Row>
        </div>
      </Header>
      <Layout>
        <Router>
          <Sider>
            <Menu theme="dark">
              <Menu.Item key="home">
                <Link to={"/home"}>Home</Link>
              </Menu.Item>
              <Menu.Item key="market">
                <Link to={"/market"}>Market Place</Link>
              </Menu.Item>
              <Menu.Item key="mint">
                <Link to={"/mint"}>Mint Tokens</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content>
            <Switch>
              <Route path={"/home"} component={Home} />
              <Route path={"/market"} component={MarketPlace} />
              <Route path={"/mint"} component={MintToken} />
            </Switch>
          </Content>
        </Router>
      </Layout>
    </Layout>
  );
}

export default App;

import { useEffect, useState } from "react";
import { appReducer, fetchAccountDetails, fetchSigner } from "./App.slice";
import { useInjectReducer, useInjectSaga } from "redux-injectors";
import appSaga from "./App.saga";
import "./styles.css";
import { Layout, Menu, Row } from "antd";
import { useHistory, useLocation } from "react-router";
import { Link, Switch, Route } from "react-router-dom";
import { Home } from "./container/Home/Home";
import { MarketPlace } from "./container/MarketPlace/MarketPlace";
import { MintToken } from "./container/MintToken/MintToken";
import SigninButton from "./components/Wallet/SignInButton";
import WalletModal from "./components/Wallet/WalletModal";
import { useMetamask } from "use-metamask";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { selectContracts } from "./app.selector";
import { find, isEmpty } from "lodash";
import { CreatePacks } from "./container/CreatePacks/CreatePacks";
import { MyCollections } from "./container/MyCollections/MyCollections";

const { Content, Sider, Header } = Layout;
const protectedRoute = ["/mint", "/createPack"];

const App = () => {
  useInjectReducer({ key: "app", reducer: appReducer });
  useInjectSaga({ key: "app", saga: appSaga });

  const { connect, metaState } = useMetamask();
  const [address, setAddress] = useState();
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const history = useHistory();

  const dispatch = useDispatch();
  const contracts = useSelector(selectContracts);
  const location = useLocation();

  useEffect(() => {
    const account0 = metaState.account[0];
    setAddress(account0 && `${account0.substring(2, 5)}...${account0.slice(-3)}`);
    dispatch(fetchAccountDetails(metaState.account));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaState.account]);

  const connectMetamask = async () => {
    try {
      await connect(ethers.providers.Web3Provider, "any");
      dispatch(fetchSigner(metaState.account));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!isAdmin && find(protectedRoute, (path) => location.pathname === path)) {
      console.log(
        !isAdmin,
        find(protectedRoute, (path) => location.pathname === path)
      );
      history.push("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isAdmin]);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const admin = await contracts.IPLM.owner();
        setAdmin(Number(metaState.account[0]) === Number(admin));
      } catch (e) {
        console.log(e.message);
      }
    };
    if (!isEmpty(contracts?.IPLM?.signer)) {
      checkAdmin();
    }
  }, [contracts?.IPLM, metaState.account]);

  useEffect(() => {
    if (metaState.isConnected) {
      dispatch(fetchSigner(metaState.account));
    }
  }, [dispatch, metaState.account, metaState.isConnected]);

  return (
    <Layout className="App">
      <Header>
        <div className="container-fluid">
          <Row className="row justify-content-between">
            <div className="col-5">
              <p className="logo" style={{ color: "white", fontSize: "15px" }}>
                IPL Moments{isAdmin && " Admin Dashboard"}
              </p>
            </div>

            <div className="col-3 align-items-center justify-content-center p-3">
              {metaState.isConnected ? (
                <SigninButton
                  onClick={(e) => setShowWalletDetails(true)}
                  btnName={`${address}
                  [${
                    metaState.chain.name === "unknown"
                      ? metaState.chain.id === "97"
                        ? "bsc-test"
                        : "bsc-main"
                      : metaState.chain.name
                  }]`}
                />
              ) : (
                <SigninButton onClick={connectMetamask} btnName="Connect Wallet" />
              )}
              <WalletModal setShow={setShowWalletDetails} show={showWalletDetails} />
            </div>
          </Row>
        </div>
      </Header>
      <Layout className="overflow-auto">
        <Sider>
          <Menu theme="dark" selectedKeys={location?.pathname.split("/")[1]}>
            <Menu.Item key="home">
              <Link to={"/home"}>Home</Link>
            </Menu.Item>
            <Menu.Item key="market">
              <Link to={"/market"}>Market Place</Link>
            </Menu.Item>
            <Menu.Item key="my-collection">
              <Link to={"/my-collection"}>My Collections</Link>
            </Menu.Item>
            {isAdmin && (
              <>
                <Menu.Item key="mint">
                  <Link to={"/mint"}>Mint Tokens</Link>
                </Menu.Item>
                <Menu.Item key="createPack">
                  <Link to={"/createPack"}>Create Pack</Link>
                </Menu.Item>
              </>
            )}
          </Menu>
        </Sider>
        <Content style={{ margin: "0 16px" }}>
          <Switch>
            {/* <Redirect from="/" to="/home" /> */}
            <Route path={"/home"} component={Home} />
            <Route path={"/market"} component={MarketPlace} />
            <Route path={"/my-collection"} component={MyCollections} />
            {isAdmin && (
              <>
                <Route path={"/mint"} component={MintToken} />
                <Route path={"/createPack"} component={CreatePacks} />
              </>
            )}
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { appReducer, fetchAccountDetails } from "./App.slice";
import { useInjectReducer, useInjectSaga } from "redux-injectors";
import appSaga from "./App.saga";
import { isEmpty } from "lodash";
import { Layout, Menu, Row } from "antd";
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./container/Home/Home";
import { MarketPlace } from "./container/MarketPlace/MarketPlace";
import { MintToken } from "./container/MintToken/MintToken";

const { Content, Sider, Header } = Layout;

const useAccounts = () => {
  const [accounts, setAccounts] = useState();

  useEffect(() => {
    window.ethereum.request({
      method: "eth_requestAccounts",
    });
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      setAccounts(accounts);
    });
    window.ethereum.on("accountsChanged", function (accounts) {
      setAccounts(accounts);
    });
  }, []);
  return accounts;
};

function App() {
  useInjectReducer({ key: "app", reducer: appReducer });
  useInjectSaga({ key: "app", saga: appSaga });

  const [isLoading, setLoading] = useState(true);

  const accounts = useAccounts();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(accounts)) setLoading(false);
  }, [accounts]);

  useEffect(() => {
    if (!isEmpty(accounts)) {
      dispatch(fetchAccountDetails(accounts));
    }
  }, [dispatch, accounts]);

  if (isLoading) {
    return <>Fetching wallet</>;
  }

  return (
    <Layout className="App">
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
            <div className="col-1 align-content-center">
              <p
                style={{
                  background: "white",
                  borderRadius: "50px",
                  height: "30px",
                  lineHeight: "30px",
                  padding: "0 5px",
                  margin: "25px 0",
                }}
              >
                {accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4)}
              </p>
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

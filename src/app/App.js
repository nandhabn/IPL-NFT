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
import { MintMoments } from "./components/MintMoments/MintMoments";

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
            <div className="col-1">
              <p className="logo" style={{ color: "white" }}>
                IPL Moments
              </p>
            </div>
            <MintMoments />
          </Row>
        </div>
      </Header>
      <Layout>
        <Router>
          <Sider>
            <Menu theme="dark">
              <Menu.Item>
                <Link to={"/home"}>Home</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={"/market"}>Market Place</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content>
            <Switch>
              <Route path={"/home"} component={Home} />
              <Route path={"/market"} component={MarketPlace} />
            </Switch>
          </Content>
        </Router>
      </Layout>
    </Layout>
  );
}

export default App;

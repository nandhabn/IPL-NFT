import { useMetamask } from 'use-metamask';
import { Modal } from 'antd';
import newTab from '../../../assets/icons/open-newtab.svg';
import CopyToolTip from './CopyToolTip';
import { scanLinks } from '../../../utils/constants.json';
const WalletModal = ({ show, setShow }) => {

    const { metaState } = useMetamask();
    const hideModal = () => {
        setShow(false);
    };

    const logOut = async () => {
        window.history.go(0);
    };

    return (
        <div>
            <Modal
                centered
                visible={show}
                onOk={logOut}
                okText="Logout Account"
                onCancel={hideModal}
            >
                <div className="d-flex flex-column">
                    <h5 className="m-b-36">Wallet Details</h5>
                    <div className="d-flex flex-row justify-content-between mb-3 copy-address">
                        {metaState.account[0]}

                        <a target="_blank"
                            rel="noopener noreferrer"
                            className=" mb-4 view-on-screen"
                            href={scanLinks[metaState.chain.id] + "/address/" + metaState.account[0]}>
                            <img src={newTab} alt="new-tab" /></a>
                        <CopyToolTip address={metaState.account[0]} />
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default WalletModal;

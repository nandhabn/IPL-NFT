import ModelViewer from '@metamask/logo';
import { Row } from 'antd';
import { useEffect, useRef } from 'react';

const SigninButton = ({ onClick, btnName }) => {

    const metamaskRef = useRef();

    useEffect(() => {
        const viewer = ModelViewer({

            pxNotRatio: true,
            width: 22,
            height: 21,

            followMouse: false,

            slowDrift: false,

        })

        metamaskRef.current.appendChild(viewer.container);

        viewer.setFollowMouse(true);

        viewer.stopAnimation();

    }, []);

    return (

        <div
            className="signin align-items-center justify-content-center d-flex"
            onClick={onClick}>
            <Row>
                <div ref={metamaskRef}></div>
                <div className="m-l-6">{btnName}</div>
            </Row>
        </div>
    );
};

export default SigninButton;
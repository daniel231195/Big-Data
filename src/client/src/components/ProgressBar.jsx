import { useState } from "react";
import styled from "styled-components";

const ProgressBar = ({ done }) => {
    const [style, setStyle] = useState({});

    setTimeout(() => {
        const newStyle = {
            opacity: 1,
            width: `${done}%`
        }

        setStyle(newStyle);
    }, 200);

    return (
        <Progress>
            <ProgressDone style={style}>
                {done}
            </ProgressDone>
        </Progress>
    )
}

const Progress = styled.div`
    background-color: #d8d8d8;
    border-radius: 20px;
    position: relative;
    margin: 15px 0;
    height: 30px;
    width: 300px;
`;

const ProgressDone = styled.div`
    background: #0DCAF0;
	box-shadow: 0 3px 3px -5px #F2709C, 0 2px 5px ;
	border-radius: 20px;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 0;
	opacity: 0;
	transition: 1s ease 0.3s;
`;

export default ProgressBar;
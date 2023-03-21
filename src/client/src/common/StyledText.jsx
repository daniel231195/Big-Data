import styled from "styled-components";

const StyledText = ({text, width, color, size, ...props}) => {
    return (
        <StyledTextContainer {...{width, color, size, ...props}}>{text}</StyledTextContainer>
    )
}
const StyledTextContainer = styled.div`
    width: ${({width}) => width? width : 'fit-content'};
    color: ${({color}) => color? color : 'white'};
    font-family: 'Open Sans';
    font-size: ${({size}) => size? size : '20px'};

`
export default StyledText;
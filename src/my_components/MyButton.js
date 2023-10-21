import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

function MyButton(props) {
  return (
    <StyledButton onClick={props.cb}> {props.title} </StyledButton>
  );
}

export default MyButton;
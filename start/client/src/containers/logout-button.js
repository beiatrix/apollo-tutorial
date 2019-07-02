import React from 'react';
import styled from 'react-emotion';
import { ApolloConsumer } from 'react-apollo';

import { menuItemClassName } from '../components/menu-item';
import { ReactComponent as ExitIcon } from '../assets/icons/exit.svg';

export default function LogoutButton() {
    return (
      <ApolloConsumer>
        {client => (
          // When we click the button, we perform a direct cache write by calling client.writeData and passing in a data object that sets the isLoggedIn boolean to false.
          <StyledButton
            onClick={() => {
              client.writeData({ data: { isLoggedIn: false } });
              localStorage.clear();
            }}
          >
            <ExitIcon />
            Logout
          </StyledButton>
        )}
      </ApolloConsumer>
    );
  }
  
  const StyledButton = styled('button')(menuItemClassName, {
    background: 'none',
    border: 'none',
    padding: 0,
  });
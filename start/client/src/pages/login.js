import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import { LoginForm, Loading } from '../components';

// mutation
const LOGIN_USER = gql `
    mutation login($email: String!) {
        login(email: $email)
    }
`

// Mutation component
// bind the above mutation to our component by passing it to the mutation prop
export default function Login() {
    return (
    // ApolloConsumer takes a render prop function as a child that is called with the client instance. Let's wrap our Mutation component with  ApolloConsumer to expose the client.
      <ApolloConsumer>
        {client => (
          <Mutation
            mutation={LOGIN_USER}
            onCompleted={({ login }) => {
              localStorage.setItem('token', login);
              client.writeData({ data: { isLoggedIn: true } });
            }}
          >
            {(login, { loading, error }) => {
              // this loading state will probably never show, but it's helpful to
              // have for testing
              if (loading) return <Loading />;
              if (error) return <p>An error occurred</p>;
  
              return <LoginForm login={login} />;
            }}
          </Mutation>
        )}
      </ApolloConsumer>
    );
  }
  
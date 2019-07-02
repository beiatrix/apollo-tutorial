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
        <Mutation mutation={LOGIN_USER}>
            {(login, { data }) => <LoginForm login={login} />}
        </Mutation>
    )
}
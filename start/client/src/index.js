
import { Query, ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';
import Login from './pages/login';
import injectStyles from './styles';
import { resolvers, typeDefs } from './resolvers';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/'
})

const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    // Specifying the headers option on HttpLink allows us to read the token from localStorage and attach it to the request's headers each time a GraphQL operation is made.
    headers: {
      authorization: localStorage.getItem('token')
    }
  }),
  typeDefs,
  resolvers
})

// adds default state to the Apollo cache
cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    cartItems: [],
  },
})

// we create our IsUserLoggedIn local query by adding the  @client directive to the isLoggedIn field
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`

injectStyles()

// To connect Apollo Client to React, we will wrap our app in the ApolloProvider component exported from the react-apollo package and pass our client to the client prop. The  ApolloProvider component is similar to React’s context provider. It wraps your React app and places the client on the context, which allows you to access it from anywhere in your component tree.
ReactDOM.render(
    <ApolloProvider client={client}>
      {/* We render a  Query component, pass our local query in, and specify a render prop function that renders either a login screen or the homepage depending if the user is logged in. Since cache reads are synchronous, we don't have to account for any loading state. */}
      <Query query={IS_LOGGED_IN}>
        {({ data }) => (data.isLoggedIn ? <Pages /> : <Login />)}
      </Query>      
    </ApolloProvider>, document.getElementById('root')
);
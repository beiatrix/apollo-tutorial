import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/'
})

const client = new ApolloClient({
  cache,
  link
})

// To connect Apollo Client to React, we will wrap our app in the ApolloProvider component exported from the react-apollo package and pass our client to the client prop. The  ApolloProvider component is similar to React’s context provider. It wraps your React app and places the client on the context, which allows you to access it from anywhere in your component tree.

ReactDOM.render(
    <ApolloProvider client={client}>
      <Pages />
    </ApolloProvider>, document.getElementById('root')
);
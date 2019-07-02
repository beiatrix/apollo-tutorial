import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { GET_LAUNCH_DETAILS } from '../pages/launch';
import Button from '../components/button';

// call the addOrRemoveFromCart mutation in a component
// the only thing we need to add to our mutation is a @client directive to tell Apollo to resolve this mutation from the cache instead of a remote server.
const TOGGLE_CART = gql`
  mutation addOrRemoveFromCart($launchId: ID!) {
    addOrRemoveFromCart(id: $launchId) @client
  }
`;

const CANCEL_TRIP = gql`
    mutation cancel($launchId: ID!) {
        cancelTrip(launchId: $launchId) {
            success
            message 
            launches {
                id
                isBooked
            }
        }
    }
`

export default function ActionButton({ isBooked, id, isInCart }) {
    return (
      <Mutation
        mutation={isBooked ? CANCEL_TRIP : TOGGLE_CART}
        variables={{ launchId: id }}
        refetchQueries={[
          {
            query: GET_LAUNCH_DETAILS,
            variables: { launchId: id },
          },
        ]}
      >
        {(mutate, { loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>An error occurred</p>;
  
          return (
            <div>
              <Button
                onClick={mutate}
                isBooked={isBooked}
                data-testid={'action-button'}
              >
                {isBooked
                  ? 'Cancel This Trip'
                  : isInCart
                  ? 'Remove from Cart'
                  : 'Add to Cart'}
              </Button>
            </div>
          );
        }}
      </Mutation>
    );
  }
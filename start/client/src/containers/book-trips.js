import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Button from '../components/button';
import { GET_LAUNCH } from './cart-item';

const BOOK_TRIPS = gql`
    mutation BookTrips($launchIds: [ID]!) {
        bookTrips(launchIds: $launchIds) {
            success
            message
            launches {
                id
                isBooked
            }
        }
    }
`

export default function BookTrips({ cartItems }) {
    return (
        <Mutation
        mutation={BOOK_TRIPS}
        variables={{ launchIds: cartItems }}
        refetchQueries={cartItems.map(launchId => ({
            query: GET_LAUNCH,
            variables: { launchId }
        }))}
            // In this example, we're directly calling cache.writeData to reset the state of the cartItems after the  BookTrips mutation is sent to the server. This direct write is performed inside of the update function, which is passed our Apollo Client instance.
            update={cache => {
                cache.writeData({ data: { cartItems: [] }})
            }}
        >
            {(bookTrips, { data, loading, error }) => 
                data && data.bookTrips & !data.bookTrips.success ? (
                    <p data-testid="message">{data.bookTrips.message}</p>
                ) : (
                    <Button onClick={bookTrips} data-testid="book-button">
                        Book All
                    </Button>
                )
            }
        </Mutation>
    )
}
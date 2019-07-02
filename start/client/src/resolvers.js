import gql from 'graphql-tag';

// To build a client schema, we extend the types of our server schema and wrap it with the gql function. Using the extend keyword allows us to combine both schemas inside developer tooling like Apollo VSCode and Apollo DevTools.

export const typeDefs = gql`
    extend type Query {
        isLoggedIn: Boolean!
        cartItems: [ID!]!
    }

    extend type Launch {
        isInCart: Boolean!
    }

    extend type Mutation {
        addOrRemoveFromCart(id: ID!): [Launch]
    }
`

export const resolvers = {}
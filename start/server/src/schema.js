const { gql } = require('apollo-server')

const typeDefs = gql`
    type Query {
        # this query takes in two paramenters, pageSize and after, and returns a LaunchConnection
        launches(
            # these comments are called docstrings
            """the number of results to show. must be >= 1. default = 20."""
            pageSize: Int
            """if you add a cursor here, it will only return results _after_ this cursor"""
            after: String
        ): LaunchConnection! # returns a result that shows list of launches and a cursor field that keeps track of where we are in the list and a hasMore field to indicate if there's more data to be fetched
        launch(id: ID!): Launch
        # Queries for the current user
        me: User
    }

    type Mutation {
        # if false, booking trips failed -- check errors
        bookTrips(launchIds: [ID]!): TripUpdateResponse!

        # if false, cancellation failed -- check errors
        cancelTrip(launchId: ID!): TripUpdateResponse!

        login(email: String): String # login token
    }

    type Launch {
        id: ID!
        site: String
        mission: Mission
        rocket: Rocket
        isBooked: Boolean!
    }

    type Rocket {
        id: ID!
        name: String
        type: String
    }

    type User {
        id: ID!
        email: String!
        trips: [Launch]!
    }

    type Mission {
        name: String
        missionPatch(size: PatchSize): String
    }

    enum PatchSize {
        SMALL
        LARGE
    }    

    type TripUpdateResponse {
        success: Boolean!
        message: String
        launches: [Launch]
    }

    # simple wrapper around our list of launches that contains a cursor to the last item in the list. pass this cursor to the launches query to fetch results after these.
    type LaunchConnection {
        cursor: String!
        hasMore: Boolean!
        launches: [Launch]!
    }    
`

module.exports = typeDefs
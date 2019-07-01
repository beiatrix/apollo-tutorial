const { paginateResults } = require('./utils')

// resolver for query type fields - launches, launch, and me
module.exports = {
    Query: {
        // first argument to our top-level resolvers, `parent`, is always blank because it refers to the root of our graph
        // second argument refers to any `arguments` passed into our query
        // finally destructure data sources from third argument, `context` to call them into our resolvers
        launches: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allLaunches = await dataSources.launchAPI.getAllLaunches()
            // we want these in reverse chronological order
            allLaunches.reverse()
            const launches = paginateResults({ 
                after,
                pageSize,
                results: allLaunches
            })
            return {
                launches,
                cursor: launches.length ? launches[launches.length - 1].cursor: null,
                // if the cursor of the end of the paginated results is the same as the last item in _all_ results, then there are no more results after this
                hasMore: launches.length
                    ? launches[launches.length - 1].cursor !==
                      allLaunches[allLaunches.length - 1].cursor
                    : false
            }
        },
        launch: (_, { id }, { dataSources }) => 
            dataSources.launchAPI.getLaunchById({ launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    },
    Mutation: {
        // both bookTrips and cancelTrips must return the properties specified on our TripUpdateResponse type from our schema, which contains a success indicator, a status message, and an array of launches that we've either booked or cancelled
        bookTrips: async (_, { launchIds }, { dataSources }) => {
            const results = await dataSources.userAPI.bookTrips({ launchIds });
            const launches = await dataSources.launchAPI.getLaunchesByIds({
              launchIds,
            });
        
            return {
              success: results && results.length === launchIds.length,
              message:
                results.length === launchIds.length
                  ? 'trips booked successfully'
                  : `the following launches couldn't be booked: ${launchIds.filter(
                      id => !results.includes(id),
                    )}`,
              launches,
            };
          },
          cancelTrip: async (_, { launchId }, { dataSources }) => {
            const result = await dataSources.userAPI.cancelTrip({ launchId });
        
            if (!result)
              return {
                success: false,
                message: 'failed to cancel trip',
              };
        
            const launch = await dataSources.launchAPI.getLaunchById({ launchId });
            return {
              success: true,
              message: 'trip cancelled',
              launches: [launch],
            };
          },
        // login resolver receives an email address and returns a token if a user exists
        // later, we save that token on the client
        login: async(_, { email }, { dataSources }) => {
            const user = await dataSources.userAPI.findOrCreateUser({ email })
            if (user) return Buffer.from(email).toString('base64')
        }
    },
    Launch: {
        isBooked: async(launch, _, { dataSources }) => 
            dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
    },
    Mission: {
        missionPatch: (mission, { size } = { size: 'LARGE' }) => {
            return size === 'SMALL'
                ? mission.missionPatchSmall
                : mission.missionPatchLarge
        }
    },
    User: {
        trips: async (_, __, { dataSources }) => {
            // get ids of launches by user
            const launchIds = await dataSources.userAPI.getLaunchIdsByUser()

            if (!launchIds.length) return []

            // look up those launches by their ids
            return (
                dataSources.launchAPI.getLaunchesByIds({
                    launchIds,
                }) || []
            )
        }
    }
}
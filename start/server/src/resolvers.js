// resolver for uery type fields - launches, launch, and me

module.exports = {
    Query: {
        // first argument to our top-level resolvers, `parent`, is always blank because it refers to the root of our graph
        // second argument refers to any `arguments` passed into our query
        // finally destructure data sources from third argument, `context` to call them into our resolvers
        launches: (_, __, { dataSources }) => 
            dataSources.launchAPI.getAllLaunches(),
        launch: (_, { id }, { dataSources }) => 
            dataSources.launchAPI.getLaunchById({ launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    }
}
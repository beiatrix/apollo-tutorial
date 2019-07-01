const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils'); // set up database

// set up data sources
const LaunchAPI = require('./datasources/launch')
const UserAPI = require('./datasources/user')

// creates db
const store = createStore()

const server = new ApolloServer({ 
    typeDefs,
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new UserAPI({ store })
    })
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
})
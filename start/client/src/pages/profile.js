import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { Loading, Header, LaunchTile } from '../components';
import { LAUNCH_TILE_DATA } from './launches';

// query
const GET_MY_TRIPS = gql`
    query GetMyTrips {
        me {
            id
            email
            trips {
                ...LaunchTile
            }
        }
    }
    ${LAUNCH_TILE_DATA}
`

// query component
export default function Profile() {
    return (
    // this is what customizes the fetch policy
      <Query query={GET_MY_TRIPS} fetchPolicy="network-only"> 
        {({ data, loading, error }) => {
          if (loading) return <Loading />;
          if (error) return <p>ERROR: {error.message}</p>;
  
          return (
            <Fragment>
              <Header>My Trips</Header>
              {data.me && data.me.trips.length ? (
                data.me.trips.map(launch => (
                  <LaunchTile key={launch.id} launch={launch} />
                ))
              ) : (
                <p>You haven't booked any trips</p>
              )}
            </Fragment>
          );
        }}
      </Query>
    );
  }
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { LaunchTile, Header, Button, Loading } from '../components';

const GET_LAUNCHES = gql`
    query launchList($after: String) {
        launches(after: $after) {
            cursor
            hasMore
            launches {
                id
                isBooked
                rocket {
                    id
                    name
                }
                mission {
                    name
                    missionPatch
                }
            }
        }
    }
`

export default function Launches() {
    return (
      <Query query={GET_LAUNCHES}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />;
          if (error) return <p>ERROR</p>;
  
          return (
            <Fragment>
              <Header />
              {data.launches &&
                data.launches.launches &&
                data.launches.launches.map(launch => (
                  <LaunchTile
                    key={launch.id}
                    launch={launch}
                  />
                ))}
            </Fragment>
          );
        }}
      </Query>
    );
  };


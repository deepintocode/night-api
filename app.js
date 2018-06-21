'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const schema = require('./graphql/schema');
const Inert = require('inert');
const Vision = require('vision');
const Pack = require('./package');
const HapiSwagger = require('hapi-swagger');
const Venue = require('./models/Venue');

// .env File Configuration
const dotenv = require('dotenv').config();
const DB = process.env.MONGOLAB_URI;

// MongoDB Configuration
mongoose.connect(DB)
  .then(res => console.log('Connected to DB'))
  .catch(err => console.log(err));

mongoose.connection.once('open', () => {
  console.log('Connected to database');
});

// Server Configuration
const server = Hapi.server({
  host: 'localhost',
  port: 3000
});

// Routes
server.route([{
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return 'Hello World';
  }
},
{
  method: 'GET',
  path: '/api/venues',
  config: {
    description: 'Get all the venues',
    tags: ['api', 'v1', 'venue']
  },
  handler: (request, reply) => {
    return Venue.find();
  }
},
{
  method: 'POST',
  path: '/api/venues',
  config: {
    description: 'Post a specific venue by ID',
    tags: ['api', 'v1', 'venue']
  },
  handler: (request, reply) => {
    const { name, location } = request.payload;
    const venue = new Venue({
      name,
      location
    });
    return venue.save();
  }
}
]);

// Start the server
const start = async () => {

  try {
    await server.register({
      plugin: graphiqlHapi,
      options: {
        path: '/graphiql',
        graphiqlOptions: {
          endpointURL: '/graphql'
        },
        route: {
          cors: true
        }
      }
    });
    await server.register({
      plugin: graphqlHapi,
      options: {
        path: '/graphql',
        graphqlOptions: {
          schema
        },
        route: {
          cors: true
        }
      }
    });
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: 'Venues API Documentation',
            version: Pack.version
          }
        }
      }
    ]);
    await server.start();
  }

  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server running at: ${server.info.uri}`);
};

start();

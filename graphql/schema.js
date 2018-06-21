const graphql = require('graphql');
const VenueType = require('./VenueType');
const Venue = require('./../models/Venue');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    venue: {
      type: VenueType,
      args: {id: { type: GraphQLString } },
      resolve(parent, args) {
        return Venue.findById(args.id);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
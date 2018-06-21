const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

const VenueType = new GraphQLObjectType({
  name: 'Venue',
  fields: () => ({
    id: { type: GraphQLString},
    name: { type: GraphQLString },
    location: { type: GraphQLString }
  })
});

module.exports = VenueType;
---
title: Unit testing GraphQL resolvers
date: 2022-11-17 20:19:00
tags: graphql, testing
---

I'm not a religious person, but I do believe in a few things. One thing I believe is the domain code of a non-trivial system should be blissfully ignorant of the technologies used to drive it's use cases. If your system creates orders

Original Server

```Typescript
const schema = gql`
  type Astronaut {

  }

  type Mission {

  }

  type Query {
    mission(id: ID!): ProductOption!
  }
`
const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs: Schema,
    resolvers,
  }),
});
```

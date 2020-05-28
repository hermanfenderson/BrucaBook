import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { InMemoryCache } from 'apollo-cache-inmemory'


const GraphqlClient = () => {

  return {
    exec: async () => {
      console.log(typeof fetch);
      const client = new ApolloClient({
        link: createHttpLink({
          fetch: fetch,
          uri: "https://api.graphcms.com/simple/v1/swapi ",
        }),
      })

      let films = null
      try {
        const result =  await client.query({
          query: gql`
          query {
            allFilms {
              title
            }
          }`
        })
        films = result.data
      }
      catch (error) {
        console.log(error);
      }
      return films
    },
  }
}

export default GraphqlClient
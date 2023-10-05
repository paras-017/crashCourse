const express = require('express')
const {ApolloServer} = require('@apollo/server')
const {expressMiddleware} = require('@apollo/server/express4')
const bodyParser = require('body-parser');
const cors = require('cors');
const { default:axios } = require('axios');
const port = 8000

async function startServer(){
    const app = express()
    const server = new ApolloServer({
    //If you want to fetch anything from 'graphQL' server you have to query it  and for sending yout have use 'mutation'
        typeDefs:`
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
                website: String!
            }

             type Todo{
                id: ID!,
                title: String,
                completed: Boolean
             }
           
             type Query{
                getTodos: [Todo]
                getAllUsers: [User]
                getUser(id:ID!): User
             }
        `,
        resolvers:{
            Query:{
                getTodos: async()=> (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAllUsers: async()=> (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUser: async(parent, {id})=> (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
                
            }
        }
    })
    
    app.use(bodyParser.json())
    app.use(cors())
    await server.start()

    app.use('/graphql', expressMiddleware(server))

    app.listen(port, ()=>console.log(`Server started at http://localhost:${port}`))
}
startServer()
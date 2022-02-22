import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro';

require('dotenv').config();
const postgres = require('postgres');
const sql = postgres();

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(username: String): User
    todos: [Todo]
  }
  type User {
    name: String
    username: String
  }

  type Mutation {
    createTodo(title: String, checked: Boolean): Todo
    updateTodo(id: ID!, title: String!, checked: Boolean!): Todo
  }

  type Todo {
    id: ID
    title: String
    checked: Boolean
  }
`;
const users = [
  { name: 'Leeroy Jenkins', username: 'leeroy' },
  { name: 'Foo Bar', username: 'foobar' },
];

async function getTodos() {
  return await sql 'select * from todos';
}

async function createTodo(title) {
  return await sql 'select * from todos';
}

async function updateTodo(id, title, checked) {
  return await sql `UPDATE todos SET title = ${title}, checked = ${checked} WHERE id = ${parseInt(id)} RETURNING id, title, checked`;
}

const resolvers = {
  Query: {
    users() {
      return users;
    },
    user(parent, { username }) {
      return users.find((user) => user.username === username);
    },
    todos(parent, args) {
      return getTodos();
    },
  },
  Mutation: {
    createTodo(parents, args) {
      return createTodo(args.id, args.title, args.checked);
    }
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: '/api/graphql',
});

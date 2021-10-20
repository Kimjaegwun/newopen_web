import { ApolloClient, InMemoryCache } from '@apollo/client';
import dotenv from 'dotenv';
import { getUserToken } from '../utils/utils';

dotenv.config();

const uri = 'http://172.30.1.46:5000/graphql';
// const uri = 'https://api.daadok.com:3000/graphql';

const auth = getUserToken() || '';

const client = new ApolloClient({ 
	uri,
	headers: { 'X-JWT': auth },
	cache: new InMemoryCache(),
});

export default client;


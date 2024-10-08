import { createClient } from 'next-sanity';
import { config } from './config';

// Standard client for fetching data
export const client = createClient(config);

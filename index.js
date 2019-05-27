import { Server } from './server';
import { config } from './config';

const { port } = config;

Server.listen(port, err => {
    if (err) return console.log(err);
    console.log(`Server is listening on port ${port}`);
});
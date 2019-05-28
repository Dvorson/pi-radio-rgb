const app = require('./server');
const { port } = require('./config');

app.listen(port, err => {
    if (err) return console.log(err);
    console.log(`Server is listening on port ${port}`);
});

import express from 'express';
import bodyParser from 'body-parser'
import http from 'http';
import socketIo from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static('visualiser/public'));

server.listen(8888);

//app.listen(8888, () => console.log('server listening at 8888!'));


export class VisualiserServer {
    constructor(NeuralNetwork) {
        io.on('connection', (socket) => {
            socket.on('askNetwork', (data) => {
                const answer = this.NeuralNetwork.ask(data);
                console.log(answer);
                socket.emit('response', JSON.stringify({
                    answerFormatted: this.responseFormatter(data, answer),
                    answer
                }));
            });
        });

        this.NeuralNetwork = NeuralNetwork;
        app.get('/getNetworkLayout', (req, res) => res.send(this.NeuralNetwork.exportNeuronsAsJson()));
        app.post('/askNetwork', this.askNetwork.bind(this));
    }

    askNetwork(req, res) {
        const question = req.body.question;
        const answer = this.NeuralNetwork.ask(question);
        res.send(JSON.stringify({ answerFormatted: this.responseFormatter(question, answer), answer }));

    }
}
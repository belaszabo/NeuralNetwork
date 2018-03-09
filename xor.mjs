import { NeuralNetwork } from "./NeuralNetwork";
import { VisualiserServer } from './visualiser/server';

import { Tanh, Sigmoid, Relu } from './Activators';
import readline from 'readline'

let Network = new NeuralNetwork(2, 10, 1, 0.3, Sigmoid);

let inputData = [[0, 0], [0, 1], [1, 0], [1, 1]];
let expectedOutput = [[0], [1], [1], [0]];

debugger;
Network.train(inputData, expectedOutput, 20000)
    .then(() => {
        const testers = inputData;
        testers.forEach((test) => {
            const answer = Network.ask(test);
            clearInterval(interval);
            console.log(`'${test.join(' xor ')}' possibly ${answer.answer}`);
        });
        askQuestion();
    });

function askQuestion() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('What do you want to know? ', (input) => {
        // TODO: Log the answer in a database
        const questionAsArray = input.split(',').map(parseFloat);
        const answer = Network.ask(questionAsArray);
        console.log(`'${questionAsArray.join(' , ')}' value is ${answer.answer}`);
        rl.close();
        askQuestion();
    });
}

const interval = setInterval(() => {
    const testers = inputData;
    testers.forEach((test) => {
        const answer = Network.ask(test);
        console.log(`'${test.join(' xor ')}' possibly ${answer.answer}`);
    });
}, 500);
const visualiserServer = new VisualiserServer(Network);
visualiserServer.responseFormatter = (question, answer) => {
    return `'${question.join(' xor ')}' possibly ${answer.answer}`;

};


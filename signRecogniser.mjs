import { NeuralNetwork } from "./NeuralNetwork";
import { VisualiserServer } from "./visualiser/server";
import { default as mnist } from 'mnist' ;

import { Sigmoid, Tanh, Relu } from './Activators';

const Network = new NeuralNetwork(768, 16, 10, 0.3, Sigmoid);



const inputData = [];
const expectedOutput = [];
var mnistData = mnist.set(8000, 1000);
debugger;
mnistData.training.forEach(training => {
    inputData.push(training.input);
    expectedOutput.push(training.output);
});

Network.train(inputData, expectedOutput, 10).then(() => {
console.log('done');

});
console.log('Testing with', mnistData.test.length,' number');

setInterval(() => {
    let errorCount = 0;
    mnistData.test.forEach((test, idx) => {
        const answer = Network.ask(test.input);
        //console.log(answer.answer, test.output);
        const isGoodAnswer = answer.answer.map(Math.round).every((element, index) => element == test.output[index]);
        if (!isGoodAnswer) {
            errorCount++;
        }
    });
    process.stdout.clearLine();
    process.stdout.cursorTo(10);
    process.stdout.write(`Total error: ${errorCount} from ${mnistData.test.length}. Error rate: ${errorCount / mnistData.test.length * 100}`);
},5000);




const visualiserServer = new VisualiserServer(Network);
visualiserServer.responseFormatter = (question, answer) => {
    return JSON.stringify(answer);
};
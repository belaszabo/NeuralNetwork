import { NeuralNetwork } from "./NeuralNetwork";
import { VisualiserServer } from "./visualiser/server";
import { Sigmoid } from './Activators';

import readline from 'readline'


const Network = new NeuralNetwork(7, 6, 3, 0.3, Sigmoid);

function characterToArrayOfBits(character) {
    const pad = '0000000';
    const binaryString = (character.charCodeAt(0)).toString(2);
    const paddedBinary = pad.substring(0, pad.length - binaryString.length) + binaryString;
    return [...paddedBinary].map(Number);
}

const vowels = ['a', 'e', 'i', 'u', 'o'];
const consonants = ['q', 'v', 'g', 'm'];
const numbers = [0, 5, 9].map(String);

const inputData = [];
const expectedOutput = [];

vowels.forEach((vowel) => {
    inputData.push(characterToArrayOfBits(vowel));
    expectedOutput.push([1, 0, 0]);
});
consonants.forEach((consonant) => {
    inputData.push(characterToArrayOfBits(consonant));
    expectedOutput.push([0, 1, 0]);
});
numbers.forEach((number) => {
    inputData.push(characterToArrayOfBits(String(number)));
    expectedOutput.push([0, 0, 1]);
});

Network.train(inputData, expectedOutput, 5000).then(() => {
    askQuestion();
});


function getPercent(number) {
    return Math.round(number * 100)
}

function askQuestion() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('What do you want to know? ', (input) => {
        // TODO: Log the answer in a database
        const answer = Network.ask(characterToArrayOfBits(input));
        answer.setFormatterFunction(getPercent);
        console.log(`Chance '${input}' being a vowel: ${answer.get(0)}%`);
        console.log(`Chance '${input}' being a consonant: ${answer.get(1)}%`);
        console.log(`Chance '${input}' being a number: ${answer.get(2)}%`);
        rl.close();
        askQuestion();
    });
}
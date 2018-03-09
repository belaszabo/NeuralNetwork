import { Neuron, InputNeuron, OutputNeuron } from "./Neuron";
import { NeuralLayer } from "./NeuralLayer";
import { Answer } from './Answer';
import { Sigmoid } from "./Activators";
import Promise from 'bluebird';

export class NeuralNetwork {

    constructor(inputCount, hiddenCount, outputCount, learningRate = 0.01, neuronActivator = Sigmoid) {
        this.inputLayer = new NeuralLayer(inputCount, InputNeuron, neuronActivator);
        this.hiddenLayer = new NeuralLayer(hiddenCount, Neuron, neuronActivator);

        this.outputLayer = new NeuralLayer(outputCount, OutputNeuron, neuronActivator);
        this.learningRate = learningRate;
        this.inputLayer.connectToAll(this.hiddenLayer);
        this.hiddenLayer.connectToAll(this.outputLayer);

    }

    pulse() {
        let feedforwardLayer = this.inputLayer.nextLayer;
        while (feedforwardLayer) {
            feedforwardLayer.pulse();
            feedforwardLayer = feedforwardLayer.nextLayer;
        }
    }

    backpropagation(desiredResults) {
        let backpropagatingLayer = this.outputLayer;

        while (backpropagatingLayer !== this.inputLayer) {
            backpropagatingLayer.backpropagate(desiredResults);
            backpropagatingLayer = backpropagatingLayer.prevLayer;
        }
    }

    async train(inputArray, expectedOutput, trainCount = 5000) {
        const allSteps = trainCount * inputArray.length;
        for (let trainStep = 0; trainStep < trainCount; trainStep++) {
            for (let inputIndex = 0; inputIndex < inputArray.length; inputIndex++) {
                await this.trainStep(inputArray[inputIndex], expectedOutput[inputIndex]);
                let currentStep = trainStep * inputArray.length + inputIndex;
                process.stdout.cursorTo(0);
                process.stdout.write(`${(Math.round(((currentStep) / allSteps) * 10000) / 100) }%`);
            }
        }
    }

    trainStep(input, desiredResults) {
        return new Promise((resolve) => {
            this.ask(input);
            this.backpropagation(desiredResults);

            let feedforwardLayer = this.inputLayer.nextLayer;
            while (feedforwardLayer) {
                feedforwardLayer.train(this.learningRate);
                feedforwardLayer = feedforwardLayer.nextLayer;
            }
            setImmediate(resolve);
        });
    }

    ask(input) {
        this.inputLayer.getNeurons().forEach((neuron, index) => neuron.output = input[index]);
        this.pulse();
        return new Answer([...this.outputLayer.neurons.map(neuron => neuron.output)]);
    }

    exportNeuronsAsJson() {
        const nodes = [];
        this.inputLayer.getNeurons().forEach((neuron, index) => nodes.push({
            label: `input${index}`,
            layer: 1,
            neuron
        }));
        this.hiddenLayer.getNeurons().forEach((neuron, index) => nodes.push({
            label: `hidden${index}`,
            layer: 2,
            neuron
        }));
        this.outputLayer.getNeurons().forEach((neuron, index) => nodes.push({
            label: `output${index}`,
            layer: 3,
            neuron
        }));
        return JSON.stringify({ nodes });
    }

}

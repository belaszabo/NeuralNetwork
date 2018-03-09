import { NeuralFactor } from './NeuralFactor';

export class Synapse {
    constructor(fromNeuron, toNeuron, factor) {
        this.fromNeuron = fromNeuron;
        this.toNeuron = toNeuron;
        this.factor = factor;
    }

    train(learningRate) {
        this.factor.weight = this.factor.delta * learningRate + this.factor.weight;
        this.factor.delta = 0;
    }

    updateDelta() {
        this.factor.delta += this.toNeuron.error * this.fromNeuron.output;
    }
}
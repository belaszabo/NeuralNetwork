import { Sigmoid } from "./Activators";

import { Synapse } from './Synapse';
import { NeuralFactor } from "./NeuralFactor";

export class Neuron {
    constructor(parentLayer = null, activator = Sigmoid) {
        this.bias = this.initBias();
        this.error = 0;
        this.synapses = new Map();
        this.output = 0;
        this.activator = activator;
        this.parentLayer = parentLayer;
    }

    initBias() {
        return new NeuralFactor();
    }

    findSynapse(neuron) {
        return this.synapses.get(neuron);
    }

    addSynapse(sourceNeuron) {
        const synapse = new Synapse(sourceNeuron, this, new NeuralFactor());
        this.synapses.set(sourceNeuron, synapse);
    }

    pulse() {
        let output = 0;
        this.synapses.forEach(synapse => {
            output += synapse.fromNeuron.output * synapse.factor.weight;
        });
        this.output = this.activator.calculate(output + this.bias.weight);
    };

    train(learningRate) {
        this.bias.weight += this.bias.delta * learningRate;
        this.bias.delta = 0;
        this.synapses.forEach(synapse => synapse.train(learningRate));
    }

    updateDelta() {
        this.bias.delta += this.error * this.bias.weight;
    }

    updateError() {
        let error = 0;
        this.parentLayer.nextLayer
            .getNeurons()
            .forEach((neuron) => {
                error += (neuron.error * neuron.findSynapse(this).factor.weight) * this.activator.derivate(this.output);
            });
        this.error = error;
    }

}

export class OutputNeuron extends Neuron {
    updateError(desiredResult) {
        this.error = (desiredResult - this.output) * this.activator.derivate(this.output);
    }
}

export class InputNeuron extends Neuron {
    initBias() {
        return new NeuralFactor(0);
    }
}
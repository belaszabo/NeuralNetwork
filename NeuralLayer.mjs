export class NeuralLayer {
    constructor(neuronCount, neuronClass, neuronOptions) {
        this.neurons = [];
        this.neuronClass = neuronClass;
        this.neuronOptions = neuronOptions;
        for (let i = 0; i < neuronCount; i++) {
            this.neurons.push(this.getNeuronInstance());
        }
    }

    getNeuronInstance() {
        return new this.neuronClass(this, this.neuronOptions);
    }

    connectFromAll(sourceNeuralLayer) {
        this.getNeurons().forEach(neuron => {
            sourceNeuralLayer.getNeurons().forEach(sourceNeuron => {
                neuron.addSynapse(sourceNeuron);
            })
        });
        this.prevLayer = sourceNeuralLayer;
        sourceNeuralLayer.nextLayer = this;
    }

    connectToAll(targetNeuralLayer) {
        targetNeuralLayer.getNeurons().forEach(targetNeuron => {
            this.getNeurons().forEach(neuron => {
                targetNeuron.addSynapse(neuron);
            })
        });
        this.nextLayer = targetNeuralLayer;
        targetNeuralLayer.prevLayer = this;
    }

    pulse() {
        this.neurons.forEach(neuron => neuron.pulse());
    };

    train(learningRate) {
        this.neurons.forEach(neuron => neuron.train(learningRate));
    }

    backpropagate(desiredResults) {
        this.neurons.forEach((neuron, index) => {
            neuron.updateError(desiredResults[index]);
        });
        this.neurons.forEach((neuron, index) => {
            this.prevLayer.backpropagateDelta(neuron);
            neuron.updateDelta();
        });
    }


    backpropagateDelta(fromNeuron) {
        this.neurons.forEach(neuron => fromNeuron.findSynapse(neuron).updateDelta(neuron));
    }


    getNeuron(index) {
        return this.neurons[index];
    }

    getNeurons() {
        return this.neurons;
    }

    getNeuronsCount() {
        return this.neurons.length;
    }
}
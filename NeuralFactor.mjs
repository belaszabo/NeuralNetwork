export class NeuralFactor {
    constructor(weight = (Math.random() * 0.2 - 0.1)) {
        this.weight = weight;
        this.delta = 0;
    }
}

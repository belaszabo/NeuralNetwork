export class Sigmoid {
    static calculate(value) {
        return 1 / (1 + Math.exp(-value));
    }

    static derivate(value) {
       // let v = Sigmoid.calculate(value);
        let v = value;
        return v * (1 - v);
    }

}

export class Tanh {
    static calculate(value) {
        return Math.tanh(value);
    }

    static derivate(value) {
        return 1 - (Math.tanh(value) ** 2);
    }
}

export class Relu {
    static calculate(value) {
        return value > 0 ? value : 0;
    }

    static derivate(value) {
        return value > 0 ? 1 : 0;
    }
}

export function Step(value, threshold = 20) {
    return value > threshold ? 1 : 0;
}

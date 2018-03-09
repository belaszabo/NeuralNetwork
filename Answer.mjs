export class Answer {
    constructor(answer) {
        this.answer = answer;
        this.formatterFunction = value => value;
    }

    setFormatterFunction(formatterFunction) {
        this.formatterFunction = formatterFunction;
    }

    get(index) {
        return this.formatterFunction(this.answer[index]);
    }
}
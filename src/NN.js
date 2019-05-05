import {Architect, Trainer} from 'synaptic';

export default class NN{
    
    constructor(network) {
        this.network = new Architect.Perceptron(3, 6, 1);
        this.trainingSet = [];
    }

    addInput(ballInfo){
        if(this.trainingSet.length > 0 && !this.trainingSet[this.trainingSet.length-1].output)
            this.trainingSet.pop();

        const input = [
            ballInfo.ballX,
            ballInfo.ballVelX*100/2+.5,
            Math.abs(ballInfo.ballVelY)*100
        ];
        this.trainingSet.push({input: input});
    }

    addOutput(ballPos){
        if(this.trainingSet.length === 0 || this.trainingSet[this.trainingSet.length-1].output)
            return;
        
        const ballWidth = window.innerHeight / window.innerWidth * 0.05;
        this.trainingSet[this.trainingSet.length-1].output = [ballPos.x+ballWidth/2];
        this.train();
    }

    activate(ballInfo){
        const input = [
            ballInfo.ballX,
            ballInfo.ballVelX*100/2+.5,
            Math.abs(ballInfo.ballVelY)*100
        ];
        return this.network.activate(input);
    }
    propagate(tl, output){
        this.network.propagate(tl, output);
    }

    train(){
        const trainingSet = this.trainingSet;
        let trainer = new Trainer(this.network);
        console.log(trainer.train(trainingSet));
        /*for(let i = 0; true; i++){
            if(Math.abs(this.network.activate(trainingSet[i%trainingSet.length].input) - trainingSet[i%trainingSet.length].output) < .09){
                console.log(this.network.activate(trainingSet[i%trainingSet.length].input), trainingSet[i%trainingSet.length].output, i);
                return;
            }
            this.network.propagate(0.01, trainingSet[i%trainingSet.length].output);
        }*/
    }
}
import React from 'react';
import ReactDOM from 'react-dom';
import NN from './NN.js';
import BallHandler from './BallHandler.js';
import './index.css';

function Paddle(props){
    let style = {
        marginLeft: props.position*100+"vw"
    }
    return (
        <div className="Paddle" style={style}>

        </div>);
}

function Pod(props){
    let style ={
        width: '100vw'
    }
    if(props.type === "up"){
        style.top = 0;
    }else
        style.bottom = 0;
    return (
        <div className="Pod" style={style}>
            <Paddle 
                position={props.position}/>
        </div>
    );
}

function Ball(props){
    let style = {
        marginLeft: props.position.x*100+'vw',
        marginTop: props.position.y*100+'vh'
    }
    return (
        <div className="Ball"
            style={style}>
        </div>
    )
}

class Game extends React.Component{
    constructor(props){//TODO make class to controls, to collisions etc. - PORZADEK
        super(props);
        this.state = {
            position1: .4,
            pos1Dir: 0,
            position2: .4,
            pos2Dir: 0,
            ballHandler: new BallHandler(),
            started: false,
            AI: new NN(),
            gameSpeed: 1
        }
        setInterval(()=>this.nextFrame(), 1);
    }

    handleKeyPress(event){
        console.log(event.keyCode);//38up 40down
        if(event.type === "keyup"){
            if(event.keyCode === 68 || event.keyCode === 65)
                this.setState({pos1Dir: 0});
            else if(event.keyCode === 39 || event.keyCode === 37)
                this.setState({pos2Dir: 0});
        }else if(event.type === "keydown"){
            if(event.keyCode === 68)
                this.setState({pos1Dir: 1});
            else if(event.keyCode === 65)
                this.setState({pos1Dir: -1});
            else if(event.keyCode === 39)
                this.setState({pos2Dir: 1});
            else if(event.keyCode === 37)
                this.setState({pos2Dir: -1});
            else if(event.keyCode === 32 && this.state.started === false){
                this.startGame();
            }


            else if(event.keyCode === 38)
                this.setState({gameSpeed: this.state.gameSpeed+1})
            else if(event.keyCode === 40)
                this.setState({gameSpeed: this.state.gameSpeed-1})
        }
    }
    componentDidMount() {
        window.addEventListener("keydown", (e)=>this.handleKeyPress(e));
        window.addEventListener("keyup", (e)=>this.handleKeyPress(e));
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", (e)=>this.handleKeyPress(e));
        window.addEventListener("keyup", (e)=>this.handleKeyPress(e));
    }

    startGame(){
        this.setState({started: true});
        this.state.ballHandler.start();
    }

    endGame(){
        this.state.AI.addOutput(this.state.ballHandler.ballPos);
        this.setState({started: false, position1: .4, position2: .4});
        this.state.ballHandler.restart();
        this.startGame();
    }

    AIMove1(){
        let pos = parseFloat(this.state.AI.activate(this.state.ballHandler.getAIInput()));
        pos -= .1;
        if(pos <= 0.01) pos = 0.01;
        if(pos > .8) pos = .8;
        this.setState({
            position1: pos
        });
    }

    AIMove2(){
        let pos = parseFloat(this.state.AI.activate(this.state.ballHandler.getAIInput()));
        pos -= .1;
        if(pos <= 0.01) pos = 0.01;
        if(pos > .8) pos = .8;
        this.setState({
            position2: pos
        });
    }

    nextFrame(){
        if(!this.state.started) return;

        this.state.ballHandler.ballMove({
            pod1Pos: this.state.position1,
            pod2Pos: this.state.position2,
            endGame: ()=>this.endGame(),
            pod1Hit: (ballPos) => {
                this.AIMove2();
                this.state.AI.addOutput(ballPos);
                this.state.AI.addInput(this.state.ballHandler.getAIInput());
            },
            pod2Hit: (ballPos) => {
                this.AIMove1();
                this.state.AI.addOutput(ballPos);
                this.state.AI.addInput(this.state.ballHandler.getAIInput());
            },
            gameSpeed: this.state.gameSpeed
        });

        let pos1Dir = this.state.pos1Dir;
        let pos2Dir = this.state.pos2Dir;
        let pos1 = this.state.position1;
        let pos2 = this.state.position2;

        if(pos1 <= 0.002*this.state.gameSpeed && pos1Dir === -1) pos1Dir = 0;
        if(pos2 <= 0.002*this.state.gameSpeed && pos2Dir === -1) pos2Dir = 0;
        if(pos1 >= .8 && pos1Dir === 1) pos1Dir = 0;
        if(pos2 >= .8 && pos2Dir === 1) pos2Dir = 0;

        pos1 += pos1Dir*0.001*this.state.gameSpeed;
        pos2 += pos2Dir*0.001*this.state.gameSpeed;

        this.setState({position1: pos1, position2: pos2});
    }

    render(){
        return (
            <div className="Game">
                <Pod type="up" position={this.state.position1}/>
                <Pod type="down" position={this.state.position2}/>
                <Ball position={this.state.ballHandler.ballPos}/>
                <p className="Speed">Speed: {this.state.gameSpeed}</p>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );



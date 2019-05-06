import React from 'react';
import ReactDOM from 'react-dom';
import NN from './NN.js';
import BallController from './BallController.js';
import './index.css';
import PoddleController from './PoddleController.js';

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
            pod1Controller: new PoddleController({network: new NN()}),
            pod2Controller: new PoddleController({network: new NN()}),//{type: PoddleController.types.PLAYER}),
            ballController: new BallController(),
            started: false,
            AI: new NN(),
            gameSpeed: 1
        }
        setInterval(()=>this.nextFrame(), 1);
    }

    handleKeyPress(event){
        if(event.type === "keydown")
            if(event.keyCode === 32 && this.state.started === false)
                this.startGame();
            else if(event.keyCode === 38)
                this.setState({gameSpeed: this.state.gameSpeed+1});
            else if(event.keyCode === 40)
                this.setState({gameSpeed: this.state.gameSpeed-1});

    }
    componentDidMount() {
        window.addEventListener("keydown", (e)=>this.handleKeyPress(e));
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", (e)=>this.handleKeyPress(e));
    }

    startGame(){
        this.setState({started: true});
        this.state.ballController.start();
    }

    endGame(){
        this.setState({started: false});
        
        this.state.pod1Controller.shoot({ballPos: this.state.ballController.ballPos});
        this.state.pod2Controller.shoot({ballPos: this.state.ballController.ballPos});
        this.state.pod1Controller.restart();
        this.state.pod2Controller.restart();
        this.state.ballController.restart();

        this.startGame();
    }

    nextFrame(){
        if(!this.state.started) return;

        this.state.ballController.ballMove({
            pod1Pos: this.state.pod1Controller.position,
            pod2Pos: this.state.pod2Controller.position,
            endGame: ()=>this.endGame(),
            pod1Hit: (ballPos) => {
                let props = {ballPos: ballPos, AIInput: this.state.ballController.AIInput}
                this.state.pod1Controller.shoot(props);
                this.state.pod2Controller.opponentShoot(props);
            },
            pod2Hit: (ballPos) => {
                let props = {ballPos: ballPos, AIInput: this.state.ballController.AIInput}
                this.state.pod2Controller.shoot(props);
                this.state.pod1Controller.opponentShoot(props);
            },
            gameSpeed: this.state.gameSpeed
        });

        this.state.pod1Controller.handleFrame({gameSpeed: this.state.gameSpeed});
        this.state.pod2Controller.handleFrame({gameSpeed: this.state.gameSpeed});

        this.setState({});
    }

    render(){
        return (
            <div className="Game">
                <Pod type="up" position={this.state.pod1Controller.position}/>
                <Pod type="down" position={this.state.pod2Controller.position}/>
                <Ball position={this.state.ballController.ballPos}/>
                <p className="Speed">Speed: {this.state.gameSpeed}</p>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );



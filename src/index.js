import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './Menu.js'
import NN from './NN.js';
import BallController from './BallController.js';
import PoddleController from './PoddleController.js';
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
            pod1Controller: new PoddleController({network: new NN()}),
            pod2Controller: new PoddleController({network: new NN()}),//{type: PoddleController.types.PLAYER}),
            ballController: new BallController(),
            started: false,
            pause: false,
            autostart: true,
            AI: new NN(),
            gameSpeed: 1, 
            rounds: 0,
            hits: 0,
            pod1Wins: 0,
            pod2Wins: 0
        }
        setInterval(()=>this.nextFrame(), 1);
    }

    handleKeyPress(event){
        if(event.type === "keydown")
            if(event.keyCode === 32 && this.state.started === false)
                this.startGame();
            if(event.keyCode === 80)
                this.setState({paused: !this.state.paused});
            else if(event.keyCode === 38)
                this.changeGameSpeed(this.state.gameSpeed+1);
            else if(event.keyCode === 40)
                this.changeGameSpeed(this.state.gameSpeed-1);

    }
    componentDidMount() {
        window.addEventListener("keydown", (e)=>this.handleKeyPress(e));
        window.addEventListener("touchstart", (e)=>this.startGame());
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", (e)=>this.handleKeyPress(e));
        window.addEventListener("touchstart", (e)=>this.startGame());
    }

    startGame(){
        if(this.state.started) return;
        this.setState({started: true});
        this.state.ballController.start();
        this.setState({rounds: this.state.rounds+1});
    }

    endGame(winner){
        this.setState({started: false});
        if(winner === 1) this.setState({pod1Wins: this.state.pod1Wins+1});
        if(winner === 2) this.setState({pod2Wins: this.state.pod2Wins+1});
        
        this.state.pod1Controller.shoot({ballPos: this.state.ballController.ballPos});
        this.state.pod2Controller.shoot({ballPos: this.state.ballController.ballPos});
        this.state.pod1Controller.restart();
        this.state.pod2Controller.restart();
        this.state.ballController.restart();

        if(this.state.autostart) this.startGame();
    }

    nextFrame(){
        if(!this.state.started || this.state.paused) return;

        this.state.ballController.ballMove({
            pod1Pos: this.state.pod1Controller.position,
            pod2Pos: this.state.pod2Controller.position,
            endGame: (winner)=>this.endGame(winner),
            pod1Hit: (ballPos) => {
                let props = {ballPos: ballPos, AIInput: this.state.ballController.AIInput}
                this.state.pod1Controller.shoot(props);
                this.state.pod2Controller.opponentShoot(props);
                this.setState({hits: this.state.hits+1});
            },
            pod2Hit: (ballPos) => {
                let props = {ballPos: ballPos, AIInput: this.state.ballController.AIInput}
                this.state.pod2Controller.shoot(props);
                this.state.pod1Controller.opponentShoot(props);
                this.setState({hits: this.state.hits+1});
            },
            gameSpeed: this.state.gameSpeed
        });

        this.state.pod1Controller.handleFrame({gameSpeed: this.state.gameSpeed});
        this.state.pod2Controller.handleFrame({gameSpeed: this.state.gameSpeed});

        this.setState({});
    }

    changeGameSpeed(speed){
        if(speed < 1) speed = 1;
        if(speed > 1000) speed = 1000; 
        this.setState({gameSpeed: speed});
    }

    render(){
        const menuData = {
            gameSpeed: this.state.gameSpeed,
            pod1: this.state.pod1Controller.type,
            pod2: this.state.pod2Controller.type,
            rounds: this.state.rounds,
            hits: this.state.hits,
            pod1Wins: this.state.pod1Wins,
            pod2Wins: this.state.pod2Wins
        };
        return (
            <div className="Game">
                <Pod type="up" position={this.state.pod1Controller.position}/>
                <Pod type="down" position={this.state.pod2Controller.position}/>
                <Ball position={this.state.ballController.ballPos}/>
                <div class="starttext">{!this.state.started ? "Press SPACE or touch your screen to start game!" : ""}</div>
                <Menu data={menuData} 
                    changeSpeed={(speed)=>this.changeGameSpeed(speed)}
                    changePod1={(props)=>this.state.pod1Controller.changeController(props)}
                    changePod2={(props)=>this.state.pod2Controller.changeController(props)}/>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );



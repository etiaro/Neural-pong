import React from 'react';
import { HamburgerStand } from 'react-animated-burgers'
import PoddleController from './PoddleController';
import NN from './NN';

export default class Menu extends React.Component{
    constructor(){
        super();
        this.state = {
            isActive: false,
            width: 0
        };
    }
    toggleButton(){
        if(!this.state.isActive)
            document.getElementById("MenuBody").style.right = 0;
        else
            document.getElementById("MenuBody").style.right = "-250px";

        this.setState({
            isActive: !this.state.isActive
        });
    }
    render(){
        return(
            <div className="Menu">
                <div id="MenuBody" className="MenuBody">
                    <p>Speed</p>
                        <input type="range" className="slider" name="speed" min="1" max="1000" value={this.props.data.gameSpeed}
                        onInput={(e)=>this.props.changeSpeed(e.target.value)} onChange={(e)=>this.props.changeSpeed(e.target.value)}/>
                    <p>Up Poddle</p>
                        <button onClick={()=>this.props.changePod1({type: PoddleController.types.PLAYER})}>Player</button>
                        <button onClick={()=>this.props.changePod1({type: PoddleController.types.NEURAL})}>Neural</button>
                        <br/>
                        <button onClick={()=>this.props.changePod1({type: PoddleController.types.TRAINED, network: NN.level.EASY})}>Easy</button>
                        <button onClick={()=>this.props.changePod1({type: PoddleController.types.TRAINED, network: NN.level.MEDIUM})}>Medium</button>
                        <button onClick={()=>this.props.changePod1({type: PoddleController.types.TRAINED, network: NN.level.HARD})}>Hard</button>
                    <p>Down Poddle</p>
                        <button onClick={()=>this.props.changePod2({type: PoddleController.types.PLAYER})}>Player</button>
                        <button onClick={()=>this.props.changePod2({type: PoddleController.types.NEURAL})}>Neural</button>
                        <br/>
                        <button onClick={()=>this.props.changePod2({type: PoddleController.types.TRAINED, network: NN.level.EASY})}>Easy</button>
                        <button onClick={()=>this.props.changePod2({type: PoddleController.types.TRAINED, network: NN.level.MEDIUM})}>Medium</button>
                        <button onClick={()=>this.props.changePod2({type: PoddleController.types.TRAINED, network: NN.level.HARD})}>Hard</button>
                    <p className="stats">rounds: {this.props.data.rounds}</p>
                    <p className="stats">hits: {this.props.data.hits}</p>
                    <p className="stats">UpPodWins: {this.props.data.pod1Wins}</p>
                    <p className="stats">DownPodWins: {this.props.data.pod2Wins}</p>
                </div>
                
                <div className="MenuIcon">
                    <HamburgerStand 
                        isActive={this.state.isActive} 
                        toggleButton={()=>this.toggleButton()} 
                        buttonColor="rgba(0,0,0,0)" barColor="white" />
                </div>
            </div>
        );
    }
}
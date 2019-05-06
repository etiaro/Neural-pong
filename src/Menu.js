import React from 'react';
import { HamburgerStand } from 'react-animated-burgers'
import PoddleController from './PoddleController';

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

    changePod1(choose){
        this.props.changePod1({type: choose});
        if(choose === PoddleController.types.PLAYER){
            document.getElementById("pod1plbtn").className = "btnChosen";
            document.getElementById("pod1nnbtn").className = "";
        }else {
            document.getElementById("pod1plbtn").className = "";
            document.getElementById("pod1nnbtn").className = "btnChosen";
        }
    }
    changePod2(choose){
        this.props.changePod2({type: choose});
        if(choose === PoddleController.types.PLAYER){
            document.getElementById("pod2plbtn").className = "btnChosen";
            document.getElementById("pod2nnbtn").className = "";
        }else {
            document.getElementById("pod2plbtn").className = "";
            document.getElementById("pod2nnbtn").className = "btnChosen";
        }
    }

    render(){
        return(
            <div className="Menu">
                <div id="MenuBody" className="MenuBody">
                    <p><a href="#" className="arrowbtn" onClick={()=>this.props.changeSpeed(this.props.data.gameSpeed-1)}>&larr;</a>
                    Speed
                    <a href="#" className="arrowbtn" onClick={()=>this.props.changeSpeed(this.props.data.gameSpeed+1)}>&rarr;</a></p>
                        <input type="range" className="slider" name="speed" min="1" max="1000" value={this.props.data.gameSpeed}
                        onInput={(e)=>this.props.changeSpeed(e.target.value)} onChange={(e)=>this.props.changeSpeed(e.target.value)}/>
                    <p><input type="checkbox" name="autostart" onClick={()=>this.props.toggleAutostart()}/> Autostart </p>
                    <p>Up Poddle</p>
                    <div className="podChoose">
                        <button id="pod1plbtn" onClick={()=>this.changePod1(PoddleController.types.PLAYER)} 
                                className={this.props.data.pod1 === PoddleController.types.PLAYER ? "btnChosen" : ""}>Player</button>
                        <button id="pod1nnbtn" onClick={()=>this.changePod1(PoddleController.types.NEURAL)}
                                className={this.props.data.pod1 === PoddleController.types.NEURAL ? "btnChosen" : ""}>Neural</button>
                    </div>
                    <p>Down Poddle</p>
                    <div className="podChoose">
                        <button id="pod2plbtn" onClick={()=>this.changePod2(PoddleController.types.PLAYER)} 
                                className={this.props.data.pod2 === PoddleController.types.PLAYER ? "btnChosen" : ""}>Player</button>
                        <button id="pod2nnbtn" onClick={()=>this.changePod2(PoddleController.types.NEURAL)}
                                className={this.props.data.pod2 === PoddleController.types.NEURAL ? "btnChosen" : ""}>Neural</button>
                    </div>
                    <p className="stats">rounds: {this.props.data.rounds}</p>
                    <p className="stats">hits: {this.props.data.hits}</p>
                    <p className="stats">Up Poddle Wins: {this.props.data.pod1Wins}</p>
                    <p className="stats">Down Poddle Wins: {this.props.data.pod2Wins}</p>
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
import NN from "./NN";


export default class PoddleController{
    static types = {
        PLAYER: 'Player',
        NEURAL: 'Neural',
        TRAINED: 'Trained'
    }

    constructor(props){
        this.position = .4;
        this.direction = 0;
        this.target = .4;
        if(!props) props = {};

        if(props.type)
            this.type = props.type;
        else
            this.type = PoddleController.types.NEURAL;

        this.changeController(props);

        window.addEventListener("keydown", (e)=>this.handleKeyPress(e));
        window.addEventListener("keyup", (e)=>this.handleKeyPress(e));
        window.addEventListener("touchmove", (e)=>this.handleTouch(e));
        window.addEventListener("touchstart", (e)=>this.handleTouch(e));
        window.addEventListener("touchend", (e)=>this.handleTouch(e));
        window.addEventListener("touchcancel", (e)=>this.handleTouch(e));
    }

    handleKeyPress(event){
        if(event.type === "keyup"){
            if(event.keyCode === this.keyLeft && this.direction === -1) this.direction = 0;
            if(event.keyCode === this.keyRight && this.direction === 1) this.direction = 0;
        }else if(event.type === "keydown"){
            if(event.keyCode === this.keyLeft)
                this.direction = -1;
            else if(event.keyCode === this.keyRight)
                this.direction = 1;
        }
    }
    handleTouch(event){
        if(this.type === PoddleController.types.PLAYER){
            this.position = event.changedTouches[0].pageX / document.documentElement.clientWidth - .1;
            if(this.position <= 0.01) this.position = 0.01;
            if(this.position > .8) this.position = .8;
        }
    }

    

    restart(){
        this.position = .4;
        this.direction = 0;
        this.target = .4;
    }

    handleFrame(props){
        if(this.position <= 0.001*props.gameSpeed && this.direction === -1) this.direction = 0;
        if(this.position >= .8 && this.direction === 1) this.direction = 0;
        this.position += this.direction*0.001*props.gameSpeed;

        if(this.type === PoddleController.types.NEURAL || this.type === PoddleController.types.TRAINED){
            if(Math.abs(this.target - this.position) <= 0.001*props.gameSpeed)
                this.position = this.target;
            else{
                if(this.target > this.position)
                    this.position += 0.001*props.gameSpeed;
                else
                    this.position -= 0.001*props.gameSpeed;
            }
        }
    }
    changeController(props){
        if(!props){
            throw new Error("GIVE PROPS!");
        } 
        if(props.type)
            this.type = props.type;

        switch(this.type){
            case PoddleController.types.PLAYER:
                if(props.keyLeft)   this.keyLeft = props.keyLeft;
                else                this.keyLeft = 37;
                if(props.keyRight)  this.keyRight = props.keyRight;
                else                this.keyRight = 39;
            break;
            default:
            case PoddleController.types.NEURAL:
                if(props.network)   this.network = props.network;
                else                this.network = new NN();
            break;
            case PoddleController.types.TRAINED:
                if(props.network)   this.network = props.network;
                else                this.network = NN.level.MEDIUM;
        }
    }
    shoot(props){
        if(this.type !== PoddleController.types.NEURAL)
            return;

        this.network.addOutput(props.ballPos);
        if(props.AIInput)
            this.network.addInput(props.AIInput);
    }
    opponentShoot(props){
        if(this.type === PoddleController.types.PLAYER)
            return;

        this.target = parseFloat(this.network.activate(props.AIInput));
        this.target -= .1;
        if(this.target <= 0.01) this.target = 0.01;
        if(this.target > .8) this.target = .8;

        this.shoot(props);
    }
}
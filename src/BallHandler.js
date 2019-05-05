export default class BallHandler {
    constructor(){
        this.restart();
    }

    restart(){
        const ballWidth = window.innerHeight / window.innerWidth * 0.05;
        this.ballPos = {x: .5-ballWidth/2, y: .475};
        this.ballVel = {x: 0, y: 0};
        this.ballSpeed = 0.1;
    }

    start(){
        this.ballVel = {x: 0, y: 0.01};
    }

    speedUpBall(){
    }

    handleCollision(poddlePos, poddleHit){
        const ballWidth = window.innerHeight / window.innerWidth * 0.05;
        const poddleWidth = 0.2;
        if(poddlePos && this.ballPos.x + ballWidth > poddlePos && this.ballPos.x < poddlePos+poddleWidth){
            this.ballVel.x = ((poddlePos+poddleWidth/2) - (this.ballPos.x+ballWidth/2))*-0.05;
            this.ballVel.y = -Math.sign(this.ballVel.y)*(0.01-Math.abs(this.ballVel.x));
            this.ballPos.y = this.ballPos.y < .05 ? .05 : .9;
            poddleHit(this.ballPos);
        }
    }

    getAIInput(){
        return {ballX: this.ballPos.x, ballVelX: this.ballVel.x, ballVelY: this.ballVel.y};
    }

    ballMove(props){
        const ballWidth = window.innerHeight / window.innerWidth * 0.05;

        //handle End-game
        if(this.ballPos.y < 0 || this.ballPos.y > .95){
            props.endGame();
        }
        
        this.ballPos.x += this.ballVel.x*this.ballSpeed*props.gameSpeed;
        this.ballPos.y += this.ballVel.y*this.ballSpeed*props.gameSpeed;

        //handle wall drop
        if(this.ballPos.x < 0){
            this.ballVel.x *= -1;
            this.ballPos.x = 0;
        } else if(this.ballPos.x > 1 - ballWidth){
            this.ballVel.x *= -1;
            this.ballPos.x = 1-ballWidth;
        }

        //handle poddles drop
        if(this.ballPos.y < .05){
            this.handleCollision(props.pod1Pos, props.pod1Hit);
        }else if(this.ballPos.y > .9){
            this.handleCollision(props.pod2Pos, props.pod2Hit);
        }
    }
}
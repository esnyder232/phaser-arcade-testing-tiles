import GlobalFuncs from "../global-funcs.js"
import PlayerGroundIdleState from "./player-ground-idle-state.js";

//the player class
export default class Player {
	constructor(scene) {
		this.scene = scene;
		this.globalfuncs = new GlobalFuncs();

		//mapping of actions to keyboard key codes. Export this to external file and load in on game startup.
		this.playerInputKeyboardMap = {
			left: 37,
			right: 39,
			up: 38,
			down: 40,
			jump: 90,
			attackWeak: 88,
			attackStrong: 67,
			start: 13,
			select: 32
		};

		//mapping of actions to gamepad buttons. Export this to external file and load in on game startup.
		this.playerInputGamepadMap = {
			jump: 'a',
			attackWeak: 'x',
			attackStrong: 'y',
			start: 'start',
			select: 'select'
		};

		//The actual controller used to control the player.
		this.playerController = {};

		//other variables
		this.debugCounter = 0;
		this.walkSpeed = 64;
		this.state = null; 
		this.nextState = null;
	
	}

	create() {
		//create animations
		this.globalfuncs.createSceneAnimsFromAseprite(this.scene, "slime", "slime-json");

		//create sprite
		var xPos = 180;
		var yPos = 40;

		this.sprite = this.scene.physics.add.sprite(xPos, yPos, "slime", 0);
		this.sprite.label = "player";
		this.sprite.setScale(2, 2);
		
		//controls
		//create a virtual button for the playerController
		for(var key in this.playerInputKeyboardMap)
		{
			var virtualButton = {
					keyCode: 0,
					phaserKeyCode: "",
					state: false,
					prevState: false,
					phaserKeyObj: {}
			};

			//find the phaserKeyCode (its innefficent I know. I don't care)
			for(var phaserKeyCode in Phaser.Input.Keyboard.KeyCodes)
			{
				if(Phaser.Input.Keyboard.KeyCodes[phaserKeyCode] == this.playerInputKeyboardMap[key])
				{
					virtualButton.phaserKeyCode = phaserKeyCode;
					break;
				}
			}

			virtualButton.keyCode = this.playerInputKeyboardMap[key];
			virtualButton.phaserKeyObj = this.scene.input.keyboard.addKey(this.playerInputKeyboardMap[key]);

			this.playerController[key] = virtualButton;
		}

		//for each virtual button, create a listener to change the virutal button's state
		for(var key in this.playerController)
		{
			this.scene.input.keyboard.on("keydown-"+this.playerController[key].phaserKeyCode, this.tempDown, this.playerController[key]);
			this.scene.input.keyboard.on("keyup-"+this.playerController[key].phaserKeyCode, this.tempUp, this.playerController[key]);
		}

		//initial state
		this.state = new PlayerGroundIdleState(this.scene, this);
		this.state.enter();

		//main body collision
		this.sprite.body.setSize(12, 12)
		this.sprite.body.setOffset(26, 28);
		this.scene.physics.add.collider(this.sprite, this.scene.layer1);

		//other physics stuff
		this.sprite.setDrag(0, 0);
		this.frameNum = 0;
		
		console.log(this);
	}

	myEnable() {
		console.log('myEnable called');
		this.hitbox.setActive(true);
		this.hitbox.enable = true;
		this.hitbox.setVisible(true);
		this.hitbox.body.setEnable(true);
		this.hitbox.body.debugShowBody = true;
	}

	myDisable() {
		console.log(this);
		console.log('myDisable called');
		this.hitbox.setActive(false);
		this.hitbox.enable = false;
		this.hitbox.setVisible(false);
		this.hitbox.body.setEnable(false);
		this.hitbox.body.debugShowBody = false;
	}

	onCollideBotSensorStart(e) {
		this.botSensor.arrBodiesColliding.push(e.bodyB);
		this.botSensor.isColliding = true;
	}

	
	onCollideBotSensorEnd(e) {
		var objIndex = this.botSensor.arrBodiesColliding.findIndex((x) => {return x === e.bodyB;});
		if(objIndex >= 0)
		{
			this.botSensor.arrBodiesColliding.splice(objIndex, 1);
		}

		if(this.botSensor.arrBodiesColliding.length > 0)
		{
			this.botSensor.isColliding = true;
		}
		else
		{
			this.botSensor.isColliding = false;
		}
	}


	
	onCollideMainBodyStart(e) {
		// console.log('main body collide');
		// console.log(e);
		this.mainBody.arrBodiesColliding.push(e.bodyB);
		this.mainBody.isColliding = true;
		this.mainBody.arrPairs.push(e.pair);
	}

	
	onCollideMainBodyEnd(e) {
		var objIndex = this.mainBody.arrBodiesColliding.findIndex((x) => {return x === e.bodyB;});
		if(objIndex >= 0)
		{
			this.mainBody.arrBodiesColliding.splice(objIndex, 1);
		}

		if(this.mainBody.arrBodiesColliding.length > 0)
		{
			this.mainBody.isColliding = true;
		}
		else
		{
			this.mainBody.isColliding = false;
		}
		
	}

	
	tempDown(e) {
		this.state = true;
	}

	tempUp(e) {
		this.state = false;
	}
	

	update(timeElapsed, dt) {
		this.frameNum++;
		this.state.update(timeElapsed, dt);
		
		//update the prevState on the virtual controller for the player
		for(var key in this.playerController)
		{
			this.playerController[key].prevState = this.playerController[key].state;
		}

		//change states if needed
		if(this.nextState)
		{
			this.state.exit();
			this.nextState.enter();

			this.state = this.nextState;
			this.nextState = null;
		}

		
		// if(this.mainBody.isColliding || this.frameNum >= 35)
		// {
		// 	console.log(this.frameNum + ", " + this.mainBody.isColliding + ", " + this.mainBody.body.position.x + ", " + this.mainBody.arrBodiesColliding.length);
		// 	for(var i = 0; i < this.mainBody.arrBodiesColliding.length; i++)
		// 	{
		// 		console.log(this.mainBody.arrBodiesColliding[i]);
		// 		console.log(this.mainBody.arrPairs[i]);
		// 	}
	}

	postUpdate(timeElapsed, dt) {
		console.log('player post update');
	}
}


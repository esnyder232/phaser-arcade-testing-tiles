import Phaser from 'phaser';
import GameManagerScene from './scenes/game-manager-scene.js'
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin"

export default class App {
	constructor() {
		this.game = {};
		this.config = {};

		this.config = {
			type: Phaser.AUTO,
			backgroundColor: '#333333',
			width: 256,
			height:256,
			parent: 'game-div',
			pixelArt: true,
			physics: {
				default: 'matter',				
				matter: {
					debug: true,
					gravity: {
						y: 1
					}
				}
			},
			plugins: {
				scene: [
					{
						plugin: PhaserMatterCollisionPlugin,
						key: "matterCollision",
						mapping: "matterCollision"
					}
				]
			},
			scale: {
				zoom:3
			}
		}

		this.game = new Phaser.Game(this.config);
		this.game.scene.add('game-manager-scene', GameManagerScene, true);
	}	
}

//feels like a hacky way to start...oh well. Its simple atleast.
var app = new App();


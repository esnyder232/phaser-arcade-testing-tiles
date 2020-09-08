var tempGlobalMessages = [];

export default class GlobalFuncs {
	constructor() {
		this.tempGlobalMessages = tempGlobalMessages;
	}

	
	//Helper function to register events to emitters in phaser.
	//scene - the scene
	//eventMapping - array of mappings for events
	// Each mapping needs the following format:
	// eventMapping = [
	// {
	//	 	target: this.load,
	//	 	event: 'progress',
	//	 	delegate: this.loadProgress
	// },
	// {}...
	// ]
	// 		target - the event emitter in phaser
	//		event - the name of the event
	//		delegate - the delegate to call

	registerEvents(scene, eventMapping) {
		for(var i = 0; i < eventMapping.length; i++)
		{
			eventMapping[i].target.on(eventMapping[i].event, eventMapping[i].delegate)
		}
	}

	//Helper function to unregister events from emitters in phaser. This is the opposite of GlobalFuncs.registerEvents().
	//This is to be called in the "shutdown" event.
	unregisterEvents(scene, eventMapping) {
		for(var i = 0; i < eventMapping.length; i++)
		{
			eventMapping[i].target.off(eventMapping[i].event, eventMapping[i].delegate)
		}
	}

	createSceneAnimsFromAseprite(scene, asepriteSpritesheetKey, asepriteJsonKey) {
		//find the aseprite json file to parse from
		var json = scene.cache.json.get(asepriteJsonKey);
		var anims = scene.anims;

		//parse through the frameTags for the animations and create an animation for each one
		for(var i = 0; i < json.meta.frameTags.length; i++)
		{


			var f = json.meta.frameTags[i];
			var key = asepriteSpritesheetKey + "-" + f.name;
			var frames = anims.generateFrameNumbers(asepriteSpritesheetKey, {start: f.from, end: f.to});
			var animObject = {
				key: key,
				frames: frames,
				frameRate: 24,
				repeat: -1
			}

			//console.log(animObject);
			anims.create(animObject);
		}
	}
}
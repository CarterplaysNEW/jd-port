public var elevator:FlxSprite;
public var door:FlxSprite;
public var songArrowL:FlxSprite;
public var songArrowR:FlxSprite;
public var enterSongButton:FlxSprite;
public var monitor:FlxSprite;
public var songName:FlxText;
public var overlay:FlxSprite;
public var bar:FlxSprite;
public var ssong:FlxText;
public var cButton:FlxSprite;

public function elevator(?cam:FlxCamera) {
    cam ??= FlxG.camera;
    cam.zoom = 1.6;
    
	elevator = new FlxSprite().loadGraphic(Paths.image('menu/rolbox/song/elevator'));
	elevator.screenCenter();

    door = new FlxSprite();
    door.frames = Paths.getFrames('menu/rolbox/song/doors');
	door.animation.addByPrefix('open', 'dooranim', 24, false);
	door.animation.addByPrefix('opened', 'open', 24, false);
	door.animation.addByIndices('close', 'dooranim', [15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0], "", 24, false);
	door.animation.addByPrefix('closed', 'closed', 24, false);
	door.setPosition(elevator.x + 347,elevator.y + 146);
    
    songArrowL = new FlxSprite(elevator.x + 615, elevator.y + 250);
    songArrowL.frames = Paths.getFrames('menu/rolbox/song/diffbutton');
	songArrowL.animation.addByPrefix('i','bidle');
	songArrowL.animation.addByPrefix('s','bpress');
	songArrowL.animation.play('i');
	songArrowL.flipY = true;

	songArrowR = new FlxSprite(elevator.x + 615, elevator.y + 220);
    songArrowR.frames = Paths.getFrames('menu/rolbox/song/diffbutton');
	songArrowR.animation.addByPrefix('i','bidle');
	songArrowR.animation.addByPrefix('s','bpress');
	songArrowR.animation.play('i');

	enterSongButton = new FlxSprite(elevator.x + 280, elevator.y + 220);
    enterSongButton.frames = Paths.getFrames('menu/rolbox/song/play');
	enterSongButton.animation.addByPrefix('i','pidle');
	enterSongButton.animation.addByPrefix('s','ppress');
	enterSongButton.animation.play('i');

	monitor = new FlxSprite();
    monitor.frames = Paths.getFrames('menu/rolbox/song/tv');
    monitor.animation.addByPrefix('static','static',24,false);
	monitor.animation.addByPrefix('staticlooped','static',24);
    monitor.animation.addByPrefix('tv','tv',24,false);
    monitor.animation.play("static");
    monitor.animation.finishCallback = (s:String)->{if (s == 'static') {monitor.animation.play('tv');}}
	monitor.scale.set(0.95, 0.95);
	monitor.x = elevator.x + 150 * elevator.scale.x;
	monitor.y = elevator.y;

	songName = new FlxText(0,0,0,'',20);
	songName.font = Paths.font('ARIAL.TTF');
	if (elevatorRetro == null) elevatorRetro = FlxG.random.int(1,2);
	songName.size = Std.int(songName.size/elevatorRetro);
	songName.scale.set(elevatorRetro, elevatorRetro);
    songName.updateHitbox();
	songName.text = "boi";
	songName.fieldWidth = FlxG.width;
	songName.alignment = "center";
	songName.y = elevator.y + 112;
    
    bar = new FlxSprite().makeGraphic(1300, 141, FlxColor.BLACK);
    bar.screenCenter();
    bar.setGraphicSize(400);
	bar.y = 105;
	bar.alpha = 0.6;

    ssong = new FlxText(0,0,0,'now playing:',14);
	ssong.font = Paths.font('ARIAL.TTF');
	ssong.color = FlxColor.LIME;
	centerOnSprite(ssong, bar);
	ssong.y += -13;

    cButton = new FlxSprite();
    cButton.frames = Paths.getFrames('menu/rolbox/song/copyrightbutton');
    cButton.animation.addByPrefix('copyright','c',24,false);
    cButton.animation.addByPrefix('nocopyright','nc',24,false);
    cButton.animation.play(FlxG.save.data.copyrightWorld ? 'copyright' : 'nocopyright');
    cButton.offset.x = FlxG.save.data.copyrightWorld ? 0 : 2.5;
    centerOnSprite(cButton, bar);
    cButton.scale.set(0.75, 0.75);
    cButton.x += 170;

    overlay = new FlxSprite().loadGraphic(Paths.image('menu/rolbox/song/grad'));
    overlay.screenCenter();

    for (thing in [elevator, door, songArrowL, songArrowR, enterSongButton, monitor, songName, bar, ssong, cButton, overlay]) {
        thing.camera = cam;
        add(thing);
    }
}
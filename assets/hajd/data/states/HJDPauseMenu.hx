// my new pause menus recreation
import funkin.options.OptionsMenu;
import funkin.options.TreeMenu;
import funkin.editors.charter.Charter;
import funkin.savedata.FunkinSave;
import funkin.backend.MusicBeatState;

var options = ['resume','restart','setting','leave'];
var sus = 0;

function create(e) {
	e.cancel();

	camPause = new FlxCamera();
	camPause.bgColor = 0;
	camPause.zoom = 1.1;
	FlxG.cameras.add(camPause, false);
	camera = camPause;

	black = new FlxSprite().makeGraphic(1, 1, FlxColor.BLACK);
	black.scale.set(FlxG.width, FlxG.height);
	black.origin.set();
	black.alpha = 0;
	add(black);
	FlxTween.tween(black, {alpha: 0.5}, 0.1);

	pauseTs = new FlxSprite();
	pauseTs.frames = Paths.getFrames("menu/rolbox/pause/im_pausing");
	for (i=>o in options) {
		pauseTs.animation.addByPrefix(i, o);
	}
	pauseTs.animation.play('0');
	pauseTs.screenCenter(FlxAxes.X);
	pauseTs.y = -pauseTs.height;
	FlxTween.tween(pauseTs, {y: (FlxG.height-pauseTs.height)/2}, 0.1);
	add(pauseTs);

	scroll = FlxG.sound.load(Paths.sound("menu/scroll"));

	credits = new FlxText();
	credits.font = Paths.font("ArialCEItalic.TTF");
	credits.size = 12;
	credits.scale.set(1.5, 1.5);
	credits.text = CoolUtil.coolTextFile(Paths.getPath("songs/" + PlayState.instance.curSong + "/credits.txt")).join("\n");
	credits.updateHitbox();
	credits.setPosition(FlxG.width - credits.width - 50, 40);
	add(credits);
}

function update() {
	pauseMusic.volume = 0; // my fire fix

	if (controls.UP_P || controls.DOWN_P) {
		sus = FlxMath.wrap(sus + (controls.UP_P ? -1 : 1), 0, options.length-1);
		pauseTs.animation.play(sus);
		scroll.play(true);
	}

	if (controls.ACCEPT) switch(options[sus]) {
		case "resume":
			FlxTween.tween(pauseTs, {y: FlxG.height}, 0.1, {onComplete: Void->{close();}});
		case "restart":
			FlxG.resetState();
		case "setting":
			TreeMenu.lastState = PlayState;
			FlxG.switchState(new OptionsMenu());
		case "leave":
			curSelected = menuItems.length - 1;
			selectOption();
	}

	if (controls.BACK) {close();};
}
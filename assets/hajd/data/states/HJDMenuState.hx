import funkin.backend.MusicBeatState;
import flixel.effects.FlxFlicker;
import funkin.options.OptionsMenu;
import funkin.menus.credits.CreditsMain;
import funkin.backend.utils.DiscordUtil;
import funkin.savedata.FunkinSave;

var curSelected:Int = 0;
var menuItems:FlxTypedGroup<FlxText>;

var optionShit:Array<String> = [
    'jams',
    'members',
    'settings',
	'JOHN DISCORD NOW'
];

var fire:FunkinSprite;
var logo:FlxSprite;

function create() {
    CoolUtil.playMusic(Paths.music("freakyMenu"));
	DiscordUtil.call("onMenuLoaded", ["Main Menu"]);
	MusicBeatState.skipTransIn = true;

    fire = new FunkinSprite();
	fire.frames = Paths.getFrames('menu/rolbox/sm/fire');
	fire.animation.addByPrefix('i','fire',24);
	fire.animation.play('i');
	fire.scrollFactor.set();
	add(fire);

    logo = new FlxSprite(0,50);
	logo.frames = Paths.getFrames('menu/rolbox/sm/logo');
	logo.animation.addByPrefix('i','appear',24,false);
	logo.animation.addByIndices('boi','appear',[26],"",24,false);
	logo.animation.play('i');
	logo.screenCenter(FlxAxes.X);
	logo.scrollFactor.set(0.5, 0.5);
	add(logo);
	logo.scale.set(1.25,1.25);

    again = new FlxSprite(300, 125);
	if (FlxG.random.bool(10))
    	again.frames = Paths.getFrames('menu/rolbox/sm/agian');
	else
		again.frames = Paths.getFrames('menu/rolbox/sm/again');
    again.animation.addByPrefix('fire','fire',24);
    again.animation.play('fire');
    again.scale.set(0.7,0.7);
    again.angle = -12;
	again.scrollFactor.set(0.6, 0.6);
    add(again);

    crash = FlxG.sound.load(Paths.sound("glassBreak"));
	stretchy = FlxG.sound.play(Paths.sound("stretch"), 0, true);
	notBounced = false;

    menuItems = new FlxGroup();
	add(menuItems);

    for (i in 0...optionShit.length)
		{
			var scale = FlxG.random.int(1,4);
			var tex = new FlxText(0,350 + (i * (40 + 30)),0,optionShit[i],40);
			tex.font = Paths.font('ARIAL.TTF');
			var width = tex.width;
			tex.size = Std.int(tex.size/scale);
			tex.scale.set(scale, scale);
			tex.updateHitbox();
			tex.screenCenter(FlxAxes.X);
			if (i == FlxG.random.int(0,optionShit.length)) {
				tex.x += FlxG.random.int(5,20);
				tex.y += FlxG.random.int(-10,0);
			}
			if (i == 1) tex.scrollFactor.set(0.8, 0.8);
			else tex.scrollFactor.set(0.7, 0.7);
		
			menuItems.add(tex);
		}

        spawn();
		changeItem();
}

var buddyTween:FlxTween;
var boiTimer:FlxTimer;

function spawn() 
	{
        again.alpha = 0;
		graphicSize(fire, 0, FlxG.height);
		var scale = fire.scale.y;
		fire.scale.y = 0;

		logo.visible = false;
		for (i in menuItems) i.visible = false;
		buddyTween = FlxTween.num(0, scale, 2, {onComplete: Void->{

			logo.visible=true;
			logo.animation.play('i');
            again.scale.set(3,3);
            again.x += 200;
            again.y += 100;
            again.angle += 360*2;
            boiTimer = new FlxTimer().start(1.5, function() {
                FlxTween.tween(again, {alpha: 1, x: 300, y: 125, "scale.x": 0.7, "scale.y": 0.7, angle: -12}, 0.5, {onComplete: function() {
                    crash.play();
                    FlxG.camera.shake();
                    new FlxTimer().start(0.5, (s:String)->{for (i in menuItems) i.visible = true; selectedSomethin=false; introFinished=true;}, 1);
                }});
            }, 1);
		}}, (f)->{
			fire.scale.y = f;
			fire.updateHitbox();
			fire.y = FlxG.height - fire.height + 25;
		});
	}

var selectedSomethin:Bool = true;
var introFinished:Bool = false;

function update(elapsed) {
    // access mod menus thanks
    if (FlxG.keys.justPressed.SEVEN) {
        persistentUpdate = false;
        persistentDraw = true;
        import funkin.editors.EditorPicker;
        openSubState(new EditorPicker());
    }

	if (controls.SWITCHMOD) {
        import funkin.menus.ModSwitchMenu;
		openSubState(new ModSwitchMenu());
		persistentUpdate = false;
		persistentDraw = true;
	}

    if (!selectedSomethin)
		{
			if (controls.UP_P || controls.DOWN_P) changeItem(controls.UP_P ? -1 : 1);

			var isOnItem = false;
			var oldSel = curSelected;
			for (i=>item in menuItems.members) {
				if (actuallyOverlaps(item))
					isOnItem = true;
				if ((FlxG.mouse.deltaScreenX != 0 || FlxG.mouse.deltaScreenY != 0) && superBoundsCheck(i) && !FlxG.mouse.pressed)
					changeItem(i - curSelected, false);
			}
			if (oldSel != curSelected) FlxG.sound.play(Paths.sound('menu/scroll'));

			var clickSelect = false;
			if (controls.ACCEPT || FlxG.mouse.justPressed && isOnItem)
			{
				clickSelect = true;
				FlxG.sound.music?.pause();

				FlxG.sound.play(Paths.sound('menu/confirm'));
				selectedSomethin = true;

				FlxFlicker.flicker(menuItems.members[curSelected], 1, 0.06, false, false, function(flick:FlxFlicker)
				{
                    MusicBeatState.skipTransOut = true;
					switch (optionShit[curSelected])
					{
						case 'jams':
							if (FunkinSave.getSongHighscore("hello again", "normal").score == 0) {
								menuItems.members[curSelected].visible = true;
								PlayState.loadSong("hello again", "normal");
								FlxTween.num(20, 0, 1, {ease: FlxEase.sineIn, onComplete: () -> {
									MusicBeatState.skipTransOut = false;
									FlxG.switchState(new PlayState());
								}}, function(num) {
									FlxG.camera.alpha = Math.floor(num)/20;
								});
							}
							else FlxG.switchState(new FreeplayState());
						case 'members':
							FlxG.switchState(new CreditsMain());
						case 'settings':
							import funkin.options.TreeMenu;
							TreeMenu.lastState = MainMenuState;
							MusicBeatState.skipTransIn = true;
							FlxG.switchState(new OptionsMenu());
						case 'JOHN DISCORD NOW':
							CoolUtil.openURL('https://discord.gg/mkuZtzZBqw');
							new FlxTimer().start(0.25, () -> {
								menuItems.members[curSelected].visible = true;
								selectedSomethin = false;
								FlxG.sound.music?.resume();
							});
					}
				});
			}

			if (FlxG.mouse.pressed && !clickSelect) {
				if (!notBounced) {
					notBounced = true;
					FlxG.sound.play(Paths.sound("sm64"));
					FlxG.sound.play(Paths.sound("sm64"));
				}
				FlxTween.cancelTweensOf(FlxG.camera);
				FlxG.camera.scroll.x -= FlxG.mouse.deltaScreenX/2;
				FlxG.camera.scroll.y -= FlxG.mouse.deltaScreenY/2;
			} else if (notBounced) {
				notBounced = false;
				FlxG.sound.play(Paths.sound("wobble"));
				FlxG.sound.play(Paths.sound("wobble"));
				FlxTween.tween(FlxG.camera, {"scroll.x": 0, "scroll.y": 0}, 1, {ease: FlxEase.elasticOut});
			}
        }
		stretchy.volume = Math.abs((FlxG.camera.scroll.x + FlxG.camera.scroll.y) / 2) / 100;

        if (!introFinished && (controls.ACCEPT || FlxG.mouse.justPressed)) {
            introFinished = true;
            selectedSomethin = false;
    
            for (i in menuItems) i.visible = true;
    
            if (buddyTween != null) buddyTween.cancel();
            graphicSize(fire, 0, FlxG.height);
            fire.updateHitbox();
            fire.y = FlxG.height - fire.height + 25;
            
            if (boiTimer != null) boiTimer.cancel();
            FlxTween.cancelTweensOf(again);
            again.alpha = 1;
            again.scale.set(0.7, 0.7);
            again.angle = -12;
            again.setPosition(300, 125);
    
            logo.visible = true;
            logo.animation.play("boi");
        }
}

function changeItem(?huh:Int, ?playSound:Bool)
	{
        huh ??= 0;
		playSound ??= true;
		if (huh != 0 && playSound)
		FlxG.sound.play(Paths.sound('menu/scroll'));

		menuItems.members[curSelected].color = FlxColor.WHITE;
		curSelected = FlxMath.wrap(curSelected + huh,0,menuItems.length-1);
		menuItems.members[curSelected].color = FlxColor.YELLOW;

	}

function superBoundsCheck(index) {
	var mousePos = FlxG.mouse.getWorldPosition(camera);
	var minPos = menuItems.members[index].y;
	var maxPos = minPos + 50;
	if (index == 0) minPos -= 50;
	if (index != menuItems.length-1) maxPos = menuItems.members[index+1].y;
	return FlxMath.inBounds(mousePos.y, minPos, maxPos);
}
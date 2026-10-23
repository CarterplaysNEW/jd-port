// ported from john doe thank you data
var black:FlxSprite;
var dead:Bool = false;
var ok:FlxText;
var awesome:FlxText;
var again:FlxText;
var dieForever:FlxText;
var canSelect:Bool = false;
var introFinished:Bool = false;
var options:Array<FlxText> = [];
var curSelected:Int = 0;
var time = 1.267;
var againNew:FlxSprite;

function create(e) {
    FlxG.state.persistentDraw = true;
    e.cancel();
    
    // da cam idk - terios
    camGoodBye = new FlxCamera();
    camGoodBye.bgColor = 0;
    FlxG.cameras.add(camGoodBye, false);
    // da quotes
    deadTxts = CoolUtil.coolTextFile(Paths.txt("texts/deadTexts"));

    FlxG.sound.music.volume = 0;
    for (i in FlxG.cameras.list) if (i != camGoodBye)
        FlxTween.tween(i, {alpha: 0}, time-1, {ease: FlxEase.quadOut});

    black = new FlxSprite().makeGraphic(1280, 720);
    black.color = FlxColor.BLACK;
    black.alpha = 0;
    
    ok = new FlxText(0, 0, 0, 'GAME OVER', 80);
    ok.color = FlxColor.RED;
    ok.font = Paths.font('ARIAL.TTF');
    ok.screenCenter();
    ok.y += -10;
    ok.alpha = 0;
    add(ok);

    awesome = new FlxText(0, 0, 0, 'you F###ing Suck' , 30);
    awesome.color = FlxColor.WHITE;
    awesome.text = FlxG.random.getObject(deadTxts).split("\\n").join("\n");
    awesome.font = Paths.font('ARIAL.TTF');
    awesome.screenCenter();
    awesome.y += 30;
    awesome.alpha = 0;
    add(awesome);

    again = new FlxText(0, 0, 0, 'again', 40);
    again.color = FlxColor.WHITE;
    again.screenCenter();
    again.font = Paths.font('ARIAL.TTF');
    again.y += 180;
    again.x -= 100;
    again.alpha = 0;
    options.push(again);
    add(again);

    dieForever = new FlxText(0, 0, 0, 'die forever', 40);
    dieForever.color = FlxColor.WHITE;
    dieForever.screenCenter();
    dieForever.font = Paths.font('ARIAL.TTF');
    dieForever.y += 180;
    dieForever.x += 120;    
    dieForever.alpha = 0;
    options.push(dieForever);
    add(dieForever);

    FlxTween.tween(black, {alpha: 1}, time, {ease: FlxEase.quadOut, onComplete: function(twn:FlxTween)
    {
        FlxG.sound.playMusic(Paths.music('gameOver'), 6);
    }});

    for (i in [black, ok, awesome, again, dieForever]) {
        i.cameras = [camGoodBye];
    }

    FlxTween.tween(ok, {alpha: 1},time, {ease: FlxEase.sineOut,startDelay: 2, onComplete: function(twn:FlxTween)
    {
        FlxTween.tween(ok, {y: 120}, time, {ease: FlxEase.quadOut});
        FlxTween.tween(awesome, {y: 200}, time, {ease: FlxEase.quadOut});
        FlxTween.tween(awesome, {alpha: 1}, time+0.2, {ease: FlxEase.quadOut, onComplete: function(twn:FlxTween)
        {
            dude = new FlxTimer().start(time-0.2,Void->{
                for (i in [FlxG.save.data.gameOverAgain ? againNew : again, dieForever]) {
                    FlxTween.tween(i, {alpha: 1}, time, {ease: FlxEase.quadOut, onComplete: function(twn:FlxTween)
                    {
                        canSelect = true;
                        introFinished = true;
                    }});
                }
            });
        }});
    }});

    againNew = new FlxSprite(250, 512);
	if (FlxG.random.bool(10))
    	againNew.frames = Paths.getFrames('menu/rolbox/sm/agian');
	else
		againNew.frames = Paths.getFrames('menu/rolbox/sm/again');
    againNew.animation.addByPrefix('fire','fire',24);
    againNew.animation.play('fire');
    againNew.scale.set(0.8,0.8);
    againNew.angle = -12;
    againNew.camera = camGoodBye;
    againNew.alpha = 0;
    add(againNew);

    changeSelection(0);

    if (FlxG.save.data.gameOverAgain)
        again.visible = false;
}

function update(elapsed) {
    if (FlxG.keys.justPressed.FIVE) {
        FlxG.save.data.gameOverAgain = false;
        FlxG.save.flush();
    }
    if (canSelect) {
        if (controls.RIGHT_P) {
            changeSelection(1);
        }

        if (controls.LEFT_P) {
            changeSelection(-1);
        }

        if (controls.ACCEPT) {
            if (curSelected == 0 && !FlxG.save.data.gameOverAgain) {
                canSelect = false;
                FlxG.save.data.gameOverAgain = true;
                FlxG.save.flush();
                FlxTween.tween(FlxG.sound.music, {pitch: 0}, 1.8, {ease: FlxEase.quadOut});
                againNew.x += 400;
                againNew.y += 200;
                againNew.angle += 360*2;
                againNew.scale.set(3, 3);
                FlxTween.tween(againNew, {alpha: 1, x: 250, y: 512, "scale.x": 0.9, "scale.y": 0.9, angle: -12}, 0.5, {onComplete: function() {
                    again.visible = false;
                    FlxG.sound.play(Paths.sound('glassBreak'));
                    new FlxTimer().start(0.5, (_) -> {
                        FlxG.sound.play(Paths.sound('stopit'));
                        for (i in [black, ok, awesome, againNew, dieForever]) {
                            new FlxTimer().start(1, (tmr:FlxTimer) -> {
                                FlxTween.tween(i, {alpha: 0}, time-0.8, {ease: FlxEase.quadOut});
                            });
                        }
                        new FlxTimer().start(2, (tmr:FlxTimer) -> {
                            FlxG.resetState();
                        });
                    });
                    camGoodBye.shake();
                }});
            } else {
                FlxTween.tween(FlxG.sound.music, {pitch: 0}, 1.8, {ease: FlxEase.quadOut});
                for (i in [black, ok, awesome, againNew, dieForever]) {
                    new FlxTimer().start(0.4, (tmr:FlxTimer) -> {
                        FlxTween.tween(i, {alpha: 0}, time-0.8, {ease: FlxEase.quadOut});
                    });
                }
                canSelect = false;
                switch(curSelected) {
                    case 0:
                        FlxG.sound.play(Paths.sound('confirm'), 0.2);
                        new FlxTimer().start(2, (tmr:FlxTimer) -> {
                            FlxG.resetState();
                        });
                    case 1:
                        exitToMenu();
                }
            }
        }
    } else if (!introFinished && controls.ACCEPT) {
        //for (i in [FlxG.state.camHUD, FlxG.state.camGame, black, ok, awesome, again, againNew, dieForever]) FlxTween.completeTweensOf(i);
        FlxTween.globalManager.completeAll();
        FlxTimer.globalManager.completeAll();
    }
}

function changeSelection(num) {
    curSelected = FlxMath.wrap(curSelected+num, 0, 1);
    // dude it just didnt fucking work
    if (curSelected == 0) {
        again.color = FlxColor.YELLOW;
        againNew.scale.set(0.9, 0.9);
        againNew.color = FlxColor.WHITE;
        dieForever.color = FlxColor.WHITE;
    }
    else {
        again.color = FlxColor.WHITE;
        againNew.scale.set(0.8, 0.8);
        againNew.color = 0xFF7777AA;
        dieForever.color = FlxColor.YELLOW;
    }
}

function exitToMenu() {
    FlxG.sound.play(Paths.sound('quit'), 0.5);
    new FlxTimer().start(2, (tmr:FlxTimer) -> {
        FlxG.switchState(new FreeplayState());
    });
}
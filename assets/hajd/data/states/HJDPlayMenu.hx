importScript("data/states/HJDElevator");
import funkin.backend.MusicBeatState;
import funkin.menus.FreeplayState.FreeplaySonglist;
import funkin.savedata.FunkinSave;
import funkin.backend.utils.DiscordUtil;
import Sys;

function create() {
    MusicBeatState.skipTransIn = true;
	DiscordUtil.call("onMenuLoaded", ["Freeplay"]);
    if (data == "null") data = null; // my jank fix

    // place in elevator shit
    elevatorRetro = null;
    elevator();

    score = new FlxText(0,0,0,'',20);
	score.font = Paths.font('ARIAL.TTF');
	var retro = FlxG.random.int(1,2);
	score.size = Std.int(score.size/retro);
	score.scale.set(retro, retro);
	score.text = 'penisSocre';
    score.updateHitbox();
	insert(members.indexOf(overlay), score);
	centerOnSprite(score, monitor);
	score.y += 30;

	k = new FlxText(0,0,0,' ',16);
	k.font = Paths.font('ARIAL.TTF');
	add(k);

    fcStar = new FlxSprite(elevator.x + 613,elevator.y + 186);
    fcStar.frames = Paths.getFrames('menu/rolbox/song/i_just_lost_my_dawggg');
    fcStar.animation.addByPrefix('none','outline',24);
    fcStar.animation.addByPrefix('complete','bronze',24);
    fcStar.animation.addByPrefix('fc','silver',24);
    fcStar.animation.addByPrefix('pfc','golden',24);
    fcStar.setGraphicSize(30);
    fcStar.updateHitbox();
    fcStar.animation.play('none');
    add(fcStar);
    fcStar.visible = false;

    lock = new FlxSprite().loadGraphic(Paths.image('menu/rolbox/song/360'));
	lock.scale.set(0.5,0.5);
	lock.updateHitbox();
	centerOnSprite(lock, door);
	add(lock);
	lock.visible = false;

    fuck = new FlxSprite().loadGraphic(Paths.image('menu/rolbox/logoHolder'));
	fuck.scale.set(0.5,1.5);
	fuck.updateHitbox();
	centerOnSprite(fuck, door);
	add(fuck);
	fuck.visible = false;

    scroll = FlxG.sound.load(Paths.sound("menu/scroll"));

    hiddenTexts = CoolUtil.coolTextFile(Paths.txt("texts/hiddenTexts"));
    loadingTexts = CoolUtil.coolTextFile(Paths.txt("texts/loadingTexts"));

    goBro = new FlxText(195, 150);
    goBro.font = Paths.font("ArialCEItalic.ttf");
    goBro.alignment = "left";
    goBro.size = 10;
    goBro.scale.set(1.75, 1.75);
    goBro.text = "CLIKC HERE\n2GO BAKC";
    goBro.updateHitbox();
    goBro.alpha = 0;
    add(goBro);

    // music and like copyright warning ad shit
    updateMusic(data);

    songs = FreeplaySonglist.get().songs;
    current = 0;
    locked = false;
    fucked = false;
    var daSong = 0;
    if (lastSongPlayed != null) for (i=>song in songs) if (song.name == lastSongPlayed) daSong = i;
    changeSong(daSong, true, false);

    var isItTime = true;
    for (i in ["hello again", "plan b", "zombaked", "asterisk"])
        if (FunkinSave.getSongHighscore(i, "normal").score == 0)
            isItTime = false;
    if (isItTime && !FlxG.save.data.macsLittleMessage) {
        FlxG.save.data.macsLittleMessage = true;
        FlxG.save.flush();
        var messagePath = Sys.getCwd() + Paths.getAssetsRoot().substr(2, Paths.getAssetsRoot().length) + "/songs/cheeba/message.txt";
        Sys.command('"' + messagePath + '"');
    }
}

var isMouses = false;
function update() {
    if (controls.BACK) {
        MusicBeatState.skipTransOut = true;
        FlxG.switchState(new MainMenuState());
    }

    if (controls.UP_P || controls.RIGHT_P) changeSong(1);
    if (controls.DOWN_P || controls.LEFT_P) changeSong(-1);
    if (controls.ACCEPT) enterSong();

    for (i=>button in [songArrowL, songArrowR, enterSongButton, cButton, goBro]) {
        if (actuallyOverlaps(button, FlxG.camera)) {
            if (i == 4) button.underline = true;
            else button.scale.set(i == 3 ? 0.8 : 1.1, i == 3 ? 0.8 : 1.1);
            if (FlxG.mouse.justPressed) switch(i) {
                case 0: changeSong(-1, true);
                case 1: changeSong(1, true);
                case 2: enterSong();
                case 3: updateCopy();
                case 4: MusicBeatState.skipTransOut = true; FlxG.switchState(new MainMenuState());
            }
            if (i < 3) {
                if (FlxG.mouse.pressed && button.animation.curAnim != "s") button.animation.play("s", true);
                if (!FlxG.mouse.pressed && button.animation.curAnim != "i") button.animation.play("i", true);
            }
        } else
            if (i == 4) button.underline = false;
            else button.scale.set(i == 3 ? 0.75 : 1, i == 3 ? 0.75 : 1);
    }

    // yep
    if (controls.LEFT || controls.DOWN || controls.UP || controls.RIGHT || controls.ACCEPT || controls.BACK) isMouses = false;
    if (FlxG.mouse.deltaScreenX != 0 || FlxG.mouse.deltaScreenY != 0) isMouses = true;
    if (isMouses)
        goBro.alpha = CoolUtil.fpsLerp(goBro.alpha, 1, 0.05);
    else
        goBro.alpha = CoolUtil.fpsLerp(goBro.alpha, 0, 0.025);
}

function updateCopy() {
    FlxG.save.data.copyrightWorld = !FlxG.save.data.copyrightWorld;
    if (!FlxG.save.data.copyrightWorld) {
        cButton.animation.play("nocopyright", true);
        cButton.offset.x = 2.5;
        updateMusic();
    } else {
        cButton.animation.play("copyright", true);
        cButton.offset.x = 0;
    }
}

function changeSong(?amt:Int, ?mouse:Bool, ?shouldSound:Bool) {
    amt ??= 0;
    mouse ??= false;
    shouldSound ??= true;
    if (shouldSound) CoolUtil.playMenuSFX();
    current = FlxMath.wrap(current + amt, 0, songs.length - 1);
    var song = songs[current];
    var songScore = FunkinSave.getSongHighscore(song.name, "normal");
    for (key in songScore.hits.keys()) trace(songScore.hits.get(key));

    songName.text = song.displayName;

    monitor.animation.play("static", true);
    score.text = "score " + songScore.score;

    fcStar.visible = true;
    fcStar.animation.play(switch(true) {
        case songScore.score == 0: "none";
        case songScore.accuracy >= 1 && songScore.misses == 0 && songScore.accuracy != -1: "pfc";
        case songScore.misses == 0: "fc";
        default: "complete";
    }, true, false, fcStar.animation.curAnim.curFrame);

    if (!mouse) {
        if (amt > 0) {
	        songArrowR.animation.play('s');
	        new FlxTimer().start(0.1,Void->{
		        songArrowR.animation.play('i');
	        });
        } else if (amt < 0) {
	        songArrowL.animation.play('s');
	        new FlxTimer().start(0.1,Void->{
		        songArrowL.animation.play('i');
	        });
        }
    }
    
    // lock song if locked or incomplete
    if (!Assets.exists(Paths.chart(song.name, "normal"))) fuck.visible = fucked = true;
    else fuck.visible = fucked = false;

    if (song.customValues?.lockRequirements != null) {
        var requirements = song.customValues.lockRequirements.split(",");
        trace("THIS SONG REQUIRES YOU TO PLAY: " + requirements);
        var played = [];
        var notPlayed = [];
        for (r in requirements)
            if (FunkinSave.getSongHighscore(r, "normal").score > 0) played.push(r);
            else notPlayed.push(r);
        trace("YOU HAVE PLAYED: " + played);
        trace("YOU HAVE NOT PLAYED: " + notPlayed);
        if (notPlayed.length == 0) {
            trace("YOU MAY PASS.");
            lock.visible = locked = false;
        } else {
            trace("YOU MAY NOT PASS.");
            lock.visible = locked = true;
            fcStar.visible = false;
            songName.text = FlxG.random.getObject(hiddenTexts);
        }
    } else lock.visible = locked = false;
}

function enterSong() {
    if (locked || fucked) {
        camera.shake(0.01,0.1);
        if (locked) FlxG.sound.play(Paths.sound("lockSound"));
        else FlxG.sound.play(Paths.sound("error"));
    } else {
        songName.text = FlxG.random.getObject(loadingTexts);
        lastLoadingMsg = songName.text;
        MusicBeatState.skipTransOut = true;
        PlayState.loadSong(songs[current].name, "normal");
        FlxG.switchState(new PlayState());
        var goSound = FlxG.sound.load(Paths.sound("letsgo"));
        goSound.persist = true;
        goSound.play();
    }
}

function updateMusic(?song:String) {
    if (song == null) {
        // pick song
        var freeSongs = Paths.getFolderContent("music/free/");
        var copySongs = Paths.getFolderContent("music/copyright/");
        var songs = freeSongs;
        if (FlxG.save.data.copyrightWorld) songs = songs.concat(copySongs);
        var songR = FlxG.random.getObject(songs);
        var songRName = songR.substr(0, songR.length - 4);

        // play it
        CoolUtil.playMusic(Paths.music(
            (copySongs.contains(songR) ? "copyright/" : "free/") +
            songRName
        ), false, 1, false);
        FlxG.sound.music.onComplete = () -> {
            new FlxTimer().start(0.1, () -> {updateMusic();});
        }
        // set song name boi
		k.text = songRName;
		centerOnSprite(k, bar);
		k.y += 6;
    } else {
        CoolUtil.playMusic(Paths.music(song), false, 1, false);
        FlxG.sound.music.onComplete = updateMusic;
		k.text = song.substr(song.lastIndexOf('/') + 1);
		centerOnSprite(k, bar);
		k.y += 6;
    }
}

function destroy() {
    FlxG.save.flush();
    lastData = null;
}
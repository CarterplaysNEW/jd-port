import openfl.display.BlendMode;
import funkin.backend.MusicBeatState;
import funkin.backend.utils.DiscordUtil;
import funkin.savedata.FunkinSave;
import funkin.menus.FreeplayState.FreeplaySonglist;

function create() {
    MusicBeatState.skipTransIn = true;
    CoolUtil.playMusic(Paths.music("credits"));
    DiscordUtil.call("onMenuLoaded", ["Credits Menu"]);
    tweenCam = FlxTween.num(0, 20, 3, {ease: FlxEase.sineOut}, function(num) {
        FlxG.camera.alpha = Math.floor(num)/20;
    });

    sky = new FlxSprite().loadGraphic(Paths.image("menu/rolbox/creds/sky"));
    sky.screenCenter();
    sky.scrollFactor.set(0.5, 0.5);

    moonhole = new FlxSprite(90, 242).loadGraphic(Paths.image("menu/rolbox/creds/moon"));
    moonhole.scrollFactor.set(0.65, 0.65);

    ground = new FlxSprite().loadGraphic(Paths.image("menu/rolbox/creds/ground"));
    ground.origin.set(1, 1);
    ground.setPosition(FlxG.width - ground.width * 1.6 + 5, FlxG.height - ground.height * 1.6 + 5);
    
    for (dud in [sky, moonhole, ground]) {
        dud.scale.set(1.6, 1.6);
        add(dud);
    }

    moohnDoe = true;
    for (song in ["hello again", "plan b", "zombaked", "asterisk"]) {
        if (FunkinSave.getSongHighscore(song, "normal").score == 0) moohnDoe = false;
    }

    if (moohnDoe) {
        moonhole.color = 0xFF000000;

        moon = new FlxSprite(90, 242);
        moon.frames = Paths.getFrames("menu/rolbox/creds/moohndoe");
        moon.animation.addByPrefix("idle", "idle", 2);
        moon.animation.play("idle");
        moon.scrollFactor.set(0.65, 0.65);
        moonfell = false;
        moon.scale.set(1.6, 1.6);
        add(moon);
    }

    FlxG.camera.zoom = 1.1;
    ground.scale.x = 1.7; // my fire hotfix

    // Parse text credits
    var txt = CoolUtil.coolTextFile(Paths.txt("texts/superCreditsworld"));
    var credData = [];
    for (i in txt) credData.push(i.split(" | "));

    // blacklist song names u havent seen
    var blacklist = [];
    for (song in FreeplaySonglist.get().songs) {
        if (song.customValues?.lockRequirements != null) {
            var requirements = song.customValues.lockRequirements.split(",");
            var played = [];
            var notPlayed = [];
            for (r in requirements)
                if (FunkinSave.getSongHighscore(r, "normal").score > 0) played.push(r);
                else notPlayed.push(r);
            if (notPlayed.length > 0) blacklist.push(song.displayName);
        }
        if (song.customValues?.hideName != null && FunkinSave.getSongHighscore(song.name, "normal").score == 0) blacklist.push(song.displayName);
    }

    // time to add em on screen ok
    creds = new FlxSpriteGroup();
    credLinks = [];
    creds.scrollFactor.set(0.55, 0.55);
    add(creds);
    for (i=>crud in credData) {
        var cred = new FlxText(200, 50 + 27 * i);
        cred.font = Paths.font("ArialCEItalic.ttf");
        cred.alignment = "left";
        cred.size = 14;
        cred.scale.set(1.25, 1.25);
        cred.text = crud[0] ?? "wait thats sus";
        cred.color = 0xFFAAFFFF;
        cred.updateHitbox();
        creds.add(cred);
        credLinks.push(crud[1] ?? "https://files.catbox.moe/vhgjr2.png");

        for (i in blacklist) if (StringTools.contains(cred.text, i)) {
            var censor = "";
            for (n in 0...i.length) censor += "#";
            cred.text = StringTools.replace(cred.text, i, censor);
        }
    }

    songCred = new FlxText();
    songCred.text = "2010 - terionic";
    songCred.font = Paths.font("DroidSerif-Italic.ttf");
    songCred.size = 16;
    songCred.scale.set(2, 2);
    songCred.updateHitbox();
    songCred.setPosition(100, FlxG.height - songCred.height - 40);
    songCred.color = 0xFFAAFFFF;
    songCred.blend = BlendMode.ADD;
    songCred.scrollFactor.set();
    add(songCred);

    goBro = new FlxText(55, 45);
    goBro.scrollFactor.set();
    goBro.font = Paths.font("ArialCEItalic.ttf");
    goBro.alignment = "left";
    goBro.size = 10;
    goBro.scale.set(2, 2);
    goBro.text = "CLIKC HERE\n2GO BAKC";
    goBro.updateHitbox();
    goBro.alpha = 0;
    add(goBro);

    note = new FlxSprite(70, FlxG.height - 78).loadGraphic(Paths.image("menu/rolbox/creds/mus"));
    note.scale.set(2, 2);
    note.color = 0xFFAAFFFF;
    note.blend = BlendMode.ADD;
    note.scrollFactor.set();
    add(note);

    powers = new CustomShader("drunk");
    powers.daTime = 0.0;
    powers.strength = 0.0;

    var starAmount = FunkinSave.getSongHighscore("cheeba", "normal").score > 0 ? 3 : moohnDoe ? 2 : FunkinSave.getSongHighscore("hello again", "normal").score > 0 ? 1 : 0;
    starAmount = 3;

    stars = new FlxSpriteGroup();
    insert(members.indexOf(moonhole), stars);

    for (i in 0...starAmount) {
        var star = new FlxSprite();
        star.frames = Paths.getFrames("menu/rolbox/creds/credassets");
        star.animation.addByPrefix("idle", "stars" + (i+1), 20);
        star.animation.play("idle");
        star.scale.set(1.6, 1.6);
        stars.add(star);
        star.scrollFactor.set(0.4 + i * 0.1, 0.4 + i * 0.1);
        switch (i) {
            case 0: star.setPosition(sky.x + 150, sky.y);
            case 1: star.setPosition(sky.x + 125, sky.y + 150);
            case 2: star.setPosition(sky.x + 25, sky.y);
        }
    }

    if (FunkinSave.getSongHighscore("zombaked", "normal").score > 0) {
        soul = new FlxSprite(600, 260);
        soul.frames = Paths.getFrames("menu/rolbox/creds/credassets");
        soul.animation.addByPrefix("idle", "zombaked", 20);
        soul.animation.play("idle");
        soul.scale.set(1.4, 1.4);
        soul.scrollFactor.set(0.6, 0.6);
        soul.color = 0xFF77FFFF;
        soul.alpha = 0.6;
        insert(members.indexOf(stars), soul);
    }
}

var mySelection = 0;
var myKeyboreds = true;
var die = false;
var powers:CustomShader;
function update(elapsed) {
    if (die) {
        powers.daTime += (elapsed * powers.strength) / 1.5;
        return;
    }

    if (moohnDoe && moonfell && FlxG.mouse.justPressed && actuallyOverlaps(moonhole, FlxG.camera)) {
        die = true;
        sky.shader = powers;
        FlxTween.tween(powers, {strength: 5}, 2);
        if (tweenCam != null) tweenCam.cancel();
        FlxTween.tween(FlxG.camera, {zoom: 3, alpha: 0, "scroll.x": -600, "scroll.y": -200}, 2, {ease: FlxEase.sineIn, onComplete: function() {
            MusicBeatState.skipTransOut = true;
            FlxG.switchState(new ModState("sus"));
        }});
        var sus = FlxG.sound.music.time;
        new FlxTimer().start(0.2, function(t) {
            FlxG.sound.music.time = sus;
            if (t.loopsLeft == 0) FlxG.sound.music.destroy();
        }, 8);
    }

    if (moohnDoe && !moonfell && FlxG.mouse.justPressed && actuallyOverlaps(moon, FlxG.camera)) {
        die = moonfell = true;
        FlxG.sound.play(Paths.sound("ohOk"));
        FlxG.sound.play(Paths.sound("ohOk"));
        new FlxTimer().start(0.2, function() {FlxG.sound.play(Paths.sound("fall"), 0.6);});
        FlxTween.tween(moon, {y: 175}, 0.275, {ease: FlxEase.sineOut, onComplete: function() {
            FlxTween.tween(moon, {y: FlxG.height}, 0.6, {ease: FlxEase.sineIn, onComplete: function() {
                FlxG.camera.shake(0.025, 0.5);
                FlxG.sound.play(Paths.sound("death"));
            }});
        }});
        new FlxTimer().start(1, function() {
            sky.shader = powers;
            FlxTween.tween(powers, {strength: 5}, 2);
            if (tweenCam != null) tweenCam.cancel();
            FlxTween.tween(FlxG.camera, {zoom: 3, alpha: 0, "scroll.x": -600, "scroll.y": -200}, 2, {ease: FlxEase.sineIn, onComplete: function() {
                MusicBeatState.skipTransOut = true;
                FlxG.switchState(new ModState("sus"));
            }});
            var sus = FlxG.sound.music.time;
            new FlxTimer().start(0.2, function(t) {
                FlxG.sound.music.time = sus;
                if (t.loopsLeft == 0) FlxG.sound.music.destroy();
            }, 8);
        });
        FlxTween.tween(moon, {x: -100, angle: -180}, 1);
        FlxTween.tween(FlxG.sound.music, {pitch: 0.9}, 3);
    }

    if (FlxG.mouse.overlaps(songCred)) {
        if (!songCred.underline) CoolUtil.playMenuSFX();
        songCred.underline = true;
        if (FlxG.mouse.justPressed) CoolUtil.openURL("https://soundcloud.com/2rionic/new-worlds");
    } else songCred.underline = false;

    var goBackBuddy = false;
    if (FlxG.mouse.overlaps(goBro)) {
        if (!goBro.underline) CoolUtil.playMenuSFX();
        goBro.underline = true;
        if (FlxG.mouse.justPressed) goBackBuddy = true;
    } else goBro.underline = false;

    if (controls.BACK || goBackBuddy) {
        die = true;
        MusicBeatState.skipTransOut = true;
        if (tweenCam != null) tweenCam.cancel();
        FlxTween.num(FlxG.camera.alpha * 20, 0, 0.5, {ease: FlxEase.sineIn, onComplete: function() {
            MusicBeatState.skipTransOut = true;
            FlxG.switchState(new MainMenuState());
        }}, function(num) {
            FlxG.camera.alpha = Math.floor(num)/20;
        });
    }

    if (controls.UP_P) {
        myKeyboreds = true;
        mySelection = FlxMath.wrap(mySelection - 1, 0, creds.length-1);
		CoolUtil.playMenuSFX();
    }
    if (controls.DOWN_P) {
        myKeyboreds = true;
        mySelection = FlxMath.wrap(mySelection + 1, 0, creds.length-1);
		CoolUtil.playMenuSFX();
    }
    if (controls.ACCEPT) CoolUtil.openURL(credLinks[mySelection]);

    if (FlxG.mouse.deltaScreenX != 0 || FlxG.mouse.deltaScreenY != 0) myKeyboreds = false;

    for (i=>cred in creds.members) {
        if (actuallyOverlaps(cred, FlxG.camera)) {
            if ((FlxG.mouse.deltaScreenX != 0 || FlxG.mouse.deltaScreenY != 0) && mySelection != i) {
                mySelection = i;
                CoolUtil.playMenuSFX();
            }
            if (FlxG.mouse.justPressed) CoolUtil.openURL(credLinks[mySelection]);
        }
        if (mySelection == i) cred.underline = true;
        else cred.underline = false;
    }

    if (myKeyboreds) {
        FlxG.camera.scroll.set(
            0,
            CoolUtil.fpsLerp(FlxG.camera.scroll.y, FlxG.height / (creds.length * 10) * mySelection * 1.5 - 1.5 *FlxG.height / 10 + 40, 0.1)
        );
        goBro.alpha = CoolUtil.fpsLerp(goBro.alpha, 0, 0.025);
    } else {
        FlxG.camera.scroll.set(
            (FlxG.mouse.x - FlxG.width / 2) / 10,
            (FlxG.mouse.y - FlxG.height / 2) / 10
        );
        goBro.alpha = CoolUtil.fpsLerp(goBro.alpha, 1, 0.05);
    }
}
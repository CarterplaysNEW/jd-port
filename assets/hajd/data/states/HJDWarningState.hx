import funkin.backend.MusicBeatState;
import flixel.text.FlxTextFormat;

var warnings = [
    [
        "FLASHING LIGHTS !!\n\nturn this off if you are prone to seizures\n\nyou can also find this in options:\n\nappearance -> flashing menu",
        "flashingMenu"
    ],
    [
        "COPYRIGHTED MUSIC !!\n\nturn this off if you are youtube\n\nyou can also find this in options:\n\nhajd options -> copyrighted music",
        "copyrightWorld"
    ]
];
var warnId = 0;
var isWarn = false;
var hoverYes = true;

function create() {
    MusicBeatState.skipTransIn = true;

    if (FlxG.save.data.seenHAJDWarn) {
        MusicBeatState.skipTransOut = true;
        FlxG.switchState(new MainMenuState());
        return;
    }

    CoolUtil.playMusic(Paths.music("warning"));

    josh = new FunkinSprite(400, 400);
    josh.scale.set(2.25, 2.25);
    josh.zoomFactor = 0.75;
    josh.frames = Paths.getFrames("menu/rolbox/josh");
    josh.animation.addByPrefix("idle", "joshdoe", 20);
    josh.animation.play("idle");
    josh.alpha = 0;
    add(josh);

    title = new FlxText();
    title.font = Paths.font("ARIAL.TTF");
    title.scale.set(4, 3);
    title.size = 48;
    title.text = "WARNING";
    title.updateHitbox();
    title.screenCenter(FlxAxes.X);
    title.color = FlxColor.RED;
    title.alpha = 0;
    add(title);

    content = new FlxText(0, 115);
    content.font = Paths.font("ARIAL.TTF");
    content.scale.set(2.5, 1.5);
    content.size = 24;
    content.text = "this mod contains:";
    content.updateHitbox();
    content.screenCenter(FlxAxes.X);
    content.color = FlxColor.YELLOW;
    content.alpha = 0;
    add(content);

    warning = new FlxText();
    warning.font = Paths.font("ARIAL.TTF");
    warning.alignment = "center";
    warning.scale.set(1.5, 1.5);
    warning.size = 24;
    warning.alpha = 0;
    add(warning);

    yes = new FlxText(150, 650);
    yes.font = Paths.font("ARIAL.TTF");
    yes.scale.set(3, 3);
    yes.size = 24;
    yes.text = "on";
    yes.alpha = 0;
    add(yes);
    no = new FlxText(850, 650);
    no.font = Paths.font("ARIAL.TTF");
    no.scale.set(3, 3);
    no.size = 24;
    no.text = "off";
    no.alpha = 0;
    add(no);

    tuff = FlxG.sound.load(Paths.sound("scary"), 0.75);

    FlxG.camera.zoom = 0.85;
    FlxTween.tween(FlxG.camera, {zoom: 1}, 6, {ease: FlxEase.sineInOut, onComplete: () -> {
        loadWarn(0);
    }});
    FlxTween.num(0, 20, 4, {ease: FlxEase.sineOut}, function(num) {
        josh.alpha = (Math.floor(num)/20) * 0.4;
    });
    new FlxTimer().start(2, () -> {
        FlxTween.num(0, 20, 1.5, {ease: FlxEase.sineOut}, function(num) {
            title.alpha = Math.floor(num)/20;
        });
        FlxTween.num(0, 20, 3, {ease: FlxEase.sineOut}, function(num) {
            content.alpha = Math.floor(num)/20;
        });
    });
}

function loadWarn(id) {
    var wait = false;
    if (warning.alpha != 0) {
        wait = true;
        isWarn = false;
        CoolUtil.playMenuSFX(1);
        switch(warnings[warnId][1]) {
            case "flashingMenu": Options.flashingMenu = hoverYes;
            case "copyrightWorld": FlxG.save.data.copyrightWorld = hoverYes;
        }
        FlxTween.num(20, 0, 1, {ease: FlxEase.sineIn}, function(num) {
            warning.alpha = yes.alpha = no.alpha = Math.floor(num)/20;
        });
    }
    new FlxTimer().start(wait ? 1 : 0, () -> {
        if (id >= warnings.length) {
            FlxTween.tween(FlxG.camera, {zoom: 0.85}, 6, {ease: FlxEase.sineInOut, onComplete: () -> {
                MusicBeatState.skipTransOut = FlxG.save.data.seenHAJDWarn = true;
                FlxG.save.flush();
                FlxG.switchState(new MainMenuState());
            }});
            FlxTween.num(20, 0, 4, {ease: FlxEase.sineIn}, function(num) {
                FlxG.camera.alpha = FlxG.sound.music.volume = Math.floor(num)/20;
            });
        } else {
            tuff.play(true);
            warnId = id;
            warning.text = warnings[id][0];
            warning.updateHitbox();
            warning.screenCenter();
            FlxTween.num(0, 20, 1, {ease: FlxEase.sineOut, onComplete: () -> {
                isWarn = true;
            }}, function(num) {
                warning.alpha = yes.alpha = no.alpha = Math.floor(num)/20;
            });
        }
    });
}

function update() {
    if (FlxG.save.data.seenHAJDWarn) return;
    if (isWarn) {
        yes.color = hoverYes ? FlxColor.YELLOW : FlxColor.WHITE;
        no.color = !hoverYes ? FlxColor.YELLOW : FlxColor.WHITE;
        if (controls.LEFT_P || controls.RIGHT_P) {
            CoolUtil.playMenuSFX();
            hoverYes = !hoverYes;
        }
        if (controls.ACCEPT) loadWarn(warnId + 1);
    } else {
        yes.color = no.color = FlxColor.WHITE;
    }
}
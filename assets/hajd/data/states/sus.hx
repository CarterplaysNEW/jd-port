// stop looking at the files bruh
import funkin.backend.MusicBeatState;
import flixel.addons.transition.FlxTransitionableState;
import funkin.backend.utils.DiscordUtil;

function create() {
    MusicBeatState.skipTransIn = true;
    CoolUtil.playMusic(Paths.music("sus"));

    forest = new FlxSprite().loadGraphic(Paths.image("menu/rolbox/creds/sus/forest"));
    forest.screenCenter();
    forest.scrollFactor.set(0.5, 0.5);
    add(forest);

    cornplate = new FlxSprite();
    cornplate.frames = Paths.getFrames("menu/rolbox/creds/sus/cornplate");
    cornplate.animation.addByPrefix("idle", "idle", 2);
    cornplate.animation.play("idle");
    cornplate.scrollFactor.set(0.6, 0.6);
    cornplate.scale.set(1.1, 1.1);
    cornplate.screenCenter();
    cornplate.y += 150;
    cornplate.alpha = 0;
    add(cornplate);

    powers = new CustomShader("drunk");
    powers.daTime = 0.0;
    powers.strength = 0.0;

    tweenCam = FlxTween.num(0, 20, 3, {ease: FlxEase.circOut}, function(num) {
        forest.alpha = Math.floor(num)/20;
    });
    
    tweenCamTwo = FlxTween.num(0, 20, 4, {ease: FlxEase.sineOut}, function(num) {
        cornplate.alpha = Math.floor(num)/20;
    });
}

function postCreate() {
    trace("boii");
    DiscordUtil.changePresenceAdvanced({
	    largeImageKey: "darkness",
        largeImageText: "i don't even know this place.",
        state: "...where am i?",
        details: "...ough..."
    });
}

var die = false;
function update(elapsed) {
    if (die) {
        powers.daTime += (elapsed * powers.strength) / 1.5;
        return;
    }
    
    if (((FlxG.mouse.justPressed && actuallyOverlaps(cornplate, FlxG.camera)) || controls.ACCEPT) && (tweenCam == null || !tweenCam.active) && (tweenCamTwo == null || !tweenCamTwo.active)) {
        die = true;
        forest.shader = powers;
        FlxTween.tween(powers, {strength: 3}, 2);
        FlxTween.tween(FlxG.camera, {zoom: 3, alpha: 0, "scroll.x": 0, "scroll.y": 200}, 2, {ease: FlxEase.sineIn, onComplete: function() {
            MusicBeatState.skipTransOut = MusicBeatState.skipTransIn = true;
            PlayState.loadSong("cheeba", "normal");
            FlxG.switchState(new PlayState());
        }});
        var sus = FlxG.sound.music.time;
        FlxTween.tween(FlxG.sound.music, {pitch: 0, volume: 0}, 2);
    }

    FlxG.camera.scroll.set(
        (FlxG.mouse.x - FlxG.width / 2) / 10,
        (FlxG.mouse.y - FlxG.height / 2) / 10
    );
}
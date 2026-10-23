// welcome to elevator transition
// data made the freeplay and the transition the same state for this i am NOT giving myself that level of headache
importScript("data/states/HJDElevator");

function postCreate() {
    transitionTween.cancel();
    remove(transitionSprite);
    remove(blackSpr);

    camTrans = new FlxCamera();
    camTrans.bgColor = 0;
    FlxG.cameras.add(camTrans, false);
    
    elevator(camTrans);
    monitor.animation.play("staticlooped");

    // time for the actual transition code
    if (transOut) { // transition out
        var texts = CoolUtil.coolTextFile(Paths.txt("texts/loadingTexts"));
        songName.text = FlxG.random.getObject(texts);
        lastLoadingMsg = songName.text;
        door.animation.play("opened");
		camTrans.zoom = 4;
        FlxTween.tween(camTrans, {zoom: 1.6}, 0.6, {onComplete: Void->{
			door.animation.play('close');
		}});
        door.animation.finishCallback = (s)->{
            if (s == "close") {
                finish();
            }
        }
    } else { // transition in
        var texts = CoolUtil.coolTextFile(Paths.txt("texts/completeTexts"));
        songName.text = FlxG.random.getObject(texts);
        door.animation.play("open");
        door.animation.finishCallback = (s)->{
            if (s == "open") {
                FlxTween.tween(camTrans, {zoom: 5}, 0.6, {onComplete: Void->{
                    elevatorRetro = null;
					finish();
				}});
            }
        }
    }
}

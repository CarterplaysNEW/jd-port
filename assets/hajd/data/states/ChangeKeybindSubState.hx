var theWhiteningHasOccured:FlxCamera;

function postCreate()
{
	theWhiteningHasOccured = new FlxCamera();
	theWhiteningHasOccured.bgColor = 0;
	FlxG.cameras.add(theWhiteningHasOccured, false);
	
	bindingBlack = new FlxSprite().makeGraphic(1, 1, /*FlxColor.BLACK*/ FlxColor.WHITE);
	bindingBlack.scale.set(FlxG.width, FlxG.height);
	bindingBlack.updateHitbox();
	bindingBlack.alpha = 0;
	FlxTween.tween(bindingBlack, {alpha: 0.6}, 0.35, {ease: FlxEase.linear});
	add(bindingBlack);
	bindingBlack.cameras = [theWhiteningHasOccured];

	bindingText = new FlxText(0, 160, 0, "Rebinding " + theThingThatllChangeHaha);
	bindingText.fieldWidth = FlxG.width;
	add(bindingText);
	bindingText.cameras = [theWhiteningHasOccured];
	bindingText.setFormat(Paths.font("ARIAL.ttf"), 26, FlxColor.WHITE, "center");
					
	bindingText2 = new FlxText(0, 340, 0, "Press ESC to Cancel");
	bindingText2.fieldWidth = FlxG.width;
	add(bindingText2);
	bindingText2.setFormat(Paths.font("ARIAL.ttf"), 26, FlxColor.WHITE, "center");
	bindingText2.cameras = [theWhiteningHasOccured];
}
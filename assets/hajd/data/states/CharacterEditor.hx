// fix for 4:3 character editor
// i cant believe cne devs cant fucking spell properties

function postCreate() {
    for (thing in [
        characterPropertiresWindow,
        characterPropertiresWindow.titleSpr,
        characterPropertiresWindow.characterInfo,
        characterPropertiresWindow.newButton,
        characterPropertiresWindow.editButton,
        characterAnimsWindow,
        characterAnimsWindow.titleSpr
    ]) thing.x -= 250;

    // fire bg
	characterBG.frames = Paths.getFrames('menu/rolbox/sm/fire');
	characterBG.animation.addByPrefix('i','fire',24);
	characterBG.animation.play('i');
    characterBG.scrollFactor.set(0);
    characterBG.scale.set(FlxG.width/characterBG.width, FlxG.height/characterBG.height);
    characterBG.screenCenter();
}
// fire bg for no reason
// i have to copy this for every state individually bro fukk
function postCreate() {
    charterBG.visible = false;
    fire = new FunkinSprite();
	fire.frames = Paths.getFrames('menu/rolbox/sm/fire');
	fire.animation.addByPrefix('i','fire',24);
	fire.animation.play('i');
    fire.scrollFactor.set(0);
    fire.zoomFactor = 0;
    fire.alpha = 0.3;
    graphicSize(fire, 0, FlxG.height);
	insert(members.indexOf(charterBG)+1, fire);
}
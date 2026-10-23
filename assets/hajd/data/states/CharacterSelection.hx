// fire bg for no reason
// i have to copy this for every state individually bro fukk
function postCreate() {
    bg.visible = false;
    fire = new FunkinSprite();
	fire.frames = Paths.getFrames('menu/rolbox/sm/fire');
	fire.animation.addByPrefix('i','fire',24);
	fire.animation.play('i');
    fire.scrollFactor.set(0);
    fire.zoomFactor = 0;
    graphicSize(fire, 0, FlxG.height);
	insert(members.indexOf(bg)+1, fire);
}
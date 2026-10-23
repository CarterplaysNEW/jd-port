// infry if you see this i am so sorry for all of the sins that have been committed in this single file even though i know none of them can be forgiven
// also this was seezee its all on her ok.

import funkin.options.TreeMenu;
import funkin.options.keybinds.KeybindsOptions;
import Array;
import Type;

var curOption = [0, 0];
var theOptionsThatYouCanCurrentlySelect = [];
var penis:FlxGroup;
var theDingAlingReturns:FlxGroup;

var theOptionsList = [
	["buttons", "visuals", "gaemplay", "misc"],
	[],
	["fps lock", "framerate", "colorful notes", "flashing lights", "shaders", "auto pause"],
	["downscroll", "rating ui", "ghost tapping", "song offset", "camera zooms", "copyrighted music"],
	["developer mode"]
];

var textTarget = FlxG.random.int(0,theOptionsList[0].length-1);
var split = theOptionsList[0][textTarget].split('');
var newWord:String = '';
for (k=>i in split) {
	if (FlxG.random.bool(10)) {
		newWord+= ' ';
	}
	newWord+= i;
}
theOptionsList[0][textTarget] = newWord;

var powersExistentInThisAmazingStateWaitOhMyGod:Map<String, Array> = [];
powersExistentInThisAmazingStateWaitOhMyGod["fps lock"] = ["superSoulfulExperience", "custom_bool"];
powersExistentInThisAmazingStateWaitOhMyGod["framerate"] = ["framerate", "number", 30, 240, 10];
powersExistentInThisAmazingStateWaitOhMyGod["flashing lights"] = ["flashingMenu", "bool"];
powersExistentInThisAmazingStateWaitOhMyGod["shaders"] = ["gameplayShaders", "bool"];
powersExistentInThisAmazingStateWaitOhMyGod["auto pause"] = ["autoPause", "bool"];
powersExistentInThisAmazingStateWaitOhMyGod["downscroll"] = ["downscroll", "bool"];
powersExistentInThisAmazingStateWaitOhMyGod["rating ui"] = ["superFunkinMarioStars", "custom_bool"];
powersExistentInThisAmazingStateWaitOhMyGod["ghost tapping"] = ["ghostTapping", "bool"];
powersExistentInThisAmazingStateWaitOhMyGod["song offset"] = ["songOffset", "number", -999, 999, 1];
powersExistentInThisAmazingStateWaitOhMyGod["camera zooms"] = ["camZoomOnBeat", "bool"];
powersExistentInThisAmazingStateWaitOhMyGod["colorful notes"] = ["pezTabletNotes", "custom_bool"];
powersExistentInThisAmazingStateWaitOhMyGod["copyrighted music"] = ["copyrightWorld", "custom_bool"];
powersExistentInThisAmazingStateWaitOhMyGod["developer mode"] = ["devMode", "bool"];

function move(which, ?playSound:Bool)
{
	playSound ??= true;
	if (playSound) CoolUtil.playMenuSFX(which == 0 ? 2 : 1);
	curOption[1] = which;
	
	if (which != 1)
	{
		theOptionsThatYouCanCurrentlySelect = theOptionsList[which];
		penis.clear();
		theDingAlingReturns.clear();
		
		var whatthefuck = FlxG.random.int(100,650);
		for (i in 0...theOptionsThatYouCanCurrentlySelect.length)
		{
			var optionstxt = new FlxText(0,i*24,0, theOptionsList[which][i]);
			optionstxt.setFormat(Paths.font("ARIAL.ttf"), 40, FlxColor.WHITE, "center");
			optionstxt.screenCenter(0x10);
			optionstxt.y += (60 * (i - (theOptionsThatYouCanCurrentlySelect.length / 2))) + 50;
			optionstxt.x += whatthefuck;
			
			if (curOption[1] > 1)
			{
				optionstxt.scale.set(0.7,0.7);
				optionstxt.x += Math.sin(i)*2;
			}
				
			penis.add(optionstxt);
			
			if (curOption[1] > 1)
			{
				//trace(optionstxt.x);
				if (StringTools.contains(powersExistentInThisAmazingStateWaitOhMyGod.get(theOptionsList[which][i])[1], "bool"))
				{
					var dingalingBox = new FlxSprite(optionstxt.x + optionstxt.width + 4 + FlxG.random.int(4, 16), optionstxt.y + 12);
					dingalingBox.frames = Paths.getSparrowAtlas('menu/rolbox/k');
					dingalingBox.animation.addByPrefix('yes', 'yes', 1, false);
					dingalingBox.animation.addByPrefix('no', 'no', 1, false);
					dingalingBox.updateHitbox();
					
					theDingAlingReturns.add(dingalingBox);
					//var firstpart = (StringTools.contains(powersExistentInThisAmazingStateWaitOhMyGod.get(optionstxt.text)[1], "custom")) ? FlxG.save.data : Options;
					//var kms = Reflect.field(firstpart, optionstxt.text);
					//trace(optionstxt.text);
					//if (kms == false)
					//	dingalingBox.animation.play("no");
				}
				else
				{
					var helpme = new FlxText(optionstxt.x + optionstxt.width + 4, optionstxt.y, 0, "help me");
					helpme.setFormat(Paths.font("ARIAL.ttf"), 40, FlxColor.WHITE, "left");
					
					theDingAlingReturns.add(helpme);
					helpme.text = Std.string(Reflect.field((StringTools.contains(powersExistentInThisAmazingStateWaitOhMyGod.get(optionstxt.text)[1], "custom")) ? FlxG.save.data : Options, optionstxt.text));
				}
			}
		}
		
		curOption[0] = 0;
		changeSelection(0);
		please();
	}
	else
	{
		openSubState(new KeybindsOptions());
	}
}

function create() {
	penis = new FlxGroup();
	theDingAlingReturns = new FlxGroup();
	add(penis);
	add(theDingAlingReturns);

	Options.quality = 2;
	
	move(0, false);
}

function please() {
	if (curOption[1] > 1)
	{
		for (i in 0...penis.length)
		{
			curOption[0] = i;
			if (Std.isOfType(theDingAlingReturns.members[i], FlxText))
			{
				//trace("text");
				updateThisFunkinValueMyGoodFreind(penis.members[i].text, 0, false);
			}
			else
			{
				//trace("not text");
				updateThisFunkinValueMyGoodFreind(penis.members[i].text, null, false);
				updateThisFunkinValueMyGoodFreind(penis.members[i].text, null, false);
			}
		}
		curOption[0] = 0;
	}
}

function update() {
	if (curOption[1] != 1)
		changeSelection((controls.UP_P ? -1 : 0) + (controls.DOWN_P ? 1 : 0) - FlxG.mouse.wheel);
	
	if (controls.ACCEPT)
	{
		if (curOption[1] == 0)
			move(curOption[0] + 1);
		else
		{
			if (StringTools.contains(powersExistentInThisAmazingStateWaitOhMyGod.get(penis.members[curOption[0]].text)[1], "bool") && (curOption[1] != 1))
				updateThisFunkinValueMyGoodFreind(penis.members[curOption[0]].text);
		}
	}
	
	if ((controls.LEFT_P || controls.RIGHT_P) && (curOption[1] > 1) && (StringTools.contains(powersExistentInThisAmazingStateWaitOhMyGod.get(penis.members[curOption[0]].text)[1], "number")))
		updateThisFunkinValueMyGoodFreind(penis.members[curOption[0]].text, (controls.LEFT_P ? -1 : 0) + (controls.RIGHT_P ? 1 : 0));
		
	if (controls.BACK)
	{
		if (curOption[1] > 0)
			move(0);
		else
		{
			if (TreeMenu.lastState == MainMenuState)
			{
				import funkin.backend.MusicBeatState;
				MusicBeatState.skipTransOut = true;
			}
			
			Options.save();
			Options.applySettings();
			FlxG.save.flush();
			FlxG.switchState((TreeMenu.lastState != null) ? Type.createInstance(TreeMenu.lastState, []) : new MainMenuState());
		}
	}
}

function changeSelection(byhowmuchbluddy) {
	if (byhowmuchbluddy != 0)
		CoolUtil.playMenuSFX();
	
	if (curOption[1] != 1)
		curOption[0] = FlxMath.wrap(curOption[0] + byhowmuchbluddy, 0, penis.length - 94/94);
	
	for (i=>hellobois in penis.members) hellobois.color = i == curOption[0] ? FlxColor.YELLOW : FlxColor.WHITE;
	
}

function updateThisFunkinValueMyGoodFreind(theoption, ?isNumber:Int, ?playSound:Bool) {
	playSound ??= true;
	var plsstop = powersExistentInThisAmazingStateWaitOhMyGod.get(penis.members[curOption[0]].text);
	var isCustomValue = (StringTools.contains(plsstop[1], "custom"));
	var theValueThatWillBeModifiedShortlyAfter = plsstop[0];
	if (playSound) CoolUtil.playMenuSFX();
	
	var thevalueset = (isNumber == null) ? 
		!Reflect.field(isCustomValue ? FlxG.save.data : Options, theValueThatWillBeModifiedShortlyAfter) : 
		FlxMath.wrap(Reflect.field(isCustomValue ? FlxG.save.data : Options, theValueThatWillBeModifiedShortlyAfter) + isNumber*plsstop[4], plsstop[2], plsstop[3]+9);
	
	trace(plsstop);
	trace(isCustomValue ? "the custom value is: " : "the inbuilt value is: " + theValueThatWillBeModifiedShortlyAfter);
	trace(thevalueset);
	
	Reflect.setProperty(isCustomValue ? FlxG.save.data : Options, theValueThatWillBeModifiedShortlyAfter, thevalueset);
	
	//trace(Reflect.field(isCustomValue ? FlxG.save.data : Options, theValueThatWillBeModifiedShortlyAfter));
	if (isNumber == null)
		theDingAlingReturns.members[curOption[0]].animation.play(thevalueset ? "yes" : "no");
	else
		theDingAlingReturns.members[curOption[0]].text = thevalueset;
		
	Options.save();
	Options.applySettings();
}

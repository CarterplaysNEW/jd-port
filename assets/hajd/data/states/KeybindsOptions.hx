import flixel.FlxCamera.FlxCameraFollowStyle;

static var theThingThatllChangeHaha = "Left";
var curTarget = 0;
var fakeText:FlxGroup;
var bind1Text:FlxGroup;
var bind2Text:FlxGroup;
var thecamera:FlxCamera;
var pastSelection = -1;
var mynew = 0;

function postCreate()
{
	settingCam.visible = false;

	FlxG.state.persistentDraw = false;
	
	fakeText = new FlxGroup();
	bind1Text = new FlxGroup();
	bind2Text = new FlxGroup();
	
	thecamera = new FlxCamera();
	FlxG.cameras.add(thecamera, false);
	
	coloredBG.color = bg.color = 0xFF000000;
	
	for (i in alphabets.members)
	{
		var sometextes = new FlxText(100,0,0,"help me");
		sometextes.setFormat(Paths.font("ARIAL.ttf"), 26, FlxColor.WHITE, "center");
		fakeText.add(sometextes);

		sometextes.text = i.title.text.toLowerCase();
		sometextes.y = i.title.y;
		
		var help = new FlxText(500,0,0,"[help]");
		help.setFormat(Paths.font("ARIAL.ttf"), 26, FlxColor.WHITE, "center");
		bind1Text.add(help);
		
		var me = new FlxText(820,0,0,"[help]");
		me.setFormat(Paths.font("ARIAL.ttf"), 26, FlxColor.WHITE, "center");
		bind2Text.add(me);
		
		help.y = me.y = i.title.y;
		fakeText.cameras = help.cameras = me.cameras = [thecamera];
	}
	
	var k:Int = 0;
	var offsetY = 0;
	for(category in categories) {
		var title = new FlxText(0, 100 + offsetY, 0, category.name.toLowerCase());
		title.setFormat(Paths.font("ARIAL.ttf"), 24, FlxColor.RED, "center");
		title.screenCenter(0x01);
		title.scale.set(4, 2);
		add(title);
		title.cameras = [thecamera];
		
		k++;
		if (k > 0)
			offsetY += 94 * category.settings.length;
		if (["volume", "engine"].contains(title.text)) offsetY += 94;
	}
	
	add(fakeText);
	add(bind1Text);
	add(bind2Text);
}

function postUpdate(elapsed)
{
	mynew += elapsed;
	thecamera.follow(camFollow, FlxCameraFollowStyle.LOCKON, 0.94);
	thecamera.snapToTarget();

	if (pastSelection != curSelected)
	{
		pastSelection = curSelected;
		for (i in 0...bind1Text.length)
		{
			fakeText.members[i].color = bind1Text.members[i].color = bind2Text.members[i].color = FlxColor.WHITE;
		}
		
		fakeText.members[curSelected].color = bind1Text.members[curSelected].color = bind2Text.members[curSelected].color = FlxColor.YELLOW;
	}
	
	for (i in 0...bind1Text.length)
	{
		bind1Text.members[i].text = alphabets.members[i].bind1.text.toLowerCase();
		bind1Text.members[i].alpha = alphabets.members[i].bind1.alpha;
	}
	
	for (i in 0...bind2Text.length)
	{
		bind2Text.members[i].text = alphabets.members[i].bind2.text.toLowerCase();
		bind2Text.members[i].alpha = alphabets.members[i].bind2.alpha;
	}
	
	curTarget = p2Selected ? bind2Text : bind1Text;
	curTarget.members[curSelected].alpha = Math.abs(Math.sin(mynew*4));
	theThingThatllChangeHaha = fakeText.members[curSelected].text;
}

function destroy()
{
	FlxG.cameras.remove(thecamera);
}
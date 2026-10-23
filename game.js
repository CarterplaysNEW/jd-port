// FNF: Hello John Doe - browser port (core: menu + "John Doe"). Reads original Psych Engine assets.
const cv=document.getElementById('c'),W=960,H=720,A='assets/';let X=cv.getContext('2d');const tc=document.createElement('canvas'),tx=tc.getContext('2d');
cv.width=W;cv.height=H;
const fit=()=>{const s=Math.min(innerWidth/W,innerHeight/H);cv.style.width=W*s+'px';cv.style.height=H*s+'px'};onresize=fit;fit();
const L=s=>new Promise((r,j)=>{LP.t++;const i=new Image();i.onload=()=>{LP.n++;r(i)};i.onerror=()=>j(Error('Missing file: '+A+s));i.src=A+s});
const J=p=>{LP.t++;return fetch(A+p).then(r=>{if(!r.ok)throw Error('Missing file: '+A+p);return r.json()}).then(v=>{LP.n++;return v})};
const LL=async o=>{const k=Object.keys(o),v=await Promise.all(k.map(x=>o[x]));return Object.fromEntries(k.map((x,i)=>[x,v[i]]))};
const snd=(p,loop,v=1)=>{const a=new Audio(A+p);a.preload='auto';a.loop=!!loop;a.volume=v;return a};
const LP={n:0,t:0,msg:''};
const CUR=new Image();CUR.src=A+'images/mousemode.png';const MS={x:-99,y:-99,on:0,show:0};
const rx=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
async function atlas(p){
 const [im,t]=await Promise.all([L(p+'.png'),fetch(A+p+'.xml').then(r=>{if(!r.ok)throw Error('Missing file: '+A+p+'.xml');return r.text()})]);
 const f=[];for(const s of new DOMParser().parseFromString(t,'text/xml').getElementsByTagName('SubTexture')){const g=n=>+s.getAttribute(n)||0;
  f.push({n:s.getAttribute('name'),x:g('x'),y:g('y'),w:g('width'),h:g('height'),fx:g('frameX'),fy:g('frameY'),fw:g('frameWidth')||g('width'),fh:g('frameHeight')||g('height'),r:s.getAttribute('rotated')==='true'})}
 return{im,f,get(p){const r=new RegExp('^'+rx(p)+'\\d*$');return f.filter(q=>r.test(q.n)).sort((a,b)=>a.n<b.n?-1:1)},
 pre(p){const r=this.get(p);if(r.length)return r;const n=s=>{const m=s.match(/(\d+)$/);return m?+m[1]:0};return f.filter(q=>q.n.startsWith(p)).sort((a,b)=>n(a.n)-n(b.n)||(a.n<b.n?-1:1))}}}
function dr(a,f,x,y,w,h){if(f.r){X.save();X.translate(x,y+h);X.rotate(-Math.PI/2);X.drawImage(a.im,f.x,f.y,f.w,f.h,0,0,h,w);X.restore()}else X.drawImage(a.im,f.x,f.y,f.w,f.h,x,y,w,h)}
const vw=f=>f.r?f.h:f.w,vh=f=>f.r?f.w:f.h;
function df(a,f,x,y,s=1,al=1){X.globalAlpha=al;dr(a,f,x-f.fx*s,y-f.fy*s,vw(f)*s,vh(f)*s);X.globalAlpha=1}
const ease={linear:t=>t,cubeInOut:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,cubeOut:t=>1-Math.pow(1-t,3),sineOut:t=>Math.sin(t*Math.PI/2),quadInOut:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};
ease.bounceInOut=t=>{const o=u=>{const n=7.5625,d=2.75;if(u<1/d)return n*u*u;if(u<2/d)return n*(u-=1.5/d)*u+.75;if(u<2.5/d)return n*(u-=2.25/d)*u+.9375;return n*(u-=2.625/d)*u+.984375};return t<.5?(1-o(1-2*t))/2:(1+o(2*t-1))/2};ease.expoOut=t=>t>=1?1:1-Math.pow(2,-10*t);Object.assign(ease,{quadIn:t=>t*t,quadOut:t=>t*(2-t),cubeIn:t=>t*t*t,sineIn:t=>1-Math.cos(t*Math.PI/2),sineInOut:t=>-(Math.cos(Math.PI*t)-1)/2,expoIn:t=>t<=0?0:Math.pow(2,10*(t-1)),quartIn:t=>t*t*t*t,quartOut:t=>1-Math.pow(1-t,4),circOut:t=>Math.sqrt(1-(t-1)*(t-1)),circInOut:t=>t<.5?(1-Math.sqrt(1-4*t*t))/2:(Math.sqrt(1-Math.pow(-2*t+2,2))+1)/2,bounceOut:t=>{const n=7.5625,d=2.75;if(t<1/d)return n*t*t;if(t<2/d)return n*(t-=1.5/d)*t+.75;if(t<2.5/d)return n*(t-=2.25/d)*t+.9375;return n*(t-=2.625/d)*t+.984375}});
let T=[];const tw=(o,k,to,d,e)=>{if(!(d>0)){o[k]=to;return}T.push({o,k,a:o[k],b:to,d,e:ease[e]||ease.linear,t:0})};
const tick=dt=>{T=T.filter(q=>{q.t+=dt;const p=Math.min(1,q.t/q.d);q.o[k_(q)]=q.a+(q.b-q.a)*q.e(p);return p<1})};const k_=q=>q.k;
const rnd=a=>{const s=Math.sin(a*12.9898)*43758.5453;return s-Math.floor(s)};
const keys={},pressed=[],held={};let KM={};
let S='start',err='',M={},g=null;

class Ch{
 constructor(d,at,x,y){this.d=d;this.a=at;this.x=x+d.position[0];this.y=y+d.position[1];this.an={};
  for(const n of d.animations){let fr=at.pre(n.name);if(n.indices&&n.indices.length)fr=n.indices.map(i=>fr[i]).filter(Boolean);if(fr.length)this.an[n.anim]={fr,fps:n.fps||24,loop:n.loop,o:n.offsets}}
  if(!this.an.idle){const k=Object.keys(this.an)[0];if(k)this.an.idle=this.an[k]}
  this.play('idle');this.sing=0;this.special=0;this.al=1;this.sc=1;this.flip=0;this.ang=0;this.burn=0;this.vis=true}
 spec(n){this.play(n,0);this.special=1}
 play(n,sing){const a=this.an[n];if(!a||!a.fr.length)return;this.special=0;this.cur=a;this.name=n;this.t=0;this.hold=0;this.sing=!!sing}
 mid(){const f=this.a.f[0],s=this.d.scale||1;return[this.x+f.fw*s/2,this.y+f.fh*s/2]}
 upd(dt,stepSec){this.t+=dt;if(this.special){const a=this.cur;if(!a.loop&&this.t*a.fps>=a.fr.length||a.loop&&!this.ls&&this.t>.6){this.special=0;this.play('idle')}}if(this.sing){this.hold+=dt;if(this.hold>=this.d.sing_duration*stepSec*1.1){this.play('idle')}}}
 draw(t){if(!this.cur||this.vis===false)return;if(this.ang){const a=this.cur,i=Math.floor(this.t*a.fps),f=a.fr[a.loop?i%a.fr.length:Math.min(i,a.fr.length-1)],cx=this.x-a.o[0]+f.fw/2,cy=this.y-a.o[1]+f.fh/2;X.save();X.translate(cx,cy);X.rotate(this.ang*Math.PI/180);X.translate(-cx,-cy);this.draw0(t);X.restore()}else this.draw0(t)}
 draw0(t){const a=this.cur,i=Math.floor(this.t*a.fps),f=a.fr[a.loop?i%a.fr.length:Math.min(i,a.fr.length-1)],s=this.d.scale||1,x=this.x-a.o[0],y=this.y-a.o[1];
  const S=s*(this.sc||1),x0=x+f.fw*(s-S)/2,y0=y+f.fh*(s-S)/2;
  if(this.burn>0&&burnDraw(this,f,S,x0,y0))return;
  if(!(t>0)){if(this.flip){X.save();X.translate(x0+f.fw*S,y0);X.scale(-1,1);df(this.a,f,0,0,S,this.al);X.restore()}else df(this.a,f,x0,y0,S,this.al);return}
  tc.width=Math.ceil(f.fw*s);tc.height=Math.ceil(f.fh*s);const M0=X;X=tx;df(this.a,f,0,0,s);tx.globalCompositeOperation='source-atop';tx.fillStyle='rgba(0,0,0,'+t+')';tx.fillRect(0,0,tc.width,tc.height);X=M0;X.globalAlpha=this.al;X.drawImage(tc,x,y);X.globalAlpha=1}}

/* ---------- MENU ---------- */
async function initMenu(){
 M.fire=await atlas('menu/fire');M.logo=await atlas('menu/logo');
 M.ff=M.fire.get('fire');M.la=M.logo.get('appear');M.l0=M.la[M.la.length-1];
 M.items=['jams','members','settings'];M.sel=0;M.t=0;M.msg='';
 M.music=snd('music/freakyMenu.ogg',1,.8);M.music.play().catch(()=>{});S='menu'}
function menu(dt){
 M.t+=dt;const f=M.ff[Math.floor(M.t*24)%M.ff.length],s=H/f.fh;
 X.fillStyle='#000';X.fillRect(0,0,W,H);
 const sy=Math.min(1,M.t/2);dr(M.fire,f,-f.fx*s,H-f.fh*s*sy+25-f.fy*s*sy,vw(f)*s,vh(f)*s*sy);
 const lf=M.t<2?null:M.la[Math.min(M.la.length-1,Math.floor((M.t-2)*24))];
 if(lf){const sc=1.25,fr=(M.t-2)*24>=M.la.length?M.l0:lf;df(M.logo,fr,W/2-fr.fw*sc/2,50+(fr.fh-fr.fh*sc)/2,sc)}
 if(M.t>3){X.font='34px MArial, Arial';X.textAlign='center';
  M.items.forEach((n,i)=>{X.fillStyle=i==M.sel?'#ff0':'#fff';X.fillText(n,W/2,390+i*70)});
  X.font='20px MArial, Arial';X.fillStyle='#fff';X.fillText(M.msg,W/2,H-30)}
 if(M.t>3)for(const[cx,cy]of clicks){const i=Math.round((cy-378)/70);if(i>=0&&i<3&&Math.abs(cx-W/2)<170){M.sel=i;pressed.push('Enter')}}
 for(const k of pressed){
  if(k=='ArrowUp'||k=='KeyW'){M.sel=(M.sel+2)%3;snd('sounds/click.ogg').play()}
  if(k=='ArrowDown'||k=='KeyS'){M.sel=(M.sel+1)%3;snd('sounds/click.ogg').play()}
  if(k=='Enter'&&M.t>3){if(M.sel==0){snd('sounds/bass.ogg').play();M.music.pause();openElev()}else if(M.sel==1){snd('sounds/click.ogg').play();openCred()}else if(M.sel==2){snd('sounds/click.ogg').play();openSet()}else M.msg='Coming soon!'}}}

/* ---------- SONG ---------- */
const DIR=['LEFT','DOWN','UP','RIGHT'],COL=['purple','blue','green','red'],STS={johndoe:{cs:.9,bf:[708,150],dad:[200,100],cb:[-130,-20],cd:[200,0],zoom:.9},devilish:{bf:[708,165],dad:[200,100],cb:[0,0],cd:[-25,25],zoom:1},'1':{bf:[708,150],dad:[200,150],cb:[-75,175],cd:[125,150],zoom:.72,cs:1},strawberry:{bf:[708,150],dad:[710,150],cb:[100,100],cd:[-300,200],zoom:1.5,cs:1,snap:1,nocz:1,xo:200},'obby-for-succ':{bf:[708,165],dad:[200,100],cb:[0,0],cd:[-25,25],zoom:1,cs:1},rockhard:{bf:[708,150],dad:[200,150],cb:[-75,175],cd:[125,150],zoom:.9,cs:1},'party-time':{bf:[708,165],dad:[200,100],cb:[0,0],cd:[-25,25],zoom:1,cs:1},iloveyou:{bf:[708,165],dad:[200,100],cb:[0,0],cd:[-25,25],zoom:1,cs:1},bloxwatch:{bf:[908,250],dad:[100,100],gf:[330,100],cb:[-100,50],cd:[0,75],zoom:.95,cs:.85},joy:{bf:[800,150],dad:[300,100],cb:[-130,-20],cd:[20,0],zoom:.9,cs:1.2},noli:{bf:[1100,200],dad:[325,460],gf:[2000,525],cb:[65,-50],cd:[0,0],zoom:.9,cs:.8},bloxpin:{bf:[708,165],dad:[300,55],cb:[-100,18],cd:[265,-80],zoom:.8,cs:.8},'bloody-mary':{bf:[1100,200],dad:[1300,200],cb:[65,0],cd:[0,0],zoom:1.3,cs:.8}};STS['bloxpin-scary']=STS.bloxpin;let ST=STS.johndoe;const NOSTAGE=i=>i=='obby-for-succ'||i=='party-time'||i=='iloveyou';const PP=n=>['rbf','rs','max','black','mirrorman','bfmay','bfhead','rbfdark','rbfscared','rbf-bighead','rbf-smallhead'].includes(n)?ST.bf:n=='sorry'||n=='guy'?ST.gf:ST.dad;const DADS={joy:'rust',noli:'noli',bloxpin:'teddy_bloxpin','bloxpin-scary':'evil_teddy_bloxpin','bloody-mary':'black1'},BFS={'bloxpin-scary':'rbfscared','bloody-mary':'bfmay'};
let XO=0;let SY=50;const sx=l=>(W-434)/2+107.3*l+XO,K=.45;
async function startSong(id){stopSfx();
 S='load';LP.n=0;LP.t=0;LP.msg='Loading...';ST=STS[id];XO=ST.xo||0;const jd=id=='johndoe';
 const[ch,ev,notes_at,logo]=await Promise.all([J('songs/'+id+'/'+id+'.json'),J('songs/'+id+'/events.json').catch(()=>null),atlas('images/noteSkins/NOTE_assets'),L('logo/'+id+'.png').catch(()=>null)]);
 const BG=jd?await Promise.all([L('images/bgs/sky.png'),L('images/bgs/floor.png'),L('images/bgs/home.png')]):id=='strawberry'?[null,null,null,await atlas('menu/fire')]:id=='joy'?[null,null,null,await atlas('menu/fire')]:id=='noli'||id=='bloody-mary'||id.startsWith('bloxpin')?[]:id=='obby-for-succ'?[]:id=='1'?[await atlas('images/1x1bg')]:await Promise.all([L('images/bgs/tree.png'),L('images/bgs/floo.png'),atlas('images/bgs/fuck_you_guest'),atlas('menu/fire')]);
 const[sky,floor,home]=BG;
 const cd={};await Promise.all((jd?['jd','jda','die','rbf']:id=='1'?['1x1','rs']:id=='strawberry'?['bob','max']:NOSTAGE(id)?['rbf']:id=='bloxwatch'?['black','bwdark','bw1','bw2','bye','sorry','rbf']:id=='rockhard'?['cheek','enemy','mirrorman','trans','rbf']:id=='joy'?['rust','jdfake','guest','bloxcox','rustbigwilly','bloxworld','1xdingaling','fakebf','rbf']:id=='noli'?['noli','guy','rbf','rbfdark']:id=='bloxpin'?['teddy_bloxpin','rbf','rbf-bighead','rbf-smallhead']:id=='bloxpin-scary'?['evil_teddy_bloxpin','rbfscared']:id=='bloody-mary'?['bfmay','black1','brother','black2','blacksmall','bfhead']:['guest','rbf']).map(async n=>{const d=await J('characters/'+(id=='joy'&&n!='rbf'?'joy_':id=='bloody-mary'?'bloody_':'')+n+'.json');cd[n]=new Ch(d,await atlas('images/'+d.image),PP(n)[0],PP(n)[1]);if(id=='joy'&&d.flip_x&&n!='rbf')cd[n].flip=1}));
 const pa=await atlas('menu/pause/im_pausing'),spl=await atlas('images/noteSplashes/noteSplashes');
 const bx=id=='bloxwatch'?{eyesA:await atlas('images/s/eyes'),bubA:await atlas('images/s/bubble'),spotImg:await L('images/s/spotlight.png')}:id=='rockhard'?{cbI:await L('images/cb.png'),gateI:await L('images/gate.png')}:id=='joy'?{jo:await LL({forest:L('images/forest.png'),ice:L('images/ice.png'),white:L('images/floorshiny.png'),computer:L('images/computer.png'),green:L('images/green.png')})}:id=='bloody-mary'?{bmI:await LL({scary:L('images/bloody/scaryworld.png'),bath:L('images/bloody/bathroom.png'),norm:L('images/bloody/normalbg.png'),evil:L('images/bloody/evilbg.png'),vig:L('images/bloody/vignette.png'),rock:L('images/bloody/rockscroll.png'),pt2:L('images/bloody/pt2.png')}),bmA:await LL({fg:atlas('images/bloody/fg'),ok:atlas('images/bloody/ok'),thing:atlas('images/bloody/thing'),bod:atlas('images/bloody/bfbod')})}:id=='noli'?{nI:await LL({outside:L('images/outside.png'),hall:L('images/hall.png'),snow:L('images/snowworld.png'),bee:L('images/bee.png')})}:id.startsWith('bloxpin')?{tb:{evil:id=='bloxpin-scary',bg:await L('images/'+(id=='bloxpin-scary'?'evilteddybg':'teddybg')+'.png'),...(id=='bloxpin'?{popA:await atlas('images/textbox'),fireA:await atlas('images/fire'),beamA:await atlas('images/beam'),expA:await atlas('images/explosion')}:{})}}:{};
 const ib=id=='iloveyou'?{txtA:await atlas('images/intro/txts'),balls:await Promise.all(['green','red','blue','yellow'].map(c=>L('images/balls/ball-'+c+'.png')))}:id=='party-time'?{errImg:await L('images/error.png')}:{};
 const song=ch.song,secs=song.notes,starts=[],notes=[];let t=0,bpm=song.bpm,bb=0;
 secs.forEach(s=>{if(s.changeBPM&&s.bpm)bpm=s.bpm;starts.push({t,bpm,must:!!s.mustHitSection,alt:!!s.altAnim&&!s.gfSection,b:bb});bb+=(s.sectionBeats||4);
  for(const n of s.sectionNotes)notes.push({t:n[0],l:n[1]%4,len:n[2]>0?n[2]:0,sk:1,sN:n[2]>0?Math.floor(n[2]/(15000/bpm)):0,sm:15000/bpm,alt:n[3]==='Alt Animation',na:n[3]==='No Animation',pl:(n[1]<4)===!!s.mustHitSection,hit:0,miss:0,done:0});
  t+=(s.sectionBeats||4)*60000/bpm});
 notes.sort((a,b)=>a.t-b.t);
 const nf=COL.map((c,i)=>({h:notes_at.get(c)[0],p:notes_at.get(c+' hold piece')[0],e:notes_at.get(c+' hold end')[0],st:notes_at.get('arrow'+DIR[i])[0],sa:notes_at.get('arrow'+DIR[i]),pr:notes_at.get(DIR[i].toLowerCase()+' press'),cf:notes_at.get(DIR[i].toLowerCase()+' confirm')}));
 const au=id=='bloxpin-scary'?'bloxpin':id,inst=snd('songs/'+au+'/inst.ogg'),voc=snd('songs/'+au+'/voices.ogg');voc.play=(p=>function(){return p.call(this).catch(()=>{})})(voc.play);
 g={song,starts,notes,nf,na:notes_at,sky,floor,home,cd,dad:DADS[id]?cd[DADS[id]]:cd.jd||cd.guest||cd['1x1']||cd.bob||cd.cheek||cd.bwdark||cd.rbf,bf:BFS[id]?cd[BFS[id]]:cd.black||cd.rbf||cd.rs||cd.max,inst,voc,evs:mergeEv(song.events,ev&&ev.song&&ev.song.events),ei:0,si:0,pos:-1500,go:0,
  spd:song.speed,zoom:ST.zoom,cx:640,cy:360,home_a:0,floor_a:1,glitch:0,force:null,hp:1,score:0,miss:0,combo:0,pop:null,pp:{},ct:[9,9,9,9],tm:0,dUntil:0};Object.assign(g,{xr:1,hudA:id=='johndoe'?0:1,camA:id=='johndoe'?0:1,camV:1,wfl:0,hgm:1,bfHud:0,spl,sp:[],ba:{n:'dad',t:0},mt:20,mshow:0,hs:[],hidden:0,cz:0,timers:[],flash:0,hg:0,cover:id=='strawberry'?1:0,i0:0,pa,paused:0,dead:0,psel:0,dz:ST.zoom,lsi:-1,lb:-1,recam:1,id,jd,logo,fire:BG[3],crowdY:1200,bt:1200,fire_a:0,fa:0,ha:(id=='johndoe'||id=='devilish')?0:1,wh:id=='devilish'?1:0,tint:id=='devilish'?1:0,lg:[],pos:jd?-1500:-600,vids:jd?[]:(id=='1'?['1intro','1outro','1train','1pizza','1oof','1burger']:id=='strawberry'?['strawberryintro']:id=='obby-for-succ'?['obbyvideo']:id=='party-time'?['partytime']:id=='iloveyou'?['ilygreen','ilyred','ilyblue','ilyyellow']:id=='bloxwatch'?['bloxwatchintro']:id=='joy'?['joyintro','poop']:id=='bloody-mary'?['bloodyintro','bloodyawake','bloodywalk']:['intro','monster']).map(n=>{const v=document.createElement('video');v.src=A+'videos/'+n+'.mp4';v.muted=true;v.playsInline=true;v.preload='auto';return v})});g.hs=id=='1'?g.vids.slice(2):id=='obby-for-succ'?g.vids.slice():[];if(id=='strawberry'){const v0=g.vids[0];v0.onended=v0.onerror=()=>{g.cover=0}}
 if(id=='iloveyou')Object.assign(g,ib,{hold:1,cover:1,ily:{ph:0,t:0,init:0,txt:'pick',music:null}});
 if(id=='party-time')Object.assign(g,ib,{cover:1,end2:0});
 if(id=='rockhard')Object.assign(g,bx,{hudw:0,rip:0,ript:0,ripr:0,cbOn:1,gateOn:0,run:{on:0,init:0,vx:0,base:0,w:0},sev:[[64881,()=>{g.bf.vis=false}],[78095,()=>{g.cbOn=0;g.gateOn=1}]]});
 if(id=='joy')Object.assign(g,bx,{jfa:1,jia:0,jwa:0,jca:0,jga:0});
 if(id=='bloody-mary'){Object.assign(g,bx,{camA:0,bm:{scary:1,bath:1,norm:0,evil:0,run:0,fg:0,ok:0,thing:0,bod:0,pt2:0}});g.hs=g.vids.slice()}
 if(id=='noli'){Object.assign(g,bx,{gf:cd.guy,camA:0,hudA:0,nl:{outside:1,hall:0,snow:0,bee:0},ptl:[],emf:.7,emt:0});cd.guy.ls=cd.noli.ls=1}
 if(id.startsWith('bloxpin')){Object.assign(g,bx,{rate:id=='bloxpin-scary'?.8:1,freeze:0,sfx:[]});const Q=g.tb;Object.assign(Q,{ev:15,pop:{an:'',t:0,al:0,gen:0},fire:{vis:0,an:'start',t:0},beam:{vis:0,t:0},exp:{vis:0,t:0,x:0,y:0},baseX:g.bf.x,baseY:g.bf.y,disco:0,dc:null,lb:-1,fl:null,fg:0,pc:-1});
  if(!Q.evil){Q.big=cd['rbf-bighead'];Q.small=cd['rbf-smallhead'];Q.big.vis=Q.small.vis=false}
  else for(const a of[inst,voc]){a.playbackRate=.8;a.preservesPitch=a.mozPreservesPitch=a.webkitPreservesPitch=false}}
 if(id=='bloxwatch')Object.assign(g,bx,{gf:cd.sorry,eyes:{al:0,an:'i',t:0},bub:{al:0,an:'i',t:0,x:ST.bf[0]-260,y:ST.bf[1]+300},spot:{x:ST.bf[0]-110,y:ST.bf[1]-80,vis:0},healthd:0,bfHud:0,cover:1});
 if(jd){const sc=document.createElement('canvas');sc.width=sky.width;sc.height=sky.height;const c=sc.getContext('2d');c.drawImage(sky,0,0);c.globalCompositeOperation='difference';c.fillStyle='#fff';c.fillRect(0,0,sc.width,sc.height);c.globalCompositeOperation='destination-in';c.drawImage(sky,0,0);g.skyInv=sc;
 try{const ff=new FontFace('vcr','url('+A+'fonts/vcr.ttf)');await ff.load();document.fonts.add(ff)}catch(e){}
 g.code=mkCode();g.code_a=0;g.code_v=0;g.va=1;
 const v=document.createElement('video');v.src=A+'videos/oh.mp4';v.playsInline=true;v.preload='auto';LP.msg='Loading video...';await Promise.race([new Promise(r=>{if(v.readyState>=3)return r();v.addEventListener('canplaythrough',r,{once:true});v.addEventListener('error',r,{once:true})}),new Promise(r=>setTimeout(r,6000))]);g.vid=v;v.onended=v.onerror=()=>{g.vid=null};v.play().catch(()=>{g.vid=null})}
 LP.msg='Loading music...';await Promise.race([Promise.all([inst,voc].map(a=>new Promise(r=>{if(a.readyState>=3)return r();a.addEventListener('canplaythrough',r,{once:true});a.addEventListener('error',r,{once:true})}))),new Promise(r=>setTimeout(r,25000))]);
 LP.msg='Loading videos...';await Promise.race([Promise.all(g.vids.map(v=>new Promise(r=>{if(v.readyState>=3)return r();v.addEventListener('canplaythrough',r,{once:true});v.addEventListener('error',r,{once:true})}))),new Promise(r=>setTimeout(r,4000))]);
 g.cx=900;g.cy=300;if(id=='devilish'){const m=g.bf.mid(),c=g.bf.d.camera_position;g.cx=m[0]-100-c[0]+ST.cb[0];g.cy=m[1]-200+c[1]+ST.cb[1]}S='play';
 inst.onended=()=>endSong(1)}
function vplay(v){v.__e=0;v.__c=0;try{v.currentTime=0}catch(e){}v.play().catch(()=>{})}
function vsync(G,dt){for(const v of G.vids){if(v.paused||v.ended||v.__e==null)continue;v.__e+=dt*(G.xr||1);if(G.xr&&v.playbackRate!==G.xr)v.playbackRate=Math.min(4,Math.max(.25,G.xr));v.__c-=dt;if(v.__c<=0&&v.videoWidth&&Math.abs(v.currentTime-v.__e)>.25&&v.__e<(v.duration||1e9)-.3){v.__c=.5;try{v.currentTime=v.__e}catch(e){}}}}
function stopSfx(){if(g&&g.sfx)g.sfx.forEach(a=>{try{a.pause()}catch(e){}})}
function endSong(fin){if(S!='play')return;stopSfx();if(fin&&g.id=='party-time'&&!g.skipHook){g.end2=1;g.endT=0;g.cover=1;g.vids.forEach(v=>v.pause());return}if(g.ily&&g.ily.music)g.ily.music.pause();g.inst.pause();g.voc.pause();if(g.mus)g.mus.pause();if(g.vid)g.vid.pause();g.vids.forEach(v=>v.pause());T=[];try{const k='jdb_'+g.id;if(g.score>(+localStorage[k]||0))localStorage[k]=g.score;if(fin)localStorage['jdc_'+g.id]=Math.max(+localStorage['jdc_'+g.id]||0,g.miss?1:2)}catch(e){}openElev()}
function mergeEv(a,b){const seen=new Set(),out=[];for(const src of[a||[],b||[]])for(const e of src)for(const x of e[1]){const k=e[0]+'|'+x.join('|');if(!seen.has(k)){seen.add(k);out.push([e[0],[x]])}}return out.sort((p,q)=>p[0]-q[0])}
function fire(n,a,b){
 if(g.bm&&bmEv(g,n))return;
 if(n=='Change Scroll Speed')tw(g,'spd',g.song.speed*parseFloat(a||1),parseFloat(b||0));
 else if(n=='awesomeZoom'){const p=(a||'').split(','),z=parseFloat(p[0])||1,d=isNaN(parseFloat(p[1]))?.5:parseFloat(p[1]);g.cz=0;g.dz=g.zoom;T=T.filter(q=>!(q.o===g&&(q.k=='zoom'||q.k=='dz')));tw(g,'zoom',z,d,b);tw(g,'dz',z,d,b)}
 else if(n=='Change Character'){const c=g.cd[b],ty=(a||'').toLowerCase().trim(),isD=ty=='dad'||ty=='opponent'||ty=='1',isG=(ty=='gf'||ty=='girlfriend'||ty=='2')&&g.gf;if(c){c.al=(isG?g.gf:isD?g.dad:g.bf).al;c.play('idle');if(isG)g.gf=c;else if(isD)g.dad=c;else g.bf=c;g.recam=1}}
 else if(n=='Play Animation'){const la=(a||'').toLowerCase(),lb=(b||'').toLowerCase(),t=(la=='gf'||lb=='gf')&&g.gf?g.gf:(la=='dad'||lb=='dad'?g.dad:g.bf);t.spec(lb=='dad'||lb=='bf'||lb=='gf'?a:b)}
 else if(n=='Hey!'){g.bf.spec('hey')}
 else if(n=='Camera Follow Pos'&&a!=='')g.force=[+a,+b];
 else if(n=='Camera Follow Pos'){g.force=null;g.recam=1}
 else if(n=='logo')g.lg.push({t:-(parseFloat(b)||0),tm:parseFloat(a)||2.1});
 else if(n=='fire')tw(g,'fire_a',parseFloat(a),parseFloat(b)||0);
 else if(n=='boo'){g.bt=g.bt==600?1200:600;tw(g,'crowdY',g.bt,2,'bounceInOut')}
 else if(n=='infryzoom'){T=T.filter(q=>!(q.o===g&&q.k=='zoom'));g.dz=parseFloat(a);tw(g,'zoom',parseFloat(a),parseFloat(b)||0,'cubeOut')}
 else if(n=='intro'&&g.vids[0])vplay(g.vids[0]);
 else if(n=='playawesomevid'){const v=g.vids[g.id=='devilish'?1:0];if(v)v.play().catch(()=>{})}
 else if(n=='outro'||n=='train'||n=='pizza'||n=='oof'||n=='burger'){const v=g.vids[{outro:1,train:2,pizza:3,oof:4,burger:5}[n]];if(v){v.play().catch(()=>{});g.mshow=0;g.mt=10+Math.random()*10}}
 else if(n=='black')g.hidden=1;
 else if(n=='evil'){
  if(a=='turn evil'){tw(g.bf,'al',0,1.5,'quadInOut');g.hgm=.7;g.timers.push({t:1.5,fn:()=>{g.bfHud=1}});tw(g.spot,'x',g.spot.x+700,3.2,'quadInOut');fire('Change Character','dad','bw2');g.dad.spec('ok');
   g.timers.push({t:2.2,fn:()=>{g.eyes.al=1;g.eyes.an='h';g.eyes.t=0;tw(g.eyes,'al',0,1.4,'cubeOut');g.timers.push({t:1.4,fn:()=>{g.eyes.an='i';g.eyes.t=0}});g.timers.push({t:2.4,fn:()=>tw(g.eyes,'al',1,.7,'cubeOut')})}})}
  else if(a=='k'){g.cover=0;g.flash=1;tw(g,'flash',0,1)}
  else if(a=='hello')g.spot.vis=1;else if(a=='bye')g.spot.vis=0;else if(a=='well')g.hg=1;else if(a=='d')g.healthd=1;
  else if(a=='outro'){tw(g.eyes,'al',0,1,'quadIn');g.healthd=1}
  else if(a=='bfk'){g.bub.an='h';g.bub.t=0;tw(g.bub,'al',1,1,'cubeOut');g.timers.push({t:1,fn:()=>{g.bub.an='i';tw(g.bf,'al',1,.4,'quadInOut')}});g.bf.x=710;g.bf.y-=65;g.bub.y-=65}
  if(b=='comeback'){g.hg=0;g.wfl=1;tw(g,'wfl',0,2.4)}}
 else if(n=='Fade Screen'){g.fa=0;tw(g,'fa',parseFloat(b)||0,parseFloat(a)||0)}
 else if(n===''&&a=='shader'){tw(g,'hudw',1,1);g.rip=1;g.ript=0;g.ripr=0;tw(g,'ripr',1,.1);g.timers.push({t:1,fn:()=>{g.rip=0}})}
 else if(n===''&&a=='itburns'){T=T.filter(q=>!(q.o===g&&q.k=='hudw'));g.hudw=0;g.bf.vis=true}
 else if(n===''&&a=='penis'){g.run.base=g.dad.y;runTwo(g);g.run.init=1}
 else if(n===''&&a=='p'){tw(g,'wh',0,.6);tw(g,'ha',1,.6);tw(g,'tint',0,.6)}
 else if(n=='Add Camera Zoom'){if(cfg.cz)g.zoom+=parseFloat(a)||.015}
 else if(n===''&&a=='disco'&&g.tb){g.tb.disco=!g.tb.disco;if(!g.tb.disco)g.tb.dc=null}
 else if(n===''&&a=='emit'&&g.nl)g.emf=parseFloat(b)||.1;
 else if(g.nl&&(n=='hall'||n=='snowpoo'||n=='beepee'))tw(g.nl,n=='hall'?'hall':n=='snowpoo'?'snow':'bee',parseFloat(a),parseFloat(b)||0);
 else if(g.nl&&n=='forest')tw(g.nl,'outside',0,1,'quadOut');
 else if(g.nl&&n=='snow'){g.nl.snow=1;g.nl.hall=0}
 else if(g.nl&&n=='bee'){g.nl.bee=1;g.nl.snow=0}
 else if(g.nl&&n=='gf')tw(g.gf,'x',g.gf.x-1100,9.3,'quadOut');
 else if(g.nl&&n=='goodmorning'){g.camA=1;g.hudA=1}
 else if(n=='farm')tw(g,'jfa',parseFloat(a),parseFloat(b)||0);
 else if(n=='white'){g.jwa=1;g.jfa=0;tw(g.bf,'al',0,.1,'quadInOut')}
 else if(n=='ice'){g.jia=1;g.jwa=0;tw(g.bf,'al',1,.1,'quadInOut')}
 else if(n=='computer'){g.jca=1;g.jga=1;g.jia=0}
 else if(n=='come'){tw(g,'camA',1,3,'quadIn');tw(g,'hudA',1,3,'quadIn')}
 else if(n=='poop')tw(g,'camA',0,3,'quadIn');
 else if(n=='okno'){tw(g,'camA',1,3,'quadIn');g.wfl=1;tw(g,'wfl',0,8)}
 else if(n=='goodnight'){if(g.nl){g.camA=0;g.hudA=0}else g.camV=0}
 else if(n=='goodmorningsweetcheeks')g.camV=1;
 else if(n=='bye'){tw(g,'camA',0,1,'quadIn');tw(g,'hudA',0,1,'quadIn')}
 else if(n=='fuck'){const v=g.vids[1];if(v)vplay(v)}
 else if(n=='woah'){
  if(a=='woah'){tw(g,'home_a',1,7,'quadInOut');tw(g,'floor_a',0,7,'quadInOut')}
  else if(a=='bye'){tw(g,'home_a',0,3,'quadInOut');tw(g,'floor_a',1,3,'quadInOut')}
  else if(a=='glitch')g.glitch=1;else if(a=='noglitch')g.glitch=0;else if(a=='codeWall')g.code_v=1;else if(a=='welcome')tw(g,'code_a',1,4,'cubeOut');else if(a=='fade')tw(g,'code_a',0,1,'cubeInOut');else if(a=='nowall')g.code_v=0}}
function sing(c,l,alt,miss){const b='sing'+DIR[l];const n=miss?b+'miss':alt&&c.an[b+'-alt']?b+'-alt':b;c.play(n,1)}
function rate(d){d=Math.abs(d);return d<=45?['SICK!',350,1]:d<=90?['Good',200,.9]:d<=135?['Bad',100,.7]:['Shit',50,.5]}
function hitKey(l){
 let b=null;for(const n of g.notes){if(n.t-g.pos>166)break;if(n.pl&&!n.hit&&!n.miss&&n.l==l&&Math.abs(n.t-g.pos)<=166){b=n;break}}
 if(!b){if(!cfg.ghost&&g.go&&!g.paused){g.hp=Math.max(0,g.hp-.0475);g.combo=0;g.miss++;g.score-=10;sing(g.bf,l,0,1);g.voc.volume=0;g.vt=1.5;g.pop={t:'Miss',a:0}}return}b.hit=1;g.ct[l]=0;if(!b.na)sing(g.bf,l);g.voc.volume=1;
 const r=rate(b.t-g.pos);if(r[0]=='SICK!')g.sp.push({l,t:0});g.score+=r[1];g.combo++;g.hp=Math.min(2,g.hp+.023*r[2]*1.3*(g.hgm||1));g.pop={t:r[0]+'  x'+g.combo,a:0}}
function play(dt){
 const G=g,stepSec=15/G.starts[G.si].bpm;
 if(G.paused){pauseMenu(dt);return}
 if(G.rs){dt=0;G.rsT+=1/60;if(G.inst.paused)G.inst.play().catch(()=>{});if(G.voc.paused)G.voc.play().catch(()=>{});const mv=G.inst.currentTime>G.rsC+.04&&G.inst.readyState>=3;if(mv||G.rsT>3){G.rs=0;G.vwas.forEach(v=>v.play().catch(()=>{}));if(mv)G.pos=G.inst.currentTime*1000}}
 if(G.dead){death(dt);return}
 if(G.hold){ilyFrame(dt);return}
 if(G.end2){partyEnd(dt);return}
 if(G.vid){tick(dt);const v=G.vid;X.fillStyle='#000';X.fillRect(0,0,W,H);
  if(v.videoWidth){const h=W*v.videoHeight/v.videoWidth;X.globalAlpha=G.va;X.drawImage(v,0,H/2-h/2,W,h);X.globalAlpha=1}
  if(pressed.includes('Escape')){endSong();return}
  if((pressed.includes('Enter')||clicks.length)&&!G.skip){G.skip=1;tw(G,'va',0,.6);setTimeout(()=>{v.pause();G.vid=null},650)}
  return}
 if(!G.go){G.pos+=dt*1000;if(G.pos>=0&&G.inst.readyState<3&&(G.bw=(G.bw||0)+dt)<20){G.pos=-1;G.buf=1}else if(G.pos>=0){G.buf=0;G.go=1;G.inst.play();G.voc.play();if(G.id=='1')vplay(G.vids[0]);if(G.id=='noli'){tw(G,'camA',1,1,'quadIn');tw(G,'hudA',1,1,'quadIn')}if(G.jd){tw(G,'zoom',G.zoom-.1,1.67,'quadInOut');G.ha=1;tw(G,'camA',1,1.42,'sineOut');G.wfl=1;tw(G,'wfl',0,1.67);G.timers.push({t:.25,fn:()=>tw(G,'hudA',1,1.42,'sineOut')})}}}
 else{const a=G.inst.currentTime*1000;G.pos+=dt*1000*(G.rate||1)*(G.xr||1);if(Math.abs(G.pos-a)>40)G.pos=a;if(G.voc.readyState>0&&Math.abs(G.voc.currentTime-G.inst.currentTime)>.12)G.voc.currentTime=G.inst.currentTime}
 const pos=G.pos;
 for(const l of tap)hitKey(l);
 for(const k of pressed){if(k in KM)hitKey(KM[k]);else if(k=='Digit5'||k=='Numpad5')G.xr=1;else if(k=='Digit6'||k=='Numpad6')toggleFc(G);if(k=='Escape'||k=='Enter'){pauseGame();return}}
 secretKeys(G,dt);
 for(const[cx,cy]of clicks)if(touchOn()&&cx<110&&cy<40){pauseGame();return}
 while(G.si+1<G.starts.length&&G.starts[G.si+1].t<=pos)G.si++;
 if(G.id=='1'){const m=G.starts[G.si].must,n=m?'bf':'dad';if(G.ba.n!=n)G.ba={n,t:0};G.ba.t+=dt;G.mt-=dt;
  if(G.mt<=0){G.mt=15+Math.random()*15;G.mshow=5;let t;do{t=pick_(FUN)}while(t==G.mtxt);G.mtxt=t}if(G.mshow>0)G.mshow-=dt;
  const i0=Math.min(6,Math.floor(G.ba.t*6)),ix=(G.si>0&&m)?6-i0:i0;G.i0=i0;
  G.dad.x=DPOS[ix][0]+G.dad.d.position[0];G.dad.y=DPOS[ix][1]+G.dad.d.position[1];G.bf.x=BPOS[ix][0]+G.bf.d.position[0];G.bf.y=BPOS[ix][1]+G.bf.d.position[1]}
 if(G.sev)for(const q of G.sev)if(!q.d&&pos>=q[0]){q.d=1;q[1]()}
 while(G.ei<G.evs.length&&G.evs[G.ei][0]<=pos){for(const e of G.evs[G.ei][1])fire(e[0],e[1],e[2]);G.ei++}
 for(const n of G.notes){
  if(n.t>pos+200)break;
  if(!n.pl){if(!n.hit&&n.t<=pos){n.hit=1;n.done=1;G.cz=1;G.voc.volume=1;if(!n.na)sing(G.dad,n.l,n.alt||G.starts[G.si].alt);G.dUntil=Math.max(G.dUntil,n.t+n.len);if(n.alt&&G.hp>.1)G.hp-=.023*2.6;if(G.healthd&&G.hp>=.1)G.hp-=.023*.7}else if(n.hit&&n.sk<=n.sN){while(n.sk<=n.sN&&n.t+n.sm*n.sk<=pos){if(!n.na)sing(G.dad,n.l,n.alt||G.starts[G.si].alt);n.sk++;G.cz=1;G.voc.volume=1}}}
  else if(!n.hit&&!n.miss&&pos-n.t>166){n.miss=1;G.hp=Math.max(0,G.hp-.0475);G.combo=0;G.miss++;G.score-=10;sing(G.bf,n.l,0,1);G.voc.volume=0;G.vt=1.5;G.pop={t:'Miss',a:0}}
  else if(!cfg.gh&&n.pl&&n.len&&n.miss&&!n.hit&&!n.done&&keys['L'+n.l]&&pos<n.t+n.len){n.hit=1;n.miss=0;sing(G.bf,n.l)}
  else if(n.pl&&n.hit&&n.len&&!n.done){if(pos>=n.t+n.len)n.done=1;else if(keys['L'+n.l]){G.bf.hold=0;G.hp=Math.min(2,G.hp+.1*dt);while(n.sk<=n.sN&&n.t+n.sm*n.sk<=pos){if(!n.na)sing(G.bf,n.l);n.sk++}}else n.done=1}}
 if(pos<G.dUntil)G.dad.hold=0;
 if(G.hp<=0){die();return}
 const rtt=(G.rate||1)*(G.xr||1);G.dad.upd(dt*rtt,stepSec);G.bf.upd(dt*rtt,stepSec);if(G.gf)G.gf.upd(dt*rtt,stepSec);if(G.eyes){G.eyes.t+=dt;G.bub.t+=dt}
 {const tm=G.timers;G.timers=[];for(const o of tm){o.t-=dt;if(o.t<=0)o.fn();else G.timers.push(o)}}G.ct=G.ct.map(v=>v+dt);if(G.pop)G.pop.a+=dt;tick(dt);vsync(G,dt);if(G.vt>0){G.vt-=dt;if(G.vt<=0)G.voc.volume=1}if(G.id=='noli')updNoli(G,dt);else if(G.tb)updTeddy(G,dt,pos);
 // camera
 if(G.id=='rockhard'){rockCam(G);if(G.rip)G.ript+=dt;const R=G.run,rc=R.ch;if(rc){rc.x+=R.vx*dt;if(R.on&&(rc.x>800+R.w||rc.x<-500-R.w))R.on=0;if(Math.abs(rc.x)>3e5)rc.x=rc.x>0?3e5:-3e5}}
 if(G.force)G.tgt=G.force;else if(ST.snap){if(G.si!==G.lsi||!G.tgt)G.tgt=camTarget(G)}else G.tgt=camTarget(G);
 if(G.si!==G.lsi){G.lsi=G.si;if(ST.snap)G.zoom=G.starts[G.si].must?1.5:3;if(G.id=='rockhard'&&G.run.init&&!G.run.on)runTwo(G)}
 if(!G.snapped&&G.tgt){G.snapped=1;G.cx=G.tgt[0];G.cy=G.tgt[1]}
 if(ST.snap&&G.tgt){G.cx=G.tgt[0];G.cy=G.tgt[1]}
 const[tx,ty]=G.tgt||[G.cx,G.cy],k=G.freeze?0:1-Math.exp(-dt*2.4*(ST.cs||1)*(G.rate||1));G.cx+=(tx-G.cx)*k;G.cy+=(ty-G.cy)*k;G.tm+=dt;
 if(ST.nocz)G.cz=0;
 if(G.go){const q=G.starts[G.si],bt=Math.floor((pos-q.t)/(60000/q.bpm))+q.b;if(bt!==G.lb){G.lb=bt;if(bt%4==0&&G.cz&&cfg.cz&&G.zoom<1.35)G.zoom+=.015}if(G.cz)G.zoom=G.dz+(G.zoom-G.dz)*Math.exp(-dt*6.25)}
 // world
 X.fillStyle='#000';X.fillRect(0,0,W,H);const wl=G.camA<1||!G.camV||G.rip;if(wl)lbeg('w');X.save();const zz=G.fc?G.fz:G.zoom;X.translate(W/2,H/2);X.scale(zz,zz);X.translate(G.fc?-G.fx:-G.cx,G.fc?-G.fy:-G.cy);
 if(G.id=='1')drawOne(G);else if(G.id=='devilish')drawGuest(G);else if(G.id=='strawberry')drawStrawFire(G);else if(G.id=='rockhard')drawRockBG(G);else if(G.id=='joy')drawJoyBG(G);else if(G.id=='noli')drawNoliBG(G);else if(G.bm)drawBloodyBG(G);else if(G.tb)G.tb.bg&&X.drawImage(G.tb.bg,-250,0);else if(NOSTAGE(G.id)||G.id=='bloxwatch'){}else{
 X.drawImage(G.sky,-228,0);if(G.glitch){const fr=Math.floor(G.tm*8),sw=G.sky.width,sk=G.sky.height;for(let k=0;k<28;k++){const q=fr*31.7+k*1.7,y0=rnd(q+2345),hh=rnd(q+925)*.075,o=(rnd(q+25)*2-1)*.021875*sw;if(y0+hh>=1)continue;X.drawImage((27-k)&1?G.skyInv:G.sky,0,y0*sk,sw,hh*sk,-228+o,y0*sk,sw,hh*sk)}}
 if(G.home_a>0){X.globalAlpha=G.home_a;const s=1600/G.home.width,hw=G.home.width*s,hh=G.home.height*s;X.drawImage(G.home,100+(G.home.width-hw)/2,200+(G.home.height-hh)/2,hw,hh);X.globalAlpha=1}
 if(G.code_v&&G.code_a>0)drawCode(G,G.code_a);
 if(G.floor_a>0){X.globalAlpha=G.floor_a;X.drawImage(G.floor,130,700);X.globalAlpha=1}}
 if(NOSTAGE(G.id)){}else if(G.id=='bloxwatch')drawBlox(G);else if(G.id=='strawberry'){G.bf.draw(0);G.dad.draw(0);drawOpp(G,pos)}else if(G.id=='noli')drawNoliChars(G);else if(G.bm)drawBloodyChars(G);else if(G.tb)drawTeddyChars(G);else if(G.id=='rockhard'&&G.dad.y>G.bf.y){G.bf.draw(0);G.dad.draw(0)}else{G.dad.draw(G.tint);G.bf.draw(G.tint)}if(G.id=='devilish')drawGuestFront(G);if(G.id=='joy')drawJoyFront(G);X.restore();if(wl){if(G.rip&&G.camV)lendRip(G);else lend('w',G.camV?G.camA:0)}if(G.wfl>0){X.fillStyle='rgba(0,0,0,'+G.wfl+')';X.fillRect(0,0,W,H)}if(G.tb&&G.tb.dc){X.globalAlpha=.1;X.fillStyle=G.tb.dc;X.fillRect(0,0,W,H);X.globalAlpha=1}
 // notes
 if(G.hg){X.fillStyle='#000';X.fillRect(0,0,W,H)}
 for(const v of G.hs)if(v.currentTime>0&&!v.ended&&!v.paused&&v.videoWidth)X.drawImage(v,0,0,W,H);
 if(G.bfHud&&G.bf.al>0)G.bf.draw(0);
 if(G.bub&&G.bub.al>0){const b=G.bub,q=G.bubA.get(b.an=='h'?'bubbleappear':'bubble0000'),i=Math.floor(b.t*12),f=q[b.an=='h'?Math.min(i,q.length-1):0];X.globalAlpha=b.al;dr(G.bubA,f,b.x+(f.fw-f.fw*.9)/2-f.fx*.9,b.y+(f.fh-f.fh*.9)/2-f.fy*.9,vw(f)*.9,vh(f)*.9);X.globalAlpha=1}
 const hl=G.hudA<1;if(hl)lbeg('h');if(G.bm)X.drawImage(G.bmI.vig,0,0);
 SY=cfg.down?570:50;const kk=K*G.spd/(G.rate||1),cy0=SY+55;X.imageSmoothingEnabled=!cfg.pix;
 for(let l=0;l<4;l++){const f=G.nf[l],cx=sx(l)+56;let fr=f.sa&&f.sa.length?f.sa[Math.floor(G.tm*24)%f.sa.length]:f.st;const held=keys['L'+l];
  if(G.ct[l]<.15&&f.cf.length)fr=f.cf[Math.min(f.cf.length-1,Math.floor(G.ct[l]*24))];else if(held&&f.pr.length)fr=f.pr[Math.min(f.pr.length-1,Math.floor(G.ct[l]*24))];
  df(G.na,fr,cx-fr.fw*.35,cy0-fr.fh*.35,.7,.8);X.fillStyle='#fff';X.font='20px MArial, Arial';X.textAlign='left';X.fillText(klab(cfg.bind[l]),sx(l)+2,SY+111);X.textAlign='center'}
 for(const n of G.notes){
  if(!n.pl||n.miss&&!n.len&&pos-n.t>400||n.done)continue;
  const dn=cfg.down,y=n.hit?cy0:cy0+(dn?-1:1)*(n.t-pos)*kk;if(dn?y<-300:y>H+300)break;
  const f=G.nf[n.l],cx=sx(n.l)+56;
  if(n.len){const len=(n.t+n.len-(n.hit?pos:n.t))*kk,top=n.hit?cy0:y,eh=vh(f.e)*.7;
   if(len>0&&(dn?top>0:top<H)){X.globalAlpha=n.miss?.3:.65;const tp=dn?0:top;if(dn){X.save();X.translate(0,top);X.scale(1,-1)}dr(G.na,f.p,cx-f.p.fw*.35-f.p.fx*.7,tp,vw(f.p)*.7,Math.max(0,len-eh));dr(G.na,f.e,cx-f.e.fw*.35-f.e.fx*.7,tp+Math.max(0,len-eh),vw(f.e)*.7,eh);if(dn)X.restore();X.globalAlpha=1}}
  if(!n.hit)df(G.na,f.h,cx-f.h.fw*.35,y-f.h.fh*.35,.7,n.miss?.3:1)}
 X.imageSmoothingEnabled=true;
 // hud
 G.sp=G.sp.filter(o=>{o.t+=dt;const q=G.spl.get('splash star '+COL[o.l]+' '),i=Math.floor(o.t*24);if(i>=q.length)return false;const f=q[i];df(G.spl,f,sx(o.l)+56-f.fw/2,SY+55-f.fh/2);return true});
 if(G.pop&&G.pop.a<.6){X.globalAlpha=1-G.pop.a/.6;X.font='bold 40px MArial, Arial';X.fillText(G.pop.t,W*.75,H/2+60);X.globalAlpha=1}
 if(touchOn()){for(let l=0;l<4;l++){X.fillStyle='rgba(255,255,255,'+(keys['L'+l]?.14:.04)+')';X.fillRect(l*W/4+2,40,W/4-4,H-40)}}
 X.globalAlpha=G.ha;
 if(!cfg.hid){X.fillStyle='#f00';X.fillRect(W-70,235,20,250);X.fillStyle='#96ff00';const hh=G.hp*125;X.fillRect(W-70,485-hh,20,hh);
 X.fillStyle='#00f';X.font='30px MArialI, Arial';X.textAlign='center';X.fillText('health',W-60,520)}X.globalAlpha=1;
 X.fillStyle='#000';X.fillRect(0,0,W,40);if(touchOn()){X.fillStyle='#fff';X.font='20px MArial, Arial';X.textAlign='left';X.fillText('‹ menu',12,28);X.textAlign='center'}X.globalAlpha=G.ha;X.fillStyle='#fff';X.font='30px MArial, Arial';X.fillText(cfg.hid?'':G.tb&&G.tb.disco?'party':'time: '+Math.max(0,Math.round(((G.inst.duration||0)*1000-pos)/1000)),W/2,34);X.globalAlpha=1;if(cfg.proof)drawProof();drawSecretHud(G);if(hl)lend('h',G.hudA);if(G.buf&&!G.go){X.fillStyle='#fff';X.textAlign='center';X.font='28px MArial, Arial';X.fillText('buffering music...',W/2,H/2)}
 if(G.fa>0){X.fillStyle='rgba(0,0,0,'+G.fa+')';X.fillRect(0,0,W,H)}
 if(G.flash>0){X.fillStyle='rgba(255,255,255,'+G.flash+')';X.fillRect(0,0,W,H)}
 if(G.hudw>0){X.fillStyle='rgba(255,255,255,'+G.hudw+')';X.fillRect(0,0,W,H)}
 if(G.hidden||G.cover){X.fillStyle='#000';X.fillRect(0,0,W,H)}
 for(const v of G.vids)if(!G.hs.includes(v)&&v.currentTime>0&&!v.ended&&!v.paused&&v.videoWidth)X.drawImage(v,0,0,W,H);
 if(G.mshow>0){X.fillStyle='rgba(128,128,128,.6)';X.fillRect(0,0,W,H);X.fillStyle='#000';X.font='40px MArial, Arial';X.textAlign='center';X.textBaseline='middle';X.fillText(G.mtxt,W/2,H/2);X.textBaseline='alphabetic'}
 G.lg=G.lg.filter(o=>{o.t+=dt;return o.t<o.tm*3.3});
 for(const o of G.lg){if(o.t<0||!G.logo)continue;const t=o.tm,al=o.t<t?ease.expoOut(o.t/t):1-ease.cubeOut(Math.min(1,Math.max(0,(o.t-t-1.2)/t))),sc=.6+.3*ease.quadInOut(Math.min(1,Math.max(0,(o.t-t/2)/(t*2))));
  X.globalAlpha=al;X.drawImage(G.logo,W/2-G.logo.width*sc/2,H/2-G.logo.height*sc/2,G.logo.width*sc,G.logo.height*sc);X.globalAlpha=1}}

/* ---------- I LOVE YOU (ily.hx): pick a ball, then a video plays ---------- */
const ILYC=['green','red','blue','yellow'],ILYP=[[275,425],[275,225],[475,225],[475,425]];
function ilyFrame(dt){const G=g,I=G.ily;I.t+=dt;
 if(pressed.includes('Escape')){if(I.music)I.music.pause();G.hold=0;endSong();return}
 if(!I.init){I.init=1;I.music=snd('music/bg.ogg',1);I.music.play().catch(()=>{});snd('sounds/pick.ogg').play()}
 if(I.ph==0&&I.t>1.48&&I.txt=='pick')I.txt='sorry';
 if(I.ph==0&&I.t>4.3){I.ph=1;I.txt='bBase'}
 if(I.ph==1)for(const[cx,cy]of clicks)for(let i=0;i<4;i++){const p=ILYP[i];if(cx>=p[0]&&cx<=p[0]+210&&cy>=p[1]&&cy<=p[1]+210){I.ph=2;I.sel=i;I.txt=ILYC[i];I.t2=0;snd('sounds/'+ILYC[i]+'.ogg').play();break}}
 if(I.ph==2){I.t2+=dt;if(I.t2>3.3){I.ph=3;if(I.music)I.music.pause();G.hold=0;G.pos=-100;G.vids[I.sel].play().catch(()=>{})}}
 X.fillStyle='#000';X.fillRect(0,0,W,H);
 if(I.ph==1)for(let i=0;i<4;i++)X.drawImage(G.balls[i],ILYP[i][0],ILYP[i][1],210,210);
 if(I.ph<3){const q=G.txtA.get(I.txt),f=q[0];if(f)dr(G.txtA,f,W/2-f.fw*.3-f.fx*.6,-8+f.fh*.2-f.fy*.6,vw(f)*.6,vh(f)*.6)}}

/* ---------- PARTY TIME (party.hx): video, then an error box ---------- */
function partyEnd(dt){const G=g;G.endT+=dt;X.fillStyle='#000';X.fillRect(0,0,W,H);
 const a=ease.expoOut(Math.min(1,Math.max(0,(G.endT-3)/.3))),im=G.errImg;if(a>0&&im){X.globalAlpha=a;X.drawImage(im,W/2-im.width*.3,H/2-im.height*.3,im.width*.6,im.height*.6);X.globalAlpha=1}
 if(G.endT>6.3){G.end2=0;G.skipHook=1;endSong(1)}}

/* ---------- CAMERA (port of PlayState.moveCamera) ---------- */
function camTarget(G){const dad=!G.starts[G.si].must,ch=dad?G.dad:G.bf,m=ch.mid(),c=ch.d.camera_position;let dx=0,dy=0;
 if(ch.cur&&ch.name&&ch.name.startsWith('sing')){const a=ch.cur,i=Math.floor(ch.t*a.fps),fi=a.loop?i%a.fr.length:Math.min(i,a.fr.length-1);
  if(fi<3){const d=ch.name.slice(4);if(d=='UP'||d=='UP-alt')dy=-15;else if(d=='DOWN'||d=='DOWN-alt')dy=15;else if(d=='LEFT'||d=='LEFT-alt')dx=-15;else if(d=='RIGHT'||d=='RIGHT-alt')dx=15}}
 return dad?[m[0]+150+c[0]+ST.cd[0]+dx,m[1]-100+c[1]+ST.cd[1]+dy]:[m[0]-100-c[0]+ST.cb[0]+dx,m[1]-100+c[1]+ST.cb[1]+dy]}

/* ---------- BLOODY MARY STAGE (blood.hx) ---------- */
function bmEv(g,n){const B=g.bm,d=g.dad;switch(n){
 case'awake':case'walk':{const v=g.vids[n=='awake'?1:2];if(v)vplay(v);return true}
 case'come back':g.camA=1;return true;
 case'die':g.camA=0;return true;
 case'fade':g.wfl=1;tw(g,'wfl',0,1);return true;
 case'pt2':g.hudA=0;B.pt2=1;return true;
 case'bathroom':tw(B,'bath',0,1,'quadOut');return true;
 case'normappear':B.norm=1;B.scary=0;return true;
 case'normbye':d.al=0;B.norm=0;return true;
 case'rust':B.evil=1;return true;
 case'byerust':B.evil=0;return true;
 case'poop':tw(d,'al',1,1,'cubeOut');tw(d,'x',d.x-600,1,'quadOut');tw(d,'y',d.y-40,1,'quadOut');return true;
 case'new':B.run=1;B.bod=1;return true;
 case'final':B.thing=1;B.ok=1;B.fg=1;return true;
 case'move':tw(d,'x',d.x-400,.3,'quadOut');tw(d,'y',d.y-100,.3,'quadOut');return true;
 case'dad':tw(d,'x',d.x-600,.3,'quadOut');tw(d,'y',d.y-40,.3,'quadOut');return true;
 case'bf':tw(g.bf,'x',g.bf.x-1100,9.3,'quadOut');return true}return false}
function bmAt(G,A,fr,fps,x,y,s,al){if(!(al>0))return;const q=A.get(fr),f=q[Math.floor(G.tm*fps)%q.length],e=A.f[0];X.globalAlpha=Math.min(1,al);dr(A,f,x+e.fw/2*(1-s)-f.fx*s,y+e.fh/2*(1-s)-f.fy*s,vw(f)*s,vh(f)*s);X.globalAlpha=1}
function drawBloodyBG(G){const B=G.bm,I=G.bmI,im=(i,a,x,y)=>{if(a>0){X.globalAlpha=Math.min(1,a);X.drawImage(i,x,y);X.globalAlpha=1}};
 im(I.scary,B.scary,400,200);
 if(B.run>0){const w=I.rock.width,x0=(G.tm*2000)%w,l=G.cx-W/2/G.zoom,r=G.cx+W/2/G.zoom;X.globalAlpha=Math.min(1,B.run);for(let x=x0+Math.floor((l-x0)/w)*w;x<r;x+=w)X.drawImage(I.rock,x,100);X.globalAlpha=1}
 im(I.norm,B.norm,100,0);im(I.evil,B.evil,100,0);bmAt(G,G.bmA.ok,'ok',24,100,500,.5,B.ok)}
function drawBloodyChars(G){const B=G.bm,I=G.bmI;G.dad.draw(0);bmAt(G,G.bmA.fg,'fg',24,100,100,.5,B.fg);bmAt(G,G.bmA.thing,'thing',24,1025,535,.5,B.thing);bmAt(G,G.bmA.bod,'bfbod',24,1110,660,1,B.bod);G.bf.draw(0);
 if(B.bath>0){X.globalAlpha=Math.min(1,B.bath);X.drawImage(I.bath,675,300);X.globalAlpha=1}if(B.pt2>0){X.globalAlpha=Math.min(1,B.pt2);X.drawImage(I.pt2,300,-100);X.globalAlpha=1}}

/* ---------- BURNT SHADER (burnt.frag): dark pixels -> white, the rest -> black, mixed by ratio ---------- */
let BURNFAIL=0;
function burnDraw(c,f,S,x0,y0){if(BURNFAIL)return 0;try{const w=Math.ceil(f.fw*S),h=Math.ceil(f.fh*S);tc.width=w;tc.height=h;const M0=X;X=tx;df(c.a,f,0,0,S);X=M0;const id=tx.getImageData(0,0,w,h),d=id.data,r=Math.min(1,c.burn);
 for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const g=(d[i]<=13&&d[i+1]<=13&&d[i+2]<=13)?255:0;d[i]+=(g-d[i])*r;d[i+1]+=(g-d[i+1])*r;d[i+2]+=(g-d[i+2])*r}
 tx.putImageData(id,0,0);X.save();X.globalAlpha=c.al;if(c.flip){X.translate(x0+f.fw*S,y0);X.scale(-1,1);X.drawImage(tc,0,0)}else X.drawImage(tc,x0,y0);X.restore();return 1}catch(e){BURNFAIL=1;return 0}}

/* ---------- NOLI STAGE (hall.hx) ---------- */
function drawNoliBG(G){const I=G.nI,N=G.nl,d=(im,a,x,y)=>{if(a>0){X.globalAlpha=Math.min(1,a);X.drawImage(im,x,y);X.globalAlpha=1}};d(I.outside,N.outside,-100,165);d(I.hall,N.hall,-228,0);d(I.snow,N.snow,-28,0);d(I.bee,N.bee,-100,0)}
function drawNoliChars(G){G.gf.draw(0);for(const p of G.ptl){const k=p.age/p.life,v=Math.round(128*(p.c0+(p.c1-p.c0)*k));X.globalAlpha=1-k;X.fillStyle='rgb('+v+',0,'+v+')';X.fillRect(p.x,p.y,8,8)}X.globalAlpha=1;G.dad.draw(0);G.bf.draw(0)}
function updNoli(G,dt){const d=G.dad,f0=d.a.f[0],sc=d.d.scale||1,ex=d.x+(f0.fw*sc-30)/2,ey=d.y+f0.fh*sc,fr=Math.max(G.emf,.001);G.emt+=dt;let n=0;
 while(G.emt>=fr&&n++<10){G.emt-=fr;if(G.ptl.length<200)G.ptl.push({x:ex+Math.random()*30,y:ey,vx:-80+Math.random()*160,vy:-700*Math.random(),life:3+Math.random(),age:0,c0:Math.random(),c1:Math.random()})}
 G.ptl=G.ptl.filter(p=>{p.age+=dt;if(p.age>=p.life)return false;const k=1-p.age/p.life;p.x+=p.vx*k*dt;p.y+=p.vy*k*dt;return true})}

/* ---------- BLOXPIN STAGE (teddy.hx) ---------- */
function flk(o,dur,iv,end){o.fk={t:0,dur,iv,end,s:o.vis!==false}}
function flkKill(o){if(o&&o.fk){o.fk=null;o.vis=true}}
function flkUpd(o,dt){const f=o.fk;if(!f)return;f.t+=dt;if(f.t>=f.dur){o.vis=f.end;o.fk=null}else o.vis=Math.floor(f.t/f.iv)%2==0?f.s:!f.s}
function sfx(G,n,t0,rate){const a=snd('sounds/bloxpin/'+n+'.ogg');if(t0)a.addEventListener('loadedmetadata',()=>{try{a.currentTime=t0}catch(e){}});if(rate)a.playbackRate=rate;a.play().catch(()=>{});G.sfx.push(a);return a}
const cancelTw=(o,k)=>{T=T.filter(q=>!(q.o===o&&k.includes(q.k)))};
function teddyHeads(G,Q,on){const bf=G.bf;for(const h of[Q.big,Q.small]){h.x=bf.x;h.y=bf.y;h.ang=bf.ang||0;h.burn=bf.burn;if(on&&h.vis!==false&&bf.cur&&h.an[bf.name]){const fi=Math.floor(bf.t*bf.cur.fps);h.cur=h.an[bf.name];h.name=bf.name;h.t=(fi+.01)/h.cur.fps}}}
function updTeddy(G,dt,pos){const Q=G.tb,bf=G.bf;if(Q.evil)return;
 flkUpd(bf,dt);flkUpd(Q.big,dt);flkUpd(Q.small,dt);teddyHeads(G,Q,1);
 Q.pop.t+=dt;Q.ev-=dt;if(Q.ev<=0){Q.ev=10+Math.floor(Math.random()*11);teddyEv(G)}
 const F=Q.fire;if(F.vis){F.t+=dt;const fps=F.an=='loop'?48:7,n=F.an=='loop'?Q.fireA.get('fire').length:Q.fireA.get('start').length;
  if(F.an!='loop'&&F.t*fps>=n){if(F.an=='start'){F.an='loop';F.t=0;Q.fl={left:10,t:0}}else F.vis=0}}
 if(Q.fl){Q.fl.t+=dt;if(Q.fl.t>=1){Q.fl.t-=1;Q.fl.left--;if(G.hp>.2)G.hp-=.1;if(Q.fl.left<=0||G.hp<=.2)endFire(G,Q)}}
 if(Q.beam.vis){Q.beam.t+=dt;if(Q.beam.t*17>=Q.beamA.get('beam instance 1').length)Q.beam.vis=0}
 if(Q.exp.vis){Q.exp.t+=dt;if(Q.exp.t*30>=Q.expA.get('explosion').length)Q.exp.vis=0}
 if(Q.disco){const b=Math.floor(pos/(60000/229));if(b!==Q.lb){Q.lb=b;if(b%2==0){let c;do{c=Math.floor(Math.random()*4)}while(c==Q.pc);Q.pc=c;Q.dc=['#00ff00','#ff00ff','#ff0000','#0000ff'][c]}if(cfg.cz)G.zoom+=.015}}}
function endFire(G,Q){if(Q.fsnd){const a=Q.fsnd;Q.fsnd=null;tw(a,'volume',0,1);G.timers.push({t:1,fn:()=>a.pause()})}Q.fl=null;Q.fire.an='end';Q.fire.t=0;cancelTw(G.bf,['burn']);tw(G.bf,'burn',0,.5)}
function teddyEv(G,forced){const Q=G.tb,bf=G.bf,an=forced||['bighead','explode','fire','fling','smallhead','smite'][Math.floor(Math.random()*6)],P=Q.pop;
 P.an=an;P.t=0;P.al=0;P.gen++;const gen=P.gen;cancelTw(P,['al']);tw(P,'al',1,.1);G.timers.push({t:1.6,fn:()=>{if(P.gen==gen)tw(P,'al',0,1)}});
 G.dad.spec('tex');for(const n of G.notes)if(!n.pl&&!n.hit&&!n.miss&&n.t-G.pos<1000)n.na=true;
 const later=(t,fn)=>G.timers.push({t,fn});
 if(an=='fire'){Q.fsnd=sfx(G,'fire');Q.fire.vis=1;Q.fire.an='start';Q.fire.t=0;cancelTw(bf,['burn']);tw(bf,'burn',1,.5)}
 else if(an=='fling'){sfx(G,'fling');const left=Math.random()<.5,nx=bf.x+(left?-1400:1400),ny=bf.y-1600;let na=40+Math.floor(Math.random()*111);const tm=.2+Math.random()*.3;if(left)na=-na;G.freeze=1;
  cancelTw(bf,['x','y','ang']);tw(bf,'x',nx,tm,'sineIn');tw(bf,'y',ny,tm,'sineOut');tw(bf,'ang',na,tm,'circOut');
  later(tm+1,()=>{sfx(G,'landing')});later(tm+1,()=>{tw(bf,'x',Q.baseX,1,'bounceOut');tw(bf,'y',Q.baseY,1,'bounceOut');later(1,()=>{tw(bf,'ang',0,1,'circInOut');sfx(G,'scrape',0,4);G.freeze=0})})}
 else if(an=='smite'){sfx(G,'lightning',.5);bf.spec('struck');for(const n of G.notes)if(n.pl&&!n.hit&&!n.miss&&n.t-G.pos<1000)n.na=true;Q.beam.vis=1;Q.beam.t=0;if(G.hp>.3)G.hp-=.2}
 else if(an=='explode'){sfx(G,'explode',.3);const e=Q.expA.f[0];Q.exp.vis=1;Q.exp.t=0;Q.exp.x=bf.x+((bf.a.f[0].fw-e.fw*2)/2)-100;Q.exp.y=bf.y+(bf.a.f[0].fh-e.fh*2)/2;G.freeze=1;cancelTw(bf,['y']);tw(bf,'y',bf.y-1200,.3,'sineOut');later(.3,()=>{tw(bf,'y',Q.baseY,1,'bounceOut');later(1,()=>{G.freeze=0})});if(G.hp>.5)G.hp-=.4}
 else if(an=='bighead'||an=='smallhead'){const big=an=='bighead',on=big?Q.big:Q.small,off=big?Q.small:Q.big;Q.fg++;const fg=Q.fg;flkKill(bf);flkKill(Q.big);flkKill(Q.small);off.vis=false;sfx(G,big?'powerup':'down');flk(bf,.5,.08,false);flk(on,.5,.08,true);
  later(6,()=>{if(Q.fg!=fg)return;flk(on,.5,.08,false);flk(bf,.5,.08,true);sfx(G,big?'down':'powerup')})}}
function drawTeddyChars(G){const Q=G.tb,bf=G.bf;G.dad.draw(0);if(Q.evil){bf.draw(0);return}
 const F=Q.fire,w0=bf.a.f[0].fw,h0=bf.a.f[0].fh;
 if(F.vis){const A=Q.fireA,fr=F.an=='loop'?A.get('fire'):F.an=='start'?A.get('start'):[7,6,5,4,3,2,1,0].map(i=>A.get('start')[i]).filter(Boolean),fps=F.an=='loop'?48:7,i=Math.floor(F.t*fps),f=fr[F.an=='loop'?i%fr.length:Math.min(i,fr.length-1)],e=A.f[0],
  ox=F.an=='loop'?0:-10,oy=F.an=='loop'?0:4,x=bf.x+(w0-e.fw)/2-10-((f.fw-e.fw)*.5+ox),y=bf.y+h0-e.fh-50-((f.fh-e.fh)*.5+oy);if(f)df(A,f,x,y,1)}
 bf.draw(0);
 const P=Q.pop;if(P.al>0&&P.an){const A=Q.popA,fr=A.get(P.an),f=fr[Math.min(fr.length-1,Math.floor(P.t*24))],e=A.f[0],d0=G.dad.a.f[0];X.globalAlpha=Math.min(1,P.al);df(A,f,G.dad.x+(e.fw-d0.fw*(G.dad.d.scale||1))/2+50,G.dad.y-e.fh+175,1);X.globalAlpha=1}
 if(Q.beam.vis){const A=Q.beamA,fr=A.get('beam instance 1'),f=fr[Math.min(fr.length-1,Math.floor(Q.beam.t*17))],e=A.f[0];df(A,f,bf.x+(w0-e.fw)/2,bf.y+h0-e.fh+10,1)}
 if(Q.exp.vis){const A=Q.expA,fr=A.get('explosion'),f=fr[Math.min(fr.length-1,Math.floor(Q.exp.t*30))];df(A,f,Q.exp.x,Q.exp.y,2)}
 if(Q.big.vis!==false)Q.big.draw(0);if(Q.small.vis!==false)Q.small.draw(0)}

/* ---------- LAYERS (camGame.alpha / camHUD.alpha) ---------- */
const LY={};let X0=null;
function lbeg(k){let c=LY[k];if(!c){c=LY[k]=document.createElement('canvas');c.width=W;c.height=H}const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.clearRect(0,0,W,H);X0=X;X=x}
function lend(k,a){X=X0;X.globalAlpha=Math.max(0,Math.min(1,a));X.drawImage(LY[k],0,0);X.globalAlpha=1}

/* ripple.frag: cp=-1+2*uv; uv+=cp/|cp|*cos(|cp|*12-iTime*4)*0.02*ratio  (half-res remap; falls back to a plain blit if the canvas is tainted) */
let RP=null;
function lendRip(G){try{const hw=W>>1,hh=H>>1;
 if(!RP){RP={a:document.createElement('canvas'),b:document.createElement('canvas'),d:new Float32Array(hw*hh*3)};RP.a.width=RP.b.width=hw;RP.a.height=RP.b.height=hh;
  for(let y=0;y<hh;y++)for(let x=0;x<hw;x++){const cx=-1+2*x/hw,cy=-1+2*y/hh,cl=Math.sqrt(cx*cx+cy*cy)||1e-6,i=(y*hw+x)*3;RP.d[i]=cl;RP.d[i+1]=cx/cl;RP.d[i+2]=cy/cl}}
 const ax=RP.a.getContext('2d');ax.clearRect(0,0,hw,hh);ax.drawImage(LY.w,0,0,hw,hh);
 const sd=ax.getImageData(0,0,hw,hh).data,bx=RP.b.getContext('2d'),o=bx.createImageData(hw,hh),od=o.data,r=G.ripr,t=G.ript*4;
 for(let y=0;y<hh;y++)for(let x=0;x<hw;x++){const i=(y*hw+x)*3,k=Math.cos(RP.d[i]*12-t)*.02*r;let sx=Math.round(x+RP.d[i+1]*k*hw),sy=Math.round(y+RP.d[i+2]*k*hh);sx=sx<0?0:sx>=hw?hw-1:sx;sy=sy<0?0:sy>=hh?hh-1:sy;const a=(sy*hw+sx)*4,b=(y*hw+x)*4;od[b]=sd[a];od[b+1]=sd[a+1];od[b+2]=sd[a+2];od[b+3]=sd[a+3]}
 bx.putImageData(o,0,0);X=X0;X.drawImage(RP.b,0,0,W,H)}catch(e){lend('w',1)}}

/* ---------- JOY STAGE (rusticworld.hx) ---------- */
function drawJoyBG(G){const J=G.jo,d=(im,a,x,y)=>{if(a>0){X.globalAlpha=Math.min(1,a);X.drawImage(im,x,y);X.globalAlpha=1}};d(J.forest,G.jfa,-128,0);d(J.ice,G.jia,-128,0);d(J.white,G.jwa,-300,900);d(J.computer,G.jca,-128,0)}
function drawJoyFront(G){const J=G.jo;if(G.jga>0){X.save();X.globalAlpha=Math.min(1,G.jga);X.globalCompositeOperation='multiply';X.drawImage(J.green,-128,0);X.restore()}
 if(G.fire_a>0){const q=G.fire.get('fire'),f=q[Math.floor(G.tm*24)%q.length];X.globalAlpha=Math.min(1,G.fire_a);dr(G.fire,f,(f.fw-f.fw*3)/2-f.fx*3,300+(f.fh-f.fh*2)/2-f.fy*2,vw(f)*3,vh(f)*2);X.globalAlpha=1}}

/* ---------- ROCKHARD STAGE (cheek.lua + guyRun.lua) ---------- */
function drawRockBG(G){const d=(im,x,y)=>{const w=im.width*1.12,h=im.height*1.12;X.drawImage(im,x+(im.width-w)/2,y+(im.height-h)/2,w,h)};if(G.cbOn)d(G.cbI,0,180);if(G.gateOn)d(G.gateI,100,180)}
function rockCam(G){const ch=G.starts[G.si].must?G.bf:G.dad,o=20,m={singLEFT:[-o,0],singRIGHT:[o,0],singUP:[0,-o],singDOWN:[0,o],'singLEFT-alt':[-o,0],'singRIGHT-alt':[o,0],'singUP-alt':[0,-o],'singDOWN-alt':[0,o],idle:[0,0],'idle-alt':[0,0]}[ch.name||''];if(m)G.force=[750+m[0],560+m[1]]}
function runTwo(G){const R=G.run;if(R.on)return;const f=Math.random()<.5;let sp=30000;if(Math.random()<.8)sp=7000;if(Math.random()<.1)sp=100000;
 const d=G.dad,ny=R.base+Math.floor(Math.random()*201)-100;let sc=1;if(ny<R.base)sc=.5;if(ny>R.base)sc=1.1;
 R.ch=d;d.y=ny;d.sc=sc;d.flip=f?1:0;R.w=d.an.idle.fr[0].fw*(d.d.scale||1)*sc;R.vx=f?sp:-sp;d.x=f?-500-R.w:800+R.w;R.on=1}

/* ---------- BLOXWATCH STAGE ---------- */
function drawBlox(G){G.gf.draw(0);const e=G.eyes,h=e.an=='h',q=G.eyesA.get(h?'eyeappear':'eyes'),i=Math.floor(e.t*(h?17:24)),f=q[h?Math.min(i,q.length-1):i%q.length];
 if(e.al>0)df(G.eyesA,f,-155,210,1,e.al);
 G.dad.draw(0);if(!G.bfHud)G.bf.draw(0);if(G.spot.vis)X.drawImage(G.spotImg,G.spot.x,G.spot.y)}

/* ---------- STRAWBERRY STAGE ---------- */
function drawStrawFire(G){if(G.starts[G.si].must||!(G.fire_a>0))return;const q=G.fire.get('fire'),f=q[Math.floor(G.tm*24)%q.length];X.globalAlpha=G.fire_a;dr(G.fire,f,200+(f.fw-f.fw*2)/2-f.fx*2,300+(f.fh-f.fh*2)/2-f.fy*2,vw(f)*2,vh(f)*2);X.globalAlpha=1}
function drawOpp(G,pos){const sc=.15,kk=K*G.spd,bx=G.dad.x+(G.starts[G.si].must?125:50),cy0=425+G.nf[0].st.fh*sc/2;
 for(let l=0;l<4;l++){const f=G.nf[l].st;df(G.na,f,bx+23.1*l,425,sc)}
 for(const n of G.notes){if(n.pl)continue;if(n.t>pos+4000)break;if(n.hit&&(!n.len||pos>=n.t+n.len))continue;
  const f=G.nf[n.l],cx=bx+23.1*n.l+f.st.fw*sc/2,y=n.hit?cy0:cy0+(n.t-pos)*kk;
  if(n.len){const len=(n.t+n.len-(n.hit?pos:n.t))*kk,eh=vh(f.e)*sc;dr(G.na,f.p,cx-f.p.fw*sc/2-f.p.fx*sc,y,vw(f.p)*sc,Math.max(0,len-eh));dr(G.na,f.e,cx-f.e.fw*sc/2-f.e.fx*sc,y+Math.max(0,len-eh),vw(f.e)*sc,eh)}
  if(!n.hit)df(G.na,f.h,cx-f.h.fw*sc/2,y-f.h.fh*sc/2,sc)}}

/* ---------- SONG 3 ("1") STAGE ---------- */
const DPOS=[[-400,-50],[-500,0],[-200,-100],[-75,-125],[125,-150],[170,-150],[125,-150]],BPOS=[[400,-100],[300,-100],[600,-100],[700,-100],[900,-100],[1000,-100],[1200,-100]],
 FUN=['pens','fuic','im hacking u','dud','john doe hello','ok well lets play','my powersn','DIE','hacked','funktastic','follow me on twitter','ok ur hacked and dead','send password','123 for bf'];
function drawOne(G){const q=G.sky.get(G.ba.n=='bf'?'bgbf':'bgdad');X.save();X.translate(G.cx-W/2,G.cy-H/2);df(G.sky,q[G.i0||0],-210,-150);X.restore();X.translate(G.cx-W/2,G.cy-H/2)}

/* ---------- DEVILISH STAGE ---------- */
function drawGuest(G){const px=.1*(G.cx-W/2),py=.1*(G.cy-H/2);X.drawImage(G.sky,-250+px,py);X.drawImage(G.floor,-600,0);
 if(G.wh>0){X.save();X.setTransform(1,0,0,1,0,0);X.fillStyle='rgba(255,255,255,'+G.wh+')';X.fillRect(0,0,cv.width,cv.height);X.restore()}}
function drawGuestFront(G){const c=G.home.get('boo');df(G.home,c[Math.floor(G.tm*24)%c.length],0,G.crowdY);
 if(G.fire_a>0){const q=G.fire.get('fire'),f=q[Math.floor(G.tm*24)%q.length];X.globalAlpha=G.fire_a;dr(G.fire,f,(f.fw-f.fw*3)/2-f.fx*3,300+(f.fh-f.fh*2)/2-f.fy*2,vw(f)*3,vh(f)*2);X.globalAlpha=1}}

/* ---------- PROOF OVERLAY + SECRETS ---------- */
function drawProof(){const rows=[cfg.bind];if(!cfg.bind.every((c,i)=>c==cfg.alt[i]))rows.push(cfg.alt);
 rows.forEach((r,ri)=>r.forEach((c,l)=>{const x=16+l*50,y=H-62-(rows.length-1-ri)*52,on=held[c]||(ri==0&&touchOn()&&keys['L'+l]);X.fillStyle=on?'rgba(255,255,255,.88)':'rgba(0,0,0,.55)';X.fillRect(x,y,44,44);X.strokeStyle='#fff';X.lineWidth=2;X.strokeRect(x,y,44,44);X.fillStyle=on?'#000':'#fff';X.font='22px MArial, Arial';X.textAlign='center';X.fillText(lab(c),x+22,y+30)}))}
function drawSecretHud(G){const t=[];if(G.xr&&Math.abs(G.xr-1)>.01)t.push('speed x'+G.xr.toFixed(2)+'  (5 = normal)');if(G.fc)t.push('freecam: drag = move, wheel = zoom, I/J/K/L = move, 6 = exit');
 if(!t.length)return;X.font='18px MArial, Arial';X.textAlign='left';X.fillStyle='#fff';t.forEach((s,i)=>X.fillText(s,16,66+i*24));X.textAlign='center'}
function toggleFc(G){G.fc=!G.fc;if(G.fc){G.fx=G.cx;G.fy=G.cy;G.fz=G.zoom}}
function secretKeys(G,dt){const up=(held.Digit4||held.Numpad4)&&!('Digit4' in KM)&&!('Numpad4' in KM),dn=(held.Digit3||held.Numpad3)&&!('Digit3' in KM)&&!('Numpad3' in KM);
 if(up)G.xr=Math.min(3,(G.xr||1)+dt*.3);if(dn)G.xr=Math.max(.25,(G.xr||1)-dt*.3);
 const r=Math.min(4,Math.max(.25,(G.rate||1)*(G.xr||1)));if(G.xrA!==r&&(G.xr||1)!==1||G.xrA!==undefined&&G.xrA!==r){G.xrA=r;for(const a of[G.inst,G.voc]){a.preservesPitch=a.mozPreservesPitch=a.webkitPreservesPitch=false;a.playbackRate=r}}
 if(G.fc){const s=700*dt/G.fz,k=c=>held[c]&&!(c in KM);if(k('KeyJ'))G.fx-=s;if(k('KeyL'))G.fx+=s;if(k('KeyI'))G.fy-=s;if(k('KeyK'))G.fy+=s}}

/* ---------- SETTINGS ---------- */
const PRE={WASD:['KeyA','KeyS','KeyW','KeyD'],DFJK:['KeyD','KeyF','KeyJ','KeyK']};
let cfg={bind:PRE.WASD.slice(),alt:['ArrowLeft','ArrowDown','ArrowUp','ArrowRight'],touch:0,pix:1,proof:0,hid:0,cz:1,cs:1,down:0,cm:1,ghost:1,ap:1,gh:1};
try{Object.assign(cfg,JSON.parse(localStorage.jdset||'{}'))}catch(e){}
const lab=c=>({ArrowLeft:'←',ArrowDown:'↓',ArrowUp:'↑',ArrowRight:'→',Space:'space'}[c]||c.replace(/^(Key|Digit)/,''));
function buildKM(){KM={};cfg.alt.forEach((c,l)=>{if(c)KM[c]=l});cfg.bind.forEach((c,l)=>{if(c)KM[c]=l})}
const saveCfg=()=>{try{localStorage.jdset=JSON.stringify(cfg)}catch(e){}buildKM()};
const touchOn=()=>cfg.touch==1||(cfg.touch==0&&(navigator.maxTouchPoints>0||'ontouchstart' in window));
const layName=()=>cfg.bind.join()==PRE.WASD.join()?'WASD':cfg.bind.join()==PRE.DFJK.join()?'DFJK':'custom';
const ARR=['ArrowLeft','ArrowDown','ArrowUp','ArrowRight'];
const klab=c=>{if(!c||/^(Arrow|Enter|Escape|Shift|Control|Alt|Tab|Backspace|Delete|Home|End|Insert|Page|CapsLock|F\d)/.test(c))return'';const m={Space:' ',Slash:'/',Period:'.',Comma:',',BracketLeft:'[',BracketRight:']',Semicolon:';',Equal:'+',Minus:'-',Backquote:'`',Quote:'"',Backslash:'\\'};if(c in m)return m[c];if(/^Numpad\d$/.test(c))return c.slice(6);return c.replace(/^(Key|Digit)/,'')};
const kname=c=>!c?'---':c.startsWith('Arrow')?c.slice(5).toUpperCase():c.replace(/^(Key|Digit)/,'').toUpperCase();
/* OptionsState: buttons / visuals / gaemplay (random x + random spaces like the original); options from VisualsUISubState + GameplaySettingsSubState */
const SOPT={visuals:[['hide hud','hid'],['camera zooms','cz'],['combo stacking','cs'],['pixel notes','pix'],['proof (show keys)','proof']],gaemplay:[['downscroll','down'],['copyrighted music','cm'],['ghost tapping','ghost'],['auto pause','ap'],['sustains as one note','gh']]};
const SNAMES=['buttons','visuals','gaemplay'],CROWS=['Left','Down','Up','Right'];
let SE={sel:0,wait:0,scr:'main',slot:0,off:300,words:SNAMES.slice()};buildKM();
function reroll(){SE.off=100+Math.random()*550;SE.words=SNAMES.map(w=>[...w].map(c=>(Math.random()<.1?' ':'')+c).join(''))}
function openSet(){SE.scr='main';SE.sel=0;SE.wait=0;SE.slot=0;reroll();if(!SE.kI)L('images/k.png').then(i=>SE.kI=i).catch(()=>{});S='set'}
function sback(){saveCfg();if(SE.scr=='main'){S=SE.ret||'menu';SE.ret=0}else{SE.sel=SNAMES.indexOf(SE.scr==('gaemplay')?'gaemplay':SE.scr);SE.scr='main'}}
const srow=(sc,i,n)=>sc=='buttons'?(i<4?248+78*i+30:i==4?590:650):H/2-23+60*(i-n/2)+50+23;
function sact(i){const sc=SE.scr;snd('sounds/click.ogg').play();
 if(sc=='main'){SE.scr=SNAMES[i];SE.sel=0;SE.slot=0}
 else if(sc=='buttons'){if(i<4)SE.wait=[i,SE.slot];else if(i==4){cfg.touch=(cfg.touch+1)%3;saveCfg()}else{cfg.bind=PRE.WASD.slice();cfg.alt=ARR.slice();saveCfg()}}
 else{const k=SOPT[sc][i][1];cfg[k]=cfg[k]?0:1;saveCfg()}}
function sett(dt){
 const sc=SE.scr,n=sc=='main'?3:sc=='buttons'?6:SOPT[sc].length,nav=d=>{SE.sel=(SE.sel+n+d)%n;snd('sounds/click.ogg').play()};
 for(const k of pressed){
  if(SE.wait){if(k!='Escape'){const[l,sl]=SE.wait,me=sl?cfg.alt:cfg.bind,old=me[l];for(const arr of[cfg.bind,cfg.alt])for(let j=0;j<4;j++)if(arr[j]==k&&!(arr===me&&j==l))arr[j]=old;me[l]=k;saveCfg()}SE.wait=0;continue}
  if(k=='ArrowUp'||k=='KeyW')nav(-1);else if(k=='ArrowDown'||k=='KeyS')nav(1);
  else if(k=='Escape'||k=='Backspace')sback();
  else if(k=='Digit4'&&sc=='main'){reroll();snd('sounds/click.ogg').play()}
  else if(k=='Enter'||k=='Space')sact(SE.sel);
  else if(sc=='buttons'&&SE.sel<4&&(k=='ArrowLeft'||k=='ArrowRight'||k=='KeyA'||k=='KeyD'))SE.slot=1-SE.slot;
  if(S!='set')return}
 for(const[cx,cy]of clicks){if(SE.wait||S!='set')break;if(cx<120&&cy<50){sback();continue}
  for(let i=0;i<n;i++)if(Math.abs(cy-srow(sc,i,n))<(sc=='buttons'?36:30)){if(sc=='buttons'&&i<4)SE.slot=cx>625?1:0;SE.sel=i;sact(i);break}}
 if(S!='set')return;
 X.fillStyle='#000';X.fillRect(0,0,W,H);X.textBaseline='middle';X.textAlign='left';
 if(sc=='main'){X.font='40px MArial, Arial';SE.words.forEach((w,i)=>{X.fillStyle=i==SE.sel?'#ff0':'#fff';X.fillText(w,SE.off,srow(sc,i,3))})}
 else if(sc=='buttons'){X.font='24px MArial, Arial';X.fillStyle='#fff';X.textAlign='center';X.fillText('NOTES',W/2,170);X.textAlign='left';
  for(let i=0;i<4;i++){const y=srow(sc,i,6);X.globalAlpha=i==SE.sel?1:.6;X.fillStyle='#fff';X.fillText(CROWS[i],75,y);
   [cfg.bind,cfg.alt].forEach((arr,sl)=>{const bx=350+sl*300,w=X.measureText(kname(arr[i])).width;X.fillText(SE.wait&&SE.wait[0]==i&&SE.wait[1]==sl?'?':kname(arr[i]),bx+110,y);if(i==SE.sel&&SE.slot==sl){X.fillStyle='#fff';X.fillRect(bx+110,y+16,Math.max(w,12),2)}X.fillStyle='#fff'})}
  X.globalAlpha=1;X.textAlign='center';[['touch controls: '+['auto','on','off'][cfg.touch],4],['Reset to Default Keys',5]].forEach(([t,i])=>{X.globalAlpha=i==SE.sel?1:.6;X.fillText(t,W/2,srow(sc,i,6))});X.globalAlpha=1;
  if(SE.wait){X.font='18px MArial, Arial';X.fillText('press a key to bind it (esc = cancel)',W/2,H-30)}}
 else{const Ls=SOPT[sc];X.font='40px MArial, Arial';
  Ls.forEach(([nm,key],i)=>{X.font='40px MArial, Arial';const w=X.measureText(nm).width,y=srow(sc,i,Ls.length);X.fillStyle=i==SE.sel?'#ff0':'#fff';X.font='28px MArial, Arial';X.fillText(nm,SE.off+w*.15,y);
   const on=!!cfg[key],bx=SE.off+w,by=y-23+9;if(SE.kI){if(on)X.drawImage(SE.kI,0,0,29,27,bx,by,29,27);else X.drawImage(SE.kI,29,0,24,26,bx,by,24,26)}else{X.fillStyle='#fff';X.fillText(on?'[x]':'[ ]',bx,y)}})}
 X.textBaseline='alphabetic';X.textAlign='left';if(touchOn()){X.font='16px MArial, Arial';X.fillStyle='#aaa';X.fillText('‹ back',16,28)}X.textAlign='center'}

/* ---------- LOOP ---------- */
addEventListener('keydown',e=>{if(e.repeat)return;if(e.code in KM||e.code=='Enter'||e.code=='Escape'||e.code.startsWith('Arrow'))e.preventDefault();
 pressed.push(e.code);held[e.code]=1;keys.sh=e.shiftKey;if(e.code in KM)keys['L'+KM[e.code]]=1;
 if(S=='start'&&e.code=='Enter')boot()});
addEventListener('keyup',e=>{held[e.code]=0;if(e.code in KM)keys['L'+KM[e.code]]=0});
const clicks=[],tap=[],tl={};
const mpos=e=>{if(e.pointerType!='mouse')return;const r=cv.getBoundingClientRect();MS.on=1;MS.x=(e.clientX-r.left)*cv.width/r.width;MS.y=(e.clientY-r.top)*cv.height/r.height};
cv.addEventListener('pointermove',mpos);cv.addEventListener('pointerdown',mpos);cv.addEventListener('pointerleave',()=>{MS.on=0});
addEventListener('blur',()=>{if(cfg.ap&&S=='play'&&g&&g.go&&!g.paused&&!g.dead&&!g.vid)pauseGame()});
let fcDrag=null;cv.addEventListener('pointerdown',e=>{if(S=='play'&&g&&g.fc){fcDrag=[e.clientX,e.clientY];try{cv.setPointerCapture(e.pointerId)}catch(_){}}});
cv.addEventListener('pointermove',e=>{if(fcDrag&&g&&g.fc){const sc=cv.width/cv.clientWidth;g.fx-=(e.clientX-fcDrag[0])*sc/g.fz;g.fy-=(e.clientY-fcDrag[1])*sc/g.fz;fcDrag=[e.clientX,e.clientY]}});
cv.addEventListener('pointerup',()=>{fcDrag=null});
cv.addEventListener('wheel',e=>{if(S=='play'&&g&&g.fc){e.preventDefault();g.fz=Math.min(4,Math.max(.15,g.fz*Math.exp(-e.deltaY*.001)))}},{passive:false});
cv.addEventListener('pointerdown',e=>{if(S=='start')boot();const r=cv.getBoundingClientRect(),p=[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H];clicks.push(p);
 if(touchOn()&&p[0]<110&&p[1]<40&&S=='elev')pressed.push('Escape');
 if(S=='play'&&g&&!g.vid&&touchOn()&&p[1]>40){const l=Math.min(3,Math.max(0,Math.floor(p[0]/(W/4))));tl[e.pointerId]=l;keys['L'+l]=1;tap.push(l)}});
const up=e=>{if(e.pointerId in tl){keys['L'+tl[e.pointerId]]=0;delete tl[e.pointerId]}};['pointerup','pointercancel','pointerleave'].forEach(n=>cv.addEventListener(n,up));
function boot(){S='boot';Promise.all([['MArial','ARIAL.TTF'],['MArialI','ArialCEItalic.ttf']].map(([n,f])=>new FontFace(n,'url('+A+'fonts/'+f+')').load().then(x=>document.fonts.add(x)).catch(()=>{}))).then(initMenu).catch(e=>{err=e.message;S='err'})}
addEventListener('unhandledrejection',e=>{err=(e.reason&&e.reason.message)||String(e.reason);S='err'});
let last=performance.now();
(function loop(now){
 const dt=Math.min(.05,(now-last)/1000);last=now;
 try{if(S=='menu')menu(dt);else if(S=='elev')elev(dt);else if(S=='set')sett(dt);else if(S=='cred')cred(dt);else if(S=='play')play(dt);else{
  X.fillStyle='#000';X.fillRect(0,0,W,H);X.fillStyle='#fff';X.textAlign='center';X.font='32px MArial, Arial';
  X.fillText(S=='start'?'Click or press Enter to start':S=='err'?'Error: '+err:(LP.msg||'Loading...'),W/2,H/2);if(S=='load'&&LP.t){const bw=360,pr=Math.min(1,LP.n/LP.t);X.strokeStyle='#fff';X.lineWidth=2;X.strokeRect(W/2-bw/2,H/2+30,bw,18);X.fillRect(W/2-bw/2+3,H/2+33,(bw-6)*pr,12)}}}
 catch(e){err=e.message;S='err';console.error(e)}
 {const sh=MS.on&&CUR.width&&(S=='menu'||S=='elev'||S=='set'||S=='cred'||(S=='play'&&g&&(g.paused||g.dead||g.fc)));if(sh){X.globalAlpha=1;X.drawImage(CUR,MS.x-5,MS.y-5)}if(sh!==MS.show){MS.show=sh;cv.style.cursor=sh?'none':''}}
 pressed.length=0;clicks.length=0;tap.length=0;requestAnimationFrame(loop)})(last);

/* ---------- CODE WALL (matrix bg from the stage script) ---------- */
function mkCode(){const cols=[];for(let i=0;i<106;i++){const c=document.createElement('canvas');c.width=18;c.height=96;const x=c.getContext('2d');x.fillStyle='#0f0';x.font='24px vcr, monospace';x.textAlign='center';for(let j=0;j<4;j++)x.fillText(Math.random()<.5?'0':'1',9,22+j*24);cols.push(c)}return cols}
function drawCode(G,al){const y0=100,h=864,vt=G.cy-H/2/G.zoom-120,vb=G.cy+H/2/G.zoom+120;X.save();X.globalAlpha=al;
 G.code.forEach((c,i)=>{const o=(((i%2?-1:1)*G.tm*100)%96+96)%96;for(let y=Math.floor((vt-o)/96)*96+o;y<vb;y+=96)X.drawImage(c,i*18,y)});
 const gr=X.createLinearGradient(0,y0,0,y0+h);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'#000');X.fillStyle=gr;X.fillRect(0,y0,1920,h);X.restore()}

/* ---------- ELEVATOR (song select) ---------- */
const SONGS=['johndoe','devilish','1','bloxwatch','joy','rockhard','noli','bloxpin','bloxpin-scary','bloody-mary','strawberry','obby-for-succ','party-time','iloveyou'].map(n=>({n,soon:!['johndoe','devilish','1','strawberry','obby-for-succ','bloxwatch','joy','noli','bloxpin','bloxpin-scary','bloody-mary','rockhard','party-time','iloveyou'].includes(n)})),
 HID=['nuhh uh','licky lee','well this is a little secret haha','dingalingaling','rofl copter','loltastic!','tophat guy','locked haha','???','goofy ahh mod who gets it'],
 LOAD=['loadingg;','lo adoin','load     ?','loaing','give me a moment','ok wait','hi','okay','uhhhh hello?','k','well hey'],
 pick_=a=>a[Math.random()*a.length|0],fp=(fr,t)=>fr[Math.min(fr.length-1,Math.floor(t*24))];
let E=null;
async function openElev(){
 S='load';
 if(!E){const[el,lock,grad,da,tv,pl,db,st,cb]=await Promise.all([L('menu/elev/elevator.png'),L('menu/elev/360.png'),L('menu/elev/grad.png'),atlas('menu/elev/doors'),atlas('menu/elev/tv'),atlas('menu/elev/play'),atlas('menu/elev/diffbutton'),atlas('menu/elev/i_just_lost_my_dawggg'),atlas('menu/elev/copyrightbutton')]);
  E={el,lock,grad,da,tv,pl,db,st,cb,cc:0,fl:await J('music/free/list.json'),sel:0,ex:(W-el.width)/2,ey:(H-el.height)/2}}
 Object.assign(E,{z:4,zz:0,dp:null,bp:0,mt:0,txt:SONGS[E.sel].n});emusic();tw(E,'z',1.5,.6,'sineOut');S='elev'}
function emusic(){const e=E;let i;do{i=Math.random()*e.fl.length|0}while(i==e.last&&e.fl.length>1);e.last=i;if(e.m)e.m.onended=null;e.m=snd('music/free/'+e.fl[i].f+'.ogg');e.m.onended=emusic;e.nm=e.fl[i].n;e.m.play().catch(()=>{})}
function pick(d){const e=E;e.sel=(e.sel+d+SONGS.length)%SONGS.length;e.mt=0;e.txt=SONGS[e.sel].n;snd('sounds/click.ogg').play()}
function go(){const e=E;if(SONGS[e.sel].soon){e.txt='Coming soon!';e.shk=.12;snd('sounds/lockSound.ogg').play();return}e.bp=.15;e.txt=pick_(LOAD);e.dp=0;e.mt=0;e.m.onended=null;e.m.pause();snd('sounds/letsgo.ogg').play()}
function elev(dt){
 const e=E,ex=e.ex,ey=e.ey;tick(dt);e.mt+=dt;if(e.dp!=null)e.dp+=dt;if(e.bp>0)e.bp-=dt;
 if(e.dp!=null&&e.dp>.67&&!e.zz){e.zz=1;tw(e,'z',5,.6,'quadInOut')}
 if(e.dp!=null&&e.dp>1.3){e.dp=null;e.m.onended=null;e.m.pause();startSong(SONGS[e.sel].n);return}
 if(e.dp==null){
  for(const k of pressed){
   if(k=='ArrowUp'||k=='ArrowLeft'||k=='KeyW'||k=='KeyA')pick(-1);
   if(k=='ArrowDown'||k=='ArrowRight'||k=='KeyS'||k=='KeyD')pick(1);
   if(k=='Enter')go();
   if(k=='Escape'){e.m.onended=null;e.m.pause();snd('sounds/cancelMenu.ogg').play();S='menu';M.music.currentTime=0;M.music.play().catch(()=>{});return}}
  for(const[cx,cy]of clicks){const x=(cx-W/2)/1.5+W/2,y=(cy-H/2)/1.5+H/2;
   if(Math.abs(x-(W/2+170))<25&&Math.abs(y-150.5)<20){e.cc^=1;snd('sounds/click.ogg').play()}
   else if(x>ex+280&&x<ex+408&&y>ey+220&&y<ey+284)go();
   else if(x>ex+615&&x<ex+679&&y>ey+220&&y<ey+250)pick(-1);
   else if(x>ex+615&&x<ex+679&&y>ey+250&&y<ey+282)pick(1)}}
 X.fillStyle='#000';X.fillRect(0,0,W,H);X.save();if(e.shk>0){e.shk-=dt;X.translate((Math.random()-.5)*14,(Math.random()-.5)*14)}X.translate(W/2,H/2);X.scale(e.z,e.z);X.translate(-W/2,-H/2);
 X.drawImage(e.el,ex,ey);
 const cl=e.da.get('closed')[0];df(e.da,e.dp!=null?fp(e.da.get('dooranim'),e.dp):cl,ex+347,ey+146);
 const bi=e.db.get('bidle')[0];df(e.db,bi,ex+615,ey+220);
 X.save();X.translate(ex+615,ey+250+bi.fh);X.scale(1,-1);df(e.db,bi,0,0);X.restore();
 df(e.pl,e.pl.get(e.bp>0?'ppress':'pidle')[0],ex+280,ey+220);
 const st=e.tv.get('static');df(e.tv,e.mt*24<st.length?fp(st,e.mt):e.tv.get('tv')[0],ex+150,ey,.95);
 if(false)X.drawImage(e.lock,ex+347+cl.fw/2-e.lock.width/4,ey+146+cl.fh/2-e.lock.height/4,e.lock.width/2,e.lock.height/2);
 X.fillStyle='#fff';X.textAlign='center';X.font='18px MArial, Arial';X.fillText(e.txt,W/2,ey+128);
 let b=0,c=0;try{b=+localStorage['jdb_'+SONGS[e.sel].n]||0;c=+localStorage['jdc_'+SONGS[e.sel].n]||0}catch(x){}
 if(!SONGS[e.sel].soon){const sf=e.st.get(['outline','bronze','silver'][c]),f=sf[Math.floor(e.mt*24)%sf.length];df(e.st,f,ex+613,ey+186,30/f.fw)}
 X.drawImage(e.grad,(W-e.grad.width)/2,(H-e.grad.height)/2);
 X.globalAlpha=.6;X.fillStyle='#000';X.fillRect((W-400)/2,129,400,43);X.globalAlpha=1;
 X.fillStyle='#0f0';X.font='14px MArial, Arial';X.fillText('now playing:',W/2,142);X.fillStyle='#fff';X.font='16px MArial, Arial';X.fillText(e.nm||'',W/2,162);const cf=e.cb.get(e.cc?'c':'nc')[0];df(e.cb,cf,W/2+170-cf.fw*.375,150.5-cf.fh*.375,.75);
 if(!SONGS[e.sel].soon){X.font='20px MArial, Arial';X.textAlign='left';X.textBaseline='middle';X.fillStyle='#fff';const w0=X.measureText('penisSocre').width;X.fillText('score '+b,ex+150+(157-w0)/2,ey+131);X.textAlign='center';X.textBaseline='alphabetic'}
 X.restore();if(touchOn()){X.fillStyle='#fff';X.font='20px MArial, Arial';X.textAlign='left';X.fillText('‹ back',12,28)}if(e.dp!=null&&e.dp>.8){X.fillStyle='rgba(0,0,0,'+Math.min(1,(e.dp-.8)/.35)+')';X.fillRect(0,0,W,H)}}

/* ---------- PAUSE ---------- */
function pauseGame(){const G=g;if(G.paused||G.dead)return;G.paused=1;G.psel=0;G.pt=0;G.inst.pause();G.voc.pause();(G.sfx||[]).forEach(a=>a.pause());
 G.vwas=G.vids.filter(v=>!v.paused&&!v.ended&&v.currentTime>0);G.vwas.forEach(v=>v.pause());
 const c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;c.getContext('2d').drawImage(cv,0,0);G.snap=c}
function pauseMenu(dt){const G=g;G.pt+=dt;
 const fr=G.pa.get(['resume','restart','setting','leave'][G.psel]),f=fr[Math.floor(G.pt*24)%fr.length],y=-f.fh+((H-f.fh)/2+f.fh)*Math.min(1,G.pt/.1);
 const act=i=>{if(i==0){G.paused=0;(G.sfx||[]).forEach(a=>{if(!a.ended&&a.currentTime>0&&a.volume>0)a.play().catch(()=>{})});if(G.go){G.rs=1;G.rsT=0;try{G.inst.currentTime=Math.max(0,G.pos/1000);G.voc.currentTime=Math.max(0,G.pos/1000)}catch(e){}G.rsC=G.inst.currentTime;G.inst.play().catch(()=>{});G.voc.play().catch(()=>{})}else G.vwas.forEach(v=>v.play().catch(()=>{}))}
  else if(i==1){G.paused=0;G.inst.pause();G.voc.pause();startSong(G.id)}
  else if(i==2){SE.ret='play';openSet()}else{G.paused=0;endSong()}};
 for(const k of pressed){if(G.pt<.1)continue;
  if(k=='ArrowUp'||k=='KeyW')G.psel=(G.psel+3)%4;else if(k=='ArrowDown'||k=='KeyS')G.psel=(G.psel+1)%4;
  else if(k=='Enter'){act(G.psel);return}else if(k=='Escape'){act(0);return}}
 for(const[cx,cy]of clicks){if(G.pt<.1)continue;const i=Math.floor((cy-y)/f.fh*4);if(i>=0&&i<4){G.psel=i;act(i);return}}
 X.drawImage(G.snap,0,0);X.fillStyle='rgba(0,0,0,'+.5*Math.min(1,G.pt/.1)+')';X.fillRect(0,0,W,H);df(G.pa,f,(W-f.fw)/2,y)}

/* ---------- GAME OVER (port of the mod's custom screen in scripts/notes.hx) ---------- */
const DTX=['you F###ing Suck','well you died','good job\nyou died','youre what we used to call. a noob ok.','guest wouldnt be proud of you','k.','well hey','uhhhh hello?'];
function die(){const G=g;G.dead=1;G.inst.pause();G.voc.pause();G.vids.forEach(v=>v.pause());
 const c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;c.getContext('2d').drawImage(cv,0,0);G.snap=c;
 G.dtm=0;G.dtx=pick_(DTX);G.dsel=0;G.dend=0;G.dmus=0}
function death(dt){const G=g,cl=(v,m=1)=>Math.min(m,Math.max(0,v)),qo=t=>1-(1-t)*(1-t),T=1.267;G.dtm+=dt;
 if(!G.dmus&&G.dtm>T){G.dmus=snd('music/gameOver.ogg',1);G.dmus.play().catch(()=>{})}
 for(const k of pressed){if(G.dend)break;
  if(k=='ArrowLeft'||k=='KeyA'){G.dsel=0;snd('sounds/click.ogg').play()}else if(k=='ArrowRight'||k=='KeyD'){G.dsel=1;snd('sounds/click.ogg').play()}
  else if(k=='Enter')G.dend=.001}
 for(const[cx]of clicks)if(!G.dend){G.dsel=cx<W/2?0:1;G.dend=.001}
 if(G.dend&&G.dend<.002){snd(G.dsel?'sounds/quit.ogg':'sounds/confirm.ogg').play()}
 if(G.dend){G.dend+=dt;if(G.dmus)G.dmus.volume=Math.max(0,1-G.dend/1.8);if(G.dend>2.4){if(G.dmus)G.dmus.pause();if(G.dsel)endSong();else startSong(G.id);return}}
 const out=G.dend?1-cl((G.dend-.4)/(T-.8)):1;
 X.fillStyle='#000';X.fillRect(0,0,W,H);
 X.globalAlpha=1-cl(G.dtm/(T-1));X.drawImage(G.snap,0,0);X.globalAlpha=1;
 X.fillStyle='rgba(0,0,0,'+qo(cl(G.dtm/T))*out+')';X.fillRect(0,0,W,H);
 const u=G.dtm-2-T,a1=Math.sin(cl((G.dtm-2)/T)*Math.PI/2)*out,mv=qo(cl(u/T)),a2=qo(cl(u/(T+.2)))*out,a3=qo(cl((u-(T+.2)-(T-.2))/T))*out;
 X.textAlign='center';X.textBaseline='middle';
 X.globalAlpha=a1;X.fillStyle='#f00';X.font='80px MArial, Arial';X.fillText('GAME OVER',W/2,350+(167-350)*mv);
 X.globalAlpha=a2;X.fillStyle='#fff';X.font='30px MArial, Arial';const ls=G.dtx.split('\n');ls.forEach((l,i)=>X.fillText(l,W/2,390+(217-390)*mv+i*36));
 X.globalAlpha=a3;X.font='40px MArial, Arial';X.fillStyle=G.dsel==0?'#ff0':'#fff';X.fillText('again',W/2-100,540);X.fillStyle=G.dsel==1?'#ff0':'#fff';X.fillText('die forever',W/2+120,540);
 X.globalAlpha=1;X.textBaseline='alphabetic'}

/* ---------- CREDITS ("members" screen, port of CreditsState.hx) ---------- */
const CRED=[['infry - did literally all the art and coded','https://x.com/Infry20'],['data - coded a bunch','https://x.com/_data5'],['staticfyre -  also coded stuff','https://x.com/staticfyre'],['funkypop - songs and mac build','https://x.com/funkypoppp'],['vladosikos17 - songs and chart.','https://x.com/vladosikos16'],['bubu - john doe','https://x.com/bubureal__'],['ahloof - 1x song hello thx','https://x.com/ahhhloof'],['checkty - noli','https://x.com/checkty_'],['grave - bloxpin','https://x.com/konn_artist'],['punkett - let us have bloxpin ty','https://x.com/_punkett'],['fidy50 - charted almost everything','https://x.com/50Fidy'],['estrogenStorm - va and charted devilish','https://x.com/Estrogen_Storm'],['ciphieVA - well. va','https://x.com/CiphieVA'],['headdzo - bloody mary yes','https://x.com/WhoUsedHeaddzo'],['grace - chart bloody mary thx','https://x.com/graceusamaa']];
let CR=null;
async function openCred(){S='load';if(!CR)CR={bg:await L('menu/cock.png'),sel:0};CR.sel=0;S='cred'}
function cred(dt){const c=CR,n=CRED.length,step=keys.sh?3:1,ty=i=>420+20.5*(i-n/2);
 const ch=d=>{c.sel=((c.sel+d)%n+n)%n;snd('sounds/click.ogg').play()};
 for(const k of pressed){if(k=='ArrowUp'||k=='KeyW')ch(-step);else if(k=='ArrowDown'||k=='KeyS')ch(step);
  else if(k=='Enter')window.open(CRED[c.sel][1],'_blank');else if(k=='Escape'){S='menu';return}}
 for(const[cx,cy]of clicks){if(cx<110&&cy<40){S='menu';return}const x=(cx-W/2)/1.15+W/2,y=(cy-H/2)/1.15+H/2,i=Math.floor((y-ty(0))/20.5);
  if(x>300&&i>=0&&i<n){if(i==c.sel)window.open(CRED[i][1],'_blank');else{c.sel=i;snd('sounds/click.ogg').play()}}}
 X.fillStyle='#000';X.fillRect(0,0,W,H);X.save();X.translate(W/2,H/2);X.scale(1.15,1.15);X.translate(-W/2,-H/2);
 X.drawImage(c.bg,(W-c.bg.width)/2,(H-c.bg.height)/2);
 X.font='13.6px MArialI, Arial';X.fillStyle='#000';X.textAlign='left';X.textBaseline='top';
 CRED.forEach((r,i)=>X.fillText(r[0],325,ty(i)));
 X.fillRect(325,ty(c.sel)+15,310,3);X.textBaseline='alphabetic';X.restore();
 if(touchOn()){X.fillStyle='#fff';X.font='20px MArial, Arial';X.textAlign='left';X.fillText('\u2039 back',12,28)}}

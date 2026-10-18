// FNF: Hello John Doe - browser port (core: menu + "John Doe"). Reads original Psych Engine assets.
const cv=document.getElementById('c'),W=960,H=720,A='assets/';let X=cv.getContext('2d');const tc=document.createElement('canvas'),tx=tc.getContext('2d');
cv.width=W;cv.height=H;
const fit=()=>{const s=Math.min(innerWidth/W,innerHeight/H);cv.style.width=W*s+'px';cv.style.height=H*s+'px'};onresize=fit;fit();
const L=s=>new Promise((r,j)=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>j(Error('Missing file: '+A+s));i.src=A+s});
const J=p=>fetch(A+p).then(r=>{if(!r.ok)throw Error('Missing file: '+A+p);return r.json()});
const snd=(p,loop,v=1)=>{const a=new Audio(A+p);a.loop=!!loop;a.volume=v;return a};
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
ease.bounceInOut=t=>{const o=u=>{const n=7.5625,d=2.75;if(u<1/d)return n*u*u;if(u<2/d)return n*(u-=1.5/d)*u+.75;if(u<2.5/d)return n*(u-=2.25/d)*u+.9375;return n*(u-=2.625/d)*u+.984375};return t<.5?(1-o(1-2*t))/2:(1+o(2*t-1))/2};ease.expoOut=t=>t>=1?1:1-Math.pow(2,-10*t);
let T=[];const tw=(o,k,to,d,e)=>{if(!(d>0)){o[k]=to;return}T.push({o,k,a:o[k],b:to,d,e:ease[e]||ease.linear,t:0})};
const tick=dt=>{T=T.filter(q=>{q.t+=dt;const p=Math.min(1,q.t/q.d);q.o[k_(q)]=q.a+(q.b-q.a)*q.e(p);return p<1})};const k_=q=>q.k;
const rnd=a=>{const s=Math.sin(a*12.9898)*43758.5453;return s-Math.floor(s)};
const keys={},pressed=[];let KM={};
let S='start',err='',M={},g=null;

class Ch{
 constructor(d,at,x,y){this.d=d;this.a=at;this.x=x+d.position[0];this.y=y+d.position[1];this.an={};
  for(const n of d.animations){let fr=at.pre(n.name);if(n.indices&&n.indices.length)fr=n.indices.map(i=>fr[i]).filter(Boolean);if(fr.length)this.an[n.anim]={fr,fps:n.fps||24,loop:n.loop,o:n.offsets}}
  if(!this.an.idle){const k=Object.keys(this.an)[0];if(k)this.an.idle=this.an[k]}
  this.play('idle');this.sing=0;this.special=0;this.al=1;this.sc=1;this.flip=0;this.vis=true}
 spec(n){this.play(n,0);this.special=1}
 play(n,sing){const a=this.an[n];if(!a||!a.fr.length)return;this.cur=a;this.name=n;this.t=0;this.hold=0;this.sing=!!sing}
 mid(){const a=this.cur||this.an.idle,i=Math.floor((this.t||0)*a.fps),f=a.fr[a.loop?i%a.fr.length:Math.min(i,a.fr.length-1)],s=this.d.scale||1;return[this.x+f.fw*s/2,this.y+f.fh*s/2]}
 upd(dt,stepSec){this.t+=dt;if(this.special){const a=this.cur;if(!a.loop&&this.t*a.fps>=a.fr.length||a.loop&&this.t>.6){this.special=0;this.play('idle')}}if(this.sing){this.hold+=dt;if(this.hold>=this.d.sing_duration*stepSec*1.1){this.play('idle')}}}
 draw(t){if(!this.cur||this.vis===false)return;const a=this.cur,i=Math.floor(this.t*a.fps),f=a.fr[a.loop?i%a.fr.length:Math.min(i,a.fr.length-1)],s=this.d.scale||1,x=this.x-a.o[0],y=this.y-a.o[1];
  const S=s*(this.sc||1),x0=x+f.fw*(s-S)/2,y0=y+f.fh*(s-S)/2;
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
  if(k=='Enter'&&M.t>3){if(M.sel==0){snd('sounds/bass.ogg').play();M.music.pause();openElev()}else if(M.sel==2){snd('sounds/click.ogg').play();openSet()}else M.msg='Coming soon!'}}}

/* ---------- SONG ---------- */
const DIR=['LEFT','DOWN','UP','RIGHT'],COL=['purple','blue','green','red'],STS={johndoe:{cs:.9,bf:[708,150],dad:[200,100],cb:[-130,-20],cd:[200,0],zoom:.9},devilish:{bf:[708,165],dad:[200,100],cb:[0,0],cd:[-25,25],zoom:1},'1':{bf:[708,150],dad:[200,150],cb:[-75,175],cd:[125,150],zoom:.72,cs:1},strawberry:{bf:[708,150],dad:[710,150],cb:[100,100],cd:[-300,200],zoom:1.5,cs:1,snap:1,nocz:1,xo:200},'obby-for-succ':{bf:[708,165],dad:[200,100],cb:[0,0],cd:[-25,25],zoom:1,cs:1},rockhard:{bf:[708,150],dad:[200,150],cb:[-75,175],cd:[125,150],zoom:.9,cs:1},bloxwatch:{bf:[908,250],dad:[100,100],gf:[330,100],cb:[-100,50],cd:[0,75],zoom:.95,cs:.85}};let ST=STS.johndoe;const PP=n=>['rbf','rs','max','black','mirrorman'].includes(n)?ST.bf:n=='sorry'?ST.gf:ST.dad;
let XO=0;const sx=l=>(W-434)/2+107.3*l+XO,SY=50,K=.45;
async function startSong(id){
 S='load';ST=STS[id];XO=ST.xo||0;const jd=id=='johndoe';
 const[ch,ev,notes_at,logo]=await Promise.all([J('songs/'+id+'/'+id+'.json'),J('songs/'+id+'/events.json').catch(()=>null),atlas('images/noteSkins/NOTE_assets'),L('logo/'+id+'.png').catch(()=>null)]);
 const BG=jd?await Promise.all([L('images/bgs/sky.png'),L('images/bgs/floor.png'),L('images/bgs/home.png')]):id=='strawberry'?[null,null,null,await atlas('menu/fire')]:id=='obby-for-succ'?[]:id=='1'?[await atlas('images/1x1bg')]:await Promise.all([L('images/bgs/tree.png'),L('images/bgs/floo.png'),atlas('images/bgs/fuck_you_guest'),atlas('menu/fire')]);
 const[sky,floor,home]=BG;
 const cd={};for(const n of(jd?['jd','jda','die','rbf']:id=='1'?['1x1','rs']:id=='strawberry'?['bob','max']:id=='obby-for-succ'?['rbf']:id=='bloxwatch'?['black','bwdark','bw1','bw2','bye','sorry','rbf']:id=='rockhard'?['cheek','enemy','mirrorman','trans','rbf']:['guest','rbf'])){const d=await J('characters/'+n+'.json');cd[n]=new Ch(d,await atlas('images/'+d.image),PP(n)[0],PP(n)[1])}
 const pa=await atlas('menu/pause/im_pausing'),spl=await atlas('images/noteSplashes/noteSplashes');
 const bx=id=='bloxwatch'?{eyesA:await atlas('images/s/eyes'),bubA:await atlas('images/s/bubble'),spotImg:await L('images/s/spotlight.png')}:id=='rockhard'?{cbI:await L('images/cb.png'),gateI:await L('images/gate.png')}:{};
 const song=ch.song,secs=song.notes,starts=[],notes=[];let t=0,bpm=song.bpm,bb=0;
 secs.forEach(s=>{if(s.changeBPM&&s.bpm)bpm=s.bpm;starts.push({t,bpm,must:!!s.mustHitSection,b:bb});bb+=(s.sectionBeats||4);
  for(const n of s.sectionNotes)notes.push({t:n[0],l:n[1]%4,len:n[2]>0?n[2]:0,alt:n[3]==='Alt Animation',na:n[3]==='No Animation',pl:(n[1]<4)===!!s.mustHitSection,hit:0,miss:0,done:0});
  t+=(s.sectionBeats||4)*60000/bpm});
 notes.sort((a,b)=>a.t-b.t);
 const nf=COL.map((c,i)=>({h:notes_at.get(c)[0],p:notes_at.get(c+' hold piece')[0],e:notes_at.get(c+' hold end')[0],st:notes_at.get('arrow'+DIR[i])[0],pr:notes_at.get(DIR[i].toLowerCase()+' press'),cf:notes_at.get(DIR[i].toLowerCase()+' confirm')}));
 const inst=snd('songs/'+id+'/inst.ogg'),voc=snd('songs/'+id+'/voices.ogg');voc.play=(p=>function(){return p.call(this).catch(()=>{})})(voc.play);
 g={song,starts,notes,nf,na:notes_at,sky,floor,home,cd,dad:cd.jd||cd.guest||cd['1x1']||cd.bob||cd.cheek||cd.bwdark||cd.rbf,bf:cd.black||cd.rbf||cd.rs||cd.max,inst,voc,evs:mergeEv(song.events,ev&&ev.song&&ev.song.events),ei:0,si:0,pos:-1500,go:0,
  spd:song.speed,zoom:ST.zoom,cx:640,cy:360,home_a:0,floor_a:1,glitch:0,force:null,hp:1,score:0,miss:0,combo:0,pop:null,pp:{},ct:[9,9,9,9],tm:0,dUntil:0};Object.assign(g,{spl,sp:[],ba:{n:'dad',t:0},mt:20,mshow:0,hs:[],hidden:0,cz:0,timers:[],flash:0,hg:0,cover:id=='strawberry'?1:0,i0:0,pa,paused:0,dead:0,psel:0,dz:ST.zoom,lsi:-1,lb:-1,recam:1,id,jd,logo,fire:BG[3],crowdY:1200,bt:1200,fire_a:0,fa:0,ha:(id=='johndoe'||id=='devilish')?0:1,wh:id=='devilish'?1:0,tint:id=='devilish'?1:0,lg:[],pos:jd?-1500:-600,vids:jd?[]:(id=='1'?['1intro','1outro','1train','1pizza','1oof','1burger']:id=='strawberry'?['strawberryintro']:id=='obby-for-succ'?['obbyvideo']:id=='bloxwatch'?['bloxwatchintro']:['intro','monster']).map(n=>{const v=document.createElement('video');v.src=A+'videos/'+n+'.mp4';v.muted=true;v.playsInline=true;v.preload='auto';return v})});g.hs=id=='1'?g.vids.slice(2):id=='obby-for-succ'?g.vids.slice():[];if(id=='strawberry'){const v0=g.vids[0];v0.onended=v0.onerror=()=>{g.cover=0}}
 if(id=='rockhard')Object.assign(g,bx,{hudw:0,cbOn:1,gateOn:0,run:{on:0,init:0,vx:0,base:0,w:0},sev:[[64881,()=>{g.bf.vis=false}],[78095,()=>{g.cbOn=0;g.gateOn=1}]]});
 if(id=='bloxwatch')Object.assign(g,bx,{gf:cd.sorry,eyes:{al:0,an:'i',t:0},bub:{al:0,an:'i',t:0,x:ST.bf[0]-260,y:ST.bf[1]+300},spot:{x:ST.bf[0]-110,y:ST.bf[1]-80,vis:0},healthd:0,cover:1});
 if(jd){const sc=document.createElement('canvas');sc.width=sky.width;sc.height=sky.height;const c=sc.getContext('2d');c.drawImage(sky,0,0);c.globalCompositeOperation='difference';c.fillStyle='#fff';c.fillRect(0,0,sc.width,sc.height);c.globalCompositeOperation='destination-in';c.drawImage(sky,0,0);g.skyInv=sc;
 try{const ff=new FontFace('vcr','url('+A+'fonts/vcr.ttf)');await ff.load();document.fonts.add(ff)}catch(e){}
 g.code=mkCode();g.code_a=0;g.code_v=0;g.va=1;
 const v=document.createElement('video');v.src=A+'videos/oh.mp4';v.playsInline=true;g.vid=v;v.onended=v.onerror=()=>{g.vid=null};v.play().catch(()=>{g.vid=null})}
 g.cx=900;g.cy=300;if(id=='devilish'){const m=g.bf.mid(),c=g.bf.d.camera_position;g.cx=m[0]-100-c[0]+ST.cb[0];g.cy=m[1]-200+c[1]+ST.cb[1]}S='play';
 inst.onended=()=>endSong(1)}
function endSong(fin){if(S!='play')return;g.inst.pause();g.voc.pause();if(g.mus)g.mus.pause();if(g.vid)g.vid.pause();g.vids.forEach(v=>v.pause());T=[];try{const k='jdb_'+g.id;if(g.score>(+localStorage[k]||0))localStorage[k]=g.score;if(fin)localStorage['jdc_'+g.id]=Math.max(+localStorage['jdc_'+g.id]||0,g.miss?1:2)}catch(e){}openElev()}
function mergeEv(a,b){const seen=new Set(),out=[];for(const src of[a||[],b||[]])for(const e of src)for(const x of e[1]){const k=e[0]+'|'+x.join('|');if(!seen.has(k)){seen.add(k);out.push([e[0],[x]])}}return out.sort((p,q)=>p[0]-q[0])}
function fire(n,a,b){
 if(n=='Change Scroll Speed')tw(g,'spd',g.song.speed*parseFloat(a||1),parseFloat(b||0));
 else if(n=='awesomeZoom'){const p=(a||'').split(','),z=parseFloat(p[0])||1,d=isNaN(parseFloat(p[1]))?.5:parseFloat(p[1]);g.cz=0;g.dz=g.zoom;T=T.filter(q=>!(q.o===g&&(q.k=='zoom'||q.k=='dz')));tw(g,'zoom',z,d,b);tw(g,'dz',z,d,b)}
 else if(n=='Change Character'){const c=g.cd[b];if(c){c.al=(a=='dad'?g.dad:g.bf).al;c.play('idle');if(a=='dad')g.dad=c;else g.bf=c;g.recam=1}}
 else if(n=='Play Animation'){const la=(a||'').toLowerCase(),lb=(b||'').toLowerCase(),t=(la=='gf'||lb=='gf')&&g.gf?g.gf:(la=='dad'||lb=='dad'?g.dad:g.bf);t.spec(lb=='dad'||lb=='bf'||lb=='gf'?a:b)}
 else if(n=='Hey!'){g.bf.spec('hey')}
 else if(n=='Camera Follow Pos'&&a!=='')g.force=[+a,+b];
 else if(n=='Camera Follow Pos'){g.force=null;g.recam=1}
 else if(n=='logo')g.lg.push({t:-(parseFloat(b)||0),tm:parseFloat(a)||2.1});
 else if(n=='fire')tw(g,'fire_a',parseFloat(a),parseFloat(b)||0);
 else if(n=='boo'){g.bt=g.bt==600?1200:600;tw(g,'crowdY',g.bt,2,'bounceInOut')}
 else if(n=='infryzoom'){T=T.filter(q=>!(q.o===g&&q.k=='zoom'));g.dz=parseFloat(a);tw(g,'zoom',parseFloat(a),parseFloat(b)||0,'cubeOut')}
 else if(n=='intro'&&g.vids[0])g.vids[0].play().catch(()=>{});
 else if(n=='playawesomevid'){const v=g.vids[g.id=='devilish'?1:0];if(v)v.play().catch(()=>{})}
 else if(n=='outro'||n=='train'||n=='pizza'||n=='oof'||n=='burger'){const v=g.vids[{outro:1,train:2,pizza:3,oof:4,burger:5}[n]];if(v){v.play().catch(()=>{});g.mshow=0;g.mt=10+Math.random()*10}}
 else if(n=='black')g.hidden=1;
 else if(n=='evil'){
  if(a=='turn evil'){tw(g.bf,'al',0,1.5,'quadInOut');tw(g.spot,'x',g.spot.x+700,3.2,'quadInOut');fire('Change Character','dad','bw2');g.dad.spec('ok');
   g.timers.push({t:2.2,fn:()=>{g.eyes.al=1;g.eyes.an='h';g.eyes.t=0;tw(g.eyes,'al',0,1.4,'cubeOut');g.timers.push({t:1.4,fn:()=>{g.eyes.an='i';g.eyes.t=0}});g.timers.push({t:2.4,fn:()=>tw(g.eyes,'al',1,.7,'cubeOut')})}})}
  else if(a=='k'){g.cover=0;g.flash=1;tw(g,'flash',0,1)}
  else if(a=='hello')g.spot.vis=1;else if(a=='bye')g.spot.vis=0;else if(a=='well')g.hg=1;else if(a=='d')g.healthd=1;
  else if(a=='outro'){tw(g.eyes,'al',0,1,'quadIn');g.healthd=1}
  else if(a=='bfk'){g.bub.an='h';g.bub.t=0;tw(g.bub,'al',1,1,'cubeOut');g.timers.push({t:1,fn:()=>{g.bub.an='i';tw(g.bf,'al',1,.4,'quadInOut')}});g.bf.x=710;g.bf.y-=65;g.bub.y-=65}
  if(b=='comeback')g.hg=0}
 else if(n=='Fade Screen'){g.fa=0;tw(g,'fa',parseFloat(b)||0,parseFloat(a)||0)}
 else if(n===''&&a=='shader'){tw(g,'hudw',1,1)}
 else if(n===''&&a=='itburns'){T=T.filter(q=>!(q.o===g&&q.k=='hudw'));g.hudw=0;g.bf.vis=true}
 else if(n===''&&a=='penis'){g.run.base=g.dad.y;runTwo(g);g.run.init=1}
 else if(n===''&&a=='p'){tw(g,'wh',0,.6);tw(g,'ha',1,.6);tw(g,'tint',0,.6)}
 else if(n=='woah'){
  if(a=='woah'){tw(g,'home_a',1,7,'quadInOut');tw(g,'floor_a',0,7,'quadInOut')}
  else if(a=='bye'){tw(g,'home_a',0,3,'quadInOut');tw(g,'floor_a',1,3,'quadInOut')}
  else if(a=='glitch')g.glitch=1;else if(a=='noglitch')g.glitch=0;else if(a=='codeWall')g.code_v=1;else if(a=='welcome')tw(g,'code_a',1,4,'cubeOut');else if(a=='fade')tw(g,'code_a',0,1,'cubeInOut');else if(a=='nowall')g.code_v=0}}
function sing(c,l,alt,miss){if(c.special)return;const b='sing'+DIR[l];const n=miss?b+'miss':alt&&c.an[b+'-alt']?b+'-alt':b;c.play(n,1)}
function rate(d){d=Math.abs(d);return d<=45?['SICK!',350,1]:d<=90?['Good',200,.9]:d<=135?['Bad',100,.7]:['Shit',50,.5]}
function hitKey(l){
 let b=null;for(const n of g.notes){if(n.t-g.pos>166)break;if(n.pl&&!n.hit&&!n.miss&&n.l==l&&Math.abs(n.t-g.pos)<=166){b=n;break}}
 if(!b)return;b.hit=1;g.ct[l]=0;if(!b.na)sing(g.bf,l);g.voc.volume=1;
 const r=rate(b.t-g.pos);if(r[0]=='SICK!')g.sp.push({l,t:0});g.score+=r[1];g.combo++;g.hp=Math.min(2,g.hp+.023*r[2]*1.3);g.pop={t:r[0]+'  x'+g.combo,a:0}}
function play(dt){
 const G=g,stepSec=15/G.starts[G.si].bpm;
 if(G.paused){pauseMenu(dt);return}
 if(G.dead){death(dt);return}
 if(G.vid){tick(dt);const v=G.vid;X.fillStyle='#000';X.fillRect(0,0,W,H);
  if(v.videoWidth){const h=W*v.videoHeight/v.videoWidth;X.globalAlpha=G.va;X.drawImage(v,0,H/2-h/2,W,h);X.globalAlpha=1}
  if(pressed.includes('Escape')){endSong();return}
  if((pressed.includes('Enter')||clicks.length)&&!G.skip){G.skip=1;tw(G,'va',0,.6);setTimeout(()=>{v.pause();G.vid=null},650)}
  return}
 if(!G.go){G.pos+=dt*1000;if(G.pos>=0){G.go=1;G.inst.play();G.voc.play();if(G.id=='1')G.vids[0].play().catch(()=>{});if(G.jd){tw(G,'zoom',G.zoom-.1,1.67,'quadInOut');tw(G,'ha',1,1.42,'sineOut')}}}
 else{const a=G.inst.currentTime*1000;G.pos+=dt*1000;if(Math.abs(G.pos-a)>40)G.pos=a;if(G.voc.readyState>0&&Math.abs(G.voc.currentTime-G.inst.currentTime)>.12)G.voc.currentTime=G.inst.currentTime}
 const pos=G.pos;
 for(const l of tap)hitKey(l);
 for(const k of pressed){if(k in KM)hitKey(KM[k]);if(k=='Escape'||k=='Enter'){pauseGame();return}}
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
  if(!n.pl){if(!n.hit&&n.t<=pos){n.hit=1;n.done=1;G.cz=1;if(!n.na)sing(G.dad,n.l,n.alt);G.dUntil=Math.max(G.dUntil,n.t+n.len);if(n.alt&&G.hp>.1)G.hp-=.023*2.6;if(G.healthd&&G.hp>=.1)G.hp-=.023*.7}}
  else if(!n.hit&&!n.miss&&pos-n.t>166){n.miss=1;G.hp=Math.max(0,G.hp-.0475);G.combo=0;G.miss++;G.score-=10;sing(G.bf,n.l,0,1);G.voc.volume=.3;G.pop={t:'Miss',a:0}}
  else if(n.pl&&n.hit&&n.len&&!n.done){if(pos>=n.t+n.len)n.done=1;else if(keys['L'+n.l]){G.bf.hold=0;G.hp=Math.min(2,G.hp+.1*dt)}else n.done=1}}
 if(pos<G.dUntil)G.dad.hold=0;
 if(G.hp<=0){die();return}
 G.dad.upd(dt,stepSec);G.bf.upd(dt,stepSec);if(G.gf)G.gf.upd(dt,stepSec);if(G.eyes){G.eyes.t+=dt;G.bub.t+=dt}
 G.timers=G.timers.filter(o=>{o.t-=dt;if(o.t<=0){o.fn();return false}return true});G.ct=G.ct.map(v=>v+dt);if(G.pop)G.pop.a+=dt;tick(dt);
 // camera
 if(G.id=='rockhard'){rockCam(G);if(G.run.on){G.dad.x+=G.run.vx*dt;const R=G.run;if(G.dad.x>800+R.w||G.dad.x<-500-R.w)R.on=0}}
 if(G.force)G.tgt=G.force;else if(ST.snap){if(G.si!==G.lsi||!G.tgt)G.tgt=camTarget(G)}else G.tgt=camTarget(G);
 if(G.si!==G.lsi){G.lsi=G.si;if(ST.snap)G.zoom=G.starts[G.si].must?1.5:3;if(G.id=='rockhard'&&G.run.init&&!G.run.on)runTwo(G)}
 if(!G.snapped&&G.tgt){G.snapped=1;G.cx=G.tgt[0];G.cy=G.tgt[1]}
 if(ST.snap&&G.tgt){G.cx=G.tgt[0];G.cy=G.tgt[1]}
 const[tx,ty]=G.tgt||[G.cx,G.cy],k=1-Math.exp(-dt*2.4*(ST.cs||1));G.cx+=(tx-G.cx)*k;G.cy+=(ty-G.cy)*k;G.tm+=dt;
 if(ST.nocz)G.cz=0;
 if(G.go){const q=G.starts[G.si],bt=Math.floor((pos-q.t)/(60000/q.bpm))+q.b;if(bt!==G.lb){G.lb=bt;if(bt%4==0&&G.cz&&G.zoom<1.35)G.zoom+=.015}if(G.cz)G.zoom=G.dz+(G.zoom-G.dz)*Math.exp(-dt*6.25)}
 // world
 X.fillStyle='#000';X.fillRect(0,0,W,H);X.save();X.translate(W/2,H/2);X.scale(G.zoom,G.zoom);X.translate(-G.cx,-G.cy);
 if(G.id=='1')drawOne(G);else if(G.id=='devilish')drawGuest(G);else if(G.id=='strawberry')drawStrawFire(G);else if(G.id=='rockhard')drawRockBG(G);else if(G.id=='obby-for-succ'||G.id=='bloxwatch'){}else{
 if(G.glitch){const fr=Math.floor(G.tm*8),sw=G.sky.width,sk=G.sky.height;X.drawImage(G.skyInv,-228,0);for(let i=0;i<28;i++){const q=fr*3+i*1.7,y=rnd(q+2345)*sk,h=rnd(q+925)*.075*sk,o=(rnd(q+25)*2-1)*.022*sw;X.drawImage(G.sky,0,y,sw,h,-228+o,y,sw,h)}}else X.drawImage(G.sky,-228,0);
 if(G.home_a>0){X.globalAlpha=G.home_a;const s=1600/G.home.width,hw=G.home.width*s,hh=G.home.height*s;X.drawImage(G.home,100+(G.home.width-hw)/2,200+(G.home.height-hh)/2,hw,hh);X.globalAlpha=1}
 if(G.code_v&&G.code_a>0)drawCode(G,G.code_a);
 if(G.floor_a>0){X.globalAlpha=G.floor_a;X.drawImage(G.floor,130,700);X.globalAlpha=1}}
 if(G.id=='obby-for-succ'){}else if(G.id=='bloxwatch')drawBlox(G);else if(G.id=='strawberry'){G.bf.draw(0);G.dad.draw(0);drawOpp(G,pos)}else if(G.id=='rockhard'&&G.dad.y>G.bf.y){G.bf.draw(0);G.dad.draw(0)}else{G.dad.draw(G.tint);G.bf.draw(G.tint)}if(G.id=='devilish')drawGuestFront(G);X.restore();
 // notes
 if(G.hg){X.fillStyle='#000';X.fillRect(0,0,W,H)}
 for(const v of G.hs)if(v.currentTime>0&&!v.ended&&!v.paused&&v.videoWidth)X.drawImage(v,0,0,W,H);
 if(G.bub&&G.bub.al>0){const b=G.bub,q=G.bubA.get(b.an=='h'?'bubbleappear':'bubble0000'),i=Math.floor(b.t*12),f=q[b.an=='h'?Math.min(i,q.length-1):0];X.globalAlpha=b.al;dr(G.bubA,f,b.x+(f.fw-f.fw*.9)/2-f.fx*.9,b.y+(f.fh-f.fh*.9)/2-f.fy*.9,vw(f)*.9,vh(f)*.9);X.globalAlpha=1}
 const kk=K*G.spd,cy0=SY+55;
 for(let l=0;l<4;l++){const f=G.nf[l],cx=sx(l)+56;let fr=f.st;const held=keys['L'+l];
  if(G.ct[l]<.15&&f.cf.length)fr=f.cf[Math.min(f.cf.length-1,Math.floor(G.ct[l]*24))];else if(held&&f.pr.length)fr=f.pr[Math.min(f.pr.length-1,Math.floor(G.ct[l]*24))];
  df(G.na,fr,cx-fr.fw*.35,cy0-fr.fh*.35,.7,.8);X.globalAlpha=.9;X.fillStyle='#fff';X.font='20px MArial, Arial';X.textAlign='center';X.fillText(lab(cfg.bind[l]),cx,SY+112);X.globalAlpha=1}
 for(const n of G.notes){
  if(!n.pl||n.miss&&!n.len&&pos-n.t>400||n.done)continue;
  const y=n.hit?cy0:cy0+(n.t-pos)*kk;if(y>H+300)break;
  const f=G.nf[n.l],cx=sx(n.l)+56;
  if(n.len){const len=(n.t+n.len-(n.hit?pos:n.t))*kk,top=n.hit?cy0:y,eh=vh(f.e)*.7;
   if(len>0&&top<H){X.globalAlpha=n.miss?.3:.65;dr(G.na,f.p,cx-f.p.fw*.35-f.p.fx*.7,top,vw(f.p)*.7,Math.max(0,len-eh));dr(G.na,f.e,cx-f.e.fw*.35-f.e.fx*.7,top+Math.max(0,len-eh),vw(f.e)*.7,eh);X.globalAlpha=1}}
  if(!n.hit)df(G.na,f.h,cx-f.h.fw*.35,y-f.h.fh*.35,.7,n.miss?.3:1)}
 // hud
 G.sp=G.sp.filter(o=>{o.t+=dt;const q=G.spl.get('splash star '+COL[o.l]+' '),i=Math.floor(o.t*24);if(i>=q.length)return false;const f=q[i];df(G.spl,f,sx(o.l)+56-f.fw/2,SY+55-f.fh/2);return true});
 if(G.pop&&G.pop.a<.6){X.globalAlpha=1-G.pop.a/.6;X.font='bold 40px MArial, Arial';X.fillText(G.pop.t,W*.75,H/2+60);X.globalAlpha=1}
 if(touchOn()){for(let l=0;l<4;l++){X.fillStyle='rgba(255,255,255,'+(keys['L'+l]?.14:.04)+')';X.fillRect(l*W/4+2,40,W/4-4,H-40)}}
 if(G.jd){const a=pos<0?1:Math.max(0,1-pos/1670);if(a>0){X.fillStyle='rgba(0,0,0,'+a+')';X.fillRect(0,0,W,H)}}
 X.globalAlpha=G.ha;
 X.fillStyle='#f00';X.fillRect(W-70,235,20,250);X.fillStyle='#96ff00';const hh=G.hp*125;X.fillRect(W-70,485-hh,20,hh);
 X.fillStyle='#00f';X.font='30px MArialI, Arial';X.textAlign='center';X.fillText('health',W-60,520);X.globalAlpha=1;
 X.fillStyle='#000';X.fillRect(0,0,W,40);if(touchOn()){X.fillStyle='#fff';X.font='20px MArial, Arial';X.textAlign='left';X.fillText('‹ menu',12,28);X.textAlign='center'}X.globalAlpha=G.ha;X.fillStyle='#fff';X.font='30px MArial, Arial';X.fillText('time: '+Math.max(0,Math.round(((G.inst.duration||0)*1000-pos)/1000)),W/2,34);X.globalAlpha=1;
 if(G.fa>0){X.fillStyle='rgba(0,0,0,'+G.fa+')';X.fillRect(0,0,W,H)}
 if(G.flash>0){X.fillStyle='rgba(255,255,255,'+G.flash+')';X.fillRect(0,0,W,H)}
 if(G.hudw>0){X.fillStyle='rgba(255,255,255,'+G.hudw+')';X.fillRect(0,0,W,H)}
 if(G.hidden||G.cover){X.fillStyle='#000';X.fillRect(0,0,W,H)}
 for(const v of G.vids)if(!G.hs.includes(v)&&v.currentTime>0&&!v.ended&&!v.paused&&v.videoWidth)X.drawImage(v,0,0,W,H);
 if(G.mshow>0){X.fillStyle='rgba(128,128,128,.6)';X.fillRect(0,0,W,H);X.fillStyle='#000';X.font='40px MArial, Arial';X.textAlign='center';X.textBaseline='middle';X.fillText(G.mtxt,W/2,H/2);X.textBaseline='alphabetic'}
 G.lg=G.lg.filter(o=>{o.t+=dt;return o.t<o.tm*3.3});
 for(const o of G.lg){if(o.t<0||!G.logo)continue;const t=o.tm,al=o.t<t?ease.expoOut(o.t/t):1-ease.cubeOut(Math.min(1,Math.max(0,(o.t-t-1.2)/t))),sc=.6+.3*ease.quadInOut(Math.min(1,Math.max(0,(o.t-t/2)/(t*2))));
  X.globalAlpha=al;X.drawImage(G.logo,W/2-G.logo.width*sc/2,H/2-G.logo.height*sc/2,G.logo.width*sc,G.logo.height*sc);X.globalAlpha=1}}

/* ---------- CAMERA (port of PlayState.moveCamera) ---------- */
function camTarget(G){const dad=!G.starts[G.si].must,ch=dad?G.dad:G.bf,m=ch.mid(),c=ch.d.camera_position;let dx=0,dy=0;
 if(ch.cur&&ch.name&&ch.name.startsWith('sing')){const a=ch.cur,i=Math.floor(ch.t*a.fps),fi=a.loop?i%a.fr.length:Math.min(i,a.fr.length-1);
  if(fi<3){const d=ch.name.slice(4);if(d=='UP'||d=='UP-alt')dy=-15;else if(d=='DOWN'||d=='DOWN-alt')dy=15;else if(d=='LEFT'||d=='LEFT-alt')dx=-15;else if(d=='RIGHT'||d=='RIGHT-alt')dx=15}}
 return dad?[m[0]+150+c[0]+ST.cd[0]+dx,m[1]-100+c[1]+ST.cd[1]+dy]:[m[0]-100-c[0]+ST.cb[0]+dx,m[1]-100+c[1]+ST.cb[1]+dy]}

/* ---------- ROCKHARD STAGE (cheek.lua + guyRun.lua) ---------- */
function drawRockBG(G){const d=(im,x,y)=>{const w=im.width*1.12,h=im.height*1.12;X.drawImage(im,x+(im.width-w)/2,y+(im.height-h)/2,w,h)};if(G.cbOn)d(G.cbI,0,180);if(G.gateOn)d(G.gateI,100,180)}
function rockCam(G){const ch=G.starts[G.si].must?G.bf:G.dad,o=20,m={singLEFT:[-o,0],singRIGHT:[o,0],singUP:[0,-o],singDOWN:[0,o],'singLEFT-alt':[-o,0],'singRIGHT-alt':[o,0],'singUP-alt':[0,-o],'singDOWN-alt':[0,o],idle:[0,0],'idle-alt':[0,0]}[ch.name||''];if(m)G.force=[750+m[0],560+m[1]]}
function runTwo(G){const R=G.run;if(R.on)return;const f=Math.random()<.5;let sp=30000;if(Math.random()<.8)sp=7000;if(Math.random()<.1)sp=100000;
 const d=G.dad,ny=R.base+Math.floor(Math.random()*201)-100;let sc=1;if(ny<R.base)sc=.5;if(ny>R.base)sc=1.1;
 d.y=ny;d.sc=sc;d.flip=f?1:0;R.w=d.an.idle.fr[0].fw*(d.d.scale||1)*sc;R.vx=f?sp:-sp;d.x=f?-500-R.w:800+R.w;R.on=1}

/* ---------- BLOXWATCH STAGE ---------- */
function drawBlox(G){G.gf.draw(0);const e=G.eyes,h=e.an=='h',q=G.eyesA.get(h?'eyeappear':'eyes'),i=Math.floor(e.t*(h?17:24)),f=q[h?Math.min(i,q.length-1):i%q.length];
 if(e.al>0)df(G.eyesA,f,-155,210,1,e.al);
 G.dad.draw(0);G.bf.draw(0);if(G.spot.vis)X.drawImage(G.spotImg,G.spot.x,G.spot.y)}

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

/* ---------- SETTINGS ---------- */
const PRE={WASD:['KeyA','KeyS','KeyW','KeyD'],DFJK:['KeyD','KeyF','KeyJ','KeyK']};
let cfg={bind:PRE.WASD.slice(),touch:0};
try{Object.assign(cfg,JSON.parse(localStorage.jdset||'{}'))}catch(e){}
const lab=c=>({ArrowLeft:'←',ArrowDown:'↓',ArrowUp:'↑',ArrowRight:'→',Space:'space'}[c]||c.replace(/^(Key|Digit)/,''));
function buildKM(){KM={};['ArrowLeft','ArrowDown','ArrowUp','ArrowRight'].forEach((c,l)=>KM[c]=l);cfg.bind.forEach((c,l)=>KM[c]=l)}
const saveCfg=()=>{try{localStorage.jdset=JSON.stringify(cfg)}catch(e){}buildKM()};
const touchOn=()=>cfg.touch==1||(cfg.touch==0&&(navigator.maxTouchPoints>0||'ontouchstart' in window));
const layName=()=>cfg.bind.join()==PRE.WASD.join()?'WASD':cfg.bind.join()==PRE.DFJK.join()?'DFJK':'custom';
let SE={sel:0,wait:0};buildKM();
function openSet(){SE.sel=0;SE.wait=0;S='set'}
function sact(i,d){snd('sounds/click.ogg').play();
 if(i==0){cfg.bind=(layName()=='WASD'?PRE.DFJK:PRE.WASD).slice();saveCfg()}
 else if(i<=4)SE.wait=i;
 else if(i==5){cfg.touch=(cfg.touch+(d||1)+3)%3;saveCfg()}
 else if(i==6){cfg={bind:PRE.WASD.slice(),touch:0};saveCfg()}
 else{saveCfg();S=SE.ret||'menu';SE.ret=0}}
function sett(dt){
 const rows=['layout: '+layName(),...['left','down','up','right'].map((n,i)=>n+' key: '+(SE.wait==i+1?'press a key...':lab(cfg.bind[i]))),'touch controls: '+['auto','on','off'][cfg.touch],'reset to default','back'];
 for(const k of pressed){
  if(SE.wait){if(k!='Escape'){const l=SE.wait-1,o=cfg.bind.indexOf(k);if(o>=0&&o!=l)cfg.bind[o]=cfg.bind[l];cfg.bind[l]=k;saveCfg()}SE.wait=0;continue}
  if(k=='ArrowUp'||k=='KeyW')SE.sel=(SE.sel+rows.length-1)%rows.length;
  else if(k=='ArrowDown'||k=='KeyS')SE.sel=(SE.sel+1)%rows.length;
  else if(k=='Enter')sact(SE.sel);
  else if((k=='ArrowLeft'||k=='ArrowRight')&&SE.sel==5)sact(5,k=='ArrowLeft'?-1:1);
  else if(k=='Escape'){saveCfg();S=SE.ret||'menu';SE.ret=0}}
 for(const[cx,cy]of clicks){if(SE.wait||S!='set')break;const i=Math.round((cy-170)/52);
  if(cx<120&&cy<50){saveCfg();S=SE.ret||'menu';SE.ret=0}else if(i>=0&&i<rows.length&&Math.abs(cx-W/2)<300){SE.sel=i;sact(i)}}
 if(S!='set')return;
 X.fillStyle='#000';X.fillRect(0,0,W,H);X.textAlign='center';X.fillStyle='#fff';X.font='40px MArial, Arial';X.fillText('settings',W/2,100);
 X.font='28px MArial, Arial';rows.forEach((r,i)=>{X.fillStyle=i==SE.sel?'#ff0':'#fff';X.fillText(r,W/2,180+i*52)});
 X.font='16px MArial, Arial';X.fillStyle='#aaa';X.fillText('Up/Down + Enter (or tap). Arrow keys always work too. Esc = back',W/2,H-24);
 X.textAlign='left';X.fillStyle='#fff';X.fillText('‹ back',16,28)}

/* ---------- LOOP ---------- */
addEventListener('keydown',e=>{if(e.repeat)return;if(e.code in KM||e.code=='Enter'||e.code=='Escape'||e.code.startsWith('Arrow'))e.preventDefault();
 pressed.push(e.code);if(e.code in KM)keys['L'+KM[e.code]]=1;
 if(S=='start'&&e.code=='Enter')boot()});
addEventListener('keyup',e=>{if(e.code in KM)keys['L'+KM[e.code]]=0});
const clicks=[],tap=[],tl={};
cv.addEventListener('pointerdown',e=>{if(S=='start')boot();const r=cv.getBoundingClientRect(),p=[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H];clicks.push(p);
 if(touchOn()&&p[0]<110&&p[1]<40&&S=='elev')pressed.push('Escape');
 if(S=='play'&&g&&!g.vid&&touchOn()&&p[1]>40){const l=Math.min(3,Math.max(0,Math.floor(p[0]/(W/4))));tl[e.pointerId]=l;keys['L'+l]=1;tap.push(l)}});
const up=e=>{if(e.pointerId in tl){keys['L'+tl[e.pointerId]]=0;delete tl[e.pointerId]}};['pointerup','pointercancel','pointerleave'].forEach(n=>cv.addEventListener(n,up));
function boot(){S='boot';Promise.all([['MArial','ARIAL.TTF'],['MArialI','ArialCEItalic.ttf']].map(([n,f])=>new FontFace(n,'url('+A+'fonts/'+f+')').load().then(x=>document.fonts.add(x)).catch(()=>{}))).then(initMenu).catch(e=>{err=e.message;S='err'})}
addEventListener('unhandledrejection',e=>{err=(e.reason&&e.reason.message)||String(e.reason);S='err'});
let last=performance.now();
(function loop(now){
 const dt=Math.min(.05,(now-last)/1000);last=now;
 try{if(S=='menu')menu(dt);else if(S=='elev')elev(dt);else if(S=='set')sett(dt);else if(S=='play')play(dt);else{
  X.fillStyle='#000';X.fillRect(0,0,W,H);X.fillStyle='#fff';X.textAlign='center';X.font='32px MArial, Arial';
  X.fillText(S=='start'?'Click or press Enter to start':S=='err'?'Error: '+err:'Loading...',W/2,H/2)}}
 catch(e){err=e.message;S='err';console.error(e)}
 pressed.length=0;clicks.length=0;tap.length=0;requestAnimationFrame(loop)})(last);

/* ---------- CODE WALL (matrix bg from the stage script) ---------- */
function mkCode(){const cols=[];for(let i=0;i<106;i++){const c=document.createElement('canvas');c.width=18;c.height=96;const x=c.getContext('2d');x.fillStyle='#0f0';x.font='24px vcr, monospace';x.textAlign='center';for(let j=0;j<4;j++)x.fillText(Math.random()<.5?'0':'1',9,22+j*24);cols.push(c)}return cols}
function drawCode(G,al){const y0=100,h=864,vt=G.cy-H/2/G.zoom-120,vb=G.cy+H/2/G.zoom+120;X.save();X.globalAlpha=al;
 G.code.forEach((c,i)=>{const o=(((i%2?-1:1)*G.tm*100)%96+96)%96;for(let y=Math.floor((vt-o)/96)*96+o;y<vb;y+=96)X.drawImage(c,i*18,y)});
 const gr=X.createLinearGradient(0,y0,0,y0+h);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'#000');X.fillStyle=gr;X.fillRect(0,y0,1920,h);X.restore()}

/* ---------- ELEVATOR (song select) ---------- */
const SONGS=['johndoe','devilish','1','bloxwatch','joy','rockhard','noli','bloxpin','bloxpin-scary','bloody-mary','strawberry','obby-for-succ','party-time','iloveyou'].map(n=>({n,soon:!['johndoe','devilish','1','strawberry','obby-for-succ','bloxwatch','rockhard'].includes(n)})),
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
function pauseGame(){const G=g;if(G.paused||G.dead)return;G.paused=1;G.psel=0;G.pt=0;G.inst.pause();G.voc.pause();
 G.vwas=G.vids.filter(v=>!v.paused&&!v.ended&&v.currentTime>0);G.vwas.forEach(v=>v.pause());
 const c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;c.getContext('2d').drawImage(cv,0,0);G.snap=c}
function pauseMenu(dt){const G=g;G.pt+=dt;
 const fr=G.pa.get(['resume','restart','setting','leave'][G.psel]),f=fr[Math.floor(G.pt*24)%fr.length],y=-f.fh+((H-f.fh)/2+f.fh)*Math.min(1,G.pt/.1);
 const act=i=>{if(i==0){G.paused=0;if(G.go){G.inst.play();G.voc.play()}G.vwas.forEach(v=>v.play().catch(()=>{}))}
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

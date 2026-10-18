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
 return{im,f,get(p){const r=new RegExp('^'+rx(p)+'\\d*$');return f.filter(q=>r.test(q.n)).sort((a,b)=>a.n<b.n?-1:1)}}}
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
  for(const n of d.animations){let fr=at.get(n.name);if(n.indices&&n.indices.length)fr=n.indices.map(i=>fr[i]).filter(Boolean);this.an[n.anim]={fr,fps:n.fps||24,loop:n.loop,o:n.offsets}}
  this.play('idle');this.sing=0}
 play(n,sing){const a=this.an[n];if(!a||!a.fr.length)return;this.cur=a;this.t=0;this.hold=0;this.sing=!!sing}
 mid(){const f=this.an.idle.fr[0],s=this.d.scale||1;return[this.x+f.fw*s/2,this.y+f.fh*s/2]}
 upd(dt,stepSec){this.t+=dt;if(this.sing){this.hold+=dt;if(this.hold>=this.d.sing_duration*stepSec*1.1){this.play('idle')}}}
 draw(t){const a=this.cur,i=Math.floor(this.t*a.fps),f=a.fr[a.loop?i%a.fr.length:Math.min(i,a.fr.length-1)],s=this.d.scale||1,x=this.x-a.o[0],y=this.y-a.o[1];
  if(!(t>0)){df(this.a,f,x,y,s);return}
  tc.width=Math.ceil(f.fw*s);tc.height=Math.ceil(f.fh*s);const M0=X;X=tx;df(this.a,f,0,0,s);tx.globalCompositeOperation='source-atop';tx.fillStyle='rgba(0,0,0,'+t+')';tx.fillRect(0,0,tc.width,tc.height);X=M0;X.drawImage(tc,x,y)}}

/* ---------- MENU ---------- */
async function initMenu(){
 M.fire=await atlas('menu/fire');M.logo=await atlas('menu/logo');
 M.ff=M.fire.get('fire');M.la=M.logo.get('appear');M.l0=M.logo.get('logo')[0]||M.la[M.la.length-1];
 M.items=['jams','members','settings'];M.sel=0;M.t=0;M.msg='';
 M.music=snd('music/freakyMenu.ogg',1,.8);M.music.play().catch(()=>{});S='menu'}
function menu(dt){
 M.t+=dt;const f=M.ff[Math.floor(M.t*24)%M.ff.length],s=H/f.fh;
 X.fillStyle='#000';X.fillRect(0,0,W,H);
 const sy=Math.min(1,M.t/2);dr(M.fire,f,-f.fx*s,H-f.fh*s*sy+25-f.fy*s*sy,vw(f)*s,vh(f)*s*sy);
 const lf=M.t<2?null:M.la[Math.min(M.la.length-1,Math.floor((M.t-2)*24))];
 if(lf){const sc=1.25,fr=(M.t-2)*24>=M.la.length?M.l0:lf;df(M.logo,fr,W/2-fr.fw*sc/2,50+(fr.fh-fr.fh*sc)/2,sc)}
 if(M.t>3){X.font='34px Arial';X.textAlign='center';
  M.items.forEach((n,i)=>{X.fillStyle=i==M.sel?'#ff0':'#fff';X.fillText(n,W/2,390+i*70)});
  X.font='20px Arial';X.fillStyle='#fff';X.fillText(M.msg,W/2,H-30)}
 if(M.t>3)for(const[cx,cy]of clicks){const i=Math.round((cy-378)/70);if(i>=0&&i<3&&Math.abs(cx-W/2)<170){M.sel=i;pressed.push('Enter')}}
 for(const k of pressed){
  if(k=='ArrowUp'||k=='KeyW'){M.sel=(M.sel+2)%3;snd('sounds/click.ogg').play()}
  if(k=='ArrowDown'||k=='KeyS'){M.sel=(M.sel+1)%3;snd('sounds/click.ogg').play()}
  if(k=='Enter'&&M.t>3){if(M.sel==0){snd('sounds/bass.ogg').play();M.music.pause();openElev()}else if(M.sel==2){snd('sounds/click.ogg').play();openSet()}else M.msg='Coming soon!'}}}

/* ---------- SONG ---------- */
const DIR=['LEFT','DOWN','UP','RIGHT'],COL=['purple','blue','green','red'],STS={johndoe:{bf:[708,150],dad:[200,100],cb:[-130,-20],cd:[200,0],zoom:.9},devilish:{bf:[708,165],dad:[200,100],cb:[0,0],cd:[-25,25],zoom:1}};let ST=STS.johndoe;
const sx=l=>W/2+42+112*l+10-4.7*l,SY=50,K=.45;
async function startSong(id){
 S='load';ST=STS[id];const jd=id=='johndoe';
 const[ch,ev,notes_at,logo]=await Promise.all([J('songs/'+id+'/'+id+'.json'),J('songs/'+id+'/events.json'),atlas('images/noteSkins/NOTE_assets'),L('logo/'+id+'.png').catch(()=>null)]);
 const BG=jd?await Promise.all([L('images/bgs/sky.png'),L('images/bgs/floor.png'),L('images/bgs/home.png')]):await Promise.all([L('images/bgs/tree.png'),L('images/bgs/floo.png'),atlas('images/bgs/fuck_you_guest'),atlas('menu/fire')]);
 const[sky,floor,home]=BG;
 const cd={};for(const n of(jd?['jd','jda','die','rbf']:['guest','rbf'])){const d=await J('characters/'+n+'.json');cd[n]=new Ch(d,await atlas('images/'+d.image),n=='rbf'?ST.bf[0]:ST.dad[0],n=='rbf'?ST.bf[1]:ST.dad[1])}
 const song=ch.song,secs=song.notes,starts=[],notes=[];let t=0,bpm=song.bpm;
 secs.forEach(s=>{if(s.changeBPM&&s.bpm)bpm=s.bpm;starts.push({t,bpm,must:!!s.mustHitSection});
  for(const n of s.sectionNotes)notes.push({t:n[0],l:n[1]%4,len:n[2]>0?n[2]:0,alt:n[3]==='Alt Animation',pl:(n[1]<4)===!!s.mustHitSection,hit:0,miss:0,done:0});
  t+=(s.lengthInSteps||16)*15000/bpm});
 notes.sort((a,b)=>a.t-b.t);
 const nf=COL.map((c,i)=>({h:notes_at.get(c)[0],p:notes_at.get(c+' hold piece')[0],e:notes_at.get(c+' hold end')[0],st:notes_at.get('arrow'+DIR[i])[0],pr:notes_at.get(DIR[i].toLowerCase()+' press'),cf:notes_at.get(DIR[i].toLowerCase()+' confirm')}));
 const inst=snd('songs/'+id+'/inst.ogg'),voc=snd('songs/'+id+'/voices.ogg');
 g={song,starts,notes,nf,na:notes_at,sky,floor,home,cd,dad:cd.jd||cd.guest,bf:cd.rbf,inst,voc,evs:ev.song.events||song.events,ei:0,si:0,pos:-1500,go:0,
  spd:song.speed,zoom:ST.zoom,cx:640,cy:360,home_a:0,floor_a:1,glitch:0,force:null,hp:1,score:0,miss:0,combo:0,pop:null,pp:{},ct:[9,9,9,9],tm:0,dUntil:0};Object.assign(g,{id,jd,logo,fire:BG[3],crowdY:1200,bt:1200,fire_a:0,fa:0,ha:0,wh:jd?0:1,tint:jd?0:1,lg:[],pos:jd?-1500:-600,vids:jd?[]:['intro','monster'].map(n=>{const v=document.createElement('video');v.src=A+'videos/'+n+'.mp4';v.muted=true;v.playsInline=true;v.preload='auto';return v})});
 if(jd){const sc=document.createElement('canvas');sc.width=sky.width;sc.height=sky.height;const c=sc.getContext('2d');c.drawImage(sky,0,0);c.globalCompositeOperation='difference';c.fillStyle='#fff';c.fillRect(0,0,sc.width,sc.height);c.globalCompositeOperation='destination-in';c.drawImage(sky,0,0);g.skyInv=sc;
 try{const ff=new FontFace('vcr','url('+A+'fonts/vcr.ttf)');await ff.load();document.fonts.add(ff)}catch(e){}
 g.code=mkCode();g.code_a=0;g.code_v=0;g.va=1;
 const v=document.createElement('video');v.src=A+'videos/oh.mp4';v.playsInline=true;g.vid=v;v.onended=v.onerror=()=>{g.vid=null};v.play().catch(()=>{g.vid=null})}
 g.cx=900;g.cy=300;if(!jd){const m=g.bf.mid(),c=g.bf.d.camera_position;g.cx=m[0]-100-c[0]+ST.cb[0];g.cy=m[1]-200+c[1]+ST.cb[1]}S='play';
 inst.onended=()=>endSong(1)}
function endSong(fin){if(S!='play')return;g.inst.pause();g.voc.pause();if(g.vid)g.vid.pause();g.vids.forEach(v=>v.pause());T=[];try{const k='jdb_'+g.id;if(g.score>(+localStorage[k]||0))localStorage[k]=g.score;if(fin)localStorage['jdc_'+g.id]=Math.max(+localStorage['jdc_'+g.id]||0,g.miss?1:2)}catch(e){}openElev()}
function fire(n,a,b){
 if(n=='Change Scroll Speed')tw(g,'spd',g.song.speed*parseFloat(a||1),parseFloat(b||0));
 else if(n=='awesomeZoom'){const p=(a||'').split(',');tw(g,'zoom',parseFloat(p[0]),parseFloat(p[1]||1),b)}
 else if(n=='Change Character'){const c=g.cd[b];if(c){c.play('idle');if(a=='dad')g.dad=c;else g.bf=c}}
 else if(n=='Play Animation'){(a=='dad'||b=='dad'?g.dad:g.bf).play(b=='dad'||b=='bf'?a:b,0)}
 else if(n=='Hey!'){g.bf.play('hey',0)}
 else if(n=='Camera Follow Pos'&&a!=='')g.force=[+a,+b];
 else if(n=='logo')g.lg.push({t:-(parseFloat(b)||0),tm:parseFloat(a)||2.1});
 else if(n=='fire')tw(g,'fire_a',parseFloat(a),parseFloat(b)||0);
 else if(n=='boo'){g.bt=g.bt==600?1200:600;tw(g,'crowdY',g.bt,2,'bounceInOut')}
 else if(n=='infryzoom')tw(g,'zoom',parseFloat(a),parseFloat(b)||0,'cubeOut');
 else if(n=='intro'&&g.vids[0])g.vids[0].play().catch(()=>{});
 else if(n=='playawesomevid'&&g.vids[1])g.vids[1].play().catch(()=>{});
 else if(n=='Fade Screen'){g.fa=0;tw(g,'fa',parseFloat(b)||0,parseFloat(a)||0)}
 else if(n===''&&a=='p'){tw(g,'wh',0,.6);tw(g,'ha',1,.6);tw(g,'tint',0,.6)}
 else if(n=='woah'){
  if(a=='woah'){tw(g,'home_a',1,7,'quadInOut');tw(g,'floor_a',0,7,'quadInOut')}
  else if(a=='bye'){tw(g,'home_a',0,3,'quadInOut');tw(g,'floor_a',1,3,'quadInOut')}
  else if(a=='glitch')g.glitch=1;else if(a=='noglitch')g.glitch=0;else if(a=='codeWall')g.code_v=1;else if(a=='welcome')tw(g,'code_a',1,4,'cubeOut');else if(a=='fade')tw(g,'code_a',0,1,'cubeInOut');else if(a=='nowall')g.code_v=0}}
function sing(c,l,alt,miss){const b='sing'+DIR[l];const n=miss?b+'miss':alt&&c.an[b+'-alt']?b+'-alt':b;c.play(n,1)}
function rate(d){d=Math.abs(d);return d<=45?['SICK!',350,1]:d<=90?['Good',200,.9]:d<=135?['Bad',100,.7]:['Shit',50,.5]}
function hitKey(l){
 let b=null;for(const n of g.notes){if(n.t-g.pos>166)break;if(n.pl&&!n.hit&&!n.miss&&n.l==l&&Math.abs(n.t-g.pos)<=166){b=n;break}}
 if(!b)return;b.hit=1;g.ct[l]=0;sing(g.bf,l);g.voc.volume=1;
 const r=rate(b.t-g.pos);g.score+=r[1];g.combo++;g.hp=Math.min(2,g.hp+.023*r[2]*1.3);g.pop={t:r[0]+'  x'+g.combo,a:0}}
function play(dt){
 const G=g,stepSec=15/G.starts[G.si].bpm;
 if(G.vid){tick(dt);const v=G.vid;X.fillStyle='#000';X.fillRect(0,0,W,H);
  if(v.videoWidth){const h=W*v.videoHeight/v.videoWidth;X.globalAlpha=G.va;X.drawImage(v,0,H/2-h/2,W,h);X.globalAlpha=1}
  if(pressed.includes('Escape')){endSong();return}
  if((pressed.includes('Enter')||clicks.length)&&!G.skip){G.skip=1;tw(G,'va',0,.6);setTimeout(()=>{v.pause();G.vid=null},650)}
  return}
 if(!G.go){G.pos+=dt*1000;if(G.pos>=0){G.go=1;G.inst.play();G.voc.play();if(G.jd){tw(G,'zoom',G.zoom-.1,1.67,'quadInOut');tw(G,'ha',1,1.42,'sineOut')}}}
 else{const a=G.inst.currentTime*1000;G.pos+=dt*1000;if(Math.abs(G.pos-a)>40)G.pos=a;if(Math.abs(G.voc.currentTime-G.inst.currentTime)>.12)G.voc.currentTime=G.inst.currentTime}
 const pos=G.pos;
 for(const l of tap)hitKey(l);
 for(const k of pressed){if(k in KM)hitKey(KM[k]);if(k=='Escape'){endSong();return}}
 for(const[cx,cy]of clicks)if(touchOn()&&cx<110&&cy<40){endSong();return}
 while(G.si+1<G.starts.length&&G.starts[G.si+1].t<=pos)G.si++;
 while(G.ei<G.evs.length&&G.evs[G.ei][0]<=pos){for(const e of G.evs[G.ei][1])fire(e[0],e[1],e[2]);G.ei++}
 for(const n of G.notes){
  if(n.t>pos+200)break;
  if(!n.pl){if(!n.hit&&n.t<=pos){n.hit=1;n.done=1;sing(G.dad,n.l,n.alt);G.dUntil=Math.max(G.dUntil,n.t+n.len);if(n.alt&&G.hp>.1)G.hp-=.023*2.6}}
  else if(!n.hit&&!n.miss&&pos-n.t>166){n.miss=1;G.hp=Math.max(0,G.hp-.0475);G.combo=0;G.miss++;G.score-=10;sing(G.bf,n.l,0,1);G.voc.volume=.3;G.pop={t:'Miss',a:0}}
  else if(n.pl&&n.hit&&n.len&&!n.done){if(pos>=n.t+n.len)n.done=1;else if(keys['L'+n.l]){G.bf.hold=0;G.hp=Math.min(2,G.hp+.1*dt)}else n.done=1}}
 if(pos<G.dUntil)G.dad.hold=0;
 if(G.hp<=0){endSong();return}
 G.dad.upd(dt,stepSec);G.bf.upd(dt,stepSec);G.ct=G.ct.map(v=>v+dt);if(G.pop)G.pop.a+=dt;tick(dt);
 // camera
 let tx,ty;if(G.force)[tx,ty]=G.force;else if(G.starts[G.si].must){const m=G.bf.mid(),c=G.bf.d.camera_position;tx=m[0]-100-c[0]+ST.cb[0];ty=m[1]-100+c[1]+ST.cb[1]}
 else{const m=G.dad.mid(),c=G.dad.d.camera_position;tx=m[0]+150+c[0]+ST.cd[0];ty=m[1]-100+c[1]+ST.cd[1]}
 const k=1-Math.exp(-dt*2.4*.9);G.cx+=(tx-G.cx)*k;G.cy+=(ty-G.cy)*k;G.tm+=dt;
 // world
 X.fillStyle='#000';X.fillRect(0,0,W,H);X.save();X.translate(W/2,H/2);X.scale(G.zoom,G.zoom);X.translate(-G.cx,-G.cy);
 if(!G.jd)drawGuest(G);else{
 if(G.glitch){const fr=Math.floor(G.tm*8),sw=G.sky.width,sk=G.sky.height;X.drawImage(G.skyInv,-228,0);for(let i=0;i<28;i++){const q=fr*3+i*1.7,y=rnd(q+2345)*sk,h=rnd(q+925)*.075*sk,o=(rnd(q+25)*2-1)*.022*sw;X.drawImage(G.sky,0,y,sw,h,-228+o,y,sw,h)}}else X.drawImage(G.sky,-228,0);
 if(G.home_a>0){X.globalAlpha=G.home_a;const s=1600/G.home.width,hw=G.home.width*s,hh=G.home.height*s;X.drawImage(G.home,100+(G.home.width-hw)/2,200+(G.home.height-hh)/2,hw,hh);X.globalAlpha=1}
 if(G.code_v&&G.code_a>0)drawCode(G,G.code_a);
 if(G.floor_a>0){X.globalAlpha=G.floor_a;X.drawImage(G.floor,130,700);X.globalAlpha=1}}
 G.dad.draw(G.tint);G.bf.draw(G.tint);if(!G.jd)drawGuestFront(G);X.restore();
 // notes
 const kk=K*G.spd,cy0=SY+55;
 for(let l=0;l<4;l++){const f=G.nf[l],cx=sx(l)+56;let fr=f.st;const held=keys['L'+l];
  if(G.ct[l]<.15&&f.cf.length)fr=f.cf[Math.min(f.cf.length-1,Math.floor(G.ct[l]*24))];else if(held&&f.pr.length)fr=f.pr[Math.min(f.pr.length-1,Math.floor(G.ct[l]*24))];
  df(G.na,fr,cx-fr.fw*.35,cy0-fr.fh*.35,.7,.8);X.globalAlpha=.9;X.fillStyle='#fff';X.font='20px Arial';X.textAlign='center';X.fillText(lab(cfg.bind[l]),cx,SY+112);X.globalAlpha=1}
 for(const n of G.notes){
  if(!n.pl||n.miss&&!n.len&&pos-n.t>400||n.done)continue;
  const y=n.hit?cy0:cy0+(n.t-pos)*kk;if(y>H+300)break;
  const f=G.nf[n.l],cx=sx(n.l)+56;
  if(n.len){const len=(n.t+n.len-(n.hit?pos:n.t))*kk,top=n.hit?cy0:y,eh=vh(f.e)*.7;
   if(len>0&&top<H){X.globalAlpha=n.miss?.3:.65;dr(G.na,f.p,cx-f.p.fw*.35-f.p.fx*.7,top,vw(f.p)*.7,Math.max(0,len-eh));dr(G.na,f.e,cx-f.e.fw*.35-f.e.fx*.7,top+Math.max(0,len-eh),vw(f.e)*.7,eh);X.globalAlpha=1}}
  if(!n.hit)df(G.na,f.h,cx-f.h.fw*.35,y-f.h.fh*.35,.7,n.miss?.3:1)}
 // hud
 if(G.pop&&G.pop.a<.6){X.globalAlpha=1-G.pop.a/.6;X.font='bold 40px Arial';X.fillText(G.pop.t,W*.75,H/2+60);X.globalAlpha=1}
 if(touchOn()){for(let l=0;l<4;l++){X.fillStyle='rgba(255,255,255,'+(keys['L'+l]?.14:.04)+')';X.fillRect(l*W/4+2,40,W/4-4,H-40)}}
 if(G.jd){const a=pos<0?1:Math.max(0,1-pos/1670);if(a>0){X.fillStyle='rgba(0,0,0,'+a+')';X.fillRect(0,0,W,H)}}
 X.globalAlpha=G.ha;
 X.fillStyle='#f00';X.fillRect(W-70,235,20,250);X.fillStyle='#96ff00';const hh=G.hp*125;X.fillRect(W-70,485-hh,20,hh);
 X.fillStyle='#00f';X.font='italic 30px Arial';X.textAlign='center';X.fillText('health',W-60,520);X.globalAlpha=1;
 X.fillStyle='#000';X.fillRect(0,0,W,40);if(touchOn()){X.fillStyle='#fff';X.font='20px Arial';X.textAlign='left';X.fillText('‹ menu',12,28);X.textAlign='center'}X.globalAlpha=G.ha;X.fillStyle='#fff';X.font='30px Arial';X.fillText('time: '+Math.max(0,Math.round(((G.inst.duration||0)*1000-pos)/1000)),W/2,34);X.globalAlpha=1;
 if(G.fa>0){X.fillStyle='rgba(0,0,0,'+G.fa+')';X.fillRect(0,0,W,H)}
 for(const v of G.vids)if(v.currentTime>0&&!v.ended&&!v.paused&&v.videoWidth)X.drawImage(v,0,0,W,H);
 G.lg=G.lg.filter(o=>{o.t+=dt;return o.t<o.tm*3.3});
 for(const o of G.lg){if(o.t<0||!G.logo)continue;const t=o.tm,al=o.t<t?ease.expoOut(o.t/t):1-ease.cubeOut(Math.min(1,Math.max(0,(o.t-t-1.2)/t))),sc=.6+.3*ease.quadInOut(Math.min(1,Math.max(0,(o.t-t/2)/(t*2))));
  X.globalAlpha=al;X.drawImage(G.logo,W/2-G.logo.width*sc/2,H/2-G.logo.height*sc/2,G.logo.width*sc,G.logo.height*sc);X.globalAlpha=1}}

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
 else{saveCfg();S='menu'}}
function sett(dt){
 const rows=['layout: '+layName(),...['left','down','up','right'].map((n,i)=>n+' key: '+(SE.wait==i+1?'press a key...':lab(cfg.bind[i]))),'touch controls: '+['auto','on','off'][cfg.touch],'reset to default','back'];
 for(const k of pressed){
  if(SE.wait){if(k!='Escape'){const l=SE.wait-1,o=cfg.bind.indexOf(k);if(o>=0&&o!=l)cfg.bind[o]=cfg.bind[l];cfg.bind[l]=k;saveCfg()}SE.wait=0;continue}
  if(k=='ArrowUp'||k=='KeyW')SE.sel=(SE.sel+rows.length-1)%rows.length;
  else if(k=='ArrowDown'||k=='KeyS')SE.sel=(SE.sel+1)%rows.length;
  else if(k=='Enter')sact(SE.sel);
  else if((k=='ArrowLeft'||k=='ArrowRight')&&SE.sel==5)sact(5,k=='ArrowLeft'?-1:1);
  else if(k=='Escape'){saveCfg();S='menu'}}
 for(const[cx,cy]of clicks){if(SE.wait||S!='set')break;const i=Math.round((cy-170)/52);
  if(cx<120&&cy<50){saveCfg();S='menu'}else if(i>=0&&i<rows.length&&Math.abs(cx-W/2)<300){SE.sel=i;sact(i)}}
 if(S!='set')return;
 X.fillStyle='#000';X.fillRect(0,0,W,H);X.textAlign='center';X.fillStyle='#fff';X.font='40px Arial';X.fillText('settings',W/2,100);
 X.font='28px Arial';rows.forEach((r,i)=>{X.fillStyle=i==SE.sel?'#ff0':'#fff';X.fillText(r,W/2,180+i*52)});
 X.font='16px Arial';X.fillStyle='#aaa';X.fillText('Up/Down + Enter (or tap). Arrow keys always work too. Esc = back',W/2,H-24);
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
function boot(){S='boot';initMenu().catch(e=>{err=e.message;S='err'})}
addEventListener('unhandledrejection',e=>{err=(e.reason&&e.reason.message)||String(e.reason);S='err'});
let last=performance.now();
(function loop(now){
 const dt=Math.min(.05,(now-last)/1000);last=now;
 try{if(S=='menu')menu(dt);else if(S=='elev')elev(dt);else if(S=='set')sett(dt);else if(S=='play')play(dt);else{
  X.fillStyle='#000';X.fillRect(0,0,W,H);X.fillStyle='#fff';X.textAlign='center';X.font='32px Arial';
  X.fillText(S=='start'?'Click or press Enter to start':S=='err'?'Error: '+err:'Loading...',W/2,H/2)}}
 catch(e){err=e.message;S='err';console.error(e)}
 pressed.length=0;clicks.length=0;tap.length=0;requestAnimationFrame(loop)})(last);

/* ---------- CODE WALL (matrix bg from the stage script) ---------- */
function mkCode(){const cols=[];for(let i=0;i<106;i++){const c=document.createElement('canvas');c.width=18;c.height=96;const x=c.getContext('2d');x.fillStyle='#0f0';x.font='24px vcr, monospace';x.textAlign='center';for(let j=0;j<4;j++)x.fillText(Math.random()<.5?'0':'1',9,22+j*24);cols.push(c)}return cols}
function drawCode(G,al){const y0=100,h=864,vt=G.cy-H/2/G.zoom-120,vb=G.cy+H/2/G.zoom+120;X.save();X.globalAlpha=al;
 G.code.forEach((c,i)=>{const o=(((i%2?-1:1)*G.tm*100)%96+96)%96;for(let y=Math.floor((vt-o)/96)*96+o;y<vb;y+=96)X.drawImage(c,i*18,y)});
 const gr=X.createLinearGradient(0,y0,0,y0+h);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'#000');X.fillStyle=gr;X.fillRect(0,y0,1920,h);X.restore()}

/* ---------- ELEVATOR (song select) ---------- */
const SONGS=[{n:'johndoe'},{n:'devilish'},{n:'1',lock:1},{n:'bloxwatch',lock:1}],
 HID=['nuhh uh','licky lee','well this is a little secret haha','dingalingaling','rofl copter','loltastic!','tophat guy','locked haha','???','goofy ahh mod who gets it'],
 LOAD=['loadingg;','lo adoin','load     ?','loaing','give me a moment','ok wait','hi','okay','uhhhh hello?','k','well hey'],
 pick_=a=>a[Math.random()*a.length|0],fp=(fr,t)=>fr[Math.min(fr.length-1,Math.floor(t*24))];
let E=null;
async function openElev(){
 S='load';
 if(!E){const[el,lock,grad,da,tv,pl,db,st,cb]=await Promise.all([L('menu/elev/elevator.png'),L('menu/elev/360.png'),L('menu/elev/grad.png'),atlas('menu/elev/doors'),atlas('menu/elev/tv'),atlas('menu/elev/play'),atlas('menu/elev/diffbutton'),atlas('menu/elev/i_just_lost_my_dawggg'),atlas('menu/elev/copyrightbutton')]);
  E={el,lock,grad,da,tv,pl,db,st,cb,cc:0,fl:await J('music/free/list.json'),sel:0,ex:(W-el.width)/2,ey:(H-el.height)/2}}
 Object.assign(E,{dp:null,bp:0,mt:0,txt:SONGS[E.sel].lock?pick_(HID):SONGS[E.sel].n});emusic();S='elev'}
function emusic(){const e=E;let i;do{i=Math.random()*e.fl.length|0}while(i==e.last&&e.fl.length>1);e.last=i;if(e.m)e.m.onended=null;e.m=snd('music/free/'+e.fl[i].f+'.ogg');e.m.onended=emusic;e.nm=e.fl[i].n;e.m.play().catch(()=>{})}
function pick(d){const e=E;e.sel=(e.sel+d+SONGS.length)%SONGS.length;e.mt=0;e.txt=SONGS[e.sel].lock?pick_(HID):SONGS[e.sel].n;snd('sounds/click.ogg').play()}
function go(){const e=E;if(SONGS[e.sel].lock){e.txt=pick_(HID);e.shk=.12;snd('sounds/lockSound.ogg').play();return}e.bp=.15;e.txt=pick_(LOAD);e.dp=0;e.mt=0;e.m.onended=null;e.m.pause();snd('sounds/letsgo.ogg').play()}
function elev(dt){
 const e=E,ex=e.ex,ey=e.ey;e.mt+=dt;if(e.dp!=null)e.dp+=dt;if(e.bp>0)e.bp-=dt;
 if(e.dp!=null&&e.dp>1.2){e.dp=null;e.m.onended=null;e.m.pause();startSong(SONGS[e.sel].n);return}
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
 X.fillStyle='#000';X.fillRect(0,0,W,H);X.save();if(e.shk>0){e.shk-=dt;X.translate((Math.random()-.5)*14,(Math.random()-.5)*14)}X.translate(W/2,H/2);X.scale(1.5,1.5);X.translate(-W/2,-H/2);
 X.drawImage(e.el,ex,ey);
 const cl=e.da.get('closed')[0];df(e.da,e.dp!=null?fp(e.da.get('dooranim'),e.dp):cl,ex+347,ey+146);
 const bi=e.db.get('bidle')[0];df(e.db,bi,ex+615,ey+220);
 X.save();X.translate(ex+615,ey+250+bi.fh);X.scale(1,-1);df(e.db,bi,0,0);X.restore();
 df(e.pl,e.pl.get(e.bp>0?'ppress':'pidle')[0],ex+280,ey+220);
 const st=e.tv.get('static');df(e.tv,e.mt*24<st.length?fp(st,e.mt):e.tv.get('tv')[0],ex+150,ey,.95);
 if(SONGS[e.sel].lock)X.drawImage(e.lock,ex+347+cl.fw/2-e.lock.width/4,ey+146+cl.fh/2-e.lock.height/4,e.lock.width/2,e.lock.height/2);
 X.fillStyle='#fff';X.textAlign='center';X.font='18px Arial';X.fillText(e.txt,W/2,ey+128);
 let b=0,c=0;try{b=+localStorage['jdb_'+SONGS[e.sel].n]||0;c=+localStorage['jdc_'+SONGS[e.sel].n]||0}catch(x){}
 if(!SONGS[e.sel].lock){X.font='20px Arial';X.fillText('score '+b,ex+406,ey+293);const sf=e.st.get(['outline','bronze','silver'][c]),f=sf[Math.floor(e.mt*24)%sf.length];df(e.st,f,ex+613,ey+186,30/f.fw)}
 X.drawImage(e.grad,(W-e.grad.width)/2,(H-e.grad.height)/2);
 X.globalAlpha=.6;X.fillStyle='#000';X.fillRect((W-400)/2,129,400,43);X.globalAlpha=1;
 X.fillStyle='#0f0';X.font='14px Arial';X.fillText('now playing:',W/2,142);X.fillStyle='#fff';X.font='16px Arial';X.fillText(e.nm||'',W/2,162);const cf=e.cb.get(e.cc?'c':'nc')[0];df(e.cb,cf,W/2+170-cf.fw*.375,150.5-cf.fh*.375,.75);
 X.restore();if(touchOn()){X.fillStyle='#fff';X.font='20px Arial';X.textAlign='left';X.fillText('‹ back',12,28)}if(e.dp!=null&&e.dp>.8){X.fillStyle='rgba(0,0,0,'+Math.min(1,(e.dp-.8)/.35)+')';X.fillRect(0,0,W,H)}}

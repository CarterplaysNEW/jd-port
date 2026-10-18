// FNF: Hello John Doe - browser port (core: menu + "John Doe"). Reads original Psych Engine assets.
const cv=document.getElementById('c'),X=cv.getContext('2d'),W=1280,H=720,A='assets/';
cv.width=W;cv.height=H;
const fit=()=>{const s=Math.min(innerWidth/W,innerHeight/H);cv.style.width=W*s+'px';cv.style.height=H*s+'px'};onresize=fit;fit();
const L=s=>new Promise((r,j)=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>j(Error('Missing file: '+A+s));i.src=A+s});
const J=p=>fetch(A+p).then(r=>{if(!r.ok)throw Error('Missing file: '+A+p);return r.json()});
const snd=(p,loop,v=1)=>{const a=new Audio(A+p);a.loop=!!loop;a.volume=v;return a};
const rx=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
async function atlas(p){
 const [im,t]=await Promise.all([L(p+'.png'),fetch(A+p+'.xml').then(r=>{if(!r.ok)throw Error('Missing file: '+A+p+'.xml');return r.text()})]);
 const f=[];for(const s of new DOMParser().parseFromString(t,'text/xml').getElementsByTagName('SubTexture')){const g=n=>+s.getAttribute(n)||0;
  f.push({n:s.getAttribute('name'),x:g('x'),y:g('y'),w:g('width'),h:g('height'),fx:g('frameX'),fy:g('frameY'),fw:g('frameWidth')||g('width'),fh:g('frameHeight')||g('height')})}
 return{im,f,get(p){const r=new RegExp('^'+rx(p)+'\\d*$');return f.filter(q=>r.test(q.n)).sort((a,b)=>a.n<b.n?-1:1)}}}
function df(a,f,x,y,s=1,al=1){X.globalAlpha=al;X.drawImage(a.im,f.x,f.y,f.w,f.h,x-f.fx*s,y-f.fy*s,f.w*s,f.h*s);X.globalAlpha=1}
const ease={linear:t=>t,cubeInOut:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,cubeOut:t=>1-Math.pow(1-t,3),sineOut:t=>Math.sin(t*Math.PI/2),quadInOut:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};
let T=[];const tw=(o,k,to,d,e)=>{if(!(d>0)){o[k]=to;return}T.push({o,k,a:o[k],b:to,d,e:ease[e]||ease.linear,t:0})};
const tick=dt=>{T=T.filter(q=>{q.t+=dt;const p=Math.min(1,q.t/q.d);q.o[k_(q)]=q.a+(q.b-q.a)*q.e(p);return p<1})};const k_=q=>q.k;
const rnd=a=>{const s=Math.sin(a*12.9898)*43758.5453;return s-Math.floor(s)};
const keys={},KM={ArrowLeft:0,KeyA:0,ArrowDown:1,KeyS:1,ArrowUp:2,KeyW:2,ArrowRight:3,KeyD:3},pressed=[];
let S='start',err='',M={},g=null;

class Ch{
 constructor(d,at,x,y){this.d=d;this.a=at;this.x=x+d.position[0];this.y=y+d.position[1];this.an={};
  for(const n of d.animations){let fr=at.get(n.name);if(n.indices&&n.indices.length)fr=n.indices.map(i=>fr[i]).filter(Boolean);this.an[n.anim]={fr,fps:n.fps||24,loop:n.loop,o:n.offsets}}
  this.play('idle');this.sing=0}
 play(n,sing){const a=this.an[n];if(!a||!a.fr.length)return;this.cur=a;this.t=0;this.hold=0;this.sing=!!sing}
 mid(){const f=this.an.idle.fr[0],s=this.d.scale||1;return[this.x+f.fw*s/2,this.y+f.fh*s/2]}
 upd(dt,stepSec){this.t+=dt;if(this.sing){this.hold+=dt;if(this.hold>=this.d.sing_duration*stepSec*1.1){this.play('idle')}}}
 draw(){const a=this.cur,i=Math.floor(this.t*a.fps),f=a.fr[a.loop?i%a.fr.length:Math.min(i,a.fr.length-1)];df(this.a,f,this.x-a.o[0],this.y-a.o[1],this.d.scale||1)}}

/* ---------- MENU ---------- */
async function initMenu(){
 M.fire=await atlas('menu/fire');M.logo=await atlas('menu/logo');
 M.ff=M.fire.get('fire');M.la=M.logo.get('appear');M.l0=M.logo.get('logo')[0]||M.la[M.la.length-1];
 M.items=['jams','members','settings'];M.sel=0;M.t=0;M.msg='';
 M.music=snd('music/freakyMenu.ogg',1,.8);M.music.play().catch(()=>{});S='menu'}
function menu(dt){
 M.t+=dt;const f=M.ff[Math.floor(M.t*24)%M.ff.length],s=H/f.fh;
 X.fillStyle='#000';X.fillRect(0,0,W,H);
 df(M.fire,f,0,H-f.fh*s+25,s);
 const lf=M.t<2?null:M.la[Math.min(M.la.length-1,Math.floor((M.t-2)*24))];
 if(lf){const sc=1.25,fr=(M.t-2)*24>=M.la.length?M.l0:lf;df(M.logo,fr,W/2-fr.fw*sc/2,50,sc)}
 if(M.t>3){X.font='34px Arial';X.textAlign='center';
  M.items.forEach((n,i)=>{X.fillStyle=i==M.sel?'#ff0':'#fff';X.fillText(n,W/2,390+i*70)});
  X.font='20px Arial';X.fillStyle='#fff';X.fillText(M.msg,W/2,H-30)}
 for(const k of pressed){
  if(k=='ArrowUp'||k=='KeyW'){M.sel=(M.sel+2)%3;snd('sounds/click.ogg').play()}
  if(k=='ArrowDown'||k=='KeyS'){M.sel=(M.sel+1)%3;snd('sounds/click.ogg').play()}
  if(k=='Enter'&&M.t>3){if(M.sel==0){snd('sounds/bass.ogg').play();M.music.pause();startSong()}else M.msg='Coming soon!'}}}

/* ---------- SONG ---------- */
const DIR=['LEFT','DOWN','UP','RIGHT'],COL=['purple','blue','green','red'],ST={bf:[708,150],dad:[200,100],cb:[-130,-20],cd:[200,0],zoom:.9};
const sx=l=>W/2+42+112*l+10-4.7*l,SY=50,K=.45;
async function startSong(){
 S='load';
 const[ch,ev,sky,floor,home,notes_at]=await Promise.all([J('songs/johndoe/johndoe.json'),J('songs/johndoe/events.json'),L('images/bgs/sky.png'),L('images/bgs/floor.png'),L('images/bgs/home.png'),atlas('images/noteSkins/NOTE_assets')]);
 const cd={};for(const n of['jd','jda','die','rbf']){const d=await J('characters/'+n+'.json');cd[n]=new Ch(d,await atlas('images/'+d.image),n=='rbf'?ST.bf[0]:ST.dad[0],n=='rbf'?ST.bf[1]:ST.dad[1])}
 const song=ch.song,secs=song.notes,starts=[],notes=[];let t=0,bpm=song.bpm;
 secs.forEach(s=>{if(s.changeBPM&&s.bpm)bpm=s.bpm;starts.push({t,bpm,must:!!s.mustHitSection});
  for(const n of s.sectionNotes)notes.push({t:n[0],l:n[1]%4,len:n[2]>0?n[2]:0,alt:n[3]==='Alt Animation',pl:(n[1]<4)===!!s.mustHitSection,hit:0,miss:0,done:0});
  t+=(s.lengthInSteps||16)*15000/bpm});
 notes.sort((a,b)=>a.t-b.t);
 const nf=COL.map((c,i)=>({h:notes_at.get(c)[0],p:notes_at.get(c+' hold piece')[0],e:notes_at.get(c+' hold end')[0],st:notes_at.get('arrow'+DIR[i])[0],pr:notes_at.get(DIR[i].toLowerCase()+' press'),cf:notes_at.get(DIR[i].toLowerCase()+' confirm')}));
 const inst=snd('songs/johndoe/inst.ogg'),voc=snd('songs/johndoe/voices.ogg');
 g={song,starts,notes,nf,na:notes_at,sky,floor,home,cd,dad:cd.jd,bf:cd.rbf,inst,voc,evs:ev.song.events||song.events,ei:0,si:0,pos:-1500,go:0,
  spd:song.speed,zoom:ST.zoom,cx:640,cy:360,home_a:0,floor_a:1,glitch:0,force:null,hp:1,score:0,miss:0,combo:0,pop:null,pp:{},ct:[9,9,9,9],tm:0,dUntil:0};
 g.cx=900;g.cy=300;S='play';
 inst.onended=()=>endSong()}
function endSong(){if(S!='play')return;g.inst.pause();g.voc.pause();T=[];S='menu';M.music.currentTime=0;M.music.play().catch(()=>{})}
function fire(n,a,b){
 if(n=='Change Scroll Speed')tw(g,'spd',g.song.speed*parseFloat(a||1),parseFloat(b||0));
 else if(n=='awesomeZoom'){const p=(a||'').split(',');tw(g,'zoom',parseFloat(p[0]),parseFloat(p[1]||1),b)}
 else if(n=='Change Character'){const c=g.cd[b];if(c){c.play('idle');if(a=='dad')g.dad=c;else g.bf=c}}
 else if(n=='Play Animation'){(a=='dad'||b=='dad'?g.dad:g.bf).play(b=='dad'||b=='bf'?a:b,0)}
 else if(n=='Hey!'){g.bf.play('hey',0)}
 else if(n=='Camera Follow Pos'&&a!=='')g.force=[+a,+b];
 else if(n=='woah'){
  if(a=='woah'){tw(g,'home_a',1,7,'quadInOut');tw(g,'floor_a',0,7,'quadInOut')}
  else if(a=='bye'){tw(g,'home_a',0,3,'quadInOut');tw(g,'floor_a',1,3,'quadInOut')}
  else if(a=='glitch')g.glitch=1;else if(a=='noglitch')g.glitch=0}}
function sing(c,l,alt,miss){const b='sing'+DIR[l];const n=miss?b+'miss':alt&&c.an[b+'-alt']?b+'-alt':b;c.play(n,1)}
function rate(d){d=Math.abs(d);return d<=45?['SICK!',350,1]:d<=90?['Good',200,.9]:d<=135?['Bad',100,.7]:['Shit',50,.5]}
function hitKey(l){
 let b=null;for(const n of g.notes){if(n.t-g.pos>166)break;if(n.pl&&!n.hit&&!n.miss&&n.l==l&&Math.abs(n.t-g.pos)<=166){b=n;break}}
 if(!b)return;b.hit=1;g.ct[l]=0;sing(g.bf,l);g.voc.volume=1;
 const r=rate(b.t-g.pos);g.score+=r[1];g.combo++;g.hp=Math.min(2,g.hp+.023*r[2]*1.3);g.pop={t:r[0]+'  x'+g.combo,a:0}}
function play(dt){
 const G=g,stepSec=15/G.starts[G.si].bpm;
 if(!G.go){G.pos+=dt*1000;if(G.pos>=0){G.go=1;G.inst.play();G.voc.play()}}
 else{const a=G.inst.currentTime*1000;G.pos+=dt*1000;if(Math.abs(G.pos-a)>40)G.pos=a;if(Math.abs(G.voc.currentTime-G.inst.currentTime)>.12)G.voc.currentTime=G.inst.currentTime}
 const pos=G.pos;
 for(const k of pressed){if(k in KM)hitKey(KM[k]);if(k=='Escape'){endSong();return}}
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
 if(G.glitch){const n=40,sh=G.sky.height/n,fr=Math.floor(G.tm*8);for(let i=0;i<n;i++){const o=rnd(fr*7+i)>.7?(rnd(fr+i*3)-.5)*70:0;X.drawImage(G.sky,0,i*sh,G.sky.width,sh+1,-228+o,i*sh,G.sky.width,sh+1)}}else X.drawImage(G.sky,-228,0);
 if(G.home_a>0){X.globalAlpha=G.home_a;const s=1600/G.home.width;X.drawImage(G.home,100,200,G.home.width*s,G.home.height*s);X.globalAlpha=1}
 if(G.floor_a>0){X.globalAlpha=G.floor_a;X.drawImage(G.floor,130,700);X.globalAlpha=1}
 G.dad.draw();G.bf.draw();X.restore();
 // notes
 const kk=K*G.spd,cy0=SY+55;
 for(let l=0;l<4;l++){const f=G.nf[l],cx=sx(l)+56;let fr=f.st;const held=keys['L'+l];
  if(G.ct[l]<.15&&f.cf.length)fr=f.cf[Math.min(f.cf.length-1,Math.floor(G.ct[l]*24))];else if(held&&f.pr.length)fr=f.pr[Math.min(f.pr.length-1,Math.floor(G.ct[l]*24))];
  df(G.na,fr,cx-fr.fw*.35,cy0-fr.fh*.35,.7,.8)}
 for(const n of G.notes){
  if(!n.pl||n.miss&&!n.len&&pos-n.t>400||n.done)continue;
  const y=n.hit?cy0:cy0+(n.t-pos)*kk;if(y>H+300)break;
  const f=G.nf[n.l],cx=sx(n.l)+56;
  if(n.len){const len=(n.t+n.len-(n.hit?pos:n.t))*kk,top=n.hit?cy0:y,eh=f.e.h*.7;
   if(len>0&&top<H){X.globalAlpha=n.miss?.3:.65;X.drawImage(G.na.im,f.p.x,f.p.y,f.p.w,f.p.h,cx-f.p.w*.35,top,f.p.w*.7,Math.max(0,len-eh));X.drawImage(G.na.im,f.e.x,f.e.y,f.e.w,f.e.h,cx-f.e.w*.35,top+Math.max(0,len-eh),f.e.w*.7,eh);X.globalAlpha=1}}
  if(!n.hit)df(G.na,f.h,cx-f.h.fw*.35,y-f.h.fh*.35,.7,n.miss?.3:1)}
 // hud
 X.fillStyle='#000';X.fillRect(336,646,608,24);X.fillStyle='#c22';X.fillRect(340,650,600,16);X.fillStyle='#2c4';const w=G.hp/2*600;X.fillRect(940-w,650,w,16);
 X.fillStyle='#fff';X.font='22px Arial';X.textAlign='center';X.fillText('Score: '+G.score+'   Misses: '+G.miss,W/2,700);
 if(G.pop&&G.pop.a<.6){X.globalAlpha=1-G.pop.a/.6;X.font='bold 40px Arial';X.fillText(G.pop.t,W*.75,H/2+60);X.globalAlpha=1}
 if(pos<0){X.fillStyle='rgba(0,0,0,'+(-pos/1500)+')';X.fillRect(0,0,W,H)}}

/* ---------- LOOP ---------- */
addEventListener('keydown',e=>{if(e.repeat)return;if(e.code in KM||e.code=='Enter'||e.code=='Escape'||e.code.startsWith('Arrow'))e.preventDefault();
 pressed.push(e.code);if(e.code in KM)keys['L'+KM[e.code]]=1;
 if(S=='start'&&e.code=='Enter')boot()});
addEventListener('keyup',e=>{if(e.code in KM)keys['L'+KM[e.code]]=0});
cv.addEventListener('pointerdown',()=>{if(S=='start')boot()});
function boot(){S='boot';initMenu().catch(e=>{err=e.message;S='err'})}
addEventListener('unhandledrejection',e=>{err=(e.reason&&e.reason.message)||String(e.reason);S='err'});
let last=performance.now();
(function loop(now){
 const dt=Math.min(.05,(now-last)/1000);last=now;
 try{if(S=='menu')menu(dt);else if(S=='play')play(dt);else{
  X.fillStyle='#000';X.fillRect(0,0,W,H);X.fillStyle='#fff';X.textAlign='center';X.font='32px Arial';
  X.fillText(S=='start'?'Click or press Enter to start':S=='err'?'Error: '+err:'Loading...',W/2,H/2)}}
 catch(e){err=e.message;S='err';console.error(e)}
 pressed.length=0;requestAnimationFrame(loop)})(last);

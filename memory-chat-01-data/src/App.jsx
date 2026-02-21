import { useState, useRef, useEffect, useCallback } from "react";
import MEMORIES from "../../datasets/chat-memories.json";
import PEOPLE from "../../datasets/people.json";

const SEASONS={spring:[3,4,5],summer:[6,7,8],autumn:[9,10,11],fall:[9,10,11],winter:[12,1,2]};
const MONTH_NAMES={january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12,jan:1,feb:2,mar:3,apr:4,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
const SYNONYMS={photos:["photo","photos","pictures","pics","images","shots"],music:["music","songs","concerts","gigs","live","listening","tunes"],travel:["travel","trips","holidays","abroad","visited","went","been"],food:["food","restaurants","eating","dinner","lunch","tapas","cocktails","drinks","bar"],art:["art","exhibition","exhibitions","gallery","museum","museums","show","shows"],family:["family","mum","dad","sister","parents","relatives"],friends:["friends","mates","crew","gang","group"],home:["home","hackney","london","neighbourhood"],work:["work","job","office","idea","branding","brand"],books:["book","books","reading","read"]};

function getActions(m){const b=["Share","Remove"];switch(m.type){case "photo":{const a=["See place","See similar"];if(m.people?.length)a.push("People");if(m.place)a.push("More from "+m.place);return[...a,...b];}case "ticket":return m.future?["Calendar","Who's coming","Directions",...b]:["That night","Who was there","Artist",...b];case "voice_note":return["Play","Transcribe","Context",...b];case "song":return["Play","Album","More by artist","That period",...b];case "book":return["Highlights","Similar","When I read this",...b];case "note":return["Expand","Related","When I wrote this",...b];case "message":return["Reply","Full thread","More from "+(m.from||"them"),...b];case "place":return["Directions","Book again","Photos here","Who I was with",...b];default:return b;}}
function detectIntent(q){const r=[];if(/\bme\b|\bmyself\b|\bmy face\b|\bselfie/.test(q))r.push("me");if(/\bphoto|\bpicture|\bpic|\bimage|\bshot|\bsnap/.test(q))r.push("photos");for(const[s,m]of Object.entries(SEASONS))if(q.includes(s))r.push({type:"season",months:m});for(const[n,num]of Object.entries(MONTH_NAMES))if(q.includes(n))r.push({type:"month",month:num});const ym=q.match(/\b(2023|2024|2025)\b/);if(ym)r.push({type:"year",year:parseInt(ym[1])});if(/last year/.test(q))r.push({type:"year",year:2024});if(/this year|my year|year in review/.test(q))r.push({type:"year",year:2024});for(const[s,m]of Object.entries(SEASONS))if(q.includes("last "+s))r.push({type:"season",months:m});if(/coming up|future|looking forward|next|upcoming|planned|soon|excited/.test(q))r.push("future");if(/that night|that time|that day|that evening|remember when|remember the/.test(q))r.push("specific_event");if(/where did|where have|places i|places we|been to|visited|travelled/.test(q))r.push("places");if(/who are|my people|my friends|who do i/.test(q))r.push("people_list");if(/everything|all of|show me all|all my/.test(q))r.push("everything");for(const[cat,words]of Object.entries(SYNONYMS))if(words.some(w=>q.includes(w)))r.push({type:"category",category:cat});return r;}
function doSearch(query){const q=query.toLowerCase().trim();const int=detectIntent(q);if(int.includes("people_list"))return{type:"people_list",data:PEOPLE};if(int.includes("future"))return{type:"memories",data:MEMORIES.filter(m=>m.future),context:"Coming up"};let pool=[...MEMORIES];const pk=Object.keys(PEOPLE);const mp=pk.find(p=>q.includes(p)||q.includes(PEOPLE[p].name.toLowerCase()));if(mp)pool=pool.filter(m=>(m.people&&m.people.includes(mp))||(m.from&&m.from.toLowerCase()===PEOPLE[mp].name.toLowerCase())||m.tags.includes(mp));if(int.includes("me"))pool=pool.filter(m=>m.hasMe||(m.people&&m.people.length>0&&m.type==="photo"));const yi=int.find(i=>i.type==="year");if(yi)pool=pool.filter(m=>m.year===yi.year);const si=int.find(i=>i.type==="season");if(si)pool=pool.filter(m=>m.month&&si.months.includes(m.month));const mi=int.find(i=>i.type==="month");if(mi)pool=pool.filter(m=>m.month===mi.month);if(int.includes("photos")&&!int.includes("everything")){const pp=pool.filter(m=>m.type==="photo");if(pp.length)pool=pp;}const ci=int.find(i=>i.type==="category");if(ci){const cp=pool.filter(m=>m.category===ci.category||(SYNONYMS[ci.category]||[]).some(w=>m.tags.includes(w)));if(cp.length)pool=cp;}if(int.includes("places")){const pp=pool.filter(m=>m.place&&m.category==="travel");if(pp.length)pool=pp;}if(pool.length===MEMORIES.length&&!mp&&!yi&&!si&&!mi&&!ci){const words=q.split(/\s+/).filter(w=>w.length>2&&!["the","and","for","that","with","from","what","show","find","give","about","some","any"].includes(w));const scored=MEMORIES.map(m=>{const all=[...m.tags,m.place||"",m.caption||"",m.title||"",m.text||"",m.transcript||"",m.artist||"",m.author||"",m.name||"",m.venue||""].join(" ").toLowerCase();let s=0;words.forEach(w=>{if(all.includes(w))s++;});return{...m,score:s};}).filter(m=>m.score>0).sort((a,b)=>b.score-a.score);if(scored.length)return{type:"memories",data:scored,context:scored[0].place||words.join(" ")};return{type:"empty"};}if(!pool.length)return{type:"empty"};let ctx="";if(mp)ctx=PEOPLE[mp].name;else if(yi)ctx=`${yi.year}`;else if(ci)ctx=ci.category;else if(pool[0]?.place)ctx=pool[0].place;return{type:"memories",data:pool,context:ctx,person:mp?PEOPLE[mp]:null};}

const CSS = `
.no-sb::-webkit-scrollbar{display:none}
.no-sb{-ms-overflow-style:none;scrollbar-width:none}
@keyframes radIn{from{opacity:0;transform:translate(-50%,-50%) scale(0.7);}to{opacity:1;transform:translate(-50%,-50%) scale(1);}}
`;

const pillStyle = {background:"#353535",borderRadius:80,padding:"8px 16px",fontSize:16,color:"#fff",fontWeight:300,letterSpacing:"-0.32px",display:"inline-block"};

function getRadialPositions(actions,cx,cy){
  const n=actions.length;
  const r=46+n*10;
  const spread=Math.min(2*Math.PI,n*0.9);
  const startAng=-Math.PI/2-spread/2;
  return actions.map((_,i)=>{
    const ang=n<=1?-Math.PI/2:startAng+(i/(n-1))*spread;
    return{x:cx+Math.cos(ang)*r,y:cy+Math.sin(ang)*r};
  });
}

function RadialMenu({actions,x,y,dx,dy,hovered}){
  const positions=getRadialPositions(actions,0,0);
  return(
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:1000,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",pointerEvents:"none"}}>
      <div style={{position:"absolute",top:y,left:x,width:0,height:0}}>
        <div style={{position:"absolute",width:12,height:12,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",transform:"translate(-6px,-6px)"}} />
        <div style={{transform:`translate(${dx}px,${dy}px)`,transition:"none"}}>
          {actions.map((act,i)=>{
            const p=positions[i];
            const isHot=hovered===i;
            return(<div key={act} style={{position:"absolute",left:p.x,top:p.y,transform:`translate(-50%,-50%) scale(${isHot?1.15:1})`,background:isHot?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.1)",border:"none",borderRadius:100,padding:"8px 16px",color:isHot?"#fff":"rgba(255,255,255,0.8)",fontSize:12,fontWeight:isHot?400:300,whiteSpace:"nowrap",transition:"transform 0.15s, background 0.15s, color 0.15s",animation:`radIn 0.2s ease ${i*0.04}s both`}}>{act}</div>);
          })}
        </div>
      </div>
    </div>
  );
}

function CardStack({memories,onAction}){
  const show=memories;
  const[active,setActive]=useState(0);
  const[imgErr,setImgErr]=useState({});
  const[menu,setMenu]=useState(null);
  const[menuDrag,setMenuDrag]=useState({x:0,y:0});
  const[hovered,setHovered]=useState(-1);
  const[dragX,setDragX]=useState(0);
  const[exiting,setExiting]=useState(false);
  const timer=useRef(null);
  const dragRef=useRef(null);
  const dragXRef=useRef(0);
  const menuRef=useRef(null);
  const menuDragRef=useRef({x:0,y:0});

  const m=show[active];

  const findAtCenter=useCallback((dx,dy,mn)=>{
    if(!mn)return -1;
    const positions=getRadialPositions(mn.actions,0,0);
    let best=-1,bestD=30;
    positions.forEach((p,i)=>{
      const d=Math.hypot(p.x+dx,p.y+dy);
      if(d<bestD){bestD=d;best=i;}
    });
    return best;
  },[]);

  useEffect(()=>{
    if(!menu)return;
    const mv=e=>{
      e.preventDefault();
      const px=e.touches?e.touches[0].clientX:e.clientX;
      const py=e.touches?e.touches[0].clientY:e.clientY;
      const mn=menuRef.current;
      const dx=px-mn.x;
      const dy=py-mn.y;
      menuDragRef.current={x:dx,y:dy};
      setMenuDrag({x:dx,y:dy});
      setHovered(findAtCenter(dx,dy,mn));
    };
    const up=()=>{
      const mn=menuRef.current;
      const d=menuDragRef.current;
      const h=findAtCenter(d.x,d.y,mn);
      setMenu(null);setMenuDrag({x:0,y:0});setHovered(-1);menuRef.current=null;menuDragRef.current={x:0,y:0};dragRef.current=null;
      if(h>=0&&onAction)onAction(mn.memory,mn.actions[h]);
    };
    window.addEventListener("mousemove",mv);
    window.addEventListener("mouseup",up);
    window.addEventListener("touchmove",mv,{passive:false});
    window.addEventListener("touchend",up);
    return()=>{
      window.removeEventListener("mousemove",mv);
      window.removeEventListener("mouseup",up);
      window.removeEventListener("touchmove",mv);
      window.removeEventListener("touchend",up);
    };
  },[menu,onAction,findAtCenter]);

  const onStart=useCallback(e=>{
    if(menu){setMenu(null);setHovered(-1);menuRef.current=null;return;}
    const x=e.touches?e.touches[0].clientX:e.clientX;
    const y=e.touches?e.touches[0].clientY:e.clientY;
    dragRef.current={startX:x,startY:y,moved:false};
    dragXRef.current=0;
    setDragX(0);
    timer.current=setTimeout(()=>{
      if(dragRef.current&&!dragRef.current.moved){
        const mn={x,y,actions:getActions(m),memory:m};
        menuRef.current=mn;
        setMenu(mn);
        setMenuDrag({x:0,y:0});menuDragRef.current={x:0,y:0};
        setHovered(-1);
      }
    },500);
  },[m,menu]);

  const onMove=useCallback(e=>{
    if(menuRef.current)return;
    if(!dragRef.current)return;
    const px=e.touches?e.touches[0].clientX:e.clientX;
    const py=e.touches?e.touches[0].clientY:e.clientY;
    if(!dragRef.current.moved){
      const dx=Math.abs(px-dragRef.current.startX);
      const dy=Math.abs(py-dragRef.current.startY);
      if(dx>8){
        dragRef.current.moved=true;
        if(timer.current){clearTimeout(timer.current);timer.current=null;}
      }else if(dy>8){
        dragRef.current=null;
        return;
      }else return;
    }
    const val=Math.min(0,px-dragRef.current.startX);
    dragXRef.current=val;
    setDragX(val);
  },[]);

  const onEnd=useCallback(()=>{
    if(timer.current){clearTimeout(timer.current);timer.current=null;}
    if(menuRef.current)return;
    if(!dragRef.current)return;
    if(dragRef.current.moved&&dragXRef.current<-60&&show.length>1){
      setExiting(true);
      dragXRef.current=0;
      setDragX(0);
      setTimeout(()=>{
        setExiting(false);
        setActive(i=>(i+1)%show.length);
        dragRef.current=null;
      },300);
    }else{
      dragXRef.current=0;
      setDragX(0);
      dragRef.current=null;
    }
  },[show.length]);

  const renderCard=(memory,idx)=>{
    const raw=idx-active;
    const offset=((raw%show.length)+show.length)%show.length;
    if(offset>=show.length)return null;
    const err=imgErr[memory.id];
    const isTop=offset===0;
    const isImageCard=memory.type==="photo"||memory.type==="ticket";

    const base={
      position:"absolute",bottom:offset*12,left:offset*12,
      width:"calc(100% - 36px)",zIndex:show.length-offset,
      borderRadius:24,overflow:"hidden",
      transition:(isTop&&dragX!==0&&!exiting)?"none":"all 0.35s ease",
      userSelect:"none",WebkitUserSelect:"none",
    };

    if(isTop){
      base.transform=exiting?"translateX(-120%)":`translateX(${dragX}px)`;
      base.opacity=exiting?0:1;
      base.cursor="grab";
      base.touchAction="pan-y";
    }

    const handlers=isTop?{onMouseDown:onStart,onMouseMove:onMove,onMouseUp:onEnd,onMouseLeave:onEnd,onTouchStart:onStart,onTouchMove:onMove,onTouchEnd:onEnd}:{};

    return(
      <div key={memory.id} style={base} {...handlers}>
        {isImageCard?(
          <div style={{position:"relative"}}>
            {memory.src&&!err?(
              <img src={memory.src} alt="" onError={()=>setImgErr(p=>({...p,[memory.id]:true}))} draggable={false} style={{width:"100%",display:"block",aspectRatio:"4/3",objectFit:"cover"}} />
            ):(
              <div style={{width:"100%",aspectRatio:"4/3",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",color:"#555",fontSize:12}}>{memory.caption||memory.title}</div>
            )}
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"48px 20px 16px",background:"linear-gradient(transparent, rgba(0,0,0,0.5))"}}>
              <div style={{fontSize:16,color:"#fff",fontWeight:300,letterSpacing:"-0.32px"}}>{memory.caption||memory.title}</div>
            </div>
          </div>
        ):(
          <div style={{background:"#1a1a1a",padding:20,aspectRatio:"4/3",display:"flex",flexDirection:"column",justifyContent:"flex-end",overflow:"hidden"}}>
            {memory.type==="voice_note"&&<><div style={{fontSize:12,color:"#555",marginBottom:8}}>🎙 {memory.duration}</div><div style={{fontSize:16,color:"rgba(255,255,255,0.7)",lineHeight:1.5,fontStyle:"italic",fontWeight:300}}>"{memory.transcript}"</div><div style={{fontSize:12,color:"#444",marginTop:8}}>{memory.place} · {memory.date}</div></>}
            {memory.type==="song"&&<><div style={{fontSize:12,color:"#555",marginBottom:8}}>🎵</div><div style={{fontSize:16,color:"#fff",fontWeight:300}}>{memory.title}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>{memory.artist}</div><div style={{fontSize:12,color:"#444",marginTop:8}}>{memory.caption}</div></>}
            {memory.type==="note"&&<><div style={{fontSize:12,color:"#555",marginBottom:8}}>📝 {memory.date}</div><div style={{fontSize:16,color:"rgba(255,255,255,0.7)",lineHeight:1.5,fontWeight:300}}>{memory.text}</div></>}
            {memory.type==="message"&&<><div style={{fontSize:12,color:"#555",marginBottom:8}}>💬 {memory.from} · {memory.date}</div><div style={{fontSize:16,color:"rgba(255,255,255,0.7)",lineHeight:1.5,fontWeight:300}}>"{memory.text}"</div></>}
            {memory.type==="place"&&<><div style={{fontSize:12,color:"#555",marginBottom:8}}>📍</div><div style={{fontSize:16,color:"#fff",fontWeight:300}}>{memory.name}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>{memory.caption}</div><div style={{fontSize:12,color:"#444",marginTop:4}}>{memory.location} · {memory.date}</div></>}
            {memory.type==="book"&&(
              <div style={{display:"flex",gap:12,alignItems:"flex-end"}}>
                {memory.src&&!err?<img src={memory.src} alt="" onError={()=>setImgErr(p=>({...p,[memory.id]:true}))} style={{width:60,borderRadius:8}} />:null}
                <div><div style={{fontSize:16,color:"#fff",fontWeight:300}}>{memory.title}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>{memory.author}</div></div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const stackOffset=(show.length-1)*12;

  return(
    <div style={{position:"relative",width:"85%",maxWidth:340,marginBottom:show.length>1?40:0}}>
      <div style={{aspectRatio:"4/3",marginTop:stackOffset}} />
      {show.map((mem,i)=>renderCard(mem,i))}
      {menu&&<RadialMenu actions={menu.actions} x={menu.x} y={menu.y} dx={menuDrag.x} dy={menuDrag.y} hovered={hovered} />}
    </div>
  );
}

function getPersonActions(p){return["Message","Call","See memories","See relationship","Share contact"];}

function PersonAvatar({k,p,onAction}){
  const[menu,setMenu]=useState(null);
  const[menuDrag,setMenuDrag]=useState({x:0,y:0});
  const[hovered,setHovered]=useState(-1);
  const timerRef=useRef(null);
  const menuRef=useRef(null);
  const menuDragRef=useRef({x:0,y:0});
  const startRef=useRef(null);

  const findAtCenter=useCallback((dx,dy,mn)=>{
    if(!mn)return -1;
    const positions=getRadialPositions(mn.actions,0,0);
    let best=-1,bestD=30;
    positions.forEach((pos,i)=>{const d=Math.hypot(pos.x+dx,pos.y+dy);if(d<bestD){bestD=d;best=i;}});
    return best;
  },[]);

  useEffect(()=>{
    if(!menu)return;
    const mv=e=>{
      e.preventDefault();
      const px=e.touches?e.touches[0].clientX:e.clientX;
      const py=e.touches?e.touches[0].clientY:e.clientY;
      const mn=menuRef.current;
      const dx=px-mn.x,dy=py-mn.y;
      menuDragRef.current={x:dx,y:dy};setMenuDrag({x:dx,y:dy});
      setHovered(findAtCenter(dx,dy,mn));
    };
    const up=()=>{
      const mn=menuRef.current;const d=menuDragRef.current;
      const h=findAtCenter(d.x,d.y,mn);
      setMenu(null);setMenuDrag({x:0,y:0});setHovered(-1);menuRef.current=null;menuDragRef.current={x:0,y:0};startRef.current=null;
      if(h>=0&&onAction)onAction(k,p,mn.actions[h]);
    };
    window.addEventListener("mousemove",mv);window.addEventListener("mouseup",up);
    window.addEventListener("touchmove",mv,{passive:false});window.addEventListener("touchend",up);
    return()=>{window.removeEventListener("mousemove",mv);window.removeEventListener("mouseup",up);window.removeEventListener("touchmove",mv);window.removeEventListener("touchend",up);};
  },[menu,onAction,k,p,findAtCenter]);

  const onStart=e=>{
    const x=e.touches?e.touches[0].clientX:e.clientX;
    const y=e.touches?e.touches[0].clientY:e.clientY;
    startRef.current={x,y};
    timerRef.current=setTimeout(()=>{
      const actions=getPersonActions(p);
      const mn={x,y,actions};menuRef.current=mn;
      setMenu(mn);setMenuDrag({x:0,y:0});menuDragRef.current={x:0,y:0};setHovered(-1);
    },500);
  };
  const onEnd=()=>{if(timerRef.current){clearTimeout(timerRef.current);timerRef.current=null;}};

  return(
    <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",width:80,touchAction:"none",userSelect:"none",WebkitUserSelect:"none"}}
      onMouseDown={onStart} onMouseUp={onEnd} onMouseLeave={onEnd}
      onTouchStart={onStart} onTouchEnd={onEnd} onTouchCancel={onEnd}>
      <div style={{width:64,height:64,borderRadius:"50%",overflow:"hidden",background:"#353535",marginBottom:8}}>
        {p.avatar?<img src={p.avatar} alt="" draggable={false} style={{width:"100%",height:"100%",objectFit:"cover"}} />:null}
      </div>
      <div style={{fontSize:12,color:"#fff",fontWeight:300,textAlign:"center"}}>{p.name}</div>
      <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",marginTop:2,textAlign:"center"}}>{p.relation}</div>
      {menu&&<RadialMenu actions={menu.actions} x={menu.x} y={menu.y} dx={menuDrag.x} dy={menuDrag.y} hovered={hovered} />}
    </div>
  );
}

function PeopleList({people,onAction}){
  return(
    <div className="no-sb" style={{display:"flex",gap:12,overflowX:"auto",marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16}}>
      {Object.entries(people).map(([k,p])=>(
        <PersonAvatar key={k} k={k} p={p} onAction={onAction} />
      ))}
    </div>
  );
}

function OSResponse({result,onAction,onPersonAction}){
  if(result.type==="people_list")return<div><div style={{...pillStyle,marginBottom:12}}>{result.label||"your people"}</div><PeopleList people={result.data} onAction={onPersonAction} /></div>;
  if(result.type==="empty")return<div style={{...pillStyle}}>Nothing came to mind.</div>;
  if(result.type==="action_response")return<div style={{...pillStyle}}>{result.text}</div>;
  return(
    <div>
      {result.person&&(
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <div style={{width:40,height:40,borderRadius:"50%",overflow:"hidden",background:"#353535",flexShrink:0}}>
            {result.person.avatar?<img src={result.person.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />:null}
          </div>
          <div>
            <div style={{fontSize:16,color:"#fff",fontWeight:300}}>{result.person.name}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{result.person.relation}{result.person.since?` · since ${result.person.since}`:""}</div>
          </div>
        </div>
      )}
      <CardStack memories={result.data} onAction={onAction} />
    </div>
  );
}

const SUGGESTIONS=["last summer","porto","josh","concerts","what's coming up","pictures of me"];

export default function MemoryChat(){
  const[messages,setMessages]=useState([]);
  const[input,setInput]=useState("");
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const send=(text)=>{
    const q=(text||input).trim();if(!q)return;
    const result=doSearch(q);
    setMessages(prev=>[...prev,{role:"user",text:q},{role:"os",result}]);
    setInput("");
  };

  const handlePersonAction=useCallback((key,person,action)=>{
    if(action==="See memories"){ send(key); return; }
    if(action==="See relationship"){
      setMessages(prev=>[...prev,{role:"os",result:{type:"action_response",text:`${person.name} · ${person.relation}${person.since?" · since "+person.since:""}`}}]);
      return;
    }
    const responses={
      "Message":`Opening chat with ${person.name}`,
      "Call":`Calling ${person.name}...`,
      "Share contact":`Sharing ${person.name}'s contact`,
    };
    const text=responses[action]||`${action} → ${person.name}`;
    setMessages(prev=>[...prev,{role:"os",result:{type:"action_response",text}}]);
  },[send]);

  const handleAction=useCallback((memory,action)=>{
    const label=memory.caption||memory.title||memory.name||"this";
    const place=memory.place||"";
    const tags=memory.tags||[];

    // Actions that trigger a new search
    if(action.startsWith("More from ")){ const p=action.replace("More from ",""); send(p); return; }
    if(action==="See place"&&place){ send(place); return; }
    if(action==="See similar"){ send(tags.slice(0,2).join(" ")); return; }
    if(action==="Photos here"){ send("photos "+place); return; }
    if(action==="That night"||action==="That period"||action==="When I read this"||action==="When I wrote this"){
      const month=memory.month?["","january","february","march","april","may","june","july","august","september","october","november","december"][memory.month]:"";
      const y=memory.year||"";
      if(month||y){ send(`${month} ${y}`.trim()); return; }
    }
    if((action==="People"||action==="Who was there"||action==="Who I was with")&&memory.people?.length){
      const subset={};memory.people.forEach(k=>{if(PEOPLE[k])subset[k]=PEOPLE[k];});
      setMessages(prev=>[...prev,{role:"os",result:{type:"people_list",data:subset,label:"people in this picture"}}]);
      return;
    }
    if(action==="More by artist"&&memory.artist){ send(memory.artist); return; }
    if(action==="Album"&&memory.artist){ send(memory.artist); return; }
    if(action==="Similar"&&memory.author){ send(memory.tags?.[0]||memory.author); return; }
    if(action==="Full thread"&&memory.from){ send(memory.from.toLowerCase()); return; }
    if(action==="Artist"&&memory.artist){ send(memory.artist); return; }
    if(action==="Directions"&&place){ send(place); return; }
    if(action==="Book again"&&memory.name){ send(memory.name); return; }

    // Actions that produce a direct response
    const responses={
      "Share":`Ready to share "${label}"`,
      "Remove":`"${label}" removed from memories`,
      "Play":memory.type==="song"?`Now playing ${memory.title} — ${memory.artist}`:`Playing voice note from ${memory.place||"unknown"}`,
      "Transcribe":`Transcript: "${memory.transcript||"..."}"`,
      "Context":`This was recorded ${memory.date||""} ${place?"in "+place:""}`.trim(),
      "Expand":`${memory.text||label}`,
      "Related":`Looking for memories related to "${label}"...`,
      "Reply":`Opening thread with ${memory.from||"them"}`,
      "Calendar":`Added ${label} to your calendar`,
      "Who's coming":`Checking who's going to ${label}`,
      "Highlights":`${memory.title} — your highlights`,
    };

    const text=responses[action]||`${action} → ${label}`;
    setMessages(prev=>[...prev,{role:"os",result:{type:"action_response",text}}]);
  },[send]);

  return(
    <div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",maxWidth:430,margin:"0 auto",overflow:"hidden",background:"#2c2c2c",fontFamily:"'OneUI Sans', -apple-system, BlinkMacSystemFont, sans-serif"}}>
      <style>{CSS}</style>

      <div className="no-sb" style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"20px 16px 16px",touchAction:"pan-y"}}>
        <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",minHeight:"100%"}}>
          {messages.length===0&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
              {SUGGESTIONS.map(s=>(
                <button key={s} onClick={()=>send(s)} style={{...pillStyle,cursor:"pointer",border:"none",transition:"background 0.15s"}}
                  onMouseEnter={e=>{e.target.style.background="#404040";}}
                  onMouseLeave={e=>{e.target.style.background="#353535";}}
                >{s}</button>
              ))}
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {messages.map((msg,i)=>(
              <div key={i}>
                {msg.role==="user"?(
                  <div style={{display:"flex",justifyContent:"flex-end"}}>
                    <div style={{...pillStyle}}>{msg.text}</div>
                  </div>
                ):(
                  <OSResponse result={msg.result} onAction={handleAction} onPersonAction={handlePersonAction} />
                )}
              </div>
            ))}
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      <div style={{padding:"8px 16px 28px"}}>
        <div style={{background:"#464646",borderRadius:12,display:"flex",alignItems:"center",padding:"4px 20px"}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Search for memories..." style={{flex:1,background:"transparent",border:"none",padding:"12px 0",color:"#fff",fontSize:16,outline:"none",fontWeight:300,letterSpacing:"-0.32px"}} />
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from "react";

const MEMORIES = [
  // ── Porto trip with Josh — Oct 2023 ──
  { id: 1, type: "photo", src: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&fit=crop", tags: ["porto","architecture","travel","buildings","portugal","2023","autumn","trip"], people: [], place: "Porto", date: "Oct 2023", month: 10, year: 2023, caption: "Porto, golden hour", category: "travel" },
  { id: 2, type: "photo", src: "https://images.unsplash.com/photo-1569959220744-ff553533f492?w=800&fit=crop", tags: ["porto","architecture","tiles","azulejo","portugal","2023","detail","building"], people: [], place: "Porto", date: "Oct 2023", month: 10, year: 2023, caption: "Azulejo tiles, Porto", category: "travel" },
  { id: 3, type: "photo", src: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&fit=crop", tags: ["porto","couple","street","portugal","2023","buildings","colour","josh"], people: ["josh"], place: "Porto", date: "Oct 2023", month: 10, year: 2023, caption: "Josh in Clerigos", category: "travel" },
  { id: 4, type: "photo", src: "https://images.unsplash.com/photo-1513735492246-483525079686?w=800&fit=crop", tags: ["porto","architecture","bridge","portugal","2023","view","river","douro"], people: [], place: "Porto", date: "Oct 2023", month: 10, year: 2023, caption: "Dom Luis Bridge", category: "travel" },
  { id: 5, type: "voice_note", transcript: "This city does something to me. Like every corner is a painting someone forgot to frame. Josh keeps saying I'm walking too slow but I can't stop looking up.", duration: "0:42", tags: ["porto","portugal","travel","reflection","2023","autumn"], people: ["josh"], place: "Porto", date: "Oct 2023", month: 10, year: 2023, caption: "Walking through Ribeira", category: "travel", src: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&fit=crop" },
  { id: 6, type: "song", title: "Saudade", artist: "Amália Rodrigues", tags: ["fado","portuguese","music","porto","2023","autumn","saudade"], people: [], date: "Oct 2023", month: 10, year: 2023, caption: "The Porto soundtrack", category: "music", src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&fit=crop" },

  // ── NYC family Christmas — Dec 2023 ──
  { id: 7, type: "photo", src: "https://images.unsplash.com/photo-1752650143167-2e2c258fca1e?w=800&fit=crop", tags: ["family","mum","dad","sister","new york","nyc","christmas","2023","trip","travel"], people: ["mum","dad","anika"], place: "New York", date: "Dec 2023", month: 12, year: 2023, caption: "Family trip, New York", category: "family", hasMe: true },
  { id: 8, type: "photo", src: "https://images.unsplash.com/photo-1770574245594-71051aca5bdd?w=800&fit=crop", tags: ["new york","nyc","central park","winter","christmas","2023","family","walk"], people: ["mum","anika"], place: "New York", date: "Dec 2023", month: 12, year: 2023, caption: "Central Park, Christmas morning", category: "family" },
  { id: 9, type: "message", from: "Mum", text: "I keep looking at the photos from New York. Best Christmas in years. Love you all so much ❤️", tags: ["family","mum","nyc","christmas","message","2023"], people: ["mum"], date: "Dec 2023", month: 12, year: 2023, caption: "Message from Mum", category: "family", src: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&fit=crop" },
  { id: 10, type: "photo", src: "https://images.unsplash.com/photo-1701707244542-bc22a6e5a8eb?w=800&fit=crop", tags: ["new york","nyc","brooklyn bridge","winter","2023","sister","anika"], people: ["anika"], place: "New York", date: "Dec 2023", month: 12, year: 2023, caption: "Anika on Brooklyn Bridge", category: "family" },

  // ── Lucy's birthday, Hackney — Mar 2024 ──
  { id: 11, type: "photo", src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&fit=crop", tags: ["friends","group","selfie","party","spring","2024","birthday","hackney"], people: ["lucy","tom","priya","josh"], place: "Hackney", date: "Mar 2024", month: 3, year: 2024, caption: "Lucy's birthday", category: "social", hasMe: true },

  // ── Amsterdam with Lucy & Tom — Apr 2024 ──
  { id: 12, type: "photo", src: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&fit=crop", tags: ["amsterdam","travel","canal","weekend","trip","2024","spring"], people: [], place: "Amsterdam", date: "Apr 2024", month: 4, year: 2024, caption: "Canal walk, first morning", category: "travel" },
  { id: 13, type: "photo", src: "https://images.unsplash.com/photo-1566132127697-4524fea60007?w=800&fit=crop", tags: ["stedelijk","amsterdam","museum","art","exhibition","2024"], people: [], place: "Amsterdam", date: "Apr 2024", month: 4, year: 2024, caption: "Stedelijk Museum", category: "culture" },
  { id: 14, type: "photo", src: "https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?w=800&fit=crop", tags: ["stedelijk","amsterdam","museum","art","exhibition","2024","interior"], people: [], place: "Amsterdam", date: "Apr 2024", month: 4, year: 2024, caption: "Inside the Stedelijk", category: "culture" },
  { id: 15, type: "photo", src: "https://images.unsplash.com/photo-1728019901065-fbb4da7f2177?w=800&fit=crop", tags: ["amsterdam","dinner","friends","travel","2024","spring","food","canal"], people: ["lucy","tom"], place: "Amsterdam", date: "Apr 2024", month: 4, year: 2024, caption: "Dinner by the canal", category: "travel" },
  { id: 16, type: "message", from: "Tom", text: "Just uploaded the Amsterdam photos to the shared album. That dinner spot was unreal. We need to go back", tags: ["tom","message","amsterdam","trip","photos","2024"], people: ["tom"], date: "Apr 2024", month: 4, year: 2024, caption: "Message from Tom", category: "social", src: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400&fit=crop" },

  // ── Barbican / Bearden — May 2024 ──
  { id: 17, type: "message", from: "Lucy", text: "Babe that Bearden show is INSANE you have to go before it closes", tags: ["lucy","message","art","bearden","barbican","recommendation"], people: ["lucy"], date: "May 2024", month: 5, year: 2024, caption: "Message from Lucy", category: "social", src: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400&fit=crop" },
  { id: 18, type: "photo", src: "https://images.unsplash.com/photo-1578301978693-85fa9fd0c499?w=800&fit=crop", tags: ["art","romare bearden","collage","exhibition","barbican","inspiration","2024"], people: [], place: "Barbican", date: "May 2024", month: 5, year: 2024, caption: "Romare Bearden, Barbican", category: "culture" },
  { id: 19, type: "voice_note", transcript: "Just left the Bearden show and I can't stop thinking about how he layers everything. It feels like memory itself. The collages are like... what if your phone worked like that.", duration: "0:34", tags: ["voice","note","art","romare bearden","barbican","reflection","2024"], people: [], place: "Barbican", date: "May 2024", month: 5, year: 2024, caption: "Voice note, Bearden show", category: "culture", src: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&fit=crop" },

  // ── Charli XCX / Brat summer — Jun 2024 ──
  { id: 20, type: "ticket", title: "Charli XCX — Brat Tour", venue: "Brixton Academy", date: "Jun 15, 2024", month: 6, year: 2024, tags: ["charli xcx","concert","brixton","music","gig","ticket","2024","summer"], people: ["priya","josh"], place: "Brixton Academy", future: false, caption: "Charli XCX — Brat Tour", category: "music", src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&fit=crop" },
  { id: 21, type: "photo", src: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&fit=crop", tags: ["charli xcx","concert","gig","music","brixton","2024","summer","live"], people: ["priya","josh"], place: "Brixton Academy", date: "Jun 2024", month: 6, year: 2024, caption: "Charli XCX, Brixton", category: "music" },
  { id: 22, type: "song", title: "B.O.B", artist: "Charli XCX", album: "Brat", tags: ["charli xcx","music","song","brat","2024","summer"], people: [], date: "Jun 2024", month: 6, year: 2024, caption: "On repeat all summer", category: "music", src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&fit=crop" },

  // ── Barcelona with Lucy & Priya — Jul 2024 ──
  { id: 23, type: "photo", src: "https://images.unsplash.com/photo-1665422265873-ee82b042f337?w=800&fit=crop", tags: ["barcelona","cocktails","bar","drinks","night out","travel","2024","summer"], people: ["lucy","priya"], place: "Barcelona", date: "Jul 2024", month: 7, year: 2024, caption: "Cocktails in El Born", category: "social" },
  { id: 24, type: "place", name: "Bar Canete", location: "Barcelona", tags: ["barcelona","restaurant","food","tapas","spain","2024","summer","place"], people: ["lucy","priya"], date: "Jul 2024", month: 7, year: 2024, caption: "Best tapas of the trip", category: "food", src: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&fit=crop" },
  { id: 25, type: "photo", src: "https://images.unsplash.com/photo-1457365050282-c53d772ef8b2?w=800&fit=crop", tags: ["barcelona","beach","summer","travel","2024","friends","sea"], people: ["lucy","priya"], place: "Barcelona", date: "Jul 2024", month: 7, year: 2024, caption: "Barceloneta, late afternoon", category: "travel", hasMe: true },
  { id: 26, type: "voice_note", transcript: "I don't want to leave. Three days with these two is never enough. Already planning the next one. Priya says Lisbon, Lucy says nowhere with stairs.", duration: "0:28", tags: ["barcelona","friends","travel","reflection","2024","summer"], people: ["lucy","priya"], place: "Barcelona", date: "Jul 2024", month: 7, year: 2024, caption: "Last night in Barcelona", category: "social", src: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&fit=crop" },

  // ── Marrakech with Josh — Aug 2024 ──
  { id: 27, type: "photo", src: "https://images.unsplash.com/photo-1549180030-48bf079fb38a?w=800&fit=crop", tags: ["marrakech","morocco","travel","market","trip","summer","2024","holiday"], people: [], place: "Marrakech", date: "Aug 2024", month: 8, year: 2024, caption: "Jemaa el-Fna at sunset", category: "travel" },
  { id: 28, type: "photo", src: "https://images.unsplash.com/photo-1545041462-58b4f39d3946?w=800&fit=crop", tags: ["marrakech","morocco","riad","travel","2024","summer","architecture"], people: [], place: "Marrakech", date: "Aug 2024", month: 8, year: 2024, caption: "Our riad, morning light", category: "travel" },
  { id: 29, type: "photo", src: "https://images.unsplash.com/photo-1730759214458-c3232b490964?w=800&fit=crop", tags: ["marrakech","morocco","medina","souk","travel","2024","summer","colour"], people: ["josh"], place: "Marrakech", date: "Aug 2024", month: 8, year: 2024, caption: "Lost in the medina", category: "travel" },
  { id: 30, type: "voice_note", transcript: "The sounds here are incredible. Mopeds, someone singing, the call to prayer starting. Josh is haggling over a rug we definitely don't need.", duration: "0:19", tags: ["marrakech","morocco","travel","sounds","2024","summer"], people: ["josh"], place: "Marrakech", date: "Aug 2024", month: 8, year: 2024, caption: "Sounds of the souk", category: "travel", src: "https://images.unsplash.com/photo-1517821362941-f7f753200fef?w=800&fit=crop" },

  // ── Josh — everyday ──
  { id: 31, type: "photo", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&fit=crop", tags: ["josh","portrait","boyfriend","home","2024"], people: ["josh"], place: "Home", date: "Sep 2024", month: 9, year: 2024, caption: "Josh, lazy Sunday", category: "personal" },
  { id: 32, type: "photo", src: "https://images.unsplash.com/photo-1640583341059-12deab9bf751?w=800&fit=crop", tags: ["cooking","home","dinner","josh","2024","autumn","food"], people: ["josh"], place: "Home", date: "Oct 2024", month: 10, year: 2024, caption: "Josh actually cooked", category: "everyday" },

  // ── Everyday London — scattered 2024 ──
  { id: 33, type: "photo", src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&fit=crop", tags: ["london","skyline","city","home","south bank","2024"], people: [], place: "South Bank", date: "Oct 2024", month: 10, year: 2024, caption: "Walk home, South Bank", category: "everyday" },
  { id: 34, type: "photo", src: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&fit=crop", tags: ["hackney","home","neighbourhood","london","street","morning"], people: [], place: "Hackney", date: "Sep 2024", month: 9, year: 2024, caption: "Morning walk, Mare Street", category: "everyday" },
  { id: 35, type: "photo", src: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&fit=crop", tags: ["running","canal","hackney","morning","london","2024","exercise"], people: [], place: "Hackney", date: "Aug 2024", month: 8, year: 2024, caption: "Canal run, 6am", category: "everyday" },
  { id: 36, type: "photo", src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&fit=crop", tags: ["studio","work","desk","design","london","2024","workspace"], people: [], place: "Clerkenwell", date: "Nov 2024", month: 11, year: 2024, caption: "Studio, Friday afternoon", category: "work" },

  // ── Family — ongoing ──
  { id: 37, type: "message", from: "Mum", text: "Are you eating properly? Dad made caldo verde last night and we saved you some in spirit 😂", tags: ["mum","family","message","food","portuguese","2024"], people: ["mum","dad"], date: "Sep 2024", month: 9, year: 2024, caption: "Message from Mum", category: "family", src: "https://images.unsplash.com/photo-1516475429286-ed1299819c39?w=400&fit=crop" },
  { id: 38, type: "photo", src: "https://images.unsplash.com/photo-1590475107364-d4882ba63600?w=800&fit=crop", tags: ["anika","sister","london","visiting","brunch","2024","hackney"], people: ["anika"], place: "Hackney", date: "Jun 2024", month: 6, year: 2024, caption: "Anika visiting, brunch in Hackney", category: "family" },
  { id: 39, type: "message", from: "Anika", text: "found this and thought of you immediately 😭", tags: ["anika","sister","message","funny","2024"], people: ["anika"], date: "Nov 2024", month: 11, year: 2024, caption: "Message from Anika", category: "family", src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&fit=crop" },
  { id: 40, type: "photo", src: "https://images.unsplash.com/photo-1675179177185-7506b4626881?w=800&fit=crop", tags: ["dad","family","video call","home","2024","portugal","garden"], people: ["dad"], date: "Aug 2024", month: 8, year: 2024, caption: "Dad showing off the garden", category: "family" },

  // ── Creative / work / identity ──
  { id: 41, type: "book", title: "The Creative Act", author: "Rick Rubin", src: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&fit=crop", tags: ["book","reading","creativity","rick rubin","inspiration","2024"], people: [], date: "2024", year: 2024, caption: "The Creative Act — Rick Rubin", category: "identity" },
  { id: 42, type: "note", text: "What if the brand identity evolved like a living thing depending on who interacts with it.", tags: ["note","idea","work","branding","2024"], people: [], date: "Nov 2024", month: 11, year: 2024, caption: "Late night idea", category: "work", src: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&fit=crop" },
  { id: 43, type: "photo", src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&fit=crop", tags: ["fashion","style","identity","portrait","inspiration","saved"], people: [], date: "2024", year: 2024, caption: "Style reference", category: "identity" },
  { id: 44, type: "note", text: "Architecture is frozen music — Goethe. But what is melted architecture? Something that flows and responds. That's what interfaces should feel like.", tags: ["quote","architecture","thinking","design","2024"], people: [], date: "Oct 2024", month: 10, year: 2024, caption: "Thought on interfaces", category: "identity", src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&fit=crop" },
  { id: 45, type: "song", title: "Reassemblage", artist: "Visible Cloaks", tags: ["ambient","electronic","focus","music","work","2024"], people: [], date: "2024", year: 2024, caption: "Studio focus mode", category: "music", src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&fit=crop" },

  // ── Priya — more connection ──
  { id: 46, type: "photo", src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&fit=crop", tags: ["priya","lunch","friends","peckham","london","2024","food"], people: ["priya"], place: "Peckham", date: "Sep 2024", month: 9, year: 2024, caption: "Priya, lunch in Peckham", category: "social" },
  { id: 47, type: "message", from: "Priya", text: "TWIGS TICKETS SECURED. Roundhouse in March. I'm actually going to cry", tags: ["priya","message","fka twigs","concert","music","2025","future"], people: ["priya"], date: "Jan 2025", month: 1, year: 2025, caption: "Message from Priya", category: "music", src: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=800&fit=crop" },

  // ── Tom — more connection ──
  { id: 48, type: "photo", src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&fit=crop", tags: ["running","half marathon","tom","achievement","london","2024","spring"], people: ["tom"], place: "Greenwich", date: "Apr 2024", month: 4, year: 2024, caption: "Half marathon finish with Tom", category: "everyday", hasMe: true },
  { id: 49, type: "photo", src: "https://images.unsplash.com/photo-1453087460409-fd3ca2ad06be?w=800&fit=crop", tags: ["pub","tom","friends","football","london","2024","hackney"], people: ["tom","josh"], place: "Hackney", date: "Nov 2024", month: 11, year: 2024, caption: "Pub with Tom and Josh", category: "social" },

  // ── Upcoming ──
  { id: 50, type: "ticket", title: "FKA twigs — EUSEXUA Tour", venue: "Roundhouse, Camden", date: "Mar 14, 2025", month: 3, year: 2025, tags: ["fka twigs","concert","roundhouse","camden","music","future","2025","gig","ticket"], people: ["priya"], place: "Camden", future: true, src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&fit=crop", caption: "FKA twigs — EUSEXUA Tour", category: "music" },
];

const PEOPLE={
  josh:{name:"Josh",relation:"Boyfriend",since:"2022",avatar:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face"},
  lucy:{name:"Lucy",relation:"Best friend",since:"uni",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face"},
  priya:{name:"Priya",relation:"Close friend",since:"2021",avatar:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face"},
  tom:{name:"Tom",relation:"Friend",since:"school",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"},
  mum:{name:"Mum",relation:"Family",avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face"},
  dad:{name:"Dad",relation:"Family",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"},
  anika:{name:"Anika",relation:"Sister",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face"},
};
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

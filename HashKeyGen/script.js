/* =====================================================
   HashKeyGen – script.js
   Steps: 1) Database  2) Helper functions  3) Matching logic
          4) Show results  5) Buttons and events
   ===================================================== */

/* ---------- 1. DATABASE ----------
   Structure:  DB → category → sub-niche → [ description, seed terms ]
   - description : short text shown to the user under the sub-niche dropdown
   - seed terms  : popular search phrases for that sub-niche, separated by commas.
                   The first term is the "core" term of the sub-niche.
   Hashtags and keywords are built from these seed terms + the user's own words. */
const DB = {
  entertainment: { name: "Entertainment", icon: "🎭", subs: {
    "Memes": ["Funny images, videos, and jokes created to entertain people.", "memes,meme page,funny memes,indian memes,meme templates,daily memes"],
    "Relatable Content": ["Posts and videos about everyday situations, feelings, and experiences that people can connect with.", "relatable,relatable reels,everyday life,mood,so true,relatable quotes"],
    "Movies and Web Series": ["Movie reviews, recommendations, trailers, scenes, and web series discussions.", "movie review,web series,movie recommendations,bollywood,trailer reaction,binge watch"],
    "Comedy": ["Funny skits, jokes, humorous performances, and entertaining videos.", "comedy,funny skits,stand up comedy,comedy reels,jokes,punchlines"],
    "Celebrity News": ["Updates about celebrities, interviews, achievements, and public appearances.", "celebrity news,celebrity interviews,bollywood news,red carpet,star updates,celebrity style"]
  }},
  fashion: { name: "Fashion", icon: "👗", subs: {
    "Outfit Ideas": ["Clothing combinations and styling inspiration for different occasions.", "outfit ideas,ootd,daily outfits,outfit inspo,styling tips,casual outfits"],
    "Streetwear": ["Casual urban fashion, including oversized clothing, sneakers, and trendy outfits.", "streetwear,street style,oversized tshirt,sneakerhead,urban fashion,sneaker outfits"],
    "Men's Fashion": ["Clothing, accessories, grooming styles, and fashion inspiration for men.", "mens fashion,mens style,mens outfits,mens grooming,mens accessories,menswear"],
    "Women's Fashion": ["Clothing, accessories, styling ideas, and fashion inspiration for women.", "womens fashion,womens style,womens outfits,ethnic wear,dress ideas,fashion accessories"],
    "Fashion Trends": ["Latest fashion styles, popular outfits, and trending clothing ideas.", "fashion trends,style trends,popular outfits,fashion inspo,seasonal fashion,fashion week"]
  }},
  beauty: { name: "Beauty", icon: "💄", subs: {
    "Makeup Tutorials": ["Step-by-step guides for applying makeup and creating different looks.", "makeup tutorial,makeup look,eye makeup,lipstick shades,bridal makeup,beginner makeup"],
    "Skincare Tips": ["Advice and routines for skincare, skin hygiene, and product use.", "skincare tips,skincare routine,glowing skin,acne care,sunscreen,skin hygiene"],
    "Haircare": ["Hair styling ideas, haircare routines, and tips for maintaining healthy hair.", "haircare,hair growth,hairstyles,hair routine,hair oil,healthy hair"],
    "Nail Art": ["Creative nail designs, nail painting, and manicure inspiration.", "nail art,nail designs,manicure,gel nails,nail inspo,nail polish"],
    "Beauty Products": ["Reviews, recommendations, and demonstrations of beauty products.", "beauty products,product review,makeup haul,skincare products,beauty favorites,drugstore beauty"]
  }},
  education: { name: "Education", icon: "📚", subs: {
    "Study Tips": ["Learning techniques, exam preparation, note-making, and study strategies.", "study tips,exam preparation,note making,study motivation,study plan,focus tips"],
    "General Knowledge": ["Interesting facts, quizzes, and information about different subjects.", "general knowledge,gk quiz,fun facts,did you know,quiz time,world facts"],
    "Science Facts": ["Educational content about physics, chemistry, biology, space, and scientific discoveries.", "science facts,physics,chemistry,biology,space facts,scientific discoveries"],
    "Language Learning": ["Lessons about vocabulary, grammar, pronunciation, and learning new languages.", "language learning,english speaking,vocabulary,grammar tips,pronunciation,learn languages"],
    "Career Guidance": ["Information about career options, professional skills, interviews, and career planning.", "career guidance,career options,interview tips,resume tips,skill development,career planning"]
  }},
  technology: { name: "Technology", icon: "💻", subs: {
    "Artificial Intelligence": ["AI tools, applications, updates, and educational content about artificial intelligence.", "artificial intelligence,ai tools,chatgpt,ai updates,machine learning,ai for students"],
    "Programming and Coding": ["Programming languages, coding tutorials, software development, and coding tips.", "programming,coding tutorial,learn to code,software development,python,web development"],
    "Tech Gadgets": ["Information, demonstrations, and reviews of smartphones, laptops, and other electronic devices.", "tech gadgets,smartphone review,laptop review,gadget unboxing,tech reviews,new gadgets"],
    "App and Software Reviews": ["Reviews, comparisons, and recommendations of useful applications and software.", "app review,software review,useful apps,app comparison,productivity apps,best apps"],
    "Tech Tips and Tutorials": ["Technology guides, computer tricks, troubleshooting, and helpful technical tutorials.", "tech tips,computer tricks,troubleshooting,tech tutorial,phone tricks,tech hacks"]
  }},
  gaming: { name: "Gaming", icon: "🎮", subs: {
    "Mobile Gaming": ["Gameplay, reviews, and updates about smartphone games such as BGMI and Free Fire.", "mobile gaming,bgmi,free fire,mobile gameplay,gaming reels,clutch moments"],
    "PC Gaming": ["Gameplay, reviews, and updates about computer games such as Minecraft, GTA V, and Valorant.", "pc gaming,minecraft,gta v,valorant,pc gameplay,gaming setup"],
    "Console Gaming": ["Gaming content related to PlayStation, Xbox, and Nintendo consoles.", "console gaming,playstation,xbox,nintendo,console gameplay,ps5"],
    "Esports": ["Competitive gaming, professional players, tournaments, and gaming competitions.", "esports,esports tournament,pro players,gaming competition,esports team,gaming scrims"],
    "Gaming Tips and Tricks": ["Game tutorials, strategies, useful techniques, and gameplay tips.", "gaming tips,game tutorial,gameplay tips,game strategy,pro tips,gaming tricks"]
  }},
  food: { name: "Food", icon: "🍕", subs: {
    "Indian Cuisine": ["Traditional and regional Indian dishes, food preparation, and culinary culture.", "indian food,indian recipes,regional cuisine,desi food,biryani,north indian food"],
    "Street Food": ["Popular street foods, local snacks, food stalls, and street food experiences.", "street food,local snacks,chaat,food stalls,street food india,golgappa"],
    "Homemade Recipes": ["Easy-to-follow recipes for preparing meals and snacks at home.", "homemade recipes,easy recipes,quick snacks,home cooking,dinner ideas,cooking tips"],
    "Baking and Desserts": ["Cakes, cookies, pastries, chocolates, and other sweet treats.", "baking,desserts,cake recipes,cookies,chocolate dessert,pastry"],
    "Food Reviews": ["Restaurant reviews, food tasting, recommendations, and dining experiences.", "food review,restaurant review,food tasting,foodie,dining experience,must try food"]
  }},
  travel: { name: "Travel", icon: "✈️", subs: {
    "Solo Travel": ["Travel experiences, tips, and destinations for people exploring places alone.", "solo travel,solo traveler,travel alone,solo trip tips,backpacking,solo destinations"],
    "Adventure Travel": ["Exciting travel activities such as trekking, camping, and exploring adventurous destinations.", "adventure travel,trekking,camping,adventure activities,hiking,offbeat destinations"],
    "Budget Travel": ["Affordable travel destinations, low-cost accommodation, and money-saving travel tips.", "budget travel,cheap travel,travel hacks,low cost stays,backpacker budget,money saving travel"],
    "Luxury Travel": ["Premium hotels, resorts, luxury destinations, and high-end travel experiences.", "luxury travel,luxury hotels,resorts,premium stays,luxury destinations,five star stay"],
    "Travel Vlogging": ["Travel videos documenting journeys, destinations, cultures, and personal experiences.", "travel vlog,travel diaries,travel video,destination guide,travel journey,cultural experiences"]
  }},
  nature: { name: "Nature", icon: "🌿", subs: {
    "Wildlife Photography": ["Capturing photographs and videos of wild animals, birds, and their natural habitats.", "wildlife photography,wildlife,bird photography,animal photography,safari,natural habitat"],
    "Landscape Photography": ["Photography of natural scenery, including valleys, rivers, hills, and beautiful landscapes.", "landscape photography,scenic views,valleys,river views,hill scenery,nature scenery"],
    "Mountains and Forests": ["Content featuring mountains, forests, hiking trails, and green landscapes.", "mountains,forest,hiking trails,green landscapes,forest walk,mountain views"],
    "Ocean and Beaches": ["Videos and photographs of oceans, beaches, marine life, and coastal scenery.", "ocean,beaches,beach vibes,marine life,coastal views,sea waves"],
    "Nature Exploration": ["Exploring natural places, discovering plants and animals, and sharing outdoor experiences.", "nature exploration,outdoor adventure,plants and animals,nature walk,explore nature,nature lovers"]
  }},
  fitness: { name: "Sports & Fitness", icon: "💪", subs: {
    "Gym and Workout": ["Gym exercises, strength training, workout routines, and exercise demonstrations.", "gym workout,strength training,workout routine,gym motivation,exercise tips,muscle building"],
    "Yoga and Meditation": ["Yoga practices, meditation techniques, breathing exercises, and mindfulness.", "yoga,meditation,breathing exercises,mindfulness,morning yoga,yoga for beginners"],
    "Cricket": ["Cricket matches, player updates, highlights, skills, and cricket-related discussions.", "cricket,cricket highlights,cricket skills,ipl,cricket match,batting tips"],
    "Football": ["Football matches, player updates, goals, highlights, and football-related discussions.", "football,football goals,football highlights,football skills,match day,soccer"],
    "Fitness Tips": ["General fitness information, exercise guidance, healthy habits, and wellness education.", "fitness tips,healthy habits,wellness,exercise guidance,home workout,weight loss tips"]
  }},
  business: { name: "Business", icon: "💼", subs: {
    "Entrepreneurship": ["Starting businesses, developing ideas, and learning about entrepreneurship.", "entrepreneurship,startup ideas,business ideas,founder journey,startup tips,business mindset"],
    "Digital Marketing": ["Social media marketing, online advertising, content marketing, and brand promotion.", "digital marketing,social media marketing,content marketing,online advertising,brand promotion,seo tips"],
    "Small Business": ["Small business ideas, business stories, product selling, and business management.", "small business,business ideas,product selling,small business tips,business stories,online selling"],
    "Freelancing": ["Freelance work, online services, client management, and independent career opportunities.", "freelancing,freelance work,client management,work from home,online services,freelancer tips"],
    "Business Tips": ["Business strategies, management advice, productivity, and professional development.", "business tips,business strategy,management advice,productivity,professional development,leadership"]
  }},
  finance: { name: "Finance", icon: "💰", subs: {
    "Financial Education": ["Basic financial concepts, money management, and understanding financial terms.", "financial education,money management,financial terms,money basics,financial literacy,money tips"],
    "Personal Finance": ["Managing personal income, expenses, budgets, and financial goals.", "personal finance,budgeting,expense tracking,financial goals,income management,money planning"],
    "Saving Tips": ["Practical ideas for saving money and developing good saving habits.", "saving tips,save money,saving habits,money saving ideas,savings plan,frugal living"],
    "Investment Education": ["Educational content about investment concepts, risks, and different investment options.", "investment education,investing basics,mutual funds,investment risks,sip investing,wealth building"],
    "Stock Market Education": ["Learning about stocks, market concepts, trading terminology, and stock market basics.", "stock market,stock market basics,trading terms,share market,stock analysis basics,learn trading"]
  }},
  arts: { name: "Arts & Creativity", icon: "🎨", subs: {
    "Drawing and Sketching": ["Pencil drawings, sketching techniques, portraits, and creative illustrations.", "drawing,sketching,pencil drawing,portrait sketch,art tutorial,illustration"],
    "Painting": ["Watercolor, acrylic, oil painting, and other painting techniques.", "painting,watercolor,acrylic painting,oil painting,painting tutorial,art process"],
    "Digital Art": ["Artwork created using digital tools, illustration software, and graphic design applications.", "digital art,digital illustration,procreate,graphic design,art software,digital painting"],
    "DIY Crafts": ["Handmade projects, creative decorations, and do-it-yourself craft ideas.", "diy crafts,handmade,craft ideas,home decor diy,creative projects,paper crafts"],
    "Calligraphy and Lettering": ["Artistic handwriting, decorative lettering, and creative typography.", "calligraphy,hand lettering,typography,lettering art,handwriting,brush pen"]
  }},
  music: { name: "Music", icon: "🎵", subs: {
    "Singing": ["Vocal performances, singing practice, and original musical performances.", "singing,vocals,singing practice,original songs,singer,vocal performance"],
    "Instrumental Music": ["Music created using instruments such as guitar, piano, drums, and flute.", "instrumental music,guitar,piano,drums,flute,music practice"],
    "Music Covers": ["Personal performances of existing songs with an individual's own musical interpretation.", "music cover,song cover,acoustic cover,cover song,singing cover,cover reels"],
    "Music Production": ["Creating, recording, editing, and arranging music using digital tools and instruments.", "music production,beat making,music recording,fl studio,audio editing,music producer"],
    "Mashup or Remix Songs": ["Creative combinations, rearrangements, and remixes of existing songs.", "mashup,remix,song mashup,dj remix,music mashup,remix songs"]
  }},
  dance: { name: "Dance", icon: "💃", subs: {
    "Hip-Hop Dance": ["Dance performances and routines based on hip-hop music and movements.", "hip hop dance,hip hop,dance routine,street dance,hip hop moves,dance battle"],
    "Classical Dance": ["Traditional dance forms such as Bharatanatyam, Kathak, and other classical styles.", "classical dance,bharatanatyam,kathak,indian classical,dance tradition,classical dance forms"],
    "Dance Covers": ["Performing choreography inspired by popular songs and dance videos.", "dance cover,choreography,dance reels,song choreography,dance video,dance challenge"],
    "Freestyle Dance": ["Improvised dance performances using personal movements and creative expressions.", "freestyle dance,freestyle,improvised dance,dance flow,creative movement,dance expression"],
    "Dance Tutorials": ["Step-by-step lessons for learning dance moves, choreography, and techniques.", "dance tutorial,dance steps,learn dance,dance moves,choreography tutorial,dance for beginners"]
  }},
  lifestyle: { name: "Lifestyle", icon: "✨", subs: {
    "Daily Life": ["Everyday activities, routines, and personal experiences.", "daily life,day in my life,daily routine,morning routine,life update,everyday moments"],
    "Personal Development": ["Self-improvement, productivity, motivation, and personal growth.", "personal development,self improvement,productivity,motivation,personal growth,good habits"],
    "Home and Interior": ["Home decor, room makeovers, interior design, and organization.", "home decor,interior design,room makeover,home organization,decor ideas,cozy home"],
    "Relationships": ["Content about friendship, family, social connections, and everyday relationships.", "relationships,friendship,family time,social connections,relationship advice,quality time"],
    "Minimalism": ["Simple living, mindful habits, decluttering, and focusing on essential things.", "minimalism,simple living,decluttering,mindful living,minimal lifestyle,slow living"]
  }},
  photography: { name: "Photography", icon: "📷", subs: {
    "Portrait Photography": ["Capturing photographs of people, their expressions, and personalities.", "portrait photography,portraits,photo poses,candid portraits,portrait lighting,people photography"],
    "Street Photography": ["Capturing everyday life, people, and interesting moments in public places.", "street photography,candid moments,city life,urban photography,public places,street portraits"],
    "Mobile Photography": ["Taking creative photographs using smartphones and learning mobile photography techniques.", "mobile photography,phone photography,shot on phone,smartphone camera,photo tricks,mobile photo editing"],
    "Product Photography": ["Capturing attractive photographs of products for advertisements, brands, and online stores.", "product photography,product shoot,brand photography,ecommerce photos,product styling,lighting setup"],
    "Photography Tips": ["Tutorials about camera settings, lighting, composition, and photo editing.", "photography tips,camera settings,lighting tips,composition,photo editing,photography basics"]
  }},
  pets: { name: "Pets & Animals", icon: "🐾", subs: {
    "Dogs": ["Dog videos, care tips, training information, and entertaining moments.", "dogs,dog videos,dog training,puppy,dog care,dog lovers"],
    "Cats": ["Cat videos, funny moments, care routines, and interesting cat facts.", "cats,cat videos,funny cats,kitten,cat care,cat lovers"],
    "Pet Care": ["General information about pet hygiene, nutrition, grooming, and responsible pet ownership.", "pet care,pet grooming,pet nutrition,pet hygiene,responsible pet owner,pet health"],
    "Pet Training": ["Basic training techniques, pet behavior, and learning activities for animals.", "pet training,dog training tips,pet behavior,training tricks,obedience,learning activities"],
    "Animal Facts": ["Interesting facts, educational information, and videos about different animals.", "animal facts,wildlife facts,interesting animals,animal videos,did you know animals,animal kingdom"]
  }},
  automobiles: { name: "Automobiles", icon: "🚗", subs: {
    "Cars": ["Car reviews, features, designs, and updates about different car models.", "cars,car review,car features,car design,new car models,car lovers"],
    "Motorcycles": ["Bike reviews, riding experiences, features, and motorcycle updates.", "motorcycles,bike review,bike riding,riding experience,motorcycle updates,biker life"],
    "Automobile Reviews": ["Comparisons, performance discussions, and reviews of different vehicles.", "car comparison,vehicle review,performance review,automobile review,mileage test,test drive"],
    "Car Modifications": ["Vehicle customization, accessories, design changes, and modification ideas.", "car modification,car customization,car accessories,modified cars,custom design,car upgrades"],
    "Automobile News": ["Latest updates about vehicle launches, automobile technology, and industry developments.", "automobile news,vehicle launch,auto industry,electric vehicles,car launch,automobile technology"]
  }},
  news: { name: "News & Current Affairs", icon: "📰", subs: {
    "National News": ["Important news, events, and developments happening across the country.", "national news,india news,breaking news,current affairs,country updates,news today"],
    "International News": ["Major global events, international developments, and world updates.", "international news,world news,global events,world updates,global affairs,world politics"],
    "Technology News": ["Latest updates about technology companies, gadgets, AI, and innovations.", "tech news,technology updates,ai news,gadget launch,tech industry,innovation"],
    "Sports News": ["Updates about sports events, tournaments, teams, and athletes.", "sports news,tournament updates,match results,athlete news,team updates,sports highlights"],
    "Entertainment News": ["Latest updates about movies, celebrities, television, and the entertainment industry.", "entertainment news,movie updates,celebrity updates,tv shows,box office,bollywood news"]
  }}
};

// Common words we ignore when reading the topic
const STOP_WORDS = ["a","an","the","and","or","for","of","to","in","on","with","my","your","is","are","how","about","this","that","from","at","by","post","video","best"];

/* ---------- 2. HELPER FUNCTIONS ---------- */

// Get the HTML element by id (shorter to write)
const $ = (id) => document.getElementById(id);

// Break the topic into useful lowercase words
function getWords(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.includes(w));
}

// Remove special characters so the text is valid as a hashtag
function cleanTag(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/* ---------- 2b. CATEGORY CARDS AND DROPDOWNS ---------- */

// Runs once when the page loads: builds the 10 cards and fills the category dropdown
function setupCategories() {
Object.keys(DB).forEach((key, index) => {
      const cat = DB[key];
    $("niche").add(new Option((index + 1) + ". " + cat.name, key));   // dropdown option

    const card = document.createElement("button");               // clickable card
    card.type = "button";
    card.className = "cat-card";
    card.dataset.key = key;
    const icon = document.createElement("span");
    icon.className = "cat-icon";
    icon.textContent = cat.icon;
    const label = document.createElement("span");
    label.textContent = cat.name;
    card.append(icon, label);
    card.addEventListener("click", () => {
      $("niche").value = key;       // card click = choose that category
      updateSubNiches();
      $("subniche").focus();
    });
    $("catGrid").appendChild(card);
  });
}

// Shows the description of the chosen sub-niche under the dropdown
function showSubDescription() {
  const cat = $("niche").value, sub = $("subniche").value;
  $("subDesc").textContent = (cat && sub) ? DB[cat].subs[sub][0] : "";
  $("subDesc").classList.toggle("hidden", !(cat && sub));
}

// Fills the sub-niche dropdown based on the chosen category
function updateSubNiches() {
  const key = $("niche").value;
  const sub = $("subniche");
  sub.innerHTML = "";
  document.querySelectorAll(".cat-card").forEach(c => c.classList.toggle("active", c.dataset.key === key));
  showError("");
  showSubDescription();
  if (!key) {
    sub.add(new Option("Choose a category first", ""));
    sub.disabled = true;
    return;
  }
  sub.add(new Option("Select a sub-niche…", ""));
const roman = ["i", "ii", "iii", "iv", "v"];
Object.keys(DB[key].subs).forEach((name, i) => sub.add(new Option(roman[i] + ". " + name, name)));  sub.disabled = false;
}

/* ---------- 3. MATCHING LOGIC ----------
   We build two "pools" of candidates (hashtags and keywords) from the sub-niche's seed terms.
   Each candidate gets a score:  +2 for every word of the user's description it contains,
   +1 if it is a seed term. A small random number mixes equal scores, so Regenerate gives new sets. */

// Pick the best 'count' candidates that are not already used (no duplicates)
function pickFrom(pool, count, used) {
  pool.forEach(p => p.score = p.relevance * 2 + p.base + Math.random() * 0.99);
  pool.sort((a, b) => b.score - a.score);
  const result = [];
  for (const p of pool) {
    if (result.length === count) break;
    if (!used.has(p.text)) { result.push(p.text); used.add(p.text); }
  }
  return result;
}

// Build exactly 5 hashtags and 10 keywords
function buildResults(catKey, subName, topic) {
  const cat = DB[catKey];
  const seeds = cat.subs[subName][1].split(",");   // seed terms of this sub-niche
  const core = seeds[0];                           // main term, e.g. "mobile gaming"
  const words = getWords(topic);

  // How many of the user's words appear inside a phrase?
  const relevance = (phrase) => words.filter(w => w.length > 2 && phrase.includes(w)).length;

  /* HASHTAGS: 1 from the user's own words + 4 from the pool */
  const usedTags = new Set();
  const tags = [];
  const ownTag = cleanTag(words.slice(0, 2).join(""));
  if (ownTag.length >= 4) { tags.push(ownTag); usedTags.add(ownTag); }

  const tagPool = [
    ...seeds.map(s => ({ text: cleanTag(s), relevance: relevance(s), base: 1 })),
    ...["reels", "community", "lovers"].map(x => ({ text: cleanTag(core) + x, relevance: relevance(core), base: 0 }))
  ].filter(p => p.text.length >= 4 && p.text.length <= 30);
  tags.push(...pickFrom(tagPool, 5 - tags.length, usedTags));

  /* KEYWORDS: 2 from the user's own phrase + 8 from the pool */
  const usedKws = new Set();
  const kws = [];
  const phrase = words.slice(0, 4).join(" ");
  if (phrase.length >= 4) {
    kws.push(phrase); usedKws.add(phrase);
    kws.push(phrase + " ideas"); usedKws.add(phrase + " ideas");
  }

  // Seed terms, plus seed terms with a helpful ending ("tips", "ideas"...)
  const endings = ["ideas", "tips", "reel ideas", "content ideas", "inspiration"];
  const kwPool = [
    ...seeds.map(s => ({ text: s, relevance: relevance(s), base: 1 })),
    ...seeds.map(s => ({ text: s + " " + endings[Math.floor(Math.random() * endings.length)], relevance: relevance(s), base: 0 }))
      .filter(p => !p.text.split(" ").slice(0, -1).includes(p.text.split(" ").pop())),
    { text: cat.name.toLowerCase() + " content ideas", relevance: 0, base: 0 }
  ];
  kws.push(...pickFrom(kwPool, 10 - kws.length, usedKws));

  return { tags: tags.map(t => "#" + t), kws: kws };
}

/* ---------- 4. SHOW RESULTS ---------- */
let current = { niche: "", sub: "", topic: "", tags: [], kws: [] };

function showChips(containerId, items) {
  $(containerId).innerHTML = "";
  items.forEach((text, i) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.style.animationDelay = (i * 40) + "ms";
    chip.textContent = text;           // textContent keeps it safe from HTML injection
    chip.title = "Click to copy";
    chip.addEventListener("click", () => copyText(text, "Copied: " + text));   // click a chip to copy it
    $(containerId).appendChild(chip);
  });
}

function showError(message) {
  $("error").textContent = message;
  $("error").classList.toggle("show", message !== "");
}

// Check the inputs and return an error message (or "" if all is fine)
function validate() {
  const topic = $("topic").value.trim();
  if (!$("niche").value) return "Please select a category first.";
  if (!$("subniche").value) return "Please select a sub-niche.";
  if (topic === "") return "Please describe your post topic.";
  if (topic.length < 3) return "Your topic is too short. Write at least 3 characters.";
  if (!/[a-zA-Z]/.test(topic)) return "Please use some letters in your topic, not only numbers or symbols.";
  return "";
}

function generate(isRegenerate) {
  const message = validate();
  showError(message);
  if (message) return;

  const niche = $("niche").value;
  const sub = $("subniche").value;
  const topic = $("topic").value.trim();

  // Show the loading animation, hide old results
  $("results").classList.remove("hidden");
  $("resultContent").classList.add("hidden");
  $("loader").classList.remove("hidden");
  if (!isRegenerate) $("results").scrollIntoView({ behavior: "smooth", block: "start" });

  setTimeout(() => {
    // On regenerate, try a few times to get a different set
    let out = buildResults(niche, sub, topic);
    if (isRegenerate) {
      for (let i = 0; i < 8 && out.tags.join() === current.tags.join() && out.kws.join() === current.kws.join(); i++) {
        out = buildResults(niche, sub, topic);
      }
    }
    current = { niche, sub, topic, tags: out.tags, kws: out.kws };
    showChips("hashtagList", out.tags);
    showChips("keywordList", out.kws);
    $("loader").classList.add("hidden");
    $("resultContent").classList.remove("hidden");
  }, 900);
}

/* ---------- 5. COPY, RESET AND EVENTS ---------- */
function showToast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 2200);
}

function copyText(text, successMessage) {
  // Modern way
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast(successMessage)).catch(() => oldCopy(text, successMessage));
  } else {
    oldCopy(text, successMessage);   // works when opening the file directly
  }
}
function oldCopy(text, successMessage) {
  const box = document.createElement("textarea");
  box.value = text;
  box.style.position = "fixed"; box.style.opacity = "0";
  document.body.appendChild(box);
  box.select();
  try { document.execCommand("copy"); showToast(successMessage); }
  catch (e) { showToast("Copy failed. Please select the text and copy it manually."); }
  document.body.removeChild(box);
}

function resetAll() {
  $("niche").value = "";
  updateSubNiches();
  $("topic").value = "";
  $("count").textContent = "0";
  showError("");
  $("results").classList.add("hidden");
  current = { niche: "", sub: "", topic: "", tags: [], kws: [] };
  showToast("Cleared. Ready for a new post!");
}

// Connect buttons to functions
$("generateBtn").addEventListener("click", () => generate(false));
$("regenBtn").addEventListener("click", () => generate(true));
$("resetBtn").addEventListener("click", resetAll);
$("copyTagsBtn").addEventListener("click", () => copyText(current.tags.join(" "), "Hashtags copied! ✅"));
$("copyKeywordsBtn").addEventListener("click", () => copyText(current.kws.join(", "), "Keywords copied! ✅"));

// Character counter and press Enter to generate
$("topic").addEventListener("input", () => { $("count").textContent = $("topic").value.length; showError(""); });
$("topic").addEventListener("keydown", (e) => { if (e.key === "Enter") generate(false); });
$("niche").addEventListener("change", updateSubNiches);
$("subniche").addEventListener("change", () => { showError(""); showSubDescription(); });
$("copyAllBtn").addEventListener("click", () => copyText(current.tags.join(" ") + "\n\n" + current.kws.join(", "), "Hashtags and keywords copied! ✅"));

// Build the category cards when the page loads
setupCategories();

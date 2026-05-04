import { useState, useRef, useCallback, useEffect } from "react";

const TABS = [
  { key: "historical", label: "Brief", icon: "📜" },
  { key: "awkward", label: "Awkward", icon: "😬" },
  { key: "mythologies", label: "Myths", icon: "🐉" },
  { key: "anxieties", label: "Anxieties", icon: "⚡" },
  { key: "monsters", label: "Monsters", icon: "👹" },
];

const QUOTES = [
  { text: "Medieval and Renaissance cartographers had a practical solution for the edges of the known world: rather than leave it blank, they drew monsters.", author: "Mook Simpson" },
  { text: "These creatures function as what theorist Timothy Beal calls monstrum: warnings that break into our world from another realm.", author: "Mook Simpson" },
  { text: "Monsters embody what cannot otherwise be articulated. They are anxiety made visible, existential fear given form.", author: "Mook Simpson" },
  { text: "The technique isn't new. The Dadaists questioned the importance and value of Art with a capital A through their desecrations of the image.", author: "Phil James" },
  { text: "This is painting as entertainment and provocation. This is Mook's universe.", author: "Phil James" },
  { text: "The fauna may look cute, but much like the fauna of his home country, they will kill you.", author: "Phil James" },
  { text: "Monsters are the joint between physical reality and artistic expressions.", author: "Marco Frascari, via Tom Rivard" },
  { text: "The white settlers in the base paintings are, rather than the robust and hardy pioneers of colonial mythology, literally children in the midst of this primeval continent.", author: "Tom Rivard" },
  { text: "What terrifies us is that, suddenly, we realise that the colonists do not belong here, while the monsters clearly do, happily and joyfully.", author: "Tom Rivard" },
  { text: "More pointedly, these fantastical images terrify us because of their absolute plausibility.", author: "Tom Rivard" },
  { text: "We have met the enemy, and he is us.", author: "Pogo, via Tom Rivard" },
  { text: "Gadfooks! Old masterpieces mocked playfully with painted insertions! Art with a capital A made into arf.", author: "Matt Dukes Jordan" },
  { text: "Mook points out that we're being manipulated.", author: "Matt Dukes Jordan" },
  { text: "I am trying to show that the myths were never stable to begin with.", author: "Mook Simpson" },
  { text: "When you see the original again, it looks empty. That's magic to me. You can't look at the original the same way. It's forever changed.", author: "Mook Simpson" },
  { text: "Are you ruining people's experience of the real thing? Hopefully!", author: "Mook Simpson, ArtW*nk Interview" },
  { text: "I chose them because they're so beloved.", author: "Mook Simpson, ArtW*nk Interview" },
  { text: "It's funnier for the object to be coherent, and painted lovingly together.", author: "Mook Simpson, ArtW*nk Interview" },
  { text: "In Australia alone is to be found the Grotesque, the Weird, the strange scribblings of Nature learning how to write.", author: "Marcus Clarke, via Tom Rivard" },
  { text: "They make the familiar unfamiliar, and crucially, they make it impossible to look at the original paintings the same way again.", author: "Mook Simpson" },
];

const EXAMPLES = [
  // Australian - Heidelberg School
  { title: "Golden Summer, Eaglemont (1889) by Arthur Streeton", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Arthur_Streeton_-_Golden_summer%2C_Eaglemont_-_Google_Art_Project.jpg/960px-Arthur_Streeton_-_Golden_summer%2C_Eaglemont_-_Google_Art_Project.jpg" },
  { title: "A Bush Idyll (1896) by Frederick McCubbin", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Frederick_McCubbin_-_A_bush_idyll_-_Google_Art_Project.jpg/960px-Frederick_McCubbin_-_A_bush_idyll_-_Google_Art_Project.jpg" },
  { title: "Shearing the Rams (1890) by Tom Roberts", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tom_Roberts_-_Shearing_the_rams_-_Google_Art_Project.jpg/960px-Tom_Roberts_-_Shearing_the_rams_-_Google_Art_Project.jpg" },
  { title: "The Purple Noon's Transparent Might (1896) by Arthur Streeton", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Arthur_Streeton_-_%27The_purple_noon%27s_transparent_might%27_-_Google_Art_Project.jpg/960px-Arthur_Streeton_-_%27The_purple_noon%27s_transparent_might%27_-_Google_Art_Project.jpg" },
  { title: "Down on His Luck (1889) by Frederick McCubbin", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Frederick_McCubbin_-_Down_on_His_Luck_-_Google_Art_Project.jpg/960px-Frederick_McCubbin_-_Down_on_His_Luck_-_Google_Art_Project.jpg" },
  { title: "The Selector's Hut (1890) by Arthur Streeton", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Arthur_Streeton_-_The_selector%27s_hut_%28Whelan_on_the_log%29_-_Google_Art_Project.jpg/960px-Arthur_Streeton_-_The_selector%27s_hut_%28Whelan_on_the_log%29_-_Google_Art_Project.jpg" },
  { title: "Bailed Up (1895) by Tom Roberts", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Tom_Roberts_-_Bailed_Up%2C_1895.jpg/960px-Tom_Roberts_-_Bailed_Up%2C_1895.jpg" },
  { title: "The Pioneer (1904) by Frederick McCubbin", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Frederick_McCubbin_-_The_pioneer_-_Google_Art_Project.jpg/960px-Frederick_McCubbin_-_The_pioneer_-_Google_Art_Project.jpg" },
  { title: "A Break Away! (1891) by Tom Roberts", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Tom_Roberts_-_A_break_away%21_-_Google_Art_Project.jpg/960px-Tom_Roberts_-_A_break_away%21_-_Google_Art_Project.jpg" },
  { title: "The Spirit of the Drought (1896) by Arthur Streeton", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Arthur_Streeton_-_The_spirit_of_the_drought_-_Google_Art_Project.jpg/960px-Arthur_Streeton_-_The_spirit_of_the_drought_-_Google_Art_Project.jpg" },
  // American - Manifest Destiny / Hudson River / Western
  { title: "American Progress (1872) by John Gast", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/American_Progress_%28John_Gast_painting%29.jpg/960px-American_Progress_%28John_Gast_painting%29.jpg" },
  { title: "Washington Crossing the Delaware (1851) by Emanuel Leutze", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Washington_Crossing_the_Delaware_by_Emanuel_Leutze%2C_MMA-NYC%2C_1851.jpg/960px-Washington_Crossing_the_Delaware_by_Emanuel_Leutze%2C_MMA-NYC%2C_1851.jpg" },
  { title: "Among the Sierra Nevada (1868) by Albert Bierstadt", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Albert_Bierstadt_-_Among_the_Sierra_Nevada%2C_California_-_Google_Art_Project.jpg/960px-Albert_Bierstadt_-_Among_the_Sierra_Nevada%2C_California_-_Google_Art_Project.jpg" },
  { title: "The Rocky Mountains, Lander's Peak (1863) by Albert Bierstadt", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Albert_Bierstadt_-_The_Rocky_Mountains%2C_Lander%27s_Peak.jpg/960px-Albert_Bierstadt_-_The_Rocky_Mountains%2C_Lander%27s_Peak.jpg" },
  { title: "Emigrants Crossing the Plains (1869) by Albert Bierstadt", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Albert_Bierstadt_-_Emigrants_Crossing_the_Plains_-_Google_Art_Project.jpg/960px-Albert_Bierstadt_-_Emigrants_Crossing_the_Plains_-_Google_Art_Project.jpg" },
  { title: "The Oxbow (1836) by Thomas Cole", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Cole_Thomas_The_Oxbow_%28The_Connecticut_River_near_Northampton_1836%29.jpg/960px-Cole_Thomas_The_Oxbow_%28The_Connecticut_River_near_Northampton_1836%29.jpg" },
  { title: "Westward the Course of Empire (1861) by Emanuel Leutze", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Leutze%2C_Emanuel_%E2%80%94_Westward_the_Course_of_Empire_Takes_Its_Way_%E2%80%94_1861.jpg/960px-Leutze%2C_Emanuel_%E2%80%94_Westward_the_Course_of_Empire_Takes_Its_Way_%E2%80%94_1861.jpg" },
  { title: "The Last of the Mohicans (1827) by Thomas Cole", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Thomas_Cole_-_Scene_from_%22The_Last_of_the_Mohicans%22%2C_Cora_Kneeling_at_the_Feet_of_Tamenund_-_Google_Art_Project.jpg/960px-Thomas_Cole_-_Scene_from_%22The_Last_of_the_Mohicans%22%2C_Cora_Kneeling_at_the_Feet_of_Tamenund_-_Google_Art_Project.jpg" },
  { title: "Fur Traders Descending the Missouri (1845) by George Caleb Bingham", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/George_Caleb_Bingham_-_Fur_Traders_Descending_the_Missouri_-_WGA2205.jpg/960px-George_Caleb_Bingham_-_Fur_Traders_Descending_the_Missouri_-_WGA2205.jpg" },
  { title: "Daniel Boone Escorting Settlers (1851) by George Caleb Bingham", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/George_Caleb_Bingham_-_Daniel_Boone_Escorting_Settlers_through_the_Cumberland_Gap.jpg/960px-George_Caleb_Bingham_-_Daniel_Boone_Escorting_Settlers_through_the_Cumberland_Gap.jpg" },
];

const RAIN_EMOJIS = ["😬","😨","☠️","👀","🐙","🧌","👾","👺","👹"];

function EmojiRain() {
  const [drops, setDrops] = useState([]);
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        id: i,
        emoji: RAIN_EMOJIS[Math.floor(Math.random() * RAIN_EMOJIS.length)],
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
        size: 16 + Math.random() * 20,
      });
    }
    setDrops(arr);
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
      {drops.map((d) => (
        <span key={d.id} style={{
          position: "absolute",
          left: `${d.left}%`,
          top: -40,
          fontSize: d.size,
          animation: `emojiDrop ${d.duration}s linear ${d.delay}s infinite`,
          opacity: 0.85,
        }}>{d.emoji}</span>
      ))}
    </div>
  );
}

function SlotBullet({ item, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 120);
    return () => clearTimeout(t);
  }, [index]);
  return (
    <div style={{ ...S.bulletRow, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.12}s` }}>
      <span style={S.bulletStar}><svg width="12" height="12" viewBox="0 0 12 12" style={{animation:"spinStar 3s linear infinite"}}><path d="M6 0L7.4 4.6L12 6L7.4 7.4L6 12L4.6 7.4L0 6L4.6 4.6Z" fill="currentColor"/></svg></span>
      <div>
        <p style={S.bulletHead}>{item.headline}</p>
        <p style={S.bulletDetail}>{item.detail}</p>
      </div>
    </div>
  );
}

function App() {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState("historical");
  const [expanded, setExpanded] = useState({});
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [reportQuote, setReportQuote] = useState(null);
  const [loadingExample, setLoadingExample] = useState(false);
  const fileRef = useRef();
  const videoRef = useRef();
  const [cameraOpen, setCameraOpen] = useState(false);
  const streamRef = useRef(null);

  const toggle = (k) => setExpanded((p) => ({ ...p, [k]: !p[k] }));

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setImageData({ data: reader.result.split(",")[1], media_type: file.type });
      setReport(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const loadExample = async () => {
    setLoadingExample(true);
    setError(null);
    const example = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
    try {
      const res = await fetch("/api/fetch-example", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: example.url }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const dataUrl = `data:${data.media_type};base64,${data.data}`;
      setImage(dataUrl);
      setImageData({ data: data.data, media_type: data.media_type });
      setReport(null);
      setLoadingExample(false);
    } catch (err) {
      console.error(err);
      setError("Couldn't fetch example. Try uploading an image instead.");
      setLoadingExample(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer?.files?.[0]);
  }, [processFile]);

  const openCamera = async () => {
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { setError("Camera access denied"); setCameraOpen(false); }
  };

  const capturePhoto = () => {
    const v = videoRef.current;
    if (!v) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    c.toBlob((b) => { processFile(new File([b], "capture.jpg", { type: "image/jpeg" })); closeCamera(); }, "image/jpeg", 0.9);
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };

  const analyse = async () => {
    if (!imageData) return;
    setLoading(true); setError(null); setReport(null);
    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData.data, media_type: imageData.media_type }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setReport(data);
      setActiveTab("historical");
      setExpanded({});
      setReportQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. The landscape defended itself.");
    } finally { setLoading(false); }
  };

  const reset = () => { setImage(null); setImageData(null); setReport(null); setError(null); setExpanded({}); };

  const renderBullets = (items) => (items || []).map((item, i) => (
    <SlotBullet key={`${activeTab}-${i}`} item={item} index={i} />
  ));

  const renderTabContent = () => {
    if (!report) return null;
    switch (activeTab) {
      case "historical":
        return (
          <div>
            <p style={S.bodyText}>{report.historical_summary}</p>
            {report.historical_detail && (
              <>
                <button onClick={() => toggle("hist")} style={S.moreBtn}>
                  {expanded.hist ? "− Less" : "+ More info"}
                </button>
                {expanded.hist && (
                  <div style={S.expandArea}>
                    {report.historical_detail.split("\n\n").map((p, i) => (
                      <p key={i} style={S.bodyText}>{p}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      case "awkward":
        return <div>{renderBullets(report.awkward_details)}</div>;
      case "mythologies":
        return (
          <div>
            {renderBullets(report.mythologies)}
            {report.mythologies_expanded && (
              <>
                <button onClick={() => toggle("myth")} style={S.moreBtn}>
                  {expanded.myth ? "− Less" : "+ More info"}
                </button>
                {expanded.myth && (
                  <div style={S.expandArea}>
                    {report.mythologies_expanded.split("\n\n").map((p, i) => (
                      <p key={i} style={S.bodyText}>{p}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      case "anxieties":
        return <div>{renderBullets(report.anxieties)}</div>;
      case "monsters":
        return (
          <div>
            {renderBullets(report.monsters)}
            {reportQuote && (
              <div style={S.quoteBlock}>
                <p style={S.quoteText}>"{reportQuote.text}"</p>
                <p style={S.quoteAttr}>{reportQuote.author}, <em>There Be Monsters</em></p>
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={S.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@400;500;600&display=swap');
        @keyframes scanMove{0%{top:0}100%{top:100%}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes spinStar{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes emojiDrop{0%{top:-40px;opacity:0}10%{opacity:0.85}90%{opacity:0.85}100%{top:110%;opacity:0}}
        *{box-sizing:border-box;margin:0;padding:0}
        .tabs::-webkit-scrollbar{display:none}
      `}</style>

      <header style={S.header}>
        <h1 style={S.title}>THERE BE MONSTERS</h1>
        <div style={S.titleDivider}/>
        <h2 style={S.titleSub}>A CRITICAL THEORY TOOL FOR SUSPICIOUS LANDSCAPES</h2>
        <p style={S.tagline}>Instantly Ruin any Beloved Image</p>
      </header>

      {cameraOpen && (
        <div style={S.cameraOverlay}>
          <video ref={videoRef} autoPlay playsInline style={S.video}/>
          <div style={S.camControls}>
            <button onClick={closeCamera} style={S.camCancel}>Cancel</button>
            <button onClick={capturePhoto} style={S.camShutter}>
              <div style={S.shutterO}><div style={S.shutterI}/></div>
            </button>
            <div style={{width:64}}/>
          </div>
        </div>
      )}

      {!image && !cameraOpen && (
        <>
          <div style={{...S.dropZone,...(dragOver?S.dropActive:{})}}
            onDragOver={(e)=>{e.preventDefault();setDragOver(true)}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={handleDrop}
            onClick={()=>fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={(e)=>processFile(e.target.files?.[0])}/>
            <div style={S.dropIcon}>🖼</div>
            <p style={S.dropText}>Drop a painting, landscape, or scene</p>
            <p style={S.dropSub}>or tap to browse</p>
            <button onClick={(e)=>{e.stopPropagation();openCamera()}} style={S.camOpenBtn}>📷 Use Camera</button>
          </div>
          <button onClick={loadExample} disabled={loadingExample} style={S.exampleBtn}>
            {loadingExample ? "Fetching a masterpiece…" : "🎲 Choose an example for me"}
          </button>
        </>
      )}

      {image && !report && !loading && (
        <div style={{animation:"fadeIn 0.4s ease",marginBottom:24}}>
          <div style={S.imgFrame}><img src={image} alt="Subject" style={S.img}/></div>
          <div style={S.previewAct}>
            <button onClick={reset} style={S.btnSec}>Discard</button>
            <button onClick={analyse} style={S.btnPri}>Ruin This</button>
          </div>
        </div>
      )}

      {loading && (
        <div style={{animation:"fadeIn 0.4s ease",marginBottom:24}}>
          <div style={S.imgFrame}>
            <img src={image} alt="Subject" style={S.img}/>
            <div style={S.scanOverlay}>
              <div style={S.scanLine}/>
              <EmojiRain />
            </div>
          </div>
          <div style={S.loadText}><span style={S.loadDot}>●</span> Ruining…</div>
          <p style={S.loadSub}>Checking for suppressed monsters and suspicious skies</p>
        </div>
      )}

      {error && (
        <div style={S.errorBox}>
          <p>{error}</p>
          <button onClick={reset} style={{...S.btnSec,marginTop:12}}>Try again</button>
        </div>
      )}

      {report && (
        <div style={{animation:"fadeIn 0.5s ease",paddingBottom:32}}>
          <div style={S.rptHeader}>
            <img src={image} alt="" style={S.rptThumb}/>
            <div style={{flex:1,minWidth:0}}>
              {report.painting_name && (
                <h2 style={S.paintingName}>{report.painting_name}</h2>
              )}
              <p style={S.rptAka}>
                {report.painting_name ? `AKA "${report.aka}"` : `"${report.aka}"`}
              </p>
              <p style={S.rptId}>{report.identification}</p>
            </div>
          </div>

          <div className="tabs" style={S.tabs}>
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{...S.tab, ...(activeTab === t.key ? S.tabActive : {})}}>
                <span style={S.tabIcon}>{t.icon}</span>
                <span style={S.tabLabel}>{t.label}</span>
              </button>
            ))}
          </div>

          <div key={activeTab} style={S.tabContent}>
            {renderTabContent()}
          </div>

          <button onClick={reset} style={S.newBtn}>Destroy Another</button>
        </div>
      )}

      {!image && (
        <div style={S.homeQuote}>
          <p style={S.homeQuoteText}>"{quote.text}"</p>
          <p style={S.homeQuoteAttr}>{quote.author}, <em>There Be Monsters</em></p>
        </div>
      )}

      <footer style={S.footer}>
        <p style={S.footerText}>MOOK SIMPSON</p>
        <a href="http://mooksimpson.com" target="_blank" rel="noopener noreferrer" style={S.footerLink}>mooksimpson.com</a>
      </footer>
    </div>
  );
}

const C = {
  bg: "#ffffff",
  surface: "#fff",
  border: "#d4cdc0",
  text: "#1a1714",
  muted: "#6b6358",
  accent: "#1a1714",
  accentSub: "rgba(26,23,20,0.06)",
  red: "#c45a3c",
};

const S = {
  container: { fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: "100vh", maxWidth: 520, margin: "0 auto", padding: "0 20px" },
  header: { textAlign: "center", padding: "52px 0 36px", borderBottom: `2px solid ${C.text}`, marginBottom: 32 },
  title: { fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, letterSpacing: "0.12em", color: C.text, lineHeight: 1.2 },
  titleDivider: { width: 40, height: 2, background: C.red, margin: "10px auto" },
  titleSub: { fontFamily: "'Playfair Display',serif", fontSize: 12, fontWeight: 400, letterSpacing: "0.15em", color: C.muted, marginTop: 4 },
  tagline: { marginTop: 14, fontSize: 14, color: C.text, fontStyle: "italic", fontFamily: "'Playfair Display',serif" },

  dropZone: { border: `2px dashed ${C.border}`, borderRadius: 4, padding: "48px 24px", textAlign: "center", cursor: "pointer", transition: "all .2s", marginBottom: 12, background: C.surface },
  dropActive: { borderColor: C.text, background: C.accentSub },
  dropIcon: { fontSize: 48, marginBottom: 16, filter: "grayscale(0.8)" },
  dropText: { fontSize: 15, color: C.text, marginBottom: 6, fontFamily: "'Playfair Display',serif" },
  dropSub: { fontSize: 13, color: C.muted, marginBottom: 20 },
  camOpenBtn: { background: C.surface, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, padding: "10px 20px", fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif" },

  exampleBtn: { width: "100%", background: C.accentSub, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, padding: "14px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'Inter',sans-serif", marginBottom: 24, transition: "all .2s" },

  cameraOverlay: { position: "fixed", inset: 0, zIndex: 100, background: "#000", display: "flex", flexDirection: "column" },
  video: { flex: 1, objectFit: "cover", width: "100%" },
  camControls: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", background: "rgba(0,0,0,.8)" },
  camCancel: { background: "none", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", fontFamily: "'Inter',sans-serif", width: 64 },
  camShutter: { background: "none", border: "none", cursor: "pointer", padding: 0 },
  shutterO: { width: 68, height: 68, borderRadius: "50%", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" },
  shutterI: { width: 56, height: 56, borderRadius: "50%", background: "#fff" },

  imgFrame: { borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}`, position: "relative", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
  img: { width: "100%", display: "block", maxHeight: 400, objectFit: "contain", background: "#f0f0f0" },
  previewAct: { display: "flex", gap: 12, marginTop: 16 },
  btnPri: { flex: 1, background: C.text, color: C.bg, border: "none", borderRadius: 4, padding: "14px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif" },
  btnSec: { flex: 1, background: C.surface, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, padding: "14px 20px", fontSize: 15, cursor: "pointer", fontFamily: "'Inter',sans-serif" },

  scanOverlay: { position: "absolute", inset: 0, overflow: "hidden", background: "rgba(0,0,0,.25)" },
  scanLine: { position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.red},transparent)`, boxShadow: `0 0 20px ${C.red}`, animation: "scanMove 2s linear infinite", zIndex: 3 },
  loadText: { fontSize: 16, fontWeight: 600, marginTop: 20, textAlign: "center", fontFamily: "'Playfair Display',serif" },
  loadDot: { color: C.red, animation: "pulse 1.2s infinite", display: "inline-block", marginRight: 6 },
  loadSub: { fontSize: 12, color: C.muted, textAlign: "center", marginTop: 8, lineHeight: 1.5, fontStyle: "italic" },

  errorBox: { background: C.surface, border: `1px solid ${C.red}`, borderRadius: 4, padding: 24, textAlign: "center", marginBottom: 24 },

  rptHeader: { display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24 },
  rptThumb: { width: 80, height: 80, borderRadius: 4, objectFit: "cover", border: `1px solid ${C.border}`, flexShrink: 0, boxShadow: "0 1px 6px rgba(0,0,0,0.1)" },
  paintingName: { fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: 4 },
  rptAka: { fontSize: 13, color: C.muted, fontStyle: "italic", fontFamily: "'Playfair Display',serif", marginBottom: 4 },
  rptId: { fontSize: 12, color: C.muted, lineHeight: 1.4 },

  tabs: { display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" },
  tab: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, cursor: "pointer", flexShrink: 0, transition: "all .2s", fontFamily: "'Inter',sans-serif", color: C.muted },
  tabActive: { background: C.text, borderColor: C.text, color: C.bg },
  tabIcon: { fontSize: 18 },
  tabLabel: { fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" },

  tabContent: { animation: "fadeIn 0.3s ease", minHeight: 200 },

  bodyText: { fontSize: 14, lineHeight: 1.75, color: C.text, marginBottom: 10, fontFamily: "'Playfair Display',serif" },
  bulletRow: { display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.accentSub}` },
  bulletStar: { color: C.red, flexShrink: 0, marginTop: 5, display: "flex", alignItems: "center" },
  bulletHead: { fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 2, fontFamily: "'Playfair Display',serif" },
  bulletDetail: { fontSize: 13, color: C.muted, lineHeight: 1.55 },

  moreBtn: { background: "none", border: "none", color: C.red, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "10px 0", fontFamily: "'Inter',sans-serif" },
  expandArea: { animation: "fadeIn 0.3s ease", paddingTop: 8 },

  quoteBlock: { marginTop: 24, padding: "20px 18px", background: C.surface, borderRadius: 4, borderTop: `2px solid ${C.text}`, borderBottom: `2px solid ${C.text}` },
  quoteText: { fontSize: 14, lineHeight: 1.7, color: C.text, fontStyle: "italic", fontFamily: "'Playfair Display',serif", marginBottom: 8 },
  quoteAttr: { fontSize: 11, color: C.muted, textAlign: "right" },

  homeQuote: { padding: "24px 0", borderTop: `1px solid ${C.border}`, marginTop: 8 },
  homeQuoteText: { fontSize: 14, lineHeight: 1.7, color: C.text, fontStyle: "italic", fontFamily: "'Playfair Display',serif", marginBottom: 8, textAlign: "center" },
  homeQuoteAttr: { fontSize: 11, color: C.muted, textAlign: "center" },

  newBtn: { width: "100%", background: C.surface, color: C.text, border: `2px solid ${C.text}`, borderRadius: 4, padding: 16, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 28, fontFamily: "'Inter',sans-serif", letterSpacing: "0.02em" },
  footer: { textAlign: "center", padding: "32px 0 48px", borderTop: `1px solid ${C.border}`, marginTop: 20 },
  footerText: { fontSize: 12, letterSpacing: "0.15em", fontWeight: 700, color: C.text },
  footerLink: { fontSize: 11, color: C.muted, marginTop: 4, display: "block", textDecoration: "none" },
};

export default App;

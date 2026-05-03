import { useState, useRef, useCallback } from "react";

const TABS = [
  { key: "historical", label: "Brief", icon: "📜" },
  { key: "awkward", label: "Awkward", icon: "😬" },
  { key: "mythologies", label: "Myths", icon: "🐉" },
  { key: "anxieties", label: "Anxieties", icon: "⚡" },
  { key: "monsters", label: "Monsters", icon: "👹" },
];

function App() {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState("historical");
  const [expanded, setExpanded] = useState({});
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
    } catch (err) {
      console.error(err);
      setError("Analysis failed. The landscape defended itself.");
    } finally { setLoading(false); }
  };

  const reset = () => { setImage(null); setImageData(null); setReport(null); setError(null); setExpanded({}); };

  const renderBullets = (items) => (items || []).map((item, i) => (
    <div key={i} style={S.bulletRow}>
      <span style={S.bulletDot}>●</span>
      <div>
        <p style={S.bulletHead}>{item.headline}</p>
        <p style={S.bulletDetail}>{item.detail}</p>
      </div>
    </div>
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
            {report.monsters_provocation && (
              <div style={S.provocation}>
                <p style={S.provText}>{report.monsters_provocation}</p>
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
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes scanMove{0%{top:0}100%{top:100%}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        .tabs::-webkit-scrollbar{display:none}
      `}</style>

      <header style={S.header}>
        <div style={S.headerMark}>👁</div>
        <h1 style={S.title}>Field Guide to<br/>Suspicious Landscapes</h1>
        <p style={S.subtitle}>Point. Shoot. Interrogate.</p>
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
      )}

      {image && !report && !loading && (
        <div style={S.fadeIn}>
          <div style={S.imgFrame}><img src={image} alt="Subject" style={S.img}/></div>
          <div style={S.previewAct}>
            <button onClick={reset} style={S.btnSec}>Discard</button>
            <button onClick={analyse} style={S.btnPri}>🔍 Investigate</button>
          </div>
        </div>
      )}

      {loading && (
        <div style={S.fadeIn}>
          <div style={S.imgFrame}>
            <img src={image} alt="Subject" style={S.img}/>
            <div style={S.scanOverlay}><div style={S.scanLine}/></div>
          </div>
          <div style={S.loadText}><span style={S.loadDot}>●</span> Investigating…</div>
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
                <p style={S.paintingName}>{report.painting_name}</p>
              )}
              <h2 style={S.rptTitle}>
                {report.painting_name ? `AKA "${report.aka}"` : report.aka}
              </h2>
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

          <button onClick={reset} style={S.newBtn}>👁 New Investigation</button>
        </div>
      )}

      <footer style={S.footer}>
        <p>A critical theory field guide for <em>There Be Monsters</em></p>
      </footer>
    </div>
  );
}

const C = {
  bg:"#1a1714",surface:"#242019",border:"#3a352c",
  text:"#e8e0d4",muted:"#9a9080",accent:"#c45a3c",
  accentSub:"rgba(196,90,60,0.15)",cream:"#f0e8da",
};

const S = {
  container:{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",maxWidth:520,margin:"0 auto",padding:"0 16px"},
  header:{textAlign:"center",padding:"48px 0 32px"},
  headerMark:{fontSize:40,marginBottom:12,filter:"grayscale(0.3)"},
  title:{fontFamily:"'Instrument Serif',serif",fontSize:32,fontWeight:400,lineHeight:1.15,color:C.cream,letterSpacing:"-0.01em"},
  subtitle:{marginTop:10,fontSize:14,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase"},
  dropZone:{border:`2px dashed ${C.border}`,borderRadius:16,padding:"48px 24px",textAlign:"center",cursor:"pointer",transition:"all .2s",marginBottom:24},
  dropActive:{borderColor:C.accent,background:C.accentSub},
  dropIcon:{fontSize:48,marginBottom:16,filter:"grayscale(0.5)"},
  dropText:{fontSize:16,color:C.text,marginBottom:6},
  dropSub:{fontSize:13,color:C.muted,marginBottom:20},
  camOpenBtn:{background:C.surface,color:C.text,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 20px",fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  cameraOverlay:{position:"fixed",inset:0,zIndex:100,background:"#000",display:"flex",flexDirection:"column"},
  video:{flex:1,objectFit:"cover",width:"100%"},
  camControls:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"24px 32px",background:"rgba(0,0,0,.8)"},
  camCancel:{background:"none",border:"none",color:"#fff",fontSize:16,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",width:64},
  camShutter:{background:"none",border:"none",cursor:"pointer",padding:0},
  shutterO:{width:68,height:68,borderRadius:"50%",border:"3px solid #fff",display:"flex",alignItems:"center",justifyContent:"center"},
  shutterI:{width:56,height:56,borderRadius:"50%",background:"#fff"},
  fadeIn:{animation:"fadeIn 0.4s ease",marginBottom:24},
  imgFrame:{borderRadius:12,overflow:"hidden",border:`1px solid ${C.border}`,position:"relative"},
  img:{width:"100%",display:"block",maxHeight:400,objectFit:"contain",background:"#111"},
  previewAct:{display:"flex",gap:12,marginTop:16},
  btnPri:{flex:1,background:C.accent,color:"#fff",border:"none",borderRadius:10,padding:"14px 20px",fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  btnSec:{flex:1,background:C.surface,color:C.text,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 20px",fontSize:16,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  scanOverlay:{position:"absolute",inset:0,overflow:"hidden",background:"rgba(0,0,0,.3)"},
  scanLine:{position:"absolute",left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${C.accent},transparent)`,boxShadow:`0 0 20px ${C.accent}`,animation:"scanMove 2s linear infinite"},
  loadText:{fontSize:18,fontWeight:600,marginTop:20,textAlign:"center"},
  loadDot:{color:C.accent,animation:"pulse 1.2s infinite",display:"inline-block",marginRight:6},
  loadSub:{fontSize:13,color:C.muted,textAlign:"center",marginTop:8,lineHeight:1.5},
  errorBox:{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:12,padding:24,textAlign:"center",marginBottom:24},
  rptHeader:{display:"flex",gap:16,alignItems:"flex-start",marginBottom:24},
  rptThumb:{width:80,height:80,borderRadius:10,objectFit:"cover",border:`1px solid ${C.border}`,flexShrink:0},
  paintingName:{fontSize:13,color:C.muted,marginBottom:4,fontStyle:"italic"},
  rptTitle:{fontFamily:"'Instrument Serif',serif",fontSize:20,fontWeight:400,color:C.cream,lineHeight:1.3,marginBottom:4},
  rptId:{fontSize:12,color:C.muted,lineHeight:1.4},
  tabs:{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:20,scrollbarWidth:"none"},
  tab:{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 14px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,cursor:"pointer",flexShrink:0,transition:"all .2s",fontFamily:"'DM Sans',sans-serif",color:C.muted},
  tabActive:{background:C.accentSub,borderColor:C.accent,color:C.cream},
  tabIcon:{fontSize:20},
  tabLabel:{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",whiteSpace:"nowrap"},
  tabContent:{animation:"fadeIn 0.3s ease",minHeight:200},
  bodyText:{fontSize:14,lineHeight:1.7,color:C.text,marginBottom:8},
  bulletRow:{display:"flex",gap:12,padding:"8px 0"},
  bulletDot:{color:C.accent,fontSize:8,marginTop:7,flexShrink:0},
  bulletHead:{fontSize:14,fontWeight:600,color:C.cream,marginBottom:2},
  bulletDetail:{fontSize:13,color:C.muted,lineHeight:1.5},
  moreBtn:{background:"none",border:"none",color:C.accent,fontSize:13,fontWeight:600,cursor:"pointer",padding:"8px 0",fontFamily:"'DM Sans',sans-serif"},
  expandArea:{animation:"fadeIn 0.3s ease",paddingTop:8},
  provocation:{marginTop:16,padding:"14px 16px",background:C.accentSub,borderRadius:10,borderLeft:`3px solid ${C.accent}`},
  provText:{fontSize:14,fontWeight:500,color:C.cream,lineHeight:1.6,fontStyle:"italic"},
  newBtn:{width:"100%",background:C.surface,color:C.cream,border:`1px solid ${C.border}`,borderRadius:12,padding:16,fontSize:16,fontWeight:600,cursor:"pointer",marginTop:28,fontFamily:"'DM Sans',sans-serif"},
  footer:{textAlign:"center",padding:"32px 0 48px",fontSize:12,color:C.muted},
};

export default App;

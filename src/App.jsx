import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg:        "#06080f",
  surface:   "#0b0f1a",
  card:      "#0f1420",
  border:    "#1a2235",
  borderHi:  "#243048",
  accent:    "#e8c547",
  accentDim: "#e8c54718",
  accentLow: "#e8c54733",
  cyan:      "#38bdf8",
  cyanDim:   "#38bdf815",
  green:     "#4ade80",
  text:      "#f0f4ff",
  sub:       "#8896b3",
  muted:     "#3d4f6e",
};

const SECTIONS = ["Inicio", "Sobre mí", "Skills", "Educación", "Proyectos", "Contacto"];

const SKILLS = [
  { name: "JavaScript", pct: 85, color: "#f7df1e", cat: "Frontend" },
  { name: "TypeScript", pct: 75, color: "#3178c6", cat: "Frontend" },
  { name: "React",      pct: 80, color: "#61dafb", cat: "Frontend" },
  { name: "HTML/CSS",   pct: 88, color: "#e34f26", cat: "Frontend" },
  { name: "Java",       pct: 70, color: "#f89820", cat: "Backend"  },
  { name: "Kotlin",     pct: 65, color: "#7f52ff", cat: "Backend"  },
  { name: "Node.js",    pct: 68, color: "#8cc84b", cat: "Backend"  },
  { name: "SQL",        pct: 65, color: "#38bdf8", cat: "Backend"  },
  { name: "Git",        pct: 78, color: "#f05033", cat: "Tools"    },
  { name: "REST APIs",  pct: 72, color: "#e8c547", cat: "Tools"    },
  { name: "Figma",      pct: 60, color: "#a259ff", cat: "Tools"    },
  { name: "Docker",     pct: 45, color: "#2496ed", cat: "Tools"    },
];

const EDUCATION = [
  {
    year: "2023 – Presente",
    title: "Tecnólogo en Análisis y Desarrollo de Software",
    place: "SENA · Colombia",
    desc:  "Formación técnica en desarrollo de software, bases de datos, lógica de programación, trabajo en equipo y metodologías ágiles.",
    icon:  "🎓",
  },
  {
    year: "2024",
    title: "React – The Complete Guide",
    place: "Udemy · Certificación",
    desc:  "Hooks, Context API, Redux, React Router, optimización y arquitectura de proyectos reales con TypeScript.",
    icon:  "⚛️",
  },
  {
    year: "2024",
    title: "Java Masterclass",
    place: "Udemy · Certificación",
    desc:  "POO, colecciones, streams, concurrencia, Maven y Spring Boot para desarrollo de APIs REST.",
    icon:  "☕",
  },
  {
    year: "2023",
    title: "CS50x – Introduction to Computer Science",
    place: "Harvard / edX · Certificación",
    desc:  "Algoritmos, estructuras de datos, C, Python, SQL y fundamentos de desarrollo web.",
    icon:  "🏛️",
  },
];

const PROJECTS = [
  {
    icon:   "🛒",
    title:  "E-Commerce Fullstack",
    desc:   "Tienda online completa con carrito, autenticación y panel de administración. React en el frontend, Spring Boot en el backend y MySQL.",
    tags:   ["React", "Java", "Spring Boot", "MySQL", "JWT"],
    status: "building",
    color:  "#38bdf8",
  },
  {
    icon:   "📊",
    title:  "Dashboard Analytics",
    desc:   "Panel de datos en tiempo real consumiendo APIs públicas. Gráficas interactivas, filtros dinámicos y diseño responsive.",
    tags:   ["TypeScript", "React", "Chart.js", "REST API"],
    status: "building",
    color:  "#e8c547",
  },
  {
    icon:   "🤖",
    title:  "AI Chat Assistant",
    desc:   "Asistente conversacional inteligente con historial de chats, exportación y soporte de múltiples modelos.",
    tags:   ["React", "Node.js", "OpenAI API", "TypeScript"],
    status: "planned",
    color:  "#4ade80",
  },
  {
    icon:   "📱",
    title:  "HabitTracker App",
    desc:   "App Android nativa para seguimiento de hábitos diarios con estadísticas, notificaciones y modo offline.",
    tags:   ["Kotlin", "Android", "Room DB", "MVVM"],
    status: "planned",
    color:  "#7f52ff",
  },
];

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #06080f; color: #f0f4ff; font-family: 'Outfit', sans-serif; overflow: hidden; }

  .pw {
    height: 100vh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
  }
  .pw::-webkit-scrollbar { width: 4px; }
  .pw::-webkit-scrollbar-track { background: #06080f; }
  .pw::-webkit-scrollbar-thumb { background: #3d4f6e; border-radius: 2px; }

  .sec {
    height: 100vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }

  .fu  { animation: fadeUp .65s ease both; }
  .fi  { animation: fadeIn .65s ease both; }
  .d1  { animation-delay: .08s }
  .d2  { animation-delay: .16s }
  .d3  { animation-delay: .24s }
  .d4  { animation-delay: .32s }
  .d5  { animation-delay: .40s }

  .gbg::before {
    content:''; position:absolute; inset:0;
    background-image:
      linear-gradient(#1a223544 1px, transparent 1px),
      linear-gradient(90deg, #1a223544 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 10%, transparent 100%);
    pointer-events:none; z-index:0;
  }

  .card {
    background: #0f1420;
    border: 1px solid #1a2235;
    border-radius: 16px;
    transition: border-color .3s, transform .3s, box-shadow .3s;
  }
  .card:hover {
    border-color: #243048;
    transform: translateY(-3px);
    box-shadow: 0 16px 40px #00000066;
  }

  .tag {
    display:inline-block; padding:.2rem .65rem;
    background:#0b0f1a; border:1px solid #1a2235;
    border-radius:5px; font-family:'JetBrains Mono',monospace;
    font-size:.68rem; color:#8896b3;
  }

  input, textarea {
    width:100%; padding:.75rem 1rem;
    background:#0b0f1a; border:1px solid #1a2235;
    border-radius:8px; color:#f0f4ff;
    font-family:'Outfit',sans-serif; font-size:.9rem;
    outline:none; transition:border-color .2s;
    resize: vertical;
  }
  input:focus, textarea:focus { border-color: #e8c547; }
`;

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Glow = ({ color, style }) => (
  <div style={{
    position:"absolute", borderRadius:"50%", pointerEvents:"none",
    background:`radial-gradient(circle, ${color} 0%, transparent 70%)`,
    filter:"blur(55px)", ...style,
  }}/>
);

const SLabel = ({ n, label }) => (
  <div className="mono fi" style={{ color:"#e8c547", fontSize:".72rem", marginBottom:".7rem", letterSpacing:".12em" }}>
    {n} — {label}
  </div>
);

const H2 = ({ children, style={} }) => (
  <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:"clamp(1.9rem,3.5vw,2.8rem)", color:"#f0f4ff", lineHeight:1.1, ...style }}>
    {children}
  </h2>
);

// ─── TYPING ───────────────────────────────────────────────────────────────────
function Typing({ texts }) {
  const [out, setOut]  = useState("");
  const [idx, setIdx]  = useState(0);
  const [c, setC]      = useState(0);
  const [del, setDel]  = useState(false);
  useEffect(() => {
    const cur = texts[idx];
    let t;
    if (!del && c < cur.length)      t = setTimeout(() => setC(x=>x+1), 65);
    else if (!del && c===cur.length) t = setTimeout(() => setDel(true), 2200);
    else if (del && c > 0)           t = setTimeout(() => setC(x=>x-1), 35);
    else { setDel(false); setIdx(x=>(x+1)%texts.length); }
    setOut(cur.slice(0,c));
    return () => clearTimeout(t);
  }, [c, del, idx, texts]);
  return (
    <span style={{ color:"#8896b3", fontWeight:300 }}>
      {out}
      <span style={{ display:"inline-block", width:2, height:"1.1em", background:"#e8c547", marginLeft:3, verticalAlign:"text-bottom", animation:"blink 1s step-end infinite" }}/>
    </span>
  );
}

// ─── SIDE DOT NAV ─────────────────────────────────────────────────────────────
function DotNav({ active, onGo }) {
  return (
    <nav style={{ position:"fixed", right:24, top:"50%", transform:"translateY(-50%)", zIndex:300, display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
      {SECTIONS.map((s,i) => (
        <button key={i} onClick={()=>onGo(i)} title={s} style={{
          width:  active===i ? 10 : 6, height: active===i ? 10 : 6,
          borderRadius:"50%", border:"none", cursor:"pointer", padding:0,
          background: active===i ? "#e8c547" : "#3d4f6e",
          transition:"all .25s",
          boxShadow: active===i ? "0 0 10px #e8c547" : "none",
        }}/>
      ))}
    </nav>
  );
}

// ─── TOP NAV ──────────────────────────────────────────────────────────────────
function TopNav({ active, onGo }) {
  return (
    <header style={{
      position:"fixed", top:0, left:0, right:0, zIndex:300,
      padding:"1rem 3rem", display:"flex", justifyContent:"space-between", alignItems:"center",
      background:"#06080fcc", backdropFilter:"blur(16px)",
      borderBottom:"1px solid #1a2235",
    }}>
      <span className="mono" style={{ color:"#e8c547", fontWeight:700, fontSize:"1rem", letterSpacing:".04em" }}>
        &lt;portfolio /&gt;
      </span>
      <nav style={{ display:"flex", gap:"2rem" }}>
        {SECTIONS.map((s,i) => (
          <button key={i} onClick={()=>onGo(i)} style={{
            background:"none", border:"none", cursor:"pointer",
            fontFamily:"'Outfit',sans-serif", fontSize:".83rem", fontWeight:500,
            color: active===i ? "#e8c547" : "#8896b3",
            transition:"color .2s", letterSpacing:".02em",
          }}
            onMouseEnter={e=>e.currentTarget.style.color="#f0f4ff"}
            onMouseLeave={e=>e.currentTarget.style.color=active===i?"#e8c547":"#8896b3"}
          >{s}</button>
        ))}
      </nav>
      <button onClick={()=>onGo(5)} style={{
        padding:".5rem 1.3rem", borderRadius:7, border:"none", cursor:"pointer",
        background:"#e8c547", color:"#06080f", fontFamily:"'Outfit',sans-serif",
        fontWeight:700, fontSize:".8rem", transition:"transform .2s, box-shadow .2s",
        boxShadow:"0 0 18px #e8c54733",
      }}
        onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 0 28px #e8c54766"; }}
        onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 0 18px #e8c54733"; }}
      >
        Contáctame
      </button>
    </header>
  );
}

// ─── SECTION 1: HOME ─────────────────────────────────────────────────────────
function HomeSection({ onGo }) {
  return (
    <section className="sec gbg">
      <Glow color="#e8c54722" style={{ width:500, height:500, top:"5%", left:"-8%" }}/>
      <Glow color="#38bdf812" style={{ width:400, height:400, bottom:"5%", right:"0%" }}/>
      <div style={{ position:"relative", zIndex:1, maxWidth:900, width:"100%", padding:"0 3rem" }}>

        <div className="mono fi" style={{ color:"#e8c547", fontSize:".82rem", marginBottom:"1.3rem", letterSpacing:".1em", opacity:.85 }}>
          // Bienvenido a mi portafolio 👋
        </div>

        <h1 className="fu d1" style={{
          fontFamily:"'Outfit',sans-serif", fontWeight:800,
          fontSize:"clamp(3rem,8vw,6.5rem)", lineHeight:.95,
          color:"#f0f4ff", marginBottom:".7rem",
        }}>
          Josue Arcila<span style={{ color:"#e8c547" }}>.</span>
        </h1>

        <div className="fu d2" style={{ fontSize:"clamp(1.3rem,3vw,2.1rem)", height:"2.8rem", marginBottom:"1.8rem" }}>
          <Typing texts={["Frontend Developer","React & TypeScript","Java Backend Dev","Kotlin Explorer","Problem Solver"]} />
        </div>

        <p className="fu d3" style={{ color:"#8896b3", fontSize:"1.05rem", maxWidth:500, lineHeight:1.85, marginBottom:"2.5rem" }}>
          Desarrollador Junior enfocado en construir productos digitales de alta calidad.
          Apasionado por el código limpio, el diseño y el aprendizaje continuo.
        </p>

        <div className="fu d4" style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
          <button onClick={()=>onGo(4)} style={{
            padding:".8rem 2rem", borderRadius:8, border:"none", cursor:"pointer",
            background:"#e8c547", color:"#06080f", fontFamily:"'Outfit',sans-serif",
            fontWeight:700, fontSize:".9rem", transition:"all .2s",
            boxShadow:"0 0 22px #e8c54733",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 0 32px #e8c54766"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 0 22px #e8c54733"; }}
          >Ver proyectos →</button>
          <button onClick={()=>onGo(1)} style={{
            padding:".8rem 2rem", borderRadius:8, cursor:"pointer",
            background:"transparent", color:"#e8c547", fontFamily:"'Outfit',sans-serif",
            fontWeight:600, fontSize:".9rem", border:"1.5px solid #e8c54744",
            transition:"all .2s",
          }}
            onMouseEnter={e=>e.currentTarget.style.background="#e8c54712"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          >Sobre mí</button>
        </div>

        <div className="fu d5" style={{ display:"flex", gap:"1.5rem", marginTop:"3.5rem" }}>
          {[["GitHub","https://github.com/JosueArcilaDev"],["LinkedIn","https://www.linkedin.com/in/josuearciladev"],["Email","mailto:josuearciladev@gmail.com"]].map(([l,h])=>(
            <a key={l} href={h} target="_blank" rel="noreferrer" className="mono"
              style={{ color:"#3d4f6e", fontSize:".78rem", textDecoration:"none", transition:"color .2s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#e8c547"}
              onMouseLeave={e=>e.currentTarget.style.color="#3d4f6e"}
            >[{l}]</a>
          ))}
        </div>
      </div>

      <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:6, opacity:.35 }}>
        <span style={{ fontFamily:"'Outfit'", fontSize:".65rem", color:"#8896b3", letterSpacing:".12em" }}>SCROLL</span>
        <div style={{ width:1, height:30, background:"linear-gradient(#8896b3,transparent)" }}/>
      </div>
    </section>
  );
}

// ─── SECTION 2: ABOUT ────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section className="sec gbg">
      <Glow color="#38bdf812" style={{ width:400, height:400, top:"5%", right:"0" }}/>
      <div style={{ position:"relative", zIndex:1, maxWidth:960, width:"100%", padding:"5rem 3rem 2rem" }}>
        <SLabel n="01" label="SOBRE MÍ" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"start" }}>
          <div>
            <H2>¿Quién soy?</H2>
            <p className="fu d1" style={{ color:"#8896b3", lineHeight:1.85, marginTop:"1.2rem", marginBottom:"1rem" }}>
              Soy Josue Arcila, desarrollador Junior egresado del SENA con sólida base en
              JavaScript y React para el frontend, y Java/Kotlin para el backend. Me apasiona
              construir interfaces limpias y sistemas bien estructurados que resuelvan problemas reales.
            </p>
            <p className="fu d2" style={{ color:"#8896b3", lineHeight:1.85, marginBottom:"1.8rem" }}>
              Actualmente construyo proyectos propios para demostrar mis capacidades en el mundo
              profesional. Soy proactivo, aprendo rápido, me adapto con facilidad y disfruto
              trabajar en equipo con metodologías ágiles.
            </p>
            <div className="fu d3" style={{ display:"flex", flexWrap:"wrap", gap:".6rem" }}>
              {["Trabajo en equipo","Aprendizaje continuo","Código limpio","Proactividad","Atención al detalle"].map(v=>(
                <span key={v} style={{ padding:".3rem .9rem", background:"#e8c54712", border:"1px solid #e8c54730", borderRadius:6, fontSize:".78rem", color:"#e8c547" }}>{v}</span>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div className="card fu d2" style={{ padding:"1.5rem" }}>
              <div className="mono" style={{ color:"#3d4f6e", fontSize:".72rem", marginBottom:".8rem" }}>// perfil.json</div>
              {[
                ["nombre",    '"Josue Arcila Calderon"',  "#e8c547"],
                ["rol",       '"Junior Developer"',       "#38bdf8"],
                ["ubicacion", '"Colombia 🇨🇴"',            "#8896b3"],
                ["idiomas",   '["Español", "Inglés"]',   "#4ade80"],
                ["buscando",  '"trabajo / freelance"',   "#e8c547"],
                ["disponible","true",                     "#4ade80"],
              ].map(([k,v,c])=>(
                <div key={k} className="mono" style={{ fontSize:".77rem", marginBottom:".35rem" }}>
                  <span style={{ color:"#3d4f6e" }}>"</span>
                  <span style={{ color:"#f0f4ff" }}>{k}</span>
                  <span style={{ color:"#3d4f6e" }}>": </span>
                  <span style={{ color:c }}>{v}</span>
                  <span style={{ color:"#3d4f6e" }}>,</span>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".8rem" }}>
              {[["1+","Años aprendiendo"],["10+","Cursos completados"],["4","Proyectos en camino"],["100%","Disponible"]].map(([n,l])=>(
                <div key={l} className="card fu d3" style={{ padding:"1rem", textAlign:"center" }}>
                  <div style={{ fontSize:"1.5rem", fontWeight:800, color:"#e8c547", lineHeight:1 }}>{n}</div>
                  <div style={{ fontSize:".7rem", color:"#8896b3", marginTop:".3rem" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 3: SKILLS ───────────────────────────────────────────────────────
function SkillsSection({ active }) {
  const cats = ["Frontend","Backend","Tools"];
  return (
    <section className="sec gbg">
      <Glow color="#e8c54718" style={{ width:350, height:350, bottom:"0", left:"0" }}/>
      <div style={{ position:"relative", zIndex:1, maxWidth:960, width:"100%", padding:"5rem 3rem 2rem" }}>
        <SLabel n="02" label="SKILLS" />
        <H2>Stack Tecnológico</H2>
        <p style={{ color:"#8896b3", marginTop:".8rem", marginBottom:"2.2rem", maxWidth:480 }}>
          Tecnologías que uso y sigo perfeccionando activamente.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"2.5rem" }}>
          {cats.map(cat => (
            <div key={cat}>
              <div className="mono" style={{ color:"#e8c547", fontSize:".72rem", letterSpacing:".1em", marginBottom:"1.1rem", borderBottom:"1px solid #1a2235", paddingBottom:".6rem" }}>
                // {cat}
              </div>
              {SKILLS.filter(s=>s.cat===cat).map((s,i) => (
                <div key={s.name} style={{ marginBottom:"1rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".35rem" }}>
                    <span className="mono" style={{ fontSize:".78rem", color:"#f0f4ff" }}>{s.name}</span>
                    <span className="mono" style={{ fontSize:".7rem", color:"#3d4f6e" }}>{s.pct}%</span>
                  </div>
                  <div style={{ height:5, background:"#1a2235", borderRadius:3, overflow:"hidden" }}>
                    <div style={{
                      height:"100%", borderRadius:3,
                      background:`linear-gradient(90deg,${s.color},${s.color}88)`,
                      boxShadow:`0 0 8px ${s.color}55`,
                      width: active===2 ? `${s.pct}%` : "0%",
                      transition:`width 1.1s cubic-bezier(.4,0,.2,1) ${i*.08}s`,
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 4: EDUCATION ────────────────────────────────────────────────────
function EducationSection() {
  return (
    <section className="sec gbg">
      <Glow color="#38bdf812" style={{ width:400, height:400, top:"0", right:"0" }}/>
      <div style={{ position:"relative", zIndex:1, maxWidth:960, width:"100%", padding:"5rem 3rem 2rem" }}>
        <SLabel n="03" label="EDUCACIÓN & CERTIFICACIONES" />
        <H2>Formación Académica</H2>
        <p style={{ color:"#8896b3", marginTop:".8rem", marginBottom:"2rem", maxWidth:500 }}>Mi trayectoria de aprendizaje formal y autodidacta.</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.1rem" }}>
          {EDUCATION.map((e,i) => (
            <div key={i} className="card" style={{ padding:"1.5rem", animation:`fadeUp .6s ease ${i*.1}s both` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:".9rem" }}>
                <span style={{ fontSize:"1.6rem" }}>{e.icon}</span>
                <span className="mono" style={{ fontSize:".68rem", padding:".2rem .6rem", borderRadius:4, background:"#e8c54712", color:"#e8c547" }}>{e.year}</span>
              </div>
              <h3 style={{ fontWeight:700, fontSize:"1rem", color:"#f0f4ff", marginBottom:".3rem", lineHeight:1.3 }}>{e.title}</h3>
              <div style={{ fontSize:".78rem", color:"#e8c547", fontWeight:600, marginBottom:".6rem" }}>{e.place}</div>
              <p style={{ fontSize:".82rem", color:"#8896b3", lineHeight:1.7 }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 5: PROJECTS ─────────────────────────────────────────────────────
function ProjectsSection() {
  return (
    <section className="sec gbg">
      <Glow color="#e8c54718" style={{ width:400, height:400, bottom:"0", right:"0" }}/>
      <div style={{ position:"relative", zIndex:1, maxWidth:960, width:"100%", padding:"5rem 3rem 2rem" }}>
        <SLabel n="04" label="PROYECTOS" />
        <H2>Lo que estoy construyendo</H2>
        <p style={{ color:"#8896b3", marginTop:".8rem", marginBottom:"2rem", maxWidth:500 }}>
          Proyectos reales que demuestran mis habilidades. Cada uno en progreso.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1.1rem" }}>
          {PROJECTS.map((p,i) => (
            <div key={i} className="card" style={{ padding:"1.6rem", animation:`fadeUp .6s ease ${i*.1}s both`, cursor:"default" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=p.color+"55"; e.currentTarget.style.boxShadow=`0 0 28px ${p.color}18`; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="#1a2235"; e.currentTarget.style.boxShadow=""; }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                <span style={{ fontSize:"2rem" }}>{p.icon}</span>
                <span className="mono" style={{
                  fontSize:".68rem", padding:".25rem .7rem", borderRadius:4,
                  background: p.status==="building"?"#38bdf812":"#4ade8012",
                  color:       p.status==="building"?"#38bdf8":"#4ade80",
                }}>● {p.status==="building"?"En construcción":"Planeado"}</span>
              </div>
              <h3 style={{ fontWeight:700, fontSize:"1.05rem", color:"#f0f4ff", marginBottom:".5rem" }}>{p.title}</h3>
              <p style={{ fontSize:".82rem", color:"#8896b3", lineHeight:1.7, marginBottom:"1rem" }}>{p.desc}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:".4rem" }}>
                {p.tags.map(t=><span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 6: CONTACT ──────────────────────────────────────────────────────
function ContactSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", msg:"" });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const contacts = [
    { icon:"🐙", label:"GitHub",   val:"github.com/JosueArcilaDev",          href:"https://github.com/JosueArcilaDev" },
    { icon:"💼", label:"LinkedIn", val:"linkedin.com/in/josuearciladev",      href:"https://www.linkedin.com/in/josuearciladev" },
    { icon:"📧", label:"Email",    val:"josuearciladev@gmail.com",            href:"mailto:josuearciladev@gmail.com" },
  ];
  return (
    <section className="sec gbg">
      <Glow color="#e8c54718" style={{ width:500, height:500, top:"5%", right:"-5%" }}/>
      <div style={{ position:"relative", zIndex:1, maxWidth:960, width:"100%", padding:"5rem 3rem 2rem" }}>
        <SLabel n="05" label="CONTACTO" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"start" }}>
          <div>
            <H2>Hablemos<span style={{ color:"#e8c547" }}>.</span></H2>
            <p style={{ color:"#8896b3", marginTop:"1rem", marginBottom:"2rem", lineHeight:1.85 }}>
              Estoy buscando activamente mi primera oportunidad profesional.
              Si tienes un proyecto o una vacante interesante, ¡escríbeme a josuearciladev@gmail.com!
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:".8rem" }}>
              {contacts.map(({icon,label,val,href})=>(
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:"1rem", textDecoration:"none", padding:".9rem 1.1rem", background:"#0f1420", border:"1px solid #1a2235", borderRadius:10, transition:"all .2s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor="#e8c54744"; e.currentTarget.style.transform="translateX(5px)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor="#1a2235"; e.currentTarget.style.transform=""; }}>
                  <span style={{ fontSize:"1.2rem" }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:".72rem", color:"#3d4f6e", fontWeight:500 }}>{label}</div>
                    <div style={{ fontSize:".86rem", color:"#f0f4ff" }}>{val}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding:"2rem" }}>
            {sent ? (
              <div style={{ textAlign:"center", padding:"2.5rem 0" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✅</div>
                <h3 style={{ color:"#e8c547", fontWeight:700, marginBottom:".5rem" }}>¡Mensaje enviado!</h3>
                <p style={{ color:"#8896b3" }}>Te responderé lo antes posible.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:".9rem" }}>
                <h3 style={{ fontWeight:700, color:"#f0f4ff", marginBottom:".3rem" }}>Envíame un mensaje</h3>
                <input placeholder="Tu nombre"   value={form.name}  onChange={set("name")} />
                <input placeholder="Tu email"    value={form.email} onChange={set("email")} />
                <textarea rows={4} placeholder="Tu mensaje..." value={form.msg} onChange={set("msg")} />
                <button onClick={()=>{ if(form.name&&form.email&&form.msg) setSent(true); }}
                  style={{ padding:".8rem", borderRadius:8, border:"none", cursor:"pointer", background:"#e8c547", color:"#06080f", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:".9rem", transition:"all .2s", boxShadow:"0 0 20px #e8c54722" }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 0 30px #e8c54755"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 0 20px #e8c54722"; }}
                >Enviar mensaje →</button>
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop:"2.5rem", paddingTop:"1.5rem", borderTop:"1px solid #1a2235", textAlign:"center", color:"#3d4f6e", fontSize:".73rem", fontFamily:"'JetBrains Mono',monospace" }}>
          Diseñado y construido por <span style={{ color:"#e8c547" }}>Josue Arcila</span> · {new Date().getFullYear()}
        </div>
      </div>
    </section>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);
  const refs    = useRef([]);

  const goTo = useCallback(i => {
    refs.current[i]?.scrollIntoView({ behavior:"smooth" });
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const h = () => setActive(Math.min(Math.round(wrap.scrollTop / wrap.clientHeight), SECTIONS.length-1));
    wrap.addEventListener("scroll", h, { passive:true });
    return () => wrap.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = e => {
      if (e.key==="ArrowDown"||e.key==="PageDown") goTo(Math.min(active+1, SECTIONS.length-1));
      if (e.key==="ArrowUp"  ||e.key==="PageUp")   goTo(Math.max(active-1, 0));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [active, goTo]);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <TopNav active={active} onGo={goTo} />
      <DotNav active={active} onGo={goTo} />
      <div className="pw" ref={wrapRef}>
        <div ref={el=>refs.current[0]=el}><HomeSection    onGo={goTo} /></div>
        <div ref={el=>refs.current[1]=el}><AboutSection   /></div>
        <div ref={el=>refs.current[2]=el}><SkillsSection  active={active} /></div>
        <div ref={el=>refs.current[3]=el}><EducationSection /></div>
        <div ref={el=>refs.current[4]=el}><ProjectsSection  /></div>
        <div ref={el=>refs.current[5]=el}><ContactSection   /></div>
      </div>
    </>
  );
}
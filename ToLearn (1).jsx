import { useState, useEffect } from "react";

const GOLD = "#00c9b1";
const NAVY = "#0a1628";
const BG = "#060f1e";
const CARD = "#0d1f35";
const CARD2 = "#112640";
const MUTED = "#7ab8c8";

const PROVINCES = {
  sa: ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","تبوك","أبها","نجران","جازان","حائل","القصيم","الطائف","ينبع"],
  kw: ["العاصمة","حولي","الفروانية","مبارك الكبير","الأحمدي","الجهراء"],
  ae: ["أبوظبي","دبي","الشارقة","عجمان","رأس الخيمة","الفجيرة","أم القيوين"],
  eg: ["القاهرة","الجيزة","الإسكندرية","الدقهلية","البحيرة","الشرقية","القليوبية","المنوفية","الغربية","كفر الشيخ","دمياط","المنيا","أسيوط","سوهاج","قنا","أسوان","الأقصر","الفيوم","بني سويف","الإسماعيلية","بورسعيد","السويس","مطروح","شمال سيناء","جنوب سيناء","الوادي الجديد","البحر الأحمر"]
};
const GRADES = {
  sa: ["الصف الأول الابتدائي","الصف الثاني الابتدائي","الصف الثالث الابتدائي","الصف الرابع الابتدائي","الصف الخامس الابتدائي","الصف السادس الابتدائي","الصف السابع (متوسط 1)","الصف الثامن (متوسط 2)","الصف التاسع (متوسط 3)"],
  kw: ["الصف الأول الابتدائي","الصف الثاني الابتدائي","الصف الثالث الابتدائي","الصف الرابع الابتدائي","الصف الخامس الابتدائي","الصف السادس (متوسط 1)","الصف السابع (متوسط 2)","الصف الثامن (متوسط 3)"],
  ae: ["KG1","KG2","الصف الأول","الصف الثاني","الصف الثالث","الصف الرابع","الصف الخامس","الصف السادس","الصف السابع (إعدادي 1)","الصف الثامن (إعدادي 2)","الصف التاسع (إعدادي 3)"],
  eg: ["الصف الأول الابتدائي","الصف الثاني الابتدائي","الصف الثالث الابتدائي","الصف الرابع الابتدائي","الصف الخامس الابتدائي","الصف السادس الابتدائي","الصف الأول الإعدادي","الصف الثاني الإعدادي","الصف الثالث الإعدادي"]
};
const SUBJ = {
  default_primary: ["رياضيات","علوم","لغة عربية","لغة إنجليزية","تربية إسلامية","دراسات اجتماعية"],
  default_middle:  ["رياضيات","فيزياء","كيمياء","أحياء","لغة عربية","لغة إنجليزية","تربية إسلامية","تاريخ وجغرافيا"],
  eg_primary: ["رياضيات","علوم","لغة عربية","لغة إنجليزية","تربية إسلامية","دراسات اجتماعية","تربية وطنية"],
  eg_middle:  ["رياضيات","علوم","لغة عربية","لغة إنجليزية","تاريخ","جغرافيا","تربية إسلامية"]
};
const COURSES = {
  sa: [{icon:"📐",name:"رياضيات",badge:"متاح"},{icon:"⚗️",name:"علوم",badge:"متاح"},{icon:"📝",name:"لغة عربية",badge:"متاح"},{icon:"🌍",name:"لغة إنجليزية",badge:"متاح"}],
  ae: [{icon:"📐",name:"رياضيات",badge:"متاح"},{icon:"🔬",name:"علوم",badge:"متاح"},{icon:"🎯",name:"EmSAT تحضير",badge:"مميز"},{icon:"📝",name:"لغة عربية",badge:"متاح"},{icon:"🌍",name:"لغة إنجليزية",badge:"متاح"}],
  kw: [{icon:"📐",name:"رياضيات",badge:"متاح"},{icon:"⚗️",name:"علوم",badge:"متاح"},{icon:"📝",name:"لغة عربية",badge:"متاح"},{icon:"🌍",name:"لغة إنجليزية",badge:"متاح"}],
  eg: [{icon:"📐",name:"رياضيات",badge:"متاح"},{icon:"⚗️",name:"علوم",badge:"متاح"},{icon:"📝",name:"لغة عربية",badge:"متاح"},{icon:"🌍",name:"لغة إنجليزية",badge:"متاح"}]
};
const PHONE_CODES = {sa:"+966",kw:"+965",ae:"+971",eg:"+20"};
const FLAGS = {sa:"🇸🇦",kw:"🇰🇼",ae:"🇦🇪",eg:"🇪🇬"};

function getSubjects(country, grade) {
  if (country==="sa"||country==="kw") {
    const isMiddle = grade && (grade.includes("سابع")||grade.includes("ثامن")||grade.includes("متوسط"));
    return isMiddle ? SUBJ.default_middle : SUBJ.default_primary;
  }
  if (country==="ae") {
    const isMiddle = grade && (grade.includes("إعدادي")||grade.includes("سابع")||grade.includes("ثامن")||grade.includes("تاسع"));
    return isMiddle ? SUBJ.default_middle : SUBJ.default_primary;
  }
  if (country==="eg") {
    return grade && grade.includes("إعدادي") ? SUBJ.eg_middle : SUBJ.eg_primary;
  }
  return SUBJ.default_primary;
}

const st = {
  page:{minHeight:"100vh",background:BG,color:"#e8eaf6",fontFamily:"'Cairo',sans-serif",direction:"rtl"},
  topbar:{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:"rgba(13,22,41,0.96)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(201,168,76,0.2)",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"},
  iconBtn:{background:CARD2,border:"1px solid rgba(201,168,76,0.2)",color:"#e8eaf6",width:38,height:38,borderRadius:10,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"},
  goldBtn:{background:"linear-gradient(135deg,#c9a84c,#a07830)",color:"#fff",padding:"13px 28px",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"'Cairo',sans-serif",fontSize:15,fontWeight:700,boxShadow:"0 4px 18px rgba(201,168,76,0.35)"},
  outBtn:{background:"transparent",color:GOLD,padding:"13px 28px",borderRadius:14,border:`2px solid ${GOLD}`,cursor:"pointer",fontFamily:"'Cairo',sans-serif",fontSize:15,fontWeight:700},
  card:{background:CARD,border:"1px solid rgba(201,168,76,0.2)",borderRadius:20,padding:"24px 20px"},
  inp:{width:"100%",padding:"12px 14px",background:BG,border:"1.5px solid rgba(201,168,76,0.2)",borderRadius:12,color:"#e8eaf6",fontFamily:"'Cairo',sans-serif",fontSize:15,outline:"none",boxSizing:"border-box"},
  sel:{width:"100%",padding:"12px 14px",background:BG,border:"1.5px solid rgba(201,168,76,0.2)",borderRadius:12,color:"#e8eaf6",fontFamily:"'Cairo',sans-serif",fontSize:15,outline:"none",WebkitAppearance:"none",boxSizing:"border-box"},
  lbl:{display:"block",fontSize:13,fontWeight:600,marginBottom:7,color:MUTED},
  box:{background:CARD,border:"1px solid rgba(201,168,76,0.2)",borderRadius:24,padding:"36px 30px",width:"100%",maxWidth:500,boxShadow:"0 20px 60px rgba(0,0,0,0.4)"},
  full:{width:"100%",padding:14,background:"linear-gradient(135deg,#c9a84c,#a07830)",color:"#fff",border:"none",borderRadius:14,fontFamily:"'Cairo',sans-serif",fontSize:16,fontWeight:700,cursor:"pointer",marginTop:6},
};

function Topbar({page,setPage,dark,setDark,user,logout}) {
  const [open,setOpen]=useState(false);
  const navItems = user
    ? user.role==="admin"
      ? [["admin","⚙️","لوحة التحكم"]]
      : [["home","🏠","الرئيسية"],["about","📖","عن الأكاديمية"],["pricing","💰","الأسعار"],["dashboard","📚","منصتي"]]
    : [["home","🏠","الرئيسية"],["about","📖","عن الأكاديمية"],["pricing","💰","الأسعار"],["register","✍️","سجل الآن"],["login","🔐","تسجيل الدخول"]];
  return (
    <>
      <div style={st.topbar}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:NAVY,border:`2px solid ${GOLD}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📖</div>
          <div style={{fontSize:22,fontWeight:900}}><span style={{color:"#e8eaf6"}}>To </span><span style={{color:GOLD}}>Learn</span></div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button style={st.iconBtn} onClick={()=>setDark(d=>!d)}>{dark?"☀️":"🌙"}</button>
          <button style={st.iconBtn} onClick={()=>setOpen(o=>!o)}>☰</button>
        </div>
      </div>
      {open && <>
        <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:998}}/>
        <div style={{position:"fixed",top:60,right:0,bottom:0,width:240,background:CARD,borderLeft:"1px solid rgba(201,168,76,0.2)",zIndex:999,padding:16}}>
          {navItems.map(([p,ic,lbl])=>(
            <div key={p} onClick={()=>{setPage(p);setOpen(false)}} style={{padding:"12px 14px",borderRadius:12,cursor:"pointer",marginBottom:4,background:page===p?"rgba(201,168,76,0.1)":"transparent",color:page===p?GOLD:"#e8eaf6",display:"flex",gap:10,alignItems:"center",fontWeight:600}}>{ic} {lbl}</div>
          ))}
          {user && <div onClick={()=>{logout();setOpen(false)}} style={{padding:"12px 14px",borderRadius:12,cursor:"pointer",color:"#e74c3c",display:"flex",gap:10,alignItems:"center",fontWeight:600,marginTop:8}}>🚪 خروج</div>}
        </div>
      </>}
    </>
  );
}

function FloatBtns({user}) {
  const wa = user ? `https://wa.me/201101631329?text=مرحباً، أنا ${user.name||""} - ${user.phone||""}` : "https://wa.me/201101631329";
  const btn = (href,bg,children) => <a href={href} target="_blank" rel="noreferrer" style={{width:50,height:50,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,textDecoration:"none",color:"#fff",fontWeight:900,boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>{children}</a>;
  return (
    <div style={{position:"fixed",bottom:24,left:16,display:"flex",flexDirection:"column",gap:10,zIndex:997}}>
      {btn(wa,"#25D366","💬")}
      {btn("mailto:tlearn919@gmail.com","#EA4335","✉️")}
      {btn("https://www.facebook.com/share/17tt3w8eEd/","#1877F2","f")}
    </div>
  );
}

function HomePage({setPage}) {
  return (
    <div style={{paddingTop:60}}>
      <div style={{minHeight:"90vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0d1629,#1a2744)",textAlign:"center",padding:"40px 20px"}}>
        <div style={{background:"linear-gradient(135deg,#c9a84c,#a07830)",color:"#fff",padding:"7px 20px",borderRadius:50,fontSize:13,fontWeight:700,marginBottom:20}}>🎓 أكاديمية للتعليم الأونلاين</div>
        <h1 style={{fontSize:"clamp(40px,8vw,72px)",fontWeight:900,marginBottom:12,lineHeight:1.1}}>
          <span style={{color:"#fff"}}>To </span><span style={{color:GOLD}}>Learn</span>
        </h1>
        <p style={{fontSize:"clamp(16px,3vw,20px)",color:MUTED,marginBottom:8}}>أكاديمية متخصصة في المناهج الدراسية</p>
        <div style={{fontSize:26,margin:"14px 0",letterSpacing:6}}>🇸🇦 🇰🇼 🇦🇪 🇪🇬</div>
        <p style={{color:MUTED,fontSize:14,marginBottom:28}}>المناهج السعودية · الكويتية · الإماراتية · المصرية</p>
        <div style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center"}}>
          <button style={st.goldBtn} onClick={()=>setPage("register")}>✍️ سجل الآن مجاناً</button>
          <button style={st.outBtn} onClick={()=>setPage("about")}>📖 تعرف علينا</button>
        </div>
      </div>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"50px 20px"}}>
        <h2 style={{textAlign:"center",fontSize:30,fontWeight:900,marginBottom:8}}>لماذا <span style={{color:GOLD}}>To Learn</span>؟</h2>
        <p style={{textAlign:"center",color:MUTED,marginBottom:36}}>كل ما تحتاجه في مكان واحد</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:18}}>
          {[["💻","تعليم أونلاين","حصص مباشرة من بيتك بدون تنقل"],["🏆","مدرسون متخصصون","لكل منهج وكل مادة دراسية"],["📊","متابعة مستمرة","تقارير أسبوعية لولي الأمر"],["🎯","4 مناهج","سعودي وكويتي وإماراتي ومصري"],["📝","كويزات تفاعلية","اختبارات ومراجعات لكل وحدة"],["🎁","حصة مجانية","أول حصة تشخيصية مجاناً"]].map(([ic,h,p])=>(
            <div key={h} style={{...st.card,textAlign:"center",borderTop:`3px solid ${GOLD}`}}>
              <div style={{fontSize:34,marginBottom:12}}>{ic}</div>
              <h3 style={{fontWeight:700,marginBottom:8}}>{h}</h3>
              <p style={{fontSize:14,color:MUTED,lineHeight:1.7}}>{p}</p>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:50}}>
          <button style={{...st.goldBtn,fontSize:18,padding:"16px 44px"}} onClick={()=>setPage("register")}>🚀 سجل الآن</button>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"90px 20px 50px"}}>
      <h2 style={{textAlign:"center",fontSize:30,fontWeight:900,marginBottom:8}}>عن أكاديمية <span style={{color:GOLD}}>To Learn</span></h2>
      <p style={{textAlign:"center",color:MUTED,marginBottom:30}}>رسالتنا تعليم كل طالب بالطريقة المناسبة له</p>
      <div style={{...st.card,marginBottom:28,padding:28}}>
        <p style={{fontSize:15,lineHeight:2,color:MUTED}}>أكاديمية <strong style={{color:GOLD}}>To Learn</strong> منصة تعليمية أونلاين متخصصة في تدريس المناهج السعودية والكويتية والإماراتية والمصرية. نقدم حصصاً فردية وجماعية عبر الإنترنت مع متابعة مستمرة من مدرسين متخصصين وتقارير دورية لأولياء الأمور.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:18}}>
        {[["🇸🇦","المنهج السعودي","ابتدائي · متوسط · ثانوي\nتحصيل دراسي · قدرات"],["🇰🇼","المنهج الكويتي","ابتدائي · متوسط · ثانوي\nجميع التخصصات"],["🇦🇪","المنهج الإماراتي","ابتدائي · إعدادي · ثانوي\nEmSAT تحضير"],["🇪🇬","المنهج المصري","ابتدائي (6 سنوات)\nإعدادي (3 سنوات)"]].map(([fl,h,d])=>(
          <div key={h} style={{...st.card,textAlign:"center",borderTop:`3px solid ${GOLD}`}}>
            <div style={{fontSize:36,marginBottom:10}}>{fl}</div>
            <h3 style={{fontWeight:700,marginBottom:8,color:GOLD}}>{h}</h3>
            <p style={{fontSize:14,color:MUTED,whiteSpace:"pre-line",lineHeight:1.8}}>{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingPage({setPage}) {
  const data=[
    {flag:"🇸🇦",name:"المنهج السعودي",cur:"ريال",
     hours:[["ابتدائي (1-6)","80"],["متوسط (7-9)","110"],["ثانوي (10-12)","150"],["تحصيل/قدرات","180"]],
     pkgs:[["4 حصص/شهر","380"],["8 حصص 🔥","720"],["12 حصة","1000"],["امتحانات 16 حصة","1300"]]},
    {flag:"🇰🇼",name:"المنهج الكويتي",cur:"د.ك",
     hours:[["ابتدائي","6"],["متوسط","10"],["ثانوي","12"]],
     pkgs:[["4 حصص","22"],["8 حصص 🔥","40"],["12 حصة","58"]]},
    {flag:"🇦🇪",name:"المنهج الإماراتي",cur:"درهم",
     hours:[["ابتدائي","100"],["إعدادي","140"],["ثانوي","180"],["EmSAT","220"]],
     pkgs:[["4 حصص","480"],["8 حصص 🔥","900"],["EmSAT 20 حصة","3200"]]},
    {flag:"🇪🇬",name:"المنهج المصري",cur:"جنيه",
     hours:[["ابتدائي (1-6)","50"],["إعدادي (1-3)","80"]],
     pkgs:[["4 حصص/شهر","180"],["8 حصص 🔥","340"],["12 حصة","480"],["مكثف امتحانات","600"]]},
  ];
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"90px 20px 50px"}}>
      <h2 style={{textAlign:"center",fontSize:30,fontWeight:900,marginBottom:8}}>الأسعار <span style={{color:GOLD}}>والباقات</span></h2>
      <p style={{textAlign:"center",color:MUTED,marginBottom:24}}>أسعار تنافسية مع أعلى جودة تعليمية</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:22}}>
        {data.map(c=>(
          <div key={c.name} style={{...st.card}}>
            <div style={{fontSize:32,marginBottom:10}}>{c.flag}</div>
            <h3 style={{fontSize:17,fontWeight:800,color:GOLD,marginBottom:16}}>{c.name}</h3>
            {c.hours.map(([l,p])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(201,168,76,0.1)",fontSize:14}}>
                <span style={{color:MUTED}}>{l}</span>
                <span style={{color:GOLD,fontWeight:700}}>{p} {c.cur}/ساعة</span>
              </div>
            ))}
            <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid rgba(201,168,76,0.2)"}}>
              {c.pkgs.map(([l,p])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(201,168,76,0.07)",fontSize:14}}>
                  <span style={{color:MUTED}}>{l}</span>
                  <span style={{color:GOLD,fontWeight:700}}>{p} {c.cur}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{...st.card,marginTop:28,textAlign:"center"}}>
        <p style={{color:MUTED,marginBottom:16}}>كل الباقات: متابعة أسبوعية + واجبات + مراجعة مجانية قبل الامتحان 🎁</p>
        <button style={st.goldBtn} onClick={()=>setPage("register")}>احجز حصتك التجريبية المجانية 🎯</button>
      </div>
    </div>
  );
}

function RegisterPage({setPage,onRegister,students}) {
  const [step,setStep]=useState(1);
  const [f,setF]=useState({name:"",phone:"",phoneCode:"+966",parentPhone:"",parentCode:"+966",country:"",province:"",grade:"",subjects:[],pass:"",pass2:""});
  const [err,setErr]=useState("");
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const subs = f.country ? getSubjects(f.country, f.grade||"") : SUBJ.default_primary;
  const toggleSub=sub=>setF(p=>({...p,subjects:p.subjects.includes(sub)?p.subjects.filter(x=>x!==sub):[...p.subjects,sub]}));

  const next1=()=>{
    if(!f.name) return setErr("أدخل اسم الطالب");
    if(!f.phone) return setErr("أدخل رقم هاتف الطالب");
    if(!f.parentPhone) return setErr("أدخل رقم هاتف ولي الأمر");
    if(!f.country) return setErr("اختر الدولة");
    setErr(""); setStep(2);
  };
  const next2=()=>{
    if(!f.grade) return setErr("اختر السنة الدراسية");
    if(!f.subjects.length) return setErr("اختر مادة واحدة على الأقل");
    setErr(""); setStep(3);
  };
  const doReg=()=>{
    if(f.pass.length<6) return setErr("كلمة المرور 6 أحرف على الأقل");
    if(f.pass!==f.pass2) return setErr("كلمة المرور غير متطابقة");
    const fp=f.phoneCode+f.phone;
    if(students.find(s=>s.phone===fp)) return setErr("هذا الرقم مسجل مسبقاً");
    onRegister({...f,phone:fp,parentPhone:f.parentCode+f.parentPhone,id:Date.now(),role:"student"});
    setPage("dashboard");
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0d1629,#1a2744)",padding:"80px 16px 40px"}}>
      <div style={st.box}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{fontSize:40}}>🎓</div>
          <h2 style={{fontSize:26,fontWeight:900}}>إنشاء <span style={{color:GOLD}}>حساب جديد</span></h2>
          <p style={{color:MUTED,fontSize:14}}>انضم لأكاديمية To Learn</p>
        </div>
        {/* step dots */}
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:22}}>
          {[1,2,3].map(n=><div key={n} style={{height:10,borderRadius:5,transition:"all 0.3s",background:n<step?"#2ecc71":n===step?GOLD:"rgba(201,168,76,0.2)",width:n===step?28:10}}/>)}
        </div>
        {err&&<div style={{background:"rgba(231,76,60,0.1)",border:"1px solid rgba(231,76,60,0.3)",color:"#e74c3c",padding:"10px 14px",borderRadius:10,marginBottom:14,fontSize:13}}>{err}</div>}

        {step===1&&<>
          <div style={{marginBottom:14}}><label style={st.lbl}>👤 اسم الطالب</label><input style={st.inp} placeholder="الاسم كاملاً" value={f.name} onChange={e=>set("name",e.target.value)}/></div>
          <div style={{marginBottom:14}}>
            <label style={st.lbl}>📱 رقم الطالب</label>
            <div style={{display:"flex",gap:8}}>
              <select style={{...st.sel,width:118}} value={f.phoneCode} onChange={e=>set("phoneCode",e.target.value)}>
                <option value="+966">🇸🇦 +966</option><option value="+965">🇰🇼 +965</option><option value="+971">🇦🇪 +971</option><option value="+20">🇪🇬 +20</option>
              </select>
              <input style={{...st.inp,flex:1}} placeholder="رقم الهاتف" value={f.phone} onChange={e=>set("phone",e.target.value)}/>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={st.lbl}>👨‍👩‍👧 رقم ولي الأمر</label>
            <div style={{display:"flex",gap:8}}>
              <select style={{...st.sel,width:118}} value={f.parentCode} onChange={e=>set("parentCode",e.target.value)}>
                <option value="+966">🇸🇦 +966</option><option value="+965">🇰🇼 +965</option><option value="+971">🇦🇪 +971</option><option value="+20">🇪🇬 +20</option>
              </select>
              <input style={{...st.inp,flex:1}} placeholder="رقم الهاتف" value={f.parentPhone} onChange={e=>set("parentPhone",e.target.value)}/>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={st.lbl}>🌍 الدولة</label>
            <select style={st.sel} value={f.country} onChange={e=>{
              const c=e.target.value;
              setF(p=>({...p,country:c,province:"",grade:"",subjects:[],phoneCode:PHONE_CODES[c]||"+966",parentCode:PHONE_CODES[c]||"+966"}));
            }}>
              <option value="">-- اختر الدولة --</option>
              <option value="sa">🇸🇦 المملكة العربية السعودية</option>
              <option value="kw">🇰🇼 الكويت</option>
              <option value="ae">🇦🇪 الإمارات العربية المتحدة</option>
              <option value="eg">🇪🇬 مصر</option>
            </select>
          </div>
          {f.country&&<div style={{marginBottom:14}}>
            <label style={st.lbl}>🏙️ {f.country==="eg"?"المحافظة":"المحافظة / الإمارة"}</label>
            <select style={st.sel} value={f.province} onChange={e=>set("province",e.target.value)}>
              <option value="">-- اختر --</option>
              {PROVINCES[f.country].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>}
          <button style={st.full} onClick={next1}>التالي ←</button>
        </>}

        {step===2&&<>
          <div style={{marginBottom:14}}>
            <label style={st.lbl}>📚 السنة الدراسية</label>
            <select style={st.sel} value={f.grade} onChange={e=>{set("grade",e.target.value);set("subjects",[]);}}>
              <option value="">-- اختر --</option>
              {(GRADES[f.country]||[]).map(g=><option key={g}>{g}</option>)}
            </select>
          </div>
          {f.country&&<>
            <label style={st.lbl}>📖 اختر المواد</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              {subs.map(sub=>{
                const sel=f.subjects.includes(sub);
                return <div key={sub} onClick={()=>toggleSub(sub)} style={{display:"flex",alignItems:"center",gap:8,background:sel?"rgba(201,168,76,0.1)":BG,border:`1.5px solid ${sel?GOLD:"rgba(201,168,76,0.2)"}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",fontSize:13,color:sel?GOLD:"#e8eaf6",transition:"all 0.2s"}}>
                  <div style={{width:14,height:14,borderRadius:"50%",background:sel?GOLD:"transparent",border:`2px solid ${sel?GOLD:"rgba(201,168,76,0.3)"}`,flexShrink:0}}/>
                  {sub}
                </div>;
              })}
            </div>
          </>}
          <div style={{display:"flex",gap:8}}>
            <button style={{...st.full,background:CARD2,flex:1}} onClick={()=>setStep(1)}>→ رجوع</button>
            <button style={{...st.full,flex:1,marginTop:0}} onClick={next2}>التالي ←</button>
          </div>
        </>}

        {step===3&&<>
          <div style={{marginBottom:14}}><label style={st.lbl}>🔐 كلمة المرور</label><input style={st.inp} type="password" placeholder="6 أحرف على الأقل" value={f.pass} onChange={e=>set("pass",e.target.value)}/></div>
          <div style={{marginBottom:14}}><label style={st.lbl}>🔐 تأكيد كلمة المرور</label><input style={st.inp} type="password" placeholder="أعد الإدخال" value={f.pass2} onChange={e=>set("pass2",e.target.value)}/></div>
          <div style={{display:"flex",gap:8}}>
            <button style={{...st.full,background:CARD2,flex:1}} onClick={()=>setStep(2)}>→ رجوع</button>
            <button style={{...st.full,flex:1,marginTop:0}} onClick={doReg}>✅ إنشاء الحساب</button>
          </div>
        </>}
        <p style={{textAlign:"center",marginTop:14,fontSize:14,color:MUTED}}>لديك حساب؟ <span style={{color:GOLD,cursor:"pointer",fontWeight:600}} onClick={()=>setPage("login")}>سجل دخول</span></p>
      </div>
    </div>
  );
}

function LoginPage({setPage,onLogin,students}) {
  const [code,setCode]=useState("+966");
  const [phone,setPhone]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");

  const doLogin=()=>{
    const ph=phone.trim();
    const pw=pass.trim();
    if(ph==="admin" && pw==="admin#6012"){
      onLogin({name:"المشرف",role:"admin",phone:"admin"});
      setPage("admin"); return;
    }
    const full=code+ph;
    const found=students.find(s=>s.phone===full&&s.pass===pw);
    if(!found) return setErr("رقم الهاتف أو كلمة المرور غير صحيحة");
    onLogin(found); setPage("dashboard");
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0d1629,#1a2744)",padding:"80px 16px"}}>
      <div style={st.box}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{fontSize:40}}>🔐</div>
          <h2 style={{fontSize:26,fontWeight:900}}>تسجيل <span style={{color:GOLD}}>الدخول</span></h2>
          <p style={{color:MUTED,fontSize:14}}>مرحباً بك مجدداً</p>
        </div>
        {err&&<div style={{background:"rgba(231,76,60,0.1)",border:"1px solid rgba(231,76,60,0.3)",color:"#e74c3c",padding:"10px 14px",borderRadius:10,marginBottom:14,fontSize:13}}>{err}</div>}
        <div style={{marginBottom:14}}>
          <label style={st.lbl}>📱 رقم الهاتف</label>
          <div style={{display:"flex",gap:8}}>
            <select style={{...st.sel,width:118}} value={code} onChange={e=>setCode(e.target.value)}>
              <option value="+966">🇸🇦 +966</option><option value="+965">🇰🇼 +965</option><option value="+971">🇦🇪 +971</option><option value="+20">🇪🇬 +20</option>
            </select>
            <input style={{...st.inp,flex:1}} placeholder="رقم الهاتف" value={phone} onChange={e=>setPhone(e.target.value)}/>
          </div>
        </div>
        <div style={{marginBottom:14}}><label style={st.lbl}>🔐 كلمة المرور</label><input style={st.inp} type="password" placeholder="أدخل كلمة المرور" value={pass} onChange={e=>setPass(e.target.value)}/></div>
        <button style={st.full} onClick={doLogin}>🚀 تسجيل الدخول</button>
        <p style={{textAlign:"center",marginTop:14,fontSize:14,color:MUTED}}>ليس لديك حساب؟ <span style={{color:GOLD,cursor:"pointer",fontWeight:600}} onClick={()=>setPage("register")}>سجل الآن</span></p>
      </div>
    </div>
  );
}

function Dashboard({user,lectures,quizzes,students,setStudents}) {
  const [tab,setTab]=useState(user?.country||"sa");
  const [quizOpen,setQuizOpen]=useState(null);
  const [answers,setAnswers]=useState({});
  const [result,setResult]=useState(null);
  const icons={رياضيات:"📐",فيزياء:"⚡",كيمياء:"🧪",أحياء:"🌿","لغة عربية":"📝","لغة إنجليزية":"🌍","تربية إسلامية":"☪️","دراسات اجتماعية":"🗺️","تاريخ وجغرافيا":"🗺️",علوم:"🔬","تربية وطنية":"🏛️",تاريخ:"📜",جغرافيا:"🗺️"};

  // المواد المفعلة من المشرف فقط
  const activeSubs = user?.activeSubs || [];

  const submitQuiz=(quiz)=>{
    let score=0;
    quiz.questions.forEach((q,i)=>{ if(parseInt(answers[i])===q.correct) score++; });
    setResult({score,total:quiz.questions.length,pct:Math.round((score/quiz.questions.length)*100)});
  };

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"80px 16px 50px"}}>
      {/* بطاقة الترحيب */}
      <div style={{...st.card,marginBottom:22,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800}}>مرحباً، <span style={{color:GOLD}}>{user?.name}</span> 👋</h2>
          <p style={{color:MUTED,fontSize:13,marginTop:4}}>{user?.grade} · {user?.province}</p>
          <p style={{color:MUTED,fontSize:13}}>المواد المختارة: {(user?.subjects||[]).join("، ")}</p>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:32}}>{FLAGS[user?.country]||"🎓"}</div>
          <div style={{fontSize:12,color:MUTED,marginTop:4}}>{user?.grade}</div>
        </div>
      </div>

      {/* الحصة المجانية */}
      <div style={{...st.card,marginBottom:22,border:`1.5px solid ${GOLD}`,background:"rgba(201,168,76,0.04)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{fontSize:28}}>🎁</div>
          <div>
            <h3 style={{fontSize:17,fontWeight:800,color:GOLD}}>احجز حصتك التجريبية المجانية</h3>
            <p style={{fontSize:13,color:MUTED,marginTop:3}}>حصة تشخيصية مجانية 30 دقيقة لمعرفة مستواك</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div style={{background:BG,borderRadius:12,padding:"12px 14px",border:"1px solid rgba(201,168,76,0.15)"}}>
            <div style={{fontSize:12,color:MUTED,marginBottom:3}}>👤 الاسم</div>
            <div style={{fontSize:14,fontWeight:700}}>{user?.name}</div>
          </div>
          <div style={{background:BG,borderRadius:12,padding:"12px 14px",border:"1px solid rgba(201,168,76,0.15)"}}>
            <div style={{fontSize:12,color:MUTED,marginBottom:3}}>📱 الهاتف</div>
            <div style={{fontSize:14,fontWeight:700}}>{user?.phone}</div>
          </div>
          <div style={{background:BG,borderRadius:12,padding:"12px 14px",border:"1px solid rgba(201,168,76,0.15)"}}>
            <div style={{fontSize:12,color:MUTED,marginBottom:3}}>📚 المادة</div>
            <div style={{fontSize:14,fontWeight:700}}>{(user?.subjects||[]).join(" · ")}</div>
          </div>
          <div style={{background:BG,borderRadius:12,padding:"12px 14px",border:"1px solid rgba(201,168,76,0.15)"}}>
            <div style={{fontSize:12,color:MUTED,marginBottom:3}}>⏱️ المدة</div>
            <div style={{fontSize:14,fontWeight:700}}>30 دقيقة مجاناً</div>
          </div>
        </div>
        {user?.freeLink ? (
          <a href={user.freeLink} target="_blank" rel="noreferrer"
             style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"linear-gradient(135deg,#00c9b1,#008f7a)",color:"#fff",padding:"13px 20px",borderRadius:14,textDecoration:"none",fontWeight:700,fontSize:15,boxShadow:"0 4px 18px rgba(0,201,177,0.35)",marginBottom:10}}>
            🔗 ادخل الحصة المجانية الآن
          </a>
        ):(
          <a href={`https://wa.me/201101631329?text=مرحباً، أنا ${user?.name||""} - ${user?.phone||""} - ${user?.grade||""} - المواد: ${(user?.subjects||[]).join("، ")} - أريد حجز الحصة التجريبية المجانية`}
             target="_blank" rel="noreferrer"
             style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"linear-gradient(135deg,#c9a84c,#a07830)",color:"#fff",padding:"13px 20px",borderRadius:14,textDecoration:"none",fontWeight:700,fontSize:15,boxShadow:"0 4px 18px rgba(201,168,76,0.35)"}}>
            💬 احجز الآن عبر واتساب
          </a>
        )}
      </div>

      {/* الكورسات */}
      <h3 style={{fontSize:20,fontWeight:800,marginBottom:14}}>الكورسات <span style={{color:GOLD}}>التعليمية</span></h3>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        {[["sa","🇸🇦","السعودي"],["ae","🇦🇪","الإماراتي"],["kw","🇰🇼","الكويتي"],["eg","🇪🇬","المصري"]].map(([k,fl,lbl])=>(
          <div key={k} onClick={()=>setTab(k)} style={{flex:1,minWidth:110,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 12px",borderRadius:14,border:`1.5px solid ${tab===k?GOLD:"rgba(201,168,76,0.2)"}`,background:tab===k?"rgba(201,168,76,0.08)":CARD,cursor:"pointer",fontSize:13,fontWeight:700,color:tab===k?GOLD:"#e8eaf6",transition:"all 0.2s"}}>
            <span style={{fontSize:20}}>{fl}</span>{lbl}
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14,marginBottom:28}}>
        {(COURSES[tab]||[]).map(c=>{
          const lec=lectures.find(l=>l.country===tab&&l.subject===c.name);
          const selected=(user?.subjects||[]).includes(c.name);
          const active=activeSubs.includes(c.name);
          // مش مختار = مغلق تماماً
          // مختار + مش مفعل = زر اشتراك
          // مختار + مفعل = مفتوح
          if(!selected) return (
            <div key={c.name} style={{...st.card,textAlign:"center",opacity:0.35,position:"relative",overflow:"hidden",borderTop:"2px solid #333"}}>
              <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2,borderRadius:19,flexDirection:"column",gap:4}}>
                <div style={{fontSize:26}}>🔒</div>
                <div style={{fontSize:11,color:"#999"}}>غير مشترك</div>
              </div>
              <div style={{fontSize:28,marginBottom:8}}>{c.icon}</div>
              <h4 style={{fontSize:14,fontWeight:700,marginBottom:6}}>{c.name}</h4>
            </div>
          );
          if(!active) return (
            <div key={c.name} style={{...st.card,textAlign:"center",borderTop:`2px solid ${GOLD}`,opacity:0.75}}>
              <div style={{fontSize:28,marginBottom:8}}>{c.icon}</div>
              <h4 style={{fontSize:14,fontWeight:700,marginBottom:8}}>{c.name}</h4>
              <div style={{fontSize:11,color:MUTED,marginBottom:10}}>في انتظار تفعيل الاشتراك</div>
              <a href={`https://wa.me/201101631329?text=مرحباً، أنا ${user?.name||""} - ${user?.phone||""} - أريد الاشتراك في كورس ${c.name} - ${user?.grade||""}`}
                 target="_blank" rel="noreferrer"
                 style={{display:"block",background:"linear-gradient(135deg,#c9a84c,#a07830)",color:"#fff",padding:"8px 12px",borderRadius:10,textDecoration:"none",fontWeight:700,fontSize:12}}>
                💬 اشترك الآن
              </a>
            </div>
          );
          return (
            <div key={c.name} style={{...st.card,textAlign:"center",borderTop:`2px solid ${GOLD}`}}>
              <div style={{fontSize:28,marginBottom:8}}>{c.icon}</div>
              <h4 style={{fontSize:14,fontWeight:700,marginBottom:6}}>{c.name}</h4>
              <span style={{background:"rgba(46,204,113,0.12)",color:"#2ecc71",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>مفعل ✅</span>
              {lec&&<div style={{marginTop:8}}><a href={lec.link} target="_blank" rel="noreferrer" style={{color:GOLD,fontSize:12,textDecoration:"none"}}>📎 رابط المحاضرة</a></div>}
              {quizzes.filter(qz=>qz.subject===c.name).map(qz=>(
                <button key={qz.id} onClick={()=>{setQuizOpen(qz);setAnswers({});setResult(null);}}
                  style={{display:"block",width:"100%",marginTop:6,background:"rgba(201,168,76,0.1)",border:`1px solid ${GOLD}`,color:GOLD,padding:"6px",borderRadius:8,cursor:"pointer",fontFamily:"'Cairo',sans-serif",fontSize:12,fontWeight:700}}>
                  📝 {qz.title}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Quiz Modal */}
      {quizOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{...st.card,maxWidth:500,width:"100%",maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{color:GOLD,fontWeight:800}}>📝 {quizOpen.title}</h3>
              <button onClick={()=>{setQuizOpen(null);setResult(null);}} style={{background:"none",border:"none",color:MUTED,fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
            {result ? (
              <div style={{textAlign:"center",padding:20}}>
                <div style={{fontSize:60,marginBottom:12}}>{result.pct>=60?"🎉":"💪"}</div>
                <div style={{fontSize:32,fontWeight:900,color:result.pct>=60?"#2ecc71":"#e74c3c"}}>{result.pct}%</div>
                <div style={{fontSize:16,color:MUTED,margin:"8px 0"}}>أجبت {result.score} من {result.total} صح</div>
                <button onClick={()=>{setAnswers({});setResult(null);}} style={{...st.full,marginTop:16,width:"auto",padding:"10px 24px"}}>إعادة المحاولة</button>
              </div>
            ):(
              <>
                {quizOpen.questions.map((q,i)=>(
                  <div key={i} style={{marginBottom:16,padding:14,background:BG,borderRadius:12,border:"1px solid rgba(201,168,76,0.15)"}}>
                    <div style={{fontWeight:700,marginBottom:10,fontSize:14}}>{i+1}. {q.q}</div>
                    {q.opts.map((o,j)=>(
                      <div key={j} onClick={()=>setAnswers(a=>({...a,[i]:j}))}
                        style={{padding:"9px 12px",borderRadius:9,marginBottom:6,cursor:"pointer",fontSize:13,border:`1.5px solid ${answers[i]===j?GOLD:"rgba(201,168,76,0.15)"}`,background:answers[i]===j?"rgba(201,168,76,0.1)":BG,color:answers[i]===j?GOLD:"#e8eaf6",transition:"all 0.2s"}}>
                        {o}
                      </div>
                    ))}
                  </div>
                ))}
                <button onClick={()=>submitQuiz(quizOpen)} style={st.full}>✅ تسليم الإجابات</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminPanel({students,setStudents,lectures,setLectures,quizzes,setQuizzes}) {
  const [lf,setLf]=useState({title:"",subject:"رياضيات",country:"sa",grade:"الصف الأول الابتدائي",link:""});
  const [qf,setQf]=useState({title:"",subject:"رياضيات",targetPhone:""});
  const [qs,setQs]=useState([]);
  const [lok,setLok]=useState("");
  const [qok,setQok]=useState("");
  const [selSt,setSelSt]=useState(null); // الطالب المختار لإدارة اشتراكه

  const saveAll=(updated)=>{setStudents(updated);localStorage.setItem("tl_students",JSON.stringify(updated));};

  // تفعيل/إلغاء مادة لطالب
  const toggleSub=(sid,sub)=>{
    const updated=students.map(s=>{
      if(s.id!==sid) return s;
      const cur=s.activeSubs||[];
      const next=cur.includes(sub)?cur.filter(x=>x!==sub):[...cur,sub];
      return {...s,activeSubs:next};
    });
    saveAll(updated);
    setSelSt(updated.find(s=>s.id===sid)||null);
    const cur=JSON.parse(localStorage.getItem("tl_user")||"null");
    if(cur&&cur.id===sid){const nw=updated.find(s=>s.id===sid);localStorage.setItem("tl_user",JSON.stringify(nw));}
  };

  const saveLec=()=>{
    if(!lf.title||!lf.link) return alert("أدخل العنوان والرابط");
    const u=[...lectures,{...lf,id:Date.now()}];
    setLectures(u); localStorage.setItem("tl_lectures",JSON.stringify(u));
    setLf({title:"",subject:"رياضيات",country:"sa",grade:"الصف الأول الابتدائي",link:""});
    setLok("✅ تم!"); setTimeout(()=>setLok(""),3000);
  };
  const addQ=()=>setQs(p=>[...p,{q:"",opts:["","","",""],correct:0}]);
  const updQ=(i,k,v)=>setQs(p=>p.map((x,j)=>j===i?{...x,[k]:v}:x));
  const updOpt=(i,j,v)=>setQs(p=>p.map((x,xi)=>xi===i?{...x,opts:x.opts.map((o,oi)=>oi===j?v:o)}:x));
  const saveQuiz=()=>{
    if(!qf.title||!qs.length) return alert("أدخل العنوان وأضف أسئلة");
    const u=[...quizzes,{...qf,questions:qs,id:Date.now()}];
    setQuizzes(u); localStorage.setItem("tl_quizzes",JSON.stringify(u));
    setQs([]); setQf({title:"",subject:"رياضيات",targetPhone:""});
    setQok("✅ تم!"); setTimeout(()=>setQok(""),3000);
  };
  const inp={...st.inp,marginBottom:0};
  const sel={...st.sel,marginBottom:0};

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"80px 16px 50px"}}>
      <h2 style={{fontSize:26,fontWeight:900,marginBottom:20}}>⚙️ لوحة التحكم - <span style={{color:GOLD}}>To Learn</span></h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16,marginBottom:28}}>
        {[[students.length,"👨‍🎓","طالب"],[lectures.length,"📎","محاضرة"],[4,"🌍","مناهج"],[quizzes.length,"📝","كويز"]].map(([n,ic,l])=>(
          <div key={l} style={{...st.card,textAlign:"center"}}>
            <div style={{fontSize:36,fontWeight:900,color:GOLD}}>{n}</div>
            <div style={{fontSize:13,color:MUTED,marginTop:4}}>{ic} {l}</div>
          </div>
        ))}
      </div>

      {/* ── إدارة اشتراكات الطلاب ── */}
      <div style={{...st.card,marginBottom:22}}>
        <h4 style={{fontSize:17,fontWeight:700,marginBottom:14,paddingBottom:10,borderBottom:"1px solid rgba(201,168,76,0.15)"}}>👨‍🎓 إدارة الطلاب والاشتراكات</h4>
        {!students.length
          ? <p style={{color:MUTED,textAlign:"center",padding:20}}>لا يوجد طلاب بعد</p>
          : <>
            <div style={{overflowX:"auto",marginBottom:selSt?0:0}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr>{["الاسم","الهاتف","الدولة","المرحلة","المواد المختارة","إدارة"].map(h=>(
                  <th key={h} style={{background:CARD2,padding:"10px 12px",textAlign:"right",color:MUTED,borderBottom:"1px solid rgba(201,168,76,0.15)",whiteSpace:"nowrap"}}>{h}</th>
                ))}</tr></thead>
                <tbody>{students.map(s=>(
                  <tr key={s.id} style={{background:selSt?.id===s.id?"rgba(201,168,76,0.05)":"transparent"}}>
                    <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(201,168,76,0.07)"}}><strong>{s.name}</strong></td>
                    <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(201,168,76,0.07)",color:MUTED}}>{s.phone}</td>
                    <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(201,168,76,0.07)"}}>{FLAGS[s.country]} {s.province}</td>
                    <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(201,168,76,0.07)",fontSize:12}}>{s.grade}</td>
                    <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(201,168,76,0.07)",fontSize:11,color:MUTED}}>{(s.subjects||[]).join("، ")}</td>
                    <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(201,168,76,0.07)"}}>
                      <button onClick={()=>setSelSt(selSt?.id===s.id?null:s)}
                        style={{background:"rgba(201,168,76,0.15)",border:`1px solid ${GOLD}`,color:GOLD,padding:"5px 12px",borderRadius:8,cursor:"pointer",fontFamily:"'Cairo',sans-serif",fontSize:12,fontWeight:700}}>
                        {selSt?.id===s.id?"إغلاق":"⚙️ إدارة"}
                      </button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            {/* بانل إدارة الطالب المختار */}
            {selSt&&(
              <div style={{marginTop:16,background:BG,borderRadius:14,padding:16,border:`1px solid ${GOLD}`}}>
                <div style={{fontWeight:700,marginBottom:12,color:GOLD}}>⚙️ إدارة اشتراك: {selSt.name}</div>
                <div style={{fontSize:12,color:MUTED,marginBottom:10}}>انقر على المادة لتفعيلها أو إلغاء تفعيلها</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {(selSt.subjects||[]).map(sub=>{
                    const active=(selSt.activeSubs||[]).includes(sub);
                    return (
                      <div key={sub} onClick={()=>toggleSub(selSt.id,sub)}
                        style={{padding:"8px 14px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700,border:`1.5px solid ${active?"#2ecc71":GOLD}`,background:active?"rgba(46,204,113,0.12)":"rgba(201,168,76,0.08)",color:active?"#2ecc71":GOLD,transition:"all 0.2s"}}>
                        {active?"✅":"🔒"} {sub}
                      </div>
                    );
                  })}
                </div>
                {!(selSt.subjects||[]).length&&<p style={{color:MUTED,fontSize:13}}>هذا الطالب لم يختر مواد بعد</p>}
              </div>
            )}
          </>
        }
      </div>

      {/* ADD LECTURE */}
      <div style={{...st.card,marginBottom:22}}>
        <h4 style={{fontSize:17,fontWeight:700,marginBottom:14,paddingBottom:10,borderBottom:"1px solid rgba(201,168,76,0.15)"}}>📎 إضافة رابط محاضرة</h4>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div><label style={st.lbl}>العنوان</label><input style={inp} placeholder="مثال: الجبر - درس 1" value={lf.title} onChange={e=>setLf(p=>({...p,title:e.target.value}))}/></div>
          <div><label style={st.lbl}>المادة</label>
            <select style={sel} value={lf.subject} onChange={e=>setLf(p=>({...p,subject:e.target.value}))}>
              {["رياضيات","فيزياء","كيمياء","أحياء","علوم","لغة عربية","لغة إنجليزية","تاريخ","جغرافيا"].map(x=><option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div><label style={st.lbl}>المنهج</label>
            <select style={sel} value={lf.country} onChange={e=>setLf(p=>({...p,country:e.target.value,grade:(GRADES[e.target.value]||[])[0]||""}))}>
              <option value="sa">🇸🇦 سعودي</option><option value="kw">🇰🇼 كويتي</option><option value="ae">🇦🇪 إماراتي</option><option value="eg">🇪🇬 مصري</option>
            </select>
          </div>
          <div><label style={st.lbl}>السنة الدراسية</label>
            <select style={sel} value={lf.grade} onChange={e=>setLf(p=>({...p,grade:e.target.value}))}>
              {(GRADES[lf.country]||[]).map(g=><option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginBottom:14}}><label style={st.lbl}>🔗 رابط Meet / Zoom / Telegram</label><input style={inp} placeholder="https://..." value={lf.link} onChange={e=>setLf(p=>({...p,link:e.target.value}))}/></div>
        <button style={st.goldBtn} onClick={saveLec}>➕ إضافة</button>
        {lok&&<span style={{color:"#2ecc71",marginRight:10,fontSize:14}}>{lok}</span>}
        {lectures.length>0&&<div style={{marginTop:14}}>{lectures.map(l=>(
          <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid rgba(201,168,76,0.1)",fontSize:14}}>
            <div><strong>{l.title}</strong><div style={{fontSize:12,color:MUTED}}>{FLAGS[l.country]} {l.subject} · {l.grade}</div></div>
            <a href={l.link} target="_blank" rel="noreferrer" style={{color:GOLD,fontSize:13,textDecoration:"none"}}>🔗 فتح</a>
          </div>
        ))}</div>}
      </div>

      {/* ADD QUIZ */}
      <div style={{...st.card,marginBottom:22}}>
        <h4 style={{fontSize:17,fontWeight:700,marginBottom:14,paddingBottom:10,borderBottom:"1px solid rgba(201,168,76,0.15)"}}>📝 إضافة كويز</h4>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div><label style={st.lbl}>عنوان الكويز</label><input style={inp} placeholder="كويز الوحدة الأولى" value={qf.title} onChange={e=>setQf(p=>({...p,title:e.target.value}))}/></div>
          <div><label style={st.lbl}>المادة</label>
            <select style={sel} value={qf.subject} onChange={e=>setQf(p=>({...p,subject:e.target.value}))}>
              {["رياضيات","فيزياء","كيمياء","أحياء","علوم","لغة عربية","لغة إنجليزية"].map(x=><option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
        {qs.map((q,i)=>(
          <div key={i} style={{background:BG,border:"1px solid rgba(201,168,76,0.15)",borderRadius:12,padding:14,marginBottom:10}}>
            <div style={{color:GOLD,fontWeight:700,marginBottom:8}}>السؤال {i+1}</div>
            <input style={{...inp,marginBottom:8}} placeholder="نص السؤال" value={q.q} onChange={e=>updQ(i,"q",e.target.value)}/>
            {q.opts.map((o,j)=>(
              <div key={j} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                <input type="radio" name={`c_${i}`} checked={q.correct===j} onChange={()=>updQ(i,"correct",j)}/>
                <input style={{...inp,flex:1}} placeholder={`الخيار ${j+1}`} value={o} onChange={e=>updOpt(i,j,e.target.value)}/>
              </div>
            ))}
          </div>
        ))}
        <div style={{marginBottom:12}}><button style={{...st.outBtn,fontSize:14,padding:"8px 18px"}} onClick={addQ}>➕ إضافة سؤال</button></div>
        <button style={st.goldBtn} onClick={saveQuiz}>💾 حفظ الكويز</button>
        {qok&&<span style={{color:"#2ecc71",marginRight:10,fontSize:14}}>{qok}</span>}
      </div>
    </div>
  );
}

export default function App() {
  const [page,setPage]=useState("home");
  const [dark,setDark]=useState(true);
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem("tl_user")||"null"));
  const [students,setStudents]=useState(()=>JSON.parse(localStorage.getItem("tl_students")||"[]"));
  const [lectures,setLectures]=useState(()=>JSON.parse(localStorage.getItem("tl_lectures")||"[]"));
  const [quizzes,setQuizzes]=useState(()=>JSON.parse(localStorage.getItem("tl_quizzes")||"[]"));

  const onRegister=data=>{
    const u=[...students,data];
    setStudents(u); localStorage.setItem("tl_students",JSON.stringify(u));
    setUser(data); localStorage.setItem("tl_user",JSON.stringify(data));
    // رسالة واتساب تلقائية للمشرف
    const msg=encodeURIComponent(
      "🎓 طالب جديد سجل في To Learn\n\n"+
      "👤 الاسم: "+data.name+"\n"+
      "📱 هاتف الطالب: "+data.phone+"\n"+
      "👨‍👩‍👧 هاتف ولي الأمر: "+data.parentPhone+"\n"+
      "🌍 الدولة: "+({"sa":"🇸🇦 السعودية","kw":"🇰🇼 الكويت","ae":"🇦🇪 الإمارات","eg":"🇪🇬 مصر"}[data.country]||data.country)+"\n"+
      "🏙️ المحافظة: "+(data.province||"")+"\n"+
      "📚 المرحلة: "+(data.grade||"")+"\n"+
      "📖 المواد: "+(data.subjects||[]).join("، ")
    );
    window.open("https://wa.me/201101631329?text="+msg,"_blank");
  };
  const onLogin=u=>{ setUser(u); localStorage.setItem("tl_user",JSON.stringify(u)); };
  const logout=()=>{ setUser(null); localStorage.removeItem("tl_user"); setPage("home"); };

  useEffect(()=>{ if(user) setPage(user.role==="admin"?"admin":"dashboard"); },[]);

  const lightBg = dark ? {} : {background:"#f0f4ff",color:"#1a2744"};
  return (
    <div style={{...st.page,...lightBg}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet"/>
      <Topbar page={page} setPage={setPage} dark={dark} setDark={setDark} user={user} logout={logout}/>
      {page==="home"      && <HomePage setPage={setPage}/>}
      {page==="about"     && <AboutPage/>}
      {page==="pricing"   && <PricingPage setPage={setPage}/>}
      {page==="register"  && <RegisterPage setPage={setPage} onRegister={onRegister} students={students}/>}
      {page==="login"     && <LoginPage setPage={setPage} onLogin={onLogin} students={students}/>}
      {page==="dashboard" && user && <Dashboard user={user} lectures={lectures} quizzes={quizzes} students={students} setStudents={setStudents}/>}
      {page==="admin"     && user?.role==="admin" && <AdminPanel students={students} setStudents={setStudents} lectures={lectures} setLectures={setLectures} quizzes={quizzes} setQuizzes={setQuizzes}/>}
      <FloatBtns user={user}/>
      <div style={{textAlign:"center",padding:"20px 0 10px",fontSize:13,color:MUTED,borderTop:"1px solid rgba(201,168,76,0.1)",marginTop:20}}>
        © To Learn جميع الحقوق محفوظة
      </div>
    </div>
  );
}

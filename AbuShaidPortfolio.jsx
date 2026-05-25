import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import portraitImage from "./portraitImage";

/* ─── Google Font ─── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { background: #0C0C0C; font-family: 'Kanit', sans-serif; }
    .hero-heading {
      background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0C0C0C; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  `}</style>
);

/* ─── Safe Image with fallback ─── */
const SafeImg = ({ src, alt = "", style = {}, fallbackBg = "#1a1a2e" }) => {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div style={{ ...style, background: `${fallbackBg}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "rgba(215,226,234,0.3)", fontSize: "0.75rem", fontFamily: "'Kanit',sans-serif", textAlign: "center", padding: "8px" }}>Image</span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={() => setFailed(true)}
      style={style}
    />
  );
};

/* ─── FadeIn ─── */
const FadeIn = ({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = "", style = {} }) => (
  <motion.div
    initial={{ opacity: 0, x, y }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, margin: "50px", amount: 0 }}
    transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

/* ─── Magnet ─── */
const Magnet = ({ children, padding = 150, strength = 3 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const handleMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < rect.width / 2 + padding) {
        x.set(dx / strength);
        y.set(dy / strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [padding, strength, x, y]);

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  );
};

/* ─── ContactButton ─── */
const ContactButton = () => (
  <button
    onClick={() => (window.location.href = "mailto:sshaid996@gmail.com")}
    style={{
      background: "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
      boxShadow: "0px 4px 4px rgba(181,1,167,0.25), inset 4px 4px 12px #7721B1",
      outline: "2px solid white",
      outlineOffset: "-3px",
      borderRadius: "9999px",
      border: "none",
      cursor: "pointer",
      color: "white",
      fontFamily: "'Kanit', sans-serif",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.15em",
      fontSize: "clamp(0.7rem, 1.2vw, 1rem)",
      padding: "clamp(10px,1.2vw,16px) clamp(28px,3vw,48px)",
      whiteSpace: "nowrap",
    }}
  >
    Contact Me
  </button>
);

/* ─── LiveProjectButton ─── */
const LiveProjectButton = () => (
  <button
    style={{
      borderRadius: "9999px",
      border: "2px solid #D7E2EA",
      color: "#D7E2EA",
      fontFamily: "'Kanit', sans-serif",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.15em",
      fontSize: "clamp(0.7rem, 1.2vw, 1rem)",
      padding: "clamp(8px,1vw,14px) clamp(20px,2.5vw,40px)",
      background: "transparent",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background 200ms",
      flexShrink: 0,
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(215,226,234,0.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    Live Project
  </button>
);

/* ─── AnimatedText char by char ─── */
const AnimatedChar = ({ char, progress, start, end }) => {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return <motion.span style={{ opacity, display: "inline" }}>{char}</motion.span>;
};

const AnimatedText = ({ text }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const chars = text.split("");
  return (
    <p ref={ref} style={{
      color: "#D7E2EA", fontWeight: 500, textAlign: "center",
      lineHeight: 1.7, maxWidth: "620px",
      fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)", position: "relative",
      fontFamily: "'Kanit', sans-serif",
    }}>
      {chars.map((char, i) => (
        <AnimatedChar key={i} char={char} progress={scrollYProgress}
          start={i / chars.length} end={(i + 1) / chars.length} />
      ))}
    </p>
  );
};

/* ─── WhatsApp Button ─── */
const WhatsAppButton = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <a href="https://wa.me/8801577552888" target="_blank" rel="noreferrer"
      style={{
        position: "fixed", bottom: "24px", right: "24px", zIndex: 50,
        width: "56px", height: "56px", borderRadius: "50%",
        background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
        transition: "transform 200ms", transform: hovered ? "scale(1.1)" : "scale(1)",
        textDecoration: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Chat on WhatsApp"
    >
      <MessageCircle color="white" size={24} />
      {hovered && (
        <span style={{
          position: "absolute", right: "64px",
          background: "rgba(0,0,0,0.85)", color: "white",
          padding: "6px 12px", borderRadius: "8px",
          fontSize: "0.8rem", whiteSpace: "nowrap",
          fontFamily: "'Kanit', sans-serif",
        }}>Chat on WhatsApp</span>
      )}
    </a>
  );
};

/* ════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════ */
const HeroSection = () => (
  <section style={{
    height: "100vh", display: "flex", flexDirection: "column",
    position: "relative", overflow: "hidden", background: "#0C0C0C",
  }}>
    {/* Navbar */}
    <FadeIn delay={0} y={-20}>
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "clamp(20px,3vw,32px) clamp(24px,4vw,40px) 0",
      }}>
        <div style={{ display: "flex", gap: "clamp(16px,2.5vw,48px)" }}>
          {["About", "Price", "Projects", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color: "#D7E2EA", fontWeight: 500, textTransform: "uppercase",
              letterSpacing: "0.1em", fontSize: "clamp(0.75rem, 1.4vw, 1.4rem)",
              textDecoration: "none", transition: "opacity 200ms",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >{item}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="https://www.facebook.com/share/18qwioHVGe/" target="_blank" rel="noreferrer"
            style={{ color: "#D7E2EA", display: "flex", transition: "opacity 200ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            <Facebook size={20} />
          </a>
          <a href="https://www.instagram.com/blxck_oracle_?igsh=bTkzZHh4MmwzNzBn" target="_blank" rel="noreferrer"
            style={{ color: "#D7E2EA", display: "flex", transition: "opacity 200ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            <Instagram size={20} />
          </a>
        </div>
      </nav>
    </FadeIn>

    {/* Hero Heading */}
    <div style={{ overflow: "hidden", width: "100%" }}>
      <FadeIn delay={0.15} y={40}>
        <h1 className="hero-heading" style={{
          fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em",
          lineHeight: 1, whiteSpace: "nowrap", width: "100%",
          fontSize: "clamp(8vw, 13vw, 13vw)",
          paddingLeft: "clamp(24px,4vw,40px)",
          marginTop: "clamp(-20px,2vw,0px)",
          fontFamily: "'Kanit', sans-serif",
        }}>
          Hi, i'm Abu Shaid
        </h1>
      </FadeIn>
    </div>

    {/* Portrait - centered absolutely */}
    <div style={{
      position: "absolute", left: "50%", transform: "translateX(-50%)",
      bottom: 0, zIndex: 10,
      width: "clamp(240px, 36vw, 520px)",
    }}>
      <Magnet padding={150} strength={3}>
        <FadeIn delay={0.6} y={30}>
          <img
            src={portraitImage}
            alt="Abu Shaid"
            referrerPolicy="no-referrer"
            style={{ width: "100%", display: "block", objectFit: "cover" }}
            onError={(e) => {
              // Try fallback URL formats
              e.target.src = "https://i.postimg.cc/PL5L01zJ/20260523-222117.avif";
            }}
          />
        </FadeIn>
      </Magnet>
    </div>

    {/* Bottom bar */}
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      padding: "0 clamp(24px,4vw,40px) clamp(28px,3vw,40px)",
      marginTop: "auto", position: "relative", zIndex: 20,
    }}>
      <FadeIn delay={0.35} y={20}>
        <p style={{
          color: "#D7E2EA", fontWeight: 300, textTransform: "uppercase",
          letterSpacing: "0.08em", lineHeight: 1.4,
          fontSize: "clamp(0.7rem, 1.4vw, 1.5rem)",
          maxWidth: "clamp(150px, 18vw, 260px)",
          fontFamily: "'Kanit', sans-serif",
        }}>
          a dreamer driven by ambition, discipline, and midnight thoughts
        </p>
      </FadeIn>
      <FadeIn delay={0.5} y={20}>
        <ContactButton />
      </FadeIn>
    </div>
  </section>
);

/* ════════════════════════════════════════
   MARQUEE SECTION
════════════════════════════════════════ */
const GIFS = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const MarqueeSection = () => {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(200);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const val = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(val);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const row1 = [...GIFS.slice(0, 11), ...GIFS.slice(0, 11), ...GIFS.slice(0, 11)];
  const row2 = [...GIFS.slice(11), ...GIFS.slice(11), ...GIFS.slice(11)];

  return (
    <section ref={sectionRef} style={{
      background: "#0C0C0C",
      padding: "clamp(80px,10vw,160px) 0 40px",
      overflow: "hidden",
    }}>
      {[{ imgs: row1, dir: 1 }, { imgs: row2, dir: -1 }].map(({ imgs, dir }, ri) => (
        <div key={ri} style={{ overflow: "hidden", marginBottom: ri === 0 ? "12px" : 0 }}>
          <div style={{
            display: "flex", gap: "12px",
            transform: `translateX(${dir * (offset - 200)}px)`,
            willChange: "transform", width: "max-content",
          }}>
            {imgs.map((src, i) => (
              <SafeImg key={i} src={src} style={{
                width: "420px", height: "270px",
                borderRadius: "16px", objectFit: "cover", flexShrink: 0,
              }} fallbackBg="#111" />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

/* ════════════════════════════════════════
   ABOUT SECTION
════════════════════════════════════════ */
const aboutText = "🌙 A boy with silent dreams and a loud mind. I carry the pressure of building a future while still trying to enjoy life — every single day. I'm just a student now, but deep inside I see a bigger version of myself — successful, disciplined, peaceful, respected, and free. Every late night, every sacrifice is for the life I dream about when nobody is watching. 📚 Currently chasing goals that look impossible to some, but I believe one day everything will make sense. I want a life where my parents smile without worrying, where peace replaces pressure, and where hard work finally turns into success. ✨ I think deeply, dream endlessly, and stay quiet about most things. Some victories are built in silence. 🖤 I'm not perfect — I overthink, I stress, I get tired. But even then, I keep going. That's what makes me different. 🔥 This is only the beginning. A future engineer. A dream chaser. A quiet fighter. A soul full of ambition and midnight thoughts.";

const AboutSection = () => (
  <section id="about" style={{
    minHeight: "100vh", background: "#0C0C0C", position: "relative",
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "80px clamp(20px,4vw,40px)",
    overflow: "hidden",
  }}>
    {/* Decorative corner images */}
    <FadeIn delay={0.1} x={-80} y={0} duration={0.9} style={{ position: "absolute", top: "4%", left: "clamp(4px,2vw,40px)", zIndex: 0 }}>
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
        alt="" referrerPolicy="no-referrer" style={{ width: "clamp(120px,15vw,210px)", display: "block", pointerEvents: "none" }} />
    </FadeIn>
    <FadeIn delay={0.25} x={-80} y={0} duration={0.9} style={{ position: "absolute", bottom: "8%", left: "clamp(12px,6vw,80px)", zIndex: 0 }}>
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
        alt="" referrerPolicy="no-referrer" style={{ width: "clamp(100px,13vw,180px)", display: "block", pointerEvents: "none" }} />
    </FadeIn>
    <FadeIn delay={0.15} x={80} y={0} duration={0.9} style={{ position: "absolute", top: "4%", right: "clamp(4px,2vw,40px)", zIndex: 0 }}>
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
        alt="" referrerPolicy="no-referrer" style={{ width: "clamp(120px,15vw,210px)", display: "block", pointerEvents: "none" }} />
    </FadeIn>
    <FadeIn delay={0.3} x={80} y={0} duration={0.9} style={{ position: "absolute", bottom: "8%", right: "clamp(12px,6vw,80px)", zIndex: 0 }}>
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
        alt="" referrerPolicy="no-referrer" style={{ width: "clamp(130px,16vw,220px)", display: "block", pointerEvents: "none" }} />
    </FadeIn>

    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "clamp(40px,5vw,64px)", position: "relative", zIndex: 1,
      maxWidth: "700px", width: "100%",
    }}>
      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading" style={{
          fontWeight: 900, textTransform: "uppercase", lineHeight: 1,
          letterSpacing: "-0.02em", textAlign: "center",
          fontSize: "clamp(3rem, 12vw, 160px)",
          fontFamily: "'Kanit', sans-serif",
        }}>About me</h2>
      </FadeIn>
      <AnimatedText text={aboutText} />
      <ContactButton />
    </div>
  </section>
);

/* ════════════════════════════════════════
   SERVICES SECTION
════════════════════════════════════════ */
const services = [
  { num: "01", name: "3D Modeling", desc: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations." },
  { num: "02", name: "Rendering", desc: "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life." },
  { num: "03", name: "Motion Design", desc: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences." },
  { num: "04", name: "Branding", desc: "Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence." },
  { num: "05", name: "Web Design", desc: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience." },
];

const ServicesSection = () => (
  <section id="price" style={{
    background: "#FFFFFF",
    borderRadius: "60px 60px 0 0",
    padding: "clamp(60px,8vw,128px) clamp(20px,4vw,40px)",
  }}>
    <FadeIn delay={0} y={40}>
      <h2 style={{
        color: "#0C0C0C", fontWeight: 900, textTransform: "uppercase",
        textAlign: "center", fontSize: "clamp(3rem, 12vw, 160px)",
        letterSpacing: "-0.02em", lineHeight: 1,
        marginBottom: "clamp(64px,8vw,112px)",
        fontFamily: "'Kanit', sans-serif",
      }}>Services</h2>
    </FadeIn>
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {services.map((s, i) => (
        <FadeIn key={s.num} delay={i * 0.1} y={30}>
          <div style={{
            display: "flex", alignItems: "flex-start",
            gap: "clamp(16px,3vw,40px)",
            padding: "clamp(32px,4vw,48px) 0",
            borderTop: "1px solid rgba(12,12,12,0.15)",
            borderBottom: i === services.length - 1 ? "1px solid rgba(12,12,12,0.15)" : "none",
          }}>
            <span style={{
              fontWeight: 900, fontSize: "clamp(2.5rem, 10vw, 140px)",
              color: "#0C0C0C", lineHeight: 1,
              minWidth: "clamp(50px,10vw,140px)",
              fontFamily: "'Kanit', sans-serif",
            }}>{s.num}</span>
            <div style={{ flex: 1, paddingTop: "clamp(4px,1vw,12px)" }}>
              <p style={{
                fontWeight: 500, textTransform: "uppercase",
                fontSize: "clamp(1rem, 2.2vw, 2.1rem)",
                color: "#0C0C0C", marginBottom: "8px",
                fontFamily: "'Kanit', sans-serif",
              }}>{s.name}</p>
              <p style={{
                fontWeight: 300, lineHeight: 1.6, maxWidth: "672px",
                fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)",
                opacity: 0.6, color: "#0C0C0C",
                fontFamily: "'Kanit', sans-serif",
              }}>{s.desc}</p>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

/* ════════════════════════════════════════
   PROJECTS SECTION
════════════════════════════════════════ */
const projects = [
  {
    num: "01", name: "Nextlevel Studio", type: "Client",
    imgs: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png",
    ],
  },
  {
    num: "02", name: "Aura Brand Identity", type: "Personal",
    imgs: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png",
    ],
  },
  {
    num: "03", name: "Solaris Digital", type: "Client",
    imgs: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png",
    ],
  },
];

const totalCards = projects.length;

const ProjectCard = ({ project, index, progress }) => {
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / totalCards, 1], [1, targetScale]);

  const imgRadius = "clamp(18px,3vw,48px)";

  return (
    <div style={{ height: "85vh", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <motion.div style={{
        scale,
        position: "sticky",
        top: `calc(96px + ${index * 28}px)`,
        width: "100%", maxWidth: "1200px",
        borderRadius: "clamp(32px,4vw,60px)",
        border: "2px solid #D7E2EA",
        background: "#0C0C0C",
        padding: "clamp(14px,2.5vw,32px)",
        transformOrigin: "top center",
        willChange: "transform",
      }}>
        {/* Top row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "clamp(10px,2vw,24px)", flexWrap: "wrap", gap: "10px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px,1.5vw,24px)", flexWrap: "wrap" }}>
            <span style={{
              color: "#D7E2EA", fontWeight: 900,
              fontSize: "clamp(1.2rem,3.5vw,3rem)", opacity: 0.4,
              fontFamily: "'Kanit', sans-serif",
            }}>{project.num}</span>
            <span style={{
              color: "#D7E2EA", fontWeight: 300,
              fontSize: "clamp(0.65rem,1vw,1rem)",
              textTransform: "uppercase", letterSpacing: "0.15em",
              border: "1px solid rgba(215,226,234,0.3)",
              borderRadius: "9999px", padding: "3px 12px",
              fontFamily: "'Kanit', sans-serif",
            }}>{project.type}</span>
            <span style={{
              color: "#D7E2EA", fontWeight: 700,
              fontSize: "clamp(0.9rem,2.2vw,2rem)",
              textTransform: "uppercase",
              fontFamily: "'Kanit', sans-serif",
            }}>{project.name}</span>
          </div>
          <LiveProjectButton />
        </div>

        {/* Image grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "40% 60%",
          gap: "clamp(6px,1.2vw,16px)",
          height: "clamp(280px,45vw,570px)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(6px,1.2vw,16px)" }}>
            <SafeImg src={project.imgs[0]} style={{
              borderRadius: imgRadius, objectFit: "cover",
              width: "100%", height: "clamp(120px,16vw,230px)", flexShrink: 0,
            }} fallbackBg="#1a1a2e" />
            <SafeImg src={project.imgs[1]} style={{
              borderRadius: imgRadius, objectFit: "cover",
              width: "100%", flex: 1, minHeight: "clamp(140px,18vw,300px)",
            }} fallbackBg="#1a2e1a" />
          </div>
          <SafeImg src={project.imgs[2]} style={{
            borderRadius: imgRadius, objectFit: "cover",
            width: "100%", height: "100%",
          }} fallbackBg="#2e1a1a" />
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  return (
    <section id="projects" ref={containerRef} style={{
      background: "#0C0C0C",
      borderRadius: "60px 60px 0 0",
      marginTop: "-56px",
      position: "relative",
      zIndex: 10,
      padding: "clamp(60px,6vw,80px) clamp(16px,3vw,32px) 80px",
    }}>
      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading" style={{
          fontWeight: 900, textTransform: "uppercase", textAlign: "center",
          fontSize: "clamp(3rem, 12vw, 160px)",
          letterSpacing: "-0.02em", lineHeight: 1,
          marginBottom: "clamp(40px,6vw,80px)",
          fontFamily: "'Kanit', sans-serif",
        }}>Project</h2>
      </FadeIn>
      {projects.map((p, i) => (
        <ProjectCard key={p.num} project={p} index={i} progress={scrollYProgress} />
      ))}
    </section>
  );
};

/* ════════════════════════════════════════
   APP
════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <FontLoader />
      <div style={{ background: "#0C0C0C", overflowX: "clip", fontFamily: "'Kanit', sans-serif" }}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <WhatsAppButton />
      </div>
    </>
  );
}

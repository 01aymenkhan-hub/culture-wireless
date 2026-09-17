import React from "react";
import Link from "next/link";
import { Ico } from "../Components/Icons";

export default function About() {
  return (
    <main>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link href="/">culturewireless.com</Link>
            <span className="slash">/</span>
            <span>about</span>
          </div>
          <h1 className="page-h1">
            WE ARE
            <br />
            CULTURE.
          </h1>
          <p className="page-lede">
            Built block by block in Georgia and the Lower 48. A telecom for the
            communities we serve.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="two-col">
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                maxHeight: 320,
                alignSelf: "center",
              }}
            >
              <img
                src="/assets/story-photo.jpg"
                alt="Culture Wireless team"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 20%",
                  display: "block",
                }}
              />
            </div>
            <div>
              <div className="section-eyebrow">Our story</div>
              <h2 className="section-h2">
                Started with one block. Now we serve the world.
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--cw-fg-2)",
                  lineHeight: 1.65,
                  marginBottom: 14,
                }}
              >
                Culture Wireless was founded in 2019 by Atlanta natives who'd watched too many neighborhoods get passed over by national carriers. We started with one fiber pull on the West Side of Atlanta. We're now in 10,000+ homes passed across Georgia and the Lower 48.
              </p>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--cw-fg-2)",
                  lineHeight: 1.65,
                  marginBottom: 14,
                }}
              >
                We're operators first, marketers last. Our trucks are local. Our
                techs live where you live. And every line we run is one less family
                stuck on dial-up speeds or paying $150/month for mediocre service.
              </p>
              <p style={{ fontSize: 15, color: "var(--cw-fg-2)", lineHeight: 1.65 }}>
                The digital divide is real. Closing it, one block at a time, is what
                we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission/Vision/Pillars */}
      <section className="page-section" style={{ background: "var(--cw-bg-2)" }}>
        <div className="sec-inner">
          <div className="section-eyebrow">What drives us</div>
          <h2 className="section-h2">Mission · Vision · Pillars</h2>
          <div className="card-grid-3" style={{ marginTop: 16 }}>
            {[
              {
                icon: "radio-tower",
                title: "Connect",
                text: "Reliable fiber and 5G to the unserved, underserved, and unconnected communities across America.",
              },
              {
                icon: "users",
                title: "Empower",
                text: "Local jobs, local techs, and digital literacy programs in every community we enter.",
              },
              {
                icon: "globe",
                title: "Expand",
                text: "Build out, never up. New blocks every week, new markets every quarter.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="card"
                style={{ alignItems: "center", textAlign: "center", gap: 12, padding: 32 }}
              >
                <div className="icon-box lg">
                  <Ico n={c.icon} size={28} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--cw-purple)",
                  }}
                >
                  {c.title}
                </div>
                <div style={{ fontSize: 14, color: "var(--cw-fg-3)", lineHeight: 1.6 }}>
                  {c.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="section-eyebrow">Leadership</div>
          <h2 className="section-h2">Operators, builders, neighbors.</h2>
          <div className="card-grid-5" style={{ marginTop: 16 }}>
            {[
              {
                name: "Al Adjahoe",
                role: "CEO",
                photo: "/assets/team/al-adjahoe.webp",
              },
              {
                name: "Marcus Stephens",
                role: "President & CBO",
                photo: "/assets/team/marcus-stephens.webp",
              },
              {
                name: 'William "Bam" Sparks',
                role: "CMO",
                photo: "/assets/team/william-sparks.webp",
              },
              {
                name: "Jerome Howard",
                role: "COO",
                photo: "/assets/team/jerome-howard.webp",
              },
              {
                name: "William Johnson",
                role: "CRO",
                photo: "/assets/team/william-johnson.webp",
              },
            ].map((l) => (
              <div key={l.name} className="leader-card">
                <div className="leader-photo-wrap">
                  <img
                    src={l.photo}
                    alt={l.name}
                    className="leader-photo"
                    style={{ objectPosition: "center center" }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textAlign: "center",
                  }}
                >
                  {l.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--cw-fg-3)", textAlign: "center" }}>
                  {l.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* Press */}
    <section className="page-section" style={{ background: "var(--cw-bg-2)" }}>
      <div className="sec-inner">
        <div className="section-eyebrow">Press</div>
        <h2 className="section-h2">In the news.</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            border: "1px solid var(--cw-border-1)",
            borderRadius: 12,
            overflow: "hidden",
            marginTop: 12,
            maxWidth: 800,
          }}
        >
          {[
            {
              pub: "11Alive",
              headline: "Culture Wireless Works to Expand Access in Underserved Communities",
              date: "",
              href: "https://www.11alive.com/video/news/community/one-on-one/culture-wireless-works-to-expand-access-in-underserved-communities/85-9de0e6f4-dbd5-4a38-a68b-eb2c2873f4f9",
            },
            {
              pub: "AfroTech",
              headline: "How Culture Wireless Co-Founder William 'Bam' Sparks Is Bridging The Digital Divide Through Community Ownership",
              date: "",
              href: "https://afrotech.com/culture-wireless-founder-bridging-digital-divide-through-community-ownership",
            },
            {
              pub: "Andreessen Horowitz",
              headline: "Meet the Talent x Opportunity Fall '23 Cohort",
              date: "",
              href: "https://a16z.com/meet-the-talent-x-opportunity-fall-23-cohort/",
            },
            {
              pub: "Rolling Out",
              headline: "Culture Wireless' Jerome Howard Provides Quality, Inexpensive Internet Service",
              date: "",
              href: "https://rollingout.com/2023/12/12/culture-wireless-jerome-howard/",
            },
            {
              pub: "iHeart / Black Tech Green Money",
              headline: "Jerome Howard — Culture Wireless",
              date: "",
              href: "https://www.iheart.com/podcast/1119-black-tech-green-money-80005661/episode/jerome-howard-culture-wireless-149927046/",
            },
            {
              pub: "The Atlanta Voice",
              headline: "Culture Wireless: Bridging the Digital Gap",
              date: "",
              href: "https://www.theatlantavoice.com/business/culture-wireless-bridging-digital-gap-01ccc6ae",
            },
          ].map((n, i) => (
            
            <a key={i}
              href={n.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--cw-border-1)",
                background: "var(--cw-bg-1)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "var(--cw-bg-3)",
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "var(--cw-fg-3)",
                  flexShrink: 0,
                }}
              >
                {n.pub}
              </span>
              <div style={{ flex: 1, fontWeight: 500, fontSize: 14, color: "var(--cw-fg-1)" }}>
                {n.headline}
              </div>
              {n.date && (
                <div style={{ fontFamily: "var(--cw-font-mono)", fontSize: 11, color: "var(--cw-fg-3)", flexShrink: 0 }}>
                  {n.date}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
    </main>
  );
}

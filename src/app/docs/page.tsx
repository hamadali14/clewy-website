"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Search, Code, Server, Shield, Layers, Terminal, ArrowRight, Globe, CheckCircle2, XCircle, FileCode2, BookOpen } from "lucide-react";

const SECTIONS = [
  { id: "intro", title: "1. Introduction" },
  { id: "core-concepts", title: "2. Core Concepts" },
  { id: "syntax", title: "3. Interactive Syntax" },
  { id: "deployment", title: "4. Deployment & Tooling" },
  { id: "roadmap", title: "5. Roadmap & FAQ" }
];

const EXAMPLES = [
  {
    id: "barbershop",
    name: "Barbershop Module",
    code: `industry "Barbershop" {
  // ROLLER 
  role Kund {
    email: String
    telefon: String
    favorit_frisör: Frisör?
  }
  role Frisör {
    namn: String
    specialitet: [String]
    schema: Schema
    betyg: Float = 5.0
  }
  role Ägare extends Frisör {
    butik: Butik
  }

  // ENTITETER 
  entity Tjänst {
    namn: String
    pris: Decimal
    varaktighet: Duration
    kategori: TjänstKategori
    aktiv: Bool = true
    validate {
      pris > 0 "Priset måste vara större än 0"
      varaktighet > 0 "Varaktigheten måste vara positiv"
    }
  }

  entity Bokning {
    kund: Kund
    frisör: Frisör
    tjänst: Tjänst
    tid: DateTime
    anteckningar: String?
    status: BokningStatus
    totalt: Decimal
    computed slutTid: DateTime {
      return tid + tjänst.varaktighet
    }
    timestamps: true
  }

  // STATUSAR 
  status BokningStatus {
    Väntande -> Bekräftad -> Slutförd
    Väntande -> Avbokad
    Bekräftad -> Avbokad om (bokning.tid - now()) > Duration(hours: 2)
    initial: Väntande
    terminal: [Slutförd, Avbokad]
  }

  // BEHÖRIGHETER 
  permission {
    Kund kan skapa Bokning
    Kund kan läsa, avboka Bokning om bokning.kund == aktiv_användare
    Kund kan läsa Tjänst, Frisör
    Frisör kan läsa Bokning om bokning.frisör == aktiv_användare
    Frisör kan bekräfta, slutföra Bokning om bokning.frisör == aktiv_användare
    Ägare kan allt
  }

  // REGLER 
  rule "Inga dubbelBokningar" {
    gäller: Bokning
    villkor: {
      inga Bokning b där
      b.frisör == bokning.frisör &&
      b.id != bokning.id &&
      b.status IN ["Väntande", "Bekräftad"] &&
      överlapper(b.tid, b.slutTid, bokning.tid, bokning.slutTid)
    }
  }

  // ACTIONS 
  action skapaBokning(tjänstId: UUID, frisörId: UUID, tid: DateTime, anteckningar: String?): Bokning {
    let tjänst = Tjänst.hittaMed(tjänstId) ?? kasta NotFoundError("Tjänst")
    let frisör = Frisör.hittaMed(frisörId) ?? kasta NotFoundError("Frisör")
    
    om !frisör.tillgänglig(tid, tjänst.varaktighet) {
      kasta ConflictError("Frisören är inte tillgänglig vid denna tid")
    }
    
    let bokning = Bokning.skapa({
      kund: aktiv_användare,
      frisör, tjänst, tid, anteckningar,
      totalt: tjänst.pris,
      status: "Väntande"
    })
    
    await skickaBookingbekräftelse(bokning)
    emittera BokningsSkapad { bokning }
    return bokning
  }
}`
  },
  {
    id: "gym",
    name: "Gym & Membership",
    code: `industry "Gym" {
  role Medlem {
    förnamn: String
    efternamn: String
    email: Email
    telefon: String
    foto: URL?
    nödkontakt: String
  }
  
  role Tränare {
    namn: String
    certifikat: [String]
    specialitet: [String]
    bio: String
  }
  
  role Admin extends Tränare {}

  entity Medlemskap {
    medlem: Medlem
    typ: MedlemskapTyp
    startDatum: Date
    slutDatum: Date
    pris: Decimal
    status: MedlemskapStatus
    autoFörnya: Bool = true
  }

  entity PassKlass {
    namn: String
    tränare: Tränare
    tid: DateTime
    varaktighet: Duration
    maxDeltagare: Int
    rum: String
    nivå: "Nybörjare" | "Mellannivå" | "Avancerad"
    
    computed platserKvar: Int {
      return maxDeltagare - Bokning.räkna({ klass: self, status: "Aktiv" })
    }
    computed fullSatt: Bool {
      return platserKvar == 0
    }
  }

  entity KlassBokning {
    medlem: Medlem
    klass: PassKlass
    bokadDatum: DateTime
    status: KlassBokningStatus
    validate {
      !klass.fullSatt "Klassen är fullsatt"
      klass.tid > now() "Kan inte boka en klass som redan startat"
    }
  }

  status MedlemskapStatus {
    Aktiv -> Pausad -> Aktiv
    Aktiv -> Utgången
    Aktiv -> Avslutad
    Pausad -> Avslutad
    initial: Aktiv
    terminal: [Avslutad]
  }

  status KlassBokningStatus {
    Bokad -> Deltagit
    Bokad -> Avbokad -> Bokad // Kan återboka
    initial: Bokad
  }

  permission {
    Medlem kan läsa PassKlass, Tränare
    Medlem kan skapa, avboka KlassBokning om bokning.medlem == aktiv_användare
    Medlem kan läsa KlassBokning om bokning.medlem == aktiv_användare
    Tränare kan skapa, uppdatera PassKlass
    Tränare kan läsa KlassBokning om bokning.klass.tränare == aktiv_användare
    Admin kan allt
  }

  // AUTOMATISKA PROCESSER 
  schema "@dagligen 06:00" {
    // Kör varje dag klockan 06:00
    let utgångna = Medlemskap.filtrera({ 
      slutDatum: idag(), autoFörnya: true, status: "Aktiv" 
    })
    
    för medlemskap i utgångna {
      försök {
        await förnyaMedlemskap(medlemskap)
      } fånga (BetalningsError e) {
        await skickaFörnyelseProblemNotis(medlemskap.medlem)
        medlemskap.uppdatera({ status: "Utgången" })
      }
    }
  }

  schema "@timme" {
    // Påminnelse 2 timmar innan klass
    let kommandaKlasser = PassKlass.filtrera({ 
      tid: intervall(now(), now() + Duration(hours: 2)) 
    })
    
    för klass i kommandaKlasser {
      let deltagare = KlassBokning
        .filtrera({ klass, status: "Bokad" })
        .mappa((b) => b.medlem)
        
      för deltagare i deltagare {
        await skickaPushNotis(deltagare, "Din klass \${klass.namn} börjar om 2 timmar")
      }
    }
  }
}`
  },
  {
    id: "ecommerce",
    name: "E-Commerce Checkout",
    code: `industry "E-handel" {
  role Kund {
    email: Email
    förnamn: String
    efternamn: String
    adresser: [Adress]
    betalmetoder: [Betalmetod]
  }

  entity Produkt {
    namn: String
    pris: Decimal
    lager: Int
    sku: String
    bilder: [URL]
    kategori: Kategori
    aktiv: Bool = true
    validate {
      pris > 0 "Priset måste vara positivt"
      lager >= 0 "Lagret kan inte vara negativt"
    }
  }

  workflow CheckoutProcess för Order {
    steg ValideraKorg {
      indata: { korgId: UUID }
      action {
        let korg = Korg.hittaMed(korgId) ?? kasta NotFoundError()
        guard !korg.varor.isEmpty() annars {
          kasta ValidationError("Korgen är tom")
        }
        
        för vara i korg.varor {
          om vara.produkt.lager < vara.antal {
            kasta LagerError("\${vara.produkt.namn} saknas i lager")
          }
        }
        nästa BeräknaTotalt med { korg }
      }
    }

    steg BeräknaTotalt {
      action {
        let delsumma = korg.varor.reduce((acc, v) => acc + v.produkt.pris * v.antal, 0)
        let frakt = beräknaFrakt(korg.leveransadress, delsumma)
        let moms = delsumma * 0.25
        let totalt = delsumma + frakt + moms
        nästa TillämpaRabatter med { delsumma, frakt, moms, totalt }
      }
    }

    steg TillämpaRabatter {
      action {
        let rabatter = hämtaTillgängligaRabatter(aktiv_användare, totalt)
        let rabatterat = tillämpaRabatter(totalt, rabatter)
        nästa InitieraBetalning med { totalt: rabatterat, tillämpadeRabatter: rabatter }
      }
    }

    steg InitieraBetalning {
      action {
        let order = Order.skapa({
          kund: aktiv_användare,
          varor: korg.varor,
          prisinfo,
          status: "Väntande"
        })
        
        let betalningsintention = await stripe.skapaBetalningsintention({
          belopp: order.totalt,
          valuta: "sek",
          metadata: { orderId: order.id }
        })
        
        nästa VäntarPåBetalning med { order, klientHemlighet: betalningsintention }
      }
    }

    steg VäntarPåBetalning {
      timeout: Duration(minutes: 30)
      terminal: false
      vid lyckadBetalning: nästa BekräftaOrder
      vid misslyckad: nästa BetalningMisslyckad
      vid timeout: nästa Avbruten
    }

    steg BekräftaOrder {
      action {
        order.övergåTill("Bekräftad")
        await reserveraLager(order)
        await skickaOrderbekräftelse(order)
        emittera OrderBekräftad { order }
        terminal: true
      }
    }
  }
}`
  },
  {
    id: "consulting",
    name: "Consulting & Time Tracking",
    code: `industry "Konsult" {
  role Klient {
    företagsNamn: String
    kontaktPerson: String
    email: Email
    fakturaAdress: Adress
  }

  role Konsult {
    namn: String
    titel: String
    timtaxa: Decimal
    kompetenser: [String]
    tillgänglighet: Float = 1.0 // 0-1 (100% = heltid)
  }

  role Projektledare extends Konsult {}
  role Admin {}

  entity Projekt {
    namn: String
    klient: Klient
    projektledare: Projektledare
    team: [Konsult]
    startDatum: Date
    budget: Decimal?
    status: ProjektStatus
    beskrivning: String
    
    computed förbrukadBudget: Decimal {
      return Tidrapport
        .filtrera({ projekt: self, godkänd: true })
        .reduce((acc, t) => acc + t.timmar * t.timpris, 0)
    }
  }

  entity Tidrapport {
    konsult: Konsult
    projekt: Projekt
    datum: Date
    timmar: Float
    beskrivning: String
    timpris: Decimal
    godkänd: Bool = false
    fakturerad: Bool = false
    
    computed belopp: Decimal { return timmar * timpris }
    
    validate {
      timmar > 0 && timmar <= 24 "Timmar måste vara mellan 0 och 24"
      datum <= today() "Kan inte rapportera framtida tid"
    }
  }

  entity Faktura {
    klient: Klient
    projekt: Projekt
    tidrapporter: [Tidrapport]
    utfärdadDatum: Date
    förfalloDatum: Date
    summa: Decimal
    moms: Decimal
    totalt: Decimal
    status: FakturaStatus
    fakturaNumr: String
    unique [fakturaNumr]
  }

  status FakturaStatus {
    Utkast -> Skickad -> Betald
    Skickad -> Försenad -> Betald
    Skickad -> Avbruten
    initial: Utkast
    terminal: [Betald, Avbruten]
  }

  // AUTOMATISK FAKTURASGENERERING 
  action genereraFaktura(projektId: UUID, perioden: DateRange): Faktura {
    let projekt = Projekt.hittaMed(projektId) ?? kasta NotFoundError()
    guard projekt.status == "Aktiv" annars {
      kasta ValidationError("Kan bara fakturera aktiva projekt")
    }
    
    let tidrapporter = Tidrapport.filtrera({
      projekt,
      datum: perioden,
      godkänd: true,
      fakturerad: false
    })
    
    guard !tidrapporter.isEmpty() annars {
      kasta ValidationError("Inga ofakturerade tidrapporter")
    }
    
    let summa = tidrapporter.reduce((acc, t) => acc + t.belopp, 0)
    let moms = summa * 0.25
    
    let faktura = Faktura.skapa({
      klient: projekt.klient,
      projekt,
      tidrapporter,
      utfärdadDatum: today(),
      förfalloDatum: today() + Duration(days: 30),
      summa,
      moms,
      totalt: summa + moms,
      fakturaNumr: genereraFakturaNumr(),
      status: "Utkast"
    })
    
    tidrapporter.uppdateraAlla({ fakturerad: true })
    return faktura
  }
}`
  }
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(EXAMPLES[0].id);
  const [hybridLayer, setHybridLayer] = useState<"business" | "programming">("business");

  // Simple scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SECTIONS.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 120, behavior: "smooth" });
    }
  };

  const filteredSections = SECTIONS.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative min-h-screen font-sans selection:bg-black/10 bg-[#FBFBFA]">
      <NavBar />
      
      <div className="pt-32 max-w-7xl mx-auto px-6 flex items-start gap-12 relative">
        
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto pr-6">
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input 
              type="text" 
              placeholder="Search docs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 backdrop-blur-sm border border-black/10 rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>

          <nav className="space-y-1">
            {filteredSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`relative w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeSection === section.id ? 'text-[#111110]' : 'text-black/50 hover:text-black/80 hover:bg-black/5'}`}
              >
                {activeSection === section.id && (
                  <motion.div
                    layoutId="activeSidebar"
                    className="absolute inset-0 bg-black/5 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{section.title}</span>
              </button>
            ))}
            {filteredSections.length === 0 && (
              <div className="text-sm text-black/40 px-4 py-2">No results found.</div>
            )}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 pb-32 max-w-3xl">
          
          {/* Section 1: Introduction */}
          <section id="intro" className="mb-24 scroll-mt-32">
            <h1 className="text-4xl font-bold tracking-tight text-[#111110] mb-6">Introduction</h1>
            <p className="text-lg text-black/60 leading-relaxed mb-6">
              Clewy is a modern, statically typed hybrid programming language designed from the ground up to handle the complexity of modern business logic—without compromising the power and flexibility of a full-scale programming language.
            </p>
            
            <div className="bg-white/40 border border-black/5 rounded-3xl p-8 mb-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#111110] mb-4">The Problem with Traditional Solutions</h3>
              <p className="text-black/60 leading-relaxed mb-4">
                Modern enterprise software suffers from a fundamental gap between business logic and technical implementation.
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-black/70"><strong>Generic programming languages</strong> (Python, TypeScript, Go) are powerful, but require every business concept—roles, permissions, workflows—to be implemented manually. A simple "Admin can approve" rule results in hundreds of lines of code scattered across controllers and middleware.</span>
                </li>
                <li className="flex gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-black/70"><strong>Low-code/no-code platforms</strong> (Bubble, AppMaster, Retool) solve the inverse problem: accessible for non-technical users but offer limited flexibility. When business requirements grow, you hit a wall. Breaking out of them is painful and expensive.</span>
                </li>
              </ul>
              <div className="bg-green-50 text-green-900 border border-green-200 rounded-xl p-4">
                <strong>Clewy's Answer:</strong> Domain knowledge belongs in the language, not the library. Clewy introduces first-class constructs for entities, roles, and status machines natively into the syntax.
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-[#111110] mb-4">Who is it for?</h3>
                <ul className="space-y-4 text-black/70 text-sm">
                  <li><strong>Professional Developers:</strong> Eliminate repetitive boilerplate code and focus on product differentiation. You lose zero power compared to TS.</li>
                  <li><strong>Technical Founders:</strong> Validate ideas and build MVPs rapidly without hiring a full team.</li>
                  <li><strong>Agencies & System Integrators:</strong> Use industry templates and generic programming to deliver bespoke systems quickly.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111110] mb-4">Does not fit for:</h3>
                <ul className="space-y-3 text-black/70 text-sm">
                  <li className="flex gap-2"><XCircle className="w-4 h-4 text-black/30" /> Low-level system programming (use Rust or C)</li>
                  <li className="flex gap-2"><XCircle className="w-4 h-4 text-black/30" /> Pure algorithm libraries without business logic</li>
                  <li className="flex gap-2"><XCircle className="w-4 h-4 text-black/30" /> Projects without any web application component</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Core Concepts */}
          <section id="core-concepts" className="mb-24 scroll-mt-32">
            <h2 className="text-3xl font-bold tracking-tight text-[#111110] mb-6">Core Concepts: The Hybrid Engine</h2>
            <p className="text-black/60 leading-relaxed mb-8">
              Clewy is not one or the other—it is both. It is structured around two co-existing layers. You can define your domain in the Business Layer, and write advanced logic in the Programming Layer. They communicate seamlessly.
            </p>
            
            <div className="bg-white border border-black/5 shadow-sm rounded-3xl p-2 mb-10 flex relative">
              <div className="absolute inset-0 bg-black/5 rounded-3xl -z-10 blur-xl opacity-50" />
              <button 
                onClick={() => setHybridLayer("business")}
                className={`relative flex-1 py-3 text-sm font-semibold rounded-2xl transition-colors ${hybridLayer === "business" ? 'text-white' : 'text-black/50 hover:text-black'}`}
              >
                {hybridLayer === "business" && (
                  <motion.div layoutId="hybridBg" className="absolute inset-0 bg-[#111110] rounded-2xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2"><Layers className="w-4 h-4" /> Business Layer</span>
              </button>
              <button 
                onClick={() => setHybridLayer("programming")}
                className={`relative flex-1 py-3 text-sm font-semibold rounded-2xl transition-colors ${hybridLayer === "programming" ? 'text-white' : 'text-black/50 hover:text-black'}`}
              >
                {hybridLayer === "programming" && (
                  <motion.div layoutId="hybridBg" className="absolute inset-0 bg-[#111110] rounded-2xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2"><Code className="w-4 h-4" /> Programming Layer</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {hybridLayer === "business" ? (
                <motion.div 
                  key="business"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10"
                >
                  {['industry', 'role', 'entity', 'permission', 'workflow', 'status', 'rule'].map(term => (
                    <div key={term} className="bg-white/40 border border-black/5 p-4 rounded-2xl font-mono text-sm text-[#111110] text-center">
                      <span className="text-[#c4b59b] font-bold">{term}</span>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="programming"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10"
                >
                  {['fn', 'async', 'action', 'component', 'type', 'interface'].map(term => (
                    <div key={term} className="bg-[#111110] border border-white/10 p-4 rounded-2xl font-mono text-sm text-white text-center">
                      <span className="text-[#8b9487] font-bold">{term}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <h3 className="text-xl font-bold text-[#111110] mb-6">Language Comparison</h3>
            <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#111110] text-white">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Egenskap</th>
                    <th className="px-6 py-4 font-semibold text-[#c4b59b]">CLEWY</th>
                    <th className="px-6 py-4 font-semibold">TYPESCRIPT</th>
                    <th className="px-6 py-4 font-semibold">PYTHON</th>
                    <th className="px-6 py-4 font-semibold">LOW-CODE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-[#111110]">
                  <tr>
                    <td className="px-6 py-4 font-medium">Affärskoncept inbyggda</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4 text-black/50">❌ Nej</td>
                    <td className="px-6 py-4 text-black/50">❌ Nej</td>
                    <td className="px-6 py-4 text-yellow-600">⚠️ Delvis</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Fullständig programmeringslogik</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4 text-black/50">❌ Nej</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Statisk typning</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4 text-yellow-600">⚠️ Delvis</td>
                    <td className="px-6 py-4 text-black/50">❌ Nej</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Kodgenerering</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4 text-black/50">❌ Nej</td>
                    <td className="px-6 py-4 text-black/50">❌ Nej</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Versionskontroll (Git)</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4 text-red-500">❌ Sällan</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Skalbarhet</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4 text-red-500">❌ Begränsad</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Branschmallar</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4 text-black/50">❌ Nej</td>
                    <td className="px-6 py-4 text-black/50">❌ Nej</td>
                    <td className="px-6 py-4 text-yellow-600">⚠️ Begränsade</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Rollbaserad behörighet</td>
                    <td className="px-6 py-4 text-[#c4b59b] font-semibold">Inbyggt</td>
                    <td className="px-6 py-4 text-black/50">Manuellt</td>
                    <td className="px-6 py-4 text-black/50">Manuellt</td>
                    <td className="px-6 py-4 text-yellow-600">⚠️ Delvis</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Statusmaskiner</td>
                    <td className="px-6 py-4 text-[#c4b59b] font-semibold">Inbyggt</td>
                    <td className="px-6 py-4 text-black/50">Manuellt</td>
                    <td className="px-6 py-4 text-black/50">Manuellt</td>
                    <td className="px-6 py-4 text-yellow-600">⚠️ Delvis</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">UI-generering</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                    <td className="px-6 py-4 text-black/50">❌ Nej</td>
                    <td className="px-6 py-4 text-black/50">❌ Nej</td>
                    <td className="px-6 py-4"><CheckCircle2 className="w-4 h-4 text-green-500 inline mr-2"/> Ja</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Interactive Syntax */}
          <section id="syntax" className="mb-24 scroll-mt-32">
            <h2 className="text-3xl font-bold tracking-tight text-[#111110] mb-6">Interactive Syntax Reference</h2>
            <p className="text-black/60 leading-relaxed mb-8">
              Explore how Clewy handles various enterprise scenarios using explicit business logic mapped to pure functions. These are complete, production-ready blueprints exactly as seen in our documentation.
            </p>

            <div className="bg-[#111110] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <div className="flex overflow-x-auto scrollbar-hide bg-white/5 border-b border-white/10">
                {EXAMPLES.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
                  >
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 inset-x-0 h-0.5 bg-[#c4b59b]"
                      />
                    )}
                    {tab.name}
                  </button>
                ))}
              </div>
              
              <div className="p-6 overflow-x-auto text-sm font-mono text-white/80 leading-relaxed min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <code>
                      {EXAMPLES.find(e => e.id === activeTab)?.code.split('\n').map((line, i) => (
                        <div key={i} className="flex hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
                          <span className="w-8 shrink-0 text-white/30 select-none text-right mr-4">{i + 1}</span>
                          <span dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/industry|role|entity|status|permission|action|workflow|steg|inväntar|nästa|schema|computed|validate|guard|annars|let|return|await|kasta|för|i|om|emittera/g, '<span class="text-[#c4b59b]">$&</span>')
                              .replace(/String|DateTime|UUID|Float|Decimal|Date|Bool|Tjänst|BookingStatus|Bokning|URL|Email|MedlemskapTyp|MedlemskapStatus|PassKlass|KlassBokningStatus|Tränare|Medlem|Kund|Frisör|Ägare|Adress|Betalmetod|Kategori|Säljare|Projekt|Konsult|Klient|Faktura|FakturaStatus|Projektledare/g, '<span class="text-[#8b9487]">$&</span>')
                              .replace(/".*?"/g, '<span class="text-green-400/80">$&</span>')
                              .replace(/\/\/.*$/g, '<span class="text-white/40">$&</span>')
                              .replace(/->/g, '<span class="text-[#c4b59b] font-bold">-></span>')
                              .replace(/==/g, '<span class="text-white/60 font-bold">==</span>')
                              .replace(/!=/g, '<span class="text-white/60 font-bold">!=</span>')
                          }} />
                        </div>
                      ))}
                    </code>
                  </motion.pre>
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* Section 4: Deployment */}
          <section id="deployment" className="mb-24 scroll-mt-32">
            <h2 className="text-3xl font-bold tracking-tight text-[#111110] mb-6">Deployment & Tooling</h2>
            <p className="text-black/60 leading-relaxed mb-6">
              Clewy applications compile into standard Next.js 14+ App Router architectures. They can be deployed to any modern platform without vendor lock-in. Configuration is simple and explicit.
            </p>

            <div className="grid gap-8 mb-12">
              <div className="bg-white/40 border border-black/5 p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-start shadow-sm">
                <div className="w-14 h-14 bg-[#111110] text-[#FBFBFA] rounded-2xl flex items-center justify-center shrink-0">
                  <FileCode2 className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-4 text-[#111110]">Configuration (`clewy.config.json`)</h4>
                  <pre className="bg-[#111110] text-white/80 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner">
                    <code>{`web {
  mål: "next.js"
  version: "14"
  tema {
    primärfärg: "#0066FF"
    typsnitt: "Inter"
    radiusStil: "avrundad"
    mörktLäge: true
  }
  layout {
    typ: "sidebar" // "sidebar" | "toppnavigation"
    logotyp: "./tillgångar/logo.svg"
    varumärkesnamn: "Min Barbershop"
  }
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-white/40 border border-black/5 p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-start shadow-sm">
                <div className="w-14 h-14 bg-[#111110] text-[#FBFBFA] rounded-2xl flex items-center justify-center shrink-0">
                  <Layers className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-4 text-[#111110]">Generated Architecture</h4>
                  <p className="text-sm text-black/60 leading-relaxed mb-4">
                    Clewy outputs highly optimized Next.js pages, API routes, and Server Actions. Middleware is automatically generated from your <code>permission</code> blocks.
                  </p>
                  <pre className="bg-white border border-black/10 text-[#111110] p-4 rounded-xl text-sm font-mono overflow-x-auto">
                    <code>{`genererad-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   └── api/
├── components/
├── lib/
└── prisma/`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-white/40 border border-black/5 p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-start shadow-sm">
                <div className="w-14 h-14 bg-[#111110] text-[#FBFBFA] rounded-2xl flex items-center justify-center shrink-0">
                  <Terminal className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-4 text-[#111110]">Docker Multi-Stage Build</h4>
                  <p className="text-sm text-black/60 leading-relaxed mb-4">
                    Easily export an optimized <code>Dockerfile</code> using <code>clewy export --format docker</code>. The generated image uses Alpine Linux and minimizes runtime footprints.
                  </p>
                  <pre className="bg-[#111110] text-white/80 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner">
                    <code>{`FROM node:20-alpine AS bas
WORKDIR /app
FROM bas AS beroenden
COPY package*.json ./
RUN npm ci
FROM beroenden AS byggare
COPY . .
RUN npm run build
FROM bas AS produktion
ENV NODE_ENV=production
COPY --from=byggare /app/.next ./.next
COPY --from=byggare /app/node_modules ./node_modules
COPY --from=byggare /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Roadmap & FAQ */}
          <section id="roadmap" className="mb-24 scroll-mt-32">
            <h2 className="text-3xl font-bold tracking-tight text-[#111110] mb-6">Roadmap & FAQ</h2>
            <p className="text-black/60 leading-relaxed mb-10">
              Clewy is an evolving ecosystem. Our milestones are built on strict enterprise demands.
            </p>

            <div className="space-y-4 mb-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-black/10 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FBFBFA] bg-[#111110] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/60 backdrop-blur-xl border border-black/5 p-6 rounded-2xl shadow-sm">
                  <div className="text-[#c4b59b] font-bold text-sm mb-1 uppercase tracking-widest">Version 1.0 (Now)</div>
                  <h4 className="text-lg font-bold text-[#111110] mb-2">Core Language & Compiler</h4>
                  <ul className="text-sm text-black/60 space-y-1 list-disc list-inside ml-2">
                    <li>Complete Clewy compiler to TS/Next.js</li>
                    <li>Business Layer (`industry`, `role`, `entity`, `status`)</li>
                    <li>Database ORM schemas & API generation</li>
                    <li>Industry Templates (Barbershop, Gym, E-commerce)</li>
                  </ul>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FBFBFA] bg-white text-black/20 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm">
                  <div className="w-3 h-3 bg-[#c4b59b] rounded-full"></div>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/40 border border-black/5 p-6 rounded-2xl shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                  <div className="text-black/40 font-bold text-sm mb-1 uppercase tracking-widest">Version 1.1 (Q3 2025)</div>
                  <h4 className="text-lg font-bold text-[#111110] mb-2">Ecosystem Expansion</h4>
                  <ul className="text-sm text-black/60 space-y-1 list-disc list-inside ml-2">
                    <li>Multiple compiler targets (Remix, SvelteKit)</li>
                    <li>GraphQL API generation</li>
                    <li>Clewy Studio (Visual IDE)</li>
                    <li>Language Server Protocol (LSP)</li>
                  </ul>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FBFBFA] bg-white text-black/20 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm">
                  <div className="w-3 h-3 bg-black/10 rounded-full"></div>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/40 border border-black/5 p-6 rounded-2xl shadow-sm opacity-60 hover:opacity-100 transition-opacity">
                  <div className="text-black/40 font-bold text-sm mb-1 uppercase tracking-widest">Version 1.2 (Q4 2025)</div>
                  <h4 className="text-lg font-bold text-[#111110] mb-2">Enterprise & AI</h4>
                  <ul className="text-sm text-black/60 space-y-1 list-disc list-inside ml-2">
                    <li>Clewy AI (Assisted completion & generation)</li>
                    <li>SSO / SAML Integrations</li>
                    <li>Automated Audit Logs</li>
                    <li>Multi-region distributed databases</li>
                  </ul>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FBFBFA] bg-white text-black/20 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm">
                  <div className="w-3 h-3 bg-black/10 rounded-full"></div>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/40 border border-black/5 p-6 rounded-2xl shadow-sm opacity-40 hover:opacity-100 transition-opacity">
                  <div className="text-black/40 font-bold text-sm mb-1 uppercase tracking-widest">Version 2.0 (2026)</div>
                  <h4 className="text-lg font-bold text-[#111110] mb-2">Native Paradigm</h4>
                  <ul className="text-sm text-black/60 space-y-1 list-disc list-inside ml-2">
                    <li>Native Runtime (No Node.js dependency)</li>
                    <li>Distributed Workflows</li>
                    <li>Formal mathematical verification</li>
                    <li>Clewy Cloud Managed Hosting</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#111110] text-[#FBFBFA] rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Contact The Clewy Foundation</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-[#c4b59b] font-bold text-xs uppercase tracking-widest mb-1">Technical Support</div>
                  <a href="mailto:support@clewy.dev" className="text-white hover:text-white/80 transition-colors">support@clewy.dev</a>
                </div>
                <div>
                  <div className="text-[#c4b59b] font-bold text-xs uppercase tracking-widest mb-1">Enterprise Sales</div>
                  <a href="mailto:enterprise@clewy.dev" className="text-white hover:text-white/80 transition-colors">enterprise@clewy.dev</a>
                </div>
                <div>
                  <div className="text-[#c4b59b] font-bold text-xs uppercase tracking-widest mb-1">Security & Bounties</div>
                  <a href="mailto:security@clewy.dev" className="text-white hover:text-white/80 transition-colors">security@clewy.dev</a>
                </div>
                <div>
                  <div className="text-[#c4b59b] font-bold text-xs uppercase tracking-widest mb-1">Partnerships</div>
                  <a href="mailto:partners@clewy.dev" className="text-white hover:text-white/80 transition-colors">partners@clewy.dev</a>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>

      <footer className="border-t border-black/10 py-12 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#111110] rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#FBFBFA] rounded-full" />
            </div>
            <span className="font-semibold tracking-wide text-[#111110] text-sm uppercase">CLEWY</span>
          </div>
          <div className="text-xs text-black/40">
            © 2026 Clewy. All rights reserved. Powered by The Clewy Foundation.
          </div>
        </div>
      </footer>
    </div>
  );
}

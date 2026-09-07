/**
 * Editorial content for the insight posts published 2026-08 and 2026-09.
 * Facts sourced from: Gibson Dunn / DLA Piper / Holland & Knight briefings on
 * the EU AI Act Digital Omnibus (July 2026), Anthropic's Claude Fable 5 /
 * Mythos 5 announcement (June 2026), OpenAI's GPT-5.6 releases (July and
 * August 2026), McKinsey / PwC / Gartner / IBM agent-adoption research, and
 * the DORA 2025 report on AI-assisted engineering.
 *
 * The forward deployed engineer explainer carries only three factual claims,
 * each checkable in public: the military origin of the phrase, Palantir's
 * long-standing public use of the title on its own careers pages, and the
 * fact that AI labs and enterprise software vendors advertise the same title.
 * No figures, no client names, no case-study claims.
 *
 * House style: no em dashes anywhere in the copy. Gradients stay on the
 * near-black plus indigo palette, so a card without a cover still matches
 * the site.
 *
 * Consumed by scripts/seed-insights.ts (upsert into Payload) and
 * scripts/generate-insight-covers.tsx (cover art).
 */

export type RichBlock = { h2?: string; p?: string; ul?: string[] };

export type LocalizedPost = {
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  content: RichBlock[];
};

export type NewsPost = {
  slug: string;
  category: "ai" | "development" | "business" | "technology" | "cloud" | "mobile";
  readTime: number;
  featured: boolean;
  publishedAt: string;
  gradient: string;
  coverAlt: string;
  locales: { en: LocalizedPost; pl: LocalizedPost; de: LocalizedPost };
};

export const posts: NewsPost[] = [
  {
    slug: "eu-ai-act-august-2026-what-actually-changed",
    category: "business",
    readTime: 7,
    featured: true,
    publishedAt: "2026-08-18T09:00:00.000Z",
    gradient: "bg-gradient-to-br from-night-soft via-night to-night-deep",
    coverAlt: "Abstract compliance-checklist graphic for the EU AI Act deadline",
    locales: {
      en: {
        title:
          "The EU AI Act's biggest deadline just moved. Here's what still took effect on August 2",
        excerpt:
          "The Digital Omnibus deferred the AI Act's high-risk obligations to 2027-2028, but transparency rules, GPAI enforcement and the full penalty regime are live now. What EU companies should actually do with the extra time.",
        seoTitle: "EU AI Act: what changed on 2 August 2026",
        seoDescription:
          "The Digital Omnibus deferred high-risk AI obligations, but Article 50 transparency rules and the penalty regime took effect on 2 August 2026. A practical guide.",
        content: [
          {
            p: "For two years, 2 August 2026 was circled in every European compliance calendar as the day the AI Act's high-risk obligations would start to bite. Then, at the end of July, the Digital Omnibus entered into force and moved the goalposts: the obligations for stand-alone high-risk systems listed in Annex III are deferred to 2 December 2027, and for AI embedded in regulated products under Annex I to 2 August 2028.",
          },
          { h2: "What did take effect on August 2" },
          {
            p: "The deferral is not a pause on the whole Act. Since 2 August 2026, the transparency obligations of Article 50 are enforceable: people must be told when they are interacting with an AI system, synthetic content has to be labeled, and deepfakes must be identified as such. The same date activated the Commission's enforcement powers over general-purpose AI models and the full penalty regime, with fines of up to €35 million or 7% of global turnover for the most serious violations.",
          },
          {
            p: "If your product has a chatbot in front of customers, generates images, audio or text that could be mistaken for human-made, or fine-tunes a general-purpose model, you are already inside the enforceable part of the regulation.",
          },
          { h2: "The deferral is a window, not a waiver" },
          {
            p: "For systems in hiring, credit scoring, education, critical infrastructure and the other Annex III domains, the substance of the requirements has not changed: risk management, data governance, technical documentation, human oversight, logging and post-market monitoring are all still coming. Only the date moved. In our experience, a credible conformity setup takes 12-18 months to build, which makes December 2027 closer than it looks.",
          },
          { h2: "What we recommend doing now" },
          {
            ul: [
              "Inventory every AI system you build or deploy and classify it against Annex III; most companies find more in-scope systems than they expected.",
              "Ship Article 50 compliance immediately: AI-interaction disclosures, synthetic-media labeling and deepfake identification are live obligations, not future ones.",
              "Assign clear ownership for AI governance and start the technical documentation while systems are still small enough to document cheaply.",
              "Build evaluation, logging and human-oversight hooks into your systems now, because retrofitting them under deadline pressure is the expensive way.",
            ],
          },
          {
            p: "We help teams turn this from a legal reading exercise into an engineering backlog: system inventories, gap analyses and the technical controls that make compliance a property of the architecture rather than a binder on a shelf.",
          },
        ],
      },
      pl: {
        title:
          "Najważniejszy termin AI Act właśnie się przesunął. Oto, co i tak weszło w życie 2 sierpnia",
        excerpt:
          "Pakiet Digital Omnibus odroczył obowiązki dla systemów wysokiego ryzyka na lata 2027-2028, ale zasady przejrzystości, egzekwowanie przepisów wobec modeli GPAI i pełny system kar już obowiązują. Co firmy w UE powinny zrobić z dodatkowym czasem.",
        seoTitle: "AI Act: co zmieniło się 2 sierpnia 2026",
        seoDescription:
          "Digital Omnibus odroczył obowiązki dla AI wysokiego ryzyka, ale przejrzystość z art. 50 i system kar weszły w życie 2 sierpnia 2026. Praktyczny przewodnik.",
        content: [
          {
            p: "Przez dwa lata data 2 sierpnia 2026 była zakreślona w każdym europejskim kalendarzu compliance jako dzień, w którym zaczną obowiązywać wymogi AI Act dla systemów wysokiego ryzyka. Pod koniec lipca w życie wszedł jednak pakiet Digital Omnibus i przesunął granice: obowiązki dla samodzielnych systemów wysokiego ryzyka z załącznika III odroczono do 2 grudnia 2027, a dla AI wbudowanej w produkty regulowane z załącznika I do 2 sierpnia 2028.",
          },
          { h2: "Co jednak weszło w życie 2 sierpnia" },
          {
            p: "Odroczenie nie wstrzymuje całej regulacji. Od 2 sierpnia 2026 egzekwowalne są obowiązki przejrzystości z art. 50: użytkownik musi wiedzieć, że rozmawia z systemem AI, treści syntetyczne muszą być oznaczane, a deepfake'i identyfikowane. Tego samego dnia aktywowały się uprawnienia Komisji do egzekwowania przepisów wobec modeli ogólnego przeznaczenia (GPAI) oraz pełny system kar, z grzywnami do 35 mln euro lub 7% globalnego obrotu za najpoważniejsze naruszenia.",
          },
          {
            p: "Jeśli Twój produkt ma chatbota dla klientów, generuje obrazy, dźwięk lub tekst, które można pomylić z tworzonymi przez człowieka, albo dostraja model ogólnego przeznaczenia, już jesteś w egzekwowalnej części regulacji.",
          },
          { h2: "Odroczenie to okno, nie zwolnienie" },
          {
            p: "Dla systemów w rekrutacji, scoringu kredytowym, edukacji, infrastrukturze krytycznej i pozostałych obszarach załącznika III istota wymogów się nie zmieniła: zarządzanie ryzykiem, ład danych, dokumentacja techniczna, nadzór człowieka, logowanie i monitoring po wdrożeniu nadal nadchodzą. Przesunęła się tylko data. Z naszego doświadczenia wynika, że wiarygodny system zgodności buduje się 12-18 miesięcy, więc grudzień 2027 jest bliżej, niż się wydaje.",
          },
          { h2: "Co rekomendujemy zrobić teraz" },
          {
            ul: [
              "Zinwentaryzuj każdy system AI, który budujesz lub wdrażasz, i sklasyfikuj go względem załącznika III; większość firm znajduje więcej systemów w zakresie, niż się spodziewała.",
              "Wdróż zgodność z art. 50 od razu: informowanie o interakcji z AI, oznaczanie mediów syntetycznych i identyfikacja deepfake'ów to obowiązki bieżące, nie przyszłe.",
              "Wyznacz jasną odpowiedzialność za ład AI i zacznij dokumentację techniczną, póki systemy są na tyle małe, że dokumentuje się je tanio.",
              "Wbuduj ewaluacje, logowanie i mechanizmy nadzoru człowieka już teraz, bo dobudowywanie ich pod presją terminu to najdroższa droga.",
            ],
          },
          {
            p: "Pomagamy zespołom zamienić lekturę przepisów w backlog inżynierski: inwentaryzacje systemów, analizy luk i kontrole techniczne, dzięki którym zgodność jest właściwością architektury, a nie segregatorem na półce.",
          },
        ],
      },
      de: {
        title:
          "Die wichtigste Frist des EU AI Act wurde verschoben. Das gilt trotzdem seit dem 2. August",
        excerpt:
          "Der Digital Omnibus verschiebt die Hochrisiko-Pflichten auf 2027-2028, doch Transparenzregeln, GPAI-Durchsetzung und das volle Sanktionsregime gelten bereits. Was EU-Unternehmen mit der gewonnenen Zeit anfangen sollten.",
        seoTitle: "EU AI Act: Was sich am 2. August 2026 änderte",
        seoDescription:
          "Der Digital Omnibus verschiebt Hochrisiko-Pflichten, doch Art.-50-Transparenz und das Sanktionsregime gelten seit dem 2. August 2026. Ein praktischer Leitfaden.",
        content: [
          {
            p: "Zwei Jahre lang war der 2. August 2026 in jedem europäischen Compliance-Kalender markiert: der Tag, an dem die Hochrisiko-Pflichten des AI Act greifen sollten. Ende Juli trat dann der Digital Omnibus in Kraft und verschob die Ziellinie: Die Pflichten für eigenständige Hochrisiko-Systeme nach Anhang III gelten nun ab dem 2. Dezember 2027, für KI in regulierten Produkten nach Anhang I ab dem 2. August 2028.",
          },
          { h2: "Was am 2. August trotzdem in Kraft trat" },
          {
            p: "Die Verschiebung pausiert nicht das gesamte Gesetz. Seit dem 2. August 2026 sind die Transparenzpflichten des Artikels 50 durchsetzbar: Nutzer müssen erfahren, wenn sie mit einem KI-System interagieren, synthetische Inhalte müssen gekennzeichnet und Deepfakes als solche ausgewiesen werden. Am selben Tag wurden die Durchsetzungsbefugnisse der Kommission gegenüber Allzweck-KI-Modellen (GPAI) und das volle Sanktionsregime aktiviert, mit Bußgeldern von bis zu 35 Mio. Euro oder 7 % des weltweiten Umsatzes für die schwersten Verstöße.",
          },
          {
            p: "Wenn Ihr Produkt einen Chatbot im Kundenkontakt hat, Bilder, Audio oder Texte erzeugt, die für menschengemacht gehalten werden könnten, oder ein Allzweckmodell feinabstimmt, befinden Sie sich bereits im durchsetzbaren Teil der Verordnung.",
          },
          { h2: "Die Verschiebung ist ein Zeitfenster, kein Erlass" },
          {
            p: "Für Systeme in Recruiting, Kreditscoring, Bildung, kritischer Infrastruktur und den übrigen Anhang-III-Bereichen hat sich die Substanz der Anforderungen nicht geändert: Risikomanagement, Daten-Governance, technische Dokumentation, menschliche Aufsicht, Logging und Post-Market-Monitoring kommen weiterhin. Nur das Datum ist neu. Nach unserer Erfahrung dauert ein belastbares Konformitäts-Setup 12-18 Monate; der Dezember 2027 ist also näher, als er wirkt.",
          },
          { h2: "Was wir jetzt empfehlen" },
          {
            ul: [
              "Inventarisieren Sie jedes KI-System, das Sie bauen oder einsetzen, und klassifizieren Sie es gegen Anhang III; die meisten Unternehmen finden mehr betroffene Systeme als erwartet.",
              "Setzen Sie Artikel 50 sofort um: Hinweise auf KI-Interaktion, Kennzeichnung synthetischer Medien und Deepfake-Ausweisung sind geltende Pflichten, keine zukünftigen.",
              "Verankern Sie klare Verantwortung für KI-Governance und beginnen Sie die technische Dokumentation, solange die Systeme noch klein und günstig zu dokumentieren sind.",
              "Bauen Sie Evaluierung, Logging und menschliche Aufsicht jetzt in Ihre Systeme ein, denn das Nachrüsten unter Termindruck ist der teure Weg.",
            ],
          },
          {
            p: "Wir helfen Teams, aus der Gesetzeslektüre ein Engineering-Backlog zu machen: Systeminventare, Gap-Analysen und technische Kontrollen, die Compliance zu einer Eigenschaft der Architektur machen statt zu einem Ordner im Regal.",
          },
        ],
      },
    },
  },
  {
    slug: "frontier-models-h2-2026-claude-fable-5-gpt-5-6",
    category: "ai",
    readTime: 6,
    featured: false,
    publishedAt: "2026-08-11T09:00:00.000Z",
    gradient: "bg-gradient-to-br from-night via-night-soft to-night-deep",
    coverAlt: "Abstract tiered-steps graphic representing frontier AI model tiers",
    locales: {
      en: {
        title: "Claude Fable 5, GPT-5.6 and the new shape of the AI frontier",
        excerpt:
          "This summer's releases changed more than benchmark scores. Capability tiers, safety gating and effort controls are becoming the norm, and they change how you should architect on top of frontier models.",
        seoTitle: "Claude Fable 5 & GPT-5.6: the new AI frontier",
        seoDescription:
          "Anthropic's Claude Fable 5 and OpenAI's GPT-5.6 introduce capability tiers, safety gating and effort controls. What the summer 2026 frontier means for production AI stacks.",
        content: [
          {
            p: "In June, Anthropic released Claude Fable 5, the first publicly available model of its Mythos class, a tier that had previously been limited to a small group of cyber defenders and critical-infrastructure providers. In July, OpenAI answered with the GPT-5.6 family, and followed in August with an updated GPT-5.6 that exposes a slider controlling how much reasoning effort the model spends on a response.",
          },
          { h2: "Tiering is the real story" },
          {
            p: "Fable 5 and Mythos 5 share the same underlying model; what differs is the safety layer. The broadly available tier ships with safeguards that gate dual-use capabilities in areas like cybersecurity and biology (triggering, per Anthropic, in under 5% of sessions), while the unrestricted tier is reserved for vetted organizations. Frontier capability now arrives with an access policy attached, and the major clouds (AWS Bedrock, Google Cloud, Microsoft Foundry) distribute it that way.",
          },
          {
            p: "OpenAI's effort slider points at the same trend from the cost side: one model, many operating points. The question 'which model should we use?' is turning into 'which tier, at which effort, for which task?'",
          },
          { h2: "What this means for your stack" },
          {
            ul: [
              "Route by task, not by habit: pair each workload with the cheapest tier and effort level that passes your quality bar, and reserve frontier calls for the steps that need them.",
              "Make evals the gatekeeper: with releases landing quarterly, a regression suite over your own tasks is the only reliable way to adopt new models quickly and safely.",
              "Budget with effort in mind: effort controls turn latency and cost into tunable parameters; treat them as part of the product design, not an ops afterthought.",
              "Keep a thin abstraction over providers: tiering and gating policies differ and shift; your application logic shouldn't have to care.",
            ],
          },
          {
            p: "We build model-agnostic LLM stacks with routing and evaluation harnesses baked in, so when the frontier moves again next quarter, adopting it is a config change, not a rewrite.",
          },
        ],
      },
      pl: {
        title: "Claude Fable 5, GPT-5.6 i nowy kształt granicy możliwości AI",
        excerpt:
          "Tegoroczne letnie premiery zmieniły więcej niż wyniki benchmarków. Poziomy dostępu, bramki bezpieczeństwa i kontrola wysiłku modelu stają się normą i zmieniają sposób, w jaki warto budować na modelach frontier.",
        seoTitle: "Claude Fable 5 i GPT-5.6: nowa granica AI",
        seoDescription:
          "Claude Fable 5 od Anthropic i GPT-5.6 od OpenAI wprowadzają poziomy dostępu, bramki bezpieczeństwa i kontrolę wysiłku. Co lato 2026 oznacza dla produkcyjnych stosów AI.",
        content: [
          {
            p: "W czerwcu Anthropic udostępnił Claude Fable 5, pierwszy publicznie dostępny model klasy Mythos, dotąd zarezerwowanej dla wąskiej grupy zespołów cyberobrony i operatorów infrastruktury krytycznej. W lipcu OpenAI odpowiedziało rodziną GPT-5.6, a w sierpniu dołożyło aktualizację z suwakiem sterującym tym, ile wysiłku rozumowania model poświęca na odpowiedź.",
          },
          { h2: "Prawdziwą nowością są poziomy dostępu" },
          {
            p: "Fable 5 i Mythos 5 to ten sam model bazowy; różni je warstwa bezpieczeństwa. Wariant szeroko dostępny ma zabezpieczenia ograniczające zdolności podwójnego zastosowania w obszarach takich jak cyberbezpieczeństwo czy biologia (uruchamiające się, według Anthropic, w mniej niż 5% sesji), a wariant bez ograniczeń trafia wyłącznie do zweryfikowanych organizacji. Możliwości frontier przychodzą dziś z polityką dostępu w pakiecie i tak też dystrybuują je najwięksi dostawcy chmury (AWS Bedrock, Google Cloud, Microsoft Foundry).",
          },
          {
            p: "Suwak wysiłku od OpenAI pokazuje ten sam trend od strony kosztów: jeden model, wiele punktów pracy. Pytanie „którego modelu użyć?” zamienia się w „który poziom, z jakim wysiłkiem, do którego zadania?”.",
          },
          { h2: "Co to oznacza dla Twojego stosu" },
          {
            ul: [
              "Kieruj ruch według zadania, nie przyzwyczajenia: dobieraj najtańszy poziom i wysiłek, który przechodzi Twój próg jakości, a wywołania frontier zostaw krokom, które ich naprawdę wymagają.",
              "Niech ewaluacje będą bramką: przy premierach co kwartał zestaw testów regresyjnych na własnych zadaniach to jedyny niezawodny sposób szybkiej i bezpiecznej adopcji nowych modeli.",
              "Planuj budżet z uwzględnieniem wysiłku: kontrola wysiłku zamienia koszt i opóźnienie w parametry produktu, nie w problem operacyjny.",
              "Utrzymuj cienką warstwę abstrakcji nad dostawcami: polityki poziomów i bramek różnią się i zmieniają; logika aplikacji nie powinna musieć o tym wiedzieć.",
            ],
          },
          {
            p: "Budujemy stosy LLM niezależne od dostawcy, z routingiem i ewaluacjami w standardzie, żeby kolejne przesunięcie granicy było zmianą konfiguracji, a nie przepisywaniem systemu.",
          },
        ],
      },
      de: {
        title: "Claude Fable 5, GPT-5.6 und die neue Gestalt der KI-Frontier",
        excerpt:
          "Die Sommer-Releases haben mehr verändert als Benchmark-Werte. Fähigkeitsstufen, Safety-Gating und Effort-Steuerung werden zur Norm und verändern, wie man auf Frontier-Modellen bauen sollte.",
        seoTitle: "Claude Fable 5 & GPT-5.6: die neue KI-Frontier",
        seoDescription:
          "Anthropics Claude Fable 5 und OpenAIs GPT-5.6 bringen Fähigkeitsstufen, Safety-Gating und Effort-Steuerung. Was der Sommer 2026 für produktive KI-Stacks bedeutet.",
        content: [
          {
            p: "Im Juni veröffentlichte Anthropic Claude Fable 5, das erste öffentlich verfügbare Modell seiner Mythos-Klasse, die zuvor einer kleinen Gruppe von Cyber-Verteidigern und Betreibern kritischer Infrastruktur vorbehalten war. Im Juli antwortete OpenAI mit der GPT-5.6-Familie und legte im August ein Update nach, das per Regler steuert, wie viel Denkaufwand das Modell in eine Antwort investiert.",
          },
          { h2: "Die eigentliche Neuigkeit sind die Stufen" },
          {
            p: "Fable 5 und Mythos 5 teilen dasselbe Basismodell; der Unterschied liegt in der Sicherheitsschicht. Die breit verfügbare Stufe enthält Schutzmechanismen, die Dual-Use-Fähigkeiten etwa in Cybersicherheit und Biologie begrenzen (laut Anthropic in weniger als 5 % der Sitzungen ausgelöst), während die uneingeschränkte Stufe geprüften Organisationen vorbehalten bleibt. Frontier-Fähigkeiten kommen heute mit einer Zugangspolitik, und die großen Clouds (AWS Bedrock, Google Cloud, Microsoft Foundry) verteilen sie genau so.",
          },
          {
            p: "OpenAIs Effort-Regler zeigt denselben Trend von der Kostenseite: ein Modell, viele Betriebspunkte. Aus der Frage „Welches Modell nehmen wir?“ wird „Welche Stufe, mit welchem Aufwand, für welche Aufgabe?“.",
          },
          { h2: "Was das für Ihren Stack bedeutet" },
          {
            ul: [
              "Routen Sie nach Aufgabe, nicht nach Gewohnheit: Ordnen Sie jedem Workload die günstigste Stufe und den geringsten Aufwand zu, der Ihre Qualitätsschwelle besteht; Frontier-Aufrufe nur dort, wo sie nötig sind.",
              "Machen Sie Evals zum Torwächter: Bei quartalsweisen Releases ist eine Regressionssuite über Ihre eigenen Aufgaben der einzig verlässliche Weg, neue Modelle schnell und sicher zu übernehmen.",
              "Budgetieren Sie mit Effort im Blick: Aufwandssteuerung macht Kosten und Latenz zu Produktparametern, nicht zu einem Ops-Nachgedanken.",
              "Halten Sie eine dünne Abstraktionsschicht über den Anbietern: Stufen- und Gating-Politiken unterscheiden sich und ändern sich; Ihre Anwendungslogik sollte davon nichts wissen müssen.",
            ],
          },
          {
            p: "Wir bauen anbieterunabhängige LLM-Stacks mit Routing und Evaluierung ab Werk, damit die nächste Verschiebung der Frontier eine Konfigurationsänderung ist, kein Rewrite.",
          },
        ],
      },
    },
  },
  {
    slug: "ai-agents-enterprise-2026-hype-vs-numbers",
    category: "technology",
    readTime: 6,
    featured: false,
    publishedAt: "2026-08-04T09:00:00.000Z",
    gradient: "bg-gradient-to-br from-night-deep via-night to-night-soft",
    coverAlt: "Abstract bar-chart graphic contrasting AI agent adoption and failure rates",
    locales: {
      en: {
        title: "AI agents in the enterprise: what the 2026 numbers actually say",
        excerpt:
          "McKinsey counts 23% of organizations scaling agentic systems; Gartner expects over 40% of agent projects to be canceled by 2027. Both are right, and the difference between the two groups is unglamorous: scope, governance, measurement.",
        seoTitle: "Enterprise AI agents in 2026: the real numbers",
        seoDescription:
          "23% of organizations are scaling AI agents while Gartner predicts 40% of projects will be canceled. What separates agent deployments that deliver ROI from the ones that die.",
        content: [
          {
            p: "Agentic AI is past the demo phase. McKinsey finds 23% of organizations already scaling an agentic system, with another 39% experimenting. Roughly a third of enterprises have at least one agent in production, led by banking and insurance at 47%, with healthcare and the public sector trailing at 18% and 14%. Where deployments work, they work fast: the median time-to-value is around five months, and in PwC's survey 66% of adopters report measurable productivity value.",
          },
          { h2: "The other half of the ledger" },
          {
            p: "The same research cycle produced a harder number: Gartner projects that over 40% of agentic AI projects will be canceled by the end of 2027, citing weak governance, unclear ROI and runaway costs. IBM's CEO study rhymes with it: only about a quarter of AI initiatives delivered the ROI that was expected of them. Adoption is real; so is the failure rate.",
          },
          { h2: "What the successful third does differently" },
          {
            ul: [
              "They pick narrow, measurable workflows (one process with a clear baseline) instead of an 'AI transformation' with no denominator.",
              "They keep a human in the loop where the cost of an error exceeds the cost of a review, and automate the rest aggressively.",
              "They treat governance as engineering: permissions, audit logs, spend caps and kill switches are built in before scale, not after the first incident.",
              "They measure cost-per-task against the human baseline from week one, so the ROI conversation is arithmetic, not faith.",
            ],
          },
          {
            p: "Our agent projects start with a two-week scoping sprint that produces exactly those things: the workflow, the baseline, the guardrails and a go/no-go number. It's the least exciting part of agentic AI, and the reason the deployment survives 2027.",
          },
        ],
      },
      pl: {
        title: "Agenty AI w firmach: co naprawdę mówią liczby z 2026 roku",
        excerpt:
          "McKinsey liczy 23% organizacji skalujących systemy agentowe; Gartner spodziewa się anulowania ponad 40% projektów do 2027. Obie prognozy są prawdziwe, a różnica między tymi grupami jest mało efektowna: zakres, ład i pomiar.",
        seoTitle: "Agenty AI w firmach 2026: prawdziwe liczby",
        seoDescription:
          "23% organizacji skaluje agenty AI, a Gartner przewiduje anulowanie 40% projektów. Co odróżnia wdrożenia agentów, które dowożą ROI, od tych, które umierają.",
        content: [
          {
            p: "Agentowa AI wyszła z fazy demo. Według McKinsey 23% organizacji już skaluje system agentowy, a kolejne 39% eksperymentuje. Mniej więcej jedna trzecia przedsiębiorstw ma co najmniej jednego agenta na produkcji; prowadzą banki i ubezpieczyciele z 47%, a ochrona zdrowia i sektor publiczny zamykają stawkę z 18% i 14%. Tam, gdzie wdrożenia działają, działają szybko: mediana czasu do wartości to około pięć miesięcy, a w badaniu PwC 66% wdrażających deklaruje mierzalny wzrost produktywności.",
          },
          { h2: "Druga strona bilansu" },
          {
            p: "Ten sam cykl badań przyniósł twardszą liczbę: Gartner prognozuje, że ponad 40% projektów agentowych zostanie anulowanych do końca 2027 roku z powodu słabego ładu, niejasnego ROI i wymykających się spod kontroli kosztów. Badanie CEO od IBM rymuje się z tym wynikiem: tylko około jedna czwarta inicjatyw AI dowiozła oczekiwany zwrot. Adopcja jest realna, wskaźnik porażek też.",
          },
          { h2: "Co skuteczna jedna trzecia robi inaczej" },
          {
            ul: [
              "Wybiera wąskie, mierzalne procesy (jeden przepływ z jasną linią bazową) zamiast „transformacji AI” bez mianownika.",
              "Zostawia człowieka w pętli tam, gdzie koszt błędu przewyższa koszt weryfikacji, a resztę automatyzuje odważnie.",
              "Traktuje ład jak inżynierię: uprawnienia, logi audytowe, limity wydatków i wyłączniki awaryjne powstają przed skalowaniem, nie po pierwszym incydencie.",
              "Mierzy koszt na zadanie względem ludzkiej linii bazowej od pierwszego tygodnia; rozmowa o ROI jest wtedy arytmetyką, nie wiarą.",
            ],
          },
          {
            p: "Nasze projekty agentowe zaczynają się od dwutygodniowego sprintu zakresowego, który dostarcza dokładnie to: proces, linię bazową, zabezpieczenia i liczbę go/no-go. To najmniej ekscytująca część agentowej AI i zarazem powód, dla którego wdrożenie przetrwa rok 2027.",
          },
        ],
      },
      de: {
        title: "KI-Agenten im Unternehmen: Was die Zahlen von 2026 wirklich sagen",
        excerpt:
          "McKinsey zählt 23 % der Organisationen, die agentische Systeme skalieren; Gartner erwartet, dass über 40 % der Agentenprojekte bis 2027 eingestellt werden. Beides stimmt, und der Unterschied ist unspektakulär: Scope, Governance, Messung.",
        seoTitle: "KI-Agenten im Unternehmen 2026: die echten Zahlen",
        seoDescription:
          "23 % der Organisationen skalieren KI-Agenten, Gartner erwartet 40 % Projektabbrüche. Was erfolgreiche Agenten-Deployments von den gescheiterten unterscheidet.",
        content: [
          {
            p: "Agentische KI hat die Demo-Phase hinter sich. McKinsey zufolge skalieren bereits 23 % der Organisationen ein agentisches System, weitere 39 % experimentieren. Rund ein Drittel der Unternehmen hat mindestens einen Agenten produktiv, angeführt von Banken und Versicherungen mit 47 %, während Gesundheitswesen und öffentlicher Sektor mit 18 % und 14 % zurückliegen. Wo Deployments funktionieren, funktionieren sie schnell: Die mediane Time-to-Value liegt bei etwa fünf Monaten, und in der PwC-Umfrage berichten 66 % der Anwender von messbarem Produktivitätsgewinn.",
          },
          { h2: "Die andere Seite der Bilanz" },
          {
            p: "Derselbe Forschungszyklus lieferte eine härtere Zahl: Gartner prognostiziert, dass über 40 % der agentischen KI-Projekte bis Ende 2027 eingestellt werden, wegen schwacher Governance, unklarem ROI und ausufernden Kosten. IBMs CEO-Studie passt dazu: Nur rund ein Viertel der KI-Initiativen erreichte den erwarteten Return. Die Adoption ist real, die Abbruchquote auch.",
          },
          { h2: "Was das erfolgreiche Drittel anders macht" },
          {
            ul: [
              "Es wählt enge, messbare Workflows (einen Prozess mit klarer Baseline) statt einer 'KI-Transformation' ohne Nenner.",
              "Es hält den Menschen dort in der Schleife, wo die Fehlerkosten die Prüfkosten übersteigen, und automatisiert den Rest konsequent.",
              "Es behandelt Governance als Engineering: Berechtigungen, Audit-Logs, Kostenlimits und Notausschalter entstehen vor der Skalierung, nicht nach dem ersten Vorfall.",
              "Es misst die Kosten pro Aufgabe gegen die menschliche Baseline ab Woche eins; die ROI-Diskussion wird damit Arithmetik statt Glaubenssache.",
            ],
          },
          {
            p: "Unsere Agentenprojekte beginnen mit einem zweiwöchigen Scoping-Sprint, der genau das liefert: den Workflow, die Baseline, die Leitplanken und eine Go/No-go-Zahl. Es ist der unspektakulärste Teil agentischer KI und der Grund, warum das Deployment das Jahr 2027 übersteht.",
          },
        ],
      },
    },
  },
  {
    slug: "ai-coding-paradox-faster-developers-flat-delivery",
    category: "development",
    readTime: 5,
    featured: false,
    publishedAt: "2026-07-28T09:00:00.000Z",
    gradient: "bg-gradient-to-br from-night via-night-deep to-night-soft",
    coverAlt: "Abstract code-lines graphic showing rising individual output and a flat delivery line",
    locales: {
      en: {
        title: "The AI coding paradox: faster developers, flat delivery",
        excerpt:
          "Ninety percent of developers now code with AI and most report real productivity gains, yet organizational delivery metrics barely move. The bottleneck was never typing speed.",
        seoTitle: "The AI coding paradox in 2026",
        seoDescription:
          "Developers are dramatically faster with AI, but delivery metrics stay flat while refactoring collapses and copy-paste rises. How engineering discipline turns AI speed into shipped software.",
        content: [
          {
            p: "AI-assisted development is no longer a minority sport: around 90% of professional developers use AI tools, spending a median of two hours a day working with them, and the DORA research program's latest report finds more than 80% saying AI has enhanced their productivity. At the individual level the effect is dramatic: studies measure roughly 21% more tasks completed and nearly twice as many pull requests merged.",
          },
          { h2: "Where the speed goes" },
          {
            p: "Zoom out to the organization and the picture flattens: delivery metrics for whole teams often barely move. The code-quality data hints at why. Copy-pasted code has climbed from 8.3% to over 12% of changed lines, while refactoring has collapsed from roughly a quarter of all changes to under 10%. Meanwhile reliability is the top production concern for over half of enterprise decision-makers. Generation got faster; review, integration, testing and trust did not. Left unattended, AI throughput converts into review queues and technical debt rather than shipped features.",
          },
          { h2: "Discipline is the multiplier" },
          {
            ul: [
              "Hold the review bar and resource it: if PR volume doubles, review capacity and tooling have to double with it, or quality silently pays the bill.",
              "Let tests and CI gates be the arbiter: AI-written code merges on the same evidence as human-written code, ideally with the tests generated and hardened first.",
              "Schedule refactoring on purpose: the data says it won't happen by default anymore, so make it an explicit, recurring line item.",
              "Instrument delivery, not activity: measure lead time, change-failure rate and time-to-restore, and judge AI adoption by those, not by tasks completed.",
            ],
          },
          {
            p: "This is the gap where we spend most of our engineering-advisory time: wiring AI acceleration into a delivery system (reviews, tests, observability) so the speed reaches production instead of piling up in front of it.",
          },
        ],
      },
      pl: {
        title: "Paradoks kodowania z AI: szybsi programiści, płaskie dowożenie",
        excerpt:
          "Dziewięćdziesiąt procent programistów koduje dziś z AI i większość zgłasza realny wzrost produktywności, a metryki dostarczania w organizacjach ledwie drgają. Wąskim gardłem nigdy nie była szybkość pisania.",
        seoTitle: "Paradoks kodowania z AI w 2026",
        seoDescription:
          "Programiści są z AI znacznie szybsi, ale metryki dostarczania stoją w miejscu, refaktoryzacja zanika, a copy-paste rośnie. Jak dyscyplina inżynierska zamienia prędkość AI w wydane oprogramowanie.",
        content: [
          {
            p: "Programowanie wspierane przez AI nie jest już sportem mniejszości: około 90% zawodowych programistów używa narzędzi AI, spędzając z nimi medianowo dwie godziny dziennie, a najnowszy raport programu badawczego DORA pokazuje, że ponad 80% deklaruje wzrost produktywności. Na poziomie jednostki efekt jest spektakularny: badania mierzą około 21% więcej ukończonych zadań i niemal dwukrotnie więcej scalonych pull requestów.",
          },
          { h2: "Gdzie znika ta prędkość" },
          {
            p: "Po oddaleniu obrazu do skali organizacji wykres się spłaszcza: metryki dostarczania całych zespołów często ledwie drgają. Dane o jakości kodu podpowiadają dlaczego. Udział kodu kopiowanego wzrósł z 8,3% do ponad 12% zmienianych linii, a refaktoryzacja zapadła się z około jednej czwartej wszystkich zmian do poniżej 10%. Jednocześnie niezawodność to najczęstszy produkcyjny problem według ponad połowy decydentów. Generowanie przyspieszyło; przeglądy, integracja, testy i zaufanie nie. Pozostawiona sama sobie przepustowość AI zamienia się w kolejki do code review i dług techniczny, a nie w wydane funkcje.",
          },
          { h2: "Mnożnikiem jest dyscyplina" },
          {
            ul: [
              "Utrzymaj poprzeczkę code review i zabezpiecz na nie zasoby: jeśli liczba PR-ów się podwaja, przepustowość przeglądów i narzędzia muszą podwoić się razem z nią; inaczej rachunek po cichu płaci jakość.",
              "Niech sędzią będą testy i bramki CI: kod pisany przez AI scala się na tych samych dowodach co ludzki, najlepiej z testami generowanymi i utwardzanymi w pierwszej kolejności.",
              "Planuj refaktoryzację celowo: dane mówią, że sama z siebie już się nie wydarzy, więc uczyń z niej jawną, cykliczną pozycję.",
              "Mierz dostarczanie, nie aktywność: lead time, wskaźnik nieudanych zmian i czas przywrócenia; po nich oceniaj adopcję AI, nie po liczbie zadań.",
            ],
          },
          {
            p: "To właśnie luka, w której spędzamy większość czasu doradczego: wpinanie przyspieszenia AI w system dostarczania (przeglądy, testy, obserwowalność) tak, by prędkość docierała na produkcję, zamiast piętrzyć się przed nią.",
          },
        ],
      },
      de: {
        title: "Das KI-Coding-Paradox: schnellere Entwickler, flache Delivery",
        excerpt:
          "Neunzig Prozent der Entwickler programmieren inzwischen mit KI, die meisten berichten echte Produktivitätsgewinne, doch die Delivery-Metriken der Organisationen bewegen sich kaum. Der Engpass war nie die Tippgeschwindigkeit.",
        seoTitle: "Das KI-Coding-Paradox 2026",
        seoDescription:
          "Entwickler sind mit KI deutlich schneller, doch Delivery-Metriken stagnieren, Refactoring bricht ein, Copy-Paste steigt. Wie Engineering-Disziplin KI-Tempo in ausgelieferte Software verwandelt.",
        content: [
          {
            p: "KI-gestützte Entwicklung ist kein Minderheitensport mehr: Rund 90 % der professionellen Entwickler nutzen KI-Werkzeuge, im Median zwei Stunden täglich, und der jüngste Bericht des DORA-Forschungsprogramms zeigt, dass über 80 % von gesteigerter Produktivität sprechen. Auf individueller Ebene ist der Effekt dramatisch: Studien messen etwa 21 % mehr erledigte Aufgaben und fast doppelt so viele gemergte Pull Requests.",
          },
          { h2: "Wohin das Tempo verschwindet" },
          {
            p: "Auf Organisationsebene flacht das Bild ab: Die Delivery-Metriken ganzer Teams bewegen sich oft kaum. Die Codequalitätsdaten deuten an, warum. Der Anteil kopierten Codes stieg von 8,3 % auf über 12 % der geänderten Zeilen, während Refactoring von rund einem Viertel aller Änderungen auf unter 10 % einbrach. Zugleich nennt über die Hälfte der Entscheider Zuverlässigkeit als größtes Produktionsproblem. Die Generierung wurde schneller; Review, Integration, Tests und Vertrauen nicht. Sich selbst überlassen wird KI-Durchsatz zu Review-Warteschlangen und technischen Schulden statt zu ausgelieferten Features.",
          },
          { h2: "Disziplin ist der Multiplikator" },
          {
            ul: [
              "Halten Sie die Review-Messlatte und statten Sie sie aus: Verdoppelt sich das PR-Volumen, müssen Review-Kapazität und Tooling mitwachsen; sonst zahlt still die Qualität.",
              "Lassen Sie Tests und CI-Gates entscheiden: KI-geschriebener Code merged auf denselben Nachweisen wie menschlicher, idealerweise mit zuerst erzeugten und gehärteten Tests.",
              "Planen Sie Refactoring bewusst ein: Die Daten zeigen, dass es von allein nicht mehr passiert; machen Sie es zum expliziten, wiederkehrenden Posten.",
              "Instrumentieren Sie Delivery statt Aktivität: Lead Time, Change-Failure-Rate und Time-to-Restore; bewerten Sie die KI-Adoption daran, nicht an erledigten Tasks.",
            ],
          },
          {
            p: "Genau in dieser Lücke verbringen wir die meiste Beratungszeit: KI-Beschleunigung in ein Delivery-System einbauen (Reviews, Tests, Observability), damit das Tempo die Produktion erreicht, statt sich davor zu stauen.",
          },
        ],
      },
    },
  },
  {
    slug: "what-is-a-forward-deployed-engineer",
    category: "business",
    readTime: 6,
    featured: false,
    publishedAt: "2026-09-03T09:00:00.000Z",
    gradient: "bg-gradient-to-br from-night-soft via-night-deep to-night",
    coverAlt: "Abstract graphic of one filled marker inside a ring of outlined markers",
    locales: {
      en: {
        title: "What is a forward deployed engineer?",
        excerpt:
          "A forward deployed engineer is a senior engineer who works inside your company instead of at arm's length from it. Where the term came from, what the person actually does, and when it is the wrong thing to buy.",
        seoTitle: "What is a forward deployed engineer?",
        seoDescription:
          "A plain-language explanation of the forward deployed engineer model: where the term came from, what the role does day to day, when it fits, and when a fixed scope project fits better.",
        content: [
          {
            p: "“Forward deployed engineer” is a job title that has started appearing in places where companies buy software. It sounds like jargon, and half of it is: “forward deployed” is borrowed from the military, where it means stationed close to where the work happens rather than back at headquarters. Strip the borrowed half away and what is left is simple. A forward deployed engineer is a senior engineer who works inside your company, on your problem, instead of at arm's length from it.",
          },
          {
            p: "The distinction matters more than it sounds. Most technical work you buy arrives in one of two shapes. Either you buy a document, where somebody studies your business and hands back a recommendation, or you buy a project, where somebody takes a written specification away and returns with software built to it. Both shapes assume that the hard part is doing the work, and that the question was already clear before anyone started. In a lot of AI work, that assumption is simply wrong. The hard part is finding out what the system actually has to handle, and you find that out by running something against last month's real cases, not by writing a longer specification.",
          },
          {
            p: "The forward deployed model is the answer to that. Instead of receiving a specification, the engineer sits where the work is done, watches one full cycle of it, agrees on a single outcome with somebody who can say yes, and then builds towards it, changing course as the real cases teach them what they missed. They are accountable for the result rather than for a list of tickets. When it works, the difference a client notices is not the technology. It is that nobody is waiting for anybody else to write something down.",
          },
          { h2: "Where the title came from" },
          {
            p: "The title was popularised by Palantir, an American software company that has used it publicly on its own careers pages for years, for engineers sent to work on site with customers rather than building a product at a distance from them. The pattern spread. AI labs and enterprise software companies now publicly advertise roles under this title or a close variant, because what they sell has to be shaped around each customer's data and process before it is worth anything.",
          },
          {
            p: "There is an honest reason the model exists. General purpose systems solve the general part of a problem and then stop. The value left over is locked inside one company's own mess: the exceptions, the local rules, the spreadsheet somebody maintains by hand, the three systems that describe the same customer differently. No amount of product work at a distance unlocks that. The only way in is to send somebody into the mess.",
          },
          { h2: "What the person actually does" },
          {
            p: "The first two months look much the same wherever the model works. Week one is spent watching the work being done and getting access to the systems it touches, and it ends with one page saying what the outcome is and how it will be measured. A good forward deployed engineer spends more of that week asking questions than writing code, and that is not a delay: it decides whether the rest of the work is aimed at anything.",
          },
          {
            ul: [
              "Week one: watch one full cycle of the work, get access, and agree one page on the outcome and the measure.",
              "Week two: something narrow runs on the real data, in front of the people whose job it changes.",
              "After that: the errors it makes are the specification for the rest of the work.",
              "Around month two: in production, with a human override, documented so the team can run it alone.",
            ],
          },
          { h2: "How it is different from the things you already buy" },
          {
            p: "A consultancy leaves a document. That is the right purchase when the decision is the bottleneck. It is the wrong purchase when everybody already agrees what should happen and nothing is happening. A forward deployed engineer leaves a running system instead, which is worth less than a document if the decision was the hard part, and a great deal more if it was not.",
          },
          {
            p: "Contractors and staff augmentation sell capacity. Somebody on your side writes the tickets and carries the risk of asking for the wrong thing, and the supplier is judged on whether the tickets closed. A forward deployed engineer is judged on whether the process got faster or cheaper, and helps decide what gets built.",
          },
          {
            p: "A fixed scope project needs the answer to be knowable before the work starts. When it is, take the fixed scope: it is cheaper and the risk of a wrong estimate sits with the supplier. When it is not, a fixed price is either padded to cover the unknown, which makes it expensive, or held to the letter, which delivers what was written and nothing anybody needed.",
          },
          { h2: "When it is the right choice" },
          {
            ul: [
              "You can name the process that costs the most hours but not the fix, and nobody in house could build it.",
              "Somebody delivered a strategy document about your AI opportunities and nothing has run since.",
              "Hiring would take months, and it is not yet clear the work justifies a permanent role.",
              "The exceptions in your process are the hard part, so any scope written today would be a guess.",
            ],
          },
          {
            p: "All four have the same shape: the question is still open. Where the question is open, buying an outcome beats buying a plan or a pair of hands.",
          },
          { h2: "When it is not" },
          {
            ul: [
              "You already know exactly what to build. Buy the build: it is cheaper and the risk sits with the supplier.",
              "Nobody on your side can decide inside a week. The model runs on a fast yes or no, and without one the engineer stalls while you pay for the stall.",
              "Access to your data and systems will take three months of approvals. The clock starts anyway.",
              "What you need is more hands on a backlog that already exists. That is staff augmentation, a different and cheaper product.",
            ],
          },
          {
            p: "A supplier who never tells you that one of those applies is selling you something. The question is not whether they do forward deployed engineering. It is what they would talk you out of.",
          },
          { h2: "What to ask before you agree to one" },
          {
            ul: [
              "Who exactly is being embedded, and can I speak to that person before signing anything?",
              "What will be written down at the end of week one, and how will the outcome be measured?",
              "What will be running on real production data at the end of week two?",
              "Where does the code live, and who owns it if the engagement ends early?",
              "What is the notice period, and is there an exit fee?",
            ],
          },
          {
            p: "At Pluscode we work this way because it is the only way we have found to get a result out of the messy, specific, half documented processes that real companies run on. If you can name the job that costs your team the most hours, we will spend thirty minutes on it with the engineer who would do the work, and tell you honestly whether this is the right way to do it or whether something smaller and cheaper would be enough. That conversation costs nothing and does not commit you to anything.",
          },
        ],
      },
      pl: {
        title: "Kim jest forward deployed engineer?",
        excerpt:
          "Forward deployed engineer to doświadczony inżynier, który pracuje wewnątrz Twojej firmy, a nie z dystansu. Skąd wzięła się ta nazwa, czym taka osoba naprawdę się zajmuje i kiedy nie warto jej kupować.",
        seoTitle: "Kim jest forward deployed engineer?",
        seoDescription:
          "Proste wyjaśnienie modelu forward deployed engineer: skąd wzięła się nazwa, czym taka osoba zajmuje się na co dzień, kiedy to dobry wybór, a kiedy lepszy jest projekt o stałym zakresie.",
        content: [
          {
            p: "„Forward deployed engineer” to nazwa stanowiska, która zaczęła się pojawiać wszędzie tam, gdzie firmy kupują oprogramowanie. Brzmi jak żargon i w połowie nim jest: „forward deployed” pochodzi z wojska, gdzie oznacza rozmieszczenie blisko miejsca działań, a nie w kwaterze głównej. Jeśli odłożyć tę pożyczoną połowę, zostaje coś prostego. Forward deployed engineer to doświadczony inżynier, który pracuje wewnątrz Twojej firmy, przy Twoim problemie, zamiast patrzeć na niego z dystansu.",
          },
          {
            p: "Ta różnica znaczy więcej, niż się wydaje. Prace techniczne, które kupujesz, mają zwykle jeden z dwóch kształtów. Albo kupujesz dokument, w którym ktoś bada Twoją firmę i oddaje rekomendację, albo kupujesz projekt, w którym ktoś zabiera spisaną specyfikację i wraca z gotowym oprogramowaniem. Oba kształty zakładają, że trudną częścią jest wykonanie pracy, a pytanie było jasne, zanim ktokolwiek zaczął. W wielu projektach z AI to założenie jest po prostu błędne. Trudną częścią jest ustalenie, co system naprawdę musi obsłużyć, a dowiadujesz się tego, uruchamiając coś na prawdziwych sprawach z zeszłego miesiąca, a nie pisząc dłuższą specyfikację.",
          },
          {
            p: "Model forward deployed jest odpowiedzią na ten problem. Zamiast dostać specyfikację, inżynier siada tam, gdzie wykonywana jest praca, obserwuje jeden pełny cykl, ustala jeden wynik z osobą, która może powiedzieć „tak”, i buduje w jego stronę, zmieniając kurs, gdy prawdziwe przypadki pokazują, czego nie przewidział. Odpowiada za rezultat, a nie za listę zadań. Kiedy to działa, klient zauważa różnicę nie w technologii. Zauważa, że nikt nie czeka, aż ktoś inny coś spisze.",
          },
          { h2: "Skąd wzięła się ta nazwa" },
          {
            p: "Nazwę spopularyzował Palantir, amerykańska firma software'owa, która od lat publicznie używa jej na własnych stronach z ofertami pracy: opisuje tak inżynierów wysyłanych do pracy u klienta, zamiast budowania produktu na dystans. Wzorzec się rozszedł. Laboratoria AI i dostawcy oprogramowania dla firm publicznie rekrutują dziś na stanowiska o tej lub bardzo zbliżonej nazwie, bo to, co sprzedają, trzeba dopasować do danych i procesów każdego klienta, zanim zacznie być cokolwiek warte.",
          },
          {
            p: "Jest szczery powód, dla którego ten model istnieje. Systemy ogólnego przeznaczenia rozwiązują ogólną część problemu, a potem się zatrzymują. Wartość, która zostaje, jest zamknięta w bałaganie konkretnej firmy: w wyjątkach, w lokalnych zasadach, w arkuszu, który ktoś prowadzi ręcznie, w trzech systemach opisujących tego samego klienta inaczej. Żadna ilość pracy nad produktem z dystansu tego nie odblokuje. Jedyne wejście prowadzi przez wysłanie kogoś w ten bałagan.",
          },
          { h2: "Czym taka osoba naprawdę się zajmuje" },
          {
            p: "Pierwsze dwa miesiące wyglądają podobnie wszędzie tam, gdzie ten model działa. Pierwszy tydzień to obserwowanie pracy i uzyskanie dostępu do systemów, których ona dotyka, a kończy się jedną stroną opisu: jaki jest wynik i jak będzie mierzony. Dobry forward deployed engineer spędza w tym tygodniu więcej czasu na pytaniach niż na pisaniu kodu i to nie jest opóźnienie: to od tego zależy, czy reszta pracy jest w cokolwiek wycelowana.",
          },
          {
            ul: [
              "Tydzień pierwszy: obserwacja jednego pełnego cyklu pracy, dostępy i jedna strona z opisem wyniku oraz miary.",
              "Tydzień drugi: coś wąskiego działa na prawdziwych danych, na oczach ludzi, których pracy to dotyczy.",
              "Potem: błędy, które popełnia, są specyfikacją dla reszty pracy.",
              "Około drugiego miesiąca: produkcja, nadzór człowieka i dokumentacja, dzięki której zespół prowadzi to sam.",
            ],
          },
          { h2: "Czym to się różni od tego, co już kupujesz" },
          {
            p: "Firma doradcza zostawia dokument. To dobry zakup, kiedy wąskim gardłem jest decyzja. To zły zakup, kiedy wszyscy już się zgadzają, co powinno się wydarzyć, a nic się nie dzieje. Forward deployed engineer zostawia zamiast tego działający system, co jest mniej warte niż dokument, jeśli trudną częścią była decyzja, i dużo więcej warte, jeśli nie była.",
          },
          {
            p: "Kontraktorzy i outsourcing zespołów sprzedają moce przerobowe. Ktoś po Twojej stronie pisze zadania i bierze na siebie ryzyko, że poprosi o niewłaściwą rzecz, a dostawcę ocenia się po tym, czy zadania zostały zamknięte. Forward deployed engineer jest oceniany po tym, czy proces stał się szybszy albo tańszy, i współdecyduje o tym, co powstaje.",
          },
          {
            p: "Projekt o stałym zakresie wymaga, żeby odpowiedź była znana przed startem. Kiedy jest, wybierz stały zakres: jest tańszy, a ryzyko błędnej wyceny bierze na siebie dostawca. Kiedy nie jest, stała cena albo zostanie zawyżona na zapas, co czyni ją drogą, albo będzie egzekwowana co do litery, co daje dokładnie to, co spisano, i nic, czego ktokolwiek potrzebował.",
          },
          { h2: "Kiedy to dobry wybór" },
          {
            ul: [
              "Umiesz wskazać proces, który kosztuje Twój zespół najwięcej godzin, ale nie wiesz, jak go naprawić, i nikt u Ciebie tego nie zbuduje.",
              "Ktoś dostarczył dokument o szansach na AI w Twojej firmie i od tego czasu nic nie ruszyło.",
              "Rekrutacja zajęłaby miesiące, a nie jest jeszcze pewne, czy ta praca uzasadnia etat.",
              "Trudną częścią procesu są wyjątki, więc każdy zakres spisany dzisiaj byłby zgadywaniem.",
            ],
          },
          {
            p: "Te cztery przypadki łączy jedno: pytanie wciąż jest otwarte. Kiedy pytanie jest otwarte, kupowanie wyniku wygrywa z kupowaniem planu albo pary rąk.",
          },
          { h2: "Kiedy to zły wybór" },
          {
            ul: [
              "Wiesz dokładnie, co ma powstać. Kup wykonanie: jest tańsze, a ryzyko bierze dostawca.",
              "Nikt po Twojej stronie nie podejmie decyzji w tydzień. Ten model żyje szybkim „tak” albo „nie”, a bez tego inżynier stoi, a Ty płacisz za ten postój.",
              "Dostęp do danych i systemów zajmie trzy miesiące zgód. Zegar i tak tyka.",
              "Naprawdę potrzebujesz więcej rąk do istniejącego backlogu. To outsourcing zespołu, inny i tańszy produkt.",
            ],
          },
          {
            p: "Dostawca, który nigdy nie powie Ci, że jeden z tych punktów dotyczy właśnie Ciebie, coś Ci sprzedaje. Nie pytaj, czy robi forward deployed engineering. Pytaj, od czego by Cię odwiódł.",
          },
          { h2: "O co zapytać, zanim się zgodzisz" },
          {
            ul: [
              "Kto dokładnie wejdzie do zespołu i czy mogę z tą osobą porozmawiać przed podpisaniem czegokolwiek?",
              "Co zostanie spisane na koniec pierwszego tygodnia i jak będzie mierzony wynik?",
              "Co będzie działać na prawdziwych danych produkcyjnych na koniec drugiego tygodnia?",
              "Gdzie mieszka kod i do kogo należy, jeśli współpraca skończy się wcześniej?",
              "Jaki jest okres wypowiedzenia i czy jest opłata za wyjście?",
            ],
          },
          {
            p: "W Pluscode pracujemy w ten sposób, bo to jedyny znany nam sposób, żeby wyciągnąć wynik z tych zabałaganionych, konkretnych i w połowie opisanych procesów, na których stoją prawdziwe firmy. Jeśli umiesz nazwać zadanie, które kosztuje Twój zespół najwięcej godzin, poświęcimy mu trzydzieści minut z inżynierem, który wykonałby tę pracę, i powiemy szczerze, czy to właściwa droga, czy wystarczy coś mniejszego i tańszego. Ta rozmowa nic nie kosztuje i do niczego nie zobowiązuje.",
          },
        ],
      },
      de: {
        title: "Was ist ein Forward Deployed Engineer?",
        excerpt:
          "Ein Forward Deployed Engineer ist ein erfahrener Engineer, der in Ihrem Unternehmen arbeitet statt auf Distanz. Woher der Begriff kommt, was die Person tatsächlich tut und wann man sie besser nicht einkauft.",
        seoTitle: "Was ist ein Forward Deployed Engineer?",
        seoDescription:
          "Eine verständliche Erklärung des Forward-Deployed-Engineer-Modells: Woher der Begriff kommt, was die Rolle täglich tut, wann sie passt und wann ein Projekt mit festem Umfang besser passt.",
        content: [
          {
            p: "„Forward Deployed Engineer“ ist eine Berufsbezeichnung, die überall dort auftaucht, wo Unternehmen Software einkaufen. Sie klingt nach Jargon, und zur Hälfte ist sie das auch: „forward deployed“ stammt aus dem Militär und bedeutet dort, nah am Geschehen stationiert zu sein statt im Hauptquartier. Lässt man die geliehene Hälfte weg, bleibt etwas Einfaches übrig. Ein Forward Deployed Engineer ist ein erfahrener Engineer, der in Ihrem Unternehmen und an Ihrem Problem arbeitet, statt es aus der Distanz zu betrachten.",
          },
          {
            p: "Der Unterschied wiegt schwerer, als er klingt. Technische Arbeit, die Sie einkaufen, kommt meist in einer von zwei Formen. Entweder Sie kaufen ein Dokument, in dem jemand Ihr Unternehmen untersucht und eine Empfehlung zurückgibt, oder Sie kaufen ein Projekt, bei dem jemand eine geschriebene Spezifikation mitnimmt und fertige Software zurückbringt. Beide Formen setzen voraus, dass die Ausführung das Schwierige ist und die Frage schon geklärt war, bevor jemand angefangen hat. Bei vieler KI-Arbeit stimmt diese Annahme schlicht nicht. Das Schwierige ist herauszufinden, was das System tatsächlich abdecken muss, und das erfährt man, indem man etwas gegen die echten Fälle des letzten Monats laufen lässt, nicht indem man eine längere Spezifikation schreibt.",
          },
          {
            p: "Das Forward-Deployed-Modell ist die Antwort darauf. Statt eine Spezifikation zu bekommen, setzt sich der Engineer dorthin, wo die Arbeit passiert, sieht einen vollständigen Durchlauf, vereinbart mit jemandem, der Ja sagen kann, ein einziges Ergebnis, und baut darauf zu, während die echten Fälle zeigen, was übersehen wurde. Verantwortlich ist er für das Ergebnis, nicht für eine Ticketliste. Wenn es funktioniert, merkt der Kunde den Unterschied nicht an der Technik. Er merkt ihn daran, dass niemand darauf wartet, dass jemand anderes etwas aufschreibt.",
          },
          { h2: "Woher der Titel kommt" },
          {
            p: "Bekannt gemacht hat den Titel Palantir, ein amerikanisches Softwareunternehmen, das ihn seit Jahren öffentlich auf den eigenen Karriereseiten verwendet: für Engineers, die vor Ort beim Kunden arbeiten, statt aus der Ferne ein Produkt zu bauen. Das Muster hat sich verbreitet. KI-Labore und Anbieter von Unternehmenssoftware schreiben heute öffentlich Stellen unter diesem oder einem sehr ähnlichen Titel aus, weil das, was sie verkaufen, erst auf die Daten und Abläufe jedes Kunden zugeschnitten werden muss, bevor es etwas taugt.",
          },
          {
            p: "Es gibt einen ehrlichen Grund für dieses Modell. Allzwecksysteme lösen den allgemeinen Teil eines Problems und bleiben dann stehen. Der Wert, der übrig bleibt, steckt im Durcheinander des einzelnen Unternehmens: in den Ausnahmen, den hausgemachten Regeln, der Tabelle, die jemand von Hand pflegt, den drei Systemen, die denselben Kunden unterschiedlich führen. Kein Maß an Produktarbeit aus der Distanz holt das heraus. Der einzige Weg hinein führt darüber, jemanden in dieses Durcheinander zu schicken.",
          },
          { h2: "Was die Person tatsächlich tut" },
          {
            p: "Die ersten zwei Monate sehen überall ähnlich aus, wo das Modell funktioniert. Die erste Woche vergeht damit, der Arbeit zuzusehen und Zugang zu den Systemen zu bekommen, die sie berührt, und sie endet mit einer Seite, auf der steht, was das Ergebnis ist und wie es gemessen wird. Ein guter Forward Deployed Engineer verbringt diese Woche mehr mit Fragen als mit Code, und das ist keine Verzögerung: Davon hängt ab, ob die restliche Arbeit überhaupt auf etwas zielt.",
          },
          {
            ul: [
              "Woche eins: einen vollständigen Durchlauf der Arbeit ansehen, Zugänge bekommen, eine Seite zu Ergebnis und Messung vereinbaren.",
              "Woche zwei: etwas Schmales läuft auf den echten Daten, vor den Leuten, deren Arbeit es verändert.",
              "Danach: die Fehler, die es macht, sind die Spezifikation für den Rest der Arbeit.",
              "Um Monat zwei: im Betrieb, mit menschlicher Übersteuerung und dokumentiert, damit das Team allein weitermacht.",
            ],
          },
          { h2: "Wie es sich von dem unterscheidet, was Sie schon einkaufen" },
          {
            p: "Eine Beratung hinterlässt ein Dokument. Das ist der richtige Einkauf, wenn die Entscheidung der Engpass ist. Es ist der falsche Einkauf, wenn sich alle längst einig sind, was passieren soll, und trotzdem nichts passiert. Ein Forward Deployed Engineer hinterlässt stattdessen ein laufendes System, was weniger wert ist als ein Dokument, falls die Entscheidung das Schwierige war, und deutlich mehr wert, falls nicht.",
          },
          {
            p: "Dienstleister und Personalaufstockung verkaufen Kapazität. Jemand auf Ihrer Seite schreibt die Tickets und trägt das Risiko, das Falsche zu bestellen, und der Anbieter wird daran gemessen, ob die Tickets geschlossen wurden. Ein Forward Deployed Engineer wird daran gemessen, ob der Prozess schneller oder günstiger geworden ist, und entscheidet mit, was gebaut wird.",
          },
          {
            p: "Ein Projekt mit festem Umfang setzt voraus, dass die Antwort vor dem Start bekannt ist. Wenn sie es ist, nehmen Sie den festen Umfang: Er ist günstiger, und das Risiko einer falschen Schätzung liegt beim Anbieter. Wenn sie es nicht ist, wird ein Festpreis entweder mit Puffer aufgeblasen, was ihn teuer macht, oder buchstabengetreu durchgezogen, was genau das liefert, was aufgeschrieben wurde, und nichts, was jemand gebraucht hätte.",
          },
          { h2: "Wann es die richtige Wahl ist" },
          {
            ul: [
              "Sie können den Prozess benennen, der die meisten Stunden kostet, aber nicht die Lösung, und im Haus kann sie niemand bauen.",
              "Jemand hat ein Strategiepapier zu Ihren KI-Chancen geliefert, und seither läuft nichts.",
              "Eine Einstellung würde Monate dauern, und es ist noch offen, ob die Arbeit eine feste Stelle rechtfertigt.",
              "Die Ausnahmen in Ihrem Prozess sind das Schwierige, also wäre jeder heute geschriebene Umfang geraten.",
            ],
          },
          {
            p: "Diese vier Fälle haben eines gemeinsam: Die Frage ist noch offen. Wo die Frage offen ist, schlägt der Einkauf eines Ergebnisses den Einkauf eines Plans oder zusätzlicher Hände.",
          },
          { h2: "Wann es die falsche Wahl ist" },
          {
            ul: [
              "Sie wissen bereits genau, was gebaut werden soll. Kaufen Sie den Bau: Das ist günstiger, und das Risiko liegt beim Anbieter.",
              "Niemand auf Ihrer Seite kann innerhalb einer Woche entscheiden. Das Modell lebt von einem schnellen Ja oder Nein, sonst steht der Engineer still und Sie zahlen für den Stillstand.",
              "Der Zugang zu Daten und Systemen dauert drei Monate Freigaben. Die Uhr läuft trotzdem.",
              "Was Sie wirklich brauchen, sind mehr Hände für ein bestehendes Backlog. Das ist Personalaufstockung, ein anderes und günstigeres Produkt.",
            ],
          },
          {
            p: "Ein Anbieter, der Ihnen nie sagt, dass einer dieser Punkte auf Sie zutrifft, verkauft Ihnen etwas. Die Frage ist nicht, ob er Forward Deployed Engineering macht. Die Frage ist, wovon er Ihnen abraten würde.",
          },
          { h2: "Was Sie fragen sollten, bevor Sie zusagen" },
          {
            ul: [
              "Wer genau kommt ins Team, und kann ich mit dieser Person sprechen, bevor ich etwas unterschreibe?",
              "Was steht am Ende der ersten Woche auf dem Papier, und wie wird das Ergebnis gemessen?",
              "Was läuft am Ende der zweiten Woche auf echten Produktivdaten?",
              "Wo liegt der Code, und wem gehört er, wenn die Zusammenarbeit früher endet?",
              "Wie lang ist die Kündigungsfrist, und gibt es eine Ausstiegsgebühr?",
            ],
          },
          {
            p: "Bei Pluscode arbeiten wir so, weil wir keinen anderen Weg gefunden haben, aus den unordentlichen, sehr spezifischen und halb dokumentierten Abläufen, auf denen echte Unternehmen laufen, ein Ergebnis zu holen. Wenn Sie die Aufgabe benennen können, die Ihr Team die meisten Stunden kostet, nehmen wir uns dreißig Minuten dafür, gemeinsam mit dem Engineer, der die Arbeit machen würde, und sagen Ihnen ehrlich, ob das der richtige Weg ist oder ob etwas Kleineres und Günstigeres reicht. Dieses Gespräch kostet nichts und verpflichtet zu nichts.",
          },
        ],
      },
    },
  },
];

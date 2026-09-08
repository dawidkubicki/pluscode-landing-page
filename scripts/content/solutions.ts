/**
 * The six solution pages, September 2026.
 *
 * ONE script writes the top level `solutions` key into en.json, pl.json and
 * de.json so the three files stay structurally identical. Run it with:
 *
 *     node --import tsx scripts/content/solutions.ts
 *
 * WHY THESE PAGES EXIST. The fullscreen Offerings menu and the footer both
 * list things a buyer might want ("Paperwork automation", "Assistants and
 * automation", "Data governance") and every one of those links used to land
 * on one of three generic /ai-data pages. A reader who clicked "Assistants
 * and automation" arrived at a page headed "Machine Learning Solutions" that
 * was not about what they clicked. These are the pages the links promised.
 *
 * HOUSE STYLE. The reader is the person who signs the invoice, not the
 * person who would build it. So: no RAG, no vector databases, no guardrails,
 * no embeddings. Say what arrives on their desk today and what arrives on it
 * afterwards. One sentence per idea. No em dashes anywhere, in any locale.
 *
 * HONESTY. Pluscode is a small AI consultancy in Poznan working across
 * Europe. EU hosting by default with a GDPR processing agreement, and the
 * EU AI Act risk tier is settled before anything is designed. No case
 * studies, client names, team sizes, certifications, awards or metrics are
 * invented here. The site states no headcount either, in any direction:
 * drop the arithmetic, keep the promise that whoever scopes the work builds
 * it. Zabka, UBS and EBM Dental are the only client names on the site and
 * they are not needed on these pages.
 *
 * This key is consumed by app/(frontend)/[lang]/components/solution-page.tsx
 * and the seven routes under app/(frontend)/[lang]/solutions/. The type below
 * mirrors `SolutionsContent` there; if one changes, change both.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Dict = Record<string, unknown>;

const DIR = resolve(process.cwd(), "dictionaries");

type Row = { title: string; body: string };
type Phase = { span: string; title: string; body: string };
type Onward = { title: string; body: string; href: string };

type SolutionPageContent = {
  label: string;
  title: string;
  intro: string;
  metaDescription: string;
  whatTitle: string;
  whatBody: string[];
  whatNote: string;
  doesTitle: string;
  doesIntro: string;
  does: Row[];
  getTitle: string;
  getIntro: string;
  get: Row[];
  stepsTitle: string;
  steps: Row[];
  whoTitle: string;
  who: Row[];
  timeTitle: string;
  timeIntro: string;
  time: Phase[];
  relatedTitle: string;
  related: Onward[];
  cta: { title: string; text: string; button: string };
};

type SolutionKey =
  | "paperworkAutomation"
  | "answersFromDocuments"
  | "assistantsAndAutomation"
  | "forecastingAndReporting"
  | "processMapping"
  | "dataGovernance";

export type SolutionsContent = {
  index: {
    label: string;
    /** The "all six" link, used by the footer and the sitemap page. */
    allLabel: string;
    title: string;
    intro: string;
    metaDescription: string;
    listTitle: string;
    listIntro: string;
    items: { key: SolutionKey; slug: string; name: string; teaser: string }[];
    startTitle: string;
    startIntro: string;
    start: Row[];
    elsewhereTitle: string;
    elsewhere: Onward[];
    cta: { title: string; text: string; button: string };
  };
  pages: Record<SolutionKey, SolutionPageContent>;
};

/* ------------------------------------------------------------------ *
 *  ENGLISH. The canonical shape; pl and de mirror it exactly.
 * ------------------------------------------------------------------ */
const en: SolutionsContent = {
  index: {
    label: "Solutions",
    allLabel: "All solutions",
    title: "Work we take off your desk",
    intro:
      "Six things companies ask us for most often. Each one starts with paperwork somebody is doing by hand today and ends with software doing it while a person checks the result.",
    metaDescription:
      "Six practical solutions from Pluscode: paperwork automation, answers from your documents, assistants, forecasting and reporting, process mapping and data governance. EU hosting by default.",
    listTitle: "Where to start",
    listIntro:
      "Most companies arrive with one of these. If two of them describe you, start with the one that hurts on a Monday morning.",
    items: [
      {
        key: "paperworkAutomation",
        slug: "paperwork-automation",
        name: "Paperwork automation",
        teaser:
          "Documents arrive, get read, get checked and land in the right system. Nobody retypes anything.",
      },
      {
        key: "answersFromDocuments",
        slug: "answers-from-documents",
        name: "Answers from your documents",
        teaser:
          "Ask a question in plain language and get an answer from your own files, with the page it came from.",
      },
      {
        key: "assistantsAndAutomation",
        slug: "assistants-and-automation",
        name: "Assistants and automation",
        teaser:
          "An assistant that does the repeated steps inside your own tools and stops for a person to approve.",
      },
      {
        key: "forecastingAndReporting",
        slug: "forecasting-and-reporting",
        name: "Forecasting and reporting",
        teaser:
          "Your numbers in one place, a monthly report that rebuilds itself, and a view of what comes next.",
      },
      {
        key: "processMapping",
        slug: "process-mapping",
        name: "Process mapping",
        teaser:
          "Two days with the people doing the work, then a costed shortlist of what is worth automating.",
      },
      {
        key: "dataGovernance",
        slug: "data-governance",
        name: "Data governance",
        teaser:
          "Where the data lives, who may see it, and what the EU AI Act says about what you are building.",
      },
    ],
    startTitle: "How an engagement starts",
    startIntro:
      "The same three steps every time, whichever of the six you pick.",
    start: [
      {
        title: "A call with an engineer",
        body: "Thirty minutes. You describe the work, we say what we would build, what we would not, and roughly how long it takes. There is no deck and no sales team to get past.",
      },
      {
        title: "One small piece, fixed",
        body: "Almost every project begins with a scoped first step: one document type, one collection of files, one report. Fixed scope, fixed fee, so the first invoice is never a surprise.",
      },
      {
        title: "A decision you can reverse",
        body: "If the first step does not pay for itself, you stop there. You keep the map, the measurements and the code either way.",
      },
    ],
    elsewhereTitle: "Not what you are looking for?",
    elsewhere: [
      {
        title: "Engineering",
        body: "Custom software, MVPs, cloud, and an engineer embedded in your team for a few months.",
        href: "/services",
      },
      {
        title: "Quanty",
        body: "Our own product, built by us: a spreadsheet that reads your documents into rows.",
        href: "/quanty",
      },
      {
        title: "Workshops",
        body: "A day with your team on one process, if you want the thinking before the project.",
        href: "/workshops",
      },
    ],
    cta: {
      title: "Tell us what the paperwork looks like",
      text: "Thirty minutes with an engineer, not a salesperson. Bring one process and we will tell you whether software should touch it at all.",
      button: "Book a call",
    },
  },
  pages: {
    /* ---------------------------------------------------------------- *
     *  1. Paperwork automation
     * ---------------------------------------------------------------- */
    paperworkAutomation: {
      label: "Solutions",
      title: "Paperwork automation",
      intro:
        "Invoices, delivery notes, orders and forms arrive all day. Software can read them, check them against your rules and put them where they belong, with a person looking only at the ones that need a person.",
      metaDescription:
        "Automate the documents that arrive every day. Pluscode builds the intake, the reading, the checks and the posting for invoices, delivery notes, orders and forms. EU hosting by default.",
      whatTitle: "What this is",
      whatBody: [
        "Every company has a desk where documents land. They come by email, by post, from a supplier portal, as a photograph of a delivery note taken in a yard. Somebody opens each one, reads four or five numbers off it, types them into another system and files it. It is quiet, constant work, and it is the first thing that breaks when the person who does it takes a week off.",
        "We build the part in the middle. The documents keep arriving the way they already arrive. Software reads them, checks them against what you already know, and posts them into your system. Anything it cannot read with confidence goes to a short queue for a person, and that queue is the point: the goal is not zero people, it is one person looking at ten documents a day instead of three hundred.",
      ],
      whatNote:
        "Pluscode, based in Poznan, working across Europe. Your documents stay on EU infrastructure and the processing agreement is signed before we see a single file.",
      doesTitle: "What it does",
      doesIntro: "Five steps, and every one of them can be checked.",
      does: [
        {
          title: "Takes the documents in",
          body: "A mailbox, a shared folder, a supplier portal, a scanner, a phone camera. We connect to what you use now instead of asking your suppliers to change how they send things.",
        },
        {
          title: "Reads the fields you care about",
          body: "Supplier, dates, line items, totals, tax, reference numbers. We agree the list with you first, because a field nobody uses is a field nobody will check.",
        },
        {
          title: "Checks it against your rules",
          body: "Does the total add up. Is the supplier known. Does the order exist. Is this the same document that already arrived on Tuesday. The rules are yours and they are written down in plain language.",
        },
        {
          title: "Puts it where it belongs",
          body: "Your accounting system, your ERP, your archive, or a spreadsheet if that is genuinely what you use. The original document stays attached to the record it created.",
        },
        {
          title: "Hands the rest to a person",
          body: "Anything unclear goes to a queue with the document on one side and the reading on the other, so a correction takes seconds. Every correction improves the next batch.",
        },
      ],
      getTitle: "What you walk away with",
      getIntro:
        "Working software, and enough written down that somebody who is not us could keep it running.",
      get: [
        {
          title: "A running intake for one document type",
          body: "Live, connected to your real mailbox or folder, handling real documents on the day we finish.",
        },
        {
          title: "The exception queue",
          body: "One screen where a person clears what the software would not guess at. Designed for the person who does this work today, not for an administrator.",
        },
        {
          title: "An accuracy report on your own documents",
          body: "Measured on a sample you choose, field by field, so you know where it is strong and where a person still has to look.",
        },
        {
          title: "The code, the deployment and a handover",
          body: "Yours, in your repository, running in your cloud account or ours, with a written runbook and a walkthrough for whoever will own it.",
        },
      ],
      stepsTitle: "How it runs",
      steps: [
        {
          title: "One document type",
          body: "We pick the one with the highest volume and the least variety. Covering everything at once is the most reliable way to finish nothing.",
        },
        {
          title: "A sample of real documents",
          body: "A few hundred of yours, including the ugly ones: the crooked scans, the handwriting, the supplier who changed their layout last spring.",
        },
        {
          title: "Build and measure",
          body: "We build the reading and the checks, then measure them against the sample. You see the numbers before anything touches your systems.",
        },
        {
          title: "Shadow, then switch",
          body: "It runs beside the current process for a few weeks and the two are compared. You switch when the comparison says so, not when we say we are done.",
        },
      ],
      whoTitle: "Who this suits",
      who: [
        {
          title: "Finance and back office teams",
          body: "Accounts payable, order entry, claims intake. Anywhere a person is the connection between an inbox and a system.",
        },
        {
          title: "Companies growing faster than their admin",
          body: "Volume doubled, headcount did not, and the backlog has become visible to customers.",
        },
        {
          title: "Teams with one person who knows how it works",
          body: "The process lives in somebody's head and everyone quietly worries about the week they are away.",
        },
      ],
      timeTitle: "What it costs in time",
      timeIntro:
        "Calendar time, assuming we can get a sample of documents and half an hour a week from the person who does the work today.",
      time: [
        {
          span: "Week 1",
          title: "Sample and scope",
          body: "We look at real documents, agree the fields and the rules, and say honestly if one of them is not worth automating.",
        },
        {
          span: "Weeks 2 to 4",
          title: "A working pilot",
          body: "Reading, checks and the exception queue, running on your sample with the accuracy measured.",
        },
        {
          span: "Weeks 5 to 8",
          title: "Connected and live",
          body: "Wired into your systems, run in shadow beside the current process, then switched over with the handover written.",
        },
      ],
      relatedTitle: "Related",
      related: [
        {
          title: "Answers from your documents",
          body: "Once the documents can be read, the next question is usually how to ask them things.",
          href: "/solutions/answers-from-documents",
        },
        {
          title: "Assistants and automation",
          body: "When the work is not one document but a sequence of steps across several tools.",
          href: "/solutions/assistants-and-automation",
        },
        {
          title: "Software development",
          body: "If the system the documents should land in does not exist yet.",
          href: "/services/software-development",
        },
      ],
      cta: {
        title: "Send us five of your documents",
        text: "Real ones, with the mess left in. We will tell you what software could read from them and what it could not, before you spend anything.",
        button: "Book a call",
      },
    },

    /* ---------------------------------------------------------------- *
     *  2. Answers from your documents
     * ---------------------------------------------------------------- */
    answersFromDocuments: {
      label: "Solutions",
      title: "Answers from your documents",
      intro:
        "Your contracts, policies and manuals already contain the answer. Ask a question in plain language and get it back with the page it came from, so anyone can check it.",
      metaDescription:
        "Ask your own documents a question and get a checkable answer with its source. Pluscode builds search and answering over your files, with your permissions and EU hosting.",
      whatTitle: "What this is",
      whatBody: [
        "Companies rarely lose knowledge. They lose the path to it. The clause is in a contract somebody signed four years ago, the procedure is in a manual with three versions in circulation, and the answer to today's customer question was given by a colleague in an email last March. Finding it takes twenty minutes, and knowing it exists at all takes years of experience.",
        "This is a search box that answers in sentences instead of listing files, and that shows where each sentence came from. It uses your documents and nothing else. When your documents do not answer the question, it says so, which is the single most important thing it does: an assistant that guesses is worse than no assistant, because people stop checking it.",
      ],
      whatNote:
        "It answers from your files and quotes them, so any answer can be verified in one click. We test it against real questions with known answers before anyone else sees it, and the files stay on EU infrastructure.",
      doesTitle: "What it does",
      doesIntro: "One question in, one checkable answer out.",
      does: [
        {
          title: "Takes a question the way a person asks it",
          body: "Not keywords. Whether we can end the Mueller contract early and what it would cost is a question it should handle in one go.",
        },
        {
          title: "Answers from your documents only",
          body: "No general knowledge and no filling in of gaps. If the answer is not in the files, the answer is that it is not in the files.",
        },
        {
          title: "Shows the source",
          body: "Every answer carries the document, the page and the passage it came from, so the person reading it can confirm it in seconds.",
        },
        {
          title: "Respects who may see what",
          body: "It uses the permissions you already have. Somebody who cannot open a folder does not get answers out of it by asking nicely.",
        },
        {
          title: "Tells you what it is being asked",
          body: "An admin view of the questions people ask and the ones it could not answer. That list is the best map of what is missing from your documentation you will ever get.",
        },
      ],
      getTitle: "What you walk away with",
      getIntro:
        "A tool one team is already using, and the test that says whether it can be trusted.",
      get: [
        {
          title: "Search and answers over one collection",
          body: "A named set of documents: the contract archive, the policy library, the product manual, the tender folder.",
        },
        {
          title: "A test set of real questions",
          body: "Around forty questions from the people who will use it, with the correct answers written down, and a score. Re-run on every change.",
        },
        {
          title: "The permission model, in writing",
          body: "Who may ask what, how it is enforced, and what happens the day somebody changes role or leaves.",
        },
        {
          title: "The code and the deployment",
          body: "Running on EU infrastructure, in your account or ours, with a runbook and a session for whoever will own it.",
        },
      ],
      stepsTitle: "How it runs",
      steps: [
        {
          title: "Pick one collection",
          body: "One set of documents with one audience. Everything at once produces an assistant that is mediocre at everything.",
        },
        {
          title: "Write the questions first",
          body: "We sit with the people who will use it and collect the real questions, with the answers they know to be right. This is the test, and it exists before the build does.",
        },
        {
          title: "Build and score",
          body: "We build it, run the questions and show you the score: how often it is right, and how often it correctly declines to answer.",
        },
        {
          title: "One team, then wider",
          body: "It goes to one team, we watch what they ask, and we fix what the log shows. Rolling out to everybody on day one only hides the problems.",
        },
      ],
      whoTitle: "Who this suits",
      who: [
        {
          title: "Legal and contract teams",
          body: "Hundreds of agreements, a handful of clauses that matter, and questions that always arrive on a deadline.",
        },
        {
          title: "Support and service desks",
          body: "The answer is in the manual. Finding it while a customer waits is the hard part.",
        },
        {
          title: "Bid and tender teams",
          body: "Every proposal repeats something you have already written well once. This is where it is.",
        },
      ],
      timeTitle: "What it costs in time",
      timeIntro:
        "Calendar time, assuming access to the documents and a couple of hours from the people who will use it.",
      time: [
        {
          span: "Week 1",
          title: "Questions and documents",
          body: "We collect the real questions, look at the files, and say which parts of the collection are usable and which need cleaning up first.",
        },
        {
          span: "Weeks 2 to 3",
          title: "A version you can try",
          body: "Answering over your documents with sources, scored against the questions from week one.",
        },
        {
          span: "Weeks 4 to 6",
          title: "Permissions and rollout",
          body: "Wired into your access rules, given to one team, then corrected against what they actually ask it.",
        },
      ],
      relatedTitle: "Related",
      related: [
        {
          title: "Paperwork automation",
          body: "If the documents cannot be read reliably yet, this is the step before this one.",
          href: "/solutions/paperwork-automation",
        },
        {
          title: "Data governance",
          body: "Who may see what, and what the EU AI Act says about it, settled before the build.",
          href: "/solutions/data-governance",
        },
        {
          title: "Machine learning",
          body: "The engineering underneath, if you want the technical version of this page.",
          href: "/ai-data/machine-learning",
        },
      ],
      cta: {
        title: "Bring us ten questions you cannot answer quickly",
        text: "Real questions from real people, and the documents that should contain the answers. We will tell you whether this would work on your files.",
        button: "Book a call",
      },
    },

    /* ---------------------------------------------------------------- *
     *  3. Assistants and automation
     * ---------------------------------------------------------------- */
    assistantsAndAutomation: {
      label: "Solutions",
      title: "Assistants and automation",
      intro:
        "The work that is not one document but a sequence: read the request, find the file, draft the reply, update the record, chase the thing that never came back. An assistant does the steps and a person approves the result.",
      metaDescription:
        "Assistants that do the repeated steps inside the tools your team already uses, with a person approving the result and a readable log of everything they did.",
      whatTitle: "What this is",
      whatBody: [
        "Some work is not a document arriving. It is a small chain of steps that happens forty times a week. A request comes in, somebody looks up the customer, checks two things, writes a reply that is almost the same as last time, updates a record and sets a reminder to chase whatever is missing. Every step is easy. The chain is what eats the day.",
        "An assistant does the chain and stops where judgement is needed. It drafts, it does not send. It prepares the record, a person confirms it. Everything it did is written to a log you can read, so when it gets something wrong you can see which step went wrong and fix that step, instead of switching the whole thing off and going back to doing it by hand.",
      ],
      whatNote:
        "We do not build an assistant that acts on its own the first time round. Approvals come out later, one step at a time, once the log shows that step has earned it.",
      doesTitle: "What it does",
      doesIntro:
        "Five habits, and the fifth is what makes the other four safe to keep.",
      does: [
        {
          title: "Lives where the work already happens",
          body: "In the shared mailbox, in Teams or Slack, in the CRM, in the ticket queue. Nobody has to log into a new system to use it.",
        },
        {
          title: "Drafts instead of sends",
          body: "Replies, offers, summaries, internal notes. A person reads and sends, which is also how it improves: the edits are the feedback.",
        },
        {
          title: "Does the lookups",
          body: "Pulls the customer, the order, the contract and the last conversation together before anyone asks, so the person starts from a full picture instead of building one.",
        },
        {
          title: "Chases what is missing",
          body: "The document that never came back, the approval that stalled, the form with three empty fields. Politely, on a schedule, and it stops the moment the thing arrives.",
        },
        {
          title: "Writes down what it did",
          body: "Every run, every step, every decision, with what went in and what came out. This is what makes it reasonable to give it more to do next month.",
        },
      ],
      getTitle: "What you walk away with",
      getIntro:
        "One assistant on real work, and the controls that let you widen or narrow what it may do.",
      get: [
        {
          title: "An assistant doing two or three real tasks",
          body: "Chosen with the team, running on live work, inside the tool they already have open all day.",
        },
        {
          title: "An approval step you control",
          body: "What it may do alone and what needs a person, written down and changeable without a developer.",
        },
        {
          title: "The log, and a cost per run",
          body: "What it did and what it cost to do it. Automation with an unknown running cost is a surprise waiting for a quarter end.",
        },
        {
          title: "The code, the deployment and a handover",
          body: "Yours, with a runbook and a walkthrough for the person who will own it after we leave.",
        },
      ],
      stepsTitle: "How it runs",
      steps: [
        {
          title: "Watch a day of the real work",
          body: "We sit with the person doing it. A written process describes what should happen; a day of watching shows what does.",
        },
        {
          title: "Pick two steps",
          body: "The two with the most repetition and the least judgement, not the two that are most interesting to build.",
        },
        {
          title: "Build with the approval in",
          body: "It drafts and proposes from the first day it runs. Nothing leaves the building unread by a person.",
        },
        {
          title: "Loosen it slowly",
          body: "Once the log shows a step is right nearly every time, that step stops needing a click. One at a time, and only with your agreement.",
        },
      ],
      whoTitle: "Who this suits",
      who: [
        {
          title: "Sales and service teams",
          body: "The same lookup, the same reply, the same follow up, several dozen times a week.",
        },
        {
          title: "HR and recruitment",
          body: "Screening, scheduling and the endless chasing of documents that nobody enjoys and everybody needs done.",
        },
        {
          title: "Small teams without an operations person",
          body: "Ten people doing the work of twenty, and the admin is what gives way first.",
        },
      ],
      timeTitle: "What it costs in time",
      timeIntro:
        "Calendar time. The variable is rarely the software, it is how quickly we get access to the tools the assistant has to touch.",
      time: [
        {
          span: "Week 1",
          title: "A day of watching, then a shortlist",
          body: "We follow the real work and come back with the steps worth automating and the ones that are not.",
        },
        {
          span: "Weeks 2 to 4",
          title: "The first two tasks, live",
          body: "Running on real work with a person approving everything, inside your existing tools.",
        },
        {
          span: "Weeks 5 to 8",
          title: "More tasks, fewer clicks",
          body: "We add tasks and remove approvals where the log has earned it, then hand the whole thing over.",
        },
      ],
      relatedTitle: "Related",
      related: [
        {
          title: "Paperwork automation",
          body: "When the work is documents arriving rather than steps repeating.",
          href: "/solutions/paperwork-automation",
        },
        {
          title: "Answers from your documents",
          body: "Assistants get better when they can read your files. These two are often built together.",
          href: "/solutions/answers-from-documents",
        },
        {
          title: "Forward deployed engineers",
          body: "If you would rather have an engineer inside the team for a few months than a fixed project.",
          href: "/services/forward-deployed-engineers",
        },
      ],
      cta: {
        title: "Describe a day in the job you want help with",
        text: "Which forty minutes go on the same three steps. That is usually enough for us to say whether an assistant is worth building.",
        button: "Book a call",
      },
    },

    /* ---------------------------------------------------------------- *
     *  4. Forecasting and reporting
     * ---------------------------------------------------------------- */
    forecastingAndReporting: {
      label: "Solutions",
      title: "Forecasting and reporting",
      intro:
        "The numbers are already in your systems, in four different shapes. We put them in one place, agree what each one means, and make the monthly report and the forecast build themselves.",
      metaDescription:
        "One set of numbers, a report that rebuilds itself and a forecast you can question. Pluscode connects your systems, writes the definitions down and reconciles against your own figures.",
      whatTitle: "What this is",
      whatBody: [
        "Most reporting problems are not analysis problems. Somebody exports three files on the first Monday of the month, pastes them into a workbook that has been growing for six years, fixes the two columns that always break, and sends a deck. The numbers are usually right. Nobody can say exactly how they were arrived at, and the one person who can is on holiday.",
        "We do the unglamorous half. Connect the sources, agree one definition for each number, reconcile the result against the figures you already trust, and then make the report rebuild itself. The forecast comes after that, and only for the numbers where a forecast is honest. Some numbers cannot be forecast usefully at your size and we will say so rather than draw the line anyway.",
      ],
      whatNote:
        "We also build Quanty, our own product for exactly this: a spreadsheet that reads documents into rows. Sometimes the right answer is Quanty and no project at all, and we would rather tell you that than sell you a build.",
      doesTitle: "What it does",
      doesIntro:
        "Five steps, and the second one is where most of the value turns out to be.",
      does: [
        {
          title: "Pulls the numbers together",
          body: "Accounting, the CRM, the warehouse, the bank, and the spreadsheet somebody maintains by hand. Whatever holds the truth today, rather than whatever should.",
        },
        {
          title: "Agrees what each number means",
          body: "One definition of revenue, one of an active customer, one of a delivered order, written down where everyone can see it and argue with it once instead of every month.",
        },
        {
          title: "Reconciles against what you trust",
          body: "The new figures are matched to your own closing numbers before anybody is asked to rely on them. A difference gets explained, not rounded away.",
        },
        {
          title: "Rebuilds the report on its own",
          body: "Monthly, weekly, or whenever the data changes. Same layout, same definitions, and no first Monday of the month.",
        },
        {
          title: "Forecasts, with the assumptions visible",
          body: "What the next months look like if nothing changes, and which assumptions the answer is sensitive to. A forecast you cannot interrogate is a guess with a chart on it.",
        },
      ],
      getTitle: "What you walk away with",
      getIntro:
        "A set of numbers you can defend in a meeting, and the sheet that says how each one is calculated.",
      get: [
        {
          title: "One connected set of numbers",
          body: "Refreshed on a schedule, with every source named and every transformation readable by somebody who is not an engineer.",
        },
        {
          title: "A written definitions sheet",
          body: "Every metric, its formula, its source, and who owns the decision when it has to change.",
        },
        {
          title: "The recurring report",
          body: "Built and delivered on a schedule, in the shape your board or your team already reads.",
        },
        {
          title: "The forecast and its assumptions",
          body: "Including the assumptions we could not support, and the reason we left those numbers out.",
        },
      ],
      stepsTitle: "How it runs",
      steps: [
        {
          title: "Agree the ten numbers",
          body: "The ones a decision actually depends on. A report with sixty numbers on it is a report nobody reads to the end.",
        },
        {
          title: "Connect and reconcile",
          body: "We pull the sources and match the result to your own closing figures until every difference is explained.",
        },
        {
          title: "Publish the report",
          body: "Automated, on a schedule, in the shape people already expect. The change should be invisible except that it simply arrives.",
        },
        {
          title: "Add the forecast",
          body: "Only where the history supports one, and always with the assumptions written next to the number.",
        },
      ],
      whoTitle: "Who this suits",
      who: [
        {
          title: "Finance teams closing by hand",
          body: "Month end is three days of copying, and most of it is the same three days as last month.",
        },
        {
          title: "Founders and boards",
          body: "You need one page a month that is the same page every month and that survives a hard question.",
        },
        {
          title: "Operations with numbers in four systems",
          body: "Stock in one place, orders in another, deliveries in a third, and no view that spans them.",
        },
      ],
      timeTitle: "What it costs in time",
      timeIntro:
        "Calendar time, assuming read access to the systems and somebody who can answer what a given column actually means.",
      time: [
        {
          span: "Weeks 1 to 2",
          title: "Definitions and sources",
          body: "We agree the numbers and find out where each one really comes from. This is usually the surprising part.",
        },
        {
          span: "Weeks 3 to 5",
          title: "Connected and reconciled",
          body: "The pipeline runs and the figures match what you already close your month with.",
        },
        {
          span: "Weeks 6 to 8",
          title: "Report, then forecast",
          body: "The recurring report goes live, and the forecast follows once the base numbers are trusted.",
        },
      ],
      relatedTitle: "Related",
      related: [
        {
          title: "Quanty",
          body: "Our own product. If your numbers arrive as documents rather than as data, start here.",
          href: "/quanty",
        },
        {
          title: "Paperwork automation",
          body: "When the numbers arrive as invoices and delivery notes that somebody types in.",
          href: "/solutions/paperwork-automation",
        },
        {
          title: "Data analytics",
          body: "The engineering version of this page, written for a technical reader.",
          href: "/ai-data/analytics",
        },
      ],
      cta: {
        title: "Send us last month's report",
        text: "The workbook, the deck, whatever you actually send. We will tell you what could rebuild itself and what would genuinely be work.",
        button: "Book a call",
      },
    },

    /* ---------------------------------------------------------------- *
     *  5. Process mapping
     * ---------------------------------------------------------------- */
    processMapping: {
      label: "Solutions",
      title: "Process mapping",
      intro:
        "Before anybody writes code, two days with the people doing the work. You get a map of how it really runs, a costed shortlist of what is worth automating, and a clear list of what is not.",
      metaDescription:
        "Two days with your team, then a costed shortlist of what is worth automating and what is not. A fixed fee engagement from Pluscode, credited against the build if you go ahead.",
      whatTitle: "What this is",
      whatBody: [
        "A lot of companies are told to do something with AI and have no good way to decide what. The pressure is real, the budget is sometimes already approved, and the shortlist that arrives from a vendor is a list of things that vendor happens to sell. What is missing is a clear picture of where the hours actually go.",
        "This is that picture, and it is deliberately not a sales exercise. We sit with the people doing the work, count where the time goes, price each candidate and hand you a ranked list with an estimate and a payback for every item on it. Several items usually come back marked do not automate this, which is worth as much as the ones that do.",
      ],
      whatNote:
        "Fixed fee, agreed before we start and credited against the build if you go ahead with us. If the honest answer is that nothing here is worth building, you still keep the map and the numbers.",
      doesTitle: "What it does",
      doesIntro: "Five things, and the last one is the one vendors skip.",
      does: [
        {
          title: "Follows the work, not the process document",
          body: "We watch the job being done. The written process and the real one are rarely the same, and the gap between them is where the hours hide.",
        },
        {
          title: "Counts the hours",
          body: "How often each step happens, how long it takes, who does it, and what it costs when it goes wrong and has to be done twice.",
        },
        {
          title: "Prices each candidate",
          body: "What building it would take, what running it would cost, and what it would save. In the same units, so two candidates can actually be compared.",
        },
        {
          title: "Ranks them honestly",
          body: "The cheapest useful thing first. The impressive project that pays back in three years goes at the bottom, where it belongs.",
        },
        {
          title: "Says what to leave alone",
          body: "Work with too much judgement in it, too little volume, or a regulatory tail that makes automation the expensive option.",
        },
      ],
      getTitle: "What you walk away with",
      getIntro:
        "Four documents, all short enough that somebody will read them.",
      get: [
        {
          title: "A map of the process as it runs",
          body: "Steps, systems, handovers and waiting time, on one page, in language the people who do the work recognise as their job.",
        },
        {
          title: "A ranked and costed shortlist",
          body: "Each item with an estimate to build, a running cost, an expected saving and a payback period.",
        },
        {
          title: "A risk note under the EU AI Act",
          body: "Which tier each candidate falls into and what that means in practice, worked out before anything is designed.",
        },
        {
          title: "A written recommendation",
          body: "Short enough to take to a board, specific enough to act on, and it names what we would not do and why.",
        },
      ],
      stepsTitle: "How it runs",
      steps: [
        {
          title: "Half a day of scoping",
          body: "Which part of the business, which teams, and what a good outcome would look like. Remote is fine for this part.",
        },
        {
          title: "Two days with the teams",
          body: "On site or on a call, with the people who do the work rather than only the people who manage it.",
        },
        {
          title: "A week of costing",
          body: "We turn what we saw into estimates and check the assumptions with you as we go, so nothing in the readout is a surprise.",
        },
        {
          title: "The readout",
          body: "We walk the room through the map, the shortlist and the recommendation, and answer the hard questions live.",
        },
      ],
      whoTitle: "Who this suits",
      who: [
        {
          title: "Companies told to do something with AI",
          body: "The pressure is real and there is no shortlist anybody in the building actually trusts.",
        },
        {
          title: "Teams with a budget and no plan",
          body: "The money is approved for this year and the real risk is spending it on the wrong thing well.",
        },
        {
          title: "Anyone about to sign a large vendor",
          body: "A second opinion on what the work is worth, from people who will also say buy it rather than build it.",
        },
      ],
      timeTitle: "What it costs in time",
      timeIntro:
        "Two to three weeks end to end. The only thing we need from you is access to the people doing the work.",
      time: [
        {
          span: "Week 1",
          title: "Scoping and the days with the teams",
          body: "Half a day of scoping, then two days following the work as it is actually done.",
        },
        {
          span: "Week 2",
          title: "Costing and drafting",
          body: "We estimate, check the assumptions with you, and write it up.",
        },
        {
          span: "Week 3",
          title: "Readout and decision",
          body: "You get the map, the shortlist and the recommendation, and a session in which to argue with all three.",
        },
      ],
      relatedTitle: "Related",
      related: [
        {
          title: "Workshops",
          body: "A shorter version: one day with your team on a single process.",
          href: "/workshops",
        },
        {
          title: "Data governance",
          body: "The other thing worth settling before anybody builds.",
          href: "/solutions/data-governance",
        },
        {
          title: "AI consulting",
          body: "The longer engagement, when the question is a roadmap rather than one process.",
          href: "/ai-data/consulting",
        },
      ],
      cta: {
        title: "Tell us which team is drowning",
        text: "One department, one process. We will tell you what the mapping would cover and what it would cost before you commit to anything.",
        button: "Book a call",
      },
    },

    /* ---------------------------------------------------------------- *
     *  6. Data governance
     * ---------------------------------------------------------------- */
    dataGovernance: {
      label: "Solutions",
      title: "Data governance",
      intro:
        "Where the data sits, who may see it, how long it is kept, and what the EU AI Act says about the thing you are building. Settled before the first line of code, not after the security questionnaire arrives.",
      metaDescription:
        "GDPR, EU AI Act risk tiers, access rules and retention for AI projects. EU hosting by default and a processing agreement signed before any data moves. From Pluscode.",
      whatTitle: "What this is",
      whatBody: [
        "The question that stops an AI project is almost never technical. It is a customer's security questionnaire, a works council asking where the data goes, a lawyer asking which risk tier this falls into, or a board member asking what happens if the thing is wrong about somebody. These questions arrive late, and they arrive all at once.",
        "This is the work of answering them before they are asked. Where each piece of data comes from and where it ends up, what lawful basis it moves on, who may see what, how long anything is kept, and what the EU AI Act requires of the specific system you are building. It is not a policy document nobody reads. It is a set of decisions, written down, that software can be built against.",
      ],
      whatNote:
        "EU hosting by default and a GDPR processing agreement signed before we touch anything. The AI Act risk tier is worked out before design starts, because the tier changes what has to be built.",
      doesTitle: "What it does",
      doesIntro:
        "Five questions, answered once, in a form your legal team can sign and your engineers can implement.",
      does: [
        {
          title: "Maps the data the system touches",
          body: "Every source, every field that is personal, and every place a copy ends up, including the copies nobody meant to create.",
        },
        {
          title: "Settles the lawful basis and the paperwork",
          body: "Processing agreement, sub-processors, transfers, and the record you are required to keep. Written for a legal team to sign rather than a template to fill in later.",
        },
        {
          title: "Classifies the system under the EU AI Act",
          body: "Which tier, what that requires in practice, and what it would take to stay out of a heavier tier where that is a real option.",
        },
        {
          title: "Defines who may see what",
          body: "An access model that matches how the company actually works, and a plan for the day somebody changes role or leaves.",
        },
        {
          title: "Sets retention, deletion and logging",
          body: "How long things are kept, how a deletion request is honoured end to end, and what is logged so an audit can be answered with evidence instead of assurances.",
        },
      ],
      getTitle: "What you walk away with",
      getIntro:
        "Documents that answer the questions before they are asked, and rules that live in the software rather than in a folder.",
      get: [
        {
          title: "A data map and a register",
          body: "What the system touches, where it lives, who processes it, and on what basis.",
        },
        {
          title: "The signed paperwork",
          body: "A processing agreement, the sub-processor list and the transfer position, ready for your legal team.",
        },
        {
          title: "A written AI Act classification",
          body: "The tier, the reasoning behind it, and the obligations that follow, in language a non-lawyer can act on.",
        },
        {
          title: "An access matrix and a retention schedule",
          body: "Who sees what, for how long, and what the system does automatically when the answer changes.",
        },
      ],
      stepsTitle: "How it runs",
      steps: [
        {
          title: "One system at a time",
          body: "We govern the thing being built, not the whole company. A company wide programme takes a year and protects nothing in the meantime.",
        },
        {
          title: "Follow the data",
          body: "Sources, copies, backups, logs and third parties. The copies nobody remembers are the ones that cause the incident.",
        },
        {
          title: "Decide and write it down",
          body: "Every decision gets an owner and a date. An open question is fine; an undocumented assumption is not.",
        },
        {
          title: "Build it into the system",
          body: "Access rules, retention and logging become configuration and code, not a promise in a document.",
        },
      ],
      whoTitle: "Who this suits",
      who: [
        {
          title: "Regulated industries",
          body: "Finance, health and anything where your customer's auditor eventually becomes your auditor.",
        },
        {
          title: "Companies answering security questionnaires",
          body: "Enterprise customers ask. The answers should exist before a deal depends on them.",
        },
        {
          title: "Anyone about to sign an AI vendor",
          body: "Where the data goes, what it trains, and what happens when you leave. Worth an hour before signature.",
        },
      ],
      timeTitle: "What it costs in time",
      timeIntro:
        "Calendar time for one system. Shorter if the system is not live yet, which is also the cheapest moment to do this.",
      time: [
        {
          span: "Week 1",
          title: "Map and questions",
          body: "We follow the data through the system and come back with the questions only you can answer.",
        },
        {
          span: "Weeks 2 to 3",
          title: "Decisions and classification",
          body: "Lawful basis, the AI Act tier, access and retention, written down with an owner against each one.",
        },
        {
          span: "Weeks 4 to 5",
          title: "Built in",
          body: "The rules become configuration and code, and the paperwork goes to your legal team.",
        },
      ],
      relatedTitle: "Related",
      related: [
        {
          title: "Process mapping",
          body: "The other thing worth settling before anybody builds.",
          href: "/solutions/process-mapping",
        },
        {
          title: "Cloud and MLOps",
          body: "Where EU hosting, access control and logging actually get implemented.",
          href: "/services/cloud",
        },
        {
          title: "AI consulting",
          body: "When the question is a roadmap for the whole company rather than one system.",
          href: "/ai-data/consulting",
        },
      ],
      cta: {
        title: "Send us the questionnaire you are stuck on",
        text: "Or the clause your customer added at the last minute. Thirty minutes is usually enough to say what needs answering and in what order.",
        button: "Book a call",
      },
    },
  },
};

/* ------------------------------------------------------------------ *
 *  POLSKI. Second person singular, as everywhere else in pl.json.
 * ------------------------------------------------------------------ */
const pl: SolutionsContent = {
  index: {
    label: "Rozwiązania",
    allLabel: "Wszystkie rozwiązania",
    title: "Praca, którą zdejmujemy z Twojego biurka",
    intro:
      "Sześć rzeczy, o które firmy pytają nas najczęściej. Każda zaczyna się od papierkowej roboty, którą ktoś dziś robi ręcznie, a kończy na oprogramowaniu, które robi ją za niego, podczas gdy człowiek sprawdza wynik.",
    metaDescription:
      "Sześć praktycznych rozwiązań od Pluscode: automatyzacja dokumentów, odpowiedzi z Twoich dokumentów, asystenci, prognozy i raporty, mapowanie procesów oraz zarządzanie danymi. Hosting w UE domyślnie.",
    listTitle: "Od czego zacząć",
    listIntro:
      "Większość firm przychodzi do nas z jedną z tych spraw. Jeśli dwie opisują Ciebie, zacznij od tej, która boli w poniedziałek rano.",
    items: [
      {
        key: "paperworkAutomation",
        slug: "paperwork-automation",
        name: "Automatyzacja dokumentów",
        teaser:
          "Dokumenty przychodzą, zostają odczytane, sprawdzone i trafiają do właściwego systemu. Nikt nic nie przepisuje.",
      },
      {
        key: "answersFromDocuments",
        slug: "answers-from-documents",
        name: "Odpowiedzi z Twoich dokumentów",
        teaser:
          "Zadajesz pytanie normalnym językiem i dostajesz odpowiedź z własnych plików, wraz ze stroną, z której pochodzi.",
      },
      {
        key: "assistantsAndAutomation",
        slug: "assistants-and-automation",
        name: "Asystenci i automatyzacja",
        teaser:
          "Asystent, który wykonuje powtarzalne kroki w Twoich narzędziach i zatrzymuje się, żeby człowiek zatwierdził.",
      },
      {
        key: "forecastingAndReporting",
        slug: "forecasting-and-reporting",
        name: "Prognozy i raporty",
        teaser:
          "Twoje liczby w jednym miejscu, miesięczny raport, który składa się sam, i widok tego, co przed Tobą.",
      },
      {
        key: "processMapping",
        slug: "process-mapping",
        name: "Mapowanie procesów",
        teaser:
          "Dwa dni z ludźmi, którzy wykonują pracę, a potem wyceniona lista tego, co warto zautomatyzować.",
      },
      {
        key: "dataGovernance",
        slug: "data-governance",
        name: "Zarządzanie danymi",
        teaser:
          "Gdzie leżą dane, kto może je zobaczyć i co unijny AI Act mówi o tym, co budujesz.",
      },
    ],
    startTitle: "Jak zaczyna się współpraca",
    startIntro:
      "Te same trzy kroki za każdym razem, niezależnie od tego, które z sześciu wybierzesz.",
    start: [
      {
        title: "Rozmowa z inżynierem",
        body: "Trzydzieści minut. Ty opisujesz pracę, my mówimy, co byśmy zbudowali, czego nie, i mniej więcej ile to zajmie. Nie ma prezentacji ani działu sprzedaży do przejścia.",
      },
      {
        title: "Jeden mały, ustalony kawałek",
        body: "Prawie każdy projekt zaczyna się od jednego zamkniętego kroku: jeden typ dokumentu, jeden zbiór plików, jeden raport. Ustalony zakres, ustalona cena, więc pierwsza faktura nigdy nie jest niespodzianką.",
      },
      {
        title: "Decyzja, którą możesz cofnąć",
        body: "Jeśli pierwszy krok się nie zwróci, kończysz na nim. Mapę, pomiary i kod zachowujesz tak czy inaczej.",
      },
    ],
    elsewhereTitle: "To nie tego szukasz?",
    elsewhere: [
      {
        title: "Inżynieria",
        body: "Oprogramowanie na zamówienie, MVP, chmura i inżynier osadzony w Twoim zespole na kilka miesięcy.",
        href: "/services",
      },
      {
        title: "Quanty",
        body: "Nasz własny produkt, zbudowany przez nas: arkusz, który wczytuje Twoje dokumenty jako wiersze.",
        href: "/quanty",
      },
      {
        title: "Warsztaty",
        body: "Dzień z Twoim zespołem nad jednym procesem, jeśli chcesz przemyśleć rzecz przed projektem.",
        href: "/workshops",
      },
    ],
    cta: {
      title: "Powiedz nam, jak wygląda ta papierkowa robota",
      text: "Trzydzieści minut z inżynierem, nie z handlowcem. Przynieś jeden proces, a powiemy, czy w ogóle warto tykać go oprogramowaniem.",
      button: "Umów rozmowę",
    },
  },
  pages: {
    paperworkAutomation: {
      label: "Rozwiązania",
      title: "Automatyzacja dokumentów",
      intro:
        "Faktury, listy przewozowe, zamówienia i formularze przychodzą przez cały dzień. Oprogramowanie może je odczytać, sprawdzić względem Twoich reguł i odłożyć tam, gdzie ich miejsce, a człowiek patrzy tylko na te, które tego wymagają.",
      metaDescription:
        "Zautomatyzuj dokumenty, które przychodzą codziennie. Pluscode buduje przyjmowanie, odczyt, kontrole i księgowanie faktur, listów przewozowych, zamówień i formularzy. Hosting w UE domyślnie.",
      whatTitle: "Co to jest",
      whatBody: [
        "Każda firma ma biurko, na które trafiają dokumenty. Przychodzą mailem, pocztą, z portalu dostawcy, jako zdjęcie listu przewozowego zrobione na placu. Ktoś otwiera każdy z nich, odczytuje cztery czy pięć liczb, przepisuje je do innego systemu i archiwizuje. To cicha, nieustanna praca i pierwsza rzecz, która się sypie, kiedy osoba, która ją wykonuje, bierze tydzień wolnego.",
        "My budujemy to, co pośrodku. Dokumenty dalej przychodzą tak, jak przychodziły. Oprogramowanie je odczytuje, sprawdza względem tego, co już wiesz, i wprowadza do Twojego systemu. To, czego nie odczyta z pewnością, trafia do krótkiej kolejki dla człowieka, i o tę kolejkę tu chodzi: celem nie jest zero ludzi, tylko jedna osoba oglądająca dziesięć dokumentów dziennie zamiast trzystu.",
      ],
      whatNote:
        "Pluscode, z Poznania, pracujemy w całej Europie. Twoje dokumenty zostają na infrastrukturze w UE, a umowa powierzenia jest podpisana, zanim zobaczymy pierwszy plik.",
      doesTitle: "Co to robi",
      doesIntro: "Pięć kroków i każdy z nich da się sprawdzić.",
      does: [
        {
          title: "Przyjmuje dokumenty",
          body: "Skrzynka mailowa, folder współdzielony, portal dostawcy, skaner, aparat w telefonie. Podłączamy się do tego, czego używasz dziś, zamiast prosić dostawców o zmianę sposobu wysyłki.",
        },
        {
          title: "Odczytuje pola, na których Ci zależy",
          body: "Dostawca, daty, pozycje, kwoty, podatek, numery referencyjne. Listę ustalamy najpierw z Tobą, bo pole, którego nikt nie używa, to pole, którego nikt nie sprawdzi.",
        },
        {
          title: "Sprawdza względem Twoich reguł",
          body: "Czy suma się zgadza. Czy dostawca jest znany. Czy zamówienie istnieje. Czy to nie ten sam dokument, który przyszedł we wtorek. Reguły są Twoje i są spisane zwykłym językiem.",
        },
        {
          title: "Odkłada tam, gdzie trzeba",
          body: "Do systemu księgowego, do ERP, do archiwum albo do arkusza, jeśli naprawdę z niego korzystacie. Oryginał zostaje przypięty do zapisu, który utworzył.",
        },
        {
          title: "Resztę oddaje człowiekowi",
          body: "Wszystko niejasne trafia do kolejki, gdzie z jednej strony jest dokument, a z drugiej odczyt, więc poprawka zajmuje sekundy. Każda poprawka poprawia następną partię.",
        },
      ],
      getTitle: "Z czym zostajesz",
      getIntro:
        "Działające oprogramowanie i tyle spisanej wiedzy, żeby ktoś inny niż my mógł je utrzymać.",
      get: [
        {
          title: "Działające przyjmowanie jednego typu dokumentu",
          body: "Na żywo, podłączone do Twojej prawdziwej skrzynki lub folderu, obsługujące prawdziwe dokumenty w dniu, w którym kończymy.",
        },
        {
          title: "Kolejka wyjątków",
          body: "Jeden ekran, na którym człowiek domyka to, czego oprogramowanie nie chciało zgadywać. Zaprojektowany dla osoby, która dziś wykonuje tę pracę, nie dla administratora.",
        },
        {
          title: "Raport skuteczności na Twoich dokumentach",
          body: "Zmierzony na próbce, którą wybierasz, pole po polu, żebyś wiedział, gdzie jest mocny, a gdzie człowiek nadal musi zajrzeć.",
        },
        {
          title: "Kod, wdrożenie i przekazanie",
          body: "Twoje, w Twoim repozytorium, uruchomione na Twoim koncie chmurowym albo na naszym, z runbookiem i przejściem po całości z osobą, która to przejmie.",
        },
      ],
      stepsTitle: "Jak to przebiega",
      steps: [
        {
          title: "Jeden typ dokumentu",
          body: "Wybieramy ten o największym wolumenie i najmniejszej różnorodności. Objęcie wszystkiego naraz to najpewniejszy sposób, żeby nie skończyć niczego.",
        },
        {
          title: "Próbka prawdziwych dokumentów",
          body: "Kilkaset Twoich, razem z tymi brzydkimi: krzywe skany, pismo odręczne, dostawca, który zmienił układ zeszłej wiosny.",
        },
        {
          title: "Budujemy i mierzymy",
          body: "Budujemy odczyt i kontrole, a potem mierzymy je na próbce. Widzisz liczby, zanim cokolwiek dotknie Twoich systemów.",
        },
        {
          title: "Najpierw równolegle, potem przełączenie",
          body: "Działa obok obecnego procesu przez kilka tygodni i porównujemy oba. Przełączasz się wtedy, kiedy mówi o tym porównanie, a nie kiedy my mówimy, że skończyliśmy.",
        },
      ],
      whoTitle: "Dla kogo to jest",
      who: [
        {
          title: "Zespoły finansowe i back office",
          body: "Rozliczanie faktur, wprowadzanie zamówień, przyjmowanie zgłoszeń. Wszędzie tam, gdzie człowiek jest łącznikiem między skrzynką a systemem.",
        },
        {
          title: "Firmy rosnące szybciej niż ich administracja",
          body: "Wolumen się podwoił, liczba etatów nie, a zaległości zaczęli widzieć klienci.",
        },
        {
          title: "Zespoły z jedną osobą, która wie, jak to działa",
          body: "Proces siedzi w czyjejś głowie i wszyscy po cichu martwią się tygodniem jej nieobecności.",
        },
      ],
      timeTitle: "Ile to kosztuje w czasie",
      timeIntro:
        "Czas kalendarzowy, przy założeniu, że dostaniemy próbkę dokumentów i pół godziny tygodniowo od osoby, która dziś wykonuje tę pracę.",
      time: [
        {
          span: "Tydzień 1",
          title: "Próbka i zakres",
          body: "Oglądamy prawdziwe dokumenty, ustalamy pola i reguły i uczciwie mówimy, jeśli któregoś nie warto automatyzować.",
        },
        {
          span: "Tygodnie 2 do 4",
          title: "Działający pilotaż",
          body: "Odczyt, kontrole i kolejka wyjątków, uruchomione na Twojej próbce, ze zmierzoną skutecznością.",
        },
        {
          span: "Tygodnie 5 do 8",
          title: "Podłączone i na produkcji",
          body: "Wpięte w Twoje systemy, uruchomione równolegle z obecnym procesem, a potem przełączone, z opisanym przekazaniem.",
        },
      ],
      relatedTitle: "Powiązane",
      related: [
        {
          title: "Odpowiedzi z Twoich dokumentów",
          body: "Kiedy dokumenty da się już odczytać, następne pytanie brzmi zwykle, jak je o coś zapytać.",
          href: "/solutions/answers-from-documents",
        },
        {
          title: "Asystenci i automatyzacja",
          body: "Kiedy pracą nie jest jeden dokument, tylko ciąg kroków w kilku narzędziach.",
          href: "/solutions/assistants-and-automation",
        },
        {
          title: "Rozwój oprogramowania",
          body: "Jeśli system, do którego dokumenty mają trafiać, jeszcze nie istnieje.",
          href: "/services/software-development",
        },
      ],
      cta: {
        title: "Przyślij nam pięć swoich dokumentów",
        text: "Prawdziwych, z całym bałaganem. Powiemy, co oprogramowanie mogłoby z nich odczytać, a czego nie, zanim wydasz złotówkę.",
        button: "Umów rozmowę",
      },
    },

    answersFromDocuments: {
      label: "Rozwiązania",
      title: "Odpowiedzi z Twoich dokumentów",
      intro:
        "Twoje umowy, procedury i instrukcje już zawierają odpowiedź. Zadaj pytanie normalnym językiem i dostań ją z powrotem razem ze stroną, z której pochodzi, żeby każdy mógł ją sprawdzić.",
      metaDescription:
        "Zapytaj własne dokumenty i dostań sprawdzalną odpowiedź ze źródłem. Pluscode buduje wyszukiwanie i odpowiadanie na Twoich plikach, z Twoimi uprawnieniami i hostingiem w UE.",
      whatTitle: "Co to jest",
      whatBody: [
        "Firmy rzadko tracą wiedzę. Tracą drogę do niej. Klauzula jest w umowie podpisanej cztery lata temu, procedura w instrukcji, która krąży w trzech wersjach, a odpowiedź na dzisiejsze pytanie klienta padła w mailu kolegi w marcu. Znalezienie tego zajmuje dwadzieścia minut, a sama wiedza, że to istnieje, bierze się z lat doświadczenia.",
        "To jest wyszukiwarka, która odpowiada zdaniami zamiast wypluwać listę plików, i która pokazuje, skąd każde zdanie pochodzi. Korzysta z Twoich dokumentów i z niczego więcej. Kiedy Twoje dokumenty nie odpowiadają na pytanie, mówi o tym wprost, i to jest najważniejsza rzecz, jaką robi: asystent, który zgaduje, jest gorszy niż brak asystenta, bo ludzie przestają go sprawdzać.",
      ],
      whatNote:
        "Odpowiada z Twoich plików i je cytuje, więc każdą odpowiedź da się zweryfikować jednym kliknięciem. Testujemy go na prawdziwych pytaniach ze znanymi odpowiedziami, zanim zobaczy go ktokolwiek inny, a pliki zostają na infrastrukturze w UE.",
      doesTitle: "Co to robi",
      doesIntro: "Jedno pytanie wchodzi, jedna sprawdzalna odpowiedź wychodzi.",
      does: [
        {
          title: "Przyjmuje pytanie tak, jak zadaje je człowiek",
          body: "Nie słowa kluczowe. Czy możemy wcześniej zakończyć umowę z Mullerem i ile to kosztuje to pytanie, z którym powinien sobie poradzić za jednym razem.",
        },
        {
          title: "Odpowiada wyłącznie z Twoich dokumentów",
          body: "Żadnej wiedzy ogólnej i żadnego uzupełniania luk. Jeśli odpowiedzi nie ma w plikach, odpowiedzią jest to, że jej tam nie ma.",
        },
        {
          title: "Pokazuje źródło",
          body: "Każda odpowiedź niesie ze sobą dokument, stronę i fragment, więc osoba, która ją czyta, potwierdza ją w kilka sekund.",
        },
        {
          title: "Szanuje to, kto co może zobaczyć",
          body: "Korzysta z uprawnień, które już masz. Ktoś, kto nie otworzy folderu, nie wyciągnie z niego odpowiedzi przez uprzejme zapytanie.",
        },
        {
          title: "Mówi Ci, o co jest pytany",
          body: "Widok administracyjny z pytaniami ludzi i z tymi, na które nie umiał odpowiedzieć. Ta lista to najlepsza mapa braków w Twojej dokumentacji, jaką dostaniesz.",
        },
      ],
      getTitle: "Z czym zostajesz",
      getIntro:
        "Narzędzie, z którego jeden zespół już korzysta, i test, który mówi, czy można mu ufać.",
      get: [
        {
          title: "Wyszukiwanie i odpowiedzi na jednym zbiorze",
          body: "Nazwany zbiór dokumentów: archiwum umów, biblioteka procedur, instrukcja produktu, folder przetargowy.",
        },
        {
          title: "Zestaw testowy prawdziwych pytań",
          body: "Około czterdziestu pytań od ludzi, którzy będą z tego korzystać, ze spisanymi poprawnymi odpowiedziami i wynikiem. Uruchamiany ponownie przy każdej zmianie.",
        },
        {
          title: "Model uprawnień, na piśmie",
          body: "Kto o co może pytać, jak jest to egzekwowane i co się dzieje w dniu, w którym ktoś zmienia rolę albo odchodzi.",
        },
        {
          title: "Kod i wdrożenie",
          body: "Uruchomione na infrastrukturze w UE, na Twoim koncie albo na naszym, z runbookiem i sesją dla osoby, która to przejmie.",
        },
      ],
      stepsTitle: "Jak to przebiega",
      steps: [
        {
          title: "Wybierz jeden zbiór",
          body: "Jeden zbiór dokumentów z jedną grupą odbiorców. Wszystko naraz daje asystenta, który jest przeciętny we wszystkim.",
        },
        {
          title: "Najpierw spisujemy pytania",
          body: "Siadamy z ludźmi, którzy będą z tego korzystać, i zbieramy prawdziwe pytania razem z odpowiedziami, o których wiedzą, że są poprawne. To jest test i powstaje przed budową.",
        },
        {
          title: "Budujemy i punktujemy",
          body: "Budujemy, uruchamiamy pytania i pokazujemy wynik: jak często ma rację i jak często słusznie odmawia odpowiedzi.",
        },
        {
          title: "Jeden zespół, potem szerzej",
          body: "Trafia do jednego zespołu, patrzymy, o co pytają, i poprawiamy to, co pokazuje log. Udostępnienie wszystkim pierwszego dnia tylko zakrywa problemy.",
        },
      ],
      whoTitle: "Dla kogo to jest",
      who: [
        {
          title: "Działy prawne i zespoły kontraktowe",
          body: "Setki umów, garść klauzul, które mają znaczenie, i pytania, które zawsze przychodzą na termin.",
        },
        {
          title: "Wsparcie i serwis",
          body: "Odpowiedź jest w instrukcji. Trudne jest znalezienie jej, kiedy klient czeka.",
        },
        {
          title: "Zespoły ofertowe i przetargowe",
          body: "Każda oferta powtarza coś, co raz już dobrze napisaliście. Tu to jest.",
        },
      ],
      timeTitle: "Ile to kosztuje w czasie",
      timeIntro:
        "Czas kalendarzowy, przy dostępie do dokumentów i dwóch godzinach od ludzi, którzy będą z tego korzystać.",
      time: [
        {
          span: "Tydzień 1",
          title: "Pytania i dokumenty",
          body: "Zbieramy prawdziwe pytania, oglądamy pliki i mówimy, które części zbioru nadają się do użycia, a które trzeba najpierw uporządkować.",
        },
        {
          span: "Tygodnie 2 do 3",
          title: "Wersja do wypróbowania",
          body: "Odpowiada na Twoich dokumentach ze źródłami, oceniona na pytaniach z pierwszego tygodnia.",
        },
        {
          span: "Tygodnie 4 do 6",
          title: "Uprawnienia i wdrożenie",
          body: "Wpięte w Twoje reguły dostępu, oddane jednemu zespołowi, a potem poprawione pod to, o co naprawdę pytają.",
        },
      ],
      relatedTitle: "Powiązane",
      related: [
        {
          title: "Automatyzacja dokumentów",
          body: "Jeśli dokumentów nie da się jeszcze pewnie odczytać, to jest krok wcześniejszy.",
          href: "/solutions/paperwork-automation",
        },
        {
          title: "Zarządzanie danymi",
          body: "Kto co może zobaczyć i co mówi o tym unijny AI Act, ustalone przed budową.",
          href: "/solutions/data-governance",
        },
        {
          title: "Machine learning",
          body: "Inżynieria pod spodem, jeśli chcesz techniczną wersję tej strony.",
          href: "/ai-data/machine-learning",
        },
      ],
      cta: {
        title: "Przynieś nam dziesięć pytań, na które nie umiesz szybko odpowiedzieć",
        text: "Prawdziwe pytania od prawdziwych ludzi i dokumenty, które powinny zawierać odpowiedzi. Powiemy, czy na Twoich plikach to zadziała.",
        button: "Umów rozmowę",
      },
    },

    assistantsAndAutomation: {
      label: "Rozwiązania",
      title: "Asystenci i automatyzacja",
      intro:
        "Praca, która nie jest jednym dokumentem, tylko ciągiem: przeczytaj zgłoszenie, znajdź plik, napisz odpowiedź, zaktualizuj rekord, przypomnij się o to, co nigdy nie wróciło. Asystent wykonuje kroki, a człowiek zatwierdza wynik.",
      metaDescription:
        "Asystenci, którzy wykonują powtarzalne kroki w narzędziach, z których Twój zespół już korzysta, z człowiekiem zatwierdzającym wynik i czytelnym logiem wszystkiego, co zrobili.",
      whatTitle: "Co to jest",
      whatBody: [
        "Część pracy to nie przychodzący dokument. To krótki ciąg kroków, który powtarza się czterdzieści razy w tygodniu. Przychodzi zgłoszenie, ktoś sprawdza klienta, weryfikuje dwie rzeczy, pisze odpowiedź prawie taką samą jak poprzednio, aktualizuje rekord i ustawia przypomnienie, żeby dopytać o to, czego brakuje. Każdy krok jest łatwy. Zjada dzień dopiero cały ciąg.",
        "Asystent wykonuje ten ciąg i zatrzymuje się tam, gdzie potrzebna jest ocena. Przygotowuje treść, ale nie wysyła. Przygotowuje rekord, człowiek go zatwierdza. Wszystko, co zrobił, trafia do logu, który da się przeczytać, więc kiedy się pomyli, widzisz, który krok zawiódł, i poprawiasz ten krok, zamiast wyłączać całość i wracać do ręcznej roboty.",
      ],
      whatNote:
        "Nie budujemy asystenta, który za pierwszym razem działa sam. Zatwierdzenia zdejmujemy później, po jednym, kiedy log pokaże, że dany krok na to zasłużył.",
      doesTitle: "Co to robi",
      doesIntro:
        "Pięć nawyków, a piąty jest tym, który pozwala bezpiecznie utrzymać cztery pozostałe.",
      does: [
        {
          title: "Mieszka tam, gdzie praca już się dzieje",
          body: "We wspólnej skrzynce, w Teams albo Slacku, w CRM, w kolejce zgłoszeń. Nikt nie musi logować się do nowego systemu, żeby z niego skorzystać.",
        },
        {
          title: "Przygotowuje zamiast wysyłać",
          body: "Odpowiedzi, oferty, streszczenia, notatki wewnętrzne. Człowiek czyta i wysyła, i tak samo asystent się poprawia: poprawki są informacją zwrotną.",
        },
        {
          title: "Wyszukuje za Ciebie",
          body: "Zbiera klienta, zamówienie, umowę i ostatnią rozmowę w jednym miejscu, zanim ktokolwiek o to poprosi, więc człowiek zaczyna od pełnego obrazu zamiast go składać.",
        },
        {
          title: "Dopytuje o to, czego brakuje",
          body: "Dokument, który nigdy nie wrócił, zatwierdzenie, które utknęło, formularz z trzema pustymi polami. Uprzejmie, według harmonogramu, i przestaje w chwili, gdy rzecz przyjdzie.",
        },
        {
          title: "Zapisuje, co zrobił",
          body: "Każde uruchomienie, każdy krok, każdą decyzję, razem z tym, co weszło i co wyszło. To dzięki temu rozsądne jest danie mu więcej pracy w kolejnym miesiącu.",
        },
      ],
      getTitle: "Z czym zostajesz",
      getIntro:
        "Jeden asystent na prawdziwej pracy i mechanizmy, którymi poszerzasz albo zawężasz jego uprawnienia.",
      get: [
        {
          title: "Asystent wykonujący dwa albo trzy prawdziwe zadania",
          body: "Wybrane razem z zespołem, działające na bieżącej pracy, w narzędziu, które i tak mają otwarte cały dzień.",
        },
        {
          title: "Krok zatwierdzenia, który kontrolujesz",
          body: "Co może zrobić sam, a co wymaga człowieka, spisane i możliwe do zmiany bez programisty.",
        },
        {
          title: "Log i koszt jednego uruchomienia",
          body: "Co zrobił i ile to kosztowało. Automatyzacja o nieznanym koszcie utrzymania to niespodzianka czekająca na koniec kwartału.",
        },
        {
          title: "Kod, wdrożenie i przekazanie",
          body: "Twoje, z runbookiem i przejściem po całości z osobą, która przejmie to po naszym wyjściu.",
        },
      ],
      stepsTitle: "Jak to przebiega",
      steps: [
        {
          title: "Dzień obserwacji prawdziwej pracy",
          body: "Siadamy z osobą, która ją wykonuje. Spisany proces opisuje, co powinno się dziać; dzień obserwacji pokazuje, co się dzieje.",
        },
        {
          title: "Wybieramy dwa kroki",
          body: "Te dwa z największą powtarzalnością i najmniejszą liczbą decyzji, a nie te dwa, które najciekawiej się buduje.",
        },
        {
          title: "Budujemy z zatwierdzeniem w środku",
          body: "Od pierwszego dnia przygotowuje i proponuje. Nic nie wychodzi na zewnątrz nieprzeczytane przez człowieka.",
        },
        {
          title: "Poluzowujemy powoli",
          body: "Kiedy log pokaże, że dany krok jest prawie zawsze poprawny, ten krok przestaje wymagać kliknięcia. Po jednym i tylko za Twoją zgodą.",
        },
      ],
      whoTitle: "Dla kogo to jest",
      who: [
        {
          title: "Zespoły sprzedaży i obsługi",
          body: "To samo wyszukanie, ta sama odpowiedź, to samo przypomnienie, kilkadziesiąt razy w tygodniu.",
        },
        {
          title: "HR i rekrutacja",
          body: "Przesiew, umawianie terminów i to nieskończone dopytywanie o dokumenty, którego nikt nie lubi, a wszyscy potrzebują.",
        },
        {
          title: "Małe zespoły bez osoby od operacji",
          body: "Dziesięć osób wykonujących pracę dwudziestu, a administracja jest tym, co puszcza pierwsze.",
        },
      ],
      timeTitle: "Ile to kosztuje w czasie",
      timeIntro:
        "Czas kalendarzowy. Zmienną rzadko jest oprogramowanie, a zwykle to, jak szybko dostaniemy dostęp do narzędzi, których asystent ma dotykać.",
      time: [
        {
          span: "Tydzień 1",
          title: "Dzień obserwacji, potem lista",
          body: "Śledzimy prawdziwą pracę i wracamy z krokami, które warto zautomatyzować, oraz z tymi, których nie warto.",
        },
        {
          span: "Tygodnie 2 do 4",
          title: "Pierwsze dwa zadania, na żywo",
          body: "Działają na prawdziwej pracy z człowiekiem zatwierdzającym wszystko, wewnątrz Waszych obecnych narzędzi.",
        },
        {
          span: "Tygodnie 5 do 8",
          title: "Więcej zadań, mniej klikania",
          body: "Dokładamy zadania i zdejmujemy zatwierdzenia tam, gdzie log na to zapracował, a potem przekazujemy całość.",
        },
      ],
      relatedTitle: "Powiązane",
      related: [
        {
          title: "Automatyzacja dokumentów",
          body: "Kiedy pracą są przychodzące dokumenty, a nie powtarzające się kroki.",
          href: "/solutions/paperwork-automation",
        },
        {
          title: "Odpowiedzi z Twoich dokumentów",
          body: "Asystenci są lepsi, kiedy mogą czytać Twoje pliki. Te dwie rzeczy często budujemy razem.",
          href: "/solutions/answers-from-documents",
        },
        {
          title: "Forward deployed engineers",
          body: "Jeśli wolisz mieć inżyniera w zespole przez kilka miesięcy niż projekt o ustalonym zakresie.",
          href: "/services/forward-deployed-engineers",
        },
      ],
      cta: {
        title: "Opisz nam jeden dzień pracy, przy której chcesz pomocy",
        text: "Które czterdzieści minut schodzi na te same trzy kroki. To zwykle wystarczy, żebyśmy powiedzieli, czy warto budować asystenta.",
        button: "Umów rozmowę",
      },
    },

    forecastingAndReporting: {
      label: "Rozwiązania",
      title: "Prognozy i raporty",
      intro:
        "Liczby już są w Twoich systemach, w czterech różnych formach. Zbieramy je w jedno miejsce, ustalamy, co każda z nich znaczy, i sprawiamy, że miesięczny raport oraz prognoza składają się same.",
      metaDescription:
        "Jeden zestaw liczb, raport, który składa się sam, i prognoza, którą można podważyć. Pluscode łączy Twoje systemy, spisuje definicje i uzgadnia wynik z Twoimi własnymi zamknięciami.",
      whatTitle: "Co to jest",
      whatBody: [
        "Większość problemów z raportowaniem to nie są problemy analityczne. Ktoś w pierwszy poniedziałek miesiąca eksportuje trzy pliki, wkleja je do skoroszytu, który rośnie od sześciu lat, poprawia dwie kolumny, które zawsze się psują, i wysyła prezentację. Liczby zwykle są poprawne. Nikt nie umie dokładnie powiedzieć, skąd się wzięły, a jedyna osoba, która by umiała, jest na urlopie.",
        "My robimy tę mniej efektowną połowę. Podłączamy źródła, ustalamy jedną definicję dla każdej liczby, uzgadniamy wynik z danymi, którym już ufasz, a potem sprawiamy, że raport składa się sam. Prognoza przychodzi później i tylko dla tych liczb, dla których prognoza jest uczciwa. Części liczb przy Twojej skali nie da się sensownie prognozować i powiemy to, zamiast mimo wszystko rysować linię.",
      ],
      whatNote:
        "Budujemy też Quanty, nasz własny produkt dokładnie do tego: arkusz, który wczytuje dokumenty jako wiersze. Czasem właściwą odpowiedzią jest Quanty i żaden projekt, i wolimy to powiedzieć, niż sprzedać Ci wdrożenie.",
      doesTitle: "Co to robi",
      doesIntro:
        "Pięć kroków, a drugi z nich okazuje się zwykle najbardziej wartościowy.",
      does: [
        {
          title: "Zbiera liczby w jedno miejsce",
          body: "Księgowość, CRM, magazyn, bank i arkusz, który ktoś prowadzi ręcznie. To, co dziś trzyma prawdę, a nie to, co powinno.",
        },
        {
          title: "Ustala, co znaczy każda liczba",
          body: "Jedna definicja przychodu, jedna aktywnego klienta, jedna zrealizowanego zamówienia, spisane tam, gdzie wszyscy je widzą i mogą się o nie pokłócić raz, a nie co miesiąc.",
        },
        {
          title: "Uzgadnia z tym, czemu ufasz",
          body: "Nowe wartości porównujemy z Twoimi własnymi zamknięciami, zanim ktokolwiek ma na nich polegać. Różnicę się wyjaśnia, a nie zaokrągla.",
        },
        {
          title: "Sam składa raport",
          body: "Co miesiąc, co tydzień albo przy każdej zmianie danych. Ten sam układ, te same definicje i żadnego pierwszego poniedziałku miesiąca.",
        },
        {
          title: "Prognozuje, z widocznymi założeniami",
          body: "Jak wyglądają najbliższe miesiące, jeśli nic się nie zmieni, i na które założenia wynik jest wrażliwy. Prognoza, której nie da się podważyć, to zgadywanie z wykresem.",
        },
      ],
      getTitle: "Z czym zostajesz",
      getIntro:
        "Zestaw liczb, których obronisz na spotkaniu, i arkusz mówiący, jak liczy się każdą z nich.",
      get: [
        {
          title: "Jeden połączony zestaw liczb",
          body: "Odświeżany według harmonogramu, z nazwanym źródłem i przekształceniami czytelnymi dla kogoś, kto nie jest inżynierem.",
        },
        {
          title: "Spisany arkusz definicji",
          body: "Każda miara, jej wzór, jej źródło i osoba, która decyduje, kiedy trzeba ją zmienić.",
        },
        {
          title: "Cykliczny raport",
          body: "Budowany i dostarczany według harmonogramu, w formie, którą Twój zarząd albo zespół i tak już czyta.",
        },
        {
          title: "Prognoza i jej założenia",
          body: "Razem z założeniami, których nie udało się obronić, i powodem, dla którego te liczby zostały pominięte.",
        },
      ],
      stepsTitle: "Jak to przebiega",
      steps: [
        {
          title: "Ustalamy dziesięć liczb",
          body: "Te, od których naprawdę zależy decyzja. Raport z sześćdziesięcioma liczbami to raport, którego nikt nie czyta do końca.",
        },
        {
          title: "Podłączamy i uzgadniamy",
          body: "Ściągamy źródła i dopasowujemy wynik do Twoich zamknięć, aż każda różnica będzie wyjaśniona.",
        },
        {
          title: "Publikujemy raport",
          body: "Automatycznie, według harmonogramu, w formie, której ludzie się spodziewają. Zmiana powinna być niewidoczna poza tym, że raport po prostu przychodzi.",
        },
        {
          title: "Dokładamy prognozę",
          body: "Tylko tam, gdzie historia ją uzasadnia, i zawsze z założeniami wypisanymi obok liczby.",
        },
      ],
      whoTitle: "Dla kogo to jest",
      who: [
        {
          title: "Zespoły finansowe zamykające ręcznie",
          body: "Koniec miesiąca to trzy dni kopiowania, a większość z nich to te same trzy dni co poprzednio.",
        },
        {
          title: "Założyciele i zarządy",
          body: "Potrzebujesz jednej strony miesięcznie, która co miesiąc jest tą samą stroną i wytrzymuje trudne pytanie.",
        },
        {
          title: "Operacje z liczbami w czterech systemach",
          body: "Stany w jednym miejscu, zamówienia w drugim, dostawy w trzecim i żadnego widoku, który to spina.",
        },
      ],
      timeTitle: "Ile to kosztuje w czasie",
      timeIntro:
        "Czas kalendarzowy, przy dostępie do odczytu systemów i kimś, kto odpowie, co naprawdę oznacza dana kolumna.",
      time: [
        {
          span: "Tygodnie 1 do 2",
          title: "Definicje i źródła",
          body: "Ustalamy liczby i sprawdzamy, skąd naprawdę pochodzi każda z nich. To zwykle najbardziej zaskakująca część.",
        },
        {
          span: "Tygodnie 3 do 5",
          title: "Podłączone i uzgodnione",
          body: "Pipeline działa, a wartości zgadzają się z tym, czym już zamykasz miesiąc.",
        },
        {
          span: "Tygodnie 6 do 8",
          title: "Raport, potem prognoza",
          body: "Cykliczny raport rusza, a prognoza dochodzi, kiedy liczbom bazowym można już ufać.",
        },
      ],
      relatedTitle: "Powiązane",
      related: [
        {
          title: "Quanty",
          body: "Nasz własny produkt. Jeśli Twoje liczby przychodzą jako dokumenty, a nie jako dane, zacznij tutaj.",
          href: "/quanty",
        },
        {
          title: "Automatyzacja dokumentów",
          body: "Kiedy liczby przychodzą jako faktury i listy przewozowe, które ktoś przepisuje.",
          href: "/solutions/paperwork-automation",
        },
        {
          title: "Analityka danych",
          body: "Inżynierska wersja tej strony, napisana dla technicznego czytelnika.",
          href: "/ai-data/analytics",
        },
      ],
      cta: {
        title: "Przyślij nam raport z zeszłego miesiąca",
        text: "Skoroszyt, prezentację, cokolwiek naprawdę wysyłasz. Powiemy, co mogłoby składać się samo, a co byłoby prawdziwą pracą.",
        button: "Umów rozmowę",
      },
    },

    processMapping: {
      label: "Rozwiązania",
      title: "Mapowanie procesów",
      intro:
        "Zanim ktokolwiek napisze kod, dwa dni z ludźmi, którzy wykonują pracę. Dostajesz mapę tego, jak to naprawdę działa, wycenioną listę tego, co warto zautomatyzować, i jasną listę tego, czego nie.",
      metaDescription:
        "Dwa dni z Twoim zespołem, a potem wyceniona lista tego, co warto zautomatyzować i czego nie. Zlecenie za ustaloną cenę od Pluscode, zaliczane na poczet wdrożenia.",
      whatTitle: "Co to jest",
      whatBody: [
        "Wielu firmom mówi się, żeby zrobiły coś z AI, i nie mają dobrego sposobu, żeby zdecydować co. Presja jest prawdziwa, budżet bywa już zatwierdzony, a lista, która przychodzi od dostawcy, to lista rzeczy, które ten dostawca akurat sprzedaje. Brakuje jasnego obrazu tego, gdzie naprawdę idą godziny.",
        "To jest ten obraz i celowo nie jest to ćwiczenie sprzedażowe. Siadamy z ludźmi, którzy wykonują pracę, liczymy, gdzie idzie czas, wyceniamy każdego kandydata i oddajemy Ci uszeregowaną listę z szacunkiem i zwrotem dla każdej pozycji. Kilka pozycji zwykle wraca z adnotacją, żeby tego nie automatyzować, i jest to warte tyle samo co te pozostałe.",
      ],
      whatNote:
        "Ustalona cena, uzgodniona przed startem i zaliczana na poczet wdrożenia, jeśli pójdziesz dalej z nami. Jeśli uczciwą odpowiedzią jest, że nic tu nie warto budować, mapę i liczby i tak zachowujesz.",
      doesTitle: "Co to robi",
      doesIntro: "Pięć rzeczy, a ostatnią dostawcy zwykle pomijają.",
      does: [
        {
          title: "Śledzi pracę, nie opis procesu",
          body: "Patrzymy, jak robota jest wykonywana. Spisany proces i ten prawdziwy rzadko są tym samym, a różnica między nimi to miejsce, w którym chowają się godziny.",
        },
        {
          title: "Liczy godziny",
          body: "Jak często zdarza się każdy krok, ile trwa, kto go robi i ile kosztuje, kiedy pójdzie źle i trzeba go powtórzyć.",
        },
        {
          title: "Wycenia każdego kandydata",
          body: "Ile zajęłoby zbudowanie, ile kosztowałoby utrzymanie i ile by oszczędziło. W tych samych jednostkach, żeby dwóch kandydatów dało się naprawdę porównać.",
        },
        {
          title: "Szereguje uczciwie",
          body: "Najtańsza użyteczna rzecz na górze. Efektowny projekt, który zwraca się po trzech latach, ląduje na dole, gdzie jego miejsce.",
        },
        {
          title: "Mówi, czego nie ruszać",
          body: "Pracy z dużym udziałem oceny, ze zbyt małym wolumenem albo z takim ogonem regulacyjnym, że automatyzacja staje się droższą opcją.",
        },
      ],
      getTitle: "Z czym zostajesz",
      getIntro:
        "Cztery dokumenty, wszystkie na tyle krótkie, żeby ktoś je przeczytał.",
      get: [
        {
          title: "Mapa procesu takiego, jaki jest",
          body: "Kroki, systemy, przekazania i czas oczekiwania, na jednej stronie, językiem, w którym ludzie wykonujący tę pracę rozpoznają swoją robotę.",
        },
        {
          title: "Uszeregowana i wyceniona lista",
          body: "Każda pozycja z szacunkiem budowy, kosztem utrzymania, spodziewaną oszczędnością i okresem zwrotu.",
        },
        {
          title: "Notatka o ryzyku wobec unijnego AI Act",
          body: "W której kategorii mieści się każdy kandydat i co to oznacza w praktyce, ustalone zanim cokolwiek zostanie zaprojektowane.",
        },
        {
          title: "Spisana rekomendacja",
          body: "Na tyle krótka, żeby zanieść ją zarządowi, na tyle konkretna, żeby działać, i wskazująca, czego byśmy nie robili i dlaczego.",
        },
      ],
      stepsTitle: "Jak to przebiega",
      steps: [
        {
          title: "Pół dnia na ustalenie zakresu",
          body: "Która część firmy, które zespoły i jak wyglądałby dobry wynik. Ta część spokojnie może być zdalna.",
        },
        {
          title: "Dwa dni z zespołami",
          body: "Na miejscu albo na rozmowie, z ludźmi, którzy wykonują pracę, a nie tylko z tymi, którzy nią zarządzają.",
        },
        {
          title: "Tydzień wyceny",
          body: "Zamieniamy to, co zobaczyliśmy, w szacunki i na bieżąco sprawdzamy z Tobą założenia, żeby nic w podsumowaniu nie było zaskoczeniem.",
        },
        {
          title: "Podsumowanie",
          body: "Przechodzimy z całą salą przez mapę, listę i rekomendację i odpowiadamy na trudne pytania na żywo.",
        },
      ],
      whoTitle: "Dla kogo to jest",
      who: [
        {
          title: "Firmy, którym kazano zrobić coś z AI",
          body: "Presja jest prawdziwa, a w budynku nie ma listy, której ktokolwiek naprawdę ufa.",
        },
        {
          title: "Zespoły z budżetem i bez planu",
          body: "Pieniądze są zatwierdzone na ten rok, a prawdziwym ryzykiem jest wydanie ich dobrze, ale na niewłaściwą rzecz.",
        },
        {
          title: "Każdy przed podpisaniem umowy z dużym dostawcą",
          body: "Druga opinia o tym, ile ta praca jest warta, od ludzi, którzy powiedzą też: kup, zamiast budować.",
        },
      ],
      timeTitle: "Ile to kosztuje w czasie",
      timeIntro:
        "Dwa do trzech tygodni od początku do końca. Jedyne, czego potrzebujemy od Ciebie, to dostęp do ludzi wykonujących pracę.",
      time: [
        {
          span: "Tydzień 1",
          title: "Zakres i dni z zespołami",
          body: "Pół dnia na ustalenie zakresu, a potem dwa dni śledzenia pracy tak, jak jest naprawdę wykonywana.",
        },
        {
          span: "Tydzień 2",
          title: "Wycena i redakcja",
          body: "Szacujemy, sprawdzamy z Tobą założenia i spisujemy całość.",
        },
        {
          span: "Tydzień 3",
          title: "Podsumowanie i decyzja",
          body: "Dostajesz mapę, listę i rekomendację oraz spotkanie, na którym możesz się z wszystkimi trzema pokłócić.",
        },
      ],
      relatedTitle: "Powiązane",
      related: [
        {
          title: "Warsztaty",
          body: "Krótsza wersja: jeden dzień z Twoim zespołem nad jednym procesem.",
          href: "/workshops",
        },
        {
          title: "Zarządzanie danymi",
          body: "Druga rzecz, którą warto ustalić, zanim ktokolwiek zacznie budować.",
          href: "/solutions/data-governance",
        },
        {
          title: "Doradztwo AI",
          body: "Dłuższe zlecenie, kiedy pytaniem jest mapa drogowa, a nie jeden proces.",
          href: "/ai-data/consulting",
        },
      ],
      cta: {
        title: "Powiedz nam, który zespół tonie",
        text: "Jeden dział, jeden proces. Powiemy, co obejmie mapowanie i ile będzie kosztowało, zanim się do czegokolwiek zobowiążesz.",
        button: "Umów rozmowę",
      },
    },

    dataGovernance: {
      label: "Rozwiązania",
      title: "Zarządzanie danymi",
      intro:
        "Gdzie leżą dane, kto może je zobaczyć, jak długo są przechowywane i co unijny AI Act mówi o tym, co budujesz. Ustalone przed pierwszą linią kodu, a nie po tym, jak przyjdzie ankieta bezpieczeństwa.",
      metaDescription:
        "RODO, kategorie ryzyka unijnego AI Act, reguły dostępu i retencja dla projektów AI. Hosting w UE domyślnie i umowa powierzenia podpisana, zanim ruszą jakiekolwiek dane.",
      whatTitle: "Co to jest",
      whatBody: [
        "Pytanie, które zatrzymuje projekt AI, prawie nigdy nie jest techniczne. To ankieta bezpieczeństwa od klienta, rada pracownicza pytająca, gdzie trafiają dane, prawnik pytający, w której kategorii ryzyka to się mieści, albo członek zarządu pytający, co się stanie, jeśli system pomyli się co do konkretnej osoby. Te pytania przychodzą późno i przychodzą naraz.",
        "To jest praca polegająca na odpowiedzeniu na nie, zanim padną. Skąd bierze się każdy kawałek danych i gdzie kończy, na jakiej podstawie prawnej się przemieszcza, kto co może zobaczyć, jak długo cokolwiek jest trzymane i czego unijny AI Act wymaga od konkretnego systemu, który budujesz. To nie jest dokument polityki, którego nikt nie czyta. To zestaw decyzji, spisanych tak, żeby dało się pod nie napisać oprogramowanie.",
      ],
      whatNote:
        "Hosting w UE domyślnie i umowa powierzenia podpisana, zanim czegokolwiek dotkniemy. Kategorię ryzyka wobec AI Act ustalamy przed projektowaniem, bo to ona zmienia, co trzeba zbudować.",
      doesTitle: "Co to robi",
      doesIntro:
        "Pięć pytań, na które odpowiadamy raz, w formie, którą podpisze Twój dział prawny, a wdrożą inżynierowie.",
      does: [
        {
          title: "Mapuje dane, których dotyka system",
          body: "Każde źródło, każde pole, które jest danymi osobowymi, i każde miejsce, w którym ląduje kopia, łącznie z kopiami, których nikt nie zamierzał tworzyć.",
        },
        {
          title: "Ustala podstawę prawną i papiery",
          body: "Umowa powierzenia, podprocesorzy, transfery i rejestr, który musisz prowadzić. Napisane tak, żeby dział prawny mógł podpisać, a nie jako szablon do uzupełnienia później.",
        },
        {
          title: "Klasyfikuje system wobec unijnego AI Act",
          body: "Która kategoria, czego to wymaga w praktyce i co trzeba by zrobić, żeby nie wejść w cięższą kategorię, tam gdzie to realna opcja.",
        },
        {
          title: "Określa, kto co może zobaczyć",
          body: "Model dostępu pasujący do tego, jak firma naprawdę pracuje, i plan na dzień, w którym ktoś zmienia rolę albo odchodzi.",
        },
        {
          title: "Ustawia retencję, usuwanie i logowanie",
          body: "Jak długo trzymamy, jak realizuje się żądanie usunięcia od początku do końca i co jest logowane, żeby na audyt odpowiedzieć dowodami zamiast zapewnieniami.",
        },
      ],
      getTitle: "Z czym zostajesz",
      getIntro:
        "Dokumenty odpowiadające na pytania, zanim padną, i reguły, które żyją w oprogramowaniu, a nie w folderze.",
      get: [
        {
          title: "Mapa danych i rejestr",
          body: "Czego dotyka system, gdzie to leży, kto to przetwarza i na jakiej podstawie.",
        },
        {
          title: "Podpisane papiery",
          body: "Umowa powierzenia, lista podprocesorów i stanowisko wobec transferów, gotowe dla Twojego działu prawnego.",
        },
        {
          title: "Spisana klasyfikacja wobec AI Act",
          body: "Kategoria, uzasadnienie i wynikające z niej obowiązki, językiem, na podstawie którego nie-prawnik potrafi działać.",
        },
        {
          title: "Macierz dostępu i harmonogram retencji",
          body: "Kto co widzi, jak długo i co system robi automatycznie, kiedy odpowiedź się zmienia.",
        },
      ],
      stepsTitle: "Jak to przebiega",
      steps: [
        {
          title: "Jeden system naraz",
          body: "Porządkujemy to, co jest budowane, a nie całą firmę. Program obejmujący całą organizację trwa rok i przez ten rok nie chroni niczego.",
        },
        {
          title: "Idziemy za danymi",
          body: "Źródła, kopie, backupy, logi i strony trzecie. Kopie, o których nikt nie pamięta, to te, które powodują incydent.",
        },
        {
          title: "Decydujemy i spisujemy",
          body: "Każda decyzja dostaje właściciela i datę. Otwarte pytanie jest w porządku; nieudokumentowane założenie nie jest.",
        },
        {
          title: "Wbudowujemy w system",
          body: "Reguły dostępu, retencja i logowanie stają się konfiguracją i kodem, a nie obietnicą w dokumencie.",
        },
      ],
      whoTitle: "Dla kogo to jest",
      who: [
        {
          title: "Branże regulowane",
          body: "Finanse, zdrowie i wszystko, gdzie audytor Twojego klienta w końcu staje się Twoim audytorem.",
        },
        {
          title: "Firmy odpowiadające na ankiety bezpieczeństwa",
          body: "Duzi klienci pytają. Odpowiedzi powinny istnieć, zanim zależy od nich transakcja.",
        },
        {
          title: "Każdy przed podpisaniem umowy z dostawcą AI",
          body: "Gdzie trafiają dane, co na nich trenuje i co się dzieje, kiedy odchodzisz. Warte godziny przed podpisem.",
        },
      ],
      timeTitle: "Ile to kosztuje w czasie",
      timeIntro:
        "Czas kalendarzowy dla jednego systemu. Krócej, jeśli system jeszcze nie działa, co jest też najtańszym momentem na tę pracę.",
      time: [
        {
          span: "Tydzień 1",
          title: "Mapa i pytania",
          body: "Idziemy za danymi przez system i wracamy z pytaniami, na które tylko Ty możesz odpowiedzieć.",
        },
        {
          span: "Tygodnie 2 do 3",
          title: "Decyzje i klasyfikacja",
          body: "Podstawa prawna, kategoria wobec AI Act, dostęp i retencja, spisane z właścicielem przy każdej pozycji.",
        },
        {
          span: "Tygodnie 4 do 5",
          title: "Wbudowane",
          body: "Reguły stają się konfiguracją i kodem, a papiery trafiają do Twojego działu prawnego.",
        },
      ],
      relatedTitle: "Powiązane",
      related: [
        {
          title: "Mapowanie procesów",
          body: "Druga rzecz, którą warto ustalić, zanim ktokolwiek zacznie budować.",
          href: "/solutions/process-mapping",
        },
        {
          title: "Chmura i MLOps",
          body: "Miejsce, w którym hosting w UE, kontrola dostępu i logowanie naprawdę się wdraża.",
          href: "/services/cloud",
        },
        {
          title: "Doradztwo AI",
          body: "Kiedy pytaniem jest mapa drogowa dla całej firmy, a nie jeden system.",
          href: "/ai-data/consulting",
        },
      ],
      cta: {
        title: "Przyślij nam ankietę, na której utknąłeś",
        text: "Albo klauzulę, którą klient dopisał w ostatniej chwili. Trzydzieści minut zwykle wystarczy, żeby powiedzieć, na co trzeba odpowiedzieć i w jakiej kolejności.",
        button: "Umów rozmowę",
      },
    },
  },
};

/* ------------------------------------------------------------------ *
 *  DEUTSCH. Sie-Form, wie im ganzen de.json.
 * ------------------------------------------------------------------ */
const de: SolutionsContent = {
  index: {
    label: "Lösungen",
    allLabel: "Alle Lösungen",
    title: "Arbeit, die wir von Ihrem Schreibtisch nehmen",
    intro:
      "Sechs Dinge, nach denen Unternehmen uns am häufigsten fragen. Jedes beginnt mit Papierkram, den heute jemand von Hand erledigt, und endet mit Software, die ihn erledigt, während ein Mensch das Ergebnis prüft.",
    metaDescription:
      "Sechs praktische Lösungen von Pluscode: Dokumentenautomatisierung, Antworten aus Ihren Dokumenten, Assistenten, Prognosen und Reporting, Prozessaufnahme und Data Governance. Hosting in der EU als Standard.",
    listTitle: "Wo Sie anfangen",
    listIntro:
      "Die meisten Unternehmen kommen mit einem dieser Themen. Wenn zwei davon auf Sie zutreffen, beginnen Sie mit dem, das am Montagmorgen wehtut.",
    items: [
      {
        key: "paperworkAutomation",
        slug: "paperwork-automation",
        name: "Dokumentenautomatisierung",
        teaser:
          "Dokumente kommen an, werden gelesen, geprüft und landen im richtigen System. Niemand tippt etwas ab.",
      },
      {
        key: "answersFromDocuments",
        slug: "answers-from-documents",
        name: "Antworten aus Ihren Dokumenten",
        teaser:
          "Stellen Sie eine Frage in normaler Sprache und erhalten Sie die Antwort aus Ihren eigenen Dateien, mit der Seite, aus der sie stammt.",
      },
      {
        key: "assistantsAndAutomation",
        slug: "assistants-and-automation",
        name: "Assistenten und Automatisierung",
        teaser:
          "Ein Assistent, der die wiederkehrenden Schritte in Ihren Werkzeugen erledigt und für die Freigabe durch einen Menschen anhält.",
      },
      {
        key: "forecastingAndReporting",
        slug: "forecasting-and-reporting",
        name: "Prognosen und Reporting",
        teaser:
          "Ihre Zahlen an einem Ort, ein Monatsbericht, der sich selbst baut, und ein Blick auf das, was kommt.",
      },
      {
        key: "processMapping",
        slug: "process-mapping",
        name: "Prozessaufnahme",
        teaser:
          "Zwei Tage bei den Menschen, die die Arbeit machen, danach eine kalkulierte Liste dessen, was sich zu automatisieren lohnt.",
      },
      {
        key: "dataGovernance",
        slug: "data-governance",
        name: "Data Governance",
        teaser:
          "Wo die Daten liegen, wer sie sehen darf und was der EU AI Act zu dem sagt, was Sie bauen.",
      },
    ],
    startTitle: "Wie eine Zusammenarbeit beginnt",
    startIntro:
      "Jedes Mal dieselben drei Schritte, welche der sechs Lösungen Sie auch wählen.",
    start: [
      {
        title: "Ein Gespräch mit einem Ingenieur",
        body: "Dreißig Minuten. Sie beschreiben die Arbeit, wir sagen, was wir bauen würden, was nicht, und wie lange es ungefähr dauert. Ohne Foliensatz und ohne Vertrieb dazwischen.",
      },
      {
        title: "Ein kleiner, fest umrissener Schritt",
        body: "Fast jedes Projekt beginnt mit einem abgegrenzten ersten Schritt: eine Dokumentenart, eine Sammlung von Dateien, ein Bericht. Fester Umfang, fester Preis, damit die erste Rechnung nie eine Überraschung ist.",
      },
      {
        title: "Eine Entscheidung, die Sie zurücknehmen können",
        body: "Wenn sich der erste Schritt nicht rechnet, hören Sie dort auf. Die Aufnahme, die Messungen und den Code behalten Sie in jedem Fall.",
      },
    ],
    elsewhereTitle: "Nicht das, was Sie suchen?",
    elsewhere: [
      {
        title: "Technik",
        body: "Individuelle Software, MVPs, Cloud und ein Ingenieur, der für einige Monate in Ihrem Team arbeitet.",
        href: "/services",
      },
      {
        title: "Quanty",
        body: "Unser eigenes Produkt, von uns gebaut: eine Tabelle, die Ihre Dokumente als Zeilen einliest.",
        href: "/quanty",
      },
      {
        title: "Workshops",
        body: "Ein Tag mit Ihrem Team an einem Prozess, wenn Sie das Denken vor dem Projekt wollen.",
        href: "/workshops",
      },
    ],
    cta: {
      title: "Erzählen Sie uns, wie der Papierkram aussieht",
      text: "Dreißig Minuten mit einem Ingenieur, nicht mit dem Vertrieb. Bringen Sie einen Prozess mit, und wir sagen Ihnen, ob Software ihn überhaupt anfassen sollte.",
      button: "Gespräch buchen",
    },
  },
  pages: {
    paperworkAutomation: {
      label: "Lösungen",
      title: "Dokumentenautomatisierung",
      intro:
        "Rechnungen, Lieferscheine, Bestellungen und Formulare kommen den ganzen Tag an. Software kann sie lesen, gegen Ihre Regeln prüfen und dorthin legen, wo sie hingehören, während ein Mensch nur noch die Fälle ansieht, die einen Menschen brauchen.",
      metaDescription:
        "Automatisieren Sie die Dokumente, die täglich ankommen. Pluscode baut Eingang, Auslesen, Prüfungen und Verbuchung für Rechnungen, Lieferscheine, Bestellungen und Formulare. Hosting in der EU als Standard.",
      whatTitle: "Worum es geht",
      whatBody: [
        "Jedes Unternehmen hat einen Schreibtisch, auf dem Dokumente landen. Sie kommen per Mail, per Post, aus einem Lieferantenportal, als Foto eines Lieferscheins vom Hof. Jemand öffnet jedes einzelne, liest vier oder fünf Zahlen ab, tippt sie in ein anderes System und legt es ab. Es ist stille, ununterbrochene Arbeit, und sie ist das Erste, was kippt, wenn die Person, die sie macht, eine Woche frei nimmt.",
        "Wir bauen das Stück dazwischen. Die Dokumente kommen weiter so an, wie sie ohnehin ankommen. Software liest sie, prüft sie gegen das, was Sie bereits wissen, und bucht sie in Ihr System. Was sie nicht sicher lesen kann, landet in einer kurzen Warteschlange für einen Menschen, und genau darum geht es: Das Ziel sind nicht null Menschen, sondern eine Person, die zehn Dokumente am Tag ansieht statt dreihundert.",
      ],
      whatNote:
        "Pluscode, aus Poznan, tätig in ganz Europa. Ihre Dokumente bleiben auf europäischer Infrastruktur, und der Auftragsverarbeitungsvertrag ist unterschrieben, bevor wir die erste Datei sehen.",
      doesTitle: "Was es tut",
      doesIntro: "Fünf Schritte, und jeder davon ist überprüfbar.",
      does: [
        {
          title: "Nimmt die Dokumente an",
          body: "Ein Postfach, ein geteilter Ordner, ein Lieferantenportal, ein Scanner, eine Handykamera. Wir schließen an das an, was Sie heute nutzen, statt Ihre Lieferanten um einen anderen Versandweg zu bitten.",
        },
        {
          title: "Liest die Felder, auf die es ankommt",
          body: "Lieferant, Daten, Positionen, Summen, Steuer, Referenznummern. Die Liste stimmen wir vorher mit Ihnen ab, denn ein Feld, das niemand nutzt, ist ein Feld, das niemand prüft.",
        },
        {
          title: "Prüft gegen Ihre Regeln",
          body: "Geht die Summe auf. Ist der Lieferant bekannt. Existiert die Bestellung. Ist das dasselbe Dokument, das schon am Dienstag kam. Die Regeln sind Ihre und sie stehen in klarer Sprache geschrieben.",
        },
        {
          title: "Legt es dorthin, wo es hingehört",
          body: "In Ihre Buchhaltung, Ihr ERP, Ihr Archiv oder in eine Tabelle, wenn Sie wirklich damit arbeiten. Das Originaldokument bleibt am erzeugten Datensatz hängen.",
        },
        {
          title: "Gibt den Rest an einen Menschen",
          body: "Alles Unklare geht in eine Warteschlange, links das Dokument, rechts das Gelesene, sodass eine Korrektur Sekunden dauert. Jede Korrektur verbessert den nächsten Stapel.",
        },
      ],
      getTitle: "Was am Ende bei Ihnen bleibt",
      getIntro:
        "Laufende Software und genug Dokumentation, dass jemand außer uns sie weiterbetreiben kann.",
      get: [
        {
          title: "Ein laufender Eingang für eine Dokumentenart",
          body: "Live, angeschlossen an Ihr echtes Postfach oder Ihren Ordner, mit echten Dokumenten an dem Tag, an dem wir fertig sind.",
        },
        {
          title: "Die Ausnahme-Warteschlange",
          body: "Ein Bildschirm, auf dem ein Mensch klärt, was die Software nicht raten wollte. Gebaut für die Person, die diese Arbeit heute macht, nicht für eine Administration.",
        },
        {
          title: "Ein Genauigkeitsbericht auf Ihren eigenen Dokumenten",
          body: "Gemessen an einer Stichprobe, die Sie wählen, Feld für Feld, damit Sie wissen, wo es stark ist und wo ein Mensch weiterhin hinsehen muss.",
        },
        {
          title: "Code, Deployment und Übergabe",
          body: "Ihres, in Ihrem Repository, laufend in Ihrem Cloud-Konto oder in unserem, mit schriftlichem Runbook und einem Durchgang für die Person, die es übernimmt.",
        },
      ],
      stepsTitle: "Wie es abläuft",
      steps: [
        {
          title: "Eine Dokumentenart",
          body: "Wir nehmen die mit dem höchsten Volumen und der geringsten Vielfalt. Alles auf einmal abzudecken ist der zuverlässigste Weg, nichts fertigzustellen.",
        },
        {
          title: "Eine Stichprobe echter Dokumente",
          body: "Einige hundert von Ihnen, samt der hässlichen: schiefe Scans, Handschrift, der Lieferant, der im Frühjahr sein Layout geändert hat.",
        },
        {
          title: "Bauen und messen",
          body: "Wir bauen das Auslesen und die Prüfungen und messen sie an der Stichprobe. Sie sehen die Zahlen, bevor irgendetwas Ihre Systeme berührt.",
        },
        {
          title: "Erst parallel, dann umschalten",
          body: "Es läuft einige Wochen neben dem bisherigen Prozess, und beide werden verglichen. Sie schalten um, wenn der Vergleich es sagt, nicht wenn wir sagen, wir seien fertig.",
        },
      ],
      whoTitle: "Für wen das ist",
      who: [
        {
          title: "Finanz- und Backoffice-Teams",
          body: "Kreditorenbuchhaltung, Auftragserfassung, Schadenannahme. Überall dort, wo ein Mensch die Verbindung zwischen Postfach und System ist.",
        },
        {
          title: "Unternehmen, die schneller wachsen als ihre Verwaltung",
          body: "Das Volumen hat sich verdoppelt, die Stellen nicht, und der Rückstand ist inzwischen für Kunden sichtbar.",
        },
        {
          title: "Teams mit einer Person, die weiß, wie es geht",
          body: "Der Prozess lebt in einem Kopf, und alle sorgen sich still um die Woche, in der diese Person fehlt.",
        },
      ],
      timeTitle: "Was es an Zeit kostet",
      timeIntro:
        "Kalenderzeit, vorausgesetzt wir bekommen eine Stichprobe von Dokumenten und eine halbe Stunde pro Woche von der Person, die die Arbeit heute macht.",
      time: [
        {
          span: "Woche 1",
          title: "Stichprobe und Umfang",
          body: "Wir sehen echte Dokumente an, stimmen Felder und Regeln ab und sagen ehrlich, wenn sich eines davon nicht zu automatisieren lohnt.",
        },
        {
          span: "Woche 2 bis 4",
          title: "Ein laufender Pilot",
          body: "Auslesen, Prüfungen und Ausnahme-Warteschlange, laufend auf Ihrer Stichprobe, mit gemessener Genauigkeit.",
        },
        {
          span: "Woche 5 bis 8",
          title: "Angeschlossen und live",
          body: "In Ihre Systeme eingebunden, parallel zum bisherigen Prozess betrieben und dann umgeschaltet, mit schriftlicher Übergabe.",
        },
      ],
      relatedTitle: "Verwandt",
      related: [
        {
          title: "Antworten aus Ihren Dokumenten",
          body: "Sobald die Dokumente lesbar sind, folgt meist die Frage, wie man sie etwas fragt.",
          href: "/solutions/answers-from-documents",
        },
        {
          title: "Assistenten und Automatisierung",
          body: "Wenn die Arbeit kein einzelnes Dokument ist, sondern eine Folge von Schritten über mehrere Werkzeuge.",
          href: "/solutions/assistants-and-automation",
        },
        {
          title: "Softwareentwicklung",
          body: "Falls das System, in dem die Dokumente landen sollen, noch gar nicht existiert.",
          href: "/services/software-development",
        },
      ],
      cta: {
        title: "Schicken Sie uns fünf Ihrer Dokumente",
        text: "Echte, mit allem Durcheinander. Wir sagen Ihnen, was Software daraus lesen könnte und was nicht, bevor Sie Geld ausgeben.",
        button: "Gespräch buchen",
      },
    },

    answersFromDocuments: {
      label: "Lösungen",
      title: "Antworten aus Ihren Dokumenten",
      intro:
        "Ihre Verträge, Richtlinien und Handbücher enthalten die Antwort bereits. Stellen Sie die Frage in normaler Sprache und bekommen Sie sie zurück, samt der Seite, aus der sie stammt, damit jeder sie prüfen kann.",
      metaDescription:
        "Fragen Sie Ihre eigenen Dokumente und erhalten Sie eine überprüfbare Antwort mit Quelle. Pluscode baut Suche und Antworten auf Ihren Dateien, mit Ihren Berechtigungen und Hosting in der EU.",
      whatTitle: "Worum es geht",
      whatBody: [
        "Unternehmen verlieren selten Wissen. Sie verlieren den Weg dorthin. Die Klausel steht in einem Vertrag, den jemand vor vier Jahren unterschrieben hat, die Vorgehensweise in einem Handbuch, das in drei Fassungen kursiert, und die Antwort auf die heutige Kundenfrage gab ein Kollege im März in einer Mail. Das zu finden dauert zwanzig Minuten, und zu wissen, dass es existiert, kostet Jahre an Erfahrung.",
        "Das hier ist ein Suchfeld, das in Sätzen antwortet statt Dateien aufzulisten, und das zeigt, woher jeder Satz stammt. Es nutzt Ihre Dokumente und sonst nichts. Wenn Ihre Dokumente die Frage nicht beantworten, sagt es das, und genau das ist das Wichtigste daran: Ein Assistent, der rät, ist schlechter als gar keiner, weil die Leute aufhören ihn zu prüfen.",
      ],
      whatNote:
        "Es antwortet aus Ihren Dateien und zitiert sie, sodass jede Antwort mit einem Klick überprüfbar ist. Wir testen es an echten Fragen mit bekannten Antworten, bevor es jemand anderes sieht, und die Dateien bleiben auf europäischer Infrastruktur.",
      doesTitle: "Was es tut",
      doesIntro: "Eine Frage hinein, eine überprüfbare Antwort heraus.",
      does: [
        {
          title: "Nimmt die Frage so, wie ein Mensch sie stellt",
          body: "Keine Stichworte. Ob wir den Vertrag mit Müller vorzeitig beenden können und was das kostet, ist eine Frage, die es in einem Zug beantworten sollte.",
        },
        {
          title: "Antwortet ausschließlich aus Ihren Dokumenten",
          body: "Kein Allgemeinwissen und kein Füllen von Lücken. Steht die Antwort nicht in den Dateien, ist die Antwort, dass sie nicht darin steht.",
        },
        {
          title: "Zeigt die Quelle",
          body: "Jede Antwort trägt Dokument, Seite und Textstelle mit sich, sodass die lesende Person sie in Sekunden bestätigen kann.",
        },
        {
          title: "Respektiert, wer was sehen darf",
          body: "Es nutzt die Berechtigungen, die Sie bereits haben. Wer einen Ordner nicht öffnen kann, bekommt daraus auch keine Antworten, nur weil er freundlich fragt.",
        },
        {
          title: "Sagt Ihnen, was gefragt wird",
          body: "Eine Administrationsansicht der gestellten Fragen und derer, die es nicht beantworten konnte. Diese Liste ist die beste Landkarte der Lücken in Ihrer Dokumentation, die Sie bekommen werden.",
        },
      ],
      getTitle: "Was am Ende bei Ihnen bleibt",
      getIntro:
        "Ein Werkzeug, das ein Team bereits nutzt, und der Test, der sagt, ob man ihm trauen kann.",
      get: [
        {
          title: "Suche und Antworten über eine Sammlung",
          body: "Ein benannter Satz von Dokumenten: das Vertragsarchiv, die Richtliniensammlung, das Produkthandbuch, der Ausschreibungsordner.",
        },
        {
          title: "Ein Testsatz echter Fragen",
          body: "Rund vierzig Fragen der Menschen, die es nutzen werden, mit schriftlich festgehaltenen richtigen Antworten und einem Ergebnis. Bei jeder Änderung erneut ausgeführt.",
        },
        {
          title: "Das Berechtigungsmodell, schriftlich",
          body: "Wer was fragen darf, wie es durchgesetzt wird und was an dem Tag passiert, an dem jemand die Rolle wechselt oder geht.",
        },
        {
          title: "Code und Deployment",
          body: "Laufend auf europäischer Infrastruktur, in Ihrem Konto oder in unserem, mit Runbook und einer Sitzung für die Person, die es übernimmt.",
        },
      ],
      stepsTitle: "Wie es abläuft",
      steps: [
        {
          title: "Eine Sammlung wählen",
          body: "Ein Satz Dokumente mit einer Zielgruppe. Alles auf einmal ergibt einen Assistenten, der in allem mittelmäßig ist.",
        },
        {
          title: "Zuerst die Fragen aufschreiben",
          body: "Wir setzen uns mit den künftigen Nutzern zusammen und sammeln die echten Fragen samt der Antworten, von denen sie wissen, dass sie stimmen. Das ist der Test, und er existiert vor dem Bauen.",
        },
        {
          title: "Bauen und bewerten",
          body: "Wir bauen es, lassen die Fragen laufen und zeigen Ihnen das Ergebnis: wie oft es richtig liegt und wie oft es zu Recht keine Antwort gibt.",
        },
        {
          title: "Ein Team, dann breiter",
          body: "Es geht an ein Team, wir sehen zu, was gefragt wird, und beheben, was das Protokoll zeigt. Ein Rollout an alle am ersten Tag verdeckt die Probleme nur.",
        },
      ],
      whoTitle: "Für wen das ist",
      who: [
        {
          title: "Recht und Vertragsteams",
          body: "Hunderte Vereinbarungen, eine Handvoll Klauseln, auf die es ankommt, und Fragen, die immer auf Frist kommen.",
        },
        {
          title: "Support und Servicedesk",
          body: "Die Antwort steht im Handbuch. Schwierig ist, sie zu finden, während ein Kunde wartet.",
        },
        {
          title: "Angebots- und Ausschreibungsteams",
          body: "Jedes Angebot wiederholt etwas, das Sie einmal schon gut geschrieben haben. Hier steht es.",
        },
      ],
      timeTitle: "Was es an Zeit kostet",
      timeIntro:
        "Kalenderzeit, vorausgesetzt Zugriff auf die Dokumente und zwei Stunden von den Menschen, die es nutzen werden.",
      time: [
        {
          span: "Woche 1",
          title: "Fragen und Dokumente",
          body: "Wir sammeln die echten Fragen, sehen uns die Dateien an und sagen, welche Teile der Sammlung nutzbar sind und welche zuerst aufgeräumt werden müssen.",
        },
        {
          span: "Woche 2 bis 3",
          title: "Eine Version zum Ausprobieren",
          body: "Antwortet auf Ihren Dokumenten mit Quellen, bewertet an den Fragen aus Woche eins.",
        },
        {
          span: "Woche 4 bis 6",
          title: "Berechtigungen und Rollout",
          body: "An Ihre Zugriffsregeln angeschlossen, einem Team übergeben und dann an dem korrigiert, was tatsächlich gefragt wird.",
        },
      ],
      relatedTitle: "Verwandt",
      related: [
        {
          title: "Dokumentenautomatisierung",
          body: "Wenn die Dokumente noch nicht zuverlässig lesbar sind, ist das der Schritt davor.",
          href: "/solutions/paperwork-automation",
        },
        {
          title: "Data Governance",
          body: "Wer was sehen darf und was der EU AI Act dazu sagt, geklärt vor dem Bauen.",
          href: "/solutions/data-governance",
        },
        {
          title: "Machine Learning",
          body: "Die Technik darunter, wenn Sie die technische Fassung dieser Seite wollen.",
          href: "/ai-data/machine-learning",
        },
      ],
      cta: {
        title: "Bringen Sie uns zehn Fragen, die Sie nicht schnell beantworten können",
        text: "Echte Fragen von echten Menschen und die Dokumente, die die Antworten enthalten sollten. Wir sagen Ihnen, ob das auf Ihren Dateien funktioniert.",
        button: "Gespräch buchen",
      },
    },

    assistantsAndAutomation: {
      label: "Lösungen",
      title: "Assistenten und Automatisierung",
      intro:
        "Die Arbeit, die kein einzelnes Dokument ist, sondern eine Folge: Anfrage lesen, Datei suchen, Antwort entwerfen, Datensatz aktualisieren, dem nachgehen, was nie zurückkam. Ein Assistent macht die Schritte, ein Mensch gibt das Ergebnis frei.",
      metaDescription:
        "Assistenten, die die wiederkehrenden Schritte in den Werkzeugen erledigen, die Ihr Team ohnehin nutzt, mit menschlicher Freigabe und einem lesbaren Protokoll über alles, was sie getan haben.",
      whatTitle: "Worum es geht",
      whatBody: [
        "Manche Arbeit ist kein ankommendes Dokument. Sie ist eine kurze Kette von Schritten, die vierzig Mal pro Woche passiert. Eine Anfrage kommt, jemand sucht den Kunden heraus, prüft zwei Dinge, schreibt eine Antwort, die der letzten fast gleicht, aktualisiert einen Datensatz und setzt eine Erinnerung, um dem Fehlenden nachzugehen. Jeder Schritt ist leicht. Den Tag frisst die Kette.",
        "Ein Assistent erledigt die Kette und hält dort an, wo Urteilsvermögen nötig ist. Er entwirft, er sendet nicht. Er bereitet den Datensatz vor, ein Mensch bestätigt. Alles, was er getan hat, landet in einem lesbaren Protokoll, sodass Sie bei einem Fehler sehen, welcher Schritt danebenlag, und genau diesen Schritt korrigieren, statt das Ganze abzuschalten und wieder von Hand zu arbeiten.",
      ],
      whatNote:
        "Wir bauen keinen Assistenten, der beim ersten Mal allein handelt. Freigaben fallen später weg, eine nach der anderen, wenn das Protokoll zeigt, dass der Schritt es verdient hat.",
      doesTitle: "Was es tut",
      doesIntro:
        "Fünf Gewohnheiten, und die fünfte macht die anderen vier auf Dauer vertretbar.",
      does: [
        {
          title: "Lebt dort, wo die Arbeit ohnehin passiert",
          body: "Im gemeinsamen Postfach, in Teams oder Slack, im CRM, in der Ticketwarteschlange. Niemand muss sich in ein neues System einloggen.",
        },
        {
          title: "Entwirft, statt zu senden",
          body: "Antworten, Angebote, Zusammenfassungen, interne Notizen. Ein Mensch liest und sendet, und genau so wird es besser: Die Korrekturen sind die Rückmeldung.",
        },
        {
          title: "Erledigt das Nachschlagen",
          body: "Holt Kunde, Bestellung, Vertrag und letztes Gespräch zusammen, bevor jemand danach fragt, sodass die Person mit einem vollständigen Bild beginnt statt es erst zu bauen.",
        },
        {
          title: "Geht dem Fehlenden nach",
          body: "Das Dokument, das nie zurückkam, die Freigabe, die hängt, das Formular mit drei leeren Feldern. Höflich, nach Plan, und es hört auf, sobald die Sache da ist.",
        },
        {
          title: "Schreibt auf, was es getan hat",
          body: "Jeden Lauf, jeden Schritt, jede Entscheidung, mit Eingabe und Ergebnis. Das macht es vernünftig, ihm im nächsten Monat mehr zu übertragen.",
        },
      ],
      getTitle: "Was am Ende bei Ihnen bleibt",
      getIntro:
        "Ein Assistent an echter Arbeit und die Regler, mit denen Sie erweitern oder einschränken, was er darf.",
      get: [
        {
          title: "Ein Assistent, der zwei oder drei echte Aufgaben erledigt",
          body: "Gemeinsam mit dem Team gewählt, an laufender Arbeit, in dem Werkzeug, das ohnehin den ganzen Tag offen ist.",
        },
        {
          title: "Eine Freigabestufe, die Sie steuern",
          body: "Was er allein darf und was einen Menschen braucht, schriftlich festgehalten und ohne Entwickler änderbar.",
        },
        {
          title: "Das Protokoll und die Kosten pro Lauf",
          body: "Was er getan hat und was es gekostet hat. Automatisierung mit unbekannten Betriebskosten ist eine Überraschung, die auf das Quartalsende wartet.",
        },
        {
          title: "Code, Deployment und Übergabe",
          body: "Ihres, mit Runbook und einem Durchgang für die Person, die es nach uns übernimmt.",
        },
      ],
      stepsTitle: "Wie es abläuft",
      steps: [
        {
          title: "Einen Tag echte Arbeit mitverfolgen",
          body: "Wir sitzen bei der Person, die sie macht. Ein geschriebener Prozess beschreibt, was passieren soll; ein Tag Zusehen zeigt, was passiert.",
        },
        {
          title: "Zwei Schritte auswählen",
          body: "Die beiden mit der meisten Wiederholung und dem geringsten Urteilsanteil, nicht die beiden, die am interessantesten zu bauen sind.",
        },
        {
          title: "Mit eingebauter Freigabe bauen",
          body: "Er entwirft und schlägt vor, vom ersten Tag an. Nichts verlässt das Haus, ohne dass ein Mensch es gelesen hat.",
        },
        {
          title: "Langsam lockern",
          body: "Wenn das Protokoll zeigt, dass ein Schritt fast immer richtig ist, braucht dieser Schritt keinen Klick mehr. Einer nach dem anderen und nur mit Ihrer Zustimmung.",
        },
      ],
      whoTitle: "Für wen das ist",
      who: [
        {
          title: "Vertrieb und Kundenservice",
          body: "Dasselbe Nachschlagen, dieselbe Antwort, dieselbe Nachfassaktion, mehrere Dutzend Mal pro Woche.",
        },
        {
          title: "Personal und Recruiting",
          body: "Vorauswahl, Terminfindung und das endlose Nachfassen bei Dokumenten, das niemand gern macht und alle brauchen.",
        },
        {
          title: "Kleine Teams ohne Operations-Rolle",
          body: "Zehn Menschen erledigen die Arbeit von zwanzig, und die Verwaltung ist das, was zuerst nachgibt.",
        },
      ],
      timeTitle: "Was es an Zeit kostet",
      timeIntro:
        "Kalenderzeit. Die Unbekannte ist selten die Software, sondern wie schnell wir Zugang zu den Werkzeugen bekommen, die der Assistent anfassen muss.",
      time: [
        {
          span: "Woche 1",
          title: "Ein Tag Zusehen, dann eine Auswahl",
          body: "Wir verfolgen die echte Arbeit und kommen mit den Schritten zurück, die sich zu automatisieren lohnen, und denen, die es nicht tun.",
        },
        {
          span: "Woche 2 bis 4",
          title: "Die ersten zwei Aufgaben, live",
          body: "An echter Arbeit, mit menschlicher Freigabe für alles, innerhalb Ihrer bestehenden Werkzeuge.",
        },
        {
          span: "Woche 5 bis 8",
          title: "Mehr Aufgaben, weniger Klicks",
          body: "Wir ergänzen Aufgaben und nehmen Freigaben heraus, wo das Protokoll es rechtfertigt, und übergeben dann.",
        },
      ],
      relatedTitle: "Verwandt",
      related: [
        {
          title: "Dokumentenautomatisierung",
          body: "Wenn die Arbeit aus ankommenden Dokumenten besteht und nicht aus sich wiederholenden Schritten.",
          href: "/solutions/paperwork-automation",
        },
        {
          title: "Antworten aus Ihren Dokumenten",
          body: "Assistenten werden besser, wenn sie Ihre Dateien lesen können. Beides bauen wir oft zusammen.",
          href: "/solutions/answers-from-documents",
        },
        {
          title: "Forward Deployed Engineers",
          body: "Wenn Ihnen ein Ingenieur für einige Monate im Team lieber ist als ein Projekt mit festem Umfang.",
          href: "/services/forward-deployed-engineers",
        },
      ],
      cta: {
        title: "Beschreiben Sie einen Tag in der Rolle, der Sie helfen wollen",
        text: "Welche vierzig Minuten auf dieselben drei Schritte gehen. Das reicht uns meist, um zu sagen, ob sich ein Assistent lohnt.",
        button: "Gespräch buchen",
      },
    },

    forecastingAndReporting: {
      label: "Lösungen",
      title: "Prognosen und Reporting",
      intro:
        "Die Zahlen liegen bereits in Ihren Systemen, in vier verschiedenen Formen. Wir bringen sie an einen Ort, klären, was jede einzelne bedeutet, und sorgen dafür, dass Monatsbericht und Prognose sich selbst bauen.",
      metaDescription:
        "Ein Satz Zahlen, ein Bericht, der sich selbst neu baut, und eine Prognose, die man hinterfragen kann. Pluscode verbindet Ihre Systeme, schreibt die Definitionen auf und stimmt sie mit Ihrem Abschluss ab.",
      whatTitle: "Worum es geht",
      whatBody: [
        "Die meisten Reporting-Probleme sind keine Analyseprobleme. Jemand exportiert am ersten Montag im Monat drei Dateien, fügt sie in eine Arbeitsmappe ein, die seit sechs Jahren wächst, repariert die zwei Spalten, die immer brechen, und schickt einen Foliensatz. Die Zahlen stimmen meistens. Niemand kann genau sagen, wie sie zustande kamen, und die eine Person, die es könnte, ist im Urlaub.",
        "Wir übernehmen die unglamouröse Hälfte. Quellen anschließen, für jede Zahl eine Definition festlegen, das Ergebnis gegen die Werte abstimmen, denen Sie bereits vertrauen, und den Bericht dann sich selbst bauen lassen. Die Prognose kommt danach, und nur für die Zahlen, bei denen eine Prognose ehrlich ist. Manche Zahlen lassen sich in Ihrer Größenordnung nicht sinnvoll prognostizieren, und das sagen wir, statt die Linie trotzdem zu zeichnen.",
      ],
      whatNote:
        "Wir bauen auch Quanty, unser eigenes Produkt genau dafür: eine Tabelle, die Dokumente als Zeilen einliest. Manchmal ist die richtige Antwort Quanty und gar kein Projekt, und das sagen wir lieber, als Ihnen einen Aufbau zu verkaufen.",
      doesTitle: "Was es tut",
      doesIntro:
        "Fünf Schritte, und der zweite erweist sich meist als der wertvollste.",
      does: [
        {
          title: "Führt die Zahlen zusammen",
          body: "Buchhaltung, CRM, Lager, Bank und die Tabelle, die jemand von Hand pflegt. Was heute die Wahrheit hält, nicht was sie halten sollte.",
        },
        {
          title: "Klärt, was jede Zahl bedeutet",
          body: "Eine Definition von Umsatz, eine von aktivem Kunden, eine von ausgeliefertem Auftrag, festgehalten dort, wo alle sie sehen und einmal darüber streiten können statt jeden Monat.",
        },
        {
          title: "Stimmt gegen das ab, dem Sie vertrauen",
          body: "Die neuen Werte werden mit Ihrem eigenen Abschluss abgeglichen, bevor jemand sich darauf stützen soll. Eine Abweichung wird erklärt, nicht weggerundet.",
        },
        {
          title: "Baut den Bericht von selbst",
          body: "Monatlich, wöchentlich oder bei jeder Datenänderung. Gleiches Layout, gleiche Definitionen und kein erster Montag im Monat mehr.",
        },
        {
          title: "Prognostiziert, mit sichtbaren Annahmen",
          body: "Wie die nächsten Monate aussehen, wenn sich nichts ändert, und auf welche Annahmen das Ergebnis empfindlich reagiert. Eine Prognose, die man nicht hinterfragen kann, ist ein Ratespiel mit Diagramm.",
        },
      ],
      getTitle: "Was am Ende bei Ihnen bleibt",
      getIntro:
        "Zahlen, die Sie in einer Sitzung verteidigen können, und das Blatt, das sagt, wie jede berechnet wird.",
      get: [
        {
          title: "Ein verbundener Satz Zahlen",
          body: "Nach Plan aktualisiert, mit benannter Quelle und Umformungen, die auch jemand ohne Technikhintergrund lesen kann.",
        },
        {
          title: "Ein schriftliches Definitionsblatt",
          body: "Jede Kennzahl, ihre Formel, ihre Quelle und wer entscheidet, wenn sie geändert werden muss.",
        },
        {
          title: "Der wiederkehrende Bericht",
          body: "Nach Plan gebaut und zugestellt, in der Form, die Ihr Vorstand oder Ihr Team ohnehin liest.",
        },
        {
          title: "Die Prognose und ihre Annahmen",
          body: "Einschließlich der Annahmen, die wir nicht belegen konnten, und des Grundes, warum diese Zahlen fehlen.",
        },
      ],
      stepsTitle: "Wie es abläuft",
      steps: [
        {
          title: "Die zehn Zahlen festlegen",
          body: "Die, von denen eine Entscheidung wirklich abhängt. Ein Bericht mit sechzig Zahlen ist ein Bericht, den niemand zu Ende liest.",
        },
        {
          title: "Anschließen und abstimmen",
          body: "Wir holen die Quellen und gleichen das Ergebnis mit Ihrem Abschluss ab, bis jede Abweichung erklärt ist.",
        },
        {
          title: "Den Bericht veröffentlichen",
          body: "Automatisch, nach Plan, in der Form, die die Leute erwarten. Die Änderung soll unsichtbar sein, außer dass der Bericht einfach ankommt.",
        },
        {
          title: "Die Prognose ergänzen",
          body: "Nur dort, wo die Historie sie trägt, und immer mit den Annahmen neben der Zahl.",
        },
      ],
      whoTitle: "Für wen das ist",
      who: [
        {
          title: "Finanzteams, die von Hand abschließen",
          body: "Der Monatsabschluss sind drei Tage Kopieren, und das meiste davon sind dieselben drei Tage wie im Vormonat.",
        },
        {
          title: "Gründerinnen, Gründer und Aufsichtsgremien",
          body: "Sie brauchen eine Seite im Monat, die jeden Monat dieselbe Seite ist und eine harte Rückfrage übersteht.",
        },
        {
          title: "Operations mit Zahlen in vier Systemen",
          body: "Bestand hier, Aufträge dort, Lieferungen an dritter Stelle, und keine Sicht, die das verbindet.",
        },
      ],
      timeTitle: "Was es an Zeit kostet",
      timeIntro:
        "Kalenderzeit, vorausgesetzt Lesezugriff auf die Systeme und jemand, der sagen kann, was eine Spalte tatsächlich bedeutet.",
      time: [
        {
          span: "Woche 1 bis 2",
          title: "Definitionen und Quellen",
          body: "Wir legen die Zahlen fest und finden heraus, woher jede wirklich kommt. Das ist meist der überraschende Teil.",
        },
        {
          span: "Woche 3 bis 5",
          title: "Angeschlossen und abgestimmt",
          body: "Die Strecke läuft, und die Werte passen zu dem, womit Sie Ihren Monat bereits abschließen.",
        },
        {
          span: "Woche 6 bis 8",
          title: "Bericht, dann Prognose",
          body: "Der wiederkehrende Bericht geht live, und die Prognose folgt, sobald den Grundzahlen vertraut wird.",
        },
      ],
      relatedTitle: "Verwandt",
      related: [
        {
          title: "Quanty",
          body: "Unser eigenes Produkt. Wenn Ihre Zahlen als Dokumente ankommen und nicht als Daten, beginnen Sie hier.",
          href: "/quanty",
        },
        {
          title: "Dokumentenautomatisierung",
          body: "Wenn die Zahlen als Rechnungen und Lieferscheine ankommen, die jemand abtippt.",
          href: "/solutions/paperwork-automation",
        },
        {
          title: "Datenanalyse",
          body: "Die technische Fassung dieser Seite, geschrieben für ein technisches Publikum.",
          href: "/ai-data/analytics",
        },
      ],
      cta: {
        title: "Schicken Sie uns den Bericht vom letzten Monat",
        text: "Die Arbeitsmappe, den Foliensatz, was Sie tatsächlich verschicken. Wir sagen Ihnen, was sich selbst bauen könnte und was echte Arbeit wäre.",
        button: "Gespräch buchen",
      },
    },

    processMapping: {
      label: "Lösungen",
      title: "Prozessaufnahme",
      intro:
        "Bevor jemand Code schreibt, zwei Tage bei den Menschen, die die Arbeit machen. Sie bekommen eine Aufnahme, wie es wirklich läuft, eine kalkulierte Liste dessen, was sich zu automatisieren lohnt, und eine klare Liste dessen, was nicht.",
      metaDescription:
        "Zwei Tage mit Ihrem Team, danach eine kalkulierte Liste dessen, was sich zu automatisieren lohnt und was nicht. Ein Festpreis-Auftrag von Pluscode, anrechenbar auf den Aufbau.",
      whatTitle: "Worum es geht",
      whatBody: [
        "Vielen Unternehmen wird gesagt, sie sollen etwas mit KI machen, und sie haben keinen guten Weg zu entscheiden was. Der Druck ist echt, das Budget ist manchmal schon freigegeben, und die Liste, die von einem Anbieter kommt, ist eine Liste der Dinge, die dieser Anbieter zufällig verkauft. Es fehlt das klare Bild davon, wohin die Stunden tatsächlich gehen.",
        "Das ist dieses Bild, und es ist bewusst keine Verkaufsübung. Wir setzen uns zu den Menschen, die die Arbeit machen, zählen, wohin die Zeit geht, kalkulieren jeden Kandidaten und übergeben Ihnen eine sortierte Liste mit Schätzung und Amortisation für jeden Punkt. Mehrere Punkte kommen üblicherweise mit dem Vermerk zurück, das nicht zu automatisieren, und das ist genauso viel wert wie die anderen.",
      ],
      whatNote:
        "Festpreis, vor dem Start vereinbart und auf den Aufbau angerechnet, wenn Sie mit uns weitermachen. Lautet die ehrliche Antwort, dass sich hier nichts zu bauen lohnt, behalten Sie die Aufnahme und die Zahlen trotzdem.",
      doesTitle: "Was es tut",
      doesIntro: "Fünf Dinge, und das letzte lassen Anbieter meist aus.",
      does: [
        {
          title: "Folgt der Arbeit, nicht der Prozessbeschreibung",
          body: "Wir sehen zu, wie die Arbeit gemacht wird. Der geschriebene und der echte Prozess sind selten dasselbe, und im Abstand dazwischen verstecken sich die Stunden.",
        },
        {
          title: "Zählt die Stunden",
          body: "Wie oft jeder Schritt vorkommt, wie lange er dauert, wer ihn macht und was er kostet, wenn er schiefgeht und wiederholt werden muss.",
        },
        {
          title: "Kalkuliert jeden Kandidaten",
          body: "Was der Aufbau brauchen würde, was der Betrieb kostet und was er spart. In denselben Einheiten, damit zwei Kandidaten wirklich vergleichbar sind.",
        },
        {
          title: "Sortiert ehrlich",
          body: "Das günstigste nützliche Vorhaben zuerst. Das beeindruckende Projekt, das sich in drei Jahren rechnet, steht unten, wo es hingehört.",
        },
        {
          title: "Sagt, was man in Ruhe lässt",
          body: "Arbeit mit zu viel Ermessen, zu geringem Volumen oder einem regulatorischen Anhang, der Automatisierung zur teuren Variante macht.",
        },
      ],
      getTitle: "Was am Ende bei Ihnen bleibt",
      getIntro:
        "Vier Dokumente, alle kurz genug, dass sie jemand liest.",
      get: [
        {
          title: "Eine Aufnahme des Prozesses, wie er läuft",
          body: "Schritte, Systeme, Übergaben und Wartezeit, auf einer Seite, in einer Sprache, in der die Menschen ihre eigene Arbeit wiedererkennen.",
        },
        {
          title: "Eine sortierte und kalkulierte Liste",
          body: "Jeder Punkt mit Aufwandsschätzung, Betriebskosten, erwarteter Ersparnis und Amortisationsdauer.",
        },
        {
          title: "Eine Risikonotiz zum EU AI Act",
          body: "In welche Stufe jeder Kandidat fällt und was das praktisch heißt, geklärt bevor etwas entworfen wird.",
        },
        {
          title: "Eine schriftliche Empfehlung",
          body: "Kurz genug für ein Gremium, konkret genug zum Handeln, und sie benennt, was wir nicht tun würden und warum.",
        },
      ],
      stepsTitle: "Wie es abläuft",
      steps: [
        {
          title: "Ein halber Tag Abstimmung",
          body: "Welcher Teil des Unternehmens, welche Teams und wie ein gutes Ergebnis aussähe. Dieser Teil geht gut aus der Ferne.",
        },
        {
          title: "Zwei Tage bei den Teams",
          body: "Vor Ort oder im Gespräch, bei den Menschen, die die Arbeit machen, und nicht nur bei denen, die sie führen.",
        },
        {
          title: "Eine Woche Kalkulation",
          body: "Wir übersetzen das Gesehene in Schätzungen und prüfen die Annahmen laufend mit Ihnen, damit im Ergebnis nichts überrascht.",
        },
        {
          title: "Die Vorstellung",
          body: "Wir gehen mit dem Raum durch Aufnahme, Liste und Empfehlung und beantworten die harten Fragen direkt.",
        },
      ],
      whoTitle: "Für wen das ist",
      who: [
        {
          title: "Unternehmen, die etwas mit KI machen sollen",
          body: "Der Druck ist echt, und es gibt im Haus keine Liste, der wirklich jemand vertraut.",
        },
        {
          title: "Teams mit Budget und ohne Plan",
          body: "Das Geld ist für dieses Jahr freigegeben, und das eigentliche Risiko ist, es gut für das Falsche auszugeben.",
        },
        {
          title: "Alle kurz vor einem großen Anbietervertrag",
          body: "Eine zweite Meinung dazu, was die Arbeit wert ist, von Leuten, die auch sagen: kaufen statt bauen.",
        },
      ],
      timeTitle: "Was es an Zeit kostet",
      timeIntro:
        "Zwei bis drei Wochen von Anfang bis Ende. Das Einzige, was wir von Ihnen brauchen, ist Zugang zu den Menschen, die die Arbeit machen.",
      time: [
        {
          span: "Woche 1",
          title: "Abstimmung und Tage bei den Teams",
          body: "Ein halber Tag Abstimmung, danach zwei Tage, an denen wir der Arbeit folgen, wie sie tatsächlich gemacht wird.",
        },
        {
          span: "Woche 2",
          title: "Kalkulation und Ausarbeitung",
          body: "Wir schätzen, prüfen die Annahmen mit Ihnen und schreiben es auf.",
        },
        {
          span: "Woche 3",
          title: "Vorstellung und Entscheidung",
          body: "Sie bekommen Aufnahme, Liste und Empfehlung und eine Sitzung, in der Sie mit allen dreien streiten können.",
        },
      ],
      relatedTitle: "Verwandt",
      related: [
        {
          title: "Workshops",
          body: "Die kürzere Fassung: ein Tag mit Ihrem Team an einem einzelnen Prozess.",
          href: "/workshops",
        },
        {
          title: "Data Governance",
          body: "Das andere Thema, das man klären sollte, bevor jemand baut.",
          href: "/solutions/data-governance",
        },
        {
          title: "KI-Beratung",
          body: "Der längere Auftrag, wenn die Frage eine Roadmap ist und nicht ein Prozess.",
          href: "/ai-data/consulting",
        },
      ],
      cta: {
        title: "Sagen Sie uns, welches Team untergeht",
        text: "Eine Abteilung, ein Prozess. Wir sagen Ihnen, was die Aufnahme abdecken würde und was sie kostet, bevor Sie sich zu irgendetwas verpflichten.",
        button: "Gespräch buchen",
      },
    },

    dataGovernance: {
      label: "Lösungen",
      title: "Data Governance",
      intro:
        "Wo die Daten liegen, wer sie sehen darf, wie lange sie aufbewahrt werden und was der EU AI Act zu dem sagt, was Sie bauen. Geklärt vor der ersten Zeile Code, nicht nachdem der Sicherheitsfragebogen eintrifft.",
      metaDescription:
        "DSGVO, Risikostufen des EU AI Act, Zugriffsregeln und Aufbewahrung für KI-Projekte. Hosting in der EU als Standard und ein Auftragsverarbeitungsvertrag, bevor Daten bewegt werden.",
      whatTitle: "Worum es geht",
      whatBody: [
        "Die Frage, die ein KI-Projekt stoppt, ist fast nie technisch. Es ist der Sicherheitsfragebogen eines Kunden, ein Betriebsrat, der fragt, wohin die Daten gehen, eine Juristin, die nach der Risikostufe fragt, oder ein Aufsichtsgremium, das wissen will, was passiert, wenn das System sich in Bezug auf eine Person irrt. Diese Fragen kommen spät, und sie kommen alle auf einmal.",
        "Das hier ist die Arbeit, sie zu beantworten, bevor sie gestellt werden. Woher jedes Datum kommt und wo es endet, auf welcher Rechtsgrundlage es sich bewegt, wer was sehen darf, wie lange etwas aufbewahrt wird und was der EU AI Act von genau diesem System verlangt. Es ist kein Richtlinienpapier, das niemand liest. Es ist ein Satz von Entscheidungen, aufgeschrieben, gegen den man Software bauen kann.",
      ],
      whatNote:
        "Hosting in der EU als Standard und ein Auftragsverarbeitungsvertrag, unterschrieben bevor wir irgendetwas anfassen. Die Risikostufe nach dem AI Act klären wir vor dem Entwurf, denn die Stufe ändert, was gebaut werden muss.",
      doesTitle: "Was es tut",
      doesIntro:
        "Fünf Fragen, einmal beantwortet, in einer Form, die Ihre Rechtsabteilung unterschreiben und Ihre Technik umsetzen kann.",
      does: [
        {
          title: "Erfasst die Daten, die das System berührt",
          body: "Jede Quelle, jedes personenbezogene Feld und jeden Ort, an dem eine Kopie landet, einschließlich der Kopien, die niemand anlegen wollte.",
        },
        {
          title: "Klärt Rechtsgrundlage und Papiere",
          body: "Auftragsverarbeitungsvertrag, Unterauftragsverarbeiter, Übermittlungen und das Verzeichnis, das Sie führen müssen. Geschrieben zum Unterschreiben, nicht als Vorlage für später.",
        },
        {
          title: "Ordnet das System dem EU AI Act zu",
          body: "Welche Stufe, was sie praktisch verlangt und was nötig wäre, um aus einer schwereren Stufe herauszubleiben, wo das eine echte Option ist.",
        },
        {
          title: "Legt fest, wer was sehen darf",
          body: "Ein Zugriffsmodell, das dazu passt, wie das Unternehmen wirklich arbeitet, und ein Plan für den Tag, an dem jemand die Rolle wechselt oder geht.",
        },
        {
          title: "Setzt Aufbewahrung, Löschung und Protokollierung",
          body: "Wie lange etwas bleibt, wie ein Löschverlangen durchgängig erfüllt wird und was protokolliert wird, damit ein Audit mit Belegen statt mit Zusicherungen beantwortet wird.",
        },
      ],
      getTitle: "Was am Ende bei Ihnen bleibt",
      getIntro:
        "Unterlagen, die die Fragen beantworten, bevor sie gestellt werden, und Regeln, die in der Software leben statt in einem Ordner.",
      get: [
        {
          title: "Eine Datenkarte und ein Verzeichnis",
          body: "Was das System berührt, wo es liegt, wer es verarbeitet und auf welcher Grundlage.",
        },
        {
          title: "Die unterschriftsreifen Papiere",
          body: "Auftragsverarbeitungsvertrag, Liste der Unterauftragsverarbeiter und die Position zu Übermittlungen, fertig für Ihre Rechtsabteilung.",
        },
        {
          title: "Eine schriftliche Einstufung nach dem AI Act",
          body: "Die Stufe, die Begründung und die daraus folgenden Pflichten, in einer Sprache, mit der auch Nichtjuristen arbeiten können.",
        },
        {
          title: "Eine Zugriffsmatrix und ein Aufbewahrungsplan",
          body: "Wer was sieht, wie lange, und was das System automatisch tut, wenn sich die Antwort ändert.",
        },
      ],
      stepsTitle: "Wie es abläuft",
      steps: [
        {
          title: "Ein System nach dem anderen",
          body: "Wir regeln das, was gebaut wird, nicht das ganze Unternehmen. Ein unternehmensweites Programm dauert ein Jahr und schützt in dieser Zeit nichts.",
        },
        {
          title: "Den Daten folgen",
          body: "Quellen, Kopien, Sicherungen, Protokolle und Dritte. Die Kopien, an die niemand denkt, sind die, die den Vorfall verursachen.",
        },
        {
          title: "Entscheiden und aufschreiben",
          body: "Jede Entscheidung bekommt eine verantwortliche Person und ein Datum. Eine offene Frage ist in Ordnung; eine undokumentierte Annahme nicht.",
        },
        {
          title: "In das System einbauen",
          body: "Zugriffsregeln, Aufbewahrung und Protokollierung werden Konfiguration und Code, nicht ein Versprechen in einem Dokument.",
        },
      ],
      whoTitle: "Für wen das ist",
      who: [
        {
          title: "Regulierte Branchen",
          body: "Finanzen, Gesundheit und alles, wo die Prüfer Ihrer Kunden irgendwann zu Ihren Prüfern werden.",
        },
        {
          title: "Unternehmen, die Sicherheitsfragebögen beantworten",
          body: "Große Kunden fragen. Die Antworten sollten existieren, bevor ein Abschluss davon abhängt.",
        },
        {
          title: "Alle kurz vor einem KI-Anbietervertrag",
          body: "Wohin die Daten gehen, was damit trainiert wird und was passiert, wenn Sie kündigen. Eine Stunde vor der Unterschrift wert.",
        },
      ],
      timeTitle: "Was es an Zeit kostet",
      timeIntro:
        "Kalenderzeit für ein System. Kürzer, wenn das System noch nicht live ist, was zugleich der günstigste Zeitpunkt dafür ist.",
      time: [
        {
          span: "Woche 1",
          title: "Karte und Fragen",
          body: "Wir folgen den Daten durch das System und kommen mit den Fragen zurück, die nur Sie beantworten können.",
        },
        {
          span: "Woche 2 bis 3",
          title: "Entscheidungen und Einstufung",
          body: "Rechtsgrundlage, Stufe nach dem AI Act, Zugriff und Aufbewahrung, schriftlich mit jeweils einer verantwortlichen Person.",
        },
        {
          span: "Woche 4 bis 5",
          title: "Eingebaut",
          body: "Die Regeln werden Konfiguration und Code, und die Papiere gehen an Ihre Rechtsabteilung.",
        },
      ],
      relatedTitle: "Verwandt",
      related: [
        {
          title: "Prozessaufnahme",
          body: "Das andere Thema, das man klären sollte, bevor jemand baut.",
          href: "/solutions/process-mapping",
        },
        {
          title: "Cloud und MLOps",
          body: "Dort werden EU-Hosting, Zugriffskontrolle und Protokollierung tatsächlich umgesetzt.",
          href: "/services/cloud",
        },
        {
          title: "KI-Beratung",
          body: "Wenn die Frage eine Roadmap für das ganze Unternehmen ist und nicht ein System.",
          href: "/ai-data/consulting",
        },
      ],
      cta: {
        title: "Schicken Sie uns den Fragebogen, an dem Sie hängen",
        text: "Oder die Klausel, die Ihr Kunde in letzter Minute ergänzt hat. Dreißig Minuten reichen meist, um zu sagen, was zu beantworten ist und in welcher Reihenfolge.",
        button: "Gespräch buchen",
      },
    },
  },
};

/* ------------------------------------------------------------------ *
 *  Write. `solutions` replaces whatever was there; every other top level
 *  key is left exactly as it is, so `services`, `offerings`,
 *  `pages.services` and `home` keep their copy. Those three are NOT this
 *  script's to touch and share nothing with this key beyond the word.
 * ------------------------------------------------------------------ */
const byLocale: Record<string, SolutionsContent> = { en, pl, de };

/** Structural equality, so a locale can never ship a half-translated page. */
function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Dict)
        .sort()
        .map((k) => [k, shapeOf((value as Dict)[k])]),
    );
  }
  return typeof value;
}

const reference = JSON.stringify(shapeOf(en));
for (const [locale, content] of Object.entries(byLocale)) {
  const actual = JSON.stringify(shapeOf(content));
  if (actual !== reference) {
    throw new Error(
      `dictionaries/${locale}.json would drift: the \`solutions\` shape does not match en.`,
    );
  }
}

/* The six slugs are routes, so they are content that must NOT be translated:
   /pl/solutions/paperwork-automation is the Polish page, and a translated
   slug would be a 404. The structural check above compares types, not
   values, so it cannot catch this on its own. */
for (const [locale, content] of Object.entries(byLocale)) {
  content.index.items.forEach((item, i) => {
    const expected = en.index.items[i];
    if (item.slug !== expected.slug || item.key !== expected.key) {
      throw new Error(
        `dictionaries/${locale}.json: solutions.index.items[${i}] must keep the English slug and key.`,
      );
    }
  });
}

for (const [locale, content] of Object.entries(byLocale)) {
  const path = resolve(DIR, `${locale}.json`);
  const dict = JSON.parse(readFileSync(path, "utf8")) as Dict;
  dict.solutions = content;
  writeFileSync(path, JSON.stringify(dict, null, 2) + "\n", "utf8");
  console.log(`wrote solutions -> dictionaries/${locale}.json`);
}

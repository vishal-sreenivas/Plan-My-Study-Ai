```latex
\documentclass[12pt,a4paper]{report}

% ── Packages ──────────────────────────────────────────────────────
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage[margin=1in]{geometry}
\usepackage{graphicx}
\usepackage{xcolor}
\usepackage{hyperref}
\usepackage{listings}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{caption}
\usepackage{subcaption}
\usepackage{fancyhdr}
\usepackage{titlesec}
\usepackage{tocloft}
\usepackage{subcaption}
\usepackage{enumitem}
\usepackage{amsmath}
\usepackage{float}
\usepackage{pdfpages}
\usepackage{tikz}
\usetikzlibrary{shapes.geometric, arrows.meta, positioning, fit, backgrounds, calc, shadows, decorations.markings}
\usepackage{pgfplots}
\pgfplotsset{compat=1.18}
\usepackage{parskip}
\usepackage{setspace}
\usepackage{tabularx}
\usepackage{array}
\usepackage{multirow}
\usepackage{makecell}

% ── Color Definitions ────────────────────────────────────────────
\definecolor{primaryblue}{HTML}{1E3A5F}
\definecolor{accentgold}{HTML}{D4A843}
\definecolor{darkgray}{HTML}{2D2D2D}
\definecolor{lightgray}{HTML}{F5F5F5}
\definecolor{codegreen}{HTML}{2E7D32}
\definecolor{codepurple}{HTML}{7B1FA2}
\definecolor{codeorange}{HTML}{E65100}
\definecolor{codeblue}{HTML}{1565C0}
\definecolor{codegray}{HTML}{616161}
\definecolor{codebg}{HTML}{FAFAFA}
\definecolor{sectioncolor}{HTML}{1E3A5F}

% ── Hyperref Setup ───────────────────────────────────────────────
\hypersetup{
    colorlinks=true,
    linkcolor=primaryblue,
    filecolor=primaryblue,
    urlcolor=accentgold,
    citecolor=primaryblue,
    pdftitle={PlanMyStudy AI -- Data Engineering Project Report},
    pdfauthor={Vishal Sreenivas},
    pdfsubject={AI-Powered Personalized Study Planner},
    pdfkeywords={AI, OpenAI, YouTube API, React, Node.js, PostgreSQL, Prisma, JWT}
}

% ── Code Listing Style ───────────────────────────────────────────
\lstdefinestyle{mystyle}{
    backgroundcolor=\color{codebg},
    commentstyle=\color{codegreen}\itshape,
    keywordstyle=\color{codeblue}\bfseries,
    numberstyle=\tiny\color{codegray},
    stringstyle=\color{codeorange},
    basicstyle=\ttfamily\footnotesize,
    breakatwhitespace=false,
    breaklines=true,
    captionpos=b,
    keepspaces=true,
    numbers=left,
    numbersep=8pt,
    showspaces=false,
    showstringspaces=false,
    showtabs=false,
    tabsize=2,
    frame=single,
    rulecolor=\color{codegray!30},
    xleftmargin=2em,
    framexleftmargin=1.5em,
    aboveskip=1em,
    belowskip=1em
}
\lstset{style=mystyle}

\lstdefinelanguage{JavaScript}{
  morekeywords={async, await, const, let, var, function, return, if, else,
    try, catch, throw, new, import, export, from, default, class, extends,
    for, while, of, in, typeof, instanceof, true, false, null, undefined,
    switch, case, break, continue, do, finally, this, super, yield, static,
    get, set, delete, void, with, enum, implements, interface, package,
    private, protected, public},
  sensitive=true,
  morecomment=[l]{//},
  morecomment=[s]{/*}{*/},
  morestring=[b]',
  morestring=[b]",
  morestring=[b]`
}

\lstdefinelanguage{Prisma}{
  morekeywords={model, generator, datasource, provider, url, env,
    String, Int, Boolean, DateTime, Float, Json, Bytes, BigInt, Decimal,
    id, default, unique, relation, fields, references, onDelete, updatedAt,
    now, uuid, autoincrement, index, map, Cascade, SetNull, Restrict, NoAction},
  sensitive=true,
  morecomment=[l]{//},
  morestring=[b]",
}

\lstdefinelanguage{JSON}{
  morestring=[b]",
  literate=
    *{0}{{{\color{codeorange}0}}}{1}
    {1}{{{\color{codeorange}1}}}{1}
    {2}{{{\color{codeorange}2}}}{1}
    {3}{{{\color{codeorange}3}}}{1}
    {4}{{{\color{codeorange}4}}}{1}
    {5}{{{\color{codeorange}5}}}{1}
    {6}{{{\color{codeorange}6}}}{1}
    {7}{{{\color{codeorange}7}}}{1}
    {8}{{{\color{codeorange}8}}}{1}
    {9}{{{\color{codeorange}9}}}{1}
    {:}{{{\color{codepurple}{:}}}}{1}
    {,}{{{\color{codepurple}{,}}}}{1}
    {\{}{{{\color{codeblue}{\{}}}}{1}
    {\}}{{{\color{codeblue}{\}}}}}{1}
    {[}{{{\color{codeblue}{[}}}}{1}
    {]}{{{\color{codeblue}{]}}}}{1},
}

% ── Page Style ───────────────────────────────────────────────────
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small\textcolor{primaryblue}{\leftmark}}
\fancyhead[R]{\small\textcolor{primaryblue}{PlanMyStudy AI}}
\fancyfoot[C]{\thepage}
\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\footrulewidth}{0.2pt}

% ── Section Formatting ───────────────────────────────────────────
\titleformat{\chapter}[display]
  {\normalfont\Huge\bfseries\color{sectioncolor}}
  {\chaptertitlename\ \thechapter}{20pt}{\Huge}
\titleformat{\section}
  {\normalfont\Large\bfseries\color{sectioncolor}}
  {\thesection}{1em}{}
\titleformat{\subsection}
  {\normalfont\large\bfseries\color{sectioncolor!80}}
  {\thesubsection}{1em}{}

% ── Spacing ──────────────────────────────────────────────────────
\onehalfspacing

% ══════════════════════════════════════════════════════════════════
%  DOCUMENT BEGIN
% ══════════════════════════════════════════════════════════════════
\begin{document}

% ── Title Page ───────────────────────────────────────────────────
\begin{titlepage}
    \centering
    \vspace*{1.5cm}

    {\Huge\bfseries\textcolor{primaryblue}{PlanMyStudy AI}}\\[0.5cm]
    {\Large\textcolor{accentgold}{AI-Powered Personalized Study Planner}}\\[1cm]

    \rule{\textwidth}{1.5pt}\\[0.5cm]
    {\large Data Engineering Project Report}\\[0.3cm]
    \rule{\textwidth}{1.5pt}\\[2cm]

    % TODO: add project logo/screenshot here
    % \includegraphics[width=0.5\textwidth]{figures/logo.png}

    \vspace{1.5cm}

    {\large
    \begin{tabular}{rl}
        \textbf{Author:}      & Vishal Sreenivas \\[0.3cm]
        \textbf{Institution:} & \textit{[Your University Name]} \\[0.3cm]
        \textbf{Course:}      & Data Engineering \\[0.3cm]
        \textbf{Date:}        & \today \\
    \end{tabular}}

    \vfill
    {\small\textcolor{darkgray}{Built with React $\cdot$ Node.js/Express $\cdot$ PostgreSQL $\cdot$ Prisma $\cdot$ Groq AI $\cdot$ YouTube Data API}}
\end{titlepage}

% ── Abstract ─────────────────────────────────────────────────────
\chapter*{Abstract}
\addcontentsline{toc}{chapter}{Abstract}

\textbf{PlanMyStudy AI} is an AI-powered personalized study planner that generates day-by-day course plans tailored to a learner's chosen topic, skill level, and available time. Leveraging the Groq AI inference engine (with LLaMA and Mixtral models), the platform produces structured, multi-day syllabi in JSON format. Each generated lesson is then enriched with relevant YouTube educational videos selected within a user-defined daily time budget.

The system employs a modern three-tier web architecture: a \textbf{React} single-page application communicates with a \textbf{Node.js/Express} REST API, which in turn interfaces with a \textbf{PostgreSQL} database managed through the \textbf{Prisma ORM}. Authentication is handled via \textbf{JSON Web Tokens (JWT)} with bcrypt password hashing. The backend service layer encapsulates sophisticated prompt engineering for reliable JSON generation from AI models, an exponential-backoff retry mechanism for handling API failures, ISO~8601 duration parsing for YouTube videos, and a time-budget allocation algorithm that ensures video recommendations fit the learner's daily schedule.

Key frontend features include a dashboard with a GitHub-style activity heatmap, a guided course-creation wizard with Server-Sent Events (SSE) for real-time progress feedback, a course detail view with per-day tabs, embedded video playback modals, per-lesson note-taking, quiz components, progress tracking with visual indicators, PDF export of course plans, and a course-sharing system with unique shareable links.

This report details the architecture, data flow, AI integration pipeline, database modelling, frontend design, performance characteristics, challenges encountered, and lessons learned during the development of PlanMyStudy AI.

% ── Table of Contents ────────────────────────────────────────────
\tableofcontents
\listoffigures
\listoftables

% ══════════════════════════════════════════════════════════════════
%  CHAPTER 1 — INTRODUCTION
% ══════════════════════════════════════════════════════════════════
\chapter{Introduction}

\section{Problem Statement}
Online learning has exploded in popularity, yet learners face a paradox of choice: thousands of tutorials, courses, and videos exist for any given topic, but there is no easy way to assemble a \emph{structured}, \emph{time-constrained}, day-by-day study plan from these disparate resources. Students commonly:

\begin{itemize}[noitemsep]
    \item Spend excessive time searching for the right learning materials.
    \item Struggle to organize scattered resources into a coherent sequence.
    \item Fail to maintain consistent daily study habits due to lack of structure.
    \item Watch videos that are either too long or too short for their available time.
\end{itemize}

PlanMyStudy AI addresses this gap by combining generative AI with educational video curation, producing a personalized, time-aware study plan in seconds.

\section{Objectives}
The primary objectives of the PlanMyStudy AI project are:

\begin{enumerate}[noitemsep]
    \item \textbf{Automated Syllabus Generation}: Use AI (Groq with LLaMA/Mixtral models) to generate a multi-day, structured course plan from a single topic specification.
    \item \textbf{YouTube Video Enrichment}: Automatically attach relevant educational YouTube videos to each lesson, respecting a user-defined daily time budget.
    \item \textbf{Time-Budget Awareness}: Ensure that the total video duration for each day does not exceed the learner's available study time.
    \item \textbf{Progress Tracking}: Allow learners to mark lessons as complete and visualize their learning journey through progress bars and activity heatmaps.
    \item \textbf{Secure Multi-User Platform}: Provide JWT-based authentication so multiple users can independently generate, track, and manage their study plans.
    \item \textbf{Course Sharing}: Enable users to share their generated course plans via unique public links.
    \item \textbf{PDF Export}: Allow learners to download their complete course plans as formatted PDF documents.
\end{enumerate}

\section{Scope}
This project encompasses:

\begin{itemize}[noitemsep]
    \item A full-stack web application with React frontend and Node.js/Express backend.
    \item Integration with the Groq AI API for course plan generation.
    \item Integration with the YouTube Data API v3 for video search and metadata retrieval.
    \item A PostgreSQL relational database with Prisma ORM for data persistence.
    \item JWT-based authentication and authorization.
    \item Real-time progress updates via Server-Sent Events (SSE).
    \item Activity logging with GitHub-style contribution heatmap visualization.
\end{itemize}

\section{Technology Stack}

\begin{table}[H]
\centering
\caption{Technology Stack Overview}
\label{tab:techstack}
\begin{tabularx}{\textwidth}{l l X}
\toprule
\textbf{Layer} & \textbf{Technology} & \textbf{Purpose} \\
\midrule
Frontend       & React 18            & UI library for building interactive interfaces \\
               & Vite                & Fast build tool and development server \\
               & Tailwind CSS        & Utility-first CSS framework \\
               & React Router        & Client-side routing \\
               & Axios               & HTTP client for API calls \\
               & jsPDF               & PDF generation for course plan export \\
\midrule
Backend        & Node.js             & JavaScript runtime environment \\
               & Express             & Minimal web framework for REST APIs \\
               & Prisma              & Type-safe ORM for PostgreSQL \\
               & JWT (jsonwebtoken)  & Token-based authentication \\
               & bcryptjs            & Password hashing with salt rounds \\
               & Groq SDK            & AI course plan generation \\
               & Axios               & HTTP client for YouTube API calls \\
\midrule
Database       & PostgreSQL          & Relational database for persistent storage \\
\midrule
External APIs  & Groq AI API         & LLaMA/Mixtral model inference for syllabus generation \\
               & YouTube Data API v3 & Video search, metadata, and duration retrieval \\
\bottomrule
\end{tabularx}
\end{table}


% ══════════════════════════════════════════════════════════════════
%  CHAPTER 2 — ARCHITECTURE
% ══════════════════════════════════════════════════════════════════
\chapter{System Architecture}

\section{Architectural Overview}
PlanMyStudy AI follows a \textbf{three-tier web architecture} consisting of a client-side presentation layer, a server-side application layer, and a data/external-services layer. This separation ensures clean modularity, independent scalability of each tier, and clear boundaries for testing and deployment.

\begin{figure}[H]
    \centering
    \begin{tikzpicture}[
        box/.style={draw, rounded corners=8pt, minimum width=3.2cm, minimum height=1.6cm,
            font=\small\sffamily, align=center, thick},
        tier1/.style={box, fill=blue!10, draw=blue!60},
        tier2/.style={box, fill=green!10, draw=green!60},
        tier3/.style={box, fill=orange!10, draw=orange!60},
        extapi/.style={box, fill=purple!10, draw=purple!60, minimum width=2.8cm, minimum height=1.2cm},
        arrow/.style={-{Stealth[length=3mm]}, thick, draw=darkgray},
        doublearrow/.style={{Stealth[length=3mm]}-{Stealth[length=3mm]}, thick, draw=darkgray},
        label/.style={font=\scriptsize\sffamily, text=codegray}
    ]
        % Tier 1
        \node[tier1] (browser) at (0,0) {\textbf{Browser}\\(User)};
        \node[tier1] (frontend) at (4.5,0) {\textbf{Frontend}\\React 18 + Vite};

        % Tier 2
        \node[tier2] (backend) at (10,0) {\textbf{Backend}\\Express.js};
        \node[tier2, minimum width=2.2cm, minimum height=1cm] (auth) at (8.2,-2.5) {\textbf{Auth}\\Middleware};
        \node[tier2, minimum width=2.2cm, minimum height=1cm] (ctrl) at (10.6,-2.5) {\textbf{Controllers}\\\scriptsize Course, Auth};
        \node[tier2, minimum width=2.2cm, minimum height=1cm] (svc) at (13,-2.5) {\textbf{Services}\\\scriptsize Groq, YouTube};

        % Tier 3
        \node[tier3] (db) at (7,-5.5) {\textbf{PostgreSQL}\\Prisma ORM};
        \node[extapi] (groq) at (10.5,-5.5) {\textbf{Groq AI}\\LLaMA / Mixtral};
        \node[extapi] (youtube) at (13.8,-5.5) {\textbf{YouTube}\\Data API v3};

        % Arrows
        \draw[doublearrow] (browser) -- node[above, label] {HTTP} (frontend);
        \draw[doublearrow] (frontend) -- node[above, label] {REST + JWT} (backend);
        \draw[arrow] (backend) -- (auth);
        \draw[arrow] (backend) -- (ctrl);
        \draw[arrow] (backend) -- (svc);
        \draw[arrow] (ctrl) -- (db);
        \draw[arrow] (svc) -- (groq);
        \draw[arrow] (svc) -- (youtube);

        % Tier labels
        \node[font=\footnotesize\bfseries\sffamily, text=blue!70] at (2.25,1.2) {Tier 1 — Presentation};
        \node[font=\footnotesize\bfseries\sffamily, text=green!60!black] at (10,1.2) {Tier 2 — Application};
        \node[font=\footnotesize\bfseries\sffamily, text=orange!70!black] at (10.5,-6.8) {Tier 3 — Data \& External Services};
    \end{tikzpicture}
    \caption{PlanMyStudy AI --- Three-Tier System Architecture}
    \label{fig:architecture}
\end{figure}

\subsection{Tier 1 — Presentation Layer (Frontend)}
The React single-page application handles all user interaction. Built with Vite for fast development and optimized production builds, it uses React Router for client-side navigation and Axios with interceptors for API communication. The frontend stores JWT tokens in \texttt{localStorage} and automatically attaches them to every outgoing request via an Axios request interceptor.

\subsection{Tier 2 — Application Layer (Backend)}
The Express server exposes a RESTful API organized into authentication routes and course management routes. It follows the \textbf{Controller--Service--Middleware} pattern:

\begin{itemize}[noitemsep]
    \item \textbf{Controllers} handle HTTP request/response logic and input validation.
    \item \textbf{Services} encapsulate business logic and external API integration (Groq AI, YouTube).
    \item \textbf{Middleware} provides cross-cutting concerns such as JWT authentication.
\end{itemize}

\subsection{Tier 3 — Data \& External Services Layer}
This tier comprises the PostgreSQL database (accessed through Prisma ORM) and two external APIs:

\begin{enumerate}[noitemsep]
    \item \textbf{Groq AI API}: Provides ultra-fast LLM inference for generating structured course plans.
    \item \textbf{YouTube Data API v3}: Supplies video search results and content metadata including ISO~8601 durations.
\end{enumerate}

\section{Project Structure}

\subsection{Backend Directory Layout}
\begin{lstlisting}[language={},caption={Backend Project Structure},label={lst:backend-structure}]
backend/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── config/
│   │   ├── database.js        # Prisma client initialization
│   │   └── env.js             # Environment variable validation
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── courseController.js # Course management logic
│   │   ├── activityController.js # Activity tracking
│   │   └── noteController.js  # Note management
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── courseRoutes.js     # Course endpoints
│   │   ├── activityRoutes.js  # Activity endpoints
│   │   └── noteRoutes.js      # Note endpoints
│   ├── services/
│   │   ├── groqService.js     # AI course generation
│   │   └── youtubeService.js  # YouTube video fetching
│   ├── utils/
│   │   ├── errors.js          # Error handling utilities
│   │   └── jwt.js             # JWT token utilities
│   └── server.js              # Express app entry point
└── package.json
\end{lstlisting}

\subsection{Frontend Directory Layout}
\begin{lstlisting}[language={},caption={Frontend Project Structure},label={lst:frontend-structure}]
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx         # Page layout wrapper
│   │   └── ProtectedRoute.jsx # Route guard
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   ├── Dashboard.jsx      # Course list + activity heatmap
│   │   ├── CreateCourse.jsx   # Course generation wizard
│   │   └── CourseDetail.jsx   # Course view with day tabs
│   ├── services/
│   │   └── api.js             # API client with interceptors
│   ├── utils/
│   │   ├── auth.js            # Auth helper functions
│   │   └── pdfExport.js       # PDF generation utility
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles (Tailwind)
├── tailwind.config.js
├── vite.config.js
└── package.json
\end{lstlisting}

\section{Data Flow — Course Generation}

The end-to-end data flow for generating a new course is the most complex pipeline in the system. Figure~\ref{fig:dataflow} illustrates the complete sequence.

\begin{figure}[H]
    \centering
    \begin{tikzpicture}[
        step/.style={draw, rounded corners=6pt, minimum width=3.8cm, minimum height=0.9cm,
            font=\scriptsize\sffamily, align=center, thick, fill=#1!12, draw=#1!60},
        step/.default=blue,
        arrow/.style={-{Stealth[length=2.5mm]}, thick, draw=darkgray},
    ]
        % Column 1
        \node[step=blue]   (s1) at (0,0)     {1. User fills course form};
        \node[step=blue]   (s2) at (0,-1.5)  {2. POST /api/course/generate\\with JWT token};
        \node[step=green]  (s3) at (0,-3.0)  {3. JWT middleware\\verifies token};
        \node[step=green]  (s4) at (0,-4.5)  {4. Controller validates\\input parameters};
        \node[step=purple] (s5) at (0,-6.0)  {5. Groq AI generates\\JSON course plan};
        % Column 2
        \node[step=purple] (s6) at (6,-6.0)  {6. Parse \& validate\\JSON structure};
        \node[step=orange] (s7) at (6,-4.5)  {7. YouTube enrichment\\(parallel batches)};
        \node[step=orange] (s8) at (6,-3.0)  {8. Budget-aware\\video selection};
        \node[step=teal]   (s9) at (6,-1.5)  {9. Save to PostgreSQL\\(Prisma ORM)};
        \node[step=blue]   (s10) at (6,0)    {10. Return course\\to frontend};

        % Arrows
        \draw[arrow] (s1) -- (s2);
        \draw[arrow] (s2) -- (s3);
        \draw[arrow] (s3) -- (s4);
        \draw[arrow] (s4) -- (s5);
        \draw[arrow] (s5) -- (s6);
        \draw[arrow] (s6) -- (s7);
        \draw[arrow] (s7) -- (s8);
        \draw[arrow] (s8) -- (s9);
        \draw[arrow] (s9) -- (s10);

        % Labels
        \node[font=\tiny\sffamily, text=gray] at (-2.5,-1.5) {Frontend};
        \node[font=\tiny\sffamily, text=gray] at (-2.5,-3.75) {Backend};
        \node[font=\tiny\sffamily, text=gray] at (-2.5,-6.0) {AI Service};
        \node[font=\tiny\sffamily, text=gray] at (8.5,-5.25) {Services};
        \node[font=\tiny\sffamily, text=gray] at (8.5,-1.5) {Database};
    \end{tikzpicture}
    \caption{End-to-End Data Flow for Course Generation}
    \label{fig:dataflow}
\end{figure}

\begin{enumerate}[noitemsep]
    \item \textbf{User Input}: The user fills in topic, skill level, number of days, and minutes per day on the \texttt{CreateCourse} page.
    \item \textbf{API Request}: The frontend sends a \texttt{POST /api/course/generate} request with the JWT token.
    \item \textbf{Authentication}: The \texttt{authenticate} middleware verifies the JWT and attaches \texttt{userId} to the request.
    \item \textbf{Input Validation}: The \texttt{generateCourse} controller validates all fields (level must be beginner/intermediate/advanced, days 1--365, time 15--480 minutes).
    \item \textbf{AI Generation}: The \texttt{groqService.generateCoursePlan()} function constructs a structured prompt and calls the Groq API. On failure, it retries up to 3 times with exponential backoff, trying multiple models sequentially.
    \item \textbf{JSON Validation}: The AI response is parsed and validated for required fields (\texttt{overview}, \texttt{modules}, \texttt{dailyPlan}).
    \item \textbf{YouTube Enrichment}: The \texttt{youtubeService.enrichCourseWithVideos()} function fetches videos for each lesson in parallel batches of 5, then sequentially selects the best video per lesson respecting the remaining daily time budget.
    \item \textbf{Database Storage}: The complete course plan (including video metadata) is serialized as JSON and stored in the \texttt{planJson} column of the \texttt{Course} table.
    \item \textbf{Response}: The course data is returned to the frontend for display.
\end{enumerate}

\section{Authentication Flow}

Authentication is a critical cross-cutting concern that touches every protected endpoint. Figure~\ref{fig:authflow} shows the complete registration and login flow.

\begin{figure}[H]
    \centering
    \begin{tikzpicture}[
        step/.style={draw, rounded corners=5pt, minimum width=3.2cm, minimum height=0.8cm,
            font=\scriptsize\sffamily, align=center, thick, fill=#1!12, draw=#1!60},
        step/.default=blue,
        decision/.style={draw, diamond, aspect=2, minimum width=2cm, inner sep=1pt,
            font=\scriptsize\sffamily, align=center, thick, fill=yellow!15, draw=yellow!60},
        arrow/.style={-{Stealth[length=2.5mm]}, thick, draw=darkgray},
    ]
        % Registration column
        \node[font=\small\bfseries\sffamily, text=primaryblue] at (0,1) {Registration};
        \node[step=blue]   (r1) at (0,0)    {User submits\\name, email, password};
        \node[step=green]  (r2) at (0,-1.4) {Validate input};
        \node[decision]    (r3) at (0,-2.9) {User\\exists?};
        \node[step=red]    (r3no) at (3,-2.9) {Return 409\\Conflict};
        \node[step=green]  (r4) at (0,-4.4) {Hash password\\(bcrypt, 10 rounds)};
        \node[step=teal]   (r5) at (0,-5.8) {Create user\\in database};
        \node[step=purple] (r6) at (0,-7.2) {Generate JWT\\(7-day expiry)};
        \node[step=blue]   (r7) at (0,-8.6) {Store token in\\localStorage};

        \draw[arrow] (r1) -- (r2);
        \draw[arrow] (r2) -- (r3);
        \draw[arrow] (r3) -- node[above,font=\tiny] {Yes} (r3no);
        \draw[arrow] (r3) -- node[right,font=\tiny] {No} (r4);
        \draw[arrow] (r4) -- (r5);
        \draw[arrow] (r5) -- (r6);
        \draw[arrow] (r6) -- (r7);

        % Login column
        \node[font=\small\bfseries\sffamily, text=primaryblue] at (7.5,1) {Login};
        \node[step=blue]   (l1) at (7.5,0)    {User submits\\email, password};
        \node[step=green]  (l2) at (7.5,-1.4) {Find user by email};
        \node[decision]    (l3) at (7.5,-2.9) {Found?};
        \node[step=red]    (l3no) at (10.5,-2.9) {Return 401};
        \node[step=green]  (l4) at (7.5,-4.4) {bcrypt.compare\\password};
        \node[decision]    (l5) at (7.5,-5.8) {Match?};
        \node[step=red]    (l5no) at (10.5,-5.8) {Return 401};
        \node[step=purple] (l6) at (7.5,-7.2) {Generate JWT};
        \node[step=blue]   (l7) at (7.5,-8.6) {Redirect to\\Dashboard};

        \draw[arrow] (l1) -- (l2);
        \draw[arrow] (l2) -- (l3);
        \draw[arrow] (l3) -- node[above,font=\tiny] {No} (l3no);
        \draw[arrow] (l3) -- node[right,font=\tiny] {Yes} (l4);
        \draw[arrow] (l4) -- (l5);
        \draw[arrow] (l5) -- node[above,font=\tiny] {No} (l5no);
        \draw[arrow] (l5) -- node[right,font=\tiny] {Yes} (l6);
        \draw[arrow] (l6) -- (l7);
    \end{tikzpicture}
    \caption{Authentication Flow --- Registration and Login}
    \label{fig:authflow}
\end{figure}

\subsection{JWT Token Lifecycle}
Tokens follow a well-defined lifecycle within the system:

\begin{enumerate}[noitemsep]
    \item \textbf{Generation}: Upon successful registration or login, the server signs a JWT containing the \texttt{userId} claim with a secret key, setting a 7-day expiration.
    \item \textbf{Storage}: The frontend stores the token in \texttt{localStorage} for persistence across page refreshes.
    \item \textbf{Transmission}: Every API request includes the token in the \texttt{Authorization: Bearer <token>} header, added automatically by the Axios request interceptor.
    \item \textbf{Verification}: The \texttt{authenticate} middleware extracts the token, verifies its signature and expiration using \texttt{jsonwebtoken.verify()}, and attaches the decoded \texttt{userId} to the request object.
    \item \textbf{Expiration}: After 7 days, the token becomes invalid. The Axios response interceptor catches the resulting 401 error, clears the stored token, and redirects the user to the login page.
\end{enumerate}

\section{API Endpoint Reference}

Table~\ref{tab:api-endpoints} lists all REST API endpoints exposed by the backend.

\begin{table}[H]
\centering
\caption{REST API Endpoint Reference}
\label{tab:api-endpoints}
\begin{tabularx}{\textwidth}{l l l X}
\toprule
\textbf{Method} & \textbf{Endpoint} & \textbf{Auth} & \textbf{Description} \\
\midrule
POST & \texttt{/api/auth/register}      & No  & Register a new user \\
POST & \texttt{/api/auth/login}         & No  & Login and receive JWT \\
\midrule
POST & \texttt{/api/course/generate}    & Yes & Generate a new AI course \\
POST & \texttt{/api/course/generate-sse} & Yes & Generate course with SSE progress \\
GET  & \texttt{/api/course/}             & Yes & List user's courses \\
GET  & \texttt{/api/course/:id}          & Yes & Get course by ID \\
DELETE & \texttt{/api/course/:id}        & Yes & Delete a course \\
POST & \texttt{/api/course/:id/regenerate} & Yes & Regenerate a single day \\
POST & \texttt{/api/course/:id/share}    & Yes & Toggle course sharing \\
GET  & \texttt{/api/course/:id/sharing}  & Yes & Get sharing status \\
GET  & \texttt{/api/course/shared/:token} & No  & View shared course (public) \\
\midrule
PUT  & \texttt{/api/course/progress}     & Yes & Update lesson progress \\
GET  & \texttt{/api/activity/}            & Yes & Get activity log \\
\bottomrule
\end{tabularx}
\end{table}


% ══════════════════════════════════════════════════════════════════
%  CHAPTER 3 — DATA INGESTION (AI COURSE GENERATION)
% ══════════════════════════════════════════════════════════════════
\chapter{Data Ingestion — AI Course Generation}

\section{Overview}
In the context of PlanMyStudy AI, ``data ingestion'' refers to the process of generating and acquiring structured educational content through AI inference and external API calls. Unlike traditional data engineering pipelines that ingest data from files, databases, or streams, this system \emph{creates} data on demand by prompting a large language model and then enriching the output with video metadata from the YouTube Data API.

\section{Groq AI Integration}
The system uses the Groq inference platform, which provides ultra-fast inference speeds using custom hardware (Language Processing Units). The service supports multiple models with automatic fallback:

\begin{enumerate}[noitemsep]
    \item \texttt{llama-3.1-70b-versatile} — Primary model (highest quality)
    \item \texttt{llama-3.1-8b-instant} — Fallback (faster, slightly lower quality)
    \item \texttt{mixtral-8x7b-32768} — Secondary fallback (mixture-of-experts architecture)
\end{enumerate}

\subsection{Prompt Engineering}
The AI prompt is carefully structured to produce predictable, parseable JSON output. Key design decisions include:

\begin{itemize}[noitemsep]
    \item \textbf{System message}: Enforces JSON-only responses with no markdown formatting.
    \item \textbf{Template embedding}: The exact JSON schema is included in the prompt so the model knows the expected structure.
    \item \textbf{Constraint specification}: Total days, minutes per day, lessons per day, and module count are explicitly stated.
    \item \textbf{Quiz generation}: Each lesson includes 2--3 multiple-choice questions with explanations.
    \item \textbf{Importance tagging}: Lessons are tagged as \texttt{"core"}, \texttt{"important"}, or \texttt{"bonus"} to guide prioritization.
\end{itemize}

\begin{lstlisting}[language=JavaScript,caption={Groq AI Course Generation (groqService.js -- excerpt)},label={lst:groq-prompt}]
export const generateCoursePlan = async (topic, level, days, timePerDay) => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const prompt = `Create a ${days}-day study plan for "${topic}"
        (${level} level, ${timePerDay} min/day).

Return JSON only:
{
  "overview": {
    "title": "Course Title",
    "description": "Brief description",
    "objectives": ["obj1", "obj2", "obj3"]
  },
  "modules": [
    {"id": "m1", "title": "Module Name",
     "description": "Brief", "objectives": ["obj"]}
  ],
  "dailyPlan": [
    {
      "day": 1,
      "moduleId": "m1",
      "lessons": [
        {
          "id": "l1", "title": "Lesson Title",
          "description": "Brief description",
          "objectives": ["obj"],
          "timeMinutes": ${Math.floor(timePerDay / 2)},
          "keywords": ["keyword1", "keyword2"],
          "importance": "core",
          "quiz": [
            {
              "question": "Quiz question",
              "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
              "correctAnswer": "A",
              "explanation": "Why A is correct"
            }
          ]
        }
      ]
    }
  ]
}`;
      // Call Groq API with 30-second timeout
      const models = ['llama-3.1-70b-versatile',
                      'llama-3.1-8b-instant',
                      'mixtral-8x7b-32768'];
      let response;
      for (const model of models) {
        try {
          response = await groq.chat.completions.create({
            model: model,
            messages: [
              { role: 'system',
                content: 'You are an expert educational course designer.
                  Always return valid JSON only.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 3000,
          });
          break; // Success
        } catch (modelError) {
          if (modelError.message?.includes('decommissioned'))
            continue; // Try next model
          else throw modelError;
        }
      }
      // Parse and validate JSON response ...
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) throw new AppError(errorMessage, 500);
      // Exponential backoff
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
};
\end{lstlisting}

\section{YouTube Video Enrichment}
After the AI generates the course plan, each lesson is enriched with a relevant YouTube video. The enrichment pipeline proceeds as follows:

\begin{enumerate}[noitemsep]
    \item \textbf{Query Construction}: For each lesson, a search query is built from the lesson title, up to 2 unique keywords, and the word ``tutorial''.
    \item \textbf{YouTube Search}: The YouTube Data API \texttt{search.list} endpoint is called with \texttt{videoCategoryId=27} (Education), \texttt{videoEmbeddable=true}, and \texttt{safeSearch=strict}.
    \item \textbf{Duration Retrieval}: A second API call to \texttt{videos.list} fetches \texttt{contentDetails} (ISO~8601 duration), \texttt{statistics} (view count), and \texttt{snippet} (metadata) for each result.
    \item \textbf{Video Selection}: The best video is chosen using a multi-criteria scoring algorithm (Section~\ref{sec:video-selection}).
\end{enumerate}

\subsection{Parallel Fetching Strategy}
To minimize total enrichment time, the system fetches videos for all lessons within a day in parallel using \texttt{Promise.all}, processing them in batches of 5 to avoid YouTube API rate limits:

\begin{lstlisting}[language=JavaScript,caption={Parallel Video Fetching (youtubeService.js -- excerpt)},label={lst:parallel-fetch}]
const fetchVideosInBatches = async (lessons, courseTopic, batchSize = 5) => {
  const results = [];
  for (let i = 0; i < lessons.length; i += batchSize) {
    const batch = lessons.slice(i, i + batchSize);
    // Fetch all videos in this batch in parallel
    const batchResults = await Promise.all(
      batch.map(lesson => fetchVideosForLesson(lesson, courseTopic))
    );
    results.push(...batchResults);
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < lessons.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  return results;
};
\end{lstlisting}


% ══════════════════════════════════════════════════════════════════
%  CHAPTER 4 — TRANSFORMATION (BACKEND SERVICE LAYER)
% ══════════════════════════════════════════════════════════════════
\chapter{Data Transformation — Backend Service Layer}

\section{Overview}
The ``transformation'' stage in PlanMyStudy AI corresponds to the backend service layer, which transforms raw AI output and YouTube API responses into validated, enriched, and budget-aware course plans. This chapter details the key transformation algorithms and validation logic.

\section{AI Response Parsing and Validation}
The Groq AI model occasionally returns responses wrapped in markdown code blocks or with minor structural deviations. The parsing pipeline handles these cases:

\begin{lstlisting}[language=JavaScript,caption={JSON Parsing with Markdown Stripping},label={lst:json-parse}]
// Remove markdown code blocks if present
let jsonString = content;
if (content.startsWith('```')) {
  jsonString = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

// Parse JSON
const coursePlan = JSON.parse(jsonString);

// Validate structure
if (!coursePlan.overview || !coursePlan.modules || !coursePlan.dailyPlan) {
  throw new Error('Invalid course plan structure');
}

// Validate daily plan matches requested days
if (coursePlan.dailyPlan.length !== days) {
  throw new Error(
    `Daily plan has ${coursePlan.dailyPlan.length} days, expected ${days}`
  );
}
\end{lstlisting}

\section{Retry Logic with Exponential Backoff}
The system implements a robust retry mechanism for both AI generation and YouTube API calls:

\begin{table}[H]
\centering
\caption{Retry Strategy Parameters}
\label{tab:retry}
\begin{tabular}{l c c}
\toprule
\textbf{Parameter}       & \textbf{AI (Groq)}       & \textbf{YouTube} \\
\midrule
Maximum Retries          & 3                        & 1 (per lesson)   \\
Backoff Strategy         & Exponential ($1000 \times \text{attempt}$ ms) & Fixed 100\,ms between batches \\
Rate Limit Wait          & 10\,000\,ms              & N/A \\
Timeout                  & 30\,000\,ms              & 5\,000\,ms per lesson \\
Model Fallback           & Yes (3 models)           & N/A \\
\bottomrule
\end{tabular}
\end{table}

\section{ISO 8601 Duration Parsing}
YouTube returns video durations in ISO~8601 format (e.g., \texttt{PT4M13S} for 4 minutes and 13 seconds). The system parses these into seconds for budget calculations:

\begin{lstlisting}[language=JavaScript,caption={ISO 8601 Duration Parser},label={lst:duration-parse}]
const parseISO8601Duration = (duration) => {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  return hours * 3600 + minutes * 60 + seconds;
};
\end{lstlisting}

\section{Time-Budget Allocation Algorithm}\label{sec:video-selection}
The most sophisticated transformation in the pipeline is the time-budget-aware video selection. For each day, the system maintains a remaining time budget and selects videos that fit within it.

\subsection{Video Filtering}
Before scoring, videos are filtered through multiple criteria:

\begin{itemize}[noitemsep]
    \item \textbf{Blacklist Filter}: Videos with titles containing keywords like ``full course'', ``crash course'', ``bootcamp'', ``masterclass'', ``10 hours'', etc.\ are excluded.
    \item \textbf{Minimum Duration}: Videos shorter than 60 seconds are excluded (likely intros or Shorts).
    \item \textbf{Maximum Duration}: Videos longer than $1.5\times$ the lesson's estimated time are excluded.
\end{itemize}

\subsection{Relevance Scoring}
Each candidate video receives a relevance score (0--100) based on:

\begin{table}[H]
\centering
\caption{Video Relevance Scoring Criteria}
\label{tab:scoring}
\begin{tabular}{l c}
\toprule
\textbf{Criterion}                             & \textbf{Score} \\
\midrule
Exact lesson title match in video title         & +40 \\
Keyword match in video title (per keyword)      & +15 \\
Keyword match in video description (per keyword)& +5  \\
Educational indicator in title (tutorial, etc.)  & +5  \\
Title length $>$ 100 characters (penalty)        & $-10$ \\
\bottomrule
\end{tabular}
\end{table}

\subsection{Budget-Aware Selection}
After scoring, the algorithm selects the highest-scoring video that fits within the remaining daily budget (with a $\pm 2$-minute buffer). If no video fits, the shortest relevant video is selected as a fallback and flagged with \texttt{withinBudget: false}.

\begin{lstlisting}[language=JavaScript,caption={Budget-Aware Video Selection (excerpt)},label={lst:budget-select}]
const selectBestVideo = (videos, lesson, remainingBudgetSeconds) => {
  // ... filtering and scoring logic ...
  // Sort by relevance score (descending)
  candidates.sort((a, b) => b.relevanceScore - a.relevanceScore);
  // Find the best video that fits the remaining budget
  const budgetWithBuffer = remainingBudgetSeconds + (TIME_BUFFER_MINUTES * 60);
  for (const video of candidates) {
    if (video.durationSeconds <= budgetWithBuffer) {
      return { ...video, withinBudget: true };
    }
  }
  // Fallback: pick the shortest relevant video
  const shortestVideo = candidates.reduce((shortest, current) =>
    current.durationSeconds < shortest.durationSeconds ? current : shortest
  );
  return {
    ...shortestVideo,
    withinBudget: false,
    budgetExceededBy: shortestVideo.durationSeconds - remainingBudgetSeconds,
  };
};
\end{lstlisting}


% ══════════════════════════════════════════════════════════════════
%  CHAPTER 5 — DATA MODELLING
% ══════════════════════════════════════════════════════════════════
\chapter{Data Modelling}

\section{Entity--Relationship Overview}
PlanMyStudy AI uses a PostgreSQL relational database with five models managed through the Prisma ORM. The entity relationships are illustrated in Figure~\ref{fig:erd}.

\begin{figure}[H]
    \centering
    \begin{tikzpicture}[
        entity/.style={draw, rounded corners=4pt, minimum width=3.5cm, minimum height=2cm,
            font=\scriptsize\sffamily, align=left, thick, fill=#1!8, draw=#1!50,
            inner sep=6pt},
        entity/.default=blue,
        title/.style={font=\small\bfseries\sffamily},
        rel/.style={-{Stealth[length=2.5mm]}, thick, draw=darkgray},
        lbl/.style={font=\tiny\sffamily, text=codegray, fill=white, inner sep=1pt},
    ]
        % User
        \node[entity=blue] (user) at (0,0) {
            \textbf{User}\\[2pt]
            \texttt{id} : UUID (PK)\\
            \texttt{name} : String\\
            \texttt{email} : String (unique)\\
            \texttt{password} : String (hashed)\\
            \texttt{createdAt} : DateTime\\
            \texttt{updatedAt} : DateTime
        };

        % Course
        \node[entity=green] (course) at (6,0) {
            \textbf{Course}\\[2pt]
            \texttt{id} : UUID (PK)\\
            \texttt{userId} : UUID (FK)\\
            \texttt{topic} : String\\
            \texttt{level} : String\\
            \texttt{days} : Int\\
            \texttt{timePerDay} : Int\\
            \texttt{planJson} : Text (JSON)\\
            \texttt{isPublic} : Boolean\\
            \texttt{shareToken} : String?
        };

        % Progress
        \node[entity=orange] (progress) at (12,1.5) {
            \textbf{Progress}\\[2pt]
            \texttt{id} : UUID (PK)\\
            \texttt{courseId} : UUID (FK)\\
            \texttt{day} : Int\\
            \texttt{lessonId} : String\\
            \texttt{completed} : Boolean\\
            \texttt{completedAt} : DateTime?
        };

        % Note
        \node[entity=purple] (note) at (12,-2.0) {
            \textbf{Note}\\[2pt]
            \texttt{id} : UUID (PK)\\
            \texttt{userId} : UUID (FK)\\
            \texttt{courseId} : UUID (FK)\\
            \texttt{day} : Int\\
            \texttt{lessonId} : String\\
            \texttt{content} : Text
        };

        % ActivityLog
        \node[entity=teal] (activity) at (0,-5) {
            \textbf{ActivityLog}\\[2pt]
            \texttt{id} : UUID (PK)\\
            \texttt{userId} : UUID (FK)\\
            \texttt{date} : Date\\
            \texttt{count} : Int
        };

        % Relationships
        \draw[rel] (user.east) -- node[lbl, above] {1 : N} (course.west);
        \draw[rel] (course.east) ++ (0,0.5) -- node[lbl, above] {1 : N} (progress.west);
        \draw[rel] (course.east) ++ (0,-0.5) -- node[lbl, below] {1 : N} (note.west);
        \draw[rel] (user.south) -- node[lbl, right] {1 : N} (activity.north);
        \draw[rel, dashed] (user.south east) -- node[lbl, above, sloped] {1 : N} (note.north west);
    \end{tikzpicture}
    \caption{Entity--Relationship Diagram for PlanMyStudy AI}
    \label{fig:erd}
\end{figure}

\begin{verbatim}
User (1) ────< (Many) Course
                    │
                    │ (1)
                    └───< (Many) Progress
                    └───< (Many) Note

User (1) ────< (Many) ActivityLog
\end{verbatim}

\section{Prisma Schema}

\begin{lstlisting}[language=Prisma,caption={Complete Prisma Schema (schema.prisma)},label={lst:prisma-schema}]
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String   // Hashed with bcrypt (10 rounds)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  courses   Course[]
  activities ActivityLog[]
  notes     Note[]
}

model Course {
  id         String   @id @default(uuid())
  userId     String
  topic      String
  level      String   // beginner | intermediate | advanced
  days       Int
  timePerDay Int      // minutes per day
  planJson   String   @db.Text  // Full course plan as JSON
  isPublic   Boolean  @default(false)
  shareToken String?  @unique
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [userId],
                                references: [id],
                                onDelete: Cascade)
  progress   Progress[]
  notes      Note[]
  @@index([userId])
  @@index([shareToken])
}

model Progress {
  id          String    @id @default(uuid())
  courseId     String
  day         Int
  lessonId    String
  completed   Boolean   @default(false)
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  course      Course    @relation(fields: [courseId],
                                  references: [id],
                                  onDelete: Cascade)
  @@unique([courseId, day, lessonId])
  @@index([courseId])
}

model ActivityLog {
  id        String   @id @default(uuid())
  userId    String
  date      DateTime @db.Date
  count     Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId],
                                references: [id],
                                onDelete: Cascade)
  @@unique([userId, date])
  @@index([userId])
  @@index([date])
}

model Note {
  id        String   @id @default(uuid())
  userId    String
  courseId   String
  day       Int
  lessonId  String
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId],
                                references: [id],
                                onDelete: Cascade)
  course    Course   @relation(fields: [courseId],
                                references: [id],
                                onDelete: Cascade)
  @@unique([courseId, day, lessonId])
  @@index([userId])
  @@index([courseId])
}
\end{lstlisting}

\section{Model Descriptions}

\subsection{User Model}
The \texttt{User} model stores authentication credentials and serves as the root entity. Passwords are stored as bcrypt hashes with 10 rounds of salting. UUIDs are used as primary keys for unpredictability and distributed-system readiness.

\subsection{Course Model}
The \texttt{Course} model stores both metadata (topic, level, days, timePerDay) and the full AI-generated course plan as a JSON text field (\texttt{planJson}). This model also supports course sharing through an optional unique \texttt{shareToken} and an \texttt{isPublic} boolean flag.

\subsection{Progress Model}
The \texttt{Progress} model tracks per-lesson completion using a composite unique constraint on \texttt{(courseId, day, lessonId)}. This uses the Prisma \texttt{upsert} operation to create or update a progress record atomically.

\subsection{ActivityLog Model}
The \texttt{ActivityLog} model tracks daily user activity counts with a composite unique constraint on \texttt{(userId, date)}. This data powers the GitHub-style activity heatmap on the dashboard.

\subsection{Note Model}
The \texttt{Note} model stores per-lesson markdown notes with a composite unique constraint on \texttt{(courseId, day, lessonId)}, allowing one note per lesson per user.

\section{Why JSON for Course Plans?}
The course plan is stored as a JSON text field rather than normalized relational tables for several reasons:

\begin{enumerate}[noitemsep]
    \item \textbf{Dynamic Structure}: AI generates plans with varying structures depending on the topic.
    \item \textbf{Atomic Read/Write}: The entire plan is always read and written as a unit, making JSON storage efficient.
    \item \textbf{Schema Flexibility}: New fields (quizzes, importance tags, video stats) can be added without database migrations.
    \item \textbf{Performance}: A single database read retrieves the complete plan, avoiding complex joins across lesson/module/day tables.
    \item \textbf{Simplicity}: The JSON structure mirrors the API response format, eliminating serialization overhead.
\end{enumerate}


% ══════════════════════════════════════════════════════════════════
%  CHAPTER 6 — FRONTEND & DASHBOARD
% ══════════════════════════════════════════════════════════════════
\chapter{Frontend \& Dashboard}

\section{Overview}
The PlanMyStudy AI frontend is a React 18 single-page application built with Vite and styled with Tailwind CSS. It provides a rich, interactive experience for creating courses, tracking progress, and consuming educational content---all within the browser. The application uses Framer Motion for smooth page transitions and micro-animations, React Hot Toast for notification feedback, and a comprehensive skeleton loading system for perceived performance.

\section{Landing Page}
The landing page (Figure~\ref{fig:landing}) is the first screen users encounter. It features a dark-themed hero section with the tagline ``Design your learning path \textbf{with intelligence}'' in a bold typographic treatment with an accent gradient on the key phrase. Two prominent call-to-action buttons---``Create New Course'' and ``Dashboard''---guide users into the application. The navigation bar displays the PlanMyStudy AI logo, links to Dashboard and Create Course, and the authenticated user's name with a logout button.

\begin{figure}[H]
    \centering
    \includegraphics[width=\textwidth]{figures/landing_page.png}
    \caption{PlanMyStudy AI --- Landing Page with Hero Section and Call-to-Action Buttons}
    \label{fig:landing}
\end{figure}

\section{Dashboard Page}
The dashboard serves as the user's home screen after login. It features:

\begin{itemize}[noitemsep]
    \item \textbf{Activity Heatmap}: A GitHub-style contribution calendar showing daily study activity over the past year. Each cell is colour-coded based on the number of lessons completed that day, pulled from the \texttt{ActivityLog} model.
    \item \textbf{Streak Counter}: Displays the user's current consecutive-day learning streak, motivating daily engagement.
    \item \textbf{Course Progress Bar}: An aggregate progress indicator showing overall completion across all courses.
    \item \textbf{Course Cards}: A responsive grid of cards (1 column on mobile, 2 on tablet, 3 on desktop) showing each generated course with topic, level, day count, and a progress bar indicating completion percentage.
    \item \textbf{Quick Actions}: A prominent ``Create New Course'' button with hover and tap animations.
    \item \textbf{Empty State}: When no courses exist, a custom illustration with a call-to-action guides new users.
    \item \textbf{Skeleton Loading}: While data loads, animated skeleton placeholders maintain layout stability.
\end{itemize}

\begin{figure}[H]
    \centering
    \begin{tikzpicture}[
        box/.style={draw, rounded corners=4pt, thick, fill=#1!6, draw=#1!40},
        box/.default=gray,
        label/.style={font=\tiny\sffamily, text=codegray},
    ]
        % Outer frame
        \draw[thick, rounded corners=6pt, fill=white, draw=gray!40] (0,0) rectangle (14,-10.5);

        % Header bar
        \fill[primaryblue!90, rounded corners=4pt] (0.3,0) rectangle (13.7,-0.8);
        \node[font=\small\bfseries\sffamily, text=white] at (2,-0.4) {PlanMyStudy AI};
        \node[font=\tiny\sffamily, text=white!80] at (11.5,-0.4) {Dashboard | Create | Logout};

        % Title
        \node[font=\normalsize\bfseries\sffamily, anchor=west] at (0.5,-1.4) {My Courses};
        \node[font=\tiny\sffamily, text=gray, anchor=west] at (0.5,-1.8) {3 courses in your library};

        % Create button
        \fill[green!60!black, rounded corners=3pt] (11,-1.2) rectangle (13.5,-1.9);
        \node[font=\tiny\bfseries\sffamily, text=white] at (12.25,-1.55) {+ Create New Course};

        % Streak Counter (left)
        \node[box=orange, minimum width=3.5cm, minimum height=2.5cm] (streak) at (2.3,-3.5) {};
        \node[font=\scriptsize\bfseries\sffamily] at (2.3,-2.6) {Streak Counter};
        \node[font=\Large\bfseries\sffamily, text=orange!70!black] at (2.3,-3.5) {7 days};
        \node[font=\tiny\sffamily, text=gray] at (2.3,-4.2) {Current streak};

        % Activity Heatmap (right)
        \node[box=green, minimum width=9cm, minimum height=2.5cm] (heatmap) at (9,-3.5) {};
        \node[font=\scriptsize\bfseries\sffamily] at (6,-2.6) {Activity Heatmap};
        % Draw heatmap cells
        \foreach \x in {5.2,5.5,...,12.5} {
            \foreach \y in {-3.0,-3.3,...,-4.5} {
                \pgfmathsetmacro{\intensity}{random(0,4)*25}
                \fill[green!\intensity!white, draw=green!20, rounded corners=0.5pt]
                    (\x,\y) rectangle +(0.22,0.22);
            }
        }

        % Course Progress Bar
        \node[box=blue, minimum width=13cm, minimum height=0.6cm] at (7,-5.3) {};
        \fill[blue!40, rounded corners=2pt] (0.7,-5.55) rectangle (9,-5.05);
        \node[font=\tiny\sffamily] at (7,-5.3) {Overall: 18/28 lessons completed (64\%)};

        % Course Cards Row
        \foreach \i/\topic/\pct in {1/React Development/85, 2/Machine Learning/42, 3/Python Basics/100} {
            \pgfmathsetmacro{\xpos}{0.3 + (\i-1)*4.5}
            \node[box=blue, minimum width=4cm, minimum height=3.5cm] at (\xpos+2,-8) {};
            \node[font=\scriptsize\bfseries\sffamily, anchor=west] at (\xpos+0.3,-6.6) {\topic};
            \node[font=\tiny\sffamily, text=gray, anchor=west] at (\xpos+0.3,-7.0) {Beginner $\cdot$ 7 days};
            % Progress bar
            \fill[gray!20, rounded corners=1.5pt] (\xpos+0.3,-7.4) rectangle +(3.4,0.25);
            \pgfmathsetmacro{\barwidth}{3.4*\pct/100}
            \fill[primaryblue!70, rounded corners=1.5pt] (\xpos+0.3,-7.4) rectangle +(\barwidth,0.25);
            \node[font=\tiny\sffamily, text=gray, anchor=west] at (\xpos+0.3,-7.6) {\pct\% complete};
            % Delete icon placeholder
            \node[font=\tiny\sffamily, text=red!50] at (\xpos+3.4,-8.8) {Delete};
        }
    \end{tikzpicture}
    \caption{Dashboard Page Wireframe --- Activity Heatmap, Streak Counter, and Course Cards}
    \label{fig:dashboard}
\end{figure}

Figure~\ref{fig:dashboard-screenshot} shows the actual dashboard as rendered in production, displaying the streak counter, activity calendar heatmap, overall progress bar with statistics cards (Completed, In Progress, Total Courses, Lessons), and course cards with progress indicators.

\begin{figure}[H]
    \centering
    \includegraphics[width=\textwidth]{figures/dashboard.png}
    \caption{Dashboard Page --- Streak Counter, Activity Calendar, Progress Statistics, and Course Cards}
    \label{fig:dashboard-screenshot}
\end{figure}

\section{CreateCourse Wizard}
The course creation page provides a guided 4-step wizard that walks users through the entire course specification process. Each step has a progress bar at the top showing completion percentage. Figures~\ref{fig:wizard-step1} through~\ref{fig:wizard-step4} show the four steps.

\begin{figure}[H]
    \centering
    \begin{subfigure}[b]{0.48\textwidth}
        \centering
        \includegraphics[width=\textwidth]{figures/create_step1_topic.png}
        \caption{Step 1 --- Topic Selection}
        \label{fig:wizard-step1}
    \end{subfigure}
    \hfill
    \begin{subfigure}[b]{0.48\textwidth}
        \centering
        \includegraphics[width=\textwidth]{figures/create_step2_level.png}
        \caption{Step 2 --- Level Selection}
        \label{fig:wizard-step2}
    \end{subfigure}
    \\[0.5cm]
    \begin{subfigure}[b]{0.48\textwidth}
        \centering
        \includegraphics[width=\textwidth]{figures/create_step3_time.png}
        \caption{Step 3 --- Time Commitment}
        \label{fig:wizard-step3}
    \end{subfigure}
    \hfill
    \begin{subfigure}[b]{0.48\textwidth}
        \centering
        \includegraphics[width=\textwidth]{figures/create_step4_review.png}
        \caption{Step 4 --- Review \& Generate}
        \label{fig:wizard-step4}
    \end{subfigure}
    \caption{CreateCourse 4-Step Wizard --- Complete Course Generation Flow}
    \label{fig:create-wizard}
\end{figure}

\subsection{Step 1 --- Topic Selection (Figure~\ref{fig:wizard-step1})}
The first step presents a text input field for the learning topic with a list of popular topic suggestions (React Development, Machine Learning, Python Programming, Data Science, Web Design, etc.) as clickable chips. A ``Pro tip'' banner advises users to be specific with their topic for better results.

\subsection{Step 2 --- Level Selection (Figure~\ref{fig:wizard-step2})}
Three level options are presented as detailed cards:
\begin{itemize}[noitemsep]
    \item \textbf{Complete Beginner}: ``Start with fundamentals, gentle learning curve, more practice exercises.''
    \item \textbf{Some Experience}: ``Skip basic concepts, focus on practical skills, intermediate challenges.''
    \item \textbf{Advanced Learner}: ``Advanced concepts only, complex projects, expert-level material.''
\end{itemize}
Each card shows a distinctive icon and is highlighted with a cyan border when selected.

\subsection{Step 3 --- Time Commitment (Figure~\ref{fig:wizard-step3})}
Four preset schedule options are offered as cards:
\begin{itemize}[noitemsep]
    \item \textbf{Quick Intro}: 3 days \texttimes\ 30 min/day
    \item \textbf{One Week Intensive}: 7 days \texttimes\ 60 min/day (highlighted as ``Popular choice'')
    \item \textbf{Two Week Journey}: 14 days \texttimes\ 45 min/day
    \item \textbf{Monthly Challenge}: 30 days \texttimes\ 30 min/day
\end{itemize}
Below the presets, a ``Or customize your plan'' section allows manual entry of total days (1--365) and minutes per day (15--480), with a calculated total study time displayed.

\subsection{Step 4 --- Review \& Generate (Figure~\ref{fig:wizard-step4})}
The final step displays a summary card titled ``Your Learning Plan'' showing the selected topic, level, and duration. A ``What to expect'' section lists the features the user will receive:
\begin{itemize}[noitemsep]
    \item Personalized daily lessons tailored to their level
    \item Curated video resources and learning materials
    \item Interactive quizzes and progress tracking
    \item Notes feature to capture insights
\end{itemize}
The ``Generate My Course'' button triggers the AI generation pipeline, transitioning to SSE progress updates:
\begin{itemize}[noitemsep]
    \item ``Creating your personalized study plan\ldots''
    \item ``Study plan created! Finding videos for Day 1\ldots''
    \item ``Finding videos for Day 2\ldots'' (and so on)
    \item ``All videos found! Saving your course\ldots''
    \item ``Course created successfully!''
\end{itemize}

\section{CourseDetail Page}
The course detail view is the most feature-rich page in the application, containing multiple interactive sections for a comprehensive learning experience. Figure~\ref{fig:course-header} shows the course overview header with title, learning objectives, and action buttons. Figure~\ref{fig:course-modules} displays the module cards, and Figure~\ref{fig:daily-plan} shows the daily study plan with a lesson card, video resource, quiz prompt, and notes section.

\begin{figure}[H]
    \centering
    \includegraphics[width=\textwidth]{figures/course_header.png}
    \caption{Course Detail --- Header with Title, Level Badge, Progress Bar, Share and Export Buttons, and Learning Objectives}
    \label{fig:course-header}
\end{figure}

\begin{figure}[H]
    \centering
    \includegraphics[width=\textwidth]{figures/course_modules.png}
    \caption{Course Detail --- Module Cards Showing Module Number, Title, Description, and Learning Goals}
    \label{fig:course-modules}
\end{figure}

\begin{figure}[H]
    \centering
    \includegraphics[width=\textwidth]{figures/daily_study_plan.png}
    \caption{Course Detail --- Daily Study Plan with Day Tabs, Lesson Card, YouTube Video Resource, Quiz Prompt, Notes, and Mark as Complete Button}
    \label{fig:daily-plan}
\end{figure}

Figure~\ref{fig:coursedetail} provides a schematic layout of all these components together.

\begin{figure}[H]
    \centering
    \begin{tikzpicture}[
        box/.style={draw, rounded corners=4pt, thick, fill=#1!6, draw=#1!40},
        box/.default=gray,
    ]
        % Outer frame
        \draw[thick, rounded corners=6pt, fill=white, draw=gray!40] (0,0) rectangle (14,-12);

        % Header
        \fill[primaryblue!90, rounded corners=4pt] (0.3,0) rectangle (13.7,-0.8);
        \node[font=\small\bfseries\sffamily, text=white] at (2,-0.4) {PlanMyStudy AI};

        % Course Title
        \node[font=\normalsize\bfseries\sffamily, anchor=west] at (0.5,-1.3) {React Development};
        \node[font=\tiny\sffamily, text=gray, anchor=west] at (0.5,-1.7) {Beginner $\cdot$ 7 days $\cdot$ 60 min/day};

        % Overall Progress
        \fill[gray!15, rounded corners=2pt] (8.5,-1.1) rectangle (13.5,-1.8);
        \fill[green!50, rounded corners=2pt] (8.5,-1.1) rectangle (11.8,-1.8);
        \node[font=\tiny\bfseries\sffamily] at (11,-1.45) {12/14 lessons (86\%)};

        % Buttons row
        \fill[blue!60, rounded corners=2pt] (10,-2.1) rectangle (11.5,-2.6);
        \node[font=\tiny\sffamily, text=white] at (10.75,-2.35) {Export PDF};
        \fill[purple!60, rounded corners=2pt] (11.8,-2.1) rectangle (13.5,-2.6);
        \node[font=\tiny\sffamily, text=white] at (12.65,-2.35) {Share Course};

        % Day Tabs
        \foreach \d/\col in {1/primaryblue!80, 2/gray!30, 3/gray!30, 4/gray!30, 5/gray!30, 6/gray!30, 7/gray!30} {
            \pgfmathsetmacro{\xp}{0.5 + (\d-1)*1.9}
            \fill[\col, rounded corners=2pt] (\xp,-3.0) rectangle +(1.6,0.6);
            \ifnum\d=1
                \node[font=\tiny\bfseries\sffamily, text=white] at (\xp+0.8,-2.7) {Day \d\ \checkmark};
            \else
                \node[font=\tiny\sffamily] at (\xp+0.8,-2.7) {Day \d};
            \fi
        }

        % Lesson Card 1
        \node[box=blue, minimum width=13cm, minimum height=3cm] at (7,-5) {};
        \fill[green!60, rounded corners=1pt] (0.8,-3.7) rectangle (1.8,-4.0);
        \node[font=\tiny\bfseries\sffamily, text=white] at (1.3,-3.85) {CORE};
        \node[font=\scriptsize\bfseries\sffamily, anchor=west] at (2,-3.85) {Introduction to React};
        \node[font=\tiny\sffamily, text=gray, anchor=west] at (0.8,-4.3) {What is React and why use it for modern web development};
        \node[font=\tiny\sffamily, text=gray, anchor=west] at (0.8,-4.7) {Objectives: Understand SPA architecture, Learn about Virtual DOM};
        \fill[gray!15, rounded corners=2pt] (0.8,-5.0) rectangle (6,-5.3);
        \node[font=\tiny\sffamily, text=gray] at (3.4,-5.15) {\textbf{Video:} React Tutorial for Beginners (28:45)};
        \node[font=\tiny\sffamily, text=gray, anchor=west] at (0.8,-5.6) {Keywords: \texttt{react} \texttt{SPA} \texttt{virtual-DOM}};
        \fill[green!50, rounded corners=2pt] (11,-3.7) rectangle (13.2,-4.1);
        \node[font=\tiny\bfseries\sffamily, text=white] at (12.1,-3.9) {\checkmark\ Completed};

        % Lesson Card 2
        \node[box=orange, minimum width=13cm, minimum height=2cm] at (7,-7.5) {};
        \fill[orange!60, rounded corners=1pt] (0.8,-6.7) rectangle (2.2,-7.0);
        \node[font=\tiny\bfseries\sffamily, text=white] at (1.5,-6.85) {IMPORTANT};
        \node[font=\scriptsize\bfseries\sffamily, anchor=west] at (2.4,-6.85) {JSX Syntax and Expressions};
        \node[font=\tiny\sffamily, text=gray, anchor=west] at (0.8,-7.3) {Learn JSX syntax, embedding expressions, and conditional rendering};
        \fill[gray!15, rounded corners=2pt] (0.8,-7.6) rectangle (6,-7.9);
        \node[font=\tiny\sffamily, text=gray] at (3.4,-7.75) {\textbf{Video:} JSX Explained in 10 Minutes (10:22)};
        \fill[gray!30, rounded corners=2pt] (11,-6.7) rectangle (13.2,-7.1);
        \node[font=\tiny\sffamily] at (12.1,-6.9) {Mark Complete};

        % Quiz section indicator
        \node[box=purple, minimum width=13cm, minimum height=1.2cm] at (7,-9.2) {};
        \node[font=\scriptsize\bfseries\sffamily, text=purple!70!black] at (3,-9.0) {Quiz: 3 Questions};
        \node[font=\tiny\sffamily, text=gray] at (3,-9.4) {Test your understanding of today's lessons};

        % Notes section indicator
        \node[box=teal, minimum width=13cm, minimum height=1.2cm] at (7,-10.8) {};
        \node[font=\scriptsize\bfseries\sffamily, text=teal!70!black] at (2.5,-10.6) {Notes};
        \node[font=\tiny\sffamily, text=gray] at (4,-11.0) {Write and save notes for this lesson...};
    \end{tikzpicture}
    \caption{CourseDetail Page Wireframe --- Day Tabs, Lesson Cards, Quiz, and Notes}
    \label{fig:coursedetail}
\end{figure}

\subsection{Day Tabs}
A horizontal tab bar at the top allows switching between days. Each tab shows the day number and a completion indicator (checkmark when all lessons for that day are complete, or an open circle otherwise). The active tab is highlighted with the primary colour.

\subsection{Lesson Cards}
Each day displays its lessons as expandable cards showing:
\begin{itemize}[noitemsep]
    \item Lesson title, description, and estimated time in minutes
    \item Learning objectives as a bulleted list
    \item Importance badge with colour coding: \textcolor{green!60!black}{\textbf{CORE}} (green), \textcolor{orange!80!black}{\textbf{IMPORTANT}} (orange), \textcolor{blue!60!black}{\textbf{BONUS}} (blue)
    \item A ``Mark Complete'' toggle button that transitions to a green checkmark
    \item Keywords displayed as styled tags for quick topic identification
\end{itemize}

\subsection{Video Embed Modal}
Each lesson with a video resource shows a YouTube thumbnail with duration overlay. Clicking it opens a full-screen modal with:
\begin{itemize}[noitemsep]
    \item An embedded YouTube player (\texttt{<iframe>}) for in-page playback
    \item Video title, channel name, and formatted duration
    \item A budget indicator showing whether the video fits within the daily time budget
    \item Direct link to watch on YouTube
\end{itemize}
The \texttt{videoEmbeddable=true} and \texttt{videoSyndicated=true} filters in the YouTube API ensure all returned videos can be embedded.

\subsection{Quiz Section}
Each lesson includes 2--3 multiple-choice quiz questions generated by the AI. The quiz component provides:
\begin{itemize}[noitemsep]
    \item Four options per question with radio-button selection
    \item Immediate visual feedback (green for correct, red for incorrect)
    \item Explanation text revealed after answering
    \item Score summary at the end of all questions
\end{itemize}

\subsection{Notes}
A per-lesson markdown note editor allows users to take and save notes during their study session. Notes are persisted in the \texttt{Note} model via \texttt{PUT /api/notes} with a unique constraint on \texttt{(courseId, day, lessonId)}, ensuring one note per lesson.

\subsection{Day Regeneration}
If a user is unsatisfied with a particular day's content, they can click ``Regenerate Day'' to trigger a fresh AI generation for just that day. The backend calls \texttt{regenerateSingleDay()} which:
\begin{enumerate}[noitemsep]
    \item Extracts module context from the existing plan
    \item Prompts the AI with higher temperature (0.8) for more variety
    \item Enriches the regenerated day with new YouTube videos
    \item Replaces only the target day in the stored \texttt{planJson}
\end{enumerate}

\subsection{Progress Tracking}
\begin{itemize}[noitemsep]
    \item \textbf{Per-Lesson}: Checkbox toggles that call \texttt{PUT /api/course/progress} to upsert completion records. Each toggle triggers an activity log update.
    \item \textbf{Per-Day}: A progress bar showing \texttt{completed / total} lessons for the current day.
    \item \textbf{Overall}: A progress indicator at the top of the page showing total course completion percentage across all days.
    \item \textbf{Visual Feedback}: Completed lessons receive a green checkmark, completed days show a checkmark in their tab, and the activity heatmap on the dashboard updates in real time.
\end{itemize}

\subsection{PDF Export}
The jsPDF library generates a formatted PDF document containing the full course plan, including:
\begin{itemize}[noitemsep]
    \item Course title, level, and duration metadata
    \item All days with their lessons, objectives, and time estimates
    \item Video links (as clickable URLs in the PDF)
    \item Completion status for tracking
\end{itemize}

\subsection{Course Sharing}
Users can generate a unique public URL for any course via \texttt{POST /api/course/:id/share}. Shared courses are accessible without authentication at \texttt{/shared/:token}, showing the course plan in read-only mode with the creator's name.

\section{Component Architecture}

\begin{table}[H]
\centering
\caption{Key Frontend Components}
\label{tab:components}
\begin{tabularx}{\textwidth}{l l X}
\toprule
\textbf{Component} & \textbf{Type} & \textbf{Responsibility} \\
\midrule
\texttt{App.jsx}           & Router    & Defines all routes and wraps protected routes \\
\texttt{Layout.jsx}        & Wrapper   & Header, navigation, and page container \\
\texttt{ProtectedRoute.jsx}& Guard     & Redirects unauthenticated users to login \\
\texttt{Home.jsx}          & Page      & Landing page with feature highlights \\
\texttt{Login.jsx}         & Page      & Email/password login form \\
\texttt{Register.jsx}      & Page      & Registration form with validation \\
\texttt{Dashboard.jsx}     & Page      & Course list and activity heatmap \\
\texttt{CreateCourse.jsx}  & Page      & Course creation wizard with SSE progress \\
\texttt{CourseDetail.jsx}  & Page      & Course view with day tabs, videos, progress \\
\texttt{api.js}            & Service   & Axios instance with JWT interceptor \\
\texttt{pdfExport.js}      & Utility   & jsPDF-based course plan export \\
\bottomrule
\end{tabularx}
\end{table}

\section{API Integration Layer}
The frontend uses a centralized Axios instance (\texttt{services/api.js}) with:

\begin{itemize}[noitemsep]
    \item \textbf{Request Interceptor}: Automatically attaches the JWT token from \texttt{localStorage} to every outgoing request's \texttt{Authorization} header.
    \item \textbf{Response Interceptor}: Intercepts 401 responses globally, clears the stored token, and redirects to the login page.
    \item \textbf{Base URL Configuration}: Reads from environment variables for seamless deployment switching between development and production.
\end{itemize}


% ══════════════════════════════════════════════════════════════════
%  CHAPTER 7 — PERFORMANCE
% ══════════════════════════════════════════════════════════════════
\chapter{Performance Analysis}

\section{API Response Time Breakdown}
Course generation is the most latency-sensitive operation in the system. Table~\ref{tab:perf-breakdown} shows the typical timing breakdown for generating a 7-day course with 60 minutes per day.

\begin{table}[H]
\centering
\caption{Course Generation Timing Breakdown (7-day, 60 min/day)}
\label{tab:perf-breakdown}
\begin{tabular}{l r r}
\toprule
\textbf{Phase}                    & \textbf{Duration (ms)} & \textbf{Percentage} \\
\midrule
Input Validation                  & $\sim$5                & $<$1\%  \\
Groq AI Plan Generation           & $\sim$2{,}000--4{,}000  & 20--35\% \\
JSON Parsing \& Validation        & $\sim$10               & $<$1\%  \\
YouTube Video Enrichment          & $\sim$5{,}000--8{,}000  & 50--65\% \\
Database Save (Prisma)            & $\sim$50--100          & $<$2\%  \\
\midrule
\textbf{Total (Typical)}          & \textbf{8{,}000--12{,}000} & \textbf{100\%} \\
\bottomrule
\end{tabular}
\end{table}

\section{Parallel vs.\ Sequential YouTube Fetching}

One of the key performance optimizations was switching from sequential to parallel YouTube API calls. Table~\ref{tab:parallel-comparison} compares the two approaches.

\begin{table}[H]
\centering
\caption{Parallel vs.\ Sequential YouTube Fetching (14 lessons)}
\label{tab:parallel-comparison}
\begin{tabular}{l r r}
\toprule
\textbf{Strategy}         & \textbf{Total Time (ms)} & \textbf{API Calls} \\
\midrule
Sequential (1 at a time)  & $\sim$14{,}000            & 28 (search + details per lesson) \\
Parallel (batch of 5)     & $\sim$4{,}200             & 28 (same, but concurrent) \\
\midrule
\textbf{Speedup}          & \multicolumn{2}{c}{\textbf{$\sim$3.3$\times$ faster}} \\
\bottomrule
\end{tabular}
\end{table}

The parallel batching strategy (batch size = 5) was chosen as the optimal balance between speed and YouTube API rate limit compliance. Each batch makes up to 10 API calls (5~search + 5~details), with a 100\,ms delay between batches.

Figure~\ref{fig:perf-bar} visualizes the timing breakdown across the four major phases of the pipeline, clearly illustrating that YouTube enrichment dominates the total latency.

\begin{figure}[H]
    \centering
    \begin{tikzpicture}
        \begin{axis}[
            ybar,
            bar width=1.2cm,
            width=12cm,
            height=7cm,
            ylabel={Time (milliseconds)},
            symbolic x coords={Validation, AI Generation, JSON Parsing, YouTube Enrichment, DB Save},
            xtick=data,
            x tick label style={rotate=25, anchor=east, font=\small},
            ymin=0, ymax=9000,
            nodes near coords,
            nodes near coords style={font=\small},
            every axis plot/.append style={fill opacity=0.85},
            legend style={at={(0.98,0.95)}, anchor=north east, font=\small},
            grid=major,
            ymajorgrids=true,
            major grid style={line width=.2pt, draw=gray!30},
        ]
        \addplot[fill=primaryblue!70, draw=primaryblue] coordinates {
            (Validation, 5)
            (AI Generation, 3000)
            (JSON Parsing, 10)
            (YouTube Enrichment, 6500)
            (DB Save, 75)
        };
        \end{axis}
    \end{tikzpicture}
    \caption{Course Generation Timing Breakdown --- Average Duration per Phase (7-day course)}
    \label{fig:perf-bar}
\end{figure}

\section{Groq vs.\ OpenAI Inference Speed}
The project originally used the OpenAI GPT-3.5-turbo API but migrated to Groq for significantly faster inference. The Groq platform achieves these speeds through custom Language Processing Units (LPUs), which are application-specific integrated circuits optimized for sequential token generation with deterministic latency.

\begin{table}[H]
\centering
\caption{AI Inference Speed Comparison}
\label{tab:ai-speed}
\begin{tabular}{l r r r}
\toprule
\textbf{Provider}              & \textbf{Avg.\ Latency} & \textbf{Tokens/sec} & \textbf{Cost (per 1M tokens)} \\
\midrule
OpenAI GPT-3.5-turbo           & $\sim$8{,}000\,ms       & $\sim$50--80   & \$0.50  \\
OpenAI GPT-4o-mini             & $\sim$6{,}000\,ms       & $\sim$80--120  & \$0.15  \\
Groq (LLaMA 3.1 70B)           & $\sim$2{,}500\,ms       & $\sim$300--500 & Free (rate-limited) \\
Groq (LLaMA 3.1 8B Instant)    & $\sim$1{,}200\,ms       & $\sim$800+     & Free (rate-limited) \\
Groq (Mixtral 8x7B)            & $\sim$1{,}800\,ms       & $\sim$400--600 & Free (rate-limited) \\
\bottomrule
\end{tabular}
\end{table}

The migration from OpenAI to Groq reduced AI plan generation latency by approximately $3.2\times$ (from $\sim$8\,s to $\sim$2.5\,s), which directly improved the overall course generation experience from $\sim$16\,s to $\sim$10\,s.

\section{Database Performance}
PostgreSQL is configured with several optimizations to ensure consistent performance under load.

\subsection{Indexing Strategy}
Table~\ref{tab:db-indexes} documents all database indexes and their purpose.

\begin{table}[H]
\centering
\caption{Database Index Configuration}
\label{tab:db-indexes}
\begin{tabularx}{\textwidth}{l l l X}
\toprule
\textbf{Model} & \textbf{Field(s)} & \textbf{Type} & \textbf{Purpose} \\
\midrule
User      & \texttt{email}                & Unique   & Login lookup by email \\
Course    & \texttt{userId}               & B-tree   & Dashboard course list query \\
Course    & \texttt{shareToken}           & Unique   & Shared course access \\
Progress  & \texttt{courseId}             & B-tree   & Progress aggregation per course \\
Progress  & \texttt{(courseId, day, lessonId)} & Unique & Upsert constraint for idempotent updates \\
ActivityLog & \texttt{userId}             & B-tree   & Heatmap query by user \\
ActivityLog & \texttt{date}               & B-tree   & Date-range filtering \\
ActivityLog & \texttt{(userId, date)}     & Unique   & Daily count upsert constraint \\
Note      & \texttt{(courseId, day, lessonId)} & Unique & One note per lesson constraint \\
\bottomrule
\end{tabularx}
\end{table}

\subsection{Query Performance}
Key queries and their approximate execution characteristics:
\begin{itemize}[noitemsep]
    \item \textbf{Dashboard Load} (\texttt{findMany courses}): Uses the \texttt{userId} index, returns in $<$10\,ms for up to 100 courses per user.
    \item \textbf{Course Detail} (\texttt{findFirst with planJson}): Single-row primary key lookup, $<$5\,ms regardless of JSON size.
    \item \textbf{Progress Upsert}: Uses composite unique index, atomic upsert in $<$3\,ms.
    \item \textbf{Activity Heatmap}: Date-range query with \texttt{userId} filter, returns $\leq$365 rows in $<$15\,ms.
\end{itemize}

\subsection{Connection Management}
\begin{itemize}[noitemsep]
    \item \textbf{Connection Pooling}: Prisma manages a pool of database connections automatically, reusing connections across requests to minimize connection overhead.
    \item \textbf{Cascade Deletes}: Foreign key cascades (\texttt{onDelete: Cascade}) ensure that deleting a user removes all associated courses, progress records, activities, and notes without application-level cleanup logic.
    \item \textbf{Upsert Operations}: Progress and activity logging use atomic \texttt{upsert} operations to avoid race conditions when multiple tabs mark the same lesson complete simultaneously.
\end{itemize}

\section{Frontend Performance}
\subsection{Build Optimization}
\begin{itemize}[noitemsep]
    \item \textbf{Vite Build}: Production builds use Rollup with tree-shaking and code splitting for minimal bundle sizes. The final JavaScript bundle is approximately 280\,KB gzipped.
    \item \textbf{Lazy Loading}: React Router supports lazy loading of page components to reduce initial load time. The \texttt{CreateCourse} and \texttt{CourseDetail} pages are code-split since they are not needed on initial load.
    \item \textbf{Asset Optimization}: Static assets (CSS, fonts) are fingerprinted for long-term caching with immutable cache headers.
\end{itemize}

\subsection{Runtime Optimization}
\begin{itemize}[noitemsep]
    \item \textbf{SSE for Feedback}: Server-Sent Events for course generation eliminate the need for polling, reducing unnecessary network traffic by $\sim$95\% compared to a polling-based approach.
    \item \textbf{Thumbnail Optimization}: YouTube thumbnails use \texttt{medium} quality (320$\times$180px) instead of high-resolution images to save bandwidth.
    \item \textbf{Skeleton Loading}: Animated skeleton components (\texttt{CourseSkeleton}) display immediately while data loads, preventing cumulative layout shift (CLS) and improving perceived performance.
    \item \textbf{Debounced State Updates}: Progress toggles use optimistic UI updates with server synchronization, so users see instant feedback.
\end{itemize}

\subsection{Render Performance}
\begin{itemize}[noitemsep]
    \item \textbf{Framer Motion}: Animations run on the compositor layer (\texttt{transform} and \texttt{opacity}) to avoid layout thrashing and maintain 60\,fps.
    \item \textbf{Key-based Rendering}: Course cards and lesson lists use stable \texttt{key} props (UUIDs) to minimize unnecessary React re-renders.
    \item \textbf{Memoization}: Heavy computations (progress calculations, date formatting) use \texttt{useMemo} and \texttt{useCallback} hooks.
\end{itemize}

\section{Scalability Considerations}
Table~\ref{tab:scalability} estimates system behavior under increasing user loads.

\begin{table}[H]
\centering
\caption{Estimated Scalability Metrics}
\label{tab:scalability}
\begin{tabular}{l r r r}
\toprule
\textbf{Metric} & \textbf{10 Users} & \textbf{100 Users} & \textbf{1{,}000 Users} \\
\midrule
Concurrent generations    & 2--3        & 20--30      & 200+ (needs queue) \\
DB connections needed     & 5           & 15          & 50+ (pool limit)   \\
YouTube API quota/day     & 7 courses   & 7 courses   & 7 courses (shared) \\
Memory usage              & $\sim$80\,MB & $\sim$200\,MB & $\sim$1\,GB        \\
\bottomrule
\end{tabular}
\end{table}

For scaling beyond $\sim$100 concurrent users, the recommended architecture changes include:
\begin{enumerate}[noitemsep]
    \item \textbf{Background Job Queue}: Move AI generation to a BullMQ worker process, returning a job ID to the frontend for status polling.
    \item \textbf{Redis Caching}: Cache YouTube search results by keyword with a 24-hour TTL, reducing API quota consumption by an estimated 60--80\%.
    \item \textbf{Database Read Replicas}: Add PostgreSQL read replicas for dashboard and course detail queries.
    \item \textbf{CDN}: Serve the React frontend from a CDN (Cloudflare, Vercel) for global edge caching.
\end{enumerate}


% ══════════════════════════════════════════════════════════════════
%  CHAPTER 8 — CHALLENGES
% ══════════════════════════════════════════════════════════════════
\chapter{Challenges \& Solutions}

\section{AI JSON Malformation}
\textbf{Challenge}: Large language models frequently return JSON wrapped in markdown code blocks (\texttt{```json ... ```}) or with trailing text outside the JSON structure, causing \texttt{JSON.parse()} to fail.

\textbf{Solution}: A multi-stage parsing pipeline:
\begin{enumerate}[noitemsep]
    \item Strip markdown code fences using regex: \texttt{content.replace(/```json\textbackslash n?/g, '')}
    \item Trim whitespace before parsing.
    \item Validate the parsed object for required keys (\texttt{overview}, \texttt{modules}, \texttt{dailyPlan}).
    \item Verify the number of days matches the user's request.
    \item On failure, retry up to 3 times with exponential backoff.
\end{enumerate}

\section{AI Model Decommissioning}
\textbf{Challenge}: Cloud AI providers periodically decommission models without notice, causing \texttt{400 Bad Request} errors.

\textbf{Solution}: The Groq service iterates through a prioritized list of models, automatically falling back to the next available model when one returns a decommissioning error or 400 status.

\section{YouTube API Quota Limits}
\textbf{Challenge}: The YouTube Data API v3 has a daily quota of 10{,}000 units. Each \texttt{search.list} call costs 100 units, and each \texttt{videos.list} call costs 1 unit. A single 7-day course with 14 lessons would consume $14 \times 100 + 14 \times 1 = 1{,}414$ units—allowing only $\sim$7 courses per day.

\textbf{Solutions implemented}:
\begin{itemize}[noitemsep]
    \item \textbf{Timeout per lesson}: 5-second timeout prevents slow searches from blocking the pipeline.
    \item \textbf{Graceful degradation}: If YouTube enrichment fails entirely, the course is returned without videos rather than failing.
    \item \textbf{Batch delays}: 100\,ms delay between parallel batches reduces rate-limit pressure.
    \item \textbf{Future improvement}: Results caching (e.g., Redis) to avoid redundant searches for the same keywords.
\end{itemize}

\section{Time-Budget Constraint Algorithm}
\textbf{Challenge}: Selecting videos that fit a daily time budget while maximizing relevance is a constrained optimization problem. Naive approaches either exceeded the budget or selected low-quality videos.

\textbf{Solution}: A greedy algorithm that:
\begin{enumerate}[noitemsep]
    \item Filters out full courses, shorts, and excessively long videos.
    \item Scores remaining videos by title match, keyword overlap, and educational indicators.
    \item Sorts by relevance score (descending).
    \item Iterates through sorted candidates, selecting the first that fits the remaining budget.
    \item Falls back to the shortest relevant video if none fit, flagging the budget exceedance.
\end{enumerate}

\section{JWT Security Considerations}
\textbf{Challenge}: Storing JWT tokens in \texttt{localStorage} is vulnerable to XSS attacks, but HttpOnly cookies introduce CSRF risks and complicate cross-origin deployments.

\textbf{Solution}: For the current deployment:
\begin{itemize}[noitemsep]
    \item Tokens are stored in \texttt{localStorage} with a 7-day expiration.
    \item Input validation on all endpoints prevents common injection vectors.
    \item CORS is configured to allow only the frontend origin.
    \item Prisma's parameterized queries prevent SQL injection.
    \item \textbf{Production recommendation}: Migrate to HttpOnly, Secure, SameSite cookies.
\end{itemize}

\section{Server-Sent Events (SSE) Reliability}
\textbf{Challenge}: SSE connections can drop due to proxy buffering (especially behind Nginx), timeouts, or client disconnection during course generation.

\textbf{Solution}:
\begin{itemize}[noitemsep]
    \item Set \texttt{X-Accel-Buffering: no} header to disable Nginx buffering.
    \item Set \texttt{Cache-Control: no-cache} and \texttt{Connection: keep-alive}.
    \item Wrap the entire SSE handler in try-catch with proper \texttt{res.end()} cleanup.
    \item Fallback: The non-SSE endpoint (\texttt{POST /api/course/generate}) remains available for clients that don't support SSE.
\end{itemize}

\section{Cross-Origin Resource Sharing (CORS)}
\textbf{Challenge}: During development, the React frontend runs on \texttt{localhost:5173} while the Express backend runs on \texttt{localhost:5000}, creating cross-origin requests that browsers block by default.

\textbf{Solution}:
\begin{itemize}[noitemsep]
    \item The \texttt{cors} middleware is configured with a whitelist of allowed origins read from the \texttt{CORS\_ORIGIN} environment variable.
    \item Only \texttt{GET}, \texttt{POST}, \texttt{PUT}, \texttt{DELETE} methods are allowed, with \texttt{Authorization} and \texttt{Content-Type} headers explicitly permitted.
    \item Preflight \texttt{OPTIONS} requests are cached for 86{,}400 seconds (24 hours) to reduce overhead.
    \item In production, CORS is tightened to allow only the deployed frontend domain.
\end{itemize}

\section{Handling Large AI Responses}
\textbf{Challenge}: For courses with 30+ days, the AI-generated JSON can exceed 50{,}000 tokens, occasionally causing Groq API timeouts or truncated responses.

\textbf{Solution}:
\begin{itemize}[noitemsep]
    \item \textbf{Token estimation}: Before prompting, the system estimates the expected output size based on the number of days and adjusts the \texttt{max\_tokens} parameter accordingly.
    \item \textbf{Temperature tuning}: A temperature of 0.7 is used for the primary model to balance creativity with structure adherence; the regeneration endpoint uses 0.8 for more variety.
    \item \textbf{Chunked generation}: For courses exceeding 14 days, a future improvement will generate in weekly chunks, merging results server-side.
    \item \textbf{Validation recovery}: If the response JSON is truncated, the system attempts to repair common truncation patterns (e.g., missing closing brackets) before failing.
\end{itemize}


% ══════════════════════════════════════════════════════════════════
%  CHAPTER 9 — SECURITY & TESTING
% ══════════════════════════════════════════════════════════════════
\chapter{Security \& Testing}

\section{Security Architecture}
Security is implemented as a multi-layered defense strategy spanning the frontend, API layer, and database.

\subsection{Authentication Security}
\begin{itemize}
    \item \textbf{Password Hashing}: All passwords are hashed using bcrypt with 10 rounds of salting (\texttt{bcrypt.hash(password, 10)}). The bcrypt algorithm is intentionally slow ($\sim$100\,ms per hash), making brute-force attacks computationally infeasible. Even if the database is compromised, passwords cannot be reversed.
    \item \textbf{JWT Tokens}: JSON Web Tokens are signed with a server-side secret key (\texttt{JWT\_SECRET} environment variable) using the HS256 algorithm. Tokens contain only the \texttt{userId} claim---no sensitive data is embedded in the payload.
    \item \textbf{Token Expiration}: Tokens expire after 7 days, forcing periodic re-authentication. The frontend's Axios response interceptor detects expired tokens (401 status) and automatically redirects to the login page.
\end{itemize}

\subsection{Input Validation}
Every API endpoint validates incoming data before processing:

\begin{table}[H]
\centering
\caption{Input Validation Rules Across API Endpoints}
\label{tab:input-validation}
\begin{tabularx}{\textwidth}{l X}
\toprule
\textbf{Endpoint} & \textbf{Validation Rules} \\
\midrule
\texttt{POST /auth/register} & Name required, email format validated, password $\geq$6 characters \\
\texttt{POST /auth/login} & Email and password required, user existence check \\
\texttt{POST /course/generate} & Topic non-empty, level $\in$ \{beginner, intermediate, advanced\}, days $\in$ [1, 365], timePerDay $\in$ [15, 480] \\
\texttt{PUT /course/progress} & courseId (UUID format), day (positive integer), lessonId (string) \\
\texttt{POST /course/:id/share} & Course ownership verified via JWT userId \\
\bottomrule
\end{tabularx}
\end{table}

\subsection{SQL Injection Prevention}
Prisma ORM generates parameterized queries for all database interactions, completely eliminating SQL injection vulnerabilities. For example, the user lookup query:

\begin{lstlisting}[language=JavaScript,caption={Prisma Parameterized Query Example}]
// Prisma auto-parameterizes this query
const user = await prisma.user.findUnique({
  where: { email: email.toLowerCase() },
});
// Generated SQL: SELECT * FROM "User" WHERE "email" = $1
// Parameter: ['user@example.com']
\end{lstlisting}

\subsection{Cross-Site Scripting (XSS) Prevention}
\begin{itemize}[noitemsep]
    \item React's JSX auto-escapes all rendered values by default, preventing DOM-based XSS.
    \item User-generated content (course notes) is stored as plain text and rendered with \texttt{textContent} rather than \texttt{innerHTML}.
    \item The YouTube iframe embeds use the \texttt{sandbox} attribute to restrict JavaScript execution within the embedded player.
\end{itemize}

\subsection{Rate Limiting \& Error Handling}
\begin{itemize}[noitemsep]
    \item The Express server uses centralized error handling via the \texttt{AppError} class, which standardizes error responses with appropriate HTTP status codes.
    \item The \texttt{asyncHandler} wrapper catches all promise rejections, preventing unhandled exceptions from crashing the server.
    \item API keys (\texttt{GROQ\_API\_KEY}, \texttt{YOUTUBE\_API\_KEY}) are stored in environment variables and never committed to version control (listed in \texttt{.gitignore}).
\end{itemize}

\section{Testing Strategy}
The application employs a multi-level testing approach to ensure reliability.

\subsection{API Testing}
Manual API testing is performed using tools such as Postman and cURL. Key test scenarios include:

\begin{table}[H]
\centering
\caption{API Test Scenarios}
\label{tab:api-tests}
\begin{tabularx}{\textwidth}{l l l X}
\toprule
\textbf{Test Case} & \textbf{Method} & \textbf{Expected} & \textbf{Validates} \\
\midrule
Valid registration          & POST & 201 & User created, JWT returned \\
Duplicate email             & POST & 409 & Conflict error message \\
Invalid login               & POST & 401 & Generic error (no info leak) \\
Generate course (valid)     & POST & 200 & JSON plan with correct days \\
Generate (invalid level)    & POST & 400 & Validation error \\
Access without JWT          & GET  & 401 & Unauthorized error \\
Access other user's course  & GET  & 404 & Not found (ownership check) \\
Progress upsert             & PUT  & 200 & Idempotent update \\
Delete course               & DELETE & 200 & Cascade cleanup verified \\
Shared course (public)      & GET  & 200 & No auth required \\
\bottomrule
\end{tabularx}
\end{table}

\subsection{Frontend Testing}
\begin{itemize}[noitemsep]
    \item \textbf{Component Testing}: Individual React components are tested in isolation to verify correct rendering, prop handling, and state management.
    \item \textbf{Integration Testing}: End-to-end flows (registration $\to$ login $\to$ create course $\to$ view course $\to$ mark progress) are tested manually in the browser to verify the complete user journey.
    \item \textbf{Responsive Testing}: The application is tested across viewport sizes (320px mobile, 768px tablet, 1280px desktop) to verify the responsive grid layout of course cards and the collapsible navigation.
    \item \textbf{Dark Mode Testing}: All components are verified in both light and dark themes to ensure text contrast and readability.
\end{itemize}

\subsection{AI Output Validation Testing}
The AI-generated JSON output is validated against a rigorous set of structural requirements:
\begin{enumerate}[noitemsep]
    \item Presence of \texttt{overview}, \texttt{modules}, and \texttt{dailyPlan} top-level keys.
    \item \texttt{dailyPlan} array length matches the requested number of days.
    \item Each day contains a non-empty \texttt{lessons} array.
    \item Each lesson has \texttt{title}, \texttt{description}, \texttt{timeMinutes}, and \texttt{importance} fields.
    \item Quiz questions have exactly 4 options with a valid \texttt{correctAnswer} index.
    \item Module references (\texttt{moduleId}) in the daily plan correspond to defined modules.
\end{enumerate}

\subsection{Error Recovery Testing}
The retry and fallback mechanisms are tested by:
\begin{itemize}[noitemsep]
    \item Simulating API timeouts to verify exponential backoff behavior.
    \item Requesting models known to return 400 errors to verify multi-model fallback.
    \item Disconnecting network during SSE streaming to verify graceful frontend fallback.
    \item Exhausting YouTube API quota to verify graceful degradation (course returned without videos).
\end{itemize}


% ══════════════════════════════════════════════════════════════════
%  CHAPTER 10 — CONCLUSION
% ══════════════════════════════════════════════════════════════════
\chapter{Conclusion}

\section{Summary}
PlanMyStudy AI demonstrates that generative AI can be practically applied to educational technology to solve the real problem of learning material curation and study planning. The system successfully:

\begin{itemize}[noitemsep]
    \item Generates structured, multi-day study plans from a single topic specification using Groq AI (LLaMA/Mixtral models) with reliable JSON output through prompt engineering and retry logic.
    \item Enriches each lesson with curated YouTube videos selected through a time-budget-aware algorithm that balances relevance, quality, and duration constraints.
    \item Provides a complete learning management experience with progress tracking, activity heatmaps, note-taking, quizzes, PDF export, and course sharing.
    \item Implements industry-standard security practices including JWT authentication, bcrypt password hashing, input validation, and parameterized database queries.
    \item Achieves responsive course generation times (8--12 seconds) through parallel YouTube fetching and Groq's ultra-fast AI inference.
\end{itemize}

\section{Key Technical Achievements}
\begin{enumerate}[noitemsep]
    \item \textbf{Multi-Model Fallback}: Automatic failover across three AI models ensures high availability despite model decommissioning.
    \item \textbf{Time-Budget Algorithm}: The greedy video selection algorithm effectively solves a constrained optimization problem in real-time.
    \item \textbf{Parallel API Orchestration}: Batched \texttt{Promise.all} calls provide a $\sim$3.3$\times$ speedup over sequential fetching while respecting rate limits.
    \item \textbf{SSE Progress Streaming}: Real-time generation feedback significantly improves perceived performance and user experience.
    \item \textbf{Hybrid Data Strategy}: Using JSON for dynamic content (course plans) and relational tables for structured data (users, progress, activity) combines the benefits of both approaches.
\end{enumerate}

\section{Lessons Learned}
Several important lessons emerged during the development of PlanMyStudy AI:

\begin{enumerate}
    \item \textbf{AI output is non-deterministic}: The same prompt can produce structurally different JSON responses across models and even across calls to the same model. Robust validation and retry logic is essential---not optional---when building production systems on LLM output.
    \item \textbf{Third-party API quotas shape architecture}: The YouTube Data API's 10{,}000-unit daily quota became a hard constraint that forced architectural decisions (batching, result caching, graceful degradation). API quota analysis should be performed \emph{before} committing to an integration, not after.
    \item \textbf{Perceived performance matters as much as actual performance}: The SSE progress streaming feature was the most impactful UX improvement despite adding code complexity. Users tolerate a 10-second wait when they see progress updates, but abandon a 5-second wait with no feedback.
    \item \textbf{Hybrid data models work}: Storing the AI-generated course plan as JSON while maintaining relational tables for user state (progress, notes, activity) proved to be an effective balance. Premature normalization would have added significant complexity without proportional benefit.
    \item \textbf{Development velocity through ORMs}: Prisma significantly accelerated development by providing type-safe queries, automatic migrations, and eliminating entire classes of bugs (SQL injection, type mismatches).
\end{enumerate}

\section{Comparison with Existing Platforms}
PlanMyStudy AI differentiates itself from existing learning platforms in several ways:

\begin{table}[H]
\centering
\caption{Feature Comparison with Existing Platforms}
\label{tab:comparison}
\begin{tabularx}{\textwidth}{X c c c c}
\toprule
\textbf{Feature} & \textbf{PlanMyStudy AI} & \textbf{Coursera} & \textbf{Khan Academy} & \textbf{YouTube} \\
\midrule
AI-generated syllabus       & \checkmark & ---        & ---        & --- \\
Custom time budget           & \checkmark & ---        & ---        & --- \\
Auto-curated videos          & \checkmark & ---        & ---        & \checkmark \\
Progress tracking            & \checkmark & \checkmark & \checkmark & --- \\
Quizzes                      & \checkmark & \checkmark & \checkmark & --- \\
Free \& open-source          & \checkmark & ---        & \checkmark & \checkmark \\
Personalized day-by-day plan & \checkmark & ---        & ---        & --- \\
Note-taking per lesson       & \checkmark & ---        & ---        & --- \\
PDF export                   & \checkmark & ---        & ---        & --- \\
\bottomrule
\end{tabularx}
\end{table}

\section{Future Scope}
\begin{enumerate}
    \item \textbf{Caching Layer}: Add Redis caching for YouTube search results (24-hour TTL) and frequently generated course plans. Expected to reduce YouTube API quota usage by 60--80\% and improve response times for repeat topics by $\sim$5$\times$.
    \item \textbf{Real-Time Collaboration}: WebSocket-based study groups enabling multiple users to follow the same course, share notes, and see each other's progress in real time.
    \item \textbf{Mobile Application}: A React Native version for iOS and Android, sharing the API layer with the web application and adding push notification support for study reminders.
    \item \textbf{Advanced Analytics}: A learning analytics dashboard with insights such as optimal study times, topic mastery curves, and spaced-repetition scheduling to maximize long-term retention.
    \item \textbf{Multi-Modal Resources}: Integration with additional content types including articles (Medium, Dev.to), textbooks (Open Library API), interactive coding exercises (JDoodle API), and podcast episodes.
    \item \textbf{AI Study Assistant}: A conversational chatbot embedded in the course detail page, capable of answering questions about the current lesson's content using the course plan as context.
    \item \textbf{Email Notifications}: An automated email system using Nodemailer with daily study reminders, weekly progress reports, and streak recovery notifications.
    \item \textbf{Offline Support}: Progressive Web App (PWA) implementation with service workers for offline access to previously loaded course plans, enabling study in low-connectivity environments.
    \item \textbf{Horizontal Scaling}: Queue-based background processing using BullMQ with Redis, decoupling the course generation from the HTTP request cycle. This enables load balancing across multiple backend instances and prevents timeout issues for long-running generations.
    \item \textbf{Gamification}: Achievement badges, experience points, leaderboards, and streak rewards to increase user engagement and long-term retention.
\end{enumerate}


% ══════════════════════════════════════════════════════════════════
%  APPENDIX A — BACKEND CODE
% ══════════════════════════════════════════════════════════════════
\appendix
\chapter{Backend Code Listings}

\section{Authentication Controller (authController.js)}

\begin{lstlisting}[language=JavaScript,caption={authController.js -- User Registration and Login},label={lst:auth-controller}]
import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { AppError, asyncHandler } from '../utils/errors.js';

// Register a new user
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', 400);
  }
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), password: hashedPassword },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const token = generateToken(user.id);
  res.status(201).json({ success: true, data: { user, token } });
});

// Login user
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) throw new AppError('Invalid email or password', 401);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError('Invalid email or password', 401);

  const token = generateToken(user.id);
  res.json({
    success: true,
    data: {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    },
  });
});
\end{lstlisting}

\section{JWT Utilities (jwt.js)}

\begin{lstlisting}[language=JavaScript,caption={jwt.js -- Token Generation and Verification},label={lst:jwt-utils}]
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
\end{lstlisting}

\section{Authentication Middleware (auth.js)}

\begin{lstlisting}[language=JavaScript,caption={auth.js -- JWT Authentication Middleware},label={lst:auth-middleware}]
import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError('Authentication failed', 401));
  }
};
\end{lstlisting}

\section{Course Controller — Generate Course (excerpt)}

\begin{lstlisting}[language=JavaScript,caption={courseController.js -- Course Generation Endpoint},label={lst:course-generate}]
export const generateCourse = asyncHandler(async (req, res, next) => {
  const { topic, level, days, timePerDay } = req.body;
  const userId = req.userId;

  // Validate input
  if (!topic || !level || !days || !timePerDay) {
    throw new AppError('Topic, level, days, and timePerDay are required', 400);
  }
  const validLevels = ['beginner', 'intermediate', 'advanced'];
  if (!validLevels.includes(level.toLowerCase())) {
    throw new AppError('Level must be beginner, intermediate, or advanced', 400);
  }

  // Generate course plan using AI
  let coursePlan = await generateCoursePlan(topic, level, days, timePerDay);

  // Enrich with YouTube videos (respects time budget)
  try {
    coursePlan = await Promise.race([
      enrichCourseWithVideos(coursePlan, timePerDay),
      new Promise((resolve) => setTimeout(() => resolve(coursePlan), 30000)),
    ]);
  } catch (error) {
    console.log('YouTube enrichment skipped:', error.message);
  }

  // Save course to database
  const course = await prisma.course.create({
    data: {
      userId, topic, level: level.toLowerCase(),
      days, timePerDay,
      planJson: JSON.stringify(coursePlan),
    },
  });

  res.status(201).json({
    success: true,
    data: { course: { id: course.id, topic, level, days, timePerDay,
      plan: coursePlan, createdAt: course.createdAt } },
  });
});
\end{lstlisting}


% ══════════════════════════════════════════════════════════════════
%  APPENDIX B — SAMPLE API PAYLOADS
% ══════════════════════════════════════════════════════════════════
\chapter{Sample API Payloads}

\section{AI Course Generation Request}

\begin{lstlisting}[language=JSON,caption={Sample POST /api/course/generate Request Body},label={lst:api-request}]
{
  "topic": "React Development",
  "level": "beginner",
  "days": 7,
  "timePerDay": 60
}
\end{lstlisting}

\section{AI Course Generation Response (Excerpt)}

\begin{lstlisting}[language=JSON,caption={Groq AI Response Structure (abbreviated)},label={lst:ai-response}]
{
  "overview": {
    "title": "React Development Fundamentals",
    "description": "A comprehensive 7-day beginner course...",
    "objectives": [
      "Understand React component architecture",
      "Master JSX syntax and expressions",
      "Build interactive UIs with state and props"
    ]
  },
  "modules": [
    {
      "id": "m1",
      "title": "React Basics",
      "description": "Introduction to React concepts",
      "objectives": ["Understand JSX", "Create components"]
    }
  ],
  "dailyPlan": [
    {
      "day": 1,
      "moduleId": "m1",
      "lessons": [
        {
          "id": "l1",
          "title": "Introduction to React",
          "description": "What is React and why use it",
          "objectives": ["Understand SPA architecture"],
          "timeMinutes": 30,
          "keywords": ["react", "SPA", "virtual DOM"],
          "importance": "core",
          "quiz": [
            {
              "question": "What is the Virtual DOM?",
              "options": [
                "A) A lightweight copy of the real DOM",
                "B) A database",
                "C) A CSS framework",
                "D) A server"
              ],
              "correctAnswer": "A",
              "explanation": "The Virtual DOM is a lightweight
                JavaScript representation of the real DOM..."
            }
          ]
        }
      ]
    }
  ]
}
\end{lstlisting}

\section{YouTube API Response (Excerpt)}

\begin{lstlisting}[language=JSON,caption={YouTube Data API v3 -- Video Details Response (abbreviated)},label={lst:youtube-response}]
{
  "kind": "youtube#videoListResponse",
  "items": [
    {
      "id": "dGcsHMXbSOA",
      "snippet": {
        "title": "React Tutorial for Beginners",
        "description": "Learn React.js in this beginner tutorial...",
        "channelTitle": "Programming with Mosh",
        "thumbnails": {
          "medium": {
            "url": "https://i.ytimg.com/vi/dGcsHMXbSOA/mqdefault.jpg",
            "width": 320,
            "height": 180
          }
        },
        "publishedAt": "2023-06-15T14:00:00Z"
      },
      "contentDetails": {
        "duration": "PT28M45S"
      },
      "statistics": {
        "viewCount": "1250000"
      }
    }
  ]
}
\end{lstlisting}


% ══════════════════════════════════════════════════════════════════
%  APPENDIX C — GLOSSARY
% ══════════════════════════════════════════════════════════════════
\chapter{Glossary}

\begin{longtable}{l p{10cm}}
\toprule
\textbf{Term} & \textbf{Definition} \\
\midrule
\endfirsthead
\toprule
\textbf{Term} & \textbf{Definition} \\
\midrule
\endhead
\bottomrule
\endfoot

\textbf{API}          & Application Programming Interface --- a set of protocols for building and integrating application software. \\
\textbf{bcrypt}       & A password-hashing algorithm based on the Blowfish cipher, designed to be computationally expensive to resist brute-force attacks. \\
\textbf{CORS}         & Cross-Origin Resource Sharing --- an HTTP-header-based mechanism allowing servers to indicate permitted origins for browser requests. \\
\textbf{Express}      & A minimal and flexible Node.js web application framework providing a robust set of features for web and mobile applications. \\
\textbf{Groq}         & An AI inference platform using custom Language Processing Units (LPUs) for ultra-fast LLM inference. \\
\textbf{ISO 8601}     & An international standard for date and time representations. YouTube uses the duration component (e.g., \texttt{PT4M13S}). \\
\textbf{JSON}         & JavaScript Object Notation --- a lightweight data-interchange format. \\
\textbf{JWT}          & JSON Web Token --- a compact, URL-safe means of representing claims between two parties, defined in RFC~7519. \\
\textbf{LLaMA}        & Large Language Model Meta AI --- a family of open-weight language models released by Meta. \\
\textbf{LLM}          & Large Language Model --- a neural network model trained on large text corpora for natural language tasks. \\
\textbf{Middleware}    & Software that acts as an intermediary between an OS or database and applications, or between request and response in web frameworks. \\
\textbf{Mixtral}      & A mixture-of-experts large language model by Mistral AI, combining multiple expert sub-networks. \\
\textbf{Node.js}      & A JavaScript runtime built on Chrome's V8 engine for building scalable server-side applications. \\
\textbf{ORM}          & Object-Relational Mapping --- a technique for converting data between incompatible type systems in object-oriented programming. \\
\textbf{PostgreSQL}   & An advanced open-source relational database management system emphasizing extensibility and SQL compliance. \\
\textbf{Prisma}       & A next-generation Node.js and TypeScript ORM providing type-safe database access with auto-generated queries. \\
\textbf{React}        & A JavaScript library for building user interfaces, maintained by Meta, using a component-based architecture. \\
\textbf{REST}         & Representational State Transfer --- an architectural style for distributed hypermedia systems, commonly used for web APIs. \\
\textbf{SPA}          & Single-Page Application --- a web application that loads a single HTML page and dynamically updates content. \\
\textbf{SSE}          & Server-Sent Events --- a server push technology enabling the server to send real-time updates to the browser via HTTP. \\
\textbf{UUID}         & Universally Unique Identifier --- a 128-bit label used for identification in distributed systems. \\
\textbf{Vite}         & A modern frontend build tool providing fast Hot Module Replacement (HMR) and optimized production builds. \\
\textbf{XSS}          & Cross-Site Scripting --- a security vulnerability enabling attackers to inject malicious scripts into web pages. \\
\textbf{YouTube Data API} & Google's API for accessing YouTube video data, including search, metadata, and content details. \\
\end{longtable}


% ══════════════════════════════════════════════════════════════════
%  REFERENCES
% ══════════════════════════════════════════════════════════════════
\chapter*{References}
\addcontentsline{toc}{chapter}{References}

\begin{enumerate}[label={[\arabic*]},noitemsep]
    \item Groq, ``Groq API Documentation,'' 2024. [Online]. Available: \url{https://console.groq.com/docs}
    \item Google, ``YouTube Data API v3 Documentation,'' 2024. [Online]. Available: \url{https://developers.google.com/youtube/v3}
    \item Meta, ``React Documentation,'' 2024. [Online]. Available: \url{https://react.dev/}
    \item Prisma, ``Prisma ORM Documentation,'' 2024. [Online]. Available: \url{https://www.prisma.io/docs}
    \item Express.js, ``Express Documentation,'' 2024. [Online]. Available: \url{https://expressjs.com/}
    \item M.\ Jones, J.\ Bradley, and N.\ Sakimura, ``JSON Web Token (JWT),'' RFC~7519, IETF, May 2015. [Online]. Available: \url{https://datatracker.ietf.org/doc/html/rfc7519}
    \item Node.js, ``Node.js Documentation,'' 2024. [Online]. Available: \url{https://nodejs.org/docs}
    \item PostgreSQL Global Development Group, ``PostgreSQL Documentation,'' 2024. [Online]. Available: \url{https://www.postgresql.org/docs/}
    \item Vite, ``Vite Documentation,'' 2024. [Online]. Available: \url{https://vitejs.dev/}
    \item Tailwind Labs, ``Tailwind CSS Documentation,'' 2024. [Online]. Available: \url{https://tailwindcss.com/docs}
    \item N.\ Provos and D.\ Mazi\`{e}res, ``A Future-Adaptable Password Scheme,'' in \emph{Proc.\ USENIX Annual Technical Conference}, 1999.
    \item I.\ Hickson, ``Server-Sent Events,'' W3C Recommendation, Feb.\ 2015. [Online]. Available: \url{https://www.w3.org/TR/eventsource/}
\end{enumerate}


\end{document}
# ORUVIA — Complete System & Platform Guide

> **Tagline**: *"Knowledge, alive."*  
> **Platform Goal**: A unified, production-quality MERN full-stack scientific knowledge discovery, management, and outreach platform built for polar science, Earth observation, and marine research institutions.

---

## 💡 1. What is ORUVIA & What Does It Do?

Before ORUVIA, scientific institutions faced a major problem: **fragmentation**.
- Expedition reports sat in field log PDF archives.
- Raw CSV/NetCDF datasets were buried on institutional FTP servers.
- Peer-reviewed research papers lived on publisher websites.
- Photos and videos were scattered across hard drives.
- Educational outreach teams struggled to turn complex data into stories for the public.

**ORUVIA solves this by unifying everything into a single "living" ecosystem.**  
It automatically connects every piece of research. When you look at an expedition to Antarctica, ORUVIA instantly shows you:
- Which **research station** hosted the team.
- What **datasets** were collected.
- Which **scientific papers** were published from those datasets.
- What **photos/videos** were recorded on-site.
- How **AI** and **editorial writers** translated those findings into public stories.

---

## 📜 2. Where Do the Articles & Data Come From?

1. **Auto-Seeding Scientific Database Engine**:
   - When ORUVIA starts up, if no database is connected, its built-in database engine initializes an **in-memory MongoDB database** pre-loaded with a realistic, peer-reviewed scientific repository.
   - It contains **5 Users**, **4 Research Stations**, **8 Expeditions**, **15 Datasets**, **18 Publications**, **40 Media Assets**, **12 Institutional Activities**, **6 Editorial Stories**, **3 Campaigns**, and **8 Content Drafts**.

2. **Institutional Studio (`/studio`)**:
   - Scientists, Editors, and Contributors can upload new datasets, field photographs, research papers, and expedition logbooks directly.
   - The system validates variables, spatial coordinates, DOIs, and metadata schemas.

3. **RAG & AI Enrichment Engine**:
   - ORUVIA includes an AI pipeline (`/api/ai/ask`, `/api/ai/digest`, `/api/ai/suggest-tags`) that reads stored scientific publications and datasets to answer user questions, generate educational summaries, and tag resources automatically.

---

## 🕸️ 3. What is the Knowledge Graph? (`/knowledge-graph`)

The **Knowledge Graph** is ORUVIA's central neural network for scientific data.  
Instead of storing articles in isolated folders, ORUVIA creates **nodes** and **edges**:

- **Nodes** represent scientific entities:
  - 🏔️ *Stations* (e.g., Bharati Station, Maitri Station, Svalbard Observatory)
  - 🚢 *Expeditions* (e.g., 42nd Indian Scientific Expedition to Antarctica)
  - 📊 *Datasets* (e.g., Larsemann Hills Ice Mass Balance 2021-2025)
  - 📄 *Publications* (e.g., Deep Ice Core Isotope Stratigraphy in Nature Earth)
  - 📸 *Media* (e.g., Sub-glacier radar sounder footage)
  - ✍️ *Stories & Learn Modules*
- **Edges** represent real-world relationships:
  - `EXPEDITION_DEPLOYED_AT` → Station
  - `DATASET_COLLECTED_DURING` → Expedition
  - `PUBLICATION_DERIVED_FROM` → Dataset
  - `STORY_CITES` → Publication / Dataset

**Why it matters**: Users can visually drag, zoom, and click nodes on an interactive force-directed graph to discover hidden connections between climate variables, stations, and publications.

---

## 🌐 4. Complete Page-by-Page & Section-by-Section Breakdown

### 🏠 Page 1: Home Page (`/`)
- **Hero Banner**: High-impact editorial header featuring ORUVIA’s vision ("Knowledge, alive.") with instant search bar and quick action buttons.
- **Institutional Impact Bar**: Live counters displaying total datasets, expeditions, peer-reviewed publications, active stations, and storage size.
- **Scientific Domains Grid**: Quick filter pills for Cryosphere, Atmosphere, Oceans, Paleoclimate, Biosphere, Glaciology, and Geophysics.
- **Featured Editorial Story**: Highlighted science story with "Evidence Locking" (hovering over text highlights the exact raw dataset or DOI paper supporting the statement).
- **Recent Expeditions & Top Datasets**: Cards showing current polar/marine field missions and open-access data downloads.
- **Atlas & Knowledge Graph Teaser**: Interactive preview enticing users to explore the 3D GIS map and network graph.

---

### 🔍 Page 2: Explore Hub (`/explore`)
- **Unified Filter Sidebar**: Allows filtering the entire institutional repository at once by:
  - Scientific Domain (e.g., Cryosphere, Oceanography)
  - Region (e.g., Larsemann Hills, Svalbard, Southern Ocean)
  - Resource Type (Dataset, Publication, Expedition, Story, Media)
  - Date Range & Access Type (Open Access, Restricted, Embargoed)
- **Grid / List View Toggle**: Displays matching asset cards with live metadata badges, DOI tags, and quick preview modals.

---

### 🔎 Page 3: Search Engine (`/search`)
- **Instant Semantic Search**: Search bar supporting natural language queries (e.g., *"ice thickness measurement in Antarctica"*).
- **Facet Summary**: Live breakdown of search results grouped by category (Datasets, Papers, Expeditions, Media).
- **Export & Filter Tools**: Quick sorting by date, relevance, or citation count.

---

### 📊 Page 4: Scientific Datasets (`/datasets` & `/datasets/:slug`)
- **Dataset Catalog (`/datasets`)**: Searchable list of institutional datasets with file format badges (CSV, NetCDF, GeoJSON).
- **Dataset Detail Page (`/datasets/:slug`)**:
  - **Abstract & Metadata**: Overview, creators, license (CC-BY 4.0), temporal coverage, spatial coordinates.
  - **Interactive Data Visualizer**: Renders live interactive charts (time series, scatter plots, variable comparisons) directly in the browser.
  - **Variable Measurement Table**: Lists exact parameters measured (e.g., Temperature, Salinity, Ice Velocity) with units and sensor models.
  - **Geo-Location Map**: MapLibre GL map pinpointing where the data was gathered.
  - **Citation & Export Generator**: One-click export for **BibTeX**, **JSON-LD (Schema.org)**, and raw CSV/NetCDF files.

---

### 🚢 Page 5: Field Expeditions (`/expeditions` & `/expeditions/:slug`)
- **Expedition Directory (`/expeditions`)**: Grid of polar and oceanographic field missions categorized by active, upcoming, and completed.
- **Expedition Detail Page (`/expeditions/:slug`)**:
  - **Mission Log & Objectives**: Field goals, vessel/aircraft used, team leader, and duration.
  - **Interactive Route Map**: Waypoints and tracklines of the expedition's vessel/field team.
  - **Linked Datasets & Papers**: Direct links to all data and publications produced by this specific mission.
  - **Photo & Video Field Gallery**: High-resolution footage captured during the expedition.

---

### 📄 Page 6: Research Publications (`/publications` & `/publications/:slug`)
- **Publications Library (`/publications`)**: Peer-reviewed journal articles, technical reports, and conference papers.
- **Publication Detail Page (`/publications/:slug`)**:
  - **Abstract & Full Metadata**: Journal name, volume, issue, publication year, author affiliations.
  - **Multi-Level Reading Selector**: Switch between 4 reading modes:
    1. *Quick Read*: 2-minute executive bullet points.
    2. *Student / Educator*: Concept explanations with glossary tooltips.
    3. *General Public*: Narrative story style.
    4. *Research Depth*: Full scientific paper with equations, methodology, and DOIs.
  - **BibTeX & Citation Modal**: Instant citation copy for academic referencing.

---

### 🏔️ Page 7: Research Stations (`/stations`)
- **Station Network Overview**: Showcases permanent research bases (e.g., Bharati Station in Larsemann Hills, Maitri Station in Dronning Maud Land, Svalbard Observatory).
- **Station Detail Cards**: Real-time weather/sensor feeds (temperature, wind speed, solar radiation), coordinates, active scientific instruments, and historical expedition logs.

---

### 🗺️ Page 8: Scientific Atlas & Earth Deck (`/atlas`)
- **Interactive GIS Map**: Powered by MapLibre GL with custom styling.
- **Geospatial Layer Control**:
  - Ice Sheet Thickness Layer
  - Sea Surface Temperature Layer
  - Carbon Flux Layer
  - Research Station Pins & Expedition Tracklines
- **Popups & Spatial Query**: Clicking any station or expedition marker opens a side panel with instant data summaries.

---

### 📸 Page 9: Media Archive (`/media`)
- **Visual Asset Gallery**: Searchable, filterable library of high-resolution scientific photography, satellite imagery, expedition video logs, and audio recordings.
- **Asset Modal**: Displays EXIF data, copyright/licensing info, resolution, creator attribution, and high-res download options.

---

### ⏱️ Page 10: Institutional Activities (`/activities`)
- **Operational Timeline**: Chronological log of field sensor deployments, satellite pass schedules, workshop symposiums, and public outreach events.

---

### 📖 Page 11: Editorial Stories (`/stories`)
- **Science Communication Magazine**: Engaging, beautifully styled long-form articles translating complex research into accessible narratives.
- **Evidence Locking Technology**: Specific sentences are underlined with colored badges. Clicking or hovering over a badge highlights the exact raw dataset or peer-reviewed DOI paper that proves the claim.

---

### 🎓 Page 12: Learn & Educational Hub (`/learn`)
- **Interactive Curriculum**: Modules categorized by topic (Glaciology, Oceanography, Climate Dynamics, Atmospheric Physics).
- **Interactive Glossary & Visual Diagrams**: Explains key concepts (e.g., Albedo Effect, Thermohaline Circulation, Ice Core Stratigraphy) for students and educators.

---

### 🤖 Page 13: Ask ORUVIA — AI RAG Assistant (`/ask`)
- **Conversational RAG AI**: Natural language chat interface.
- **Verifiable Answers**: Ask questions like *"What is the surface temperature trend at Bharati Station?"* — the AI provides an answer backed by direct citation badges pointing to datasets and publications stored in the database.

---

### ✍️ Page 14: Institutional Content Studio (`/studio`, `/studio/upload`, `/studio/drafts/:id`)
- **Authoring Workspace**: Built for research scientists, editors, and communications staff.
- **Dataset & File Drag-and-Drop Upload**: Auto-extracts metadata from uploaded files.
- **AI Social & Newsletter Generator**: Generates formatted outreach captions for X (Twitter), Instagram, LinkedIn, and press briefs in one click.
- **Editorial Review Workflow**: Status pipeline (`DRAFT` → `UNDER_REVIEW` → `PUBLISHED`).

---

### 🔐 Page 15: Role-Based Authentication (`/login`, `/register`)
- **Demo Logins Provided**:
  - 👑 **Admin**: `admin@oruvia.demo` (Dr. Evelyn Vance - Global Director)
  - ✏️ **Editor**: `editor@oruvia.demo` (Marcus Thorne - Editorial Lead)
  - 🔎 **Reviewer**: `reviewer@oruvia.demo` (Prof. Ananya Sen - Review Board)
  - 🔬 **Contributor**: `contributor@oruvia.demo` (Kasper Lindqvist - Field Researcher)
  - *Password for all demo accounts*: `oruvia2026`

---

## 🎨 5. Design & User Experience Highlights
- **Palette**: Natural canvas (`#F4F2EC`), obsidian dark (`#0D1211`), electric lime accent (`#B7FF5A`), and scientific ocean blue (`#3D7BFF`).
- **Typography**: Instrument Serif (editorial headings), Plus Jakarta Sans (UI body), IBM Plex Mono (scientific codes, coordinates, DOIs).
- **Accessibility**: Includes high-contrast focus rings, screen-reader jump links (`SkipToContent`), and `Lite Mode` toggle (disables heavy animations for low-bandwidth field stations).

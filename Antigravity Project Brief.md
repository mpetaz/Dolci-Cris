# **PROJECT BRIEF: "Gelato & Caffè Fit Masterclass" App**

**Platform Target:** Mobile-First Web App (Responsive React/Next.js \+ Tailwind CSS \+ SQLite/Prisma or Firebase)

**Development Tool:** Google Antigravity 2.0 (Agent-First Developer Workflow)

## **1\. VISIONE GENERALE E FILOSOFIA**

L'applicazione è un assistente intelligente e ricettario interattivo per la preparazione di gelati, sorbetti, granite e creme caffè in chiave "Fit & High-Protein" utilizzando attrezzature ed ingredienti reali acquistati dall'utente.

L'app deve guidare l'utente attraverso la rigorosa "chimica del gelo" (attivazione a caldo dei neutri, bilanciamento dei solidi e degli alcoli) e gestire i tempi di congelamento delle vaschette (pinte), sfruttando le funzioni avanzate delle macchine in possesso.

## **2\. INVENTARIO HARDWARE E INGREDIENTI REALI (DATABASE PRE-POPULATED)**

L'applicazione deve "ricordare" ed essere ottimizzata per le seguenti dotazioni dell'utente:

### **Apparecchiature (Hardware)**

1. **Moulinex Dolci (Tecnologia 1-Step Perfector):** Sistema a raschiamento di blocchi congelati (stile pinta/puck). Programmi chiave supportati dall'hardware: Gelato, Sorbetto, Yogurt Gelato, Granita, e la funzione cruciale **MIX** (per inglobare i mix-in senza spappolarli) \+ opzione **Re-spin**.  
2. **Russell Hobbs Adventure:** Macchina per caffè americano a filtro. Utilizzata per estrazioni calde (circa 85°C), ideali per l'attivazione dei gelificanti.

### **Dispensa (Pantry & Active Ingredients)**

* **Neutro per Gelati SaporePuro:** Miscela professionale (Farina di semi di carruba, gomma di guar, gomma di tara). Richiede attivazione termica a 80°C \- 85°C.  
* **Latte Scremato in Polvere SaporePuro:** Utilizzato per aggiungere solidi del latte senza aggiungere grassi, migliorando la struttura e sostituendo l'acqua libera.  
* **Impact Whey Protein (MyProtein):** Gusti Cioccolato, Vaniglia o Neutro. Utilizzate come boost proteico e strutturante.  
* **Yogurt Greco 0% (Bianco e al Caffè):** Base proteica e acida per yogurt gelati e creme caffè.  
* **Ingredienti tradizionali:** Latte fresco parzialmente scremato, cacao amaro, uvette, Marsala, pesche mature, frutti di bosco congelati, pasta pura di mandorle 100%.

## **3\. FUNZIONALITÀ CHIAVE DELL'APPLICAZIONE**

### **A. Dashboard "La Mia Cucina"**

* Visualizzazione dello stato attuale delle apparecchiature.  
* Gestione della dispensa (Ingredienti disponibili / In esaurimento).  
* Quick-link per avviare una nuova ricetta in base a ciò che è presente in dispensa.

### **B. Gestore delle Pinte in Freezer (Smart Timer)**

* Poiché il sistema Moulinex richiede esattamente **24 ore di congelamento** per stabilizzare la miscela prima dello spin:  
  * L'utente può registrare una vaschetta indicando il gusto (es. "Malaga Fit in Pinta 1").  
  * Avvio di un countdown di 24 ore.  
  * Notifica push / avviso visivo quando la pinta è pronta per essere processata ("Pronta per lo Spin\!").  
  * Storico delle pinte attualmente in congelamento.

### **C. Ricettario Interattivo "Socio Fit" (Step-by-Step con Timer di Cottura)**

Ogni ricetta deve avere una guida passo-passo interattiva che tiene conto della temperatura di attivazione dei neutri (80-85°C) e dell'ordine di inserimento degli ingredienti caldi/freddi.

#### **Le Ricette Integrate:**

1. **Cioccolato Fit Protein:** 30g Impact Whey Cioccolato, 300ml latte parz. scremato, 10g cacao amaro, 25g eritritolo, 2g Neutro SaporePuro. (Attivazione a caldo del neutro in 50ml di latte).  
2. **Malaga Fit (Marsala & Uvetta):** 200g yogurt greco 0%, 150ml latte, 30ml Marsala nella base, 30g eritritolo, 3g Neutro, \+ 40g Uvette per il Mix-In.  
3. **Crema Caffè Russell-Moulinex (High Protein):** 150ml caffè americano Russell Hobbs caldo (85°C, perfetto per sciogliere 2g di neutro \+ eritritolo), 170g yogurt greco al caffè 0%, 100ml latte, 25g Impact Whey (Vaniglia o Neutre). *Programma: Yogurt Gelato*.  
4. **Sorbetto alla Pesca Matura:** 350g pesche sbucciate, 80ml acqua (scaldata a 80°C per sciogliere 2g di neutro \+ 30g eritritolo), succo di limone. *Programma: Sorbetto*.  
5. **Sorbetto ai Frutti di Bosco "Sanificato" (Sicurezza Alimentare):** 300g frutti di bosco congelati, bolliti per 2-3 minuti in 100ml di acqua e eritritolo per eliminare virus (Epatite A/Norovirus), con 2.5g di Neutro sciolto direttamente nella purea calda (85°C). *Programma: Sorbetto*.  
6. **Nice Cream Choco-Banana Istantaneo (Senza Attesa):** 2 banane congelate a rondelle, 2 cucchiai di cacao amaro, 3 cucchiai di latte. Da frullare all'istante ed emulsionare subito nella Moulinex con la funzione **MIX**. *(Senza neutro, senza eritritolo).*  
7. **Granita Siciliana al Caffè (con Panna):** 300ml caffè americano caldo, 45g eritritolo, 1.5g Neutro. *Programma: Granita (Slush)*. Servire con panna montata.  
8. **Gelato alla Mandorla Siciliano (Fit & Protein):** 80g pasta pura di mandorle 100%, 200g yogurt greco 0%, 150ml latte (o latte di mandorla), 20g Impact Whey Vaniglia, 35g eritritolo, 2.5g Neutro. *Programma: Gelato*.

### **D. Assistente "Spin & Mix" & Troubleshooting**

Un'interfaccia di guida durante l'uso fisico della macchina:

* **Guida Mix-In dell'Uvetta (Malaga):** Spiegazione dello *Shock Termico* (uvette ammollate nel Marsala, scolate e messe 20 minuti in freezer prima di inserirle nel foro centrale della pinta per evitare di sciogliere il gelato durante la rotazione) e istruzioni per lanciare il programma **MIX**.  
* **Pillole di Troubleshooting:**  
  * *Texture sabbiosa?* Spiega l'idratazione incompleta del neutro o la mancanza di solidi magri.  
  * *Texture farinosa/sbriciolata?* Suggerisce l'aggiunta di un cucchiaino di latte e il comando **Re-spin**.  
  * *Gelato troppo molle?* Avverte sull'eccesso di alcol (Marsala) che abbassa troppo il punto di congelamento.

## **4\. ARCHITETTURA DATI E SCHEMA (PRISMA / SQLITE)**

L'agente Antigravity dovrebbe implementare i seguenti modelli di dati:

model Equipment {  
  id          String   @id @default(uuid())  
  name        String   // es. "Moulinex Dolci", "Russell Hobbs Adventure"  
  type        String   // "IceCreamMaker", "CoffeeMachine"  
  programs    String\[\] // es. \["Gelato", "Sorbetto", "MIX"\]  
}

model Ingredient {  
  id          String   @id @default(uuid())  
  name        String   // es. "Neutro SaporePuro", "Impact Whey"  
  quantity    Float    // Quantità attuale in grammi o ml  
  unit        String   // "g", "ml", "pcs"  
  isCritical  Boolean  @default(false) // Avvisa se manca per ricette base  
}

model Recipe {  
  id           String   @id @default(uuid())  
  title        String  
  category     String   // "Gelato", "Sorbetto", "Granita", "NiceCream"  
  description  String  
  ingredients  Json     // Lista ingredienti con dosi precise  
  steps        Json     // Passaggi ordinati con temperature di riferimento  
  programUsed  String   // Programma Moulinex consigliato (es. "Yogurt Gelato")  
  hasMixIn     Boolean  @default(false)  
  mixInInstructions String?  
}

model FreezeTracker {  
  id         String   @id @default(uuid())  
  pintaName  String   // es. "Pinta 1 \- Malaga"  
  recipeId   String  
  recipe     Recipe   @relation(fields: \[recipeId\], references: \[id\])  
  createdAt  DateTime @default(now())  
  readyAt    DateTime // Impostata esattamente a createdAt \+ 24 ore  
  isSpun     Boolean  @default(false)  
}

## **5\. UI/UX & DESIGN SYSTEM**

L'interfaccia deve riflettere un look fresco, moderno, giocoso ma estremamente curato (ispirato ai font *Comfortaa* e *Afacad Flux*):

* **Color Palette (60-30-10 Rule):**  
  * **Backgrounds (60%):** Bianco puro o grigio chiarissimo (\#F8FAFC) con gradienti sfumati molto morbidi di sfondo.  
  * **Brand/Secondary (30%):** Deep Slate/Charcoal (\#1E293B) per testi, tabelle e card strutturali.  
  * **Accent/Highlights (10%):** Pastel Lime (\#DCFD8B) per i successi/box attivi, Soft Purple (\#BC84EE) per bottoni primari/brand e Pastel Orange (\#FF823A) per alert e icone interattive.  
* **Componenti Visivi:**  
  * Card interattive per le ricette con badge proteici (es. "PROTEINE: 25g", "KCAL: \~220").  
  * Un timer circolare animato nella dashboard che mostra il progresso del congelamento delle pinte (FREEZE TRACKER).  
  * Sezioni di ricetta divise per colore coerentemente con l'ingrediente principale (es. Cioccolato \= Marrone Caldo, Caffè \= Caffè scuro, Malaga \= Arancione caldo, Sorbetti \= Ciano brillante).

## **6\. PROMPT D'AVVIO CONSIGLIATO PER L'AGENTE ANTIGRAVITY**

*Copy-paste this as the first message to Antigravity CLI / Manager:*

"I have initialized a new project for my Fit Gelateria application using Google Antigravity. Please read the antigravity\_gelato\_fit\_briefing.md file carefully. Create the initial project structure using Next.js, Tailwind CSS, and SQLite (via Prisma). Start by implementing the database schema, generating the seed data for the 8 custom recipes and the user's kitchen hardware, and then build the mobile-friendly Dashboard with the active Freezer Tracker (24-hour countdown)."
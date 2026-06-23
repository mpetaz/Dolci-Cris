// Database client-side basato su localStorage per rendere l'app 100% statica (adatta a GitHub Pages)

export interface IngredientMeasure {
  name: string;
  quantity: number;
  unit: string;
}

export interface StepInstruction {
  stepNumber: number;
  instruction: string;
  tempMin: number | null;
  tempMax: number | null;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  programs: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isCritical: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  description: string;
  ingredients: IngredientMeasure[];
  steps: StepInstruction[];
  programUsed: string;
  hasMixIn: boolean;
  mixInInstructions: string | null;
}

export interface FreezeTracker {
  id: string;
  pintaName: string;
  recipeId: string;
  recipe: Recipe;
  createdAt: string;
  readyAt: string;
  isSpun: boolean;
}

// Dati di seed iniziali
const initialEquipment: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Moulinex Dolci (1-Step Perfector)',
    type: 'IceCreamMaker',
    programs: ['Gelato', 'Sorbetto', 'Yogurt Gelato', 'Granita', 'MIX', 'Re-spin'],
  },
  {
    id: 'eq-2',
    name: 'Russell Hobbs Adventure',
    type: 'CoffeeMachine',
    programs: ['Caffè Americano'],
  },
];

const initialIngredients: Ingredient[] = [
  { id: 'ing-1', name: 'Neutro per Gelati SaporePuro', quantity: 200, unit: 'g', isCritical: true },
  { id: 'ing-2', name: 'Latte Scremato in Polvere SaporePuro', quantity: 500, unit: 'g', isCritical: false },
  { id: 'ing-3', name: 'Impact Whey Protein (Cioccolato)', quantity: 450, unit: 'g', isCritical: true },
  { id: 'ing-4', name: 'Impact Whey Protein (Vaniglia)', quantity: 300, unit: 'g', isCritical: false },
  { id: 'ing-5', name: 'Impact Whey Protein (Neutro)', quantity: 250, unit: 'g', isCritical: false },
  { id: 'ing-6', name: 'Yogurt Greco 0% Bianco', quantity: 800, unit: 'g', isCritical: true },
  { id: 'ing-7', name: 'Yogurt Greco 0% al Caffè', quantity: 500, unit: 'g', isCritical: false },
  { id: 'ing-8', name: 'Latte fresco parzialmente scremato', quantity: 1500, unit: 'ml', isCritical: true },
  { id: 'ing-9', name: 'Cacao Amaro', quantity: 200, unit: 'g', isCritical: false },
  { id: 'ing-10', name: 'Uvetta', quantity: 300, unit: 'g', isCritical: false },
  { id: 'ing-11', name: 'Marsala', quantity: 500, unit: 'ml', isCritical: false },
  { id: 'ing-12', name: 'Pesche Mature', quantity: 1200, unit: 'g', isCritical: false },
  { id: 'ing-13', name: 'Frutti di Bosco Congelati', quantity: 1000, unit: 'g', isCritical: false },
  { id: 'ing-14', name: 'Pasta Pura di Mandorle 100%', quantity: 250, unit: 'g', isCritical: false },
  { id: 'ing-15', name: 'Eritritolo', quantity: 400, unit: 'g', isCritical: true },
  { id: 'ing-16', name: 'Banane', quantity: 8, unit: 'pcs', isCritical: false },
  { id: 'ing-17', name: 'Panna da montare', quantity: 500, unit: 'ml', isCritical: false },
  { id: 'ing-18', name: 'Acqua', quantity: 5000, unit: 'ml', isCritical: false },
  { id: 'ing-19', name: 'Caffè in grani/polvere', quantity: 250, unit: 'g', isCritical: false },
];

const initialRecipes: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Cioccolato Fit Protein',
    category: 'Gelato',
    description: 'Un gelato proteico al cioccolato denso e cremoso, bilanciato con eritritolo e neutro.',
    programUsed: 'Gelato',
    ingredients: [
      { name: 'Impact Whey Protein (Cioccolato)', quantity: 30, unit: 'g' },
      { name: 'Latte fresco parzialmente scremato', quantity: 300, unit: 'ml' },
      { name: 'Cacao Amaro', quantity: 10, unit: 'g' },
      { name: 'Eritritolo', quantity: 25, unit: 'g' },
      { name: 'Neutro per Gelati SaporePuro', quantity: 2, unit: 'g' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Miscela a secco il Neutro SaporePuro e l\'eritritolo in una ciotolina per evitare grumi.', tempMin: null, tempMax: null },
      { stepNumber: 2, instruction: 'Preleva 50ml di latte e scaldalo a 80-85°C (temperatura di attivazione del neutro).', tempMin: 80, tempMax: 85 },
      { stepNumber: 3, instruction: 'Versa la miscela di neutro ed eritritolo nel latte caldo e frulla energicamente con un frullatore a immersione per attivare i gelificanti.', tempMin: null, tempMax: null },
      { stepNumber: 4, instruction: 'Unisci le Impact Whey, il cacao amaro e il restante latte freddo (250ml) nel bicchiere del frullatore.', tempMin: null, tempMax: null },
      { stepNumber: 5, instruction: 'Frulla il tutto accuratamente per emulsionare le due basi e lascia intiepidire/stabilizzare la miscela.', tempMin: null, tempMax: null },
      { stepNumber: 6, instruction: 'Versa il composto nella pinta Moulinex e metti in freezer a congelare per esattamente 24 ore senza coperchio.', tempMin: null, tempMax: null },
    ],
    hasMixIn: false,
    mixInInstructions: null,
  },
  {
    id: 'rec-2',
    title: 'Malaga Fit (Marsala & Uvetta)',
    category: 'Gelato',
    description: 'Il classico gusto Malaga rivisitato in chiave proteica con yogurt greco e un tocco alcolico di Marsala.',
    programUsed: 'Gelato',
    ingredients: [
      { name: 'Yogurt Greco 0% Bianco', quantity: 200, unit: 'g' },
      { name: 'Latte fresco parzialmente scremato', quantity: 150, unit: 'ml' },
      { name: 'Marsala', quantity: 30, unit: 'ml' },
      { name: 'Eritritolo', quantity: 30, unit: 'g' },
      { name: 'Neutro per Gelati SaporePuro', quantity: 3, unit: 'g' },
      { name: 'Uvetta', quantity: 40, unit: 'g' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Metti le uvette a bagno in 20-30ml extra di Marsala per almeno 4 ore (meglio tutta la notte).', tempMin: null, tempMax: null },
      { stepNumber: 2, instruction: 'Miscela a secco il Neutro SaporePuro e l\'eritritolo.', tempMin: null, tempMax: null },
      { stepNumber: 3, instruction: 'Scalda 50ml di latte a circa 80-85°C, unisci il neutro/eritritolo e frulla col mixer per idratare le farine.', tempMin: 80, tempMax: 85 },
      { stepNumber: 4, instruction: 'Unisci lo yogurt greco 0%, il latte freddo rimanente, i 30ml di Marsala per la base e frulla bene.', tempMin: null, tempMax: null },
      { stepNumber: 5, instruction: 'Versa la base nella pinta, livella la superficie e congela in freezer per 24 ore.', tempMin: null, tempMax: null },
      { stepNumber: 6, instruction: 'Scola bene le uvette ammollate e mettile in freezer su un piattino per 20 minuti prima dello spin per lo shock termico (fondamentale!).', tempMin: null, tempMax: null },
      { stepNumber: 7, instruction: 'Esegui il primo spin della pinta con il programma "Gelato". Scava poi un foro cilindrico al centro del gelato.', tempMin: null, tempMax: null },
      { stepNumber: 8, instruction: 'Versa le uvette gelide nel foro e avvia il programma "MIX" della Moulinex Dolci per incorporarle.', tempMin: null, tempMax: null },
    ],
    hasMixIn: true,
    mixInInstructions: 'Shock Termico: Uvette ammollate nel Marsala, scolate bene e messe 20 minuti in freezer prima di inserirle nel foro centrale del gelato appena spinnato. Avviare poi il programma MIX.',
  },
  {
    id: 'rec-3',
    title: 'Crema Caffè Russell-Moulinex',
    category: 'Gelato',
    description: 'Una deliziosa crema caffè proteica che unisce l\'estrazione a filtro della Russell Hobbs con la mantecazione della Moulinex.',
    programUsed: 'Yogurt Gelato',
    ingredients: [
      { name: 'Caffè in grani/polvere', quantity: 15, unit: 'g' },
      { name: 'Acqua', quantity: 150, unit: 'ml' },
      { name: 'Yogurt Greco 0% al Caffè', quantity: 170, unit: 'g' },
      { name: 'Latte fresco parzialmente scremato', quantity: 100, unit: 'ml' },
      { name: 'Eritritolo', quantity: 25, unit: 'g' },
      { name: 'Neutro per Gelati SaporePuro', quantity: 2, unit: 'g' },
      { name: 'Impact Whey Protein (Vaniglia)', quantity: 20, unit: 'g' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Esegui un\'estrazione a filtro calda (circa 85°C) usando la macchina Russell Hobbs Adventure per ottenere 150ml di caffè americano.', tempMin: 80, tempMax: 85 },
      { stepNumber: 2, instruction: 'Sciogli immediatamente il Neutro e l\'eritritolo direttamente nel caffè bollente appena uscito, frullando col mixer a immersione.', tempMin: null, tempMax: null },
      { stepNumber: 3, instruction: 'Lascia intiepidire la miscela di caffè per qualche minuto.', tempMin: null, tempMax: null },
      { stepNumber: 4, instruction: 'Aggiungi lo yogurt greco al caffè 0%, il latte freddo e le Impact Whey Protein e frulla accuratamente.', tempMin: null, tempMax: null },
      { stepNumber: 5, instruction: 'Versa nella pinta e posizionala in freezer a congelare per 24 ore.', tempMin: null, tempMax: null },
      { stepNumber: 6, instruction: 'Processa la pinta congelata utilizzando il programma "Yogurt Gelato" sulla Moulinex Dolci.', tempMin: null, tempMax: null },
    ],
    hasMixIn: false,
    mixInInstructions: null,
  },
  {
    id: 'rec-4',
    title: 'Sorbetto alla Pesca Matura',
    category: 'Sorbetto',
    description: 'Sorbetto rinfrescante con pesche fresche frullate e stabilizzato a caldo con neutro ed eritritolo.',
    programUsed: 'Sorbetto',
    ingredients: [
      { name: 'Pesche Mature', quantity: 350, unit: 'g' },
      { name: 'Acqua', quantity: 80, unit: 'ml' },
      { name: 'Eritritolo', quantity: 30, unit: 'g' },
      { name: 'Neutro per Gelati SaporePuro', quantity: 2, unit: 'g' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Scalda 80ml di acqua a 80°C.', tempMin: 75, tempMax: 85 },
      { stepNumber: 2, instruction: 'Sciogli il Neutro e l\'eritritolo nell\'acqua calda frullando accuratamente.', tempMin: null, tempMax: null },
      { stepNumber: 3, instruction: 'Sbuccia le pesche, tagliale a pezzi e frullale finemente insieme a un cucchiaio di succo di limone per evitare l\'ossidazione.', tempMin: null, tempMax: null },
      { stepNumber: 4, instruction: 'Unisci lo sciroppo di neutro caldo alla polpa di pesca e frulla per amalgamare il tutto.', tempMin: null, tempMax: null },
      { stepNumber: 5, instruction: 'Versa la miscela nella pinta e posizionala in freezer per 24 ore.', tempMin: null, tempMax: null },
      { stepNumber: 6, instruction: 'Mantechi la pinta congelata con il programma "Sorbetto".', tempMin: null, tempMax: null },
    ],
    hasMixIn: false,
    mixInInstructions: null,
  },
  {
    id: 'rec-5',
    title: 'Sorbetto ai Frutti di Bosco "Sanificato"',
    category: 'Sorbetto',
    description: 'Massima sicurezza alimentare: frutti di bosco cotti a caldo per eliminare virus, stabilizzati con neutro.',
    programUsed: 'Sorbetto',
    ingredients: [
      { name: 'Frutti di Bosco Congelati', quantity: 300, unit: 'g' },
      { name: 'Acqua', quantity: 100, unit: 'ml' },
      { name: 'Eritritolo', quantity: 40, unit: 'g' },
      { name: 'Neutro per Gelati SaporePuro', quantity: 2.5, unit: 'g' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Bollisci i frutti di bosco congelati per 2-3 minuti in 100ml di acqua e eritritolo (processo fondamentale per la sicurezza alimentare contro Epatite A/Norovirus).', tempMin: 90, tempMax: 100 },
      { stepNumber: 2, instruction: 'Raggiunti gli 85°C durante il raffreddamento, sciogli direttamente 2.5g di Neutro nella purea calda di frutti di bosco, frullando accuratamente col mixer.', tempMin: 80, tempMax: 85 },
      { stepNumber: 3, instruction: 'Lascia raffreddare la purea a temperatura ambiente.', tempMin: null, tempMax: null },
      { stepNumber: 4, instruction: 'Versa il composto nella pinta e congelalo per 24 ore.', tempMin: null, tempMax: null },
      { stepNumber: 5, instruction: 'Processa nella Moulinex Dolci con il programma "Sorbetto".', tempMin: null, tempMax: null },
    ],
    hasMixIn: false,
    mixInInstructions: null,
  },
  {
    id: 'rec-6',
    title: 'Nice Cream Choco-Banana Istantaneo',
    category: 'NiceCream',
    description: 'Il gelato velocissimo senza attesa di 24 ore, cremoso grazie alle banane congelate frullate ed emulsionate subito.',
    programUsed: 'MIX',
    ingredients: [
      { name: 'Banane', quantity: 2, unit: 'pcs' },
      { name: 'Cacao Amaro', quantity: 15, unit: 'g' },
      { name: 'Latte fresco parzialmente scremato', quantity: 45, unit: 'ml' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Taglia a rondelle le banane e mettile in freezer per almeno 4-6 ore fino a renderle completamente solide.', tempMin: null, tempMax: null },
      { stepNumber: 2, instruction: 'Mette le banane congelate, il cacao amaro e il latte freddo nel bicchiere del frullatore.', tempMin: null, tempMax: null },
      { stepNumber: 3, instruction: 'Frulla immediatamente a impulsi finché non ottieni una consistenza cremosa ed omogenea.', tempMin: null, tempMax: null },
      { stepNumber: 4, instruction: 'Trasferisci subito il composto nella pinta Moulinex e avvia il programma "MIX" per emulsionare al volo e servire all\'istante senza congelare 24 ore!', tempMin: null, tempMax: null },
    ],
    hasMixIn: false,
    mixInInstructions: null,
  },
  {
    id: 'rec-7',
    title: 'Granita Siciliana al Caffè (con Panna)',
    category: 'Granita',
    description: 'Una granita al caffè tradizionale dolcificata con eritritolo, stabilizzata con neutro e servita con panna.',
    programUsed: 'Granita',
    ingredients: [
      { name: 'Caffè in grani/polvere', quantity: 30, unit: 'g' },
      { name: 'Acqua', quantity: 300, unit: 'ml' },
      { name: 'Eritritolo', quantity: 45, unit: 'g' },
      { name: 'Neutro per Gelati SaporePuro', quantity: 1.5, unit: 'g' },
      { name: 'Panna da montare', quantity: 50, unit: 'ml' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Esegui un\'estrazione a filtro calda per ottenere 300ml di caffè americano caldo.', tempMin: 80, tempMax: 85 },
      { stepNumber: 2, instruction: 'Sciogli l\'eritritolo e 1.5g di Neutro direttamente nel caffè bollente frullando bene col mixer.', tempMin: null, tempMax: null },
      { stepNumber: 3, instruction: 'Lascia raffreddare la miscela a temperatura ambiente e poi versala nella pinta.', tempMin: null, tempMax: null },
      { stepNumber: 4, instruction: 'Congela in freezer per 24 ore.', tempMin: null, tempMax: null },
      { stepNumber: 5, instruction: 'Mantechi la granita utilizzando il programma "Granita" sulla Moulinex Dolci.', tempMin: null, tempMax: null },
      { stepNumber: 6, instruction: 'Servi la granita in un bicchiere con una generosa guarnizione di panna montata.', tempMin: null, tempMax: null },
    ],
    hasMixIn: false,
    mixInInstructions: null,
  },
  {
    id: 'rec-8',
    title: 'Gelato alla Mandorla Siciliano',
    category: 'Gelato',
    description: 'Gelato proteico e ricco con pasta pura di mandorle, yogurt greco e whey vaniglia.',
    programUsed: 'Gelato',
    ingredients: [
      { name: 'Pasta Pura di Mandorle 100%', quantity: 80, unit: 'g' },
      { name: 'Yogurt Greco 0% Bianco', quantity: 200, unit: 'g' },
      { name: 'Latte fresco parzialmente scremato', quantity: 150, unit: 'ml' },
      { name: 'Impact Whey Protein (Vaniglia)', quantity: 20, unit: 'g' },
      { name: 'Eritritolo', quantity: 35, unit: 'g' },
      { name: 'Neutro per Gelati SaporePuro', quantity: 2.5, unit: 'g' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Miscela a secco il Neutro SaporePuro e l\'eritritolo.', tempMin: null, tempMax: null },
      { stepNumber: 2, instruction: 'Scalda 50ml di latte a 80-85°C e sciogli la miscela di neutro ed eritritolo frullando col mixer.', tempMin: 80, tempMax: 85 },
      { stepNumber: 3, instruction: 'In una ciotola capiente, diluisci la pasta pura di mandorle con il restante latte freddo (100ml) un po\' alla volta per emulsionarla bene.', tempMin: null, tempMax: null },
      { stepNumber: 4, instruction: 'Unisci lo yogurt greco 0%, le Impact Whey vaniglia, lo sciroppo di neutro caldo e la pasta di mandorla diluita nel bicchiere del frullatore.', tempMin: null, tempMax: null },
      { stepNumber: 5, instruction: 'Frulla vigorosamente per ottenere un composto liscio e vellutato.', tempMin: null, tempMax: null },
      { stepNumber: 6, instruction: 'Versa nella pinta e posizionala in freezer per 24 ore.', tempMin: null, tempMax: null },
      { stepNumber: 7, instruction: 'Mantechi col programma "Gelato" sulla Moulinex Dolci.', tempMin: null, tempMax: null },
    ],
    hasMixIn: false,
    mixInInstructions: null,
  },
];

// Helper per leggere e scrivere su localStorage in modo sicuro
export function getLocalStorageData() {
  if (typeof window === 'undefined') {
    return {
      equipment: initialEquipment,
      ingredients: initialIngredients,
      recipes: initialRecipes,
      trackers: [],
    };
  }

  // 1. Equipment
  let equipment = initialEquipment;
  const storedEq = localStorage.getItem('dolcicris_equipment');
  if (storedEq) {
    equipment = JSON.parse(storedEq);
  } else {
    localStorage.setItem('dolcicris_equipment', JSON.stringify(initialEquipment));
  }

  // 2. Ingredients
  let ingredients = initialIngredients;
  const storedIng = localStorage.getItem('dolcicris_ingredients');
  if (storedIng) {
    ingredients = JSON.parse(storedIng);
  } else {
    localStorage.setItem('dolcicris_ingredients', JSON.stringify(initialIngredients));
  }

  // 3. Recipes
  let recipes = initialRecipes;
  const storedRec = localStorage.getItem('dolcicris_recipes');
  if (storedRec) {
    recipes = JSON.parse(storedRec);
  } else {
    localStorage.setItem('dolcicris_recipes', JSON.stringify(initialRecipes));
  }

  // 4. Trackers
  let trackers: FreezeTracker[] = [];
  const storedTr = localStorage.getItem('dolcicris_trackers');
  if (storedTr) {
    trackers = JSON.parse(storedTr);
  } else {
    localStorage.setItem('dolcicris_trackers', JSON.stringify([]));
  }

  return { equipment, ingredients, recipes, trackers };
}

// Salva quantità ingrediente
export function updateIngredientQtyClient(id: string, qty: number) {
  const { ingredients } = getLocalStorageData();
  const updated = ingredients.map((ing) => 
    ing.id === id ? { ...ing, quantity: Math.max(0, qty) } : ing
  );
  localStorage.setItem('dolcicris_ingredients', JSON.stringify(updated));
  return updated;
}

// Aggiungi pinta
export function addPintClient(recipeId: string, pintaName: string) {
  const { recipes, trackers, ingredients } = getLocalStorageData();
  const recipe = recipes.find((r) => r.id === recipeId);
  if (!recipe) throw new Error('Ricetta non trovata');

  const now = new Date();
  const readyAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const isIstantanea = recipe.category === 'NiceCream';

  const newTracker: FreezeTracker = {
    id: 'tr-' + Math.random().toString(36).substr(2, 9),
    pintaName: pintaName.trim() || `Pinta ${recipe.title}`,
    recipeId,
    recipe,
    createdAt: now.toISOString(),
    readyAt: (isIstantanea ? now : readyAt).toISOString(),
    isSpun: false,
  };

  const updatedTrackers = [...trackers, newTracker];
  localStorage.setItem('dolcicris_trackers', JSON.stringify(updatedTrackers));

  // Scala gli ingredienti usati
  const updatedIngredients = ingredients.map((ing) => {
    const required = recipe.ingredients.find(
      (r) => ing.name.toLowerCase().includes(r.name.toLowerCase().split(' (')[0])
    );
    if (required) {
      return { ...ing, quantity: Math.max(0, ing.quantity - required.quantity) };
    }
    return ing;
  });
  localStorage.setItem('dolcicris_ingredients', JSON.stringify(updatedIngredients));

  return { trackers: updatedTrackers, ingredients: updatedIngredients };
}

// Spin pinta
export function spinPintClient(id: string) {
  const { trackers } = getLocalStorageData();
  const updated = trackers.map((tr) => 
    tr.id === id ? { ...tr, isSpun: true } : tr
  );
  localStorage.setItem('dolcicris_trackers', JSON.stringify(updated));
  return updated;
}

// Rimuovi pinta
export function deleteTrackerClient(id: string) {
  const { trackers } = getLocalStorageData();
  const updated = trackers.filter((tr) => tr.id !== id);
  localStorage.setItem('dolcicris_trackers', JSON.stringify(updated));
  return updated;
}

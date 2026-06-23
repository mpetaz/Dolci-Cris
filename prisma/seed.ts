import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Svuota il database per evitare duplicati in caso di riesecuzione
  await prisma.freezeTracker.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.recipe.deleteMany();

  console.log('Database ripulito. Inizio popolamento seed...');

  // 1. Popolamento Attrezzature (Equipment)
  const equipment = await Promise.all([
    prisma.equipment.create({
      data: {
        name: 'Moulinex Dolci (1-Step Perfector)',
        type: 'IceCreamMaker',
        programs: JSON.stringify(['Gelato', 'Sorbetto', 'Yogurt Gelato', 'Granita', 'MIX', 'Re-spin']),
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'Russell Hobbs Adventure',
        type: 'CoffeeMachine',
        programs: JSON.stringify(['Caffè Americano']),
      },
    }),
  ]);

  console.log(`Inserite ${equipment.length} attrezzature.`);

  // 2. Popolamento Ingredienti in Dispensa (Ingredients)
  const ingredientsData = [
    { name: 'Neutro per Gelati SaporePuro', quantity: 200, unit: 'g', isCritical: true },
    { name: 'Latte Scremato in Polvere SaporePuro', quantity: 500, unit: 'g', isCritical: false },
    { name: 'Impact Whey Protein (Cioccolato)', quantity: 450, unit: 'g', isCritical: true },
    { name: 'Impact Whey Protein (Vaniglia)', quantity: 300, unit: 'g', isCritical: false },
    { name: 'Impact Whey Protein (Neutro)', quantity: 250, unit: 'g', isCritical: false },
    { name: 'Yogurt Greco 0% Bianco', quantity: 800, unit: 'g', isCritical: true },
    { name: 'Yogurt Greco 0% al Caffè', quantity: 500, unit: 'g', isCritical: false },
    { name: 'Latte fresco parzialmente scremato', quantity: 1500, unit: 'ml', isCritical: true },
    { name: 'Cacao Amaro', quantity: 200, unit: 'g', isCritical: false },
    { name: 'Uvetta', quantity: 300, unit: 'g', isCritical: false },
    { name: 'Marsala', quantity: 500, unit: 'ml', isCritical: false },
    { name: 'Pesche Mature', quantity: 1200, unit: 'g', isCritical: false },
    { name: 'Frutti di Bosco Congelati', quantity: 1000, unit: 'g', isCritical: false },
    { name: 'Pasta Pura di Mandorle 100%', quantity: 250, unit: 'g', isCritical: false },
    { name: 'Eritritolo', quantity: 400, unit: 'g', isCritical: true },
    { name: 'Banane', quantity: 8, unit: 'pcs', isCritical: false },
    { name: 'Panna da montare', quantity: 500, unit: 'ml', isCritical: false },
    { name: 'Acqua', quantity: 5000, unit: 'ml', isCritical: false },
    { name: 'Caffè in grani/polvere', quantity: 250, unit: 'g', isCritical: false },
  ];

  const ingredients = await Promise.all(
    ingredientsData.map((ing) => prisma.ingredient.create({ data: ing }))
  );

  console.log(`Inseriti ${ingredients.length} ingredienti nella dispensa.`);

  // 3. Popolamento Ricette (Recipe)
  const recipesData = [
    {
      title: 'Cioccolato Fit Protein',
      category: 'Gelato',
      description: 'Un gelato proteico al cioccolato denso e cremoso, bilanciato con eritritolo e neutro.',
      programUsed: 'Gelato',
      ingredients: JSON.stringify([
        { name: 'Impact Whey Protein (Cioccolato)', quantity: 30, unit: 'g' },
        { name: 'Latte fresco parzialmente scremato', quantity: 300, unit: 'ml' },
        { name: 'Cacao Amaro', quantity: 10, unit: 'g' },
        { name: 'Eritritolo', quantity: 25, unit: 'g' },
        { name: 'Neutro per Gelati SaporePuro', quantity: 2, unit: 'g' },
      ]),
      steps: JSON.stringify([
        { stepNumber: 1, instruction: 'Miscela a secco il Neutro SaporePuro e l\'eritritolo in una ciotolina per evitare grumi.', tempMin: null, tempMax: null },
        { stepNumber: 2, instruction: 'Preleva 50ml di latte e scaldalo a 80-85°C (temperatura di attivazione del neutro).', tempMin: 80, tempMax: 85 },
        { stepNumber: 3, instruction: 'Versa la miscela di neutro ed eritritolo nel latte caldo e frulla energicamente con un frullatore a immersione per attivare i gelificanti.', tempMin: null, tempMax: null },
        { stepNumber: 4, instruction: 'Unisci le Impact Whey, il cacao amaro e il restante latte freddo (250ml) nel bicchiere del frullatore.', tempMin: null, tempMax: null },
        { stepNumber: 5, instruction: 'Frulla il tutto accuratamente per emulsionare le due basi e lascia intiepidire/stabilizzare la miscela.', tempMin: null, tempMax: null },
        { stepNumber: 6, instruction: 'Versa il composto nella pinta Moulinex e metti in freezer a congelare per esattamente 24 ore senza coperchio.', tempMin: null, tempMax: null },
      ]),
      hasMixIn: false,
      mixInInstructions: null,
    },
    {
      title: 'Malaga Fit (Marsala & Uvetta)',
      category: 'Gelato',
      description: 'Il classico gusto Malaga rivisitato in chiave proteica con yogurt greco e un tocco alcolico di Marsala.',
      programUsed: 'Gelato',
      ingredients: JSON.stringify([
        { name: 'Yogurt Greco 0% Bianco', quantity: 200, unit: 'g' },
        { name: 'Latte fresco parzialmente scremato', quantity: 150, unit: 'ml' },
        { name: 'Marsala', quantity: 30, unit: 'ml' },
        { name: 'Eritritolo', quantity: 30, unit: 'g' },
        { name: 'Neutro per Gelati SaporePuro', quantity: 3, unit: 'g' },
        { name: 'Uvetta', quantity: 40, unit: 'g' },
      ]),
      steps: JSON.stringify([
        { stepNumber: 1, instruction: 'Metti le uvette a bagno in 20-30ml extra di Marsala per almeno 4 ore (meglio tutta la notte).', tempMin: null, tempMax: null },
        { stepNumber: 2, instruction: 'Miscela a secco il Neutro SaporePuro e l\'eritritolo.', tempMin: null, tempMax: null },
        { stepNumber: 3, instruction: 'Scalda 50ml di latte a circa 80-85°C, unisci il neutro/eritritolo e frulla col mixer per idratare le farine.', tempMin: 80, tempMax: 85 },
        { stepNumber: 4, instruction: 'Unisci lo yogurt greco 0%, il latte freddo rimanente, i 30ml di Marsala per la base e frulla bene.', tempMin: null, tempMax: null },
        { stepNumber: 5, instruction: 'Versa la base nella pinta, livella la superficie e congela in freezer per 24 ore.', tempMin: null, tempMax: null },
        { stepNumber: 6, instruction: 'Scola bene le uvette ammollate e mettile in freezer su un piattino per 20 minuti prima dello spin per lo shock termico (fondamentale!).', tempMin: null, tempMax: null },
        { stepNumber: 7, instruction: 'Esegui il primo spin della pinta con il programma "Gelato". Scava poi un foro cilindrico al centro del gelato.', tempMin: null, tempMax: null },
        { stepNumber: 8, instruction: 'Versa le uvette gelide nel foro e avvia il programma "MIX" della Moulinex Dolci per incorporarle.', tempMin: null, tempMax: null },
      ]),
      hasMixIn: true,
      mixInInstructions: 'Shock Termico: Uvette ammollate nel Marsala, scolate bene e messe 20 minuti in freezer prima di inserirle nel foro centrale del gelato appena spinnato. Avviare poi il programma MIX.',
    },
    {
      title: 'Crema Caffè Russell-Moulinex',
      category: 'Gelato',
      description: 'Una deliziosa crema caffè proteica che unisce l\'estrazione a filtro della Russell Hobbs con la mantecazione della Moulinex.',
      programUsed: 'Yogurt Gelato',
      ingredients: JSON.stringify([
        { name: 'Caffè in grani/polvere', quantity: 15, unit: 'g' }, // per fare 150ml di caffè
        { name: 'Acqua', quantity: 150, unit: 'ml' },
        { name: 'Yogurt Greco 0% al Caffè', quantity: 170, unit: 'g' },
        { name: 'Latte fresco parzialmente scremato', quantity: 100, unit: 'ml' },
        { name: 'Eritritolo', quantity: 25, unit: 'g' },
        { name: 'Neutro per Gelati SaporePuro', quantity: 2, unit: 'g' },
        { name: 'Impact Whey Protein (Vaniglia)', quantity: 20, unit: 'g' }, // o neutro
      ]),
      steps: JSON.stringify([
        { stepNumber: 1, instruction: 'Esegui un\'estrazione a filtro calda (circa 85°C) usando la macchina Russell Hobbs Adventure per ottenere 150ml di caffè americano.', tempMin: 80, tempMax: 85 },
        { stepNumber: 2, instruction: 'Sciogli immediatamente il Neutro e l\'eritritolo direttamente nel caffè bollente appena uscito, frullando col mixer a immersione.', tempMin: null, tempMax: null },
        { stepNumber: 3, instruction: 'Lascia intiepidire la miscela di caffè per qualche minuto.', tempMin: null, tempMax: null },
        { stepNumber: 4, instruction: 'Aggiungi lo yogurt greco al caffè 0%, il latte freddo e le Impact Whey Protein e frulla accuratamente.', tempMin: null, tempMax: null },
        { stepNumber: 5, instruction: 'Versa nella pinta e posizionala in freezer a congelare per 24 ore.', tempMin: null, tempMax: null },
        { stepNumber: 6, instruction: 'Processa la pinta congelata utilizzando il programma "Yogurt Gelato" sulla Moulinex Dolci.', tempMin: null, tempMax: null },
      ]),
      hasMixIn: false,
      mixInInstructions: null,
    },
    {
      title: 'Sorbetto alla Pesca Matura',
      category: 'Sorbetto',
      description: 'Sorbetto rinfrescante con pesche fresche frullate e stabilizzato a caldo con neutro ed eritritolo.',
      programUsed: 'Sorbetto',
      ingredients: JSON.stringify([
        { name: 'Pesche Mature', quantity: 350, unit: 'g' },
        { name: 'Acqua', quantity: 80, unit: 'ml' },
        { name: 'Eritritolo', quantity: 30, unit: 'g' },
        { name: 'Neutro per Gelati SaporePuro', quantity: 2, unit: 'g' },
      ]),
      steps: JSON.stringify([
        { stepNumber: 1, instruction: 'Scalda 80ml di acqua a 80°C.', tempMin: 75, tempMax: 85 },
        { stepNumber: 2, instruction: 'Sciogli il Neutro e l\'eritritolo nell\'acqua calda frullando accuratamente.', tempMin: null, tempMax: null },
        { stepNumber: 3, instruction: 'Sbuccia le pesche, tagliale a pezzi e frullale finemente insieme a un cucchiaio di succo di limone per evitare l\'ossidazione.', tempMin: null, tempMax: null },
        { stepNumber: 4, instruction: 'Unisci lo sciroppo di neutro caldo alla polpa di pesca e frulla per amalgamare il tutto.', tempMin: null, tempMax: null },
        { stepNumber: 5, instruction: 'Versa la miscela nella pinta e posizionala in freezer per 24 ore.', tempMin: null, tempMax: null },
        { stepNumber: 6, instruction: 'Mantechi la pinta congelata con il programma "Sorbetto".', tempMin: null, tempMax: null },
      ]),
      hasMixIn: false,
      mixInInstructions: null,
    },
    {
      title: 'Sorbetto ai Frutti di Bosco "Sanificato"',
      category: 'Sorbetto',
      description: 'Massima sicurezza alimentare: frutti di bosco cotti a caldo per eliminare virus, stabilizzati con neutro.',
      programUsed: 'Sorbetto',
      ingredients: JSON.stringify([
        { name: 'Frutti di Bosco Congelati', quantity: 300, unit: 'g' },
        { name: 'Acqua', quantity: 100, unit: 'ml' },
        { name: 'Eritritolo', quantity: 40, unit: 'g' },
        { name: 'Neutro per Gelati SaporePuro', quantity: 2.5, unit: 'g' },
      ]),
      steps: JSON.stringify([
        { stepNumber: 1, instruction: 'Bollisci i frutti di bosco congelati per 2-3 minuti in 100ml di acqua e eritritolo (processo fondamentale per la sicurezza alimentare contro Epatite A/Norovirus).', tempMin: 90, tempMax: 100 },
        { stepNumber: 2, instruction: 'Raggiunti gli 85°C durante il raffreddamento, sciogli direttamente 2.5g di Neutro nella purea calda di frutti di bosco, frullando accuratamente col mixer.', tempMin: 80, tempMax: 85 },
        { stepNumber: 3, instruction: 'Lascia raffreddare la purea a temperatura ambiente.', tempMin: null, tempMax: null },
        { stepNumber: 4, instruction: 'Versa il composto nella pinta e congelalo per 24 ore.', tempMin: null, tempMax: null },
        { stepNumber: 5, instruction: 'Processa nella Moulinex Dolci con il programma "Sorbetto".', tempMin: null, tempMax: null },
      ]),
      hasMixIn: false,
      mixInInstructions: null,
    },
    {
      title: 'Nice Cream Choco-Banana Istantaneo',
      category: 'NiceCream',
      description: 'Il gelato velocissimo senza attesa di 24 ore, cremoso grazie alle banane congelate frullate ed emulsionate subito.',
      programUsed: 'MIX',
      ingredients: JSON.stringify([
        { name: 'Banane', quantity: 2, unit: 'pcs' }, // da tagliare e congelare
        { name: 'Cacao Amaro', quantity: 15, unit: 'g' }, // circa 2 cucchiai
        { name: 'Latte fresco parzialmente scremato', quantity: 45, unit: 'ml' }, // circa 3 cucchiai
      ]),
      steps: JSON.stringify([
        { stepNumber: 1, instruction: 'Taglia a rondelle le banane e mettile in freezer per almeno 4-6 ore fino a renderle completamente solide.', tempMin: null, tempMax: null },
        { stepNumber: 2, instruction: 'Metti le banane congelate, il cacao amaro e il latte freddo nel bicchiere del frullatore.', tempMin: null, tempMax: null },
        { stepNumber: 3, instruction: 'Frulla immediatamente a impulsi finché non ottieni una consistenza cremosa ed omogenea.', tempMin: null, tempMax: null },
        { stepNumber: 4, instruction: 'Trasferisci subito il composto nella pinta Moulinex e avvia il programma "MIX" per emulsionare al volo e servire all\'istante senza congelare 24 ore!', tempMin: null, tempMax: null },
      ]),
      hasMixIn: false,
      mixInInstructions: null,
    },
    {
      title: 'Granita Siciliana al Caffè (con Panna)',
      category: 'Granita',
      description: 'Una granita al caffè tradizionale dolcificata con eritritolo, stabilizzata con neutro e servita con panna.',
      programUsed: 'Granita',
      ingredients: JSON.stringify([
        { name: 'Caffè in grani/polvere', quantity: 30, unit: 'g' }, // per fare 300ml di caffè
        { name: 'Acqua', quantity: 300, unit: 'ml' },
        { name: 'Eritritolo', quantity: 45, unit: 'g' },
        { name: 'Neutro per Gelati SaporePuro', quantity: 1.5, unit: 'g' },
        { name: 'Panna da montare', quantity: 50, unit: 'ml' },
      ]),
      steps: JSON.stringify([
        { stepNumber: 1, instruction: 'Esegui un\'estrazione a filtro calda per ottenere 300ml di caffè americano caldo.', tempMin: 80, tempMax: 85 },
        { stepNumber: 2, instruction: 'Sciogli l\'eritritolo e 1.5g di Neutro direttamente nel caffè bollente frullando bene col mixer.', tempMin: null, tempMax: null },
        { stepNumber: 3, instruction: 'Lascia raffreddare la miscela a temperatura ambiente e poi versala nella pinta.', tempMin: null, tempMax: null },
        { stepNumber: 4, instruction: 'Congela in freezer per 24 ore.', tempMin: null, tempMax: null },
        { stepNumber: 5, instruction: 'Mantechi la granita utilizzando il programma "Granita" sulla Moulinex Dolci.', tempMin: null, tempMax: null },
        { stepNumber: 6, instruction: 'Servi la granita in un bicchiere con una generosa guarnizione di panna montata.', tempMin: null, tempMax: null },
      ]),
      hasMixIn: false,
      mixInInstructions: null,
    },
    {
      title: 'Gelato alla Mandorla Siciliano',
      category: 'Gelato',
      description: 'Gelato proteico e ricco con pasta pura di mandorle, yogurt greco e whey vaniglia.',
      programUsed: 'Gelato',
      ingredients: JSON.stringify([
        { name: 'Pasta Pura di Mandorle 100%', quantity: 80, unit: 'g' },
        { name: 'Yogurt Greco 0% Bianco', quantity: 200, unit: 'g' },
        { name: 'Latte fresco parzialmente scremato', quantity: 150, unit: 'ml' },
        { name: 'Impact Whey Protein (Vaniglia)', quantity: 20, unit: 'g' },
        { name: 'Eritritolo', quantity: 35, unit: 'g' },
        { name: 'Neutro per Gelati SaporePuro', quantity: 2.5, unit: 'g' },
      ]),
      steps: JSON.stringify([
        { stepNumber: 1, instruction: 'Miscela a secco il Neutro SaporePuro e l\'eritritolo.', tempMin: null, tempMax: null },
        { stepNumber: 2, instruction: 'Scalda 50ml di latte a 80-85°C e sciogli la miscela di neutro ed eritritolo frullando col mixer.', tempMin: 80, tempMax: 85 },
        { stepNumber: 3, instruction: 'In una ciotola capiente, diluisci la pasta pura di mandorle con il restante latte freddo (100ml) un po\' alla volta per emulsionarla bene.', tempMin: null, tempMax: null },
        { stepNumber: 4, instruction: 'Unisci lo yogurt greco 0%, le Impact Whey vaniglia, lo sciroppo di neutro caldo e la pasta di mandorla diluita nel bicchiere del frullatore.', tempMin: null, tempMax: null },
        { stepNumber: 5, instruction: 'Frulla vigorosamente per ottenere un composto liscio e vellutato.', tempMin: null, tempMax: null },
        { stepNumber: 6, instruction: 'Versa nella pinta e posizionala in freezer per 24 ore.', tempMin: null, tempMax: null },
        { stepNumber: 7, instruction: 'Mantechi col programma "Gelato" sulla Moulinex Dolci.', tempMin: null, tempMax: null },
      ]),
      hasMixIn: false,
      mixInInstructions: null,
    },
  ];

  const recipes = await Promise.all(
    recipesData.map((rec) => prisma.recipe.create({ data: rec }))
  );

  console.log(`Inserite ${recipes.length} ricette nel database.`);

  console.log('Seed del database completato con successo!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

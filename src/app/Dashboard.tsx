'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Snowflake, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Play, 
  RotateCw, 
  CheckSquare, 
  ChevronRight, 
  Clock, 
  TrendingUp, 
  Coffee, 
  Heart, 
  Save,
  HelpCircle,
  Package
} from 'lucide-react';
import { 
  getKitchenData, 
  updateIngredientQuantity, 
  addPintToFreezer, 
  spinPint, 
  deleteTracker,
  IngredientMeasure,
  StepInstruction
} from './actions';

// Mappatura colori per categoria di ricetta
const categoryStyles: Record<string, { bg: string; text: string; border: string; accent: string; iconBg: string }> = {
  'Gelato': { 
    bg: 'bg-amber-50/80', 
    text: 'text-amber-900', 
    border: 'border-amber-200', 
    accent: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100'
  },
  'Sorbetto': { 
    bg: 'bg-cyan-50/80', 
    text: 'text-cyan-900', 
    border: 'border-cyan-200', 
    accent: 'from-cyan-400 to-teal-500',
    iconBg: 'bg-cyan-100'
  },
  'Granita': { 
    bg: 'bg-indigo-50/80', 
    text: 'text-indigo-900', 
    border: 'border-indigo-200', 
    accent: 'from-indigo-500 to-purple-500',
    iconBg: 'bg-indigo-100'
  },
  'NiceCream': { 
    bg: 'bg-yellow-50/80', 
    text: 'text-yellow-900', 
    border: 'border-yellow-200', 
    accent: 'from-yellow-400 to-amber-500',
    iconBg: 'bg-yellow-100'
  }
};

// Valori nutrizionali e calorie indicativi per ricetta
const recipeMacros: Record<string, { protein: string; kcal: string }> = {
  'Cioccolato Fit Protein': { protein: '28g', kcal: '240' },
  'Malaga Fit (Marsala & Uvetta)': { protein: '18g', kcal: '290' },
  'Crema Caffè Russell-Moulinex': { protein: '32g', kcal: '260' },
  'Sorbetto alla Pesca Matura': { protein: '2g', kcal: '140' },
  'Sorbetto ai Frutti di Bosco "Sanificato"': { protein: '3g', kcal: '150' },
  'Nice Cream Choco-Banana Istantaneo': { protein: '6g', kcal: '230' },
  'Granita Siciliana al Caffè (con Panna)': { protein: '4g', kcal: '180' },
  'Gelato alla Mandorla Siciliano': { protein: '24g', kcal: '380' },
};

interface DashboardProps {
  initialData: Awaited<ReturnType<typeof getKitchenData>>;
}

export default function Dashboard({ initialData }: DashboardProps) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<'recipes' | 'freezer' | 'pantry' | 'trouble'>('recipes');
  
  // Ricetta selezionata per la preparazione passo-passo
  const [selectedRecipe, setSelectedRecipe] = useState<typeof data.recipes[0] | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  
  // Input per nuova pinta nel freezer tracker
  const [newPintName, setNewPintName] = useState('');
  const [selectedRecipeForTracker, setSelectedRecipeForTracker] = useState(data.recipes[0]?.id || '');
  const [isSubmittingPint, setIsSubmittingPint] = useState(false);
  const [pintMessage, setPintMessage] = useState({ text: '', type: '' });

  // Stato per aggiornamento dispensa
  const [updatingIngId, setUpdatingIngId] = useState<string | null>(null);
  const [tempQuantities, setTempQuantities] = useState<Record<string, number>>({});

  // Countdown timers in real time
  const [nowTime, setNowTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Ricarica i dati dal database
  const refreshData = async () => {
    const fresh = await getKitchenData();
    setData(fresh);
  };

  // Salva quantità ingrediente
  const handleUpdateQuantity = async (id: string, qty: number) => {
    setUpdatingIngId(id);
    try {
      await updateIngredientQuantity(id, qty);
      await refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingIngId(null);
    }
  };

  // Registra una pinta nel Freezer Tracker
  const handleAddPint = async (e?: React.FormEvent, customRecipeId?: string, customPintName?: string) => {
    if (e) e.preventDefault();
    
    const rId = customRecipeId || selectedRecipeForTracker;
    const name = customPintName || newPintName;

    if (!name.trim()) {
      setPintMessage({ text: 'Inserisci un nome per la pinta!', type: 'error' });
      return;
    }

    setIsSubmittingPint(true);
    setPintMessage({ text: '', type: '' });

    try {
      await addPintToFreezer(rId, name);
      setPintMessage({ text: 'Pinta posizionata in freezer con successo! Il countdown di 24 ore è attivo.', type: 'success' });
      setNewPintName('');
      await refreshData();
      
      // Rimuovi messaggio dopo 4 secondi
      setTimeout(() => {
        setPintMessage({ text: '', type: '' });
      }, 4000);
    } catch (err: any) {
      setPintMessage({ text: err.message || 'Errore durante l\'inserimento.', type: 'error' });
    } finally {
      setIsSubmittingPint(false);
    }
  };

  // Segna come spinnato
  const handleSpinPint = async (id: string) => {
    try {
      await spinPint(id);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Rimuovi pinta dal freezer
  const handleDeleteTracker = async (id: string) => {
    try {
      await deleteTracker(id);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Controlla se gli ingredienti di una ricetta sono disponibili in dispensa
  const checkRecipeAvailability = (recipe: typeof data.recipes[0]) => {
    const warnings: string[] = [];
    let isFullyAvailable = true;

    recipe.ingredients.forEach((reqIng) => {
      // Cerca corrispondenza parziale per nome dell'ingrediente
      const match = data.ingredients.find(
        (pantry) => pantry.name.toLowerCase().includes(reqIng.name.toLowerCase().split(' (')[0])
      );

      if (!match) {
        if (reqIng.name.toLowerCase() !== 'acqua') {
          warnings.push(`${reqIng.name} non presente in dispensa`);
          isFullyAvailable = false;
        }
      } else if (match.quantity < reqIng.quantity) {
        warnings.push(`${reqIng.name} insufficiente (${match.quantity}${match.unit} di ${reqIng.quantity}${reqIng.unit} richiesti)`);
        if (match.isCritical) {
          isFullyAvailable = false;
        }
      }
    });

    return { isFullyAvailable, warnings };
  };

  // Calcola i dettagli del timer per ciascun tracker
  const getTimerDetails = (tracker: typeof data.trackers[0]) => {
    const readyTime = new Date(tracker.readyAt).getTime();
    const startTime = new Date(tracker.createdAt).getTime();
    const nowMs = nowTime.getTime();

    const totalDuration = readyTime - startTime;
    const timePassed = nowMs - startTime;
    const timeRemaining = readyTime - nowMs;

    const percentage = Math.min(100, Math.max(0, (timePassed / totalDuration) * 100));
    const isReady = timeRemaining <= 0;

    let countdownStr = '00:00:00';
    if (!isReady && timeRemaining > 0) {
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      countdownStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return { percentage, isReady, countdownStr };
  };

  // Calcola quanti ingredienti in dispensa sono in esaurimento (isCritical = true e quantità vicino allo zero)
  const criticalItemsCount = data.ingredients.filter(ing => ing.isCritical && ing.quantity <= 10).length;

  // Calcola quante pinte sono pronte per lo spin
  const readyPintsCount = data.trackers.filter(tr => {
    const readyTime = new Date(tr.readyAt).getTime();
    return readyTime <= nowTime.getTime() && !tr.isSpun;
  }).length;

  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full bg-white shadow-2xl min-h-screen relative overflow-hidden pb-12">
      
      {/* HEADER DELLA SPLENDIDA DASHBOARD */}
      <header className="bg-slate-brand-dark text-white px-5 py-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-accent/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-lime-accent/10 rounded-full blur-xl"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h1 className="font-title text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="text-lime-accent font-extrabold text-3xl">Fit</span> Gelato
            </h1>
            <p className="text-xs text-slate-300 font-sans tracking-wide mt-1">
              Moulinex Dolci × Russell Hobbs Masterclass
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-brand/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-accent animate-pulse"></span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-lime-accent">Cucina Attiva</span>
          </div>
        </div>

        {/* STATUS HARDWARE RAPIDO */}
        <div className="mt-6 bg-slate-brand/50 backdrop-blur-lg border border-slate-700/30 rounded-2xl p-4 relative z-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-accent mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Dotazione Hardware in Possesso
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-brand-dark/50 p-2.5 rounded-xl border border-slate-700/20 flex flex-col justify-between">
              <div>
                <span className="font-semibold text-white block truncate">Moulinex Dolci</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Tecnologia Perfector</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="px-1 text-[8px] bg-purple-accent/20 text-purple-accent rounded">1-Step</span>
                <span className="px-1 text-[8px] bg-lime-accent/20 text-lime-accent rounded">MIX</span>
                <span className="px-1 text-[8px] bg-slate-700 text-slate-300 rounded">Re-spin</span>
              </div>
            </div>
            
            <div className="bg-slate-brand-dark/50 p-2.5 rounded-xl border border-slate-700/20 flex flex-col justify-between">
              <div>
                <span className="font-semibold text-white block truncate">Russell Hobbs Adventure</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Caffè Filtro (85°C)</span>
              </div>
              <div className="mt-2">
                <span className="px-1.5 py-0.5 text-[8px] bg-orange-accent/20 text-orange-accent rounded font-medium">Estrazione Neutri</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TABS DI NAVIGAZIONE A FONDO ARROTONDATO (GLASSMORPHISM) */}
      <nav className="px-4 mt-5">
        <div className="bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl flex justify-between border border-slate-200/50">
          <button 
            onClick={() => { setActiveTab('recipes'); setSelectedRecipe(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'recipes' ? 'bg-white text-slate-brand-dark shadow-md scale-105' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <BookOpen className="w-4 h-4 text-purple-accent" />
            Ricette
          </button>
          
          <button 
            onClick={() => { setActiveTab('freezer'); setSelectedRecipe(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all duration-300 relative ${activeTab === 'freezer' ? 'bg-white text-slate-brand-dark shadow-md scale-105' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {readyPintsCount > 0 && (
              <span className="absolute top-1 right-3 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-accent"></span>
              </span>
            )}
            <Snowflake className="w-4 h-4 text-cyan-500" />
            Freezer
          </button>
          
          <button 
            onClick={() => { setActiveTab('pantry'); setSelectedRecipe(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all duration-300 relative ${activeTab === 'pantry' ? 'bg-white text-slate-brand-dark shadow-md scale-105' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {criticalItemsCount > 0 && (
              <span className="absolute top-1 right-3 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-accent"></span>
              </span>
            )}
            <Package className="w-4 h-4 text-amber-500" />
            Dispensa
          </button>
          
          <button 
            onClick={() => { setActiveTab('trouble'); setSelectedRecipe(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'trouble' ? 'bg-white text-slate-brand-dark shadow-md scale-105' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <HelpCircle className="w-4 h-4 text-orange-accent" />
            Spin & Tips
          </button>
        </div>
      </nav>

      {/* CONTENUTO PRINCIPALE TAB */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        
        {/* MESSAGGI DI NOTIFICA RAPIDI */}
        {pintMessage.text && (
          <div className={`mb-4 p-3.5 rounded-2xl text-xs font-medium border flex items-start gap-2.5 animate-fadeIn ${
            pintMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <span className="text-lg">{pintMessage.type === 'success' ? '✨' : '⚠️'}</span>
            <p>{pintMessage.text}</p>
          </div>
        )}

        {/* -------------------- TAB 1: RICETTE -------------------- */}
        {activeTab === 'recipes' && !selectedRecipe && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-title text-lg font-bold text-slate-brand-dark">Il Socio Ricettario Fit</h2>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">8 Ricette Integrate</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {data.recipes.map((recipe) => {
                const styles = categoryStyles[recipe.category] || categoryStyles['Gelato'];
                const macros = recipeMacros[recipe.title] || { protein: '15g', kcal: '200' };
                const { isFullyAvailable, warnings } = checkRecipeAvailability(recipe);

                return (
                  <div 
                    key={recipe.id}
                    onClick={() => { setSelectedRecipe(recipe); setCompletedSteps({}); }}
                    className={`group relative overflow-hidden rounded-3xl border ${styles.border} ${styles.bg} p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between`}
                  >
                    <div>
                      {/* HEADER CARD RICETTA */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            recipe.category === 'Sorbetto' ? 'bg-cyan-100 text-cyan-800' :
                            recipe.category === 'Granita' ? 'bg-indigo-100 text-indigo-800' :
                            recipe.category === 'NiceCream' ? 'bg-yellow-100 text-yellow-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {recipe.category}
                          </span>
                          
                          {/* Program badge */}
                          <span className="text-[9px] bg-slate-800 text-white px-2 py-0.5 rounded font-mono">
                            {recipe.programUsed}
                          </span>
                        </div>

                        {/* PROTEIN BADGE */}
                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-0.5 rounded-full border border-slate-200/50 shadow-xs">
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-bold text-slate-800">{macros.protein} PRO</span>
                        </div>
                      </div>

                      {/* TITOLO E DESCRIZIONE */}
                      <h3 className="font-title text-base font-bold text-slate-brand-dark mt-2.5 group-hover:text-purple-accent transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>

                    {/* PIE DI CARD: INGREDIENTI DISPONIBILI O AVVISI */}
                    <div className="mt-4 pt-3 border-t border-slate-200/30 flex justify-between items-center text-xs">
                      {isFullyAvailable ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 bg-emerald-100 rounded-full p-0.5" /> Ingredienti pronti
                        </span>
                      ) : (
                        <span className="text-orange-700 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> 
                          {warnings.length === 1 ? '1 ingrediente mancante' : `${warnings.length} ingredienti mancanti`}
                        </span>
                      )}
                      
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                        Dettagli ricetta <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* -------------------- TAB 1.1: DETTAGLIO RICETTA (STEP-BY-STEP) -------------------- */}
        {activeTab === 'recipes' && selectedRecipe && (
          <div className="space-y-5 animate-slideUp">
            {/* INTESTAZIONE DETTAGLIO */}
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-all"
              >
                ← Torna alle Ricette
              </button>
              <span className="text-[10px] uppercase font-bold text-slate-400">Guida Passo-Passo</span>
            </div>

            {/* CARD DI RIEPILOGO RICETTA */}
            <div className="bg-slate-brand-dark text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-accent/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold bg-lime-accent text-slate-brand-dark">
                  {selectedRecipe.category}
                </span>
                <h2 className="font-title text-xl font-bold text-white mt-1.5">{selectedRecipe.title}</h2>
                <p className="text-xs text-slate-300 mt-1">{selectedRecipe.description}</p>
                
                {/* Valori nutrizionali rapidi */}
                <div className="flex gap-4 mt-4 text-xs font-medium border-t border-slate-700/40 pt-3">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Proteine totali</span>
                    <span className="text-lime-accent font-bold text-sm">{recipeMacros[selectedRecipe.title]?.protein || '18g'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Calorie circa</span>
                    <span className="text-orange-accent font-bold text-sm">{recipeMacros[selectedRecipe.title]?.kcal || '240'} kcal</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Programma Moulinex</span>
                    <span className="text-purple-accent font-bold text-sm">{selectedRecipe.programUsed}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* INGREDIENTI RICHIESTI */}
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/50">
              <h3 className="font-title text-sm font-bold text-slate-brand-dark mb-3 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-purple-accent" /> Ingredienti per 1 Vaschetta (Pinta)
              </h3>
              
              <ul className="space-y-2 text-xs">
                {selectedRecipe.ingredients.map((ing, idx) => {
                  const match = data.ingredients.find(
                    (pantry) => pantry.name.toLowerCase().includes(ing.name.toLowerCase().split(' (')[0])
                  );
                  const isAvailable = ing.name.toLowerCase() === 'acqua' || (match && match.quantity >= ing.quantity);
                  
                  return (
                    <li key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-200/30">
                      <span className="text-slate-800 font-medium">{ing.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-white border px-2 py-0.5 rounded font-semibold text-slate-700">
                          {ing.quantity}{ing.unit}
                        </span>
                        {isAvailable ? (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Disp.</span>
                        ) : (
                          <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium">Scarso</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* STEPS GUIDA INTERATTIVA */}
            <div className="space-y-4">
              <h3 className="font-title text-sm font-bold text-slate-brand-dark flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-lime-accent" /> Procedimento di Chimica del Gelo
              </h3>

              <div className="relative border-l-2 border-slate-200 ml-3.5 pl-5 space-y-6 py-1">
                {selectedRecipe.steps.map((step) => {
                  const isCompleted = !!completedSteps[step.stepNumber];
                  const hasTemp = step.tempMin !== null;

                  return (
                    <div key={step.stepNumber} className="relative">
                      {/* Pallino indicatore step */}
                      <button
                        onClick={() => setCompletedSteps(prev => ({ ...prev, [step.stepNumber]: !prev[step.stepNumber] }))}
                        className={`absolute -left-[27px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-bold transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' 
                            : 'bg-white border-slate-300 text-slate-600 hover:border-purple-accent'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3 h-3" /> : step.stepNumber}
                      </button>

                      {/* Contenuto dello step */}
                      <div className={`text-xs transition-colors duration-300 ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        <p className="leading-relaxed font-medium">{step.instruction}</p>
                        
                        {/* Box temperature di attivazione se presenti */}
                        {hasTemp && (
                          <div className="mt-2 inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-800 px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                            Temperatura critica: {step.tempMin}°C - {step.tempMax}°C (Richiede Russell Hobbs Adventure)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEZIONE SPECIALE MIX-IN / COMPILAZIONE */}
            {selectedRecipe.hasMixIn && selectedRecipe.mixInInstructions && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-4.5 text-xs text-amber-900">
                <h4 className="font-bold flex items-center gap-1 mb-1 text-amber-900">
                  ⚡ Guida Cruciale Mix-In del Socio:
                </h4>
                <p className="leading-relaxed">{selectedRecipe.mixInInstructions}</p>
              </div>
            )}

            {/* AZIONI DI RICETTA */}
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              {selectedRecipe.category !== 'NiceCream' ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Avvia il freezer tracker per questa ricetta:</h4>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="es. Pinta 1 - Málaga"
                      value={newPintName}
                      onChange={(e) => setNewPintName(e.target.value)}
                      className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-accent"
                    />
                    <button
                      onClick={() => handleAddPint(undefined, selectedRecipe.id, newPintName)}
                      disabled={isSubmittingPint}
                      className="bg-purple-accent hover:bg-purple-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
                    >
                      <Snowflake className="w-3.5 h-3.5" /> Metti in Freezer (24h)
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleAddPint(undefined, selectedRecipe.id, `Istantanea ${selectedRecipe.title}`)}
                  disabled={isSubmittingPint}
                  className="w-full bg-lime-accent hover:bg-lime-400 text-slate-brand-dark font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5" /> Emulsiona Istantaneamente col programma MIX!
                </button>
              )}

              <button 
                onClick={() => setSelectedRecipe(null)}
                className="w-full text-center text-xs font-semibold text-slate-500 py-2 hover:text-slate-800"
              >
                Torna all'elenco delle ricette
              </button>
            </div>
          </div>
        )}

        {/* -------------------- TAB 2: FREEZER TRACKER (SMART countdown) -------------------- */}
        {activeTab === 'freezer' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-title text-lg font-bold text-slate-brand-dark">Freezer Tracker Attivo</h2>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2.5 py-1 rounded-full font-medium">Countdown 24 Ore</span>
            </div>

            {/* CARD NUOVA PINTA RAPIDA */}
            <form onSubmit={handleAddPint} className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5 space-y-3.5">
              <h3 className="font-title text-xs font-bold text-slate-700 uppercase tracking-wider">Registra una Nuova Pinta in Freezer</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Ricetta</label>
                  <select 
                    value={selectedRecipeForTracker}
                    onChange={(e) => setSelectedRecipeForTracker(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-accent bg-white"
                  >
                    {data.recipes.map((rec) => (
                      <option key={rec.id} value={rec.id}>{rec.title} ({rec.category})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Etichetta Pinta</label>
                  <input 
                    type="text" 
                    placeholder="es. Málaga Fit in Pinta 1"
                    value={newPintName}
                    onChange={(e) => setNewPintName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-accent"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmittingPint}
                  className="w-full bg-slate-brand-dark hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all mt-1"
                >
                  <Plus className="w-4 h-4 text-lime-accent" /> Posiziona nel Congelatore
                </button>
              </div>
            </form>

            {/* LISTA DELLE PINTE ATTIVE */}
            <div className="space-y-4">
              <h3 className="font-title text-sm font-bold text-slate-brand-dark">Pinte Attualmente in Freezer</h3>

              {data.trackers.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-300 rounded-3xl text-slate-400">
                  <Snowflake className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                  <p className="text-xs">Nessuna pinta registrata in congelamento al momento.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Registra una pinta per attivare il timer di 24 ore.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {data.trackers.map((tracker) => {
                    const { percentage, isReady, countdownStr } = getTimerDetails(tracker);
                    const styles = categoryStyles[tracker.recipe.category] || categoryStyles['Gelato'];

                    return (
                      <div 
                        key={tracker.id} 
                        className={`border rounded-3xl p-4 shadow-xs relative overflow-hidden bg-white ${
                          tracker.isSpun ? 'opacity-65' : ''
                        }`}
                      >
                        {/* Overlay colore categoria */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${
                          tracker.recipe.category === 'Sorbetto' ? 'bg-cyan-400' :
                          tracker.recipe.category === 'Granita' ? 'bg-indigo-400' :
                          tracker.recipe.category === 'NiceCream' ? 'bg-yellow-400' : 'bg-amber-400'
                        }`}></div>

                        <div className="flex justify-between items-start pl-2">
                          <div className="flex-1 min-w-0 pr-4">
                            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                              {tracker.recipe.title}
                            </span>
                            <h4 className="font-title text-sm font-bold text-slate-brand-dark truncate mt-0.5">
                              {tracker.pintaName}
                            </h4>
                            
                            {/* Data di inserimento */}
                            <span className="text-[9px] text-slate-500 block mt-1 font-mono">
                              Inserito: {new Date(tracker.createdAt).toLocaleDateString('it-IT')} ore {new Date(tracker.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {/* CIRCOLINO DEL TIMER ANIMATO */}
                          <div className="flex flex-col items-center gap-1">
                            {!tracker.isSpun ? (
                              <div className="relative w-14 h-14">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                  <path
                                    className="text-slate-100"
                                    strokeWidth="3.5"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                  <path
                                    className={`${
                                      isReady ? 'text-lime-accent' : 'text-cyan-400'
                                    } transition-all duration-1000`}
                                    strokeDasharray={`${percentage}, 100`}
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-slate-700">
                                  {Math.round(percentage)}%
                                </div>
                              </div>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 p-2 rounded-full">
                                <Check className="w-5 h-5" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* RIGA DEL PROGRESSO / COUNTDOWN */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center pl-2 text-xs">
                          <div>
                            {tracker.isSpun ? (
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg">Spinnato & Consumato</span>
                            ) : isReady ? (
                              <span className="text-emerald-700 font-extrabold bg-lime-accent/80 px-2.5 py-1 rounded-lg animate-pulse flex items-center gap-1">
                                ⚡ Pronto per lo Spin!
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5 font-semibold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-lg">
                                <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> 
                                <span className="font-mono">{countdownStr}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {!tracker.isSpun && (
                              <button 
                                onClick={() => handleSpinPint(tracker.id)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all ${
                                  isReady 
                                    ? 'bg-purple-accent text-white hover:bg-purple-600' 
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                Avvia Spin
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteTracker(tracker.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-full transition-colors"
                              title="Rimuovi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------- TAB 3: DISPENSA & PANTRY -------------------- */}
        {activeTab === 'pantry' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-title text-lg font-bold text-slate-brand-dark">La Mia Dispensa Fit</h2>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium">Stato Ingredienti</span>
            </div>

            {/* ALERT CRITICO */}
            {criticalItemsCount > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-3xl p-4.5 text-xs text-orange-950 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-orange-900">Attenzione: Ingredienti Critici in Esaurimento!</h4>
                  <p className="mt-1 leading-relaxed">
                    Alcuni ingredienti necessari per le ricette base (come il Neutro per Gelati o le Impact Whey) sono sotto la soglia minima. Aggiorna le scorte per non bloccare le preparazioni.
                  </p>
                </div>
              </div>
            )}

            {/* ELENCO DEGLI INGREDIENTI IN DISPENSA */}
            <div className="bg-white border rounded-3xl overflow-hidden shadow-xs">
              <div className="bg-slate-50 px-4.5 py-3 border-b text-[10px] font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                <span>Ingrediente</span>
                <span className="pr-12 text-right">Quantità Disponibile</span>
              </div>

              <div className="divide-y divide-slate-100">
                {data.ingredients.map((ing) => {
                  // Controlla se la quantità è critica (es. <= 10 per g/ml)
                  const isLow = ing.isCritical && ing.quantity <= 10;
                  // Inizializza stato quantità temporanea se non presente
                  const currentTempQty = tempQuantities[ing.id] !== undefined ? tempQuantities[ing.id] : ing.quantity;

                  return (
                    <div key={ing.id} className={`p-4 flex items-center justify-between transition-colors ${
                      isLow ? 'bg-orange-50/30' : 'hover:bg-slate-50/50'
                    }`}>
                      <div className="min-w-0 flex-1 mr-3">
                        <span className={`font-semibold text-xs text-slate-800 block ${isLow ? 'text-orange-900 font-bold' : ''}`}>
                          {ing.name}
                        </span>
                        <div className="flex gap-2.5 mt-1 items-center">
                          {ing.isCritical && (
                            <span className="text-[8px] uppercase tracking-wider font-extrabold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                              Critico
                            </span>
                          )}
                          <span className="text-[9px] text-slate-400">Unità: {ing.unit}</span>
                        </div>
                      </div>

                      {/* CONTROLLO QUANTITA RAPIDO */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-300 rounded-xl bg-white p-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              const newQty = Math.max(0, currentTempQty - 10);
                              setTempQuantities(prev => ({ ...prev, [ing.id]: newQty }));
                              handleUpdateQuantity(ing.id, newQty);
                            }}
                            className="w-7 h-7 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          
                          <input 
                            type="number"
                            value={currentTempQty}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setTempQuantities(prev => ({ ...prev, [ing.id]: val }));
                            }}
                            onBlur={() => {
                              handleUpdateQuantity(ing.id, currentTempQty);
                            }}
                            className="w-12 text-center text-xs font-semibold font-mono focus:outline-none"
                          />
                          
                          <button
                            type="button"
                            onClick={() => {
                              const newQty = currentTempQty + 10;
                              setTempQuantities(prev => ({ ...prev, [ing.id]: newQty }));
                              handleUpdateQuantity(ing.id, newQty);
                            }}
                            className="w-7 h-7 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Bottone Salva se c'è differenza */}
                        {currentTempQty !== ing.quantity && (
                          <button
                            onClick={() => handleUpdateQuantity(ing.id, currentTempQty)}
                            disabled={updatingIngId === ing.id}
                            className="p-2 rounded-xl bg-purple-accent text-white hover:bg-purple-600 shadow-sm transition-all"
                            title="Salva"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 4: TROUBLESHOOTING & SPIN TIPS -------------------- */}
        {activeTab === 'trouble' && (
          <div className="space-y-5 animate-slideUp">
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-title text-lg font-bold text-slate-brand-dark">Spin & Troubleshooting</h2>
              <span className="text-[10px] bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full font-medium">Guida Risoluzione Problemi</span>
            </div>

            {/* SEZIONE GUIDA MALAGA */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-3 shadow-xs">
              <h3 className="font-title text-sm font-bold text-amber-900 flex items-center gap-1.5">
                🍇 Málaga e il Mix-In dell'Uvetta
              </h3>
              
              <div className="text-xs text-amber-950 space-y-2.5 leading-relaxed">
                <p>
                  Per un gelato al gusto Málaga impeccabile ed evitare di spappolare le uvette durante la mantecazione, il Socio consiglia la tecnica dello <strong>Shock Termico</strong>:
                </p>
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li>
                    Ammolla le uvette nel Marsala per almeno 4 ore.
                  </li>
                  <li>
                    Scolale benissimo per rimuovere l'alcol in eccesso (l'alcol abbassa il punto di congelamento e renderebbe il gelato troppo molle).
                  </li>
                  <li>
                    <strong>Metti le uvette su un piattino nel freezer per 20 minuti</strong> prima di inserirle nella macchina. Devono essere gelide ma non incollate in un blocco unico.
                  </li>
                  <li>
                    Esegui lo spin del gelato, rimuovi la pinta, scava un foro largo 3cm al centro arrivando fino in fondo, versa le uvette ghiacciate e avvia il programma <strong>MIX</strong>.
                  </li>
                </ol>
              </div>
            </div>

            {/* TROUBLESHOOTING PILLS */}
            <div className="space-y-4">
              <h3 className="font-title text-sm font-bold text-slate-brand-dark">Pillole di Risoluzione del Socio</h3>
              
              <div className="space-y-3">
                <div className="bg-white border rounded-3xl p-4.5 shadow-xs">
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Texture Sabbiosa o Cristalli di Ghiaccio?</span>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    <strong>Causa:</strong> Idratazione incompleta del Neutro per Gelati o mancanza di solidi magri del latte.
                  </p>
                  <p className="text-xs text-slate-800 font-semibold mt-1">
                    💡 Soluzione: Attiva sempre il Neutro SaporePuro in liquidi caldi a 75°C-85°C frullando col mixer a immersione per formare il gel protettivo. Integra un cucchiaino di latte scremato in polvere.
                  </p>
                </div>

                <div className="bg-white border rounded-3xl p-4.5 shadow-xs">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Gelato farinoso, sbriciolato o asciutto dopo lo spin?</span>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    <strong>Causa:</strong> La temperatura del freezer è troppo bassa (es. -22°C) e il blocco è eccessivamente duro per le lame.
                  </p>
                  <p className="text-xs text-slate-800 font-semibold mt-1">
                    💡 Soluzione: Aggiungi un cucchiaino di latte fresco parzialmente scremato al centro della pinta e lancia il programma <strong>Re-spin</strong>. Ottieni subito una consistenza liscissima.
                  </p>
                </div>

                <div className="bg-white border rounded-3xl p-4.5 shadow-xs">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Gelato troppo molle, non si solidifica?</span>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    <strong>Causa:</strong> Eccesso di zuccheri o di alcol (ad esempio troppo Marsala nella ricetta Málaga).
                  </p>
                  <p className="text-xs text-slate-800 font-semibold mt-1">
                    💡 Soluzione: Rispetta rigorosamente la dose di 30ml di Marsala per la ricetta base. L'alcol abbassa il punto di congelamento dell'acqua libera; esagerare impedirà la corretta cristallizzazione della miscela.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER DELICATO */}
      <footer className="absolute bottom-0 inset-x-0 h-10 bg-slate-50 border-t flex items-center justify-center text-[10px] text-slate-400">
        Gelateria Socio Fit v1.0 • Fatto con Antigravity & ❤️
      </footer>

    </div>
  );
}

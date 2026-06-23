import { getKitchenData } from './actions';
import Dashboard from './Dashboard';

// Forza Next.js a caricare i dati a ogni richiesta per riflettere le modifiche al database
export const dynamic = 'force-dynamic';

export default async function Home() {
  const initialData = await getKitchenData();
  
  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Dashboard initialData={initialData} />
    </div>
  );
}

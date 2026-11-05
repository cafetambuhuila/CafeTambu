import Checkout from "@/components/Checkout"
import { supabase } from "@/lib/supabase"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: settings } = await supabase.from('settings').select('*').single()
  const companyName = settings?.company_name || 'Café Artesanal La Sierra'
  const logoUrl = settings?.logo_url

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-amber-900 text-white py-6 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
          {logoUrl && <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain bg-white p-1 rounded" />}
          <div>
            <h1 className="text-3xl font-bold">{companyName}</h1>
            <p className="opacity-90">Los mejores granos empacados y productos relacionados</p>
          </div>
        </div>
      </header>
      
      <div className="py-8">
        <Checkout />
      </div>
    </main>
  )
}

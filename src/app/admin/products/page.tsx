import { supabase } from "@/lib/supabase"
import ProductsClient from "./ProductsClient"

export const dynamic = 'force-dynamic'

export default async function AdminProducts() {
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  
  return (
    <ProductsClient initialProducts={products || []} />
  )
}

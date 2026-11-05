import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Check if settings exist, then update or insert
    const { data: existingSettings } = await supabase.from('settings').select('id').single()
    
    if (existingSettings) {
      const { error } = await supabase.from('settings').update(data).eq('id', existingSettings.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('settings').insert([data])
      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 })
  }
}

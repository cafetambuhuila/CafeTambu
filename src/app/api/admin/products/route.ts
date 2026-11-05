import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { error } = await supabase.from('products').insert([data])
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data
    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 })

    const { error } = await supabase.from('products').update(updateData).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 })

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 })
  }
}

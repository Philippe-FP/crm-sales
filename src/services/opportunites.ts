import { supabase } from './supabase'
import type { Opportunite, OpportuniteInsert, OpportuniteUpdate } from '../types'

export async function getOpportunites(): Promise<Opportunite[]> {
  const { data, error } = await supabase
    .from('opportunites')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOpportuniteById(id: string): Promise<Opportunite> {
  const { data, error } = await supabase
    .from('opportunites')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getOpportunitesByEntreprise(entrepriseId: string): Promise<Opportunite[]> {
  const { data, error } = await supabase
    .from('opportunites')
    .select('*')
    .eq('entreprise_id', entrepriseId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOpportunitesByContact(contactId: string): Promise<Opportunite[]> {
  const { data, error } = await supabase
    .from('opportunites')
    .select('*')
    .eq('contact_principal_id', contactId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createOpportunite(opportunite: OpportuniteInsert): Promise<Opportunite> {
  const { data, error } = await supabase
    .from('opportunites')
    .insert(opportunite)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateOpportunite(id: string, updates: OpportuniteUpdate): Promise<Opportunite> {
  const { data, error } = await supabase
    .from('opportunites')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteOpportunite(id: string): Promise<void> {
  const { error } = await supabase
    .from('opportunites')
    .delete()
    .eq('id', id)
  if (error) throw error
}

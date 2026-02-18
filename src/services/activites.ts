import { supabase } from './supabase'
import type { Activite, ActiviteInsert, ActiviteUpdate } from '../types'

export async function getActivites(): Promise<Activite[]> {
  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .order('date_echeance', { ascending: true })
  if (error) throw error
  return data
}

export async function getActiviteById(id: string): Promise<Activite> {
  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getActivitesByEntreprise(entrepriseId: string): Promise<Activite[]> {
  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .eq('entreprise_id', entrepriseId)
    .order('date_echeance', { ascending: true })
  if (error) throw error
  return data
}

export async function getActivitesByContact(contactId: string): Promise<Activite[]> {
  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .eq('contact_id', contactId)
    .order('date_echeance', { ascending: true })
  if (error) throw error
  return data
}

export async function getActivitesByOpportunite(opportuniteId: string): Promise<Activite[]> {
  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .eq('opportunite_id', opportuniteId)
    .order('date_echeance', { ascending: true })
  if (error) throw error
  return data
}

export async function createActivite(activite: ActiviteInsert): Promise<Activite> {
  const { data, error } = await supabase
    .from('activites')
    .insert(activite)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateActivite(id: string, updates: ActiviteUpdate): Promise<Activite> {
  const { data, error } = await supabase
    .from('activites')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteActivite(id: string): Promise<void> {
  const { error } = await supabase
    .from('activites')
    .delete()
    .eq('id', id)
  if (error) throw error
}

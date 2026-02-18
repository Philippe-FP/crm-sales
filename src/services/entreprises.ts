import { supabase } from './supabase'
import type { Entreprise, EntrepriseInsert, EntrepriseUpdate } from '../types'

export async function getEntreprises(): Promise<Entreprise[]> {
  const { data, error } = await supabase
    .from('entreprises')
    .select('*')
    .order('nom')
  if (error) throw error
  return data
}

export async function getEntrepriseById(id: string): Promise<Entreprise> {
  const { data, error } = await supabase
    .from('entreprises')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createEntreprise(entreprise: EntrepriseInsert): Promise<Entreprise> {
  const { data, error } = await supabase
    .from('entreprises')
    .insert(entreprise)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateEntreprise(id: string, updates: EntrepriseUpdate): Promise<Entreprise> {
  const { data, error } = await supabase
    .from('entreprises')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteEntreprise(id: string): Promise<void> {
  const { error } = await supabase
    .from('entreprises')
    .delete()
    .eq('id', id)
  if (error) throw error
}

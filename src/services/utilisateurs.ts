import { supabase } from './supabase'
import type { Utilisateur, UtilisateurInsert, UtilisateurUpdate } from '../types'

export async function getUtilisateurs(): Promise<Utilisateur[]> {
  const { data, error } = await supabase
    .from('utilisateurs')
    .select('*')
    .order('nom')
  if (error) throw error
  return data
}

export async function getUtilisateurById(id: string): Promise<Utilisateur> {
  const { data, error } = await supabase
    .from('utilisateurs')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createUtilisateur(utilisateur: UtilisateurInsert): Promise<Utilisateur> {
  const { data, error } = await supabase
    .from('utilisateurs')
    .insert(utilisateur)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateUtilisateur(id: string, updates: UtilisateurUpdate): Promise<Utilisateur> {
  const { data, error } = await supabase
    .from('utilisateurs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteUtilisateur(id: string): Promise<void> {
  const { error } = await supabase
    .from('utilisateurs')
    .delete()
    .eq('id', id)
  if (error) throw error
}

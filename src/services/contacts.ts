import { supabase } from './supabase'
import type { Contact, ContactInsert, ContactUpdate } from '../types'

export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('nom')
  if (error) throw error
  return data
}

export async function getContactById(id: string): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getContactsByEntreprise(entrepriseId: string): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('entreprise_id', entrepriseId)
    .order('nom')
  if (error) throw error
  return data
}

export async function createContact(contact: ContactInsert): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .insert(contact)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateContact(id: string, updates: ContactUpdate): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)
  if (error) throw error
}

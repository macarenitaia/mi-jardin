import { createClient } from '@/lib/supabase/client'
import type { Conversation, Message } from '../types'

export const conversationsService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('jardinero_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data ?? []
  },

  async getConversation(conversationId: string): Promise<Conversation | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('jardinero_conversations')
      .select('*')
      .eq('id', conversationId)
      .single()

    if (error) throw error
    return data
  },

  async createConversation(
    userId: string,
    title: string,
    initialMessages: Message[]
  ): Promise<Conversation> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('jardinero_conversations')
      .insert({
        user_id: userId,
        title,
        messages: JSON.stringify(initialMessages),
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateConversation(
    conversationId: string,
    messages: Message[]
  ): Promise<Conversation> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('jardinero_conversations')
      .update({
        messages: JSON.stringify(messages),
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteConversation(conversationId: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('jardinero_conversations')
      .delete()
      .eq('id', conversationId)

    if (error) throw error
  },
}

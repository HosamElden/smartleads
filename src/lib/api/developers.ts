import { supabase } from '../supabase'
import type { Developer } from '../types'

/**
 * Developer API Functions
 * CRUD operations for the developers table
 */

export const developerApi = {
    /**
     * Get all developers
     */
    async getAll(): Promise<{ data: Developer[] | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('developers')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            const formattedData = data?.map(dev => ({
                id: dev.id,
                name: dev.name,
                overview: dev.overview,
                companyEvolution: dev.company_evolution,
                shareholders: dev.shareholders,
                competitiveAdvantages: dev.competitive_advantages,
                projectsOverview: dev.projects_overview,
                attachments: dev.attachments || [],
                createdAt: new Date(dev.created_at),
                updatedAt: new Date(dev.updated_at)
            })) || []

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error fetching developers:', error)
            return { data: null, error }
        }
    },

    /**
     * Get a single developer by ID
     */
    async getById(id: string): Promise<{ data: Developer | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('developers')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            const formattedData: Developer = {
                id: data.id,
                name: data.name,
                overview: data.overview,
                companyEvolution: data.company_evolution,
                shareholders: data.shareholders,
                competitiveAdvantages: data.competitive_advantages,
                projectsOverview: data.projects_overview,
                attachments: data.attachments || [],
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at)
            }

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error fetching developer:', error)
            return { data: null, error }
        }
    },

    /**
     * Create a new developer
     */
    async create(developer: Omit<Developer, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Developer | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('developers')
                .insert({
                    name: developer.name,
                    overview: developer.overview,
                    company_evolution: developer.companyEvolution,
                    shareholders: developer.shareholders,
                    competitive_advantages: developer.competitiveAdvantages,
                    projects_overview: developer.projectsOverview,
                    attachments: developer.attachments || []
                })
                .select()
                .single()

            if (error) throw error

            const formattedData: Developer = {
                id: data.id,
                name: data.name,
                overview: data.overview,
                companyEvolution: data.company_evolution,
                shareholders: data.shareholders,
                competitiveAdvantages: data.competitive_advantages,
                projectsOverview: data.projects_overview,
                attachments: data.attachments || [],
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at)
            }

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error creating developer:', error)
            return { data: null, error }
        }
    },

    /**
     * Update an existing developer
     */
    async update(id: string, developer: Partial<Omit<Developer, 'id' | 'createdAt' | 'updatedAt'>>): Promise<{ data: Developer | null; error: any }> {
        try {
            const updateData: any = {}
            if (developer.name !== undefined) updateData.name = developer.name
            if (developer.overview !== undefined) updateData.overview = developer.overview
            if (developer.companyEvolution !== undefined) updateData.company_evolution = developer.companyEvolution
            if (developer.shareholders !== undefined) updateData.shareholders = developer.shareholders
            if (developer.competitiveAdvantages !== undefined) updateData.competitive_advantages = developer.competitiveAdvantages
            if (developer.projectsOverview !== undefined) updateData.projects_overview = developer.projectsOverview
            if (developer.attachments !== undefined) updateData.attachments = developer.attachments

            const { data, error } = await supabase
                .from('developers')
                .update(updateData)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            const formattedData: Developer = {
                id: data.id,
                name: data.name,
                overview: data.overview,
                companyEvolution: data.company_evolution,
                shareholders: data.shareholders,
                competitiveAdvantages: data.competitive_advantages,
                projectsOverview: data.projects_overview,
                attachments: data.attachments || [],
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at)
            }

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error updating developer:', error)
            return { data: null, error }
        }
    },

    /**
     * Delete a developer
     */
    async delete(id: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from('developers')
                .delete()
                .eq('id', id)

            if (error) throw error

            return { error: null }
        } catch (error) {
            console.error('Error deleting developer:', error)
            return { error }
        }
    }
}

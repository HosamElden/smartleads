import { supabase } from '../supabase'
import type { Project, Developer } from '../types'

/**
 * Project API Functions
 * CRUD operations for the projects table
 */

export const projectApi = {
    /**
     * Get all projects with optional developer information
     */
    async getAll(includeDeveloper = false): Promise<{ data: Project[] | null; error: any }> {
        try {
            let query = supabase
                .from('projects')
                .select(includeDeveloper ? '*, developers(*)' : '*')
                .order('created_at', { ascending: false })

            const { data, error } = await query

            if (error) throw error

            const formattedData = data?.map(proj => ({
                id: proj.id,
                developerId: proj.developer_id,
                developer: includeDeveloper && proj.developers ? {
                    id: proj.developers.id,
                    name: proj.developers.name,
                    overview: proj.developers.overview,
                    companyEvolution: proj.developers.company_evolution,
                    shareholders: proj.developers.shareholders,
                    competitiveAdvantages: proj.developers.competitive_advantages,
                    projectsOverview: proj.developers.projects_overview,
                    attachments: proj.developers.attachments || [],
                    createdAt: new Date(proj.developers.created_at),
                    updatedAt: new Date(proj.developers.updated_at)
                } : undefined,
                name: proj.name,
                overview: proj.overview,
                locationText: proj.location_text,
                amenitiesOverview: proj.amenities_overview,
                unitTypesOverview: proj.unit_types_overview,
                technicalSpecs: proj.technical_specs,
                status: proj.status,
                attachments: proj.attachments || [],
                createdAt: new Date(proj.created_at),
                updatedAt: new Date(proj.updated_at)
            })) || []

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error fetching projects:', error)
            return { data: null, error }
        }
    },

    /**
     * Get projects by developer ID
     */
    async getByDeveloperId(developerId: string): Promise<{ data: Project[] | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('developer_id', developerId)
                .order('created_at', { ascending: false })

            if (error) throw error

            const formattedData = data?.map(proj => ({
                id: proj.id,
                developerId: proj.developer_id,
                name: proj.name,
                overview: proj.overview,
                locationText: proj.location_text,
                amenitiesOverview: proj.amenities_overview,
                unitTypesOverview: proj.unit_types_overview,
                technicalSpecs: proj.technical_specs,
                status: proj.status,
                attachments: proj.attachments || [],
                createdAt: new Date(proj.created_at),
                updatedAt: new Date(proj.updated_at)
            })) || []

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error fetching projects by developer:', error)
            return { data: null, error }
        }
    },

    /**
     * Get a single project by ID
     */
    async getById(id: string, includeDeveloper = false): Promise<{ data: Project | null; error: any }> {
        try {
            let query = supabase
                .from('projects')
                .select(includeDeveloper ? '*, developers(*)' : '*')
                .eq('id', id)
                .single()

            const { data, error } = await query

            if (error) throw error

            const formattedData: Project = {
                id: data.id,
                developerId: data.developer_id,
                developer: includeDeveloper && data.developers ? {
                    id: data.developers.id,
                    name: data.developers.name,
                    overview: data.developers.overview,
                    companyEvolution: data.developers.company_evolution,
                    shareholders: data.developers.shareholders,
                    competitiveAdvantages: data.developers.competitive_advantages,
                    projectsOverview: data.developers.projects_overview,
                    attachments: data.developers.attachments || [],
                    createdAt: new Date(data.developers.created_at),
                    updatedAt: new Date(data.developers.updated_at)
                } : undefined,
                name: data.name,
                overview: data.overview,
                locationText: data.location_text,
                amenitiesOverview: data.amenities_overview,
                unitTypesOverview: data.unit_types_overview,
                technicalSpecs: data.technical_specs,
                status: data.status,
                attachments: data.attachments || [],
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at)
            }

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error fetching project:', error)
            return { data: null, error }
        }
    },

    /**
     * Create a new project
     */
    async create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'developer'>): Promise<{ data: Project | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('projects')
                .insert({
                    developer_id: project.developerId,
                    name: project.name,
                    overview: project.overview,
                    location_text: project.locationText,
                    amenities_overview: project.amenitiesOverview,
                    unit_types_overview: project.unitTypesOverview,
                    technical_specs: project.technicalSpecs,
                    status: project.status || 'Planned',
                    attachments: project.attachments || []
                })
                .select()
                .single()

            if (error) throw error

            const formattedData: Project = {
                id: data.id,
                developerId: data.developer_id,
                name: data.name,
                overview: data.overview,
                locationText: data.location_text,
                amenitiesOverview: data.amenities_overview,
                unitTypesOverview: data.unit_types_overview,
                technicalSpecs: data.technical_specs,
                status: data.status,
                attachments: data.attachments || [],
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at)
            }

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error creating project:', error)
            return { data: null, error }
        }
    },

    /**
     * Update an existing project
     */
    async update(id: string, project: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'developer'>>): Promise<{ data: Project | null; error: any }> {
        try {
            const updateData: any = {}
            if (project.developerId !== undefined) updateData.developer_id = project.developerId
            if (project.name !== undefined) updateData.name = project.name
            if (project.overview !== undefined) updateData.overview = project.overview
            if (project.locationText !== undefined) updateData.location_text = project.locationText
            if (project.amenitiesOverview !== undefined) updateData.amenities_overview = project.amenitiesOverview
            if (project.unitTypesOverview !== undefined) updateData.unit_types_overview = project.unitTypesOverview
            if (project.technicalSpecs !== undefined) updateData.technical_specs = project.technicalSpecs
            if (project.status !== undefined) updateData.status = project.status
            if (project.attachments !== undefined) updateData.attachments = project.attachments

            const { data, error } = await supabase
                .from('projects')
                .update(updateData)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            const formattedData: Project = {
                id: data.id,
                developerId: data.developer_id,
                name: data.name,
                overview: data.overview,
                locationText: data.location_text,
                amenitiesOverview: data.amenities_overview,
                unitTypesOverview: data.unit_types_overview,
                technicalSpecs: data.technical_specs,
                status: data.status,
                attachments: data.attachments || [],
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at)
            }

            return { data: formattedData, error: null }
        } catch (error) {
            console.error('Error updating project:', error)
            return { data: null, error }
        }
    },

    /**
     * Delete a project
     */
    async delete(id: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id)

            if (error) throw error

            return { error: null }
        } catch (error) {
            console.error('Error deleting project:', error)
            return { error }
        }
    }
}

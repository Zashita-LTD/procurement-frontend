import type { AxiosResponse } from 'axios'
import { mockProducts, mockProjects, mockEstimateItems, mockDashboardStats } from './data'
import type { Product, Project, EstimateItem, MatchResponse, UploadResponse } from '@/types'

// Симулируем задержку сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock handlers для разработки
export const mockHandlers = {
    // Dashboard
    async getDashboardStats() {
        await delay(300)
        return mockDashboardStats
    },

    // Projects
    async getProjects(): Promise<Project[]> {
        await delay(300)
        return mockProjects
    },

    async getProject(id: string): Promise<Project | undefined> {
        await delay(200)
        return mockProjects.find(p => p.id === id)
    },

    async createProject(data: { name: string; description?: string }): Promise<Project> {
        await delay(400)
        const newProject: Project = {
            id: `proj-${Date.now()}`,
            name: data.name,
            description: data.description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'draft',
            itemsCount: 0,
        }
        mockProjects.push(newProject)
        return newProject
    },

    async deleteProject(id: string): Promise<void> {
        await delay(300)
        const index = mockProjects.findIndex(p => p.id === id)
        if (index > -1) {
            mockProjects.splice(index, 1)
        }
    },

    // Estimate Items
    async getEstimateItems(projectId: string): Promise<EstimateItem[]> {
        await delay(400)
        return mockEstimateItems[projectId] || []
    },

    // Products
    async searchProducts(query: string): Promise<Product[]> {
        await delay(300)
        if (!query || query.length < 2) return []
        const lowerQuery = query.toLowerCase()
        return mockProducts.filter(
            p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.sku.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery)
        )
    },

    async getCatalog(params: { search?: string; category?: string; page?: number }) {
        await delay(300)
        let filtered = [...mockProducts]

        if (params.search) {
            const lowerQuery = params.search.toLowerCase()
            filtered = filtered.filter(
                p =>
                    p.name.toLowerCase().includes(lowerQuery) ||
                    p.sku.toLowerCase().includes(lowerQuery)
            )
        }

        if (params.category && params.category !== 'Все категории') {
            filtered = filtered.filter(p => p.category === params.category)
        }

        return {
            products: filtered,
            total: filtered.length,
            page: params.page || 1,
            pageSize: 20,
        }
    },

    // Matching
    async runMatching(projectId: string): Promise<MatchResponse> {
        await delay(1500) // Имитируем долгую обработку AI
        const items = mockEstimateItems[projectId] || []
        return {
            items,
            processingTime: 1.5,
            modelVersion: '1.0.0-mock',
        }
    },

    // Upload
    async uploadDocument(_projectId: string, file: File): Promise<UploadResponse> {
        await delay(1000)
        return {
            documentId: `doc-${Date.now()}`,
            filename: file.name,
            itemsExtracted: Math.floor(Math.random() * 50) + 10,
            status: 'success',
        }
    },
}

// Типизированный мок для axios
export function createMockAxiosResponse<T>(data: T): AxiosResponse<T> {
    return {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
    }
}

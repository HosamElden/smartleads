// ============================================
// USER AUTHENTICATION
// ============================================

export interface User {
  id: string
  email: string
  password: string
  userType: 'buyer' | 'marketer' | 'admin'
  isActive: boolean
  emailVerified: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

// ============================================
// BUYER & MARKETER
// ============================================

export interface Buyer {
  id: string
  userId?: string  // Reference to users table (optional for backwards compatibility)
  fullName: string
  email: string
  phone: string
  password: string
  budget: number
  locations: string[]
  propertyTypes: string[]
  buyingIntent?: 'Cash' | 'Installment' | 'Mortgage'
  score: number
  scoreTier: 'Hot' | 'Warm' | 'Cold'
  createdAt: Date
}

export interface Marketer {
  id: string
  userId?: string  // Reference to users table (optional for backwards compatibility)
  fullName: string
  companyName?: string
  email: string
  phone: string
  password: string
  role: 'Marketer' | 'Developer'
  officeLocation: string
  createdAt: Date
}

// NEW: Attachment type for files
export interface Attachment {
  url: string
  name: string
  type: 'pdf' | 'image' | 'document'
  uploadedAt: Date
}

// NEW: Developer interface
export interface Developer {
  id: string
  name: string
  overview?: string
  companyEvolution?: string
  shareholders?: string
  competitiveAdvantages?: string
  projectsOverview?: string
  attachments?: Attachment[]
  createdAt: Date
  updatedAt: Date
}

// NEW: Project interface
export interface Project {
  id: string
  developerId: string
  developer?: Developer  // populated when joined
  name: string
  overview?: string
  locationText?: string
  amenitiesOverview?: string
  unitTypesOverview?: string
  technicalSpecs?: string
  status?: string
  attachments?: Attachment[]
  createdAt: Date
  updatedAt: Date
}

// NEW: Property Amenity interface
export interface PropertyAmenity {
  id: number
  propertyId: string
  label: string
  createdAt: Date
}

// NEW: Lookup table interfaces
export interface OfferType {
  id: number
  code: string
  label: string  // Keep for backwards compatibility
  labelEn: string
  labelAr: string
  createdAt: Date
}

export interface Ownership {
  id: number
  code: string
  label: string  // Keep for backwards compatibility
  labelEn: string
  labelAr: string
  createdAt: Date
}

export interface PropertyType {
  id: number
  code: string
  label: string  // Keep for backwards compatibility
  labelEn: string
  labelAr: string
  createdAt: Date
}

// EXTENDED: Property interface with new optional fields (backwards compatible)
export interface Property {
  id: string
  marketerId: string
  title: string  // Keep for backwards compatibility
  titleEn: string
  titleAr: string
  type: string
  location: string
  locationLabel?: string
  locationMapUrl?: string
  projectId?: number
  projectName?: string
  providerName?: string
  price: number
  area: number
  bedrooms: number
  bathrooms: number
  deliveryDate: Date
  paymentPlan: string
  images: string[]
  description: string  // Keep for backwards compatibility
  descriptionEn: string
  descriptionAr: string
  detailedDescription?: string
  status: 'Available' | 'Sold Out' | 'Reserved'
  createdAt: Date
  updatedAt: Date
  furnished?: boolean
  offerTypeId?: number
  ownershipId?: number
  isVerified?: boolean
  amenities?: PropertyAmenity[]  // populated when joined
}

export interface Lead {
  id: string
  buyerId: string
  marketerId: string
  propertyId: string
  buyerScore: number
  buyerScoreTier: 'Hot' | 'Warm' | 'Cold'
  buyerName: string
  buyerPhone: string
  buyerEmail: string
  buyerBudget: number
  buyerLocations: string[]
  buyerPropertyTypes: string[]
  status: 'New' | 'Contacted' | 'Deal' | 'Lost'
  createdAt: Date
}

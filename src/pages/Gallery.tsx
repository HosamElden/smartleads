import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

interface PropertyImage {
    id: string
    title: string
    imageUrl: string
    location: string
    type: string
}

export default function Gallery() {
    const { t } = useTranslation('properties')
    const [images, setImages] = useState<PropertyImage[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<PropertyImage | null>(null)

    useEffect(() => {
        fetchPropertyImages()
    }, [])

    const fetchPropertyImages = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('properties')
                .select('id, title, images, location, type')
                .eq('status', 'Available')
                .not('images', 'is', null)
                .order('created_at', { ascending: false })
                .limit(50)

            if (error) throw error

            // Extract all images from properties (since images is an array)
            const allImages: PropertyImage[] = []
            data?.forEach((property) => {
                if (property.images && Array.isArray(property.images)) {
                    property.images.forEach((imageUrl: string) => {
                        allImages.push({
                            id: `${property.id}-${imageUrl}`,
                            title: property.title,
                            imageUrl: imageUrl,
                            location: property.location,
                            type: property.type
                        })
                    })
                }
            })

            // Shuffle images for random display
            const shuffled = allImages.sort(() => Math.random() - 0.5)
            setImages(shuffled.slice(0, 30)) // Show 30 random images
        } catch (error) {
            console.error('Error fetching property images:', error)
        } finally {
            setLoading(false)
        }
    }

    const openLightbox = (image: PropertyImage) => {
        setSelectedImage(image)
    }

    const closeLightbox = () => {
        setSelectedImage(null)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('gallery.title')}</h1>
                    <p className="text-xl text-blue-100">{t('gallery.subtitle')}</p>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-blue"></div>
                            <p className="text-gray-600 mt-6 text-lg">{t('common:common.loading', { ns: 'common' })}</p>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">{t('gallery.noImages', { defaultValue: 'No Images Available' })}</h2>
                            <p className="text-gray-600">{t('gallery.checkBack', { defaultValue: 'Check back soon for property images' })}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                                    onClick={() => openLightbox(image)}
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-200">
                                        <img
                                            src={image.imageUrl}
                                            alt={image.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Overlay Info */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <h3 className="font-bold text-lg mb-1 line-clamp-1">{image.title}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-200">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="capitalize">{image.location.replace(/-/g, ' ')}</span>
                                            </div>
                                            <div className="mt-1 text-xs bg-white/20 backdrop-blur-sm rounded px-2 py-1 inline-block capitalize">
                                                {image.type}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Click Indicator Icon */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg className="w-5 h-5 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                        aria-label="Close"
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedImage.imageUrl}
                            alt={selectedImage.title}
                            className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mt-4 text-white">
                            <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="capitalize">{selectedImage.location.replace(/-/g, ' ')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="capitalize">{selectedImage.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

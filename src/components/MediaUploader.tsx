import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { X, Upload, Film } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { optimizeCloudinaryUrl, isVideo } from '@/lib/cloudinary'

interface MediaUploaderProps {
    defaultImages?: string[]
    onImagesChange: (urls: string[]) => void
    propertyId: string
}

export default function MediaUploader({ defaultImages = [], onImagesChange, propertyId }: MediaUploaderProps) {
    const [uploadedUrls, setUploadedUrls] = useState<string[]>(defaultImages)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploading(true)
        setProgress(0)

        const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME
        const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET

        if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name') {
            console.warn('Cloudinary credentials missing. Simulating upload.')
            setTimeout(() => {
                const newUrls = acceptedFiles.map(file => URL.createObjectURL(file))
                const updatedUrls = [...uploadedUrls, ...newUrls]
                setUploadedUrls(updatedUrls)
                onImagesChange(updatedUrls)
                setUploading(false)
                setProgress(100)
            }, 1500)
            return
        }

        const totalFiles = acceptedFiles.length
        let completedCount = 0

        const processFile = async (file: File): Promise<string | null> => {
            const formData = new FormData()
            let fileToUpload = file

            // Determine resource type based on file type
            const resourceType = file.type.startsWith('video/') ? 'video' : 'image'

            // Validation & Compression
            if (resourceType === 'video') {
                if (file.size > 50 * 1024 * 1024) { // 50MB limit
                    alert(`Video ${file.name} is too large (max 50MB).`)
                    return null
                }
            } else {
                // Compress image
                try {
                    const options = {
                        maxSizeMB: 1.5,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                        maxIteration: 10 // Reduce iterations for speed
                    }
                    fileToUpload = await imageCompression(file, options)
                } catch (error) {
                    console.error('Compression failed:', error)
                }
            }

            formData.append('file', fileToUpload)
            formData.append('upload_preset', uploadPreset)
            formData.append('folder', `smartleads/properties/${propertyId}`)
            formData.append('tags', `property,${propertyId}`)

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                    formData
                )
                return response.data.secure_url
            } catch (error) {
                console.error(`Upload failed for ${file.name}:`, error)
                alert(`Failed to upload ${file.name}`)
                return null
            } finally {
                completedCount++
                setProgress((completedCount / totalFiles) * 100)
            }
        }

        // Upload in parallel
        const results = await Promise.all(acceptedFiles.map(processFile))
        const successfulUrls = results.filter((url): url is string => url !== null)

        if (successfulUrls.length > 0) {
            const updatedUrls = [...uploadedUrls, ...successfulUrls]
            setUploadedUrls(updatedUrls)
            onImagesChange(updatedUrls)
        }

        setUploading(false)
    }, [uploadedUrls, onImagesChange, propertyId])

    const removeImage = (indexToRemove: number) => {
        const updatedUrls = uploadedUrls.filter((_, index) => index !== indexToRemove)
        setUploadedUrls(updatedUrls)
        onImagesChange(updatedUrls)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
            'video/*': ['.mp4', '.webm', '.ogg']
        }
    })



    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-blue bg-blue-50' : 'border-gray-300 hover:border-primary-blue'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    <Upload className={`w-10 h-10 ${isDragActive ? 'text-primary-blue' : 'text-gray-400'}`} />
                    <p className="text-gray-600 font-medium">
                        {isDragActive ? 'Drop files here...' : 'Drag & drop images/videos here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-400">Supports JPG, PNG, MP4</p>
                </div>
            </div>

            {uploading && (
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-primary-blue h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                    <p className="text-xs text-center mt-1 text-gray-500">Uploading... {Math.round(progress)}%</p>
                </div>
            )}

            {uploadedUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedUrls.map((url, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            {isVideo(url) ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                    <Film className="text-white w-8 h-8" />
                                    <video src={optimizeCloudinaryUrl(url, 300)} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                </div>
                            ) : (
                                <img src={optimizeCloudinaryUrl(url, 300)} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
                            )}

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

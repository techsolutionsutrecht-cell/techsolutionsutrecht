"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCategory, Status, Project, ProjectScreenshot } from "@prisma/client";
import { createProject, updateProject } from "@/actions/content-actions";
import { useRouter } from "next/navigation";

interface ProjectFormProps {
    initialData?: Project & { screenshots: ProjectScreenshot[] };
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [featuredFile, setFeaturedFile] = useState<File | null>(null);
    const [featuredPreview, setFeaturedPreview] = useState<string | null>(initialData?.image || null);
    const [existingScreenshots, setExistingScreenshots] = useState<string[]>(initialData?.screenshots.map(s => s.url) || []);

    const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Featured image is too large (max 10MB). Please compress it first.');
                return;
            }
            
            setFeaturedFile(file);
            setFeaturedPreview(URL.createObjectURL(file));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            
            // Check individual file sizes (max 10MB per file)
            const oversizedFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
            if (oversizedFiles.length > 0) {
                alert(`Some files are too large (max 10MB per file). Please compress them first.`);
                return;
            }
            
            setFiles(prev => [...prev, ...selectedFiles]);

            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeExistingScreenshot = (url: string) => {
        setExistingScreenshots(prev => prev.filter(s => s !== url));
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate total file size (max 45MB to stay under 50MB limit with overhead)
        const totalSize = files.reduce((sum, file) => sum + file.size, 0) + (featuredFile?.size || 0);
        const maxSize = 45 * 1024 * 1024; // 45MB in bytes
        
        if (totalSize > maxSize) {
            alert(`Total file size (${(totalSize / 1024 / 1024).toFixed(1)}MB) exceeds the limit of 45MB. Please reduce image sizes or count.`);
            return;
        }

        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as ProjectCategory;
        const status = formData.get("status") as Status;
        const tagsInput = formData.get("tags") as string;
        const tags = tagsInput.split(",").map(tag => tag.trim());

        try {
            // 1. Upload files
            let featuredImageUrl = initialData?.image;
            if (featuredFile) {
                const featuredFormData = new FormData();
                featuredFormData.append("files", featuredFile);
                featuredFormData.append("folder", "projects");
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: featuredFormData,
                });
                const { urls } = await response.json();
                featuredImageUrl = urls[0];
            }

            const uploadFormData = new FormData();
            files.forEach(file => uploadFormData.append("files", file));
            uploadFormData.append("folder", "projects");
            const screenshotsResponse = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });
            const { urls: newScreenshotUrls } = await screenshotsResponse.json();
            const allScreenshotUrls = [...existingScreenshots, ...newScreenshotUrls];

            // 2. Create or Update project
            if (initialData) {
                await updateProject(initialData.id, {
                    title,
                    slug,
                    description,
                    category,
                    status,
                    tags,
                    screenshotUrls: allScreenshotUrls,
                    image: featuredImageUrl || undefined,
                });
            } else {
                await createProject({
                    title,
                    slug,
                    description,
                    category,
                    status,
                    tags,
                    screenshotUrls: allScreenshotUrls,
                    image: featuredImageUrl || undefined,
                });
            }

            router.push("/admin/projects");
            router.refresh();
        } catch (error) {
            console.error("Failed to create project:", error);
            alert("Error creating project. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-white p-8 border-4 border-swiss-noir shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
        >
            <h2 className="text-3xl font-bold mb-8 text-swiss-noir border-b-4 border-swiss-noir pb-4">
                {initialData ? "EDIT PROJECT" : "CREATE NEW PROJECT"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold uppercase tracking-tight">Project Title</label>
                        <input
                            name="title"
                            required
                            defaultValue={initialData?.title}
                            placeholder="e.g. EcoFlow Utrecht"
                            className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-colors font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold uppercase tracking-tight">Slug</label>
                        <input
                            name="slug"
                            required
                            defaultValue={initialData?.slug}
                            placeholder="e.g. ecoflow-utrecht"
                            className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-colors font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold uppercase tracking-tight">Category</label>
                        <select
                            name="category"
                            required
                            defaultValue={initialData?.category}
                            className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-colors font-medium appearance-none bg-white cursor-pointer"
                        >
                            {(Object.values(ProjectCategory) as ProjectCategory[]).map(cat => (
                                <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold uppercase tracking-tight">Status</label>
                        <select
                            name="status"
                            required
                            defaultValue={initialData?.status}
                            className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-colors font-medium appearance-none bg-white cursor-pointer"
                        >
                            {(Object.values(Status) as Status[]).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold uppercase tracking-tight">Tags (comma separated)</label>
                    <input
                        name="tags"
                        defaultValue={initialData?.tags.join(", ")}
                        placeholder="Next.js, UX, IoT"
                        className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-colors font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold uppercase tracking-tight">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        defaultValue={initialData?.description}
                        placeholder="Describe the project impact and technology used..."
                        className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-colors font-medium"
                    />
                </div>

                {/* Featured Image Upload */}
                <div className="space-y-4 pt-4 border-t-2 border-swiss-noir">
                    <label className="block text-sm font-bold uppercase tracking-tight">Featured Image</label>
                    <div className="flex items-start gap-4">
                        {featuredPreview ? (
                            <div className="relative w-48 h-32 border-2 border-swiss-noir overflow-hidden group">
                                <img src={featuredPreview} alt="Featured Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setFeaturedFile(null); setFeaturedPreview(null); }}
                                    className="absolute top-0 right-0 bg-swiss-noir text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <label className="w-48 h-32 border-2 border-dashed border-swiss-noir flex flex-col items-center justify-center cursor-pointer hover:bg-swiss-gray transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-swiss-noir" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-[10px] font-bold mt-2">UPLOAD FEATURED</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFeaturedChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <p className="text-[10px] uppercase font-bold text-swiss-noir/40 mt-2 max-w-[200px]">
                            This image will be used as the primary thumbnail in the project list.
                        </p>
                    </div>
                </div>

                {/* Screenshots Upload */}
                <div className="space-y-4 pt-4 border-t-2 border-swiss-noir">
                    <label className="block text-sm font-bold uppercase tracking-tight">Project Screenshots</label>

                    <div className="flex flex-wrap gap-4">
                        <AnimatePresence>
                            {existingScreenshots.map((url) => (
                                <motion.div
                                    key={url}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="relative w-32 h-32 border-2 border-swiss-noir group overflow-hidden"
                                >
                                    <img src={url} alt="Screenshot" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingScreenshot(url)}
                                        className="absolute top-0 right-0 bg-swiss-noir text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </motion.div>
                            ))}
                            {previews.map((preview, index) => (
                                <motion.div
                                    key={preview}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="relative w-32 h-32 border-2 border-swiss-noir group overflow-hidden"
                                >
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-0 right-0 bg-swiss-noir text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <label className="w-32 h-32 border-2 border-dashed border-swiss-noir flex flex-col items-center justify-center cursor-pointer hover:bg-swiss-gray transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-swiss-noir" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-[10px] font-bold mt-2">ADD SCREENSHOT</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <div className="pt-8">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-swiss-noir text-white p-4 font-bold text-xl uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none transition-all disabled:opacity-50"
                    >
                        {loading ? "SAVING..." : (initialData ? "UPDATE PROJECT" : "CREATE PROJECT")}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
}

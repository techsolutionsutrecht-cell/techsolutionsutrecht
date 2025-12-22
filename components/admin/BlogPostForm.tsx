"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogCategory, Status, BlogPost, BlogSection, BlogFAQ } from "@prisma/client";
import { createBlogPost, updateBlogPost, uploadBlogFiles } from "@/actions/content-actions";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Image as ImageIcon, ChevronDown, ChevronUp, Save, Layout, Search, HelpCircle, MessageSquare } from "lucide-react";
import { slugify } from "@/lib/blog-utils";

interface BlogPostFormProps {
    initialData?: BlogPost & { sections: BlogSection[], faqs: BlogFAQ[] };
}

type Tab = "basic" | "seo" | "sections" | "faq" | "cta";

export default function BlogPostForm({ initialData }: BlogPostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("basic");

    // Form State
    const [fields, setFields] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        introduction: initialData?.introduction || "",
        category: initialData?.category || ("WEB_DESIGN" as BlogCategory),
        status: initialData?.status || ("DRAFT" as Status),
        author: initialData?.author || "Team Tech Solutions",
        publishDate: initialData?.publishDate ? new Date(initialData.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        metaTitle: initialData?.metaTitle || "",
        metaDescription: initialData?.metaDescription || "",
        metaName: initialData?.metaName || "",
        featuredImageAlt: initialData?.featuredImageAlt || "",
        ctaTitle: initialData?.ctaTitle || "Hulp nodig met uw project?",
        ctaButtonText: initialData?.ctaButtonText || "Neem Contact Op",
    });

    const [sections, setSections] = useState<(Partial<BlogSection> & { localFile?: File | null, localPreview?: string | null })[]>(
        initialData?.sections.map((s: BlogSection) => ({ ...s, localPreview: s.image })) || []
    );
    const [faqs, setFaqs] = useState<Partial<BlogFAQ>[]>(
        initialData?.faqs || []
    );

    const [manualSlug, setManualSlug] = useState(false);

    // Image states
    const [featuredPreview, setFeaturedPreview] = useState<string | null>(initialData?.image || null);
    const [featuredFile, setFeaturedFile] = useState<File | null>(null);

    const updateField = (name: keyof typeof fields, value: string) => {
        setFields(prev => {
            const newFields = { ...prev, [name]: value };

            // Auto-generate slug if title changes and slug hasn't been manually edited
            if (name === "title" && !manualSlug) {
                newFields.slug = slugify(value);
            }

            return newFields;
        });

        if (name === "slug") {
            setManualSlug(true);
        }
    };

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

    const addSection = () => {
        setSections([...sections, { title: "", content: "", order: sections.length, localFile: null, localPreview: null }]);
    };

    const removeSection = (index: number) => {
        setSections(sections.filter((_, i) => i !== index));
    };

    const updateSection = (index: number, data: Partial<BlogSection> & { localFile?: File | null, localPreview?: string | null }) => {
        const newSections = [...sections];
        newSections[index] = { ...newSections[index], ...data };
        setSections(newSections);
    };

    const handleSectionImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Section image is too large (max 10MB). Please compress it first.');
                return;
            }
            
            updateSection(index, {
                localFile: file,
                localPreview: URL.createObjectURL(file)
            });
        }
    };

    const addFaq = () => {
        setFaqs([...faqs, { question: "", answer: "", order: faqs.length }]);
    };

    const removeFaq = (index: number) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    const updateFaq = (index: number, data: Partial<BlogFAQ>) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], ...data };
        setFaqs(newFaqs);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate total file size (max 45MB to stay under 50MB limit with overhead)
        const sectionFiles = sections.filter(s => s.localFile).map(s => s.localFile!);
        const allFiles = [featuredFile, ...sectionFiles].filter(Boolean) as File[];
        const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
        const maxSize = 45 * 1024 * 1024; // 45MB in bytes
        
        if (totalSize > maxSize) {
            alert(`Total file size (${(totalSize / 1024 / 1024).toFixed(1)}MB) exceeds the limit of 45MB. Please reduce image sizes or count.`);
            return;
        }

        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            // 1. Handle Featured Image Upload
            let featuredImageUrl = initialData?.image;
            if (featuredFile) {
                const featuredFormData = new FormData();
                featuredFormData.append("files", featuredFile);
                const results = await uploadBlogFiles(featuredFormData);
                featuredImageUrl = results[0];
            }

            // 2. Prepare Section Data (handling new image uploads for each section)
            const processedSections = await Promise.all(sections.map(async (sec) => {
                let imageUrl = sec.image;

                if (sec.localFile) {
                    const sectionFormData = new FormData();
                    sectionFormData.append("files", sec.localFile);
                    const sectionResults = await uploadBlogFiles(sectionFormData);
                    imageUrl = sectionResults[0];
                }

                return {
                    title: sec.title || "",
                    content: sec.content || "",
                    image: imageUrl || undefined,
                    imageAlt: sec.imageAlt || undefined,
                    order: sec.order || 0
                };
            }));

            const processedFaqs = faqs.map((faq, idx) => ({
                question: faq.question || "",
                answer: faq.answer || "",
                order: idx
            }));

            const postData = {
                ...fields,
                publishDate: new Date(fields.publishDate),
                image: featuredImageUrl || undefined,
                sections: processedSections,
                faqs: processedFaqs,
            };

            if (initialData) {
                await updateBlogPost(initialData.id, postData);
            } else {
                await createBlogPost(postData);
            }

            router.push("/admin/blog");
            router.refresh();
        } catch (error) {
            console.error("Failed to save blog post:", error);
            alert("Error saving blog post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const tabStyles = (tab: Tab) =>
        `px-6 py-4 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all border-b-4 ${activeTab === tab
            ? "border-utrecht-blue text-utrecht-blue bg-utrecht-blue/5"
            : "border-transparent text-swiss-noir/40 hover:text-swiss-noir hover:bg-swiss-stark"
        }`;

    return (
        <div className="max-w-6xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 border-4 border-swiss-noir shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">
                            {initialData ? "Bewerk Post" : "Nieuwe Post"}
                        </h1>
                        <p className="text-swiss-noir/40 font-bold text-xs uppercase mt-1">
                            {initialData ? `ID: ${initialData.id}` : "Creëer een meesterwerk voor de community"}
                        </p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 md:flex-none px-6 py-3 border-2 border-swiss-noir font-bold uppercase text-[10px] hover:bg-swiss-stark transition-all"
                        >
                            Annuleren
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 md:flex-none px-8 py-3 bg-utrecht-blue text-white font-bold uppercase text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save size={14} />
                            {loading ? "Opslaan..." : "Post Publiceren"}
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white border-4 border-swiss-noir shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap border-b-4 border-swiss-noir bg-swiss-stark">
                        <button type="button" onClick={() => setActiveTab("basic")} className={tabStyles("basic")}>
                            <Layout size={14} /> Basis Info
                        </button>
                        <button type="button" onClick={() => setActiveTab("seo")} className={tabStyles("seo")}>
                            <Search size={14} /> SEO Settings
                        </button>
                        <button type="button" onClick={() => setActiveTab("sections")} className={tabStyles("sections")}>
                            <ImageIcon size={14} /> Content Secties
                        </button>
                        <button type="button" onClick={() => setActiveTab("faq")} className={tabStyles("faq")}>
                            <HelpCircle size={14} /> FAQ
                        </button>
                        <button type="button" onClick={() => setActiveTab("cta")} className={tabStyles("cta")}>
                            <MessageSquare size={14} /> Call to Action
                        </button>
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {activeTab === "basic" && (
                                <motion.div
                                    key="basic"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Titel</label>
                                            <input
                                                required
                                                value={fields.title}
                                                onChange={(e) => updateField("title", e.target.value)}
                                                placeholder="De toekomst van Webdesign in Utrecht"
                                                className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-bold text-lg"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Slug</label>
                                            <input
                                                required
                                                value={fields.slug}
                                                onChange={(e) => updateField("slug", e.target.value)}
                                                placeholder="toekomst-webdesign-utrecht"
                                                className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Categorie</label>
                                            <select
                                                required
                                                value={fields.category}
                                                onChange={(e) => updateField("category", e.target.value)}
                                                className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-bold appearance-none bg-white"
                                            >
                                                {(Object.values(BlogCategory) as string[]).map((cat) => (
                                                    <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Status</label>
                                            <select
                                                required
                                                value={fields.status}
                                                onChange={(e) => updateField("status", e.target.value)}
                                                className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-bold appearance-none bg-white"
                                            >
                                                {(Object.values(Status) as string[]).map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Publicatie Datum</label>
                                            <input
                                                type="date"
                                                required
                                                value={fields.publishDate}
                                                onChange={(e) => updateField("publishDate", e.target.value)}
                                                className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Auteur</label>
                                        <input
                                            required
                                            value={fields.author}
                                            onChange={(e) => updateField("author", e.target.value)}
                                            className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-bold"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Introductie (Summary)</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={fields.introduction}
                                            onChange={(e) => updateField("introduction", e.target.value)}
                                            placeholder="Korte samenvatting van de post voor de overzichtspagina..."
                                            className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-medium"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "seo" && (
                                <motion.div
                                    key="seo"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Meta Title</label>
                                                <input
                                                    value={fields.metaTitle}
                                                    onChange={(e) => updateField("metaTitle", e.target.value)}
                                                    placeholder="SEO geoptimaliseerde titel"
                                                    className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Meta Description</label>
                                                <textarea
                                                    rows={3}
                                                    value={fields.metaDescription}
                                                    onChange={(e) => updateField("metaDescription", e.target.value)}
                                                    placeholder="SEO beschrijving voor Google resultaten"
                                                    className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Name (Keywords/Label)</label>
                                                <input
                                                    value={fields.metaName}
                                                    onChange={(e) => updateField("metaName", e.target.value)}
                                                    placeholder="bijv: Tech, Utrecht, Webdesign"
                                                    className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Featured Image</label>
                                                <div className="flex flex-col gap-4">
                                                    {featuredPreview ? (
                                                        <div className="relative aspect-video border-4 border-swiss-noir overflow-hidden group">
                                                            <img src={featuredPreview} alt="Featured Preview" className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => { setFeaturedFile(null); setFeaturedPreview(null); }}
                                                                className="absolute top-4 right-4 bg-swiss-noir text-white p-2 hover:bg-utrecht-blue transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <label className="aspect-video border-4 border-dashed border-swiss-noir flex flex-col items-center justify-center cursor-pointer hover:bg-swiss-stark transition-all group">
                                                            <ImageIcon size={48} className="text-swiss-noir group-hover:scale-110 transition-transform" />
                                                            <span className="text-[10px] font-black mt-4 uppercase tracking-[0.2em]">Upload Afbeelding</span>
                                                            <input type="file" accept="image/*" onChange={handleFeaturedChange} className="hidden" />
                                                        </label>
                                                    )}
                                                    <div className="space-y-2">
                                                        <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir/40">Alt Tekst (SEO)</label>
                                                        <input
                                                            value={fields.featuredImageAlt}
                                                            onChange={(e) => updateField("featuredImageAlt", e.target.value)}
                                                            placeholder="Beschrijving van de afbeelding..."
                                                            className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all text-xs font-bold"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "sections" && (
                                <motion.div
                                    key="sections"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex justify-between items-center bg-swiss-noir text-white p-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em]">Inhoudsopgave & Secties</h3>
                                        <button
                                            type="button"
                                            onClick={addSection}
                                            className="px-4 py-2 bg-utrecht-blue text-white text-[10px] font-black uppercase flex items-center gap-2 hover:bg-white hover:text-utrecht-blue transition-all"
                                        >
                                            <Plus size={14} /> Voeg Sectie Toe
                                        </button>
                                    </div>

                                    <div className="space-y-12">
                                        <AnimatePresence>
                                            {sections.map((section, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="p-6 border-4 border-swiss-noir bg-white relative shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"
                                                >
                                                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-swiss-noir text-white flex items-center justify-center font-black">
                                                        {index + 1}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSection(index)}
                                                        className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 text-white flex items-center justify-center hover:bg-swiss-noir transition-colors shadow-lg"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Sectie Titel</label>
                                                                <input
                                                                    value={section.title}
                                                                    onChange={(e) => updateSection(index, { title: e.target.value })}
                                                                    placeholder="bijv: Waarom Utrecht voorop loopt"
                                                                    className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-bold"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Inhoud</label>
                                                                <textarea
                                                                    value={section.content}
                                                                    onChange={(e) => updateSection(index, { content: e.target.value })}
                                                                    rows={8}
                                                                    placeholder="Schrijf je content hier..."
                                                                    className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-medium"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Sectie Afbeelding</label>
                                                                <div className="flex flex-col gap-4">
                                                                    {section.localPreview ? (
                                                                        <div className="relative aspect-video border-2 border-swiss-noir group overflow-hidden">
                                                                            <img src={section.localPreview} alt="Sectie Preview" className="w-full h-full object-cover" />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => updateSection(index, { localFile: null, localPreview: null, image: null })}
                                                                                className="absolute top-2 right-2 bg-swiss-noir text-white p-2 opacity-0 group-hover:opacity-100 transition-all"
                                                                            >
                                                                                <Trash2 size={12} />
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <label className="aspect-video border-2 border-dashed border-swiss-noir flex flex-col items-center justify-center cursor-pointer hover:bg-swiss-stark transition-all group">
                                                                            <Plus size={24} className="text-swiss-noir group-hover:scale-110 transition-transform" />
                                                                            <span className="text-[10px] font-bold mt-2 truncate max-w-full px-2">UPLOAD SECTION IMAGE</span>
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={(e) => handleSectionImageChange(index, e)}
                                                                                className="hidden"
                                                                            />
                                                                        </label>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Alt Tekst</label>
                                                                <input
                                                                    value={section.imageAlt || ""}
                                                                    onChange={(e) => updateSection(index, { imageAlt: e.target.value })}
                                                                    placeholder="Beschrijving van de afbeelding..."
                                                                    className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-medium text-xs"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        {sections.length === 0 && (
                                            <div className="p-20 border-4 border-dashed border-swiss-gray text-center">
                                                <p className="text-swiss-noir/40 font-black uppercase tracking-widest">Nog geen secties toegevoegd.</p>
                                                <button
                                                    type="button"
                                                    onClick={addSection}
                                                    className="mt-6 px-10 py-4 bg-swiss-noir text-white font-black uppercase text-[10px] tracking-widest hover:bg-utrecht-blue transition-all"
                                                >
                                                    Eerste Sectie Toevoegen
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "faq" && (
                                <motion.div
                                    key="faq"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex justify-between items-center bg-swiss-noir text-white p-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em]">Veelgestelde Vragen</h3>
                                        <button
                                            type="button"
                                            onClick={addFaq}
                                            className="px-4 py-2 bg-utrecht-blue text-white text-[10px] font-black uppercase flex items-center gap-2 hover:bg-white hover:text-utrecht-blue transition-all"
                                        >
                                            <Plus size={14} /> Voeg FAQ Toe
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <AnimatePresence>
                                            {faqs.map((faq, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="border-2 border-swiss-noir overflow-hidden"
                                                >
                                                    <div className="bg-swiss-stark p-4 flex justify-between items-center border-b-2 border-swiss-noir">
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Vraag #{index + 1}</span>
                                                        <button type="button" onClick={() => removeFaq(index)} className="text-red-500 hover:text-swiss-noir transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="p-6 space-y-4 bg-white">
                                                        <input
                                                            value={faq.question}
                                                            onChange={(e) => updateFaq(index, { question: e.target.value })}
                                                            placeholder="De Vraag?"
                                                            className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-bold"
                                                        />
                                                        <textarea
                                                            value={faq.answer}
                                                            onChange={(e) => updateFaq(index, { answer: e.target.value })}
                                                            rows={3}
                                                            placeholder="Het Antwoord..."
                                                            className="w-full p-3 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-medium"
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        {faqs.length === 0 && (
                                            <div className="p-12 border-4 border-dashed border-swiss-gray text-center">
                                                <p className="text-swiss-noir/40 font-black uppercase tracking-widest text-[10px]">Geen FAQ's voor deze post.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "cta" && (
                                <motion.div
                                    key="cta"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="p-12 border-4 border-swiss-noir bg-utrecht-blue/5 space-y-8">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 bg-utrecht-blue text-white flex items-center justify-center font-black text-2xl shadow-lg">?</div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">Post Call-to-Action</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Titel</label>
                                                <input
                                                    value={fields.ctaTitle}
                                                    onChange={(e) => updateField("ctaTitle", e.target.value)}
                                                    className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-swiss-noir">Button Tekst</label>
                                                <input
                                                    value={fields.ctaButtonText}
                                                    onChange={(e) => updateField("ctaButtonText", e.target.value)}
                                                    className="w-full p-4 border-2 border-swiss-noir focus:bg-utrecht-blue focus:text-white outline-none transition-all font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-white p-8 border-2 border-swiss-noir shadow-inner mt-8">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-swiss-noir/40 mb-4">Preview</p>
                                            <div className="flex flex-col items-center gap-4 p-8 border-2 border-swiss-noir">
                                                <h4 className="text-2xl font-black uppercase">{initialData?.ctaTitle || "Hulp nodig?"}</h4>
                                                <div className="px-8 py-3 bg-utrecht-blue text-white font-black uppercase text-xs shadow-lg">
                                                    {initialData?.ctaButtonText || "Contact"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </form>
        </div>
    );
}

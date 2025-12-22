"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ProjectSlideshowProps {
    images: string[];
    title: string;
}

export default function ProjectSlideshow({ images, title }: ProjectSlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval);
    }, [nextSlide, images.length]);

    if (images.length === 0) {
        return <div className="w-full h-full bg-gradient-to-br from-swiss-gray to-swiss-noir/10" />;
    }

    if (images.length === 1) {
        return (
            <Image
                src={images[0]}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        );
    }

    return (
        <div className="relative w-full h-full group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`${title} - slide ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-0 z-20 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <button
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    className="p-3 bg-white text-swiss-noir border-2 border-swiss-noir pointer-events-auto hover:bg-utrecht-blue hover:text-white transition-colors brutal-shadow-sm"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    className="p-3 bg-white text-swiss-noir border-2 border-swiss-noir pointer-events-auto hover:bg-utrecht-blue hover:text-white transition-colors brutal-shadow-sm"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-2 bg-white border-2 border-swiss-noir brutal-shadow-sm">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                        className={`h-2 transition-all ${index === currentIndex ? "bg-utrecht-blue w-8" : "bg-swiss-gray w-2"
                            } border border-swiss-noir`}
                    />
                ))}
            </div>
        </div>
    );
}

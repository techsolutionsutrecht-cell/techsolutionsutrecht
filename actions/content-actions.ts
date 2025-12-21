"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProjectCategory, BlogCategory, Status } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// --- Project Actions ---

export async function createProject(data: {
    title: string;
    slug: string;
    description: string;
    image?: string;
    category: ProjectCategory;
    tags: string[];
    status: Status;
    screenshotUrls?: string[];
}) {
    const { screenshotUrls, ...projectData } = data;
    const project = await prisma.project.create({
        data: {
            ...projectData,
            screenshots: screenshotUrls ? {
                create: screenshotUrls.map(url => ({ url }))
            } : undefined
        },
        include: {
            screenshots: true
        }
    });
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return project;
}

export async function updateProject(
    id: string,
    data: Partial<{
        title: string;
        slug: string;
        description: string;
        image: string;
        category: ProjectCategory;
        tags: string[];
        status: Status;
        screenshotUrls: string[];
    }>
) {
    const { screenshotUrls, ...projectData } = data;

    const project = await prisma.project.update({
        where: { id },
        data: {
            ...projectData,
            screenshots: screenshotUrls ? {
                deleteMany: {},
                create: screenshotUrls.map(url => ({ url }))
            } : undefined
        },
    });
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return project;
}

export async function deleteProject(id: string) {
    await prisma.project.delete({
        where: { id },
    });
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
}

// --- Blog Actions ---

// --- Blog Actions ---

export async function createBlogPost(data: {
    title: string;
    slug: string;
    introduction?: string;
    content?: string;
    image?: string;
    featuredImageAlt?: string;
    category: BlogCategory;
    status: Status;
    author: string;
    publishDate: Date;
    metaTitle?: string;
    metaDescription?: string;
    metaName?: string;
    ctaTitle?: string;
    ctaButtonText?: string;
    sections?: {
        title: string;
        content: string;
        image?: string;
        imageAlt?: string;
        order: number;
    }[];
    faqs?: {
        question: string;
        answer: string;
        order: number;
    }[];
}) {
    const { sections, faqs, ...postData } = data;
    const post = await prisma.blogPost.create({
        data: {
            ...postData,
            sections: sections ? {
                create: sections
            } : undefined,
            faqs: faqs ? {
                create: faqs
            } : undefined
        },
    });
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return post;
}

export async function updateBlogPost(
    id: string,
    data: Partial<{
        title: string;
        slug: string;
        introduction: string;
        content: string;
        image: string;
        featuredImageAlt: string;
        category: BlogCategory;
        status: Status;
        author: string;
        publishDate: Date;
        metaTitle: string;
        metaDescription: string;
        metaName: string;
        ctaTitle: string;
        ctaButtonText: string;
        sections: {
            title: string;
            content: string;
            image?: string;
            imageAlt?: string;
            order: number;
        }[];
        faqs: {
            question: string;
            answer: string;
            order: number;
        }[];
    }>
) {
    const { sections, faqs, ...postData } = data;

    const post = await prisma.blogPost.update({
        where: { id },
        data: {
            ...postData,
            sections: sections ? {
                deleteMany: {},
                create: sections
            } : undefined,
            faqs: faqs ? {
                deleteMany: {},
                create: faqs
            } : undefined
        },
    });
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return post;
}

export async function deleteBlogPost(id: string) {
    await prisma.blogPost.delete({
        where: { id },
    });
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
}

// --- Contact Actions ---

export async function createContactMessage(data: {
    name: string;
    email: string;
    service: string;
    details: string;
}) {
    const message = await prisma.contactMessage.create({
        data,
    });
    revalidatePath("/admin/contacts");
    return message;
}

export async function markContactAsRead(id: string) {
    const message = await prisma.contactMessage.update({
        where: { id },
        data: { isRead: true },
    });
    revalidatePath("/admin/contacts");
    return message;
}

export async function deleteContactMessage(id: string) {
    await prisma.contactMessage.delete({
        where: { id },
    });
    revalidatePath("/admin/contacts");
}

// --- File Upload Actions ---

export async function uploadFiles(formData: FormData, folder: string = "general") {
    const files = formData.getAll("files") as File[];
    const uploadedUrls: string[] = [];

    if (files.length === 0) return [];

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (err) {
        // Directory might already exist
    }

    for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${folder}/${filename}`);
    }

    return uploadedUrls;
}

export async function uploadProjectFiles(formData: FormData) {
    return uploadFiles(formData, "projects");
}

export async function uploadBlogFiles(formData: FormData) {
    return uploadFiles(formData, "blog");
}

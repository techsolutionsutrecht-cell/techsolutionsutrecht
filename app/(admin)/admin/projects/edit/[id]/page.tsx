import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface EditProjectPageProps {
    params: {
        id: string;
    };
}

export default async function EditProjectPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
        include: { screenshots: true },
    });

    if (!project) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <ProjectForm initialData={project as any} />
        </div>
    );
}

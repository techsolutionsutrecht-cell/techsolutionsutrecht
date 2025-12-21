import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";

export default function CreateProjectPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-swiss-noir">NEW PROJECT</h1>
                    <p className="text-swiss-noir/60 mt-1 font-medium">Add a new masterpiece to your portfolio.</p>
                </div>
                <Link
                    href="/admin/projects"
                    className="px-6 py-2 border-2 border-swiss-noir font-bold hover:bg-swiss-noir hover:text-white transition-colors"
                >
                    BACK TO LIST
                </Link>
            </div>

            <ProjectForm />
        </div>
    );
}

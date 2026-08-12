import EditorWorkspace from "@/components/editor/EditorWorkspace";

export const metadata = { title: "Editor" };
export const dynamic = "force-dynamic";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditorWorkspace projectId={id} />;
}

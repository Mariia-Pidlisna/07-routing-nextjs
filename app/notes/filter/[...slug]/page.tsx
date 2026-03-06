import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { NoteTag } from "@/types/note";
import Notes from "./Notes.client";
import { fetchNotes } from "@/lib/api";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tagCandidate = slug?.[0];

  


  const isValidTag =
    tagCandidate && tagCandidate !== "all" && tagCandidate !== "notes";
  const tag = (tagCandidate && tagCandidate !== "all") 
    ? (tagCandidate as NoteTag) 
    : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotes("", 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}

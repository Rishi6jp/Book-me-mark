"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { SearchBar } from "../../../components/ui/SearchBar";
import { FolderModal } from "../../../components/FolderModal";
import { BookmarkModal } from "../../../components/BookmarkModal";
import { useBookmarkStore, useFolderStore } from "@repo/store";
import { SubFolders } from "../../../components/SubFolders";
import { CreateFolderButton } from "../../../components/ui/dashboard/CreateFolderButton";
import { BookmarkLayout } from "../../../components/BookmarkLayout";

export default function FolderPage() {
  const params = useParams();
  const segmentsParam = params.segments;
  const segmentsArray =
    typeof segmentsParam === "string" ? [segmentsParam] : segmentsParam || [];

  const { resolveFolderPath, currentFolder, fetchSubfolders, cleanUp } =
    useFolderStore();
  const { fetchBookmarks, clearBookmarks } = useBookmarkStore();

  useEffect(() => {
    const resolveAndFetch = async () => {
      try {
        cleanUp();
        clearBookmarks();
        if (segmentsArray.length > 0) {
          await resolveFolderPath(segmentsArray);
        }
      } catch (error) {
        console.error("Error resolving folder path:", error);
      }
    };

    resolveAndFetch();
  }, [segmentsArray, cleanUp, clearBookmarks, resolveFolderPath]);

  useEffect(() => {
    if (currentFolder?.id) {
      const fetchData = async () => {
        try {
          await Promise.all([
            fetchSubfolders(currentFolder.id),
            fetchBookmarks(currentFolder.id),
          ]);
        } catch (error) {
          console.error("Error fetching folder data:", error);
        }
      };

      fetchData();
    }
  }, [currentFolder?.id, fetchSubfolders, fetchBookmarks]);

  return (
    <div className="m-5">
      <FolderModal parentFolder={undefined} />
      <BookmarkModal />
      <Breadcrumbs segments={segmentsArray} />
      <div className="max-w-md mx-auto pt-5">
        <SearchBar
          placeholder={`Search in ${currentFolder?.name || "folder"}`}
          className="mt-10 mb-15"
        />
      </div>
      <div className="mx-3">
        <h1 className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-5">
          Subfolders
        </h1>
        <SubFolders />
      </div>
      <div className="flex justify-center">
        <CreateFolderButton className="size-30 mb-10" />
      </div>
      <div className="mx-3">
        <h1 className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-5">
          Bookmarks
        </h1>
        <BookmarkLayout />
      </div>
    </div>
  );
}

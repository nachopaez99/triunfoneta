import { AlbumSection } from "./AlbumSection";

export function AlbumViewer({ stickers }) {
  const departments = [...new Set(stickers.map((sticker) => sticker.department))];

  return (
    <div className="album-viewer">
      {departments.map((department) => {
        const departmentStickers = stickers.filter(
          (sticker) => sticker.department === department
        );

        return (
          <AlbumSection
            key={department}
            department={department}
            stickers={departmentStickers}
          />
        );
      })}
    </div>
  );
}
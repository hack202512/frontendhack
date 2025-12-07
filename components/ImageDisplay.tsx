"use client";

interface ImageDisplayProps {
  imageUrl: string;
  imageId: number | null;
}

export default function ImageDisplay({ imageUrl, imageId }: ImageDisplayProps) {
  return (
    <>
      <div className="mt-6 flex justify-center">
        <img
          src={imageUrl}
          alt="Uploaded"
          className="max-w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      {imageId && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          ID obrazka: {imageId}
        </div>
      )}
    </>
  );
}





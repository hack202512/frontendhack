"use client";

interface FileDownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export default function FileDownloadButton({ onClick, disabled }: FileDownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Pobierz obrazek
    </button>
  );
}



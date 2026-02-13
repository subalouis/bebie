
import React from 'react';

interface PhotoUploadProps {
  onUpload: (url: string) => void;
  currentUrl: string | null;
  label: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUpload, currentUrl, label }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group w-64 h-64 border-4 border-dashed border-pink-200 rounded-3xl overflow-hidden flex items-center justify-center bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer">
        {currentUrl ? (
          <img src={currentUrl} alt="Memory" className="w-full h-full object-cover" />
        ) : (
          <div className="text-pink-400 flex flex-col items-center">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">{label}</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PhotoUpload;

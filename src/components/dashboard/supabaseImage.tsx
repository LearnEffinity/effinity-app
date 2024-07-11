"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

interface SupabaseImageProps {
  filePath: string;
  alt: string;
  width: number;
  height: number;
  type: "module_images" | "lesson_images";
  className?: string;
}

const SupabaseImage: React.FC<SupabaseImageProps> = ({
  filePath,
  alt,
  width,
  height,
  type,
  className,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const { data } = await supabase.storage
          .from(type)
          .getPublicUrl(filePath);

        setImageUrl(data.publicUrl);
      } catch (error) {
        console.error("Error fetching image URL:", error);
        setImageUrl(null);
      }
    };

    fetchImageUrl();
  }, [filePath, type]);

  if (!imageUrl) {
    return (
      <div 
        className={`animate-pulse bg-gray-200 ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default SupabaseImage;

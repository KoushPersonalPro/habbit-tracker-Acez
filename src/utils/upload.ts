/**
 * Utility functions for handling file uploads to Supabase storage
 */
import { createClient } from "../../supabase/client";

/**
 * Upload a file to Supabase storage
 * @param file - The file to upload
 * @param path - The storage path (default: 'habit-verifications')
 * @returns The URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  path = "habit-verifications",
): Promise<string> {
  try {
    const supabase = createClient();

    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from("habit-verifications")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("habit-verifications").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Convert a data URL to a File object
 * @param dataUrl - The data URL
 * @param filename - The filename to use
 * @returns A File object
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

/**
 * Resize an image file to a maximum width/height
 * @param file - The image file to resize
 * @param maxSize - The maximum width/height
 * @returns A promise that resolves to a data URL of the resized image
 */
export function resizeImage(file: File, maxSize = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(file.type);
        resolve(dataUrl);
      };
      img.onerror = () => {
        reject(new Error("Error loading image"));
      };
    };
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
  });
}

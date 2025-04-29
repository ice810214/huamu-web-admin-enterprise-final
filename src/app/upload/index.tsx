"use client";

import { useState } from "react";
import { storage } from "@/libs/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImageUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("請選擇一個設計圖檔案！");
      return;
    }

    const storageRef = ref(storage, `designs/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(percent);
      },
      (error) => {
        console.error("上傳錯誤：", error);
        alert("上傳失敗，請稍後再試！");
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(url);
        setUploading(false);
        alert("設計圖上傳成功！");
      }
    );
  };

  const handleDelete = async () => {
    if (!imageUrl) return;
    const url = new URL(imageUrl);
    const pathname = decodeURIComponent(url.pathname);
    const filePath = pathname.split("/o/")[1].split("?")[0];
    const storageRef = ref(storage, filePath);

    try {
      await deleteObject(storageRef);
      alert("圖片已刪除");
      setImageUrl(null);
      setFile(null);
    } catch (error) {
      console.error("刪除錯誤：", error);
      alert("刪除失敗");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">設計圖上傳管理</h1>

      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {uploading ? `上傳中... (${uploadProgress}%)` : "上傳圖片"}
        </button>
      </div>

      {imageUrl && (
        <div className="mt-4">
          <p className="font-bold">上傳成功，預覽：</p>
          <img
            src={imageUrl}
            alt="Uploaded"
            className="max-w-md w-full rounded shadow mb-2"
          />
          <p className="text-sm text-gray-500 break-all">{imageUrl}</p>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 mt-2 rounded"
          >
            刪除圖片
          </button>
        </div>
      )}
    </div>
  );
}

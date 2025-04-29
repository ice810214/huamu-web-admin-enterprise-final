"use client";

import { useState, useEffect } from "react";
import { storage, db } from "@/libs/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

interface Post {
  id: string;
  imageUrl: string;
  description: string;
  createdAt: Timestamp;
}

export default function WallPage() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [uploading, setUploading] = useState(false);

  const postsCollection = collection(db, "posts");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !description) {
      alert("請選擇圖片並輸入描述！");
      return;
    }

    const storageRef = ref(storage, `wall/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.error("上傳失敗：", error);
        alert("上傳失敗！");
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        const newPost = {
          imageUrl: url,
          description,
          createdAt: Timestamp.now(),
        };
        const docRef = await addDoc(postsCollection, newPost);
        setPosts([{ id: docRef.id, ...newPost }, ...posts]);
        setDescription("");
        setFile(null);
        setUploading(false);
        alert("發佈成功！");
      }
    );
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      const url = new URL(imageUrl);
      const filePath = decodeURIComponent(url.pathname.split("/o/")[1].split("?")[0]);
      await deleteObject(ref(storage, filePath));
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("刪除失敗：", error);
      alert("刪除失敗！");
    }
  };

  const fetchPosts = async () => {
    const snapshot = await getDocs(postsCollection);
    const list: Post[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      list.push({
        id: doc.id,
        imageUrl: data.imageUrl,
        description: data.description,
        createdAt: data.createdAt,
      });
    });
    // 排序最新在最上
    list.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    setPosts(list);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">動態牆作品展示</h1>

      <div className="grid gap-2 mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2"
        />
        <textarea
          placeholder="描述文字"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 h-24"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {uploading ? "上傳中..." : "發佈作品"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="border p-3 rounded shadow">
            <img
              src={post.imageUrl}
              alt="Post"
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <p className="text-gray-800 text-sm">{post.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              建立於：{post.createdAt.toDate().toLocaleString()}
            </p>
            <button
              onClick={() => handleDelete(post.id, post.imageUrl)}
              className="text-red-600 text-sm mt-1"
            >
              刪除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

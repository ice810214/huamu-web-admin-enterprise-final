"use client";

import { useEffect, useState } from "react";
import { db } from "@/libs/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

interface Task {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  createdAt: Timestamp;
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const taskCollection = collection(db, "tasks");

  const handleAdd = async () => {
    if (!title || !date) {
      alert("請輸入任務名稱與工期日期");
      return;
    }

    const newTask = {
      title,
      date,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(taskCollection, newTask);
    setTasks([
      ...tasks,
      {
        id: docRef.id,
        ...newTask,
      },
    ]);

    setTitle("");
    setDate("");
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const fetchTasks = async () => {
    const snapshot = await getDocs(taskCollection);
    const fetched: Task[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      fetched.push({
        id: doc.id,
        title: data.title,
        date: data.date,
        createdAt: data.createdAt,
      });
    });
    setTasks(fetched);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">工期行事曆任務管理</h1>

      <div className="grid gap-2 mb-6">
        <input
          type="text"
          placeholder="任務名稱"
          className="border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          className="border p-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-black text-white px-4 py-2 rounded"
        >
          新增任務
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">任務列表</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">目前沒有任何任務</p>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <div key={task.id} className="border p-3 rounded shadow-sm">
              <p>
                <strong>{task.title}</strong> – 工期日期：{task.date}
              </p>
              <p className="text-sm text-gray-500">
                建立於：{task.createdAt.toDate().toLocaleString()}
              </p>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-500 text-sm mt-1"
              >
                刪除任務
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

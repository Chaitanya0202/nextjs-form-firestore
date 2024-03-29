"use client";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log("Fetching data...");
    try {
      const querySnapshot = await getDocs(collection(db, "messages"));
      console.log("Query snapshot:", querySnapshot);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Data:", data);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  async function addDatatoFirestore(name, email, message) {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        name: name,
        email: email,
        message: message,
      });
      console.log("id", docRef.id);
      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  }

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const added = await addDatatoFirestore(name, email, message);
    if (added) {
      setName("");
      setEmail("");
      setMessage("");
      alert("Data Got Stored");
    } else {
      alert("Nothing");
    }
    fetchData()
  };

  const deleteData = async (documentId) => {
    try {
      const docRef = doc(db, "messages", documentId);
      await deleteDoc(docRef);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
    fetchData()
  };

  const updateData = async (documentId) => {
    try {
      const docRef = doc(db, "messages", documentId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = { id: docSnapshot.id, ...docSnapshot.data() };
        console.log("Document data:", data);
      
        let name1 = data.name;
        let email1 = data.email;
        let message1 = data.message;
      
        setName(name1);
        setEmail(email1);
        setMessage(message1);
      
        console.log("name", data.name);
        console.log("email", data.email);
        console.log("message", data.message); // Corrected typo in this line
      
        fetchData();
        deleteData(documentId);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };

  return (
    <>
      <h1>Add data To Database</h1>
      <form onSubmit={handlerSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label htmlFor="name" style={{ marginBottom: '5px' }}>
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ border: '1px solid black', marginBottom: '10px', padding: '5px' }}
        />

        <label htmlFor="email" style={{ marginBottom: '5px' }}>
          Email
        </label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ border: '1px solid black', marginBottom: '10px', padding: '5px' }}
        />

        <label htmlFor="message" style={{ marginBottom: '5px' }}>
          Message
        </label>
        <input
          type="text"
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ border: '1px solid black', marginBottom: '10px', padding: '5px' }}
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none' }}>
          SUBMIT
        </button>
      </div>
    </form>

      <h1>Fetched Data</h1>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            <strong>Name:</strong> {m.name}, <strong>Email:</strong> {m.email},{" "}
            <strong>Message:</strong> {m.message}
            <button
              style={{ marginLeft: 20 }}
              onClick={() => deleteData(m.id)}
            >
              Delete
            </button>
            <button
              style={{ marginLeft: 20 }}
              onClick={() => updateData(m.id)}
            >
              Update
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

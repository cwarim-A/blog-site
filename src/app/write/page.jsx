"use client";

import Image from "next/image";
import styles from "./write.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const WritePage = () => {
  const { status } = useSession();

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [catSlug, setCatSlug] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  // const handleFileUpload = async () => {
  //   if (!file) return;

  //   setUploading(true);

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", "blog-website"); // Replace with your Cloudinary upload preset

  //   try {
  //     const response = await fetch(
  //       `https://api.cloudinary.com/v1_1/dm8jh1n7a/image/upload`, // Replace YOUR_CLOUD_NAME
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );
  //     console.log(response)

  //     if (!response.ok) {
  //       throw new Error("Failed to upload file");
  //     }

  //     const data = await response.json();
  //     setMedia(data.secure_url);
  //     // console.log("Uploaded file URL:", data.secure_url);
  //     // alert(`File uploaded successfully: ${data.secure_url}`);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to upload file.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // const handleSubmit = async ()=>{
  //   handleFileUpload();
  //   const res = await fetch("/api/posts", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       title,
  //       desc: value,
  //       img: media,
  //       slug: slugify(title),
  //       catSlug: catSlug || "style", //If not selected, choose the general category
  //     }),
  //   });

  //   if (res.status === 200) {
  //     const data = await res.json();
  //     router.push(`/posts/${data.slug}`);
  //   }
  // }

  const handleSubmit = async () => {
    if (!file || !title || !value) {
      alert("Please fill out all fields and select an image.");
      return;
    }

    setUploading(true);

    // Step 1: Upload the file to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blog-website"); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dm8jh1n7a/image/upload`, // this is the api for image upload
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setMedia(data.secure_url);

      // Step 2: Upload the post to the API with the uploaded file's URL
      const postResponse = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc: value,
          img: data.secure_url, // Use the uploaded image URL
          slug: slugify(title),
          catSlug: catSlug || "style", // Set default category or modify as needed
        }),
      });

      if (postResponse.status === 200) {
        const postData = await postResponse.json();
        // setTitle("");
        // setValue("");
        router.push(`/posts/${postData.slug}`);
       
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className={styles.select}
        onChange={(e) => setCatSlug(e.target.value)}
      >
        <option value="style">style</option>
        <option value="fashion">fashion</option>
        <option value="food">food</option>
        <option value="culture">culture</option>
        <option value="travel">travel</option>
        <option value="coding">coding</option>
      </select>
      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>
        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />

            <button className={styles.addButton}>
              <label htmlFor="image">
                <Image src="/image.png" alt="" width={16} height={16} />
              </label>
            </button>

            <button className={styles.addButton}>
              <Image src="/external.png" alt="" width={16} height={16} />
            </button>
            <button className={styles.addButton}>
              <Image src="/video.png" alt="" width={16} height={16} />
            </button>
          </div>
        )}
        <ReactQuill
          className={styles.textArea}
          theme="bubble"
          value={value}
          onChange={setValue}
          placeholder="Tell your story..."
        />
      </div>
      <button
        className={styles.publish}
        onClick={handleSubmit}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Publish"}
      </button>
    </div>
  );
};

export default WritePage;

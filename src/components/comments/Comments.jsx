"use client";

import Link from "next/link";
import styles from "./comments.module.css";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useState } from "react";

// const fetcher = async (url) => {

//   fetch(url).then(res => res.json())

// return res.json();

// };
const fetcher = (url) => fetch(url).then((r) => r.json());

const Comments = ({ postSlug }) => {
  const { status } = useSession();

  console.log(postSlug);

  const { data, mutate, error } = useSWR(
    `http://dblog-site.vercel.app/api/comments?postSlug=${postSlug}`,
    fetcher
  );

  const [desc, setDesc] = useState("");
  const handleSubmit = async () => {
    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ desc, postSlug }),
    });
    mutate();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Comments</h1>
      {status === "authenticated" ? (
        <div className={styles.write}>
          <textarea
            placeholder="Write a comment..."
            className={styles.input}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button className={styles.button} onClick={handleSubmit}>
            Send
          </button>
        </div>
      ) : (
        <Link href="/login">Log in to write a comment</Link>
      )}
      <div className={styles.comments}>
        {Array.isArray(data) &&
          data?.map((item) => (
            <div className={styles.comment} key={item._id}>
              <div className={styles.user}>
                {item?.user?.image && (
                  <Image
                    src={item?.user.image}
                    alt=""
                    width={50}
                    height={50}
                    className={styles.image}
                  />
                )}
                <div className={styles.userInfo}>
                  <span className={styles.username}>{item?.user.name}</span>
                  <span className={styles.date}>{item?.createdAt}</span>
                </div>
              </div>
              <p className={styles.desc}>{item?.desc}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Comments;

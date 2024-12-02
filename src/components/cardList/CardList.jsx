import React from "react";
import Pagination from "../pagination/Pagination";
import styles from "./cardlist.module.css";
import Cards from "../cards/Cards";


const getData = async (page,cat)=>{
  const res = await fetch(`https://dblog-site.vercel.app/api/posts?page=${page}&cat=${cat || ""}`,{
    cache: "no-store",
  });

  if(!res.ok){
    throw new Error("Failed to fetch categories");
  }

  return res.json();
} 



const CardList = async({page,cat }) => {

const {posts,count} = await getData(page,cat);



const POST_PER_PAGE = 2;

const hasPrev = POST_PER_PAGE * (page - 1) > 0;
const hasNext = page * POST_PER_PAGE < count; 


// POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      <div className={styles.posts}>
      {posts?.map((item)=>(
          <Cards item={item} key={item._id }/>
      ))}
       
       
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext}  />
    </div>
  );
};

export default CardList;

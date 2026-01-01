"use client"

import { useState } from "react";
import bcrypt from "bcrypt";

export default function() {
    const [file, setFile] = useState<File | null>();
    const formData = new FormData();
   const [password, setPassword] = useState("");

    const handleUpload = async () => {

        
        formData.append("file", file!);
        formData.append("poolName", "test");
        formData.append("imageName", "test-image")
        formData.append("password", password);
        console.log(formData.get("file"));
        const res = await fetch("http://localhost:8080/admin/img/upload", {
          method: "POST",
          body: formData,
        });
        console.log("file", file);

        const data = await res.json()

        console.log(data);
    }


    return <div>
        <input type="file" placeholder="Upload an Image" onInput={(e: any) => { setFile(e.target.files[0]) }} />
        <button className="bg-amber-400 text-amber-50 p-5" onClick={handleUpload}> Upload </button>
        <input type="password" placeholder="enter password" onChange={(e)=>{setPassword(e.target.value)}} />
    </div>
}
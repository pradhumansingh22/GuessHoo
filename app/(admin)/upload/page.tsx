"use client"

import { useState } from "react";
import bcrypt from "bcrypt";

export default function() {
    const [file, setFile] = useState<File | null>();
    const formData = new FormData();
    const [password, setPassword] = useState("");
    const [imageName, setImageName] = useState("");

    const handleUpload = async () => {

        
        formData.append("file", file!);
        formData.append("poolName", "test");
        formData.append("imageName", imageName)
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


    return (
      <div className="flex justify-center flex-col content-center mt-5">
        <div className="flex justify-center items-center flex-col space-y-4">
          <input
            type="file"
            placeholder="Upload an Image"
            className="bg-yellow-200 p-5 text-white rounded-4xl"
            onInput={(e: any) => {
              setFile(e.target.files[0]);
            }}
          />

          <input
            type="password"
            placeholder="enter password"
            className="bg-yellow-200 p-5 text-white rounded-4xl text-center"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="name"
                    className="bg-yellow-200 shadow-xl rounded-xl text-white p-2 text-center"
                    onChange={(e)=>{setImageName(e.target.value)}}
          />
          <button
            className="bg-amber-400 text-amber-50 p-5 rounded-xl text-center"
            onClick={handleUpload}
          >
            {" "}
            Upload{" "}
          </button>
        </div>
      </div>
    );
}
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function SendMoney() {
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState("");
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  return (
    <>
      <div>Send Money</div>
      <div>To : {name}</div>
      <input
        type="text"
        name=""
        id=""
        placeholder="Enter the amount"
        onChange={(e) => {
          setAmount(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          const transferProcess = await axios.post(
            "http://localhost:3000/api/v1/account/transfer",
            {
              to: id,
              amount,
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
        }}
      >
        Transfer
      </button>
    </>
  );
}

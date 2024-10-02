// 自分の口座からGMOのイベント口座へ振込
"use client";
import React, { useState } from "react";
import styles from "../page.module.css";

export function TransferToSunabar() {
  const [transferData, setTransferData] = useState({
    myaccountId: process.env.NEXT_PUBLIC_MYACCOUNTID,
    mytotalAmount:"",
    mytransfers:""
  });
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [transferReqComplete, setTransferReqComplete] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");

  const handleTransfer = async () => {
    if (!showInput) {
      setShowInput(true);
      return;
    }
    setTransferData((prevData) => ({
      ...prevData,
      mytotalAmount: inputValue,
      mytransfers: inputValue
    }));

    try {
      const response = await fetch('http://localhost:3030/api/myaccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          myaccountId: transferData.myaccountId,
          mytotalAmount: inputValue,
          mytransfers: inputValue
        }),
      });

      if (!response.ok) {
        throw new Error('振込に失敗しました');
      }
      alert('振込依頼できました');
      console.log("振込依頼成功")
      setTransferReqComplete(true);
      setTransferAmount(inputValue);
      setInputValue("");
      setShowInput(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <div>
        <>
          <button
            title="入力欄が出ます"
            onClick={handleTransfer}
            className={styles.button}>
            {showInput ? "振込額を確認" : "自分の口座から振込依頼" }
          </button>
          {showInput && (
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={styles.input}
              placeholder="振込額を入力"
              min="1"
            />
          )}
        </>
        {transferReqComplete && (
          <p>{`振込額: ${transferAmount}円 -`}
            <a
              href='https://bank.sunabar.gmo-aozora.com/bank/notices/important'
              target="_blank"
              rel="noopener noreferrer"
            >
            こちらのリンク
            </a>
            からご承認ください。
          </p>
        )}
    </div>
    </>
  );
}
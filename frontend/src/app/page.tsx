"use client";
import React, { useState } from 'react';
import styles from "./page.module.css";
import { CheckBalances } from "./_components/CheckBalances";
import { TransferToSpAccout } from "./_components/TransferToSpAccount";
import { TransferToSunabar } from "./_components/TransferToSunabar";
import { TransactionDetails } from './_components/TransactionDetails';

export default function Home() {
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const handleButtonClick = () => {
    setShowTransactionDetails(prevState => !prevState);
  };
  return (
    <main className={styles.main}>
      <div className={styles.section}>
        <div className={styles.buttonContainer}>
          <a 
            href="https://portal.sunabar.gmo-aozora.com/account/manage" 
            target="_blank"
            rel="noopener noreferrer"
            title="sunabarサイトへジャンプします"
            className={styles.button}
            >
              自分の口座を登録
            </a>
            <TransferToSunabar />
        </div>
      </div>
        <hr className={styles.hr} />
      <div className={styles.section}>

          <CheckBalances />

      </div>
      <div className={styles.section}>
        <div className={styles.buttonContainer}>
        <a
          href="https://bank.sunabar.gmo-aozora.com/bank/sp-account" 
          target="_blank"
          rel="noopener noreferrer"
          title="sunabarのつかいわけ口座ページへジャンプします"
          className={styles.button}
          >
            つかいわけ口座を作成
          </a>
          <TransferToSpAccout />
          <button className={styles.button} onClick={handleButtonClick}>
            {showTransactionDetails ? '明細を閉じる' : '明細'}
          </button>
          {showTransactionDetails && <TransactionDetails />}
        </div>
      </div>
    </main>
  );
}
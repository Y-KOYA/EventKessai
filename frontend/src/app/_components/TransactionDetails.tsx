// 入出金明細を表示する
"use client";
import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';

interface Transaction {
  transactionDate: string;
  transactionType: string;
  remarks: string;
  amount: string;
}
interface TransactionsResponse {
  accountTitle: string;
  transactions: Transaction[];
}
const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const today = new Date();
const dateToDate = formatDate(today);
const twoMonthsAgo = new Date(today);
twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
const dateFromDate = formatDate(twoMonthsAgo);

export function TransactionDetails() {

  //入出金情報のstate管理
  const [transactionInfo, setTransactionInfo] = useState<TransactionsResponse[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/transactions',{
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          },
        });
        
        const data: TransactionsResponse[] = await response.json();
        
        if (!response.ok) {
          throw new Error('入出金明細照会に失敗しました');
        }
        setTransactionInfo(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div>
      <hr className={styles.hr} />
        <div className={styles.buttonContainer}>          
          口座明細：７月バーベキュー{/*{accountName !== null ? accountName : '読み込み中...'}//口座名になっている。いずれDBからイベントタイトルを表示する*/}
          <div>
            <p>{dateFromDate}から{dateToDate}まで</p>
          </div>
          <div>
          {transactionInfo.map((account, idx) => (
            <div key={idx}>
            <p>{account.accountTitle}</p>
            <table>
              <thead>
              <tr>
                <th>日付</th><th>出入</th><th>適要内容</th><th>金額</th>
              </tr>
              </thead>
              <tbody>

              {account.transactions.map((transaction, tIdx) => (
                <tr key={tIdx}>
                  <td>{transaction.transactionDate}</td>
                      <td>{transaction.transactionType}</td>
                      <td>{transaction.remarks}</td>
                      <td>{transaction.amount}円</td>
                </tr>
              ))}
              </tbody>
            </table>
            </div>
          ))}
          </div>
      <hr className={styles.hr} />
      </div>
    </div>
  );
};
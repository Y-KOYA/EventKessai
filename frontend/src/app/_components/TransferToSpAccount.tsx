// イベント用親口座→つかいわけ口座へ振替
"use client";
import React, { useEffect, useState } from "react";
import styles from "../page.module.css";
interface Account {
  accountId: string;
  accountName?: string;
  spAccountName?: string;
  spAccountTypeCode?: string;
}

interface Balance {
  accountId: string;
  balance: string;
  odBalance?: string;
}

export function TransferToSpAccout() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [balances, setBalances] = useState<{ [key: string]: string}>({});
  const [fromAccount, setFromAccount] = useState<string>("");
  const [toAccount, setToAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showInputs, setShowInputs] = useState<boolean>(false);


  useEffect(() => {
    // 口座情報のフェッチ
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://localhost:3030/api/eventaccount");
        const data = await response.json();
        // 親口座（つかいわけ口座内の親口座。イベント口座と同じもの）を除外
        const allAccounts: Account[] = data.accounts.accounts.concat(data.accounts.spAccounts.filter((account: Account) => account.spAccountTypeCode !== "1"));
        setAccounts(allAccounts);

        const balancesData: { [key: string]: string} = {};
        data.balances.balances.forEach((balance: Balance) => {
          balancesData[balance.accountId] = balance.balance;
        });
        data.balances.spAccountBalances.forEach((balance: Balance) => {
          balancesData[balance.accountId] = balance.odBalance || "0";
        });
        setBalances(balancesData);
      } catch (error) {
        console.error('アカウント情報を取得できませんでした', error);
      }
    }
    fetchAccounts();
  }, []);


  const handleTransfer = async () => {
    if (!fromAccount || !toAccount || !amount || parseInt(amount) <= 0) {
      alert('振込元・振込先を選んでください。金額は1以上の整数で入力してください。')
    return;
    }

    try {
      const response = await fetch('http://localhost:3030/api/toSpAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          depositSpAccountId: toAccount,
          paymentAmount: amount,
        }),
      });
      if (!response.ok) {
        throw new Error('振替に失敗しました');
      }

      const updateBalances = { ...balances };
      updateBalances[fromAccount] = (parseInt(updateBalances[fromAccount]) - parseInt(amount)).toString();
      updateBalances[toAccount] += parseInt(amount);
      setBalances(updateBalances);

      const fromAccountName = accounts.find(account => account.accountId === fromAccount)?.accountName || accounts.find(account => account.accountId === fromAccount)?.spAccountName;
      const toAccountName = accounts.find(account => account.accountId === toAccount)?.accountName || accounts.find(account => account.accountId === toAccount)?.spAccountName;
      setMessage(`「${fromAccountName}」 → 「${toAccountName}」への振替が完了しました！`);
      setAmount("");
    } catch (error) {
      console.error("リクエスト中にエラーが発生：", error);
      alert('振替に失敗しました。');
    }
  };

  
  return (
    <>
      <button title="入力欄が出ます" onClick={() => setShowInputs(!showInputs)} className={styles.button}>各口座間の振替</button>

      {showInputs && (
      <div className={styles.input}>
        <select
          value={fromAccount}
          onChange={(e) => setFromAccount(e.target.value)}
          className={styles.select}
        >
          <option value="" disabled>
            振替元口座を選択
          </option>
          {accounts.map((account, index) => (
            <option key={index} value={account.accountId}>
              {account.accountName || account.spAccountName}
            </option>
          ))}
            </select>

            <select
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className={styles.select}
              >
                <option value="" disabled>
                  振替先口座を選択
                </option>
                {accounts.map((account, index) => (
                  <option key={index} value={account.accountId}>
                    {account.accountName || account.spAccountName}
                  </option>
                ))}
            </select>

            {fromAccount && toAccount && (
              <>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={styles.input}
                  placeholder="振替金額を入力"
                  min="1"
                />
                <button onClick={handleTransfer} className={styles.button}>
                  決定
                </button>
              </>
            )}
          </div>
        )}
        {message && <p>{message}</p>}
    </>
  );
}
// イベント用親口座の残高照会用コンポーネント
"use client";
import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';

export function CheckBalances() {
  //親口座の情報
  const [accountName, setAccountName] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  //子口座の残高
  const [spAccountInfo, setSpAccountInfo] = useState<Array<{ name: string; balance: number }> | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/eventaccount');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error('残高照会に失敗しました');
        }
        setAccountName(data.accounts.accounts[0].accountName);
        setBalance(data.balances.balances[0].balance);

        const spAccountData = data.accounts.spAccounts.map((account: any, index: number) => ({
          name: account.spAccountName,
          balance: data.balances.spAccountBalances[index].odBalance
        }));
        // const untransferbalance = spAccountData[0].balance;

        setSpAccountInfo(spAccountData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBalances();
  }, []);

  return (
    <div>
      <hr className={styles.hr} />
        <div className={styles.buttonContainer}>          
          イベント用口座：７月バーベキュー{/*{accountName !== null ? accountName : '読み込み中...'}//口座名になっている。いずれDBからイベントタイトルを表示する*/}
          <div>
            <p>{balance !== null ? `${balance}円` : '読み込み中...'}</p>
          </div>
        </div>
      <hr className={styles.hr} />
      <div className={styles.buttonContainer}>
        つかいわけ口座 残高一覧
        <div>
        {spAccountInfo ? (
          <>
            {spAccountInfo
              .filter((_, index) => index !== 0) // indexが0の要素を除外
              .map((account, index) => (
                <div key={index + 1}> {/* keyにindex + 1を使用 */}
                  <p>{account.name}: {account.balance}円</p>
                </div>
              ))
            }
            <hr className={styles.innerHr} />
            <div>
              {/* インデックス0のデータを最後に表示 */}
              <p>振替残金</p>
              <p>{spAccountInfo[0].balance}円</p>
            </div>
          </>
        ) : (
          <p>読み込み中...</p>
        )}
        </div>
      </div>
      <hr className={styles.hr} />
    </div>
    
  );
}
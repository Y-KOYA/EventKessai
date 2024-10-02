import express, { Router, Request, Response } from 'express';
import morgan from 'morgan';
import axios from 'axios'

//  入出金明細照会
const router: Router = express.Router();
router.use(morgan('combined'));

interface Transaction {
  transactionDate: string;
  valueDate: string;
  transactionType: string;
  amount: string;
  remarks: string;
  balance: string;
  itemKey: string;
}
interface TransactionsResponse {
  accountId: string;
  currencyCode: string;
  currencyName: string;
  dateFrom: string;
  dateTo: string;
  baseDate: string;
  baseTime: string;
  hasNext: boolean;
  nextItemKey: string;
  count: string;
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

//ここでイベント用口座のaccountIdをDBからすべて配列に代入する、今回は省略
// const accountIds = [
//   process.env.ACCOUNT_ID,
//   process.env.ACCOUNT_ID_ZERO,
//   process.env.ACCOUNT_ID_ONE,
//   process.env.ACCOUNT_ID_TWO,
//   process.env.ACCOUNT_ID_THREE,
//   process.env.ACCOUNT_ID_FOUR]
// console.log(process.env.ACCOUNT_ID,`${process.env.ACCOUNT_ID}`,dateToDate,dateFromDate,"---------------------ID")
// 仮の口座名データ（DBから代入、今回省略）
const accountTitles = [
  "親口座",
  "旅行積立",
  "投資信託"
]


router.get('/', async (req: Request, res: Response) => {
  try {
    const allTransactions: TransactionsResponse[] = [];
    // ここでイベント用口座のaccountIdをDBからすべて配列に代入する、今回は省略
    const accountIds = [
      process.env.ACCOUNT_ID,
      process.env.ACCOUNT_ID_ZERO,
      process.env.ACCOUNT_ID_ONE,
      process.env.ACCOUNT_ID_TWO,
      // process.env.ACCOUNT_ID_THREE,
      // process.env.ACCOUNT_ID_FOUR
    ]

    for (const accountId of accountIds) {
    const url = `https://api.sunabar.gmo-aozora.com/personal/v1/accounts/transactions`;
    const config = {
      method: 'get',
      url: url,
      params: { 
        accountId: accountId,
        dateFrom: dateFromDate,
        dateTo: dateToDate,
      },
      headers: {
        'Accept': 'application/json;charset=UTF-8', 
        'x-access-token': `${process.env.EVENT_ACCOUNT_ACCESS_TOKEN}`
      },
    };
    //リクエストの詳細をコンソールに出力
    console.log('Request Config:', config);

    const response = await axios.request(config);
    allTransactions.push(response.data);
    }
    // フロントエンドに返すデータを絞り込む
    const filteredData = allTransactions
      .filter((_, index) => index !== 1) // 1以外のインデックスを使用
      .map((transactionResponse, idx) => ({
        accountTitle: accountTitles[idx < 1 ? idx : idx + 1], // フィルタによるインデックスのズレを補正
        transactions: transactionResponse.transactions.map(transaction => ({
          transactionDate: transaction.transactionDate,
          transactionType: transaction.transactionType === '1' ? '入金' : '出金',
          remarks: transaction.remarks,
          amount: transaction.amount,
        }))
      }));
    res.status(200).json(filteredData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error data:', error.response?.data);
      console.error('Axios error status:', error.response?.status);
      console.error('Axios error headers:', error.response?.headers);
    } else {
      console.error('Non-Axios error:', error);
    }
    res.status(500).json({ message: 'Failed to send request to API' });
  }
});

export default router;
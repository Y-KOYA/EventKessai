//6月17日週では使用しない→口座登録時accountID取得→DB保管で使用する
import express, { Router, Request, Response } from 'express';
import morgan from 'morgan';
import axios from 'axios'

// 口座一覧照会
const router: Router = express.Router();
router.use(morgan('combined'));

interface Account {
  accountId: string;
  branchCode: string;
  branchName: string;
  accountTypeCode: string;
  accountTypeName: string;
  accountNumber: string;
  primaryAccountCode: string;
  primaryAccountCodeName: string;
  accountName: string;
  accountNameKana: string;
  currencyCode: string;
  currencyName: string;
  transferLimitAmount: string;
}

interface SpAccount {
  accountId: string;
  spAccountTypeCode: string;
  spAccountTypeCodeName: string;
  spAccountName?: string;
  spAccountBranchCode?: string;
  spAccountBranchName?: string;
  spAccountNumber?: string;
}

interface ResponseData {
  baseDate: string;
  baseTime: string;
  accounts: Account[];
  spAccounts: SpAccount[];
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const url = `https://api.sunabar.gmo-aozora.com/personal/v1/accounts`;
    const config = {
      method: 'get',
      url: url,
      headers: {
        'Accept': 'application/json;charset=UTF-8', 
        'x-access-token': `${process.env.EVENT_ACCOUNT_ACCESS_TOKEN}`
      },
    };
    //リクエストの詳細をコンソールに出力
    console.log('Request Config:', config);

    const response = await axios.request(config);
    res.status(response.status).json(response.data);
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
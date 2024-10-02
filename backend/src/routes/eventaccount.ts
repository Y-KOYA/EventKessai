import express, { Router, Request, Response } from 'express';
import morgan from 'morgan';
import axios from 'axios'

const router: Router = express.Router();
router.use(morgan('combined'));

interface TransferData {
  balances: [
    {
      accountId: string;
      accountTypeCode: string;
      accountTypeName: string;
      balance: string;
      baseDate: string;
      baseTime: string;
      withdrawableAmount: string;
      previousDayBalance: string;
      previousMonthBalance: string;
      currencyCode: string;
      currencyName: string;
    }
  ],
  spAccountBalances: [
    {
      accountId: string;
      odBalance: string;
      tdTotalBalance: string;
      fodTotalBalanceYenEquivalent: string;
      spAccountFcyBalances: any[];
    },
    {
      accountId: string,
      odBalance: string,
      tdTotalBalance: string,
      fodTotalBalanceYenEquivalent: string,
      spAccountFcyBalances: any[];
    }
  ]
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const accountsUrl = "https://api.sunabar.gmo-aozora.com/personal/v1/accounts";
    const balancesUrl = "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances";
    
    const config = {
      method: 'get',
      headers: {
        'Accept': 'application/json;charset=UTF-8', 
        'Content-Type': 'application/json;charset=UTF-8', 
        'x-access-token': `${process.env.EVENT_ACCOUNT_ACCESS_TOKEN}`
      },
    };

    const [responseAccounts, responseBalances] = await Promise.all([
      axios.request({ ...config, url: accountsUrl }),
      axios.request({ ...config, url: balancesUrl })
    ]);

    const combinedData = {
      accounts: responseAccounts.data,
      balances: responseBalances.data
    };

    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error occurred while making request:', error);
    res.status(500).json({ message: 'Failed to send request to API' });
  }
});


export default router;
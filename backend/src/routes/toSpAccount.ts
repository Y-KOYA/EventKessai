import express, { Router, Request, Response } from 'express';
import morgan from 'morgan';
import axios from 'axios'

// イベント口座からつかいわけ口座へ振替
const router: Router = express.Router();
router.use(morgan('combined'));

interface TransferRequest {
  depositSpAccountId: string;
  paymentAmount: string;
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const { depositSpAccountId, paymentAmount }: TransferRequest = req.body;
            // 入金口座（つかいわけ口座）,入金金額
    const requestData = {
      depositSpAccountId: depositSpAccountId,
      debitSpAccountId: `${process.env.TO_SP_ACCOUNT_ID}`,
      paymentAmount: paymentAmount
    }
    const url = `https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer`;
    const config = {
      method: 'post',
      url: url,
      headers: {
        'Accept': 'application/json;charset=UTF-8', 
        'Content-Type': 'application/json;charset=UTF-8', 
        'x-access-token': `${process.env.EVENT_ACCOUNT_ACCESS_TOKEN}`
      },
      data: requestData
    };

    console.log('Request Config:', config);

    const response = await axios.request(config);
    res.status(response.status).json(response.data);
  } catch (error) {
      console.error('Error occurred while making request:', error);
      res.status(500).json({ message: 'Failed to send request to API' });
  }
});

export default router;
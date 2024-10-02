import express, { Router, Request, Response } from 'express';
import morgan from 'morgan';
import axios from 'axios'

const router: Router = express.Router();
router.use(morgan('combined'));

interface TransferData {
  accountId: string;
  transferDesignatedDate: string;
  transferDateHolidayCode: string;
  totalCount: string;
  totalAmount: string;
  transfers: [
    {
      itemId: string;
      transferAmount: string;
      beneficiaryBankCode: string;
      beneficiaryBranchCode: string;
      accountTypeCode: string;
      accountNumber: string;
      beneficiaryName: string;
    }
  ]
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const transferDesignatedDate = `${yyyy}-${mm}-${dd}`;
    const { myaccountId, mytotalAmount, mytransfers } = req.body;

    const requestData:TransferData = {
      accountId: myaccountId,
      transferDesignatedDate: transferDesignatedDate,
      transferDateHolidayCode: "1",
      totalCount: "1",
      totalAmount: mytotalAmount,
      transfers: [
        { 
          itemId:"1", 
          transferAmount: mytransfers, 
          beneficiaryBankCode: `${process.env.BENEFICIARY_BANK_CODE}`,
          beneficiaryBranchCode:`${process.env.BENEFICIARY_BRANCH_CODE}`, 
          accountTypeCode:`${process.env.ACCOUNT_TYPE_CODE}`, 
          accountNumber:`${process.env.ACCOUNT_NUMBER}`, 
          beneficiaryName:`${process.env.BENEFICIARY_NAME}`
        }
      ]
    }
    const url = `${process.env.API_URL_MYACCOUNT_TRANSFER}`;

    const config = {
      method: 'post',
      url: url,
      headers: {
        'Accept': 'application/json;charset=UTF-8', 
        'Content-Type': 'application/json;charset=UTF-8', 
        'x-access-token': `${process.env.MYACCOUNT_ACCESS_TOKEN}`
      },
      data: requestData
    };
    const response = await axios.request(config);
    res.status(response.status).json(response.data);
  } catch (error) {
      console.error('Error occurred while making request:', error);
      res.status(500).json({ message: 'Failed to send request to API' });
  }
});

export default router;
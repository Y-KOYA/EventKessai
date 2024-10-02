# section8_team-a

イベントアプリ　決済機能用API仕様書

| 機能         | メソッド | パス          | 説明                       |
|--------------|---------|--------------|----------------------------|
| 口座一覧照会  |  GET    | `/api/accounts` | 口座一覧の照会　       |
| 自分の口座からの振込依頼　　  | POST | `/api/myaccount` 　　　　    | 事前登録した自分の口座からイベント用口座へ振込依頼|
| イベント用口座残高照会 　　　| GET  | `/api/eventaccount` 　　　　　 | イベント用口座およびつかいわけ口座すべての残高照会    |
| イベント用口座子口座への振替 | POST | `/api/toSpAccount` | イベント用口座からつかいわけ口座への振替    　　　       |
| イベント用口座入出金明細     | GET  | `/api/transactions`   　  | イベント用口座入出金明細        　　　　　　  |


## 口座一覧照会 [GET /api/account]
口座の一覧
+ Request
  + URL
    ```
    https://api.sunabar.gmo-aozora.com/personal/v1/accounts
    ```
+ Response 200 (application/json)
  + Body
    ```
    {
      "balances": [
        {
          "accountId": "{{accountId}}",
          "accountTypeCode": "01",
          "accountTypeName": "普通預金（有利息）",
          "balance": "{{balance}}",
          "baseDate": "{{today}}",
          "baseTime": "{{nowtime}}",
          "withdrawableAmount": "{{withdrawableAmount}}",
          "previousDayBalance": "{{previousDayBalance}}",
          "previousMonthBalance": "0",
          "currencyCode": "JPY",
          "currencyName": "日本円"
        }
      ],
      "spAccountBalances": [
        {
          "accountId": "{{accountId}}",
          "odBalance": "{{odBalance}}",
          "tdTotalBalance": "0",
          "fodTotalBalanceYenEquivalent": "0",
          "spAccountFcyBalances": []
        },
        {
          "accountId": "{{accountId}}",
          "odBalance": "{{odBalance}}",
          "tdTotalBalance": "0",
          "fodTotalBalanceYenEquivalent": "0",
          "spAccountFcyBalances": []
        }
      ]
    }
    ```

## 自分の口座からの振込 [POST /api/myaccount]
事前登録した自分の口座からイベント用口座へ振込依頼
+ Request (application/json)
  + URL
    ```
    https://api.sunabar.gmo-aozora.com/personal/v1/transfer/request
    ```
  + Body
    ```
    { 
      "accountId":"{{accountId}}",
      "transferDesignatedDate":{{today}}, 
      "transferDateHolidayCode":"1", 
      "totalCount":"1", 
      "totalAmount":"{{amount}}", 
      "transfers":
        [
          { 
            "itemId":"1", 
            "transferAmount":"{{amount}}", 
            "beneficiaryBankCode":"0310",
            "beneficiaryBranchCode":"{{branchcode}}", 
            "accountTypeCode":"1", 
            "accountNumber":"{{eventAccountNumber}}", 
            "beneficiaryName":"{{eventAccountName}}"
          }
        ] 
    }
    ```
+ Response 201 (application/json)
  + Body
    ```
    {
      "accountId": "{{eventAccountId}}",
      "resultCode": "2",
      "applyNo": "{{applyNo}}"
    }
    ```
+ Response 400
  + Body
    ```
    {
      "errorCode": "220011",
      "errorMessage": "エラーが発生しました。",
      "errorDetails": [
        {
          "errorDetailsCode": "{{errorDetailsCode}}",
          "errorDetailsMessage": "{{errorDetailsMessage}}"
        }
      ],
      "transferErrorDetails": []
    }
    ```

## イベント用口座の残高照会 [GET /api/eventaccount]
イベント用口座およびつかいわけ口座のすべての残高照会
+ Request
  + URL
    ```
    https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances
    ```
+ Response 200 (application/json)
  + Body
    ```
    {
      "balances": [
        {
          "accountId": "{{accountId}}",
          "accountTypeCode": "01",
          "accountTypeName": "普通預金（有利息）",
          "balance": "{{balance}}",
          "baseDate": "{{today}}",
          "baseTime": "{{nowtime}}",
          "withdrawableAmount": "{{withdrawableAmount}}",
          "previousDayBalance": "{{previousDayBalance}}",
          "previousMonthBalance": "0",
          "currencyCode": "JPY",
          "currencyName": "日本円"
        }
      ],
      "spAccountBalances": [
        {
          "accountId": "{{accountId}}",
          "odBalance": "{{odBalance}}",
          "tdTotalBalance": "0",
          "fodTotalBalanceYenEquivalent": "0",
          "spAccountFcyBalances": []
        },
        {
          "accountId": "{{accountId}}",
          "odBalance": "{{odBalance}}",
          "tdTotalBalance": "0",
          "fodTotalBalanceYenEquivalent": "0",
          "spAccountFcyBalances": []
        }
      ]
    }
    ```

## イベント用口座からつかいわけ口座への振替 [POST /api/toSpAccount]
+ Request
  + URL
    ```
    https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer
    ```
  + Body
    ```
    { 
      "depositSpAccountId": "{{depositSpAccountId}}",
      "paymentAmount": "{{paymentAmount}}" 
    }
    ```
+ Response 200 (application/json)
  + Body
    ```
    {
      "acceptDatetime": "{{acceptDatetime}}",
      "depositSpAccountId": "{{depositSpAccountId}}",
      "debitSpAccountId": "{{debitSpAccountId}}",
      "currencyCode": "JPY",
      "currencyName": "日本円",
      "paymentAmount": "{{paymentAmount}}"
    }
    ```

## イベント用口座の入出金明細 [GET /api/transactions]
+ Request
  + URL
    ```
    https://api.sunabar.gmo-aozora.com/personal/v1/accounts/transactions
    ```
  + Body
    ```
    {
      "accountId": "{{accountId}}"
    },
    ```
+ Response 200 (application/json)
  + Body
    ```
    {
      "accountId": "{{accountId}}",
      "currencyCode": "JPY",
      "currencyName": "日本円",
      "dateFrom": "{{dateFrom}}",
      "dateTo": "{{dateTo}}",
      "baseDate": "{{baseDate}}",
      "baseTime": "{{baseTime}}",
      "hasNext": true or false,
      "nextItemKey": "{{nextItemKey}}",
      "count": "500",
      "transactions": [
        {
          "transactionDate": "{{transactionDate}}",
          "valueDate": "{{valueDate}}",
          "transactionType": "{{transactionType}}",
          "amount": "{{amount}}",
          "remarks": "{{振込 オナマエ}}",
          "balance": "{{balance}}",
          "itemKey": "{{itemKey}}"
        }
      ]
    }
    ```
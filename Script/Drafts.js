/*
Surge: type=http-response,pattern=^https:\/\/backend\.getdrafts\.com\/api\/.*\/verification*,script-path=,requires-body=1,max-size=0
*/
var obj = JSON.parse($response.body);

obj= {
  "active_expires_at" : "2099-01-01T00:00:00Z",
  "is_subscription_active" : true,
  "active_subscription_type" : "premium",
  "is_blocked" : false
};

$done({body: JSON.stringify(obj)});

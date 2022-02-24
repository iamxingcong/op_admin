const domain = document.domain;
 


console.log(domain);


export const APIHOST = "https://test-api-big.testsite.woa.com";
 



export const APIURL = (domain == 'big.woa.com' ? 'https://api-big.woa.com' : 'https://test-api-big.testsite.woa.com');

 

export const APIURLnos = (domain == 'big.woa.com' ? 'http://api-big.woa.com' : 'http://test-api-big.testsite.woa.com');


var ts  = (domain == 'big.woa.com' ? 'https://api-big.woa.com' : 'https://test-api-big.testsite.woa.com');
console.log(ts)


function isInteger(x) {
    return x % 1 === 0;
}

export function isValidBookCode(code)
{   
	
	return(isInteger(code) && code >=0 & code.length <= 13);
}

export function isPercentage(code)
{  
	return((code === '') || (isInteger(code) && code >=0 & code < 100));
}

export function isNotNegativeInteger(number)
{
	return((number.length===0)||(isInteger(number) && number >=0));
}

export function isPositiveInteger(number)
{
	return((isInteger(number) && number >0));
}


export function isAmount(amount)
{    
     var regex  = /^\d+(?:\.\d{1,2})$/;
	return (isPositiveInteger(amount) || regex.test(amount))
}
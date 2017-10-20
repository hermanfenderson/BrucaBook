//Metodi helpers per la gestione dei campi e dei codici EAN
//Questa roba sarà utilizzata in giro per BrucaBook ovunque ci sia un codice EAN

function eanCheckDigit(s){
    var result = 0;
    for (var counter = s.length-1; counter >=0; counter--){
        result = result + parseInt(s.charAt(counter)) * (1+(2*(counter % 2)));
    }
    return (10 - (result % 10)) % 10;
}


export function isValidEAN(code)
{ 
  if (code.length !==13) return false;
  var number = code.slice(0,12);
  var check = code.slice(-1);
 
  if (eanCheckDigit(number) == check) return true;
  return false;
}

export function isInternalEAN(code)
{ 
  if (code.length !==13) return false;
  var number = code.slice(0,12);
  var check = code.slice(-1);
 
  if ((eanCheckDigit(number) == check) && (code[0] === '2')) return true;
  return false;
}


export function generateEAN(number)
{ 
  //Genero il numero che mi serve a partire dal codice interno... 
  if (number<=99999999999) { number = "2" + ("0000000000"+ number).slice(-11); }
  var result = number.concat(eanCheckDigit(number));
  return result;
}

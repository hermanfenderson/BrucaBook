//Metodi helpers per la gestione dei campi e dei codici EAN
//Questa roba sarà utilizzata in giro per BrucaBook ovunque ci sia un codice EAN

function eanCheckDigit(s){
    var result = 0;
    for (var counter = s.length-1; counter >=0; counter--){
        result = result + parseInt(s.charAt(counter)) * (1+(2*(counter % 2)));
    }
    return (10 - (result % 10)) % 10;
}

//Per ora è uno stub
export function getBookByEAN13(ean13)
{ 
  const books = {"2000000000015": {"titolo": "I promessi sposi", "autore": "Alessandro Manzoni", "prezzo": "9.90"},
       "2000000000022": {"titolo": "Pinocchio", "autore": "Collodi", "prezzo": "5.00"},
       "2000000000039": {"titolo": "La fuga del cavallo morto", "autore": "Mauro Minenna", "prezzo": "5.90"}};  
  if (books[ean13]) return books[ean13];
  return {};
}

export function isValidEAN(code)
{ 
  if (code.length !==13) return false;
  var number = code.slice(0,12);
  var check = code.slice(-1);
  console.log(number);
  console.log(check);
  console.log(eanCheckDigit(number))
  if (eanCheckDigit(number) == check) return true;
  return false;
}

export function generateEAN(number)
{ 
  //Genero il numero che mi serve a partire dal codice interno... 
  if (number<=99999999999) { number = "2" + ("0000000000"+ number).slice(-11); }
  var result = number.concat(eanCheckDigit(number));
  return result;
}

import XLSX from 'xlsx';

import fileDownload from  'react-file-download';
//import zipcelx from 'zipcelx';
require('zipcelx');


function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!==s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

export function saveXlsxFromWb(wb, fileName)
{
	const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
	fileDownload(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fileName,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

export function aoa_to_sheet(data, workbook, sheetName)
{
	   var worksheet = XLSX.utils.aoa_to_sheet(data);
	   XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
	  
}
 
 
export function createWorkbook()
{
	return XLSX.utils.book_new();
}
export function createZipcelxConfig(data, fileName, hasHeader, numericFields)
{
	console.log(data);
	let config = {filename: fileName, sheet: {data: []}}
	for (let i=0; i<data.length; i++)
		{   let row = [];
			for(var propt in data[i])
				{
				row.push({value: data[i][propt], type: 'string'})
				if (propt > 4 && i>0) row[propt].type='number';
				}
			config.sheet.data.push(row);	
		}
	return config;
	
}

export function aoa_to_xlsx(data, sheetName, fileName, hasHeader, numericFields)
{
	
	let config = createZipcelxConfig(data, fileName, hasHeader, numericFields);
	window.zipcelx(config);
	
}
 

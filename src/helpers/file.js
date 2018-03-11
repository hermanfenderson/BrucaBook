import zipcelx from 'zipcelx/lib/module';

//import json2xlsx from 'json2xlsx-export';

export function createZipcelxConfig(data, fileName, hasHeader, numericFields)
{
	let config = {filename: fileName, sheet: 
    {
      data: []
    }	
	};
      
	for (let i=0; i<data.length; i++)
		{   let row = [];
			for(let j=0; j<data[i].length; j++)
				{
				row.push({value: data[i][j], type: 'string'})
				}
				
			if ((hasHeader && i>0) || !hasHeader) 
					{if (numericFields) 
						for (var numField in numericFields) 
							{   
								row[numericFields[numField]].type='number';
								}
					}	
					
			config.sheet.data.push(row);	
		}
	return config;
	
}

export function aoa_to_xlsx(data, fileName, hasHeader, numericFields)
{
	
	let config = createZipcelxConfig(data, fileName, hasHeader, numericFields);
	zipcelx(config);
	//json2xlsx(config);
}
 

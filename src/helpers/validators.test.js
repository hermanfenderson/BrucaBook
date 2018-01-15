//Il mio primo test
import {isInteger, isValidBookCode, isPercentage} from './validators';
describe('UNIT -> helpers/validators', () => { 

describe('isInteger()', () => {
	test('3 è intero', () => {
	  expect(isInteger(3)).toBe(true);
	});
	
	test('3.4 non è intero', () => {
	  expect(isInteger(3.4)).toBe(false);
	});
	
	test('la stringa 3 è intero', () => {
	  expect(isInteger('3')).toBe(true);
	});
	
	test('la stringa 3a non è intero', () => {
	  expect(isInteger('3a')).toBe(false);
	});
	
	test('la stringa a3 non è intero', () => {
	  expect(isInteger('a3')).toBe(false);
	});
});

describe('isValidBookCode()', () => {
	test('a non è un codice valido', () => {
	  expect(isValidBookCode('a')).toBe(false);
	});
	
	test('3.4 non è un codice valido', () => {
	  expect(isValidBookCode(3.4)).toBe(false);
	});
	
	test('la stringa 333 è un codice valido', () => {
	  expect(isValidBookCode('333')).toBe(true);
	});
	
	
	test('333 è un codice valido', () => {
	  expect(isValidBookCode('333')).toBe(true);
	});
	
	test('9876543210 è troppo lunga', () => {
	  expect(isValidBookCode('9876543210')).toBe(false);
	});
	
});

describe('isPercentage()', () => {
	test('a non è una percentuale', () => {
	  expect(isPercentage('a')).toBe(false);
	});
	
	test('3.4 non è una percentuale', () => {
	  expect(isPercentage(3.4)).toBe(false);
	});
	
	
	test('333 non è una percentuale', () => {
	  expect(isPercentage('333')).toBe(false);
	});
	
	test('98 è una percentuale', () => {
	  expect(isPercentage('98')).toBe(true);
	});
	
});
	
	
});
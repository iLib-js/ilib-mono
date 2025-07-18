import ResBundle from '../ilib-es6/src/ResBundle.js';
import AddressFmt from './src/AddressFmt.js';

async function debugLocaleData() {
    console.log('Testing locale data loading...');
    
    try {
        // Test Dutch locale
        console.log('\n--- Testing Dutch locale ---');
        const rb = new ResBundle({
            locale: 'nl-NL',
            name: 'addressres'
        });
        console.log('Dutch ResBundle created:', rb);
        
        // Test Korean locale
        console.log('\n--- Testing Korean locale ---');
        const rb2 = new ResBundle({
            locale: 'ko-KR',
            name: 'addressres'
        });
        console.log('Korean ResBundle created:', rb2);
        
        // Test AddressFmt with Korean
        console.log('\n--- Testing AddressFmt with Korean ---');
        const fmt = new AddressFmt({locale: 'en-GB'});
        const info = await fmt.getFormatInfo('ko');
        console.log('Format info:', info);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

debugLocaleData(); 
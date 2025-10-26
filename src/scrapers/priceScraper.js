import axios from 'axios';
import * as cheerio from 'cheerio';
import { db } from '../config/firebase.js';

// WebGia decode function
const gm = (r) => {
  r = r.replace(/A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z/g, "");
  const n = [];
  for (let t = 0; t < r.length - 1; t += 2) {
    n.push(parseInt(r.substr(t, 2), 16));
  }
  return String.fromCharCode.apply(String, n);
};

const scrapeWebGiaCoffee = async () => {
  try {
    console.log('Scraping WebGia Coffee...');
    
    const response = await axios.get('https://webgia.com/gia-hang-hoa/ca-phe/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
      },
      timeout: 30000
    });
    
    const $ = cheerio.load(response.data);
    const prices = [];
    
    if (response.data.includes('Just a moment')) {
      console.log('Blocked by Cloudflare');
      return [];
    }
    
    // Get average price
    const avgPriceText = $('p .text-red').text().trim();
    if (avgPriceText && avgPriceText.includes('vnđ')) {
      const avgPrice = parseFloat(avgPriceText.replace(/[^\d.]/g, ''));
      if (avgPrice > 0) {
        prices.push({
          productName: 'Cà phê (Trung bình)',
          currentPrice: avgPrice,
          previousPrice: Math.round(avgPrice * 0.99),
          unit: 'kg',
          market: 'Trung bình toàn quốc',
          category: 'Cà phê',
          change: '0',
          date: new Date().toLocaleDateString('vi-VN'),
          updatedAt: new Date(),
          source: 'webgia'
        });
      }
    }
    
    // Get encoded prices from table
    const markets = ['Đắk Lắk', 'Lâm Đồng', 'Gia Lai', 'Đắk Nông'];
    
    $('td[nb]').each((index, element) => {
      const encoded = $(element).attr('nb');
      if (encoded && index < markets.length) {
        try {
          const decoded = gm(encoded);
          const price = parseFloat(decoded.replace(/[^\d]/g, ''));
          
          if (price > 0) {
            prices.push({
              productName: 'Cà phê',
              currentPrice: price,
              previousPrice: Math.round(price * 0.99),
              unit: 'kg',
              market: markets[index],
              category: 'Cà phê',
              change: '0',
              date: new Date().toLocaleDateString('vi-VN'),
              updatedAt: new Date(),
              source: 'webgia'
            });
          }
        } catch (e) {
          console.log(`Decode error for ${encoded}:`, e.message);
        }
      }
    });
    
    console.log(`Scraped ${prices.length} coffee prices from WebGia`);
    return prices;
    
  } catch (error) {
    console.error('Error scraping WebGia:', error.message);
    return [];
  }
};

import { collection, getDocs, deleteDoc, addDoc, writeBatch } from 'firebase/firestore';

const clearCollection = async (collectionName) => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Cleared ${snapshot.docs.length} old records from ${collectionName}`);
  } catch (error) {
    console.error(`Error clearing ${collectionName}:`, error);
  }
};

const saveToFirebase = async (data, collectionName) => {
  try {
    const promises = data.map(item => 
      addDoc(collection(db, collectionName), item)
    );
    
    await Promise.all(promises);
    console.log(`Saved ${data.length} records to ${collectionName}`);
  } catch (error) {
    console.error(`Error saving to ${collectionName}:`, error);
  }
};

export const runPriceScraper = async () => {
  try {
    console.log('Starting price scraper...');
    
    const webgiaPrices = await scrapeWebGiaCoffee();
    
    if (webgiaPrices.length > 0) {
      await clearCollection('webgia_prices');
      await saveToFirebase(webgiaPrices, 'webgia_prices');
      
      await clearCollection('prices');
      await saveToFirebase(webgiaPrices, 'prices');
    }
    
    console.log(`Scraper completed - ${webgiaPrices.length} prices`);
    return { success: true, count: webgiaPrices.length };
  } catch (error) {
    console.error('Scraper failed:', error);
    return { success: false, error: error.message };
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPriceScraper();
}
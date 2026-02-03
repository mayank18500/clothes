const checkCategory = async (fetch, category) => {
    try {
        const url = `http://localhost:5000/api/products?category=${category}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(`--- Category: ${category} ---`);
        console.log(`Count: ${data.length}`);
        if (data.length > 0) {
            console.log('Categories found:', [...new Set(data.map(p => p.category))]);
            console.log('First Item:', data[0].name);
        } else {
            console.log('No items found.');
        }
    } catch (err) {
        console.error(`Error fetching ${category}:`, err.message);
    }
};

const run = async () => {
    try {
        const fetch = (await import('node-fetch')).default;
        await checkCategory(fetch, 'men');
        await checkCategory(fetch, 'women');
        await checkCategory(fetch, 'accessories');
        await checkCategory(fetch, 'sale');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();

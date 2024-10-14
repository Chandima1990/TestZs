const fs = require('fs');

const records = [];
for (let i = 1; i <= 1000; i++) {
  records.push({
    id: i,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    role: i % 2 === 0 ? 'Developer' : 'Designer'
  });
}

fs.writeFileSync('../../public/assets/records.json', JSON.stringify(records, null, 2));
console.log('Generated 1000 records in records.json');

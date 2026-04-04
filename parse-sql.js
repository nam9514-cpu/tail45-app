/**
 * SQL 파일에서 member와 dog 데이터를 파싱하여 customer-data.js 생성
 */
const fs = require('fs');
const path = require('path');

const sqlContent = fs.readFileSync(path.join(__dirname, 'tail45-final.sql'), 'utf8');

// ── member 테이블 파싱 ──
const members = [];
const memberRegex = /\((\d+),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*([^,]*),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'?([^',]*)'?,\s*'([^']*)',\s*'?([^',]*)'?,\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*'([^']*)',\s*\d+,\s*\d+,\s*\d+,\s*\d+,\s*\d+,\s*'[^']*',\s*'?[^']*'?,\s*\d+,\s*\d+,\s*'?([^',]*)'?,\s*'?([^',]*)'?/g;

// Simpler approach: extract lines that look like member data
const memberLines = sqlContent.split('\n').filter(line => 
    line.includes("'KR'") && line.includes("'m2") && line.match(/'\d{10,}'|'010\d{8}'/)
);

console.log(`Found ${memberLines.length} potential member lines`);

// Parse each member line with a simpler approach
const memberValueRegex = /\((\d+),\s*'KR',\s*'(m[^']+)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',/g;

for (const line of memberLines) {
    let match;
    const lineRegex = /\((\d+),\s*'KR',\s*'(m[^']+)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*([^,]*),\s*'([^']*)'/g;
    match = lineRegex.exec(line);
    if (match) {
        let phone = match[8].replace(/[^0-9]/g, '');
        // Normalize phone: add leading 0 if needed
        if (phone.length === 10 && !phone.startsWith('0')) {
            phone = '0' + phone;
        }
        
        members.push({
            code: match[2],
            email: match[3],
            name: match[6],
            gender: match[7],
            phone: phone,
            birth: match[10],
            address: match[12] || ''
        });
    }
}

console.log(`Parsed ${members.length} members`);

// ── dog 테이블 파싱 ──
const dogs = [];
const dogLines = sqlContent.split('\n').filter(line => 
    line.includes("('m2") && line.includes("',") && !line.includes("'KR'") && line.match(/소형|중형|대형|초소형|초대형/)
);

console.log(`Found ${dogLines.length} potential dog lines`);

for (const line of dogLines) {
    const dogRegex = /\('(m[^']+)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'\)/g;
    let match;
    while ((match = dogRegex.exec(line)) !== null) {
        dogs.push({
            ownerCode: match[1],
            ownerName: match[2],
            name: match[3],
            type: match[4],
            gender: match[5],
            size: match[6],
            neut: match[7],
            weight: match[8],
            birth: match[9]
        });
    }
}

console.log(`Parsed ${dogs.length} dogs`);

// Deduplicate members by code
const memberMap = new Map();
for (const m of members) {
    if (!memberMap.has(m.code)) {
        memberMap.set(m.code, m);
    }
}
const uniqueMembers = [...memberMap.values()];
console.log(`Unique members: ${uniqueMembers.length}`);

// Filter to only members who start with "m" code (real members, not admin)
const filteredMembers = uniqueMembers.filter(m => m.code.startsWith('m'));
console.log(`Filtered members (code starts with 'm'): ${filteredMembers.length}`);

// ── JS 파일 생성 ──
let output = `// ====== 기존 고객 데이터 (SQL에서 자동 생성) ======
// 생성일: ${new Date().toISOString().slice(0, 10)}
// member 테이블: ${filteredMembers.length}명, dog 테이블: ${dogs.length}마리

const EXISTING_MEMBERS = [\n`;

for (const m of filteredMembers) {
    const esc = (s) => (s || '').replace(/\\/g, '').replace(/'/g, "\\'");
    output += `  { code:'${m.code}', name:'${esc(m.name)}', phone:'${m.phone}', email:'${esc(m.email)}', gender:'${m.gender}', birth:'${m.birth}', address:'${esc(m.address)}' },\n`;
}

output += `];\n\nconst EXISTING_DOGS = [\n`;

for (const d of dogs) {
    const esc = (s) => (s || '').replace(/\\/g, '').replace(/'/g, "\\'");
    output += `  { ownerCode:'${d.ownerCode}', owner:'${esc(d.ownerName)}', name:'${esc(d.name)}', type:'${esc(d.type)}', gender:'${d.gender}', size:'${d.size}', weight:'${d.weight}', birth:'${d.birth}' },\n`;
}

output += `];\n`;

fs.writeFileSync(path.join(__dirname, 'js', 'customer-data.js'), output, 'utf8');
console.log('✅ js/customer-data.js generated successfully!');
console.log(`   Members: ${filteredMembers.length}`);
console.log(`   Dogs: ${dogs.length}`);

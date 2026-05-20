export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return corsResponse();
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (path === '/api/health') return json({ status: 'ok' });
      if (path === '/api/auth/login' && request.method === 'POST') return await handleLogin(request, env);
      if (path === '/api/auth/signup' && request.method === 'POST') return await handleSignup(request, env);
      if (path === '/api/auth/change-password' && request.method === 'POST') return await changePassword(request, env);
      if (path === '/api/user/me' && request.method === 'GET') return await getMe(request, env);
      if (path === '/api/user/update' && request.method === 'POST') return await updateUser(request, env);
      if (path === '/api/pets' && request.method === 'GET') return await getPets(request, env);
      if (path === '/api/pets/add' && request.method === 'POST') return await addPet(request, env);
      if (path === '/api/pets/delete' && request.method === 'POST') return await deletePet(request, env);
      return json({ error: 'Not found' }, 404);
    } catch (e) {
      return json({ error: 'Server error', detail: e.message }, 500);
    }
  }
};

function getToken(request) {
  const auth = request.headers.get('Authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

function parseToken(token) {
  try { return JSON.parse(atob(token)); } catch (e) { return null; }
}

async function auth(request, env) {
  const token = getToken(request);
  if (!token) return null;
  const data = parseToken(token);
  if (!data || !data.code || data.exp < Date.now()) return null;
  const member = await env.DB.prepare('SELECT * FROM member WHERE code = ? LIMIT 1').bind(data.code).first();
  return member || null;
}

async function handleLogin(request, env) {
  const body = await request.json();
  const phone = body.phone || '';
  const password = body.password || '';
  if (!phone || !password) return json({ error: '전화번호와 비밀번호를 입력해주세요' }, 400);
  const digits = phone.replace(/\D/g, '');
  const withZero = digits.startsWith('0') ? digits : '0' + digits;
  const withoutZero = digits.startsWith('0') ? digits.slice(1) : digits;
  const member = await env.DB.prepare(
    'SELECT * FROM member WHERE phone = ? OR phone = ? LIMIT 1'
  ).bind(withZero, withoutZero).first();
  if (!member) return json({ error: '등록되지 않은 전화번호입니다' }, 401);
  const hasPassword = member.password && member.password.trim() !== '';
  if (hasPassword) {
    if (password !== member.password) return json({ error: '비밀번호가 올바르지 않습니다' }, 401);
  } else {
    if (password !== member.name) return json({ error: '첫 로그인 시 비밀번호란에 성함을 입력해주세요' }, 401);
  }
  const dogsResult = await env.DB.prepare('SELECT * FROM dog WHERE owner = ?').bind(member.code).all();
  const tokenData = { code: member.code, num: member.num, exp: Date.now() + 2592000000 };
  const token = btoa(JSON.stringify(tokenData));
  const isKakao = member.kakao && member.kakao !== 'N' && member.kakao !== '';
  const isNaver = member.naver && member.naver !== 'N' && member.naver !== '';
  const provider = isKakao ? 'kakao' : isNaver ? 'naver' : 'phone';

  return json({
    success: true,
    token: token,
    isFirstLogin: !hasPassword,
    user: {
      num: member.num,
      code: member.code,
      name: member.name,
      phone: withZero,
      email: member.email || '',
      address: ((member.address1 || '') + ' ' + (member.address2 || '')).trim(),
      address1: member.address1 || '',
      address2: member.address2 || '',
      gender: member.gender || '',
      points: member.points || 0,
      passType: member.PassType || 0,
      passRemain: member.PassRemain || null,
      petTicket: member.PetTicket || 0,
      provider: provider
    },
    pets: (dogsResult.results || []).map(function(d) {
      return { id: d.code, name: d.name, type: d.type, size: d.size, gender: d.gender, weight: d.weight, birth: d.birth, neut: d.neut };
    })
  });
}

async function handleSignup(request, env) {
  const body = await request.json();
  const name = (body.name || '').trim();
  const phoneRaw = (body.phone || '').replace(/\D/g, '');
  const password = body.password || '';
  const email = (body.email || '').trim();
  const address1 = (body.address1 || '').trim();
  const address2 = (body.address2 || '').trim();
  const gender = (body.gender || '').trim();
  const birth = (body.birth || '').trim();
  const provider = (body.provider || 'phone').trim();
  const pets = Array.isArray(body.pets) ? body.pets : [];

  if (!name) return json({ error: '이름을 입력해주세요' }, 400);
  if (!phoneRaw) return json({ error: '전화번호를 입력해주세요' }, 400);
  if (provider === 'phone' && (!password || password.length < 6 || !/\d/.test(password) || !/[A-Za-z]/.test(password))) {
    return json({ error: '비밀번호는 영문과 숫자를 포함한 6자리 이상 입력해주세요' }, 400);
  }

  const withZero = phoneRaw.startsWith('0') ? phoneRaw : '0' + phoneRaw;
  const withoutZero = phoneRaw.startsWith('0') ? phoneRaw.slice(1) : phoneRaw;

  const existing = await env.DB.prepare(
    'SELECT code, password, name FROM member WHERE phone = ? OR phone = ? LIMIT 1'
  ).bind(withZero, withoutZero).first();
  if (existing) {
    const hasPwd = existing.password && existing.password.trim() !== '';
    if (hasPwd) {
      return json({ error: '이미 가입된 전화번호입니다. 로그인해주세요.' }, 409);
    }
    return json({ error: '이미 등록된 전화번호입니다. 로그인 화면에서 비밀번호란에 성함을 입력하여 첫 로그인을 진행해주세요.' }, 409);
  }

  const code = 'm' + nowStamp() + randSuffix(11);
  const registerdate = nowDate();
  const kakao = provider === 'kakao' ? 'Y' : 'N';
  const naver = provider === 'naver' ? 'Y' : 'N';

  await env.DB.prepare(
    'INSERT INTO member (code, country, name, phone, password, email, gender, birth, address1, address2, kakao, naver, register, registerdate, points) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(code, 'KR', name, withZero, password, email, gender, birth || null, address1, address2, kakao, naver, 1, registerdate, 0).run();

  const inserted = [];
  for (const pet of pets) {
    if (!pet || !pet.name) continue;
    const dogCode = 'd' + nowStamp() + randSuffix(8);
    await env.DB.prepare(
      'INSERT INTO dog (code, owner, name, type, size, gender, weight, birth, neut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(dogCode, code, pet.name, pet.type || '', pet.size || '', pet.gender || '', pet.weight || null, pet.birth || null, pet.neut ? 1 : 0).run();
    inserted.push({ id: dogCode, name: pet.name, type: pet.type || '', size: pet.size || '', gender: pet.gender || '', weight: pet.weight || null, birth: pet.birth || null, neut: pet.neut ? 1 : 0 });
  }

  const tokenData = { code, num: 0, exp: Date.now() + 2592000000 };
  const token = btoa(JSON.stringify(tokenData));

  return json({
    success: true,
    token,
    user: {
      num: 0,
      code,
      name,
      phone: withZero,
      email,
      address: (address1 + ' ' + address2).trim(),
      address1,
      address2,
      gender,
      points: 0,
      passType: 0,
      passRemain: null,
      petTicket: 0,
      provider
    },
    pets: inserted
  });
}

function nowStamp() {
  const d = new Date();
  return d.getFullYear().toString() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
}

function nowDate() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}

function randSuffix(len) {
  const chars = 'abcdef0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function changePassword(request, env) {
  const body = await request.json();
  const phone = body.phone || '';
  const newPassword = body.newPassword || '';
  if (!phone || !newPassword) return json({ error: '전화번호와 새 비밀번호를 입력해주세요' }, 400);
  if (newPassword.length < 6 || !/\d/.test(newPassword) || !/[A-Za-z]/.test(newPassword)) return json({ error: '영문과 숫자를 포함한 6자리 이상 입력해주세요' }, 400);
  const digits = phone.replace(/\D/g, '');
  const withZero = digits.startsWith('0') ? digits : '0' + digits;
  const withoutZero = digits.startsWith('0') ? digits.slice(1) : digits;
  const member = await env.DB.prepare(
    'SELECT * FROM member WHERE phone = ? OR phone = ? LIMIT 1'
  ).bind(withZero, withoutZero).first();
  if (!member) return json({ error: '등록되지 않은 전화번호입니다' }, 404);
  await env.DB.prepare('UPDATE member SET password = ? WHERE code = ?').bind(newPassword, member.code).run();
  return json({ success: true, message: '비밀번호가 설정되었습니다' });
}

async function getMe(request, env) {
  const member = await auth(request, env);
  if (!member) return json({ error: '로그인이 필요합니다' }, 401);
  return json({
    success: true,
    user: {
      num: member.num,
      code: member.code,
      name: member.name,
      phone: member.phone,
      email: member.email || '',
      address: ((member.address1 || '') + ' ' + (member.address2 || '')).trim(),
      gender: member.gender || '',
      points: member.points || 0,
      passType: member.PassType || 0,
      passRemain: member.PassRemain || null,
      petTicket: member.PetTicket || 0
    }
  });
}

async function updateUser(request, env) {
  const member = await auth(request, env);
  if (!member) return json({ error: '로그인이 필요합니다' }, 401);
  const body = await request.json();
  const fields = [];
  const values = [];
  if (body.email !== undefined) { fields.push('email = ?'); values.push(body.email); }
  if (body.address1 !== undefined) { fields.push('address1 = ?'); values.push(body.address1); }
  if (body.address2 !== undefined) { fields.push('address2 = ?'); values.push(body.address2); }
  if (fields.length === 0) return json({ error: '수정할 항목이 없습니다' }, 400);
  values.push(member.code);
  await env.DB.prepare('UPDATE member SET ' + fields.join(', ') + ' WHERE code = ?').bind(...values).run();
  return json({ success: true, message: '회원정보가 수정되었습니다' });
}

async function getPets(request, env) {
  const member = await auth(request, env);
  if (!member) return json({ error: '로그인이 필요합니다' }, 401);
  const result = await env.DB.prepare('SELECT * FROM dog WHERE owner = ?').bind(member.code).all();
  return json({
    success: true,
    pets: (result.results || []).map(function(d) {
      return { id: d.code, name: d.name, type: d.type, size: d.size, gender: d.gender, weight: d.weight, birth: d.birth, neut: d.neut };
    })
  });
}

async function addPet(request, env) {
  const member = await auth(request, env);
  if (!member) return json({ error: '로그인이 필요합니다' }, 401);
  const body = await request.json();
  if (!body.name) return json({ error: '반려견 이름을 입력해주세요' }, 400);
  const code = 'd' + Date.now() + Math.random().toString(36).slice(2, 8);
  await env.DB.prepare(
    'INSERT INTO dog (code, owner, name, type, size, gender, weight, birth, neut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(code, member.code, body.name, body.type || '', body.size || '', body.gender || '', body.weight || null, body.birth || null, body.neut || 0).run();
  return json({ success: true, message: '반려견이 등록되었습니다', id: code });
}

async function deletePet(request, env) {
  const member = await auth(request, env);
  if (!member) return json({ error: '로그인이 필요합니다' }, 401);
  const body = await request.json();
  if (!body.petCode) return json({ error: '반려견 코드가 필요합니다' }, 400);
  const pet = await env.DB.prepare('SELECT * FROM dog WHERE code = ? AND owner = ? LIMIT 1').bind(body.petCode, member.code).first();
  if (!pet) return json({ error: '해당 반려견을 찾을 수 없습니다' }, 404);
  await env.DB.prepare('DELETE FROM dog WHERE code = ?').bind(body.petCode).run();
  return json({ success: true, message: '반려견이 삭제되었습니다' });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

function corsResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

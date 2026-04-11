// ====== 견종 자동완성 데이터 & 로직 ======
// 백엔드의 normalizeBreed 함수 기반으로 동의어/오타/키워드 전부 포함
const BREED_LIST = [
    { name: '말티즈', keywords: ['말티', '몰티즈', '멀티즈', '말팆', '마티즈', '몰키즈', '말티즈'] },
    { name: '푸들', keywords: ['푸들', '푸둘', '추들', '푸득', '푸돌', '스탠푸', '퓨들', '푸등'] },
    { name: '포메라니안', keywords: ['포매', '포메', '포메라니안'] },
    { name: '비숑 프리제', keywords: ['비숑', '비숀', '비숄', '비숑프리제'] },
    { name: '시츄', keywords: ['시츄', '시추', '시푸'] },
    { name: '치와와', keywords: ['치와', '치와와'] },
    { name: '웰시 코기', keywords: ['웰시', '코기'] },
    { name: '시베리안 허스키', keywords: ['허스키', '시베리안'] },
    { name: '골든 리트리버', keywords: ['골든', '리트리버', '골댕'] },
    { name: '래브라도 리트리버', keywords: ['래브라도', '레브라도', '라브라도', '랩'] },
    { name: '비글', keywords: ['비글'] },
    { name: '슈나우저', keywords: ['슈나', '슈나우저'] },
    { name: '보더 콜리', keywords: ['보더', '콜리'] },
    { name: '진돗개', keywords: ['진도', '진돗', '백구', '황구'] },
    { name: '풍산개', keywords: ['풍산'] },
    { name: '시바견', keywords: ['시바'] },
    { name: '닥스훈트', keywords: ['닥스'] },
    { name: '요크셔 테리어', keywords: ['요크', '요키'] },
    { name: '스피츠', keywords: ['스피츠', '스피치'] },
    { name: '프렌치 불독', keywords: ['프렌치', '불독', '프불'] },
    { name: '퍼그', keywords: ['퍼그'] },
    { name: '사모예드', keywords: ['사모'] },
    { name: '알래스칸 말라뮤트', keywords: ['말라뮤트', '말라'] },
    { name: '오스트레일리안 셰퍼드', keywords: ['오시', '오스트레일리안'] },
    { name: '저먼 셰퍼드', keywords: ['저먼', '셰퍼', '쉐퍼', '세퍼'] },
    { name: '보스턴 테리어', keywords: ['보스턴'] },
    { name: '도베르만', keywords: ['도베르만'] },
    { name: '로트와일러', keywords: ['로트', '와일러', '로트와일러'] },
    { name: '미니어처 핀셔', keywords: ['미니핀', '핀셔'] },
    { name: '빠삐용', keywords: ['빠삐용', '파피용'] },
    { name: '코카 스파니엘', keywords: ['코카', '스파니엘', '스파니'] },
    { name: '킹찰스 스파니엘', keywords: ['킹찰스'] },
    { name: '잭 러셀 테리어', keywords: ['잭러셀', '잭'] },
    { name: '이탈리안 그레이하운드', keywords: ['이탈리안', 'ig', '아이쥐', '하운드'] },
    { name: '그레이트 피레니즈', keywords: ['피레니즈'] },
    { name: '셔틀랜드 쉽독', keywords: ['올드잉글리쉬', '쉽독', '셸티', '셀티', '셔틀랜드'] },
    { name: '차우차우', keywords: ['차우차우', '차우'] },
    { name: '달마시안', keywords: ['달마시안'] },
    { name: '버니즈 마운틴 독', keywords: ['버니즈', '마운틴'] },
    { name: '아키타', keywords: ['아키타'] },
    { name: '알래스칸 클리 카이', keywords: ['클리카이', '클리'] },
    { name: '하바네즈', keywords: ['하바네즈'] },
    { name: '바센지', keywords: ['바센지'] },
    { name: '동경이', keywords: ['동경'] },
    { name: '삽살개', keywords: ['삽살'] },
    { name: '케인 코르소', keywords: ['케인', '코르소'] },
    { name: '마리노이즈', keywords: ['마리노이즈', '말리노이즈'] },
    { name: '꼬똥 드 툴레아', keywords: ['꼬똥', '꼬동', '꼬숑', '꼬통'] },
    { name: '베들링턴 테리어', keywords: ['베들링턴', '베들'] },
    { name: '아메리칸 불리', keywords: ['불리'] },
    { name: '휘펫', keywords: ['휘펫', '위펫'] },
    { name: '웨스트 하이랜드 화이트 테리어', keywords: ['웨스티', '화이트테리어', '웨스트'] },
    { name: '폼피츠', keywords: ['폼피치', '폼피츠'] },
    { name: '말티푸', keywords: ['말티푸', '밀티', '발티푸', '멀티푸'] },
    { name: '골든두들', keywords: ['골든두들', '두들'] },
    { name: '말티코', keywords: ['말티코'] },
    { name: '그레이하운드', keywords: ['그레이하운드'] },
    { name: '믹스견', keywords: ['믹스', '잡종', '하이브리드', '시고르'] },
    { name: '기타', keywords: ['기타', '알수없음', '모름'] },
];

function handleBreedInput(query, idx) {
    const sugEl = document.getElementById(`breed-sug-${idx}`);
    const clearBtn = document.getElementById(`breed-clear-${idx}`);
    const hiddenInput = document.getElementById(`breed-hidden-${idx}`);
    if (!sugEl) return;

    const q = query.replace(/\s+/g, '').toLowerCase();
    if (clearBtn) clearBtn.style.display = query.length > 0 ? '' : 'none';
    if (hiddenInput) hiddenInput.value = '';

    if (!q) {
        const popular = ['말티즈', '푸들', '포메라니안', '시츄', '비글', '비숑 프리제', '골든 리트리버', '웰시 코기'];
        renderBreedSuggestions(popular, '', sugEl, idx);
        return;
    }

    const matched = [];
    const seen = new Set();
    for (const breed of BREED_LIST) {
        const nameMatch = breed.name.replace(/\s+/g, '').toLowerCase().includes(q);
        const kwMatch = breed.keywords.some(kw => kw.replace(/\s+/g, '').toLowerCase().includes(q) || q.includes(kw.replace(/\s+/g, '').toLowerCase()));
        if ((nameMatch || kwMatch) && !seen.has(breed.name)) {
            matched.push(breed.name);
            seen.add(breed.name);
        }
    }

    if (matched.length === 0) {
        sugEl.innerHTML = '<li class="no-result">검색 결과가 없습니다. 직접 입력해주세요.</li>';
        sugEl.classList.add('open');
        return;
    }

    renderBreedSuggestions(matched.slice(0, 10), q, sugEl, idx);
}

function renderBreedSuggestions(breeds, query, container, idx) {
    container.innerHTML = '';
    breeds.forEach(name => {
        const li = document.createElement('li');
        let displayName = name;
        if (query) {
            const matchIdx = name.toLowerCase().indexOf(query.toLowerCase());
            if (matchIdx !== -1) {
                displayName = name.slice(0, matchIdx) +
                    '<span class="breed-match">' + name.slice(matchIdx, matchIdx + query.length) + '</span>' +
                    name.slice(matchIdx + query.length);
            }
        }
        li.innerHTML = `<i class="ph ph-dog breed-icon"></i>${displayName}`;
        li.addEventListener('mousedown', (e) => {
            e.preventDefault(); 
            selectBreed(name, idx);
        });
        container.appendChild(li);
    });
    container.classList.add('open');
}

function selectBreed(name, idx) {
    const input = document.getElementById(`breed-input-${idx}`);
    const hiddenInput = document.getElementById(`breed-hidden-${idx}`);
    const sugEl = document.getElementById(`breed-sug-${idx}`);
    const clearBtn = document.getElementById(`breed-clear-${idx}`);
    if (input) input.value = name;
    if (hiddenInput) hiddenInput.value = name;
    if (sugEl) sugEl.classList.remove('open');
    if (clearBtn) clearBtn.style.display = '';
}

function clearBreedInput(idx) {
    const input = document.getElementById(`breed-input-${idx}`);
    const hiddenInput = document.getElementById(`breed-hidden-${idx}`);
    const sugEl = document.getElementById(`breed-sug-${idx}`);
    const clearBtn = document.getElementById(`breed-clear-${idx}`);
    if (input) { input.value = ''; input.focus(); }
    if (hiddenInput) hiddenInput.value = '';
    if (sugEl) sugEl.classList.remove('open');
    if (clearBtn) clearBtn.style.display = 'none';
}

document.addEventListener('click', (e) => {
    const wraps = document.querySelectorAll('.breed-autocomplete-wrap');
    wraps.forEach(wrap => {
        if (!wrap.contains(e.target)) {
            const sugEl = wrap.querySelector('.breed-suggestions');
            if (sugEl) sugEl.classList.remove('open');
        }
    });
});

let petIndexCounter = 0;

function addPetForm(e) {
    if(e) e.preventDefault();
    const container = document.getElementById('pet-forms-container');
    
    if (container.children.length >= 5) {
        showAlert('추가 제한', '반려견 정보는 최대 5마리까지만 등록할 수 있습니다.');
        return;
    }

    const idx = petIndexCounter++;
    
    // 첫번째 폼일땐 삭제버튼 없음
    const html = `
        <div class="pet-form-block mb-4 p-3" id="pet-form-${idx}" style="border: 1px solid #E5E7EB; border-radius: 8px; position:relative; background:#FDFDFD;">
            <div class="flex-end mb-2" style="justify-content: space-between; align-items:center;">
                <span style="font-weight:700; color:var(--primary); font-size:0.9rem;">🐶 반려견 정보 (${idx + 1}번째)</span>
                ${idx > 0 ? `<span class="text-danger pointer" style="font-size:0.8rem;" onclick="removePetForm(${idx})"><i class="ph ph-trash"></i> 삭제</span>` : ''}
            </div>
            <div class="input-group">
                <label>반려견 이름</label>
                <div class="input-wrapper" style="background:#fff;">
                    <i class="ph ph-dog"></i>
                    <input type="text" class="auth-petname" placeholder="멍동이">
                </div>
            </div>
            <div class="input-group">
                <label>견종</label>
                <div class="breed-autocomplete-wrap">
                    <div class="input-wrapper" style="background:#fff;">
                        <i class="ph ph-magnifying-glass"></i>
                        <input type="text" placeholder="견종 검색" autocomplete="off" oninput="handleBreedInput(this.value, ${idx})" onfocus="handleBreedInput(this.value, ${idx})" id="breed-input-${idx}">
                        <i class="ph ph-x-circle pointer action-icon text-gray" id="breed-clear-${idx}" style="display:none;" onclick="clearBreedInput(${idx})"></i>
                    </div>
                    <ul id="breed-sug-${idx}" class="breed-suggestions"></ul>
                    <input type="hidden" class="auth-pet-breed" id="breed-hidden-${idx}">
                </div>
            </div>
            <div class="age-row">
                <div class="input-group flex-1">
                    <label>년</label>
                    <div class="input-wrapper" style="background:#fff;">
                        <input type="number" class="auth-pet-age-year" placeholder="2" min="0" max="30">
                    </div>
                </div>
                <div class="input-group flex-1">
                    <label>개월</label>
                    <div class="input-wrapper" style="background:#fff;">
                        <input type="number" class="auth-pet-age-month" placeholder="2" min="0" max="11">
                    </div>
                </div>
            </div>
            <div class="input-group">
                <label>체중 (kg)</label>
                <div class="input-wrapper" style="background:#fff;">
                    <input type="number" class="auth-pet-weight" placeholder="23" min="0" max="100" step="0.1">
                </div>
            </div>
            <div class="input-group">
                <label>성별</label>
                <div style="display:flex; gap:10px; margin-top:6px;">
                    <label class="pet-radio-card" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:10px; border:1.5px solid #E5E7EB; border-radius:10px; cursor:pointer; font-size:0.9rem; font-weight:600; color:#555; background:#FAFAFA; transition:all 0.2s;" onclick="this.querySelector('input').checked=true; this.parentElement.querySelectorAll('.pet-radio-card').forEach(c=>{c.style.borderColor='#E5E7EB';c.style.background='#FAFAFA';c.style.color='#555';}); this.style.borderColor='var(--primary)';this.style.background='#E8F8F0';this.style.color='var(--primary)';">
                        <input type="radio" name="pet-gender-${idx}" class="auth-pet-gender" value="male" style="display:none;">
                        <i class="ph ph-gender-male" style="font-size:1.1rem;"></i> 남아
                    </label>
                    <label class="pet-radio-card" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:10px; border:1.5px solid #E5E7EB; border-radius:10px; cursor:pointer; font-size:0.9rem; font-weight:600; color:#555; background:#FAFAFA; transition:all 0.2s;" onclick="this.querySelector('input').checked=true; this.parentElement.querySelectorAll('.pet-radio-card').forEach(c=>{c.style.borderColor='#E5E7EB';c.style.background='#FAFAFA';c.style.color='#555';}); this.style.borderColor='var(--primary)';this.style.background='#E8F8F0';this.style.color='var(--primary)';">
                        <input type="radio" name="pet-gender-${idx}" class="auth-pet-gender" value="female" style="display:none;">
                        <i class="ph ph-gender-female" style="font-size:1.1rem;"></i> 여아
                    </label>
                </div>
            </div>
            <div class="input-group" style="margin-top:2px;">
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label class="pet-check-card" style="display:flex; align-items:center; gap:10px; padding:11px 14px; border:1.5px solid #E5E7EB; border-radius:10px; cursor:pointer; font-size:0.88rem; font-weight:500; color:#555; background:#FAFAFA; transition:all 0.2s;" onclick="var cb=this.querySelector('input');cb.checked=!cb.checked; if(cb.checked){this.style.borderColor='var(--primary)';this.style.background='#E8F8F0';this.style.color='var(--primary)';}else{this.style.borderColor='#E5E7EB';this.style.background='#FAFAFA';this.style.color='#555';}">
                        <input type="checkbox" class="auth-pet-neutered" style="display:none;">
                        <i class="ph ph-scissors" style="font-size:1.1rem;"></i>
                        <span>중성화 수술 완료</span>
                    </label>
                    <label class="pet-check-card" style="display:flex; align-items:center; gap:10px; padding:11px 14px; border:1.5px solid #E5E7EB; border-radius:10px; cursor:pointer; font-size:0.88rem; font-weight:500; color:#555; background:#FAFAFA; transition:all 0.2s;" onclick="var cb=this.querySelector('input');cb.checked=!cb.checked; if(cb.checked){this.style.borderColor='var(--primary)';this.style.background='#E8F8F0';this.style.color='var(--primary)';}else{this.style.borderColor='#E5E7EB';this.style.background='#FAFAFA';this.style.color='#555';}">
                        <input type="checkbox" class="auth-pet-vaccinated" style="display:none;">
                        <i class="ph ph-syringe" style="font-size:1.1rem;"></i>
                        <span>필수 예방 접종 완료</span>
                    </label>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);

    if (container.children.length >= 5) {
        const btn = document.getElementById('btn-add-pet');
        if (btn) btn.style.display = 'none';
    }
}

function removePetForm(idx) {
    const form = document.getElementById(`pet-form-${idx}`);
    if(form) form.remove();
    
    const container = document.getElementById('pet-forms-container');
    if (container && container.children.length < 5) {
        const btn = document.getElementById('btn-add-pet');
        if (btn) btn.style.display = '';
    }
}


// ====== MOCK DATA ======
const DB = {
    user: { 
        id: 'U1001', 
        name: '현욱',
        pointBalance: 12500, 
        phone: '01012345678',
        password: 'password1!',
        code: 'm20240101demo00000001',
        passwordChanged: true,
        pointHistory: [
            { id: 1, type: '적립', desc: '매장 상품 리뷰 혜택', date: '2026년 3월 27일', amount: '+100' },
            { id: 2, type: '사용', desc: '1시간 이용권', date: '2026년 3월 20일', amount: '-1500' },
            { id: 3, type: '적립', desc: '이벤트 리워드', date: '2026년 3월 15일', amount: '+500' },
            { id: 4, type: '사용', desc: '아이스 아메리카노 교환', date: '2026년 3월 10일', amount: '-60' },
            { id: 5, type: '적립', desc: '방문 보너스', date: '2026년 3월 1일', amount: '+50' },
            { id: 6, type: '적립', desc: '신규 가입 환영', date: '2026년 2월 20일', amount: '+1000' },
            { id: 7, type: '사용', desc: '2시간 이용권', date: '2026년 2월 15일', amount: '-2800' },
            { id: 8, type: '사용', desc: '간식 구매', date: '2026년 1월 25일', amount: '-800' },
            { id: 9, type: '적립', desc: '친구 추천 보너스', date: '2026년 1월 10일', amount: '+500' },
            { id: 10, type: '적립', desc: '사전예약 리워드', date: '2026년 1월 1일', amount: '+2000' }
        ]
    },
    pets: [
        { id: 'P01', name: '초코', size: '소형견' },
        { id: 'P02', name: '맥스', size: '대형견' }
    ],
    tickets: [],
    activeTicket: null,
    registeredUsers: [
        // 묵시적으로 가입된 데모 계정
        { phone: '01012345678', password: 'password1!', name: '현욱', code: 'm20240101demo00000001' }
    ]
};


let timerInterval = null;
let remainingSeconds = 0;
let totalSeconds = 0;
let authMode = 'login'; // 'signup' or 'login'
let selectedReservationDuration = null;

const els = {};

document.addEventListener('DOMContentLoaded', () => {
    initElements();
    bindEvents();
    initReservationDate();
    initDaypassCalendar();
    setInterval(checkDaypassExpiry, 60000);
    initYardStatus();
});

function initElements() {
    els.mainContent = document.getElementById('main-content');
    els.authView = document.getElementById('view-auth');
    els.bottomNav = document.getElementById('bottom-nav');
    els.sosBtn = document.getElementById('btn-sos');
    els.navItems = document.querySelectorAll('.nav-item');
    els.views = document.querySelectorAll('.view');
    
    // Auth Elements
    els.authTitle = document.getElementById('auth-title');
    els.authSignupFields = document.getElementById('auth-signup-fields');
    els.btnToggleAuth = document.getElementById('btn-toggle-auth');
    els.authToggleText = document.getElementById('auth-toggle-text');
    els.btnDoAuth = document.getElementById('btn-do-auth');
    els.authPassword = document.getElementById('auth-password');
    els.authName = document.getElementById('auth-name');
    els.authPhone = document.getElementById('auth-phone');
    els.authEmail = document.getElementById('auth-email');
    els.authAddress = document.getElementById('auth-address');
    els.authPetname = document.getElementById('auth-petname');
    
    // UI Elements

    
    els.homeQrImg = document.getElementById('home-qr-img');
    els.homeQrStatus = document.getElementById('home-qr-status');
    
    // Home Timer elements
    els.homeTimerCard = document.getElementById('home-timer-card');
    els.homeTimerIconBg = document.getElementById('home-timer-icon-bg');
    els.homeTimerIcon = document.getElementById('home-timer-icon');
    els.homeTimerText = document.getElementById('home-timer-text');
    els.homeTimerCountdown = document.getElementById('home-timer-countdown');
    els.homePointDisplay = document.getElementById('home-point-display');
    
    // 마스터 시뮬레이션 제어 버튼은 로그인 시 동적으로 주입됨 (보안 이유)
    els.btnMockScan = null;
    els.btnMockExit = null;
    els.btnMockFF = null;
    els.activeTimerView = document.getElementById('active-timer-view');
    els.noTimerMsg = document.getElementById('no-timer-msg');
    els.timerDisplay = document.getElementById('timer-display');
    els.timerStatusMsg = document.getElementById('timer-status-msg');
    els.timerProgress = document.getElementById('timer-progress');
    
    // Modal Elements
    els.modal = document.getElementById('alert-modal');
    els.modalTitle = document.getElementById('alert-title');
    els.modalMsg = document.getElementById('alert-message');
    els.btnModalClose = document.getElementById('btn-alert-close');
    els.btnAlertExtend = document.getElementById('btn-alert-extend');
}

function bindEvents() {
    // Auth toggle and submit handled via inline onclick in HTML

    els.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            switchView(targetId);
            els.navItems.forEach(nav => nav.classList.remove('active'));
            const activeIcon = item.querySelector('i');
            els.navItems.forEach(nav => {
                const i = nav.querySelector('i');
                if(i) i.className = i.className.replace('ph-fill', 'ph');
            });
            if(activeIcon) activeIcon.className = activeIcon.className.replace('ph', 'ph-fill');
            item.classList.add('active');
        });
    });

    if(els.sosBtn) {
        els.sosBtn.addEventListener('click', () => {
            window.location.href = 'tel:0507-1387-4602';
        });
    }



    if(els.btnModalClose) els.btnModalClose.addEventListener('click', closeModal);
    // 연장하기(추가 구매) 버튼 이벤트
    if(els.btnAlertExtend) {
        els.btnAlertExtend.addEventListener('click', () => {
            closeModal();
            switchView('view-tickets'); // 포인트/결제 뷰로 이동
        });
    }
    
    if(els.modal) {
        els.modal.addEventListener('click', (e) => {
            if(e.target === els.modal) closeModal();
        });
    }

    // 비밀번호 가리기/보이기 토글
    const setupPwdToggle = (toggleId, inputId) => {
        const toggleBtn = document.getElementById(toggleId);
        const inputField = document.getElementById(inputId);
        if(toggleBtn && inputField) {
            toggleBtn.addEventListener('click', () => {
                if(inputField.type === 'password') {
                    inputField.type = 'text';
                    toggleBtn.className = toggleBtn.className.replace('ph-eye', 'ph-eye-slash');
                } else {
                    inputField.type = 'password';
                    toggleBtn.className = toggleBtn.className.replace('ph-eye-slash', 'ph-eye');
                }
            });
        }
    };
    setupPwdToggle('login-toggle-pwd', 'login-password');
    setupPwdToggle('auth-toggle-pwd', 'auth-password');
    setupPwdToggle('auth-toggle-pwd-confirm', 'auth-password-confirm');
    
    // 비밀번호 변경 모달용 토글 등록
    setupPwdToggle('toggle-pwd-current', 'change-pwd-current');
    setupPwdToggle('toggle-pwd-new', 'change-pwd-new');
    setupPwdToggle('toggle-pwd-confirm', 'change-pwd-confirm');

    // 마스터 제어 버튼 이벤트는 injectMockControls()에서 주입 시 함께 바인딩
}


// ==== AUTH LOGIC ====
let currentSignupStep = 1;

function toggleAuthMode() {
    const signupFlow = document.getElementById('auth-signup-flow');
    const loginForm = document.getElementById('auth-login-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const stepDots = document.getElementById('step-dots');

    if(authMode === 'signup') {
        authMode = 'login';
        signupFlow.classList.add('hidden');
        loginForm.classList.remove('hidden');
        authTitle.innerText = '로그인';
        authSubtitle.innerText = '테일45에 오신 것을 환영합니다';
        if(stepDots) stepDots.style.display = 'none';
        // 혹시 남아있을 소셜 가입 플래그 정리
        pendingSocialProvider = null;
        delete DB._socialProfile;
    } else {
        authMode = 'signup';
        loginForm.classList.add('hidden');
        signupFlow.classList.remove('hidden');
        authTitle.innerText = '회원가입';
        authSubtitle.innerText = '테일45 멤버가 되어보세요';
        if(stepDots) stepDots.style.display = 'flex';
        // Reset to step 1
        goToSignupStep(1);
    }
}

function goToSignupStep(step) {
    currentSignupStep = step;
    [1, 2, 3].forEach(n => {
        const el = document.getElementById('signup-step-' + n);
        const dot = document.getElementById('dot-' + n);
        if(el) el.classList.toggle('hidden', n !== step);
        if(dot) dot.classList.toggle('active', n <= step);
    });

    if(step === 3) {
        const container = document.getElementById('pet-forms-container');
        if(container && container.children.length === 0) {
            addPetForm();
        }
    }
}

function signupNextStep(currentStep) {
    if(currentStep === 1) {
        const email = document.getElementById('auth-email').value.trim();
        const pwd = document.getElementById('auth-password').value.trim();
        const pwdConfirm = document.getElementById('auth-password-confirm').value.trim();

        if(!email || !pwd || !pwdConfirm) {
            showAlert('입력 오류', '이메일, 비밀번호를 모두 입력해주세요.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            showAlert('이메일 오류', '올바른 이메일 형식을 입력해주세요.');
            return;
        }
        // 비밀번호 규칙: 영문+숫자 포함 8자리 이상
        const pwdRegex = /^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$/;
        if(!pwdRegex.test(pwd)) {
            showAlert('비밀번호 오류', '비밀번호는 영문과 숫자를 포함하여 8자리 이상이어야 합니다.');
            return;
        }
        if(pwd !== pwdConfirm) {
            showAlert('비밀번호 불일치', '비밀번호가 서로 일치하지 않습니다.');
            return;
        }
        goToSignupStep(2);
    } else if(currentStep === 2) {
        const name = document.getElementById('auth-name').value.trim();

        if(!name) {
            showAlert('입력 오류', '이름은 필수 입력 항목입니다.');
            return;
        }
        goToSignupStep(3);
    }
}

function signupPrevStep(currentStep) {
    // 소셜 가입 중에는 Step 1(이메일/비번)을 건너뛰었으므로
    // Step 2에서 뒤로 누르면 로그인 화면으로 이탈
    if (pendingSocialProvider && currentStep === 2) {
        pendingSocialProvider = null;
        delete DB._socialProfile;
        const nameField = document.getElementById('auth-name');
        if (nameField) nameField.value = '';
        toggleAuthMode(); // 로그인 화면으로
        return;
    }
    if(currentStep > 1) goToSignupStep(currentStep - 1);
}

function handleSignupComplete() {
    const privacyCheck = document.getElementById('signup-privacy-check');
    if (!privacyCheck || !privacyCheck.checked) {
        showAlert('약관 동의 필요', '개인정보 처리방침에 동의해주세요.');
        return;
    }

    const isSocial = !!pendingSocialProvider;
    const socialProfile = DB._socialProfile || {};

    // 이메일/비밀번호는 이메일 가입 시에만 수집
    const email = isSocial
        ? (socialProfile.email || `${pendingSocialProvider}_${Date.now()}@tail45.social`)
        : document.getElementById('auth-email').value.trim();
    const pwd = isSocial ? '' : document.getElementById('auth-password').value.trim();

    const name = document.getElementById('auth-name').value.trim();
    const phone = (document.getElementById('auth-phone').value.trim()).replace(/[^0-9]/g, '');
    const addressBase = document.getElementById('auth-address').value.trim();
    const addressDetail = document.getElementById('auth-address-detail').value.trim();
    const address = addressDetail ? `${addressBase} ${addressDetail}` : addressBase;

    if (!name) {
        showAlert('입력 오류', '이름을 입력해주세요.');
        return;
    }
    if (!addressBase) {
        showAlert('입력 오류', '주소를 검색하여 입력해주세요.');
        return;
    }

    // 중복 가입 체크 (이메일 가입만)
    if (!isSocial) {
        const exists = DB.registeredUsers.find(u => u.email === email);
        if(exists) {
            showAlert('가입 안내', '이미 사용 중인 이메일입니다.');
            return;
        }
    }

    const provider = isSocial ? pendingSocialProvider : 'email';
    const memberCode = generateMemberCode();
    const newUser = { phone, password: pwd, name, email, address, provider, code: memberCode };
    DB.registeredUsers.push(newUser);

    // DB.user 세션 업데이트
    DB.user.name = name;
    DB.user.phone = phone || '미등록';
    DB.user.email = email;
    DB.user.address = address || '미등록';
    DB.user.provider = provider;
    DB.user.code = memberCode;
    DB.user.passwordChanged = true;

    // ── 기존 고객 데이터 자동 연동 (전화번호 + 이름 매칭) ──
    let legacyLinked = false;
    if (typeof EXISTING_MEMBERS !== 'undefined' && phone) {
        const normalizedPhone = phone.startsWith('0') ? phone : '0' + phone;
        const legacyMember = EXISTING_MEMBERS.find(m => m.phone === normalizedPhone && m.name === name);
        if (legacyMember) {
            // 기존 주소가 있으면 자동 복원
            if (legacyMember.address && !address) {
                DB.user.address = legacyMember.address;
            }
            // 기존 반려견 데이터 자동 로드
            const legacyDogs = (typeof EXISTING_DOGS !== 'undefined') ?
                EXISTING_DOGS.filter(d => d.ownerCode === legacyMember.code) : [];
            if (legacyDogs.length > 0) {
                DB.pets = legacyDogs.map((d, i) => ({
                    id: `P_LEGACY_${i+1}`,
                    name: d.name || '이름 미등록',
                    size: d.type || '기타',
                    age: d.birth ? calcDogAge(d.birth) : '미등록',
                    weight: d.weight ? d.weight + 'kg' : '미등록',
                    gender: d.gender || '',
                    legacySize: d.size || ''
                }));
                legacyLinked = true;
            }
        }
    }

    // 기존 데이터가 연동되지 않았으면 폼에 입력한 반려견 데이터 사용
    if (!legacyLinked) {
        const petBlocks = document.querySelectorAll('.pet-form-block');
        const newPets = [];
        petBlocks.forEach((block, index) => {
            const pName = block.querySelector('.auth-petname').value.trim();
            const pBreed = block.querySelector('.auth-pet-breed').value.trim();
            const pAgeYear = block.querySelector('.auth-pet-age-year').value.trim();
            const pAgeMonth = block.querySelector('.auth-pet-age-month').value.trim();
            const pWeight = block.querySelector('.auth-pet-weight').value.trim();
            const pGenderEl = block.querySelector('.auth-pet-gender:checked');
            const pGender = pGenderEl ? pGenderEl.value : '미선택';
            const pNeutered = block.querySelector('.auth-pet-neutered').checked;
            const pVaccinated = block.querySelector('.auth-pet-vaccinated').checked;

            if (pName) {
                const petAgeStr = `${pAgeYear || 0}살 ${pAgeMonth || 0}개월`;
                const petSize = pBreed || '기타';
                newPets.push({
                    id: `P_NEW_${index+1}`,
                    name: pName,
                    size: petSize,
                    age: petAgeStr,
                    weight: pWeight ? pWeight + 'kg' : '미등록',
                    gender: pGender,
                    neutered: pNeutered,
                    vaccinated: pVaccinated
                });
            }
        });
        DB.pets = newPets;
    }

    const wasSocial = isSocial;
    const socialName = wasSocial ? (pendingSocialProvider === 'kakao' ? '카카오' : '네이버') : '';

    // 소셜 가입 플래그 정리
    pendingSocialProvider = null;
    delete DB._socialProfile;

    if (wasSocial) {
        // 소셜 가입자는 비밀번호가 없으므로 즉시 로그인 처리
        if (legacyLinked) {
            showAlert(`🎉 ${socialName} 가입 완료! (기존 고객 연동)`, nameWithHonorific(name) + ', 환영합니다!<br>이전 고객 정보와 반려견 <b>' + DB.pets.length + '마리</b>의 데이터가 자동으로 연동되었습니다.');
        } else {
            showAlert(`🎉 ${socialName} 가입 완료!`, nameWithHonorific(name) + ', 테일45 회원이 되신 것을 환영합니다!');
        }
        loginSuccess();
    } else {
        if (legacyLinked) {
            showAlert('🎉 가입 완료! (기존 고객 연동)', nameWithHonorific(name) + ', 환영합니다!<br>이전 고객 정보와 반려견 <b>' + DB.pets.length + '마리</b>의 데이터가 자동으로 연동되었습니다.<br>로그인하여 확인하세요.');
        } else {
            showAlert('🎉 가입 완료!', nameWithHonorific(name) + ', 테일45 회원이 되신 것을 환영합니다!<br>로그인하여 시작하세요.');
        }
        toggleAuthMode(); // 로그인 화면으로 전환
    }
}

// 생년월일로 나이 계산 유틸 함수
function calcDogAge(birthStr) {
    try {
        const birth = new Date(birthStr);
        const now = new Date();
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        if (months < 0) { years--; months += 12; }
        return `${years}살 ${months}개월`;
    } catch(e) {
        return '미등록';
    }
}

// 소셜 로그인 진행 중 플래그 (회원가입 플로우가 소셜 기반인지 판별)
let pendingSocialProvider = null;

function handleSocialLogin(provider) {
    const providerName = provider === 'kakao' ? '카카오' : '네이버';

    // MOCK: 실제로는 카카오/네이버 SDK를 통해 이름·이메일을 받아옴
    // 개발용으로 가상의 소셜 프로필을 즉시 반환
    const mockSocialProfile = {
        name: providerName + ' 유저',
        email: `${provider}_user_${Date.now()}@tail45.social`
    };

    // 소셜 가입 플래그 설정
    pendingSocialProvider = provider;

    // 회원가입 플로우 활성화
    const signupFlow = document.getElementById('auth-signup-flow');
    const loginForm = document.getElementById('auth-login-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const stepDots = document.getElementById('step-dots');

    authMode = 'signup';
    if (signupFlow) signupFlow.classList.remove('hidden');
    if (loginForm) loginForm.classList.add('hidden');
    if (authTitle) authTitle.innerText = `${providerName} 간편 가입`;
    if (authSubtitle) authSubtitle.innerText = '추가 정보를 입력해 주세요';
    if (stepDots) stepDots.style.display = 'flex';

    // 스텝 1(이메일/비밀번호)은 건너뛰고 스텝 2(추가 정보)부터 시작
    goToSignupStep(2);

    // 소셜에서 받아온 이름 자동 채우기
    const nameField = document.getElementById('auth-name');
    if (nameField) nameField.value = mockSocialProfile.name;

    // 소셜 프로필 임시 보관 (handleSignupComplete에서 사용)
    DB._socialProfile = mockSocialProfile;

    // 부드러운 안내
    if (typeof showToast === 'function') {
        showToast(`${providerName} 계정 연동 완료`, 'check-circle');
    }
}

// 마스터 로그인 시 시뮬레이션 제어 패널을 DOM에 동적으로 주입
// 일반 사용자 세션에는 HTML에 이 마크업이 존재하지 않아 DevTools로도 볼 수 없음
function injectMockControls() {
    const slot = document.getElementById('mock-controls-slot');
    if (!slot || slot.dataset.injected === '1') return;
    slot.dataset.injected = '1';
    slot.innerHTML = `
        <div class="mock-controls mt-4 admin-only">
            <p class="text-xs font-bold text-center mb-1 bg-light border-radius p-1" style="color: var(--danger);">[마스터 시뮬레이션 제어 패널]</p>
            <button id="btn-mock-scan" class="secondary-btn full-width text-sm mb-1 bg-white" style="border-color: var(--danger); color: var(--danger);">신호 전송: 입장 리더기 QR 스캔 완료</button>
            <button id="btn-mock-exit" class="secondary-btn full-width text-sm mb-1 bg-white" style="border-color: var(--danger); color: var(--danger);">신호 전송: 퇴장 리더기 QR 스캔 완료</button>
            <button id="btn-mock-fastforward" class="secondary-btn full-width text-sm bg-white" style="border-color: var(--danger); color: var(--danger);">시간 단축: 남은 시간 30초 강제 진입</button>
        </div>
    `;
    els.btnMockScan = document.getElementById('btn-mock-scan');
    els.btnMockExit = document.getElementById('btn-mock-exit');
    els.btnMockFF = document.getElementById('btn-mock-fastforward');
    if (els.btnMockScan) els.btnMockScan.addEventListener('click', handleMockScan);
    if (els.btnMockExit) els.btnMockExit.addEventListener('click', handleMockExit);
    if (els.btnMockFF) els.btnMockFF.addEventListener('click', skipTime);
}

function handleLogin() {
    const rawPhone = document.getElementById('login-phone').value.trim();
    const pwd = document.getElementById('login-password').value.trim();

    // ======== MASTER ADMIN LOGIN ========
    if(rawPhone === 'master' && pwd === '0000') {
        DB.user.name = '마스터 관리자';
        DB.user.phone = 'master';
        DB.user.password = '0000';
        DB.user.code = 'm00000000master00000';
        DB.user.pointBalance = 9999999;
        injectMockControls();
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
        loginSuccess();
        showAlert('마스터 모드 활성화 👑', 'Tail45 앱 마스터 계정으로 로그인했습니다.<br>이제 모든 시뮬레이션 제어 패널을 사용할 수 있습니다.');
        return;
    }
    // ====================================

    const phone = rawPhone.replace(/[^0-9]/g, '');

    // ======== 기존 고객 (Legacy) 로그인 ========
    // 전화번호(ID) + 이름(비밀번호 대신) 매칭으로 기존 고객 자동 인증
    if (typeof EXISTING_MEMBERS !== 'undefined' && phone) {
        const normalizedPhone = phone.startsWith('0') ? phone : '0' + phone;
        const legacyMember = EXISTING_MEMBERS.find(m => m.phone === normalizedPhone);
        if (legacyMember) {
            // 비밀번호 필드에 이름을 입력하여 본인 확인
            if (pwd === legacyMember.name) {
                DB.user.name = legacyMember.name;
                DB.user.phone = legacyMember.phone;
                DB.user.password = legacyMember.name;
                DB.user.code = legacyMember.code;
                DB.user.email = legacyMember.email;
                DB.user.address = legacyMember.address || '미등록';
                DB.user.gender = legacyMember.gender;
                DB.user.birth = legacyMember.birth;
                DB.user.passwordChanged = false;

                // 해당 고객의 반려견 데이터 자동 로드
                if (typeof EXISTING_DOGS !== 'undefined') {
                    const legacyDogs = EXISTING_DOGS.filter(d => d.ownerCode === legacyMember.code);
                    if (legacyDogs.length > 0) {
                        DB.pets = legacyDogs.map((d, i) => ({
                            id: `P_LEGACY_${i+1}`,
                            name: d.name || '이름 미등록',
                            size: d.type || '기타',
                            age: d.birth ? calcDogAge(d.birth) : '미등록',
                            weight: d.weight ? d.weight + 'kg' : '미등록',
                            gender: d.gender || '',
                            legacySize: d.size || ''
                        }));
                    }
                }

                loginSuccess();
                const petCount = DB.pets.length;
                const petMsg = petCount > 0 ? `<br>반려견 <b>${petCount}마리</b>의 정보도 함께 불러왔습니다.` : '';
                showAlert('기존 고객 로그인 성공 🐾', nameWithHonorific(legacyMember.name) + ', 다시 만나서 반갑습니다!' + petMsg + '<br><br><span style="font-size:0.8rem;color:#888;">💡 마이페이지에서 비밀번호를 설정하시면 다음부터 비밀번호로 로그인하실 수 있습니다.</span>');
                return;
            } else {
                // 전화번호는 매칭되지만 이름이 다른 경우
                showAlert('기존 고객 인증 안내', '등록된 전화번호입니다.<br>비밀번호 란에 <b>가입하신 이름</b>을 입력해주세요.<br><br><span style="font-size:0.8rem;color:#888;">예) 홍길동</span>');
                return;
            }
        }
    }
    // ====================================

    // ======== 신규 가입 회원 로그인 ========
    const user = DB.registeredUsers.find(u => (u.phone === phone || u.email === rawPhone) && u.password === pwd);

    if(!user) {
        showAlert('로그인 실패', '가입된 정보가 없거나 비밀번호가 일치하지 않습니다.<br>입력하신 내용을 다시 확인해주세요.');
        return;
    }

    DB.user.name = user.name;
    DB.user.phone = user.phone;
    DB.user.password = user.password;
    DB.user.code = user.code || generateMemberCode();
    DB.user.username = user.username ? '@' + user.username : DB.user.username;
    DB.user.email = user.email || DB.user.email;
    DB.user.address = user.address || DB.user.address;
    DB.user.passwordChanged = true;

    loginSuccess();
    showAlert('로그인 성공', nameWithHonorific(user.name) + ', 환영합니다!<br>Tail45 앱 환경에 접속하셨습니다.');
}



// 로그인 성공 시 UI 표시 및 QR 초기화
function loginSuccess() {
    // Auth 화면 숨기기
    if(els.authView) {
        els.authView.classList.remove('active');
        els.authView.classList.add('hidden');
    }
    // 메인 콘텐츠 보이기
    if(els.mainContent) els.mainContent.classList.remove('hidden');
    // 바텀 네비, SOS 표시
    if(els.bottomNav) els.bottomNav.classList.remove('hidden');
    if(els.sosBtn) els.sosBtn.classList.remove('hidden');
    
    // 중앙 QR 코드를 유저 멤버코드 기반으로 반영 (기존 아임웹 QR과 동일)
    if(els.homeQrImg && DB.user.code) {
        els.homeQrImg.src = getMemberQrUrl(DB.user.code);
    }
    
    // 보유 리워드 포인트 표기 업데이트
    if(els.homePointDisplay && DB.user) {
        els.homePointDisplay.innerText = `${(DB.user.pointBalance || 0).toLocaleString()} P`;
    }

    // 교환 가능 포인트 표기 업데이트
    const exchPtsEl = document.getElementById('reward-exchangeable-points');
    if(exchPtsEl && DB.user) {
        exchPtsEl.innerText = (DB.user.pointBalance || 0).toLocaleString();
    }
    
    // 포인트 내역 렌더링 초기화
    currentHistoryPage = 1;
    renderPointHistory();
    
    // 프로필 DOM 정보 업데이트
    updateProfileUI();
    
    // 내비게이션 탭 아이템 초기화
    els.navItems.forEach(nav => nav.classList.remove('active'));
    els.navItems.forEach(nav => {
        const i = nav.querySelector('i');
        if(i) i.className = i.className.replace('ph-fill', 'ph');
    });
    // 홈 탭을 active로 표시
    const homeTab = document.querySelector('.nav-item[data-target="view-home"]');
    if(homeTab) {
        homeTab.classList.add('active');
        const activeIcon = homeTab.querySelector('i');
        if(activeIcon) activeIcon.className = activeIcon.className.replace('ph', 'ph-fill');
    }
    
    switchView('view-home');

    // 활성 티켓이 있으면 영업시간 기준으로 QR 활성 상태 판단
    setTimeout(function() { updateQrActiveDisplay(); }, 100);

    // 비밀번호 미변경 고객에게 홈 화면 알림 표시 (QR 카드 바로 아래)
    if (!DB.user.passwordChanged) {
        setTimeout(function() {
            var existing = document.getElementById('home-pwd-notice');
            if (existing) return;
            var qrCard = document.querySelector('.qr-center-card');
            if (!qrCard) return;
            var notice = document.createElement('div');
            notice.id = 'home-pwd-notice';
            notice.style.cssText = 'background:#FEF3C7; border:1.5px solid #FDE68A; border-radius:14px; padding:16px 18px; margin-top:16px; cursor:pointer; transition:all 0.2s;';
            notice.innerHTML = '<div style="display:flex;align-items:flex-start;gap:12px;">'
                + '<div style="width:32px;height:32px;border-radius:10px;background:#FDE68A;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
                + '<i class="ph-fill ph-warning" style="font-size:1.1rem;color:#D97706;"></i></div>'
                + '<div style="flex:1;">'
                + '<p style="margin:0 0 4px;font-size:0.85rem;font-weight:700;color:#92400E;">비밀번호 변경이 필요합니다</p>'
                + '<p style="margin:0;font-size:0.78rem;color:#A16207;line-height:1.55;">처음 접속하신 고객님은 반드시 새 비밀번호를 설정해주세요. 비밀번호를 변경하신 고객님에 한하여 결제 및 예약이 가능합니다.</p>'
                + '<div style="margin-top:10px;display:inline-flex;align-items:center;gap:4px;background:#D97706;color:#fff;padding:6px 14px;border-radius:8px;font-size:0.78rem;font-weight:700;">'
                + '<i class="ph ph-lock-key" style="font-size:0.85rem;"></i> 비밀번호 변경하기</div>'
                + '</div></div>';
            notice.onclick = function() { openPasswordChangeModal(); };
            qrCard.after(notice);
        }, 300);
    }

    // 모든 고객에게 프로필 확인 안내 표시 (QR 카드 아래, 비밀번호 알림 아래)
    setTimeout(function() {
        var existing = document.getElementById('home-profile-notice');
        if (existing) return;
        // 비밀번호 알림이 있으면 그 뒤에, 없으면 QR 카드 뒤에 삽입
        var anchor = document.getElementById('home-pwd-notice') || document.querySelector('.qr-center-card');
        if (!anchor) return;
        var notice = document.createElement('div');
        notice.id = 'home-profile-notice';
        notice.style.cssText = 'background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:14px; padding:16px 18px; margin-top:16px; cursor:pointer; transition:all 0.2s;';
        notice.innerHTML = '<div style="display:flex;align-items:flex-start;gap:12px;">'
            + '<div style="width:32px;height:32px;border-radius:10px;background:#BFDBFE;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
            + '<i class="ph-fill ph-user-circle" style="font-size:1.1rem;color:#2563EB;"></i></div>'
            + '<div style="flex:1;">'
            + '<p style="margin:0 0 4px;font-size:0.85rem;font-weight:700;color:#1E40AF;">개인정보 확인 안내</p>'
            + '<p style="margin:0;font-size:0.78rem;color:#3B82F6;line-height:1.55;">프로필 탭에서 개인정보와 반려견 정보를 확인하시고 오류가 있다면<br>업데이트를 권장드립니다.</p>'
            + '<div style="margin-top:10px;display:inline-flex;align-items:center;gap:4px;background:#2563EB;color:#fff;padding:6px 14px;border-radius:8px;font-size:0.78rem;font-weight:700;">'
            + '<i class="ph ph-user-gear" style="font-size:0.85rem;"></i> 프로필 확인하기</div>'
            + '</div></div>';
        notice.onclick = function() { switchView('view-mypage'); };
        anchor.after(notice);
    }, 350);
}

function updateProfileUI() {
    if(!DB.user) return;
    
    const setTxt = (id, txt) => { const el = document.getElementById(id); if(el) el.innerText = txt; };
    
    setTxt('profile-display-name', nameWithHonorific(DB.user.name));
    
    // 이메일 칸에 프로바이더별 표기
    let emailText = DB.user.email;
    if (DB.user.provider === 'kakao') {
        emailText = '카카오 간편가입';
    } else if (DB.user.provider === 'naver') {
        emailText = '네이버 간편가입';
    } else if (!emailText) {
        // 기존 Legacy 회원 등 이메일/프로바이더 정보 모호 시
        emailText = '이메일 미등록';
    }
    setTxt('profile-email', emailText);
    
    let p = DB.user.phone || '';
    if(p.length === 11) p = p.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    setTxt('profile-phone', p);
    
    setTxt('profile-address', DB.user.address || '통일로');
    
    if(DB.user.gender) {
        let genStr = DB.user.gender === 'M' ? '남' : (DB.user.gender === 'F' ? '여' : '');
        if (genStr) setTxt('profile-display-name', `${nameWithHonorific(DB.user.name)} (${genStr})`);
    }

    const petsListEl = document.getElementById('profile-pets-list');
    if(petsListEl) {
        if(DB.pets && DB.pets.length > 0) {
            petsListEl.innerHTML = '';
            DB.pets.forEach((pet, idx) => {
                const ageStr = pet.age || '';
                const weightStr = pet.weight || '';
                const desc = [pet.size, ageStr, weightStr].filter(Boolean).join(' · ');
                let genderIcon = '';
                if(pet.gender === 'M') genderIcon = '<span style="color:#3B82F6; margin-left:4px;">♂</span>';
                if(pet.gender === 'F') genderIcon = '<span style="color:#EC4899; margin-left:4px;">♀</span>';

                const petCard = document.createElement('div');
                petCard.className = 'bg-white flex-between flex-align-center pointer mb-2';
                petCard.style.cssText = 'border-radius: 16px; padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);';
                petCard.innerHTML = `
                    <div class="flex-align-center">
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: #D1FAE5; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                            <i class="ph ph-dog text-primary font-xl"></i>
                        </div>
                        <div>
                            <p class="m-0 font-bold mb-1" style="font-size: 1rem; color: #333;">${pet.name} ${genderIcon}</p>
                            <p class="m-0 text-gray" style="font-size: 0.8rem;">${desc}</p>
                        </div>
                    </div>
                    <i class="ph ph-caret-right text-gray text-lg"></i>
                `;
                petCard.onclick = () => openPetEditModal(idx);
                petsListEl.appendChild(petCard);
            });
        } else {
            petsListEl.innerHTML = `
                <div class="bg-white flex-center flex-align-center text-gray" style="border-radius: 16px; padding: 24px 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <p class="m-0" style="font-size: 0.85rem;">현재 등록된 반려견이 없습니다.</p>
                </div>
            `;
        }
    }
    
    setTxt('rewards-username', nameWithHonorific(DB.user.name));
}

function switchView(viewId) {
    // main-content 안의 view들만 토글 (auth view 제외)
    const mainViews = document.querySelectorAll('#main-content .view');
    mainViews.forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    const target = document.getElementById(viewId);
    if(target) {
        target.classList.remove('hidden');
        void target.offsetWidth;
        target.classList.add('active');
    }
}


// === 실시간 운동장 현황 ===

// 운동장 목록: key → 허용 견종 크기
const YARD_CONFIG = {
    small: { label: '소형견 운동장',    accepts: ['소형견'] },
    sm:    { label: '소·중형견 운동장',  accepts: ['소형견', '중형견'] },
    med:   { label: '중형견 운동장',     accepts: ['중형견'] },
    large: { label: '대형견 운동장',     accepts: ['대형견'] },
    a:     { label: '대관동 A',         accepts: ['소형견', '중형견', '대형견'] },
    b:     { label: '대관동 B',         accepts: ['소형견', '중형견', '대형견'] },
};

// 현재 각 운동장에 입장해 있는 반려견 목록 (배열)
// 각 항목: { petId, petName, size, ownerId, enteredAt }
const yardOccupants = {
    small: [],
    sm:    [],
    med:   [],
    large: [],
    a:     [],
    b:     [],
};

/**
 * 반려견 크기를 '소형견' | '중형견' | '대형견'으로 정규화
 */
function normalizePetSize(size) {
    if (!size) return '소형견';
    if (size.includes('소')) return '소형견';
    if (size.includes('중')) return '중형견';
    if (size.includes('대')) return '대형견';
    return '소형견';
}

/**
 * 반려견 크기에 맞는 운동장 key를 반환
 * (대관동은 별도 — 예약 시 지정)
 */
function getYardForSize(size) {
    const s = normalizePetSize(size);
    if (s === '소형견') return 'small';
    if (s === '중형견') return 'med';
    if (s === '대형견') return 'large';
    return 'small';
}

/**
 * QR 입장 스캔 처리
 * @param {string} yardKey - 운동장 key (small, sm, med, large, a, b)
 * @param {Array} pets - 입장하는 반려견 배열 [{id, name, size}]
 * @param {string} ownerId - 보호자 ID (선택)
 */
function yardEntrance(yardKey, pets, ownerId) {
    if (!yardOccupants[yardKey]) return;

    pets.forEach(pet => {
        // 이미 해당 운동장에 있으면 중복 입장 방지
        const exists = yardOccupants[yardKey].some(o => o.petId === pet.id);
        if (!exists) {
            yardOccupants[yardKey].push({
                petId: pet.id,
                petName: pet.name,
                size: normalizePetSize(pet.size),
                ownerId: ownerId || null,
                enteredAt: new Date().toISOString(),
            });
        }
    });

    renderYardStatus();
}

/**
 * QR 퇴장 스캔 처리
 * @param {string} yardKey - 운동장 key
 * @param {Array} petIds - 퇴장하는 반려견 ID 배열
 */
function yardExit(yardKey, petIds) {
    if (!yardOccupants[yardKey]) return;

    petIds.forEach(pid => {
        const idx = yardOccupants[yardKey].findIndex(o => o.petId === pid);
        if (idx !== -1) {
            yardOccupants[yardKey].splice(idx, 1);
        }
    });

    renderYardStatus();
}

/**
 * 특정 반려견을 모든 운동장에서 퇴장 (영업 종료/티켓 만료 등)
 */
function yardExitAll(petIds) {
    Object.keys(yardOccupants).forEach(key => {
        yardOccupants[key] = yardOccupants[key].filter(o => !petIds.includes(o.petId));
    });
    renderYardStatus();
}

function countBySize(occupants, size) {
    return occupants.filter(o => o.size === size).length;
}

function renderYardStatus() {
    // 소형견 운동장
    const smallOcc = yardOccupants.small;
    setText('yard-small-s', countBySize(smallOcc, '소형견'));
    setText('yard-small-total', smallOcc.length + '마리');

    // 소·중형견 운동장
    const smOcc = yardOccupants.sm;
    setText('yard-sm-s', countBySize(smOcc, '소형견'));
    setText('yard-sm-m', countBySize(smOcc, '중형견'));
    setText('yard-sm-total', smOcc.length + '마리');

    // 중형견 운동장
    const medOcc = yardOccupants.med;
    setText('yard-med-m', countBySize(medOcc, '중형견'));
    setText('yard-med-total', medOcc.length + '마리');

    // 대형견 운동장
    const largeOcc = yardOccupants.large;
    setText('yard-large-l', countBySize(largeOcc, '대형견'));
    setText('yard-large-total', largeOcc.length + '마리');

    // 대관동 A
    const aOcc = yardOccupants.a;
    setText('yard-a-count', aOcc.length + '마리');
    setText('yard-a-total', aOcc.length > 0 ? '이용 중' : '비어있음');
    const aTotalEl = document.getElementById('yard-a-total');
    if (aTotalEl) aTotalEl.style.color = aOcc.length > 0 ? 'var(--primary)' : 'var(--text-muted)';

    // 대관동 B
    const bOcc = yardOccupants.b;
    setText('yard-b-count', bOcc.length + '마리');
    setText('yard-b-total', bOcc.length > 0 ? '이용 중' : '비어있음');
    const bTotalEl = document.getElementById('yard-b-total');
    if (bTotalEl) bTotalEl.style.color = bOcc.length > 0 ? 'var(--primary)' : 'var(--text-muted)';
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// 이름 뒤에 "님" 자동 부착 (이미 "님"으로 끝나면 중복 방지)
function nameWithHonorific(name) {
    if (!name) return '';
    return name.endsWith('님') ? name : name + ' 님';
}

function initYardStatus() {
    // 데모: 다른 이용자들의 반려견이 이미 입장해 있는 상태
    yardEntrance('small', [
        { id: 'demo-s1', name: '콩이', size: '소형견' },
        { id: 'demo-s2', name: '뭉치', size: '소형견' },
        { id: 'demo-s3', name: '보리', size: '소형견' },
    ], 'demo-user-1');
    yardEntrance('sm', [
        { id: 'demo-sm1', name: '두부', size: '소형견' },
        { id: 'demo-sm2', name: '호두', size: '소형견' },
        { id: 'demo-sm3', name: '바둑이', size: '중형견' },
    ], 'demo-user-2');
    yardEntrance('med', [
        { id: 'demo-m1', name: '해피', size: '중형견' },
        { id: 'demo-m2', name: '럭키', size: '중형견' },
        { id: 'demo-m3', name: '코코', size: '중형견' },
        { id: 'demo-m4', name: '몽이', size: '중형견' },
    ], 'demo-user-3');
    yardEntrance('large', [
        { id: 'demo-l1', name: '백구', size: '대형견' },
        { id: 'demo-l2', name: '쿠키', size: '대형견' },
    ], 'demo-user-4');
    yardEntrance('a', [
        { id: 'demo-a1', name: '달이', size: '소형견' },
        { id: 'demo-a2', name: '별이', size: '중형견' },
        { id: 'demo-a3', name: '하늘', size: '대형견' },
    ], 'demo-user-5');
}

// === 당일권 시스템 ===
const dpState = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    selectedDate: null, // 'YYYY-MM-DD'
    selectedPets: [],   // 체크된 반려견 id 배열
};

function renderDpCalendar() {
    const titleEl = document.getElementById('dp-cal-title');
    const gridEl = document.getElementById('dp-cal-grid');
    if (!titleEl || !gridEl) return;

    const y = dpState.year;
    const m = dpState.month;
    titleEl.textContent = `${y}년 ${m + 1}월`;

    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '';
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="rsv-cal-day empty"></div>';
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(y, m, d);
        const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const dayOfWeek = date.getDay();
        const isPast = date < today;

        let cls = 'rsv-cal-day';
        if (isPast) cls += ' disabled';
        if (date.getTime() === today.getTime()) cls += ' today';
        if (dpState.selectedDate === dateStr) cls += ' selected';
        if (dayOfWeek === 0) cls += ' sunday';
        if (dayOfWeek === 6) cls += ' saturday';

        html += `<div class="${cls}" data-date="${dateStr}" onclick="dpSelectDate('${dateStr}')">${d}</div>`;
    }
    gridEl.innerHTML = html;
}

function dpCalPrev() {
    dpState.month--;
    if (dpState.month < 0) { dpState.month = 11; dpState.year--; }
    const now = new Date();
    if (dpState.year < now.getFullYear() || (dpState.year === now.getFullYear() && dpState.month < now.getMonth())) {
        dpState.month = now.getMonth();
        dpState.year = now.getFullYear();
    }
    renderDpCalendar();
}

function dpCalNext() {
    dpState.month++;
    if (dpState.month > 11) { dpState.month = 0; dpState.year++; }
    renderDpCalendar();
}

function dpSelectDate(dateStr) {
    dpState.selectedDate = dateStr;
    dpState.selectedPets = [];
    renderDpCalendar();
    resetTerms('dp');

    // 반려견 목록 렌더링
    renderDpPets();
    showEl('dp-pets-section');

    // 요약/버튼은 반려견 선택 후 표시
    hideEl('dp-selected-info');
    hideEl('dp-bottom-bar');

    setTimeout(() => {
        document.getElementById('dp-pets-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function renderDpPets() {
    const listEl = document.getElementById('dp-pets-list');
    const noneEl = document.getElementById('dp-pets-none');
    if (!listEl) return;

    if (!DB.pets || DB.pets.length === 0) {
        listEl.classList.add('hidden');
        if (noneEl) noneEl.classList.remove('hidden');
        return;
    }

    listEl.classList.remove('hidden');
    if (noneEl) noneEl.classList.add('hidden');

    let html = '';
    DB.pets.forEach((pet, idx) => {
        const isChecked = dpState.selectedPets.includes(pet.id);
        const desc = [pet.size, pet.age, pet.weight].filter(Boolean).join(' · ');
        let genderIcon = '';
        if (pet.gender === 'M') genderIcon = '<span style="color:#3B82F6; margin-left:3px;">♂</span>';
        if (pet.gender === 'F') genderIcon = '<span style="color:#EC4899; margin-left:3px;">♀</span>';

        html += `
            <div class="dp-pet-row ${isChecked ? 'checked' : ''}" onclick="dpTogglePet('${pet.id}')">
                <div class="dp-pet-check">
                    ${isChecked ? '<i class="ph-bold ph-check" style="color:#fff; font-size:0.85rem;"></i>' : ''}
                </div>
                <div class="dp-pet-avatar">
                    <i class="ph ph-dog text-primary" style="font-size: 1.3rem;"></i>
                </div>
                <div class="dp-pet-info">
                    <p class="m-0 font-bold" style="font-size: 0.95rem;">${pet.name}${genderIcon}</p>
                    ${desc ? `<p class="m-0 text-gray" style="font-size: 0.78rem; margin-top: 2px;">${desc}</p>` : ''}
                </div>
            </div>
        `;
    });
    listEl.innerHTML = html;
}

function dpTogglePet(petId) {
    const idx = dpState.selectedPets.indexOf(petId);
    if (idx === -1) {
        dpState.selectedPets.push(petId);
    } else {
        dpState.selectedPets.splice(idx, 1);
    }

    renderDpPets();

    if (dpState.selectedPets.length > 0) {
        updateDpSummary();
        showEl('dp-selected-info');
        showEl('dp-bottom-bar');
    } else {
        hideEl('dp-selected-info');
        hideEl('dp-bottom-bar');
    }
}

function updateDpSummary() {
    if (!dpState.selectedDate) return;

    const [y, m, d] = dpState.selectedDate.split('-');
    const dayNames = ['일','월','화','수','목','금','토'];
    const dateObj = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
    const dayName = dayNames[dateObj.getDay()];

    const dateDisplay = document.getElementById('dp-date-display');
    if (dateDisplay) dateDisplay.textContent = `${parseInt(m)}월 ${parseInt(d)}일 (${dayName})`;

    // 반려견 이름 표시
    const petNames = dpState.selectedPets.map(id => {
        const pet = DB.pets.find(p => p.id === id);
        return pet ? pet.name : '';
    }).filter(Boolean);

    const petsDisplay = document.getElementById('dp-pets-display');
    if (petsDisplay) petsDisplay.textContent = `입장 반려견: ${petNames.join(', ')} (${petNames.length}마리)`;

    const summaryText = document.getElementById('dp-summary-text');
    if (summaryText) summaryText.textContent = `${parseInt(m)}/${parseInt(d)}(${dayName}) · 반려견 ${petNames.length}마리`;
}

function handleDaypassPurchase() {
    // 비밀번호 미변경 시 결제 차단
    if (!DB.user.passwordChanged) {
        showAlert('비밀번호 변경 필요', '결제를 진행하시려면 먼저 비밀번호를 변경해주세요.<br>비밀번호 변경 화면으로 이동합니다.', function() {
            openPasswordChangeModal();
        });
        return;
    }
    if (!dpState.selectedDate) {
        showAlert("입력 필요", "이용 날짜를 선택해주세요.");
        return;
    }

    if (dpState.selectedPets.length === 0) {
        showAlert("입력 필요", "입장할 반려견을 1마리 이상 선택해주세요.");
        return;
    }

    // 이미 활성 티켓이 있는 경우
    if (DB.activeTicket && (DB.activeTicket.status === '결제대기' || DB.activeTicket.status === '사용중')) {
        showAlert("안내", "이미 발급된 이용권이 있습니다.<br>기존 이용권을 먼저 사용해주세요.");
        return;
    }

    const [y, m, d] = dpState.selectedDate.split('-');
    const dayNames = ['일','월','화','수','목','금','토'];
    const dateObj = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
    const dayName = dayNames[dateObj.getDay()];

    const petNames = dpState.selectedPets.map(id => {
        const pet = DB.pets.find(p => p.id === id);
        return pet ? pet.name : '';
    }).filter(Boolean);

    // 당일권 발급
    DB.activeTicket = {
        type: '당일권',
        status: '결제대기',
        date: dpState.selectedDate,
        pets: [...dpState.selectedPets],
        expiresAt: null
    };

    showAlert("당일권 구매 완료",
        `당일권이 발급되었습니다.<br><br>` +
        `<b>이용 날짜:</b> ${parseInt(m)}월 ${parseInt(d)}일 (${dayName})<br>` +
        `<b>입장 반려견:</b> ${petNames.join(', ')} (${petNames.length}마리)<br><br>` +
        `선택한 날짜의 영업 시간 동안 운동장을<br>자유롭게 이용하실 수 있습니다.<br><br>` +
        `<span class="text-sm text-gray">영업 종료 시 QR이 자동 만료됩니다.</span>`
    );

    if (els.homeQrStatus) {
        const todayStr = formatDateStr(new Date());
        if (dpState.selectedDate === todayStr) {
            els.homeQrStatus.innerText = "✓ 당일권 준비 완료! 입구 리더기에 QR을 스캔하세요.";
        } else {
            els.homeQrStatus.innerText = `✓ ${parseInt(m)}/${parseInt(d)}(${dayName}) 당일권 예약 완료`;
        }
        els.homeQrStatus.className = "text-sm mt-3 text-primary font-bold";
    }

    // QR 카드 활성 시각 표시 (영업시간 내인 경우에만)
    updateQrActiveDisplay();

    // 토스트 피드백
    if (typeof showToast === 'function') showToast('당일권이 발급되었습니다', 'check-circle');

    // 폼 초기화
    dpState.selectedDate = null;
    dpState.selectedPets = [];
    hideEl('dp-pets-section');
    hideEl('dp-selected-info');
    hideEl('dp-bottom-bar');
    resetTerms('dp');
    renderDpCalendar();
}

function formatDateStr(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

// 당일권 영업 종료 자동 만료 체크 (1분마다)
// 운동장 영업 종료 시간 반환 (평일 20:00, 주말/공휴일 21:00)
function getYardClosingHour(date) {
    var d = date instanceof Date ? date : new Date(date);
    var day = d.getDay(); // 0=일, 6=토
    return (day === 0 || day === 6) ? 21 : 20;
}

// 운동장 영업 시작 시간 반환 (평일 12:00, 주말/공휴일 11:00)
function getYardOpeningHour(date) {
    var d = date instanceof Date ? date : new Date(date);
    var day = d.getDay(); // 0=일, 6=토
    return (day === 0 || day === 6) ? 11 : 12;
}

// QR 카드 활성 상태 시각 표시 (직접 on/off)
function setQrActiveState(active) {
    var wrapper = document.querySelector('.qr-wrapper');
    if (!wrapper) return;
    var existingBadge = document.getElementById('qr-active-badge');
    if (active) {
        wrapper.classList.add('qr-active');
        if (els.homeQrImg) els.homeQrImg.style.opacity = '1';
        if (!existingBadge) {
            var badge = document.createElement('div');
            badge.id = 'qr-active-badge';
            badge.className = 'qr-active-badge';
            badge.innerHTML = '<i class="ph-fill ph-check-circle"></i> 이용권 활성';
            wrapper.parentElement.insertBefore(badge, wrapper.nextSibling);
        }
    } else {
        wrapper.classList.remove('qr-active');
        if (existingBadge) existingBadge.remove();
    }
}

// 활성 티켓의 날짜·영업시간 기준으로 QR 활성 상태 자동 판단
function updateQrActiveDisplay() {
    if (!DB.activeTicket || DB.activeTicket.status === '만료') {
        setQrActiveState(false);
        return;
    }
    var now = new Date();
    var todayStr = formatDateStr(now);
    var ticketDate = DB.activeTicket.date;
    // 티켓 날짜가 오늘이고, 현재 시각이 영업시간 내인 경우에만 활성
    if (ticketDate === todayStr) {
        var openHour = getYardOpeningHour(now);
        var closeHour = getYardClosingHour(now);
        if (now.getHours() >= openHour && now.getHours() < closeHour) {
            setQrActiveState(true);
        } else {
            setQrActiveState(false);
        }
    } else {
        // 티켓 날짜가 오늘이 아니면 비활성 (미래 예약이거나 이미 지난 날짜)
        setQrActiveState(false);
    }
}

function checkDaypassExpiry() {
    if (!DB.activeTicket || DB.activeTicket.type !== '당일권') return;
    if (DB.activeTicket.status === '만료') return;

    const now = new Date();
    const ticketDate = DB.activeTicket.date;
    const todayStr = formatDateStr(now);

    function expireDaypass(msg) {
        const exitPets = getEntryPets();
        yardExitAll(exitPets.map(p => p.id));
        DB.activeTicket.status = '만료';
        if (els.homeQrStatus) {
            els.homeQrStatus.innerText = msg;
            els.homeQrStatus.className = "text-sm mt-3 text-gray font-bold";
        }
        // QR 이미지도 기본 상태로 되돌리기
        if (els.homeQrImg) {
            els.homeQrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EXPIRED';
            els.homeQrImg.style.opacity = '0.3';
        }
        // QR 활성 상태 해제
        setQrActiveState(false);
    }

    // 티켓 날짜가 오늘이고 영업 종료 시간 이후면 만료 (평일 20:00, 주말 21:00)
    var closingHour = getYardClosingHour(now);
    if (ticketDate === todayStr && now.getHours() >= closingHour) {
        expireDaypass("영업이 종료되어 당일권이 만료되었습니다. (종료 " + closingHour + ":00)");
    }
    // 티켓 날짜가 이미 지났으면 만료
    if (ticketDate < todayStr) {
        expireDaypass("이용 날짜가 지나 당일권이 만료되었습니다.");
        return;
    }

    // 만료되지 않았으면 영업시간 기준으로 QR 활성 상태 갱신
    updateQrActiveDisplay();
}

function initDaypassCalendar() {
    renderDpCalendar();
}

// === 대관동 예약 시스템 ===

// 예약 상태
const rsvState = {
    building: null,       // 'A' or 'B'
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    selectedDate: null,   // 'YYYY-MM-DD'
    selectedTime: null,   // 'HH:MM'
    duration: null,       // 1,2,3,4
    guardianCount: 1,
    petCount: 1,
};

function openReservation(building) {
    rsvState.building = building;
    rsvResetForm();
    const titleEl = document.getElementById('rsv-title');
    if (titleEl) titleEl.textContent = `${building}동 대관 예약`;
    switchView('view-tickets-reservation');
}

// 이미 예약된 시간 (데모 데이터 — 날짜별 시간 배열)
const bookedSlots = {
    // 오늘 기준 데모 데이터를 동적으로 생성
};

function initBookedSlots() {
    const today = new Date();
    const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    // 오늘: 2개 슬롯 예약됨
    bookedSlots[fmt(today)] = ['11:00', '14:00'];
    // 내일: 3개 슬롯
    const tom = new Date(today); tom.setDate(tom.getDate()+1);
    bookedSlots[fmt(tom)] = ['10:00', '13:00', '16:00'];
    // 모레: 1개 슬롯
    const day3 = new Date(today); day3.setDate(day3.getDate()+2);
    bookedSlots[fmt(day3)] = ['15:00'];
}

// 달력 렌더링
function renderRsvCalendar() {
    const titleEl = document.getElementById('rsv-cal-title');
    const gridEl = document.getElementById('rsv-cal-grid');
    if (!titleEl || !gridEl) return;

    const y = rsvState.year;
    const m = rsvState.month;
    titleEl.textContent = `${y}년 ${m + 1}월`;

    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '';
    // 빈 셀
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="rsv-cal-day empty"></div>';
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(y, m, d);
        const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const dayOfWeek = date.getDay();
        const isPast = date < today;

        let cls = 'rsv-cal-day';
        if (isPast) cls += ' disabled';
        if (date.getTime() === today.getTime()) cls += ' today';
        if (rsvState.selectedDate === dateStr) cls += ' selected';
        if (dayOfWeek === 0) cls += ' sunday';
        if (dayOfWeek === 6) cls += ' saturday';

        html += `<div class="${cls}" data-date="${dateStr}" onclick="rsvSelectDate('${dateStr}')">${d}</div>`;
    }
    gridEl.innerHTML = html;
}

function rsvCalPrev() {
    rsvState.month--;
    if (rsvState.month < 0) { rsvState.month = 11; rsvState.year--; }
    // 과거 달 이동 제한
    const now = new Date();
    if (rsvState.year < now.getFullYear() || (rsvState.year === now.getFullYear() && rsvState.month < now.getMonth())) {
        rsvState.month = now.getMonth();
        rsvState.year = now.getFullYear();
    }
    renderRsvCalendar();
}

function rsvCalNext() {
    rsvState.month++;
    if (rsvState.month > 11) { rsvState.month = 0; rsvState.year++; }
    renderRsvCalendar();
}

function rsvSelectDate(dateStr) {
    rsvState.selectedDate = dateStr;
    rsvState.selectedTime = null;
    rsvState.duration = null;
    selectedReservationDuration = null;
    resetTerms('rsv');

    renderRsvCalendar();
    renderRsvTimeSlots();
    showEl('rsv-time-section');
    hideEl('rsv-duration-section');
    hideEl('rsv-people-section');
    hideEl('rsv-memo-section');
    hideEl('rsv-bottom-bar');

    // 시간 영역으로 부드럽게 스크롤
    setTimeout(() => {
        document.getElementById('rsv-time-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function renderRsvTimeSlots() {
    const container = document.getElementById('rsv-time-slots');
    if (!container) return;

    const slots = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
    const booked = bookedSlots[rsvState.selectedDate] || [];

    // 오늘인 경우 이미 지난 시간은 disabled
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const isToday = rsvState.selectedDate === todayStr;
    const currentHour = now.getHours();

    let html = '';
    for (const slot of slots) {
        const hour = parseInt(slot.split(':')[0]);
        const isBooked = booked.includes(slot);
        const isPastTime = isToday && hour <= currentHour;

        let cls = 'rsv-time-slot';
        if (isBooked) cls += ' booked';
        else if (isPastTime) cls += ' disabled';
        if (rsvState.selectedTime === slot) cls += ' selected';

        html += `<div class="${cls}" data-time="${slot}" onclick="rsvSelectTime('${slot}')">${slot}</div>`;
    }
    container.innerHTML = html;
}

function rsvSelectTime(time) {
    // booked 체크
    const booked = bookedSlots[rsvState.selectedDate] || [];
    if (booked.includes(time)) return;

    rsvState.selectedTime = time;
    rsvState.duration = null;
    selectedReservationDuration = null;

    renderRsvTimeSlots();
    showEl('rsv-duration-section');
    // duration 초기화
    document.querySelectorAll('.rsv-duration-chip').forEach(c => c.classList.remove('selected'));
    hideEl('rsv-people-section');
    hideEl('rsv-memo-section');
    hideEl('rsv-bottom-bar');

    setTimeout(() => {
        document.getElementById('rsv-duration-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function selectReservationDuration(el) {
    const val = el.getAttribute('data-duration');
    if (val === 'call') return; // handleReservationCall에서 처리
    document.querySelectorAll('.rsv-duration-chip').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    rsvState.duration = parseInt(val);
    selectedReservationDuration = rsvState.duration;

    showEl('rsv-people-section');
    showEl('rsv-memo-section');
    showEl('rsv-bottom-bar');
    updateRsvSummary();

    setTimeout(() => {
        document.getElementById('rsv-people-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function handleReservationCall() {
    showAlert("전화 문의",
        `4시간 이상 대관은 전화로 문의해주세요.<br><br>` +
        `<b style="font-size: 1.1rem;">📞 031-XXX-XXXX</b><br><br>` +
        `<span class="text-sm text-gray">운영시간: 평일 10:00 ~ 18:00</span>`
    );
}

// 인원 카운터
function rsvCountChange(type, delta) {
    if (type === 'guardian') {
        rsvState.guardianCount = Math.max(1, Math.min(10, rsvState.guardianCount + delta));
        document.getElementById('rsv-guardian-count').textContent = rsvState.guardianCount;
    } else {
        rsvState.petCount = Math.max(1, Math.min(10, rsvState.petCount + delta));
        document.getElementById('rsv-pet-count').textContent = rsvState.petCount;
    }
    updateRsvSummary();
}

function updateRsvSummary() {
    const el = document.getElementById('rsv-summary-text');
    if (!el || !rsvState.selectedDate || !rsvState.selectedTime || !rsvState.duration) return;

    const [y, m, d] = rsvState.selectedDate.split('-');
    const dayNames = ['일','월','화','수','목','금','토'];
    const dateObj = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
    const dayName = dayNames[dateObj.getDay()];

    el.innerHTML = `${rsvState.building}동 · ${parseInt(m)}/${parseInt(d)}(${dayName}) ${rsvState.selectedTime} · ${rsvState.duration}시간 · 보호자 ${rsvState.guardianCount}명 · 반려견 ${rsvState.petCount}마리`;
}

function handleReservationSubmit() {
    // 비밀번호 미변경 시 예약 차단
    if (!DB.user.passwordChanged) {
        showAlert('비밀번호 변경 필요', '예약을 진행하시려면 먼저 비밀번호를 변경해주세요.<br>비밀번호 변경 화면으로 이동합니다.', function() {
            openPasswordChangeModal();
        });
        return;
    }
    if (!rsvState.selectedDate) {
        showAlert("입력 필요", "예약 날짜를 선택해주세요.");
        return;
    }
    if (!rsvState.selectedTime) {
        showAlert("입력 필요", "예약 시간을 선택해주세요.");
        return;
    }
    if (!rsvState.duration) {
        showAlert("입력 필요", "이용 시간을 선택해주세요.");
        return;
    }

    const memo = (document.getElementById('rsv-memo')?.value || '').trim();
    const [y, m, d] = rsvState.selectedDate.split('-');
    const dayNames = ['일','월','화','수','목','금','토'];
    const dateObj = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
    const dayName = dayNames[dateObj.getDay()];

    showAlert("예약 신청 완료",
        `${rsvState.building}동 대관 예약이 접수되었습니다.<br><br>` +
        `<b>대관:</b> ${rsvState.building}동<br>` +
        `<b>날짜:</b> ${parseInt(m)}월 ${parseInt(d)}일 (${dayName})<br>` +
        `<b>시간:</b> ${rsvState.selectedTime}<br>` +
        `<b>이용:</b> ${rsvState.duration}시간<br>` +
        `<b>보호자:</b> ${rsvState.guardianCount}명<br>` +
        `<b>반려견:</b> ${rsvState.petCount}마리<br>` +
        (memo ? `<b>메모:</b> ${memo}<br>` : '') +
        `<br>관리자 확인 후 확정 안내 드리겠습니다.`
    );

    if (typeof showToast === 'function') showToast('예약이 접수되었습니다', 'calendar-check');

    rsvResetForm();
}

function rsvResetForm() {
    rsvState.selectedDate = null;
    rsvState.selectedTime = null;
    rsvState.duration = null;
    rsvState.guardianCount = 1;
    rsvState.petCount = 1;
    selectedReservationDuration = null;

    const memoEl = document.getElementById('rsv-memo');
    if (memoEl) memoEl.value = '';
    const gcEl = document.getElementById('rsv-guardian-count');
    if (gcEl) gcEl.textContent = '1';
    const pcEl = document.getElementById('rsv-pet-count');
    if (pcEl) pcEl.textContent = '1';

    document.querySelectorAll('.rsv-duration-chip').forEach(c => c.classList.remove('selected'));

    hideEl('rsv-time-section');
    hideEl('rsv-duration-section');
    hideEl('rsv-people-section');
    hideEl('rsv-memo-section');
    hideEl('rsv-bottom-bar');
    resetTerms('rsv');

    renderRsvCalendar();
}

// 유틸
function showEl(id) { const e = document.getElementById(id); if(e) e.classList.remove('hidden'); }
function hideEl(id) { const e = document.getElementById(id); if(e) e.classList.add('hidden'); }

function toggleTermsBtn(prefix) {
    const checkbox = document.getElementById(`${prefix}-terms-check`);
    const btn = document.getElementById(`${prefix}-submit-btn`);
    if (!checkbox || !btn) return;
    if (checkbox.checked) {
        btn.classList.remove('disabled');
        btn.disabled = false;
    } else {
        btn.classList.add('disabled');
        btn.disabled = true;
    }
}

function resetTerms(prefix) {
    const checkbox = document.getElementById(`${prefix}-terms-check`);
    const btn = document.getElementById(`${prefix}-submit-btn`);
    if (checkbox) checkbox.checked = false;
    if (btn) { btn.classList.add('disabled'); btn.disabled = true; }
}

function initReservationDate() {
    initBookedSlots();
    renderRsvCalendar();
}

function handleMockScan() {
    if(!DB.activeTicket || DB.activeTicket.status === '만료') {
        showAlert("입장 불가", "유효한 이용권이 없습니다. 구매해주세요.");
        return;
    }

    if(DB.activeTicket.status === '결제대기') {
        DB.activeTicket.status = '사용중';

        // 당일권이 아닌 경우(타이머 방식)만 타이머 시작
        if (DB.activeTicket.hours) {
            startTimer(DB.activeTicket.hours * 3600);
        }
    }

    // 입장 반려견을 운동장에 추가
    const entryPets = getEntryPets();
    if (entryPets.length > 0) {
        // 당일권: 크기별 자동 배정 / 대관동 예약: 해당 동에 배정
        if (DB.activeTicket.building) {
            // 대관동 예약
            const yardKey = DB.activeTicket.building.toLowerCase();
            yardEntrance(yardKey, entryPets, DB.user?.code);
        } else {
            // 당일권/일반: 반려견 크기별 운동장 자동 배정
            entryPets.forEach(pet => {
                const yardKey = getYardForSize(pet.size);
                yardEntrance(yardKey, [pet], DB.user?.code);
            });
        }
    }

    showAlert("입장 스캔 완료", `입장 처리되었습니다. (${entryPets.map(p => p.name).join(', ')})<br>운동장 현황이 업데이트됩니다.`);

    if(els.homeQrStatus) {
        els.homeQrStatus.innerText = "입장 확인되었습니다. 즐거운 시간 보내세요!";
        els.homeQrStatus.className = "text-sm mt-3 text-gray font-bold";
    }
}

function handleMockExit() {
    if(!DB.activeTicket || DB.activeTicket.status !== '사용중') {
        showAlert("퇴장 불가", "현재 이용 중인 이용권이 없습니다.");
        return;
    }

    // 퇴장: 내 반려견을 모든 운동장에서 제거
    const exitPets = getEntryPets();
    const petIds = exitPets.map(p => p.id);
    yardExitAll(petIds);

    // 티켓 만료 처리
    DB.activeTicket.status = '만료';
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    if(els.activeTimerView) els.activeTimerView.classList.add('hidden');
    if(els.noTimerMsg) els.noTimerMsg.classList.remove('hidden');

    showAlert("퇴장 스캔 완료", `퇴장 처리되었습니다. (${exitPets.map(p => p.name).join(', ')})<br>다음에 또 방문해주세요!`);

    if(els.homeQrStatus) {
        els.homeQrStatus.innerText = "퇴장 완료되었습니다. 감사합니다!";
        els.homeQrStatus.className = "text-sm mt-3 text-gray font-bold";
    }
}

/**
 * 현재 활성 티켓에 연결된 입장 반려견 목록 반환
 */
function getEntryPets() {
    if (!DB.activeTicket) return [];

    // 당일권: 선택된 반려견 ID로 조회
    if (DB.activeTicket.pets && DB.activeTicket.pets.length > 0) {
        return DB.activeTicket.pets.map(pid => DB.pets.find(p => p.id === pid)).filter(Boolean);
    }

    // 그 외: 등록된 전체 반려견
    return DB.pets || [];
}

function startTimer(seconds) {
    totalSeconds = seconds;
    remainingSeconds = seconds;
    updateTimerUI();
    
    if(els.noTimerMsg) els.noTimerMsg.classList.add('hidden');
    if(els.activeTimerView) els.activeTimerView.classList.remove('hidden');
    
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerUI();
        
        // 10분 전 경고
        if(remainingSeconds === 600) {
            showAlert("이용 안내", "이용 시간이 10분 남았습니다. 퇴장 준비를 시작해주세요.");
        }
        
        // 30초 전 경고 + 연장 버튼 노출
        if(remainingSeconds === 30) {
            showAlert("출입 통제 경고 🚧", "이용 시간이 30초 남았습니다. 신속히 퇴장하시거나, 더 이용하시려면 하단의 <b>시간 연장</b> 버튼을 눌러주세요.", true);
        }
        
        // 0초 (만료)
        if(remainingSeconds <= 0) {
            clearInterval(timerInterval);
            DB.activeTicket.status = '만료';
            if(els.timerDisplay) els.timerDisplay.innerText = "00:00:00";

            // 운동장에서 퇴장 처리
            const exitPets = getEntryPets();
            yardExitAll(exitPets.map(p => p.id));

            // 만료 안내 팝업 (연장 버튼 없이 순수 만료 통보)
            showAlert("시간 종료 ⏰", "이용 시간이 모두 만료되었습니다.<br>안내에 따라 신속히 퇴장해주시기 바랍니다.");
            
            if(els.activeTimerView) els.activeTimerView.classList.add('hidden');
            if(els.noTimerMsg) els.noTimerMsg.classList.remove('hidden');
            
            if(els.homeQrStatus) {
                els.homeQrStatus.innerText = "이용권이 만료되었습니다. 이용 탭에서 다시 구매하세요.";
                els.homeQrStatus.className = "text-sm mt-3 text-danger font-bold";
            }
        }
    }, 1000);
}

function updateTimerUI() {
    if(remainingSeconds < 0) return;
    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;
    
    if(els.timerDisplay) {
        els.timerDisplay.innerText = 
            String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }
    
    if(els.homeTimerCountdown) {
        if(remainingSeconds > 0) {
            els.homeTimerCountdown.innerText = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
            els.homeTimerCountdown.classList.remove('hidden');
        } else {
            els.homeTimerCountdown.innerText = "";
            els.homeTimerCountdown.classList.add('hidden');
        }
    }
        
    const percent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;
    if(els.timerProgress) els.timerProgress.style.width = `${percent}%`;
    
    if(remainingSeconds <= 600 && remainingSeconds > 60) {
        if(els.timerDisplay) els.timerDisplay.className = 'timer-large warning';
        if(els.timerProgress) els.timerProgress.className = 'progress-fill warning';
    } else if (remainingSeconds <= 60) {
        if(els.timerDisplay) els.timerDisplay.className = 'timer-large danger';
        if(els.timerProgress) els.timerProgress.className = 'progress-fill danger';
    } else {
        if(els.timerDisplay) els.timerDisplay.className = 'timer-large';
        if(els.timerProgress) els.timerProgress.className = 'progress-fill';
    }
    
    // 30초 이하일 때 메인 화면의 남은시간 버튼을 빨간색으로 변경
    if(remainingSeconds <= 30 && remainingSeconds > 0) {
        if(els.homeTimerIcon) els.homeTimerIcon.className = "ph-fill ph-clock text-danger mb-1";
        if(els.homeTimerText) els.homeTimerText.className = "font-bold text-danger mt-1";
        if(els.homeTimerCountdown) els.homeTimerCountdown.className = "font-bold text-danger mt-1";
    } else {
        if(els.homeTimerIcon) els.homeTimerIcon.className = "ph-fill ph-clock text-primary mb-1";
        if(els.homeTimerText) els.homeTimerText.className = "font-bold text-gray mt-1";
        if(els.homeTimerCountdown) els.homeTimerCountdown.className = "font-bold text-primary mt-1";
    }
}

// 기존 아임웹 QR과 동일한 멤버코드 기반 QR 생성
function getMemberQrUrl(memberCode) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(memberCode)}`;
}

// 신규 가입 시 아임웹과 동일 형식의 멤버코드 생성 (m + YYYYMMDD + 13자리 hex)
function generateMemberCode() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const hex = Array.from({length: 13}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return `m${y}${m}${d}${hex}`;
}

let qrTimerInterval = null;

function updateQrTimerDisplay() {
    const timerSpan = document.getElementById('modal-qr-timer');
    if(!timerSpan) return;
    
    // 계산 로직: 5분 주기(300,000ms) 기준으로 남은 밀리초 역산
    const msToNext5Min = 300000 - (Date.now() % 300000);
    const totalSeconds = Math.floor(msToNext5Min / 1000);
    
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    timerSpan.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    // 타이머 갱신 시점에 이미지도 새 해시로 교체
    if(totalSeconds === 299) {
        const qrImg = document.getElementById('modal-qr-img');
        if(qrImg && DB.user.code) qrImg.src = getMemberQrUrl(DB.user.code);
    }
}

function openQrModal() {
    const modal = document.getElementById('qr-modal');
    const qrImg = document.getElementById('modal-qr-img');
    if(modal && qrImg && DB.user.phone) {
        qrImg.src = getMemberQrUrl(DB.user.code);
        updateQrTimerDisplay(); // 열 때 1회 즉시 실행
        qrTimerInterval = setInterval(updateQrTimerDisplay, 1000);
        modal.classList.remove('hidden');
    }
}

function closeQrModal() {
    const modal = document.getElementById('qr-modal');
    if(modal) modal.classList.add('hidden');
    if(qrTimerInterval) {
        clearInterval(qrTimerInterval);
        qrTimerInterval = null;
    }
}

let currentHistoryPage = 1;
const HISTORY_PER_PAGE = 3;

function renderPointHistory() {
    const list = document.getElementById('point-history-list');
    const moreBtn = document.getElementById('point-history-more');
    if(!list || !DB.user.pointHistory) return;
    
    list.innerHTML = '';
    const itemsToShow = DB.user.pointHistory.slice(0, currentHistoryPage * HISTORY_PER_PAGE);
    
    itemsToShow.forEach(item => {
        const isPositive = item.amount.startsWith('+');
        const colorClass = isPositive ? 'text-primary' : 'text-danger';
        const iconClasses = isPositive ? 'ph-trend-up' : 'ph-trend-down';
        
        list.innerHTML += `
            <div class="glass-card flex-between mb-2" style="padding: 16px; border: 1px solid rgba(0,0,0,0.05);">
                <div class="flex-align-center">
                    <div class="mr-2" style="width: 40px; height: 40px; border-radius: 50%; background: ${isPositive ? 'rgba(0,168,107,0.1)' : 'rgba(239,68,68,0.1)'}; display: flex; align-items: center; justify-content: center;">
                        <i class="ph ${iconClasses} ${colorClass} font-lg mb-0"></i>
                    </div>
                    <div>
                        <h4 class="font-bold mb-0 text-gray text-sm">${item.type}</h4>
                        <p class="text-gray text-xs mb-0 mt-1">${item.desc}<br>${item.date}</p>
                    </div>
                </div>
                <span class="font-bold ${colorClass}">${item.amount}P</span>
            </div>
        `;
    });
    
    if(moreBtn) {
        if(itemsToShow.length >= DB.user.pointHistory.length || itemsToShow.length >= 10) {
            moreBtn.classList.add('hidden');
        } else {
            moreBtn.classList.remove('hidden');
        }
    }
}

function loadMoreHistory() {
    currentHistoryPage++;
    renderPointHistory();
}

function skipTime() {
    if(!DB.activeTicket || DB.activeTicket.status !== '사용중') {
        showAlert("에러", "타이머가 동작 중일 때만 가능합니다.");
        return;
    }
    // 남은 시간을 강제로 31초로 줄여, 다음 1초 뒤(30초)에 알림+연장버튼이 뜨도록 시뮬레이션
    remainingSeconds = 31;
    totalSeconds = 600; // 프로그레스 바 UI를 위해 임시 10분 스케일
    updateTimerUI();
}

// showExtendBtn 값에 따라 시간 연장 버튼 숨김/표시 처리
var _alertCloseCallback = null;

function showAlert(title, msg, showExtendBtnOrCallback) {
    if(!els.modal) return;
    els.modalTitle.innerText = title;
    els.modalMsg.innerHTML = msg;

    // 3번째 인자가 함수이면 닫기 시 콜백, boolean이면 연장 버튼 표시 여부
    if (typeof showExtendBtnOrCallback === 'function') {
        _alertCloseCallback = showExtendBtnOrCallback;
        if(els.btnAlertExtend) els.btnAlertExtend.classList.add('hidden');
    } else {
        _alertCloseCallback = null;
        if(showExtendBtnOrCallback && els.btnAlertExtend) {
            els.btnAlertExtend.classList.remove('hidden');
        } else if(els.btnAlertExtend) {
            els.btnAlertExtend.classList.add('hidden');
        }
    }

    els.modal.classList.remove('hidden');
}

function closeModal() {
    if(els.modal) els.modal.classList.add('hidden');
    if (_alertCloseCallback) {
        var cb = _alertCloseCallback;
        _alertCloseCallback = null;
        setTimeout(cb, 200);
    }
}

function handleChangePassword() {
    openPasswordChangeModal();
}

function openPasswordChangeModal() {
    if(!DB.user) return;
    document.getElementById('change-pwd-current').value = '';
    document.getElementById('change-pwd-new').value = '';
    document.getElementById('change-pwd-confirm').value = '';
    document.getElementById('password-change-modal').classList.remove('hidden');
}

function closePasswordChangeModal() {
    document.getElementById('password-change-modal').classList.add('hidden');
}

function savePasswordChange() {
    const current = document.getElementById('change-pwd-current').value.trim();
    const newPwd = document.getElementById('change-pwd-new').value.trim();
    const confirm = document.getElementById('change-pwd-confirm').value.trim();

    if (current !== DB.user.password) {
        showAlert('인증 실패', '현재 비밀번호가 일치하지 않습니다.');
        return;
    }

    const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!pwdRegex.test(newPwd)) {
        showAlert('보안 규칙', '비밀번호는 영문과 숫자를 포함하여 8자리 이상이어야 합니다.');
        return;
    }

    if (newPwd !== confirm) {
        showAlert('일치 요망', '새 비밀번호와 확인 비밀번호가 다릅니다.');
        return;
    }

    DB.user.password = newPwd;
    DB.user.passwordChanged = true;

    // DB.registeredUsers 업데이트 (임시 데이터 연동 유지)
    if(DB.registeredUsers) {
        const idx = DB.registeredUsers.findIndex(u => u.phone === DB.user.phone);
        if (idx !== -1) DB.registeredUsers[idx].password = newPwd;
    }

    // 홈 화면 비밀번호 변경 알림 제거
    var pwdNotice = document.getElementById('home-pwd-notice');
    if (pwdNotice) pwdNotice.remove();

    closePasswordChangeModal();
    showAlert('변경 완료', '비밀번호가 성공적으로 변경되었습니다.<br>이제 결제 및 예약이 가능합니다.');
}

function openAccountEditModal() {
    if(!DB.user) return;

    // 현재 저장된 유저 정보를 폼에 채우기
    document.getElementById('edit-acc-name').value = DB.user.name || '';
    document.getElementById('edit-acc-phone').value = DB.user.phone || '';
    document.getElementById('edit-acc-address').value = DB.user.address || '';
    document.getElementById('edit-acc-address-detail').value = DB.user.addressDetail || '';

    const isSocial = DB.user.provider === 'kakao' || DB.user.provider === 'naver';
    const emailInput = document.getElementById('edit-acc-email');
    const emailNote = document.getElementById('edit-acc-email-note');
    const emailWrapper = document.getElementById('edit-acc-email-wrapper');

    if (isSocial) {
        // 간편 로그인 회원: 이메일 칸 비활성화 + 안내문 표시
        const providerName = DB.user.provider === 'kakao' ? '카카오' : '네이버';
        emailInput.value = `${providerName} 간편가입`;
        emailInput.disabled = true;
        emailWrapper.style.opacity = '0.6';
        emailNote.classList.remove('hidden');
    } else {
        // 이메일 로그인 회원: 이메일 수정 가능
        emailInput.value = DB.user.email || '';
        emailInput.disabled = false;
        emailWrapper.style.opacity = '1';
        emailNote.classList.add('hidden');
    }

    document.getElementById('account-edit-modal').classList.remove('hidden');
}

function closeAccountEditModal() {
    document.getElementById('account-edit-modal').classList.add('hidden');
}

function saveAccountEdit() {
    const name = document.getElementById('edit-acc-name').value.trim();
    const phone = document.getElementById('edit-acc-phone').value.trim().replace(/[^0-9]/g, '');
    const addressBase = document.getElementById('edit-acc-address').value.trim();
    const addressDetail = document.getElementById('edit-acc-address-detail').value.trim();
    const address = addressDetail ? `${addressBase} ${addressDetail}` : addressBase;

    if (!name) {
        showAlert('입력 오류', '이름은 필수 항목입니다.');
        return;
    }

    const isSocial = DB.user.provider === 'kakao' || DB.user.provider === 'naver';

    DB.user.name = name;
    DB.user.phone = phone || DB.user.phone;
    DB.user.address = addressBase || DB.user.address;
    DB.user.addressDetail = addressDetail;

    // 이메일 로그인 회원만 이메일 업데이트
    if (!isSocial) {
        const email = document.getElementById('edit-acc-email').value.trim();
        if (email) DB.user.email = email;
    }

    closeAccountEditModal();
    updateProfileUI(); // 프로필 화면 즉시 반영
    showAlert('저장 완료', '계정 정보가 성공적으로 수정되었습니다.');
}

// 다음 우편번호 서비스 주소 검색 (팝업 방식)
// 주의: file:// 프로토콜에서는 동작하지 않음. http:// 또는 https:// 환경에서만 사용 가능.
function openAddressSearch(target) {
    new daum.Postcode({
        oncomplete: function(data) {
            var fullAddress = data.roadAddress;
            if (data.userSelectedType === 'J') {
                fullAddress = data.jibunAddress;
            }
            if (target === 'auth') {
                document.getElementById('auth-address').value = fullAddress;
                setTimeout(function() { document.getElementById('auth-address-detail').focus(); }, 200);
            } else if (target === 'edit') {
                document.getElementById('edit-acc-address').value = fullAddress;
                setTimeout(function() { document.getElementById('edit-acc-address-detail').focus(); }, 200);
            }
        }
    }).open();
}

// 반려견 수정 모달 - 성별 선택 헬퍼
function selectEditPetGender(value) {
    var maleCard = document.getElementById('edit-pet-gender-male-card');
    var femaleCard = document.getElementById('edit-pet-gender-female-card');
    var maleInput = document.getElementById('edit-pet-gender-male');
    var femaleInput = document.getElementById('edit-pet-gender-female');
    // 초기화
    [maleCard, femaleCard].forEach(function(c) {
        c.style.borderColor = '#E5E7EB'; c.style.background = '#FAFAFA'; c.style.color = '#555';
    });
    maleInput.checked = false;
    femaleInput.checked = false;
    // 선택
    if (value === 'male') {
        maleInput.checked = true;
        maleCard.style.borderColor = 'var(--primary)'; maleCard.style.background = '#E8F8F0'; maleCard.style.color = 'var(--primary)';
    } else if (value === 'female') {
        femaleInput.checked = true;
        femaleCard.style.borderColor = 'var(--primary)'; femaleCard.style.background = '#E8F8F0'; femaleCard.style.color = 'var(--primary)';
    }
}

// 반려견 수정 모달 - 체크박스 토글 헬퍼
function toggleEditPetCheck(field) {
    var cb = document.getElementById('edit-pet-' + field);
    var card = document.getElementById('edit-pet-' + field + '-card');
    cb.checked = !cb.checked;
    if (cb.checked) {
        card.style.borderColor = 'var(--primary)'; card.style.background = '#E8F8F0'; card.style.color = 'var(--primary)';
    } else {
        card.style.borderColor = '#E5E7EB'; card.style.background = '#FAFAFA'; card.style.color = '#555';
    }
}

// 반려견 수정 모달 - 체크 카드 UI 초기화 헬퍼
function setEditCheckCardState(cardId, cbId, checked) {
    var card = document.getElementById(cardId);
    var cb = document.getElementById(cbId);
    if (!card || !cb) return;
    cb.checked = !!checked;
    if (checked) {
        card.style.borderColor = 'var(--primary)'; card.style.background = '#E8F8F0'; card.style.color = 'var(--primary)';
    } else {
        card.style.borderColor = '#E5E7EB'; card.style.background = '#FAFAFA'; card.style.color = '#555';
    }
}

function openPetEditModal(idx) {
    const pet = DB.pets[idx];
    if(!pet) return;

    document.getElementById('edit-pet-idx').value = idx;
    document.getElementById('edit-pet-name').value = pet.name || '';

    // Type/breed
    const breedVal = pet.type || pet.breed || '';
    document.getElementById('edit-pet-breed').value = breedVal;
    document.getElementById('breed-input-edit').value = breedVal;

    // Age parsing (만약 "3살 2개월" 문자열인 경우)
    let y = '', m = '';
    if(pet.age && typeof pet.age === 'string') {
        const yMatch = pet.age.match(/(\d+)살/);
        const mMatch = pet.age.match(/(\d+)개월/);
        if(yMatch) y = yMatch[1];
        if(mMatch) m = mMatch[1];
    }
    document.getElementById('edit-pet-year').value = y;
    document.getElementById('edit-pet-month').value = m;

    // Weight parsing ("4kg" 문자열)
    let w = '';
    if(pet.weight && typeof pet.weight === 'string') {
        w = parseFloat(pet.weight) || '';
    } else if (pet.weight) {
        w = pet.weight;
    }
    document.getElementById('edit-pet-weight').value = w;

    // 성별 UI 초기화
    selectEditPetGender(pet.gender || '');

    // 중성화 / 예방접종 UI 초기화
    setEditCheckCardState('edit-pet-neutered-card', 'edit-pet-neutered', pet.neutered);
    setEditCheckCardState('edit-pet-vaccinated-card', 'edit-pet-vaccinated', pet.vaccinated);

    document.getElementById('pet-edit-modal').classList.remove('hidden');
}

function closePetEditModal() {
    document.getElementById('pet-edit-modal').classList.add('hidden');
}

function savePetEdit() {
    const idx = parseInt(document.getElementById('edit-pet-idx').value);
    if(isNaN(idx)) return;
    
    const pet = DB.pets[idx];
    if(!pet) return;
    
    const name = document.getElementById('edit-pet-name').value.trim();
    const type = document.getElementById('edit-pet-breed').value.trim() || document.getElementById('breed-input-edit').value.trim();
    const y = document.getElementById('edit-pet-year').value.trim();
    const m = document.getElementById('edit-pet-month').value.trim();
    const w = document.getElementById('edit-pet-weight').value.trim();
    
    if(name) pet.name = name;
    if(type) pet.type = type;

    let ageParts = [];
    if(y) ageParts.push(`${y}살`);
    if(m) ageParts.push(`${m}개월`);
    if(ageParts.length > 0) pet.age = ageParts.join(' ');

    if(w) pet.weight = `${w}kg`;

    // 성별
    var genderMale = document.getElementById('edit-pet-gender-male');
    var genderFemale = document.getElementById('edit-pet-gender-female');
    if (genderMale && genderMale.checked) pet.gender = 'male';
    else if (genderFemale && genderFemale.checked) pet.gender = 'female';

    // 중성화 / 예방접종
    var neuteredCb = document.getElementById('edit-pet-neutered');
    var vaccinatedCb = document.getElementById('edit-pet-vaccinated');
    if (neuteredCb) pet.neutered = neuteredCb.checked;
    if (vaccinatedCb) pet.vaccinated = vaccinatedCb.checked;

    closePetEditModal();
    updateProfileUI(); // 화면 갱신
    showAlert('반려견 정보', '정보가 성공적으로 수정되었습니다.');
}

// ===== Frontend Pattern Enhancements =====

// --- Staggered Entry Animation (IntersectionObserver) ---
(function initStaggerAnimations() {
    var observer = new IntersectionObserver(function(entries) {
        var delay = 0;
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                setTimeout(function() {
                    el.classList.add('visible');
                }, delay);
                delay += 80;
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    // 초기 관찰 대상은 로그인 후 설정 (DOM이 보여야 작동)
    window._staggerObserver = observer;
})();

function observeStaggerItems() {
    var items = document.querySelectorAll('.stagger-item:not(.visible)');
    items.forEach(function(item) {
        window._staggerObserver.observe(item);
    });
    // 섹션 타이틀 애니메이션도 트리거
    var titles = document.querySelectorAll('.section-title-animated:not(.visible)');
    titles.forEach(function(title) {
        window._staggerObserver.observe(title);
    });
}

// --- Ripple Effect ---
document.addEventListener('click', function(e) {
    var host = e.target.closest('.ripple-host');
    if (!host) return;
    var rect = host.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 2;
    var circle = document.createElement('span');
    circle.className = 'ripple-circle';
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
    circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
    host.appendChild(circle);
    setTimeout(function() { circle.remove(); }, 500);
});

// --- Toast Notification System ---
var _toastTimer = null;
function showToast(message, icon) {
    var toast = document.getElementById('toast-container');
    if (!toast) return;
    toast.innerHTML = (icon ? '<i class="ph-fill ph-' + icon + '"></i> ' : '') + message;
    toast.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function() {
        toast.classList.remove('show');
    }, 2800);
}

// --- Scroll Progress Indicator ---
(function initScrollProgress() {
    var homeView = document.getElementById('view-home');
    if (!homeView) return;
    homeView.addEventListener('scroll', function() {
        var bar = document.getElementById('home-scroll-progress');
        if (!bar) return;
        var scrollTop = homeView.scrollTop;
        var scrollHeight = homeView.scrollHeight - homeView.clientHeight;
        var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        bar.style.width = pct + '%';
    });
})();

// --- Banner Parallax on Scroll ---
(function initBannerParallax() {
    var homeView = document.getElementById('view-home');
    var banner = homeView ? homeView.querySelector('.home-top-banner') : null;
    if (!homeView || !banner) return;
    homeView.addEventListener('scroll', function() {
        var scrollTop = homeView.scrollTop;
        if (scrollTop < 300) {
            banner.style.transform = 'translateY(' + (scrollTop * 0.35) + 'px)';
            banner.style.opacity = Math.max(0.6, 1 - scrollTop / 500);
        }
    });
})();

// --- Keyboard Navigation for Nav & Action Cards ---
document.addEventListener('keydown', function(e) {
    var el = document.activeElement;
    if (!el) return;

    // Enter/Space on role="button" or role="tab"
    if ((e.key === 'Enter' || e.key === ' ') && (el.getAttribute('role') === 'button' || el.getAttribute('role') === 'tab')) {
        e.preventDefault();
        el.click();
    }

    // Arrow keys for nav tabs
    if (el.classList.contains('nav-item') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        var navItems = Array.from(document.querySelectorAll('.nav-item'));
        var idx = navItems.indexOf(el);
        if (e.key === 'ArrowRight') idx = (idx + 1) % navItems.length;
        else idx = (idx - 1 + navItems.length) % navItems.length;
        navItems[idx].focus();
    }
});

// --- ARIA state update on nav switch ---
var _origSwitchView = switchView;
switchView = function(viewId) {
    _origSwitchView(viewId);
    // Update ARIA selected states on nav
    document.querySelectorAll('.nav-item').forEach(function(nav) {
        var isActive = nav.classList.contains('active');
        nav.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    // Trigger stagger animations for newly visible view
    setTimeout(observeStaggerItems, 50);
};

// --- Initial stagger observe after login ---
var _origLoginSuccess = loginSuccess;
loginSuccess = function() {
    _origLoginSuccess.apply(this, arguments);
    setTimeout(observeStaggerItems, 200);
};

// ===== 개인정보 처리방침 동의 =====
function toggleSignupSubmitBtn() {
    const checkbox = document.getElementById('signup-privacy-check');
    const btn = document.getElementById('signup-submit-btn');
    if (!checkbox || !btn) return;
    if (checkbox.checked) {
        btn.classList.remove('disabled');
        btn.disabled = false;
    } else {
        btn.classList.add('disabled');
        btn.disabled = true;
    }
}

function openPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.classList.remove('hidden');
        const body = document.getElementById('privacy-modal-body');
        if (body) body.scrollTop = 0;
    }
}

function closePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) modal.classList.add('hidden');
}

function agreePrivacyFromModal() {
    const checkbox = document.getElementById('signup-privacy-check');
    if (checkbox) {
        checkbox.checked = true;
        toggleSignupSubmitBtn();
    }
    closePrivacyModal();
}

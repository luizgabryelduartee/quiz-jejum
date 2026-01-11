// ==========================================
// 🔗 CONFIGURAÇÃO DO CHECKOUT COACH IA
// Cole o link da sua página de pagamento de R$ 9,90 abaixo:
const LINK_CHECKOUT_COACH = "SEU_LINK_DE_PAGAMENTO_AQUI";
// ==========================================

const state = {
    activeTab: 'home',
    activeChallenge: localStorage.getItem('activeChallenge') || '3-day',
    currentDay: parseInt(localStorage.getItem('currentDay')) || 1,
    isFasting: false,
    timerSeconds: 0,
    interval: null,
    protocol: localStorage.getItem('userProtocol') || '12:12',
    weight: localStorage.getItem('userWeight') || '75',
    initialWeight: localStorage.getItem('initialWeight') || null,
    userName: localStorage.getItem('userName') || '',
    userAge: localStorage.getItem('userAge') || '',
    isFirstTime: !localStorage.getItem('returningUser'),
    isPremium: localStorage.getItem('isPremium') === 'true' || false,
    chatHistory: JSON.parse(localStorage.getItem('chatHistory')) || [
        { role: 'bot', text: 'Olá! Sou seu Coach IA. Como posso te ajudar com seu jejum hoje?' }
    ]
};

// Auto-unlock premium if URL has ?pay=success
if (window.location.search.includes('pay=success')) {
    state.isPremium = true;
    localStorage.setItem('isPremium', 'true');
}

const PHRASES = [
    "Hoje sua mente está 2x mais clara! ✨",
    "Cada gota de água é um reset para suas células. 💧",
    "Seu corpo é uma máquina de queimar gordura agora! 🔥",
    "O foco de hoje será imbatível. Continue firme! 🧠",
    "A autofagia está renovando sua juventude hoje. 💖",
    "Você está no controle total do seu bem-estar. 👑",
    "A disciplina de hoje é o resultado de amanhã. 🚀"
];

const challenges = {
    '3-day': {
        name: 'Início Leve',
        desc: 'Foco em desinflamar e reduzir inchaço',
        duration: 3,
        milestones: [
            { day: 1, title: 'Limpeza Inicial', icon: '🍃' },
            { day: 2, title: 'Pico de Autofagia', icon: '🧬' },
            { day: 3, title: 'Reset Metabólico', icon: '🔥' }
        ],
        days: [
            { breakfast: 'Omelete com espinafre', lunch: 'Salada de atum com folhas', dinner: 'Sopa de legumes detox' },
            { breakfast: 'Iogurte grego com chia', lunch: 'Frango grelhado com brócolis', dinner: 'Peixe assado com aspargos' },
            { breakfast: 'Abacate com ovo pochê', lunch: 'Mix de folhas e castanhas', dinner: 'Creme de abóbora com gengibre' }
        ]
    },
    '7-day': {
        name: 'Faxina Metabólica',
        desc: 'Desintoxicação profunda e queima ativa',
        duration: 7,
        milestones: [
            { day: 1, title: 'Início', icon: '🚀' },
            { day: 3, title: 'Desinflamação', icon: '💧' },
            { day: 5, title: 'Energia Vital', icon: '⚡' },
            { day: 7, title: 'Renovação', icon: '✨' }
        ],
        days: []
    },
    '28-day': {
        name: 'Transformação Total',
        desc: 'Novo estilo de vida e peso ideal',
        duration: 28,
        milestones: [
            { day: 1, title: 'Primeiro Passo', icon: '🌱' },
            { day: 7, title: 'Hábito Criado', icon: '🧠' },
            { day: 14, title: 'Resultados Visíveis', icon: '👗' },
            { day: 21, title: 'Autodomínio', icon: '👑' },
            { day: 28, title: 'Nova Mulher', icon: '🦋' }
        ],
        days: []
    }
};

const protocols = {
    '12:12': { fast: 12, eat: 12, desc: 'Iniciante (Nível 1)', level: 1 },
    '14:10': { fast: 14, eat: 10, desc: 'Intermediário (Nível 2)', level: 2 },
    '16:8': { fast: 16, eat: 8, desc: 'Padrão Ouro (Nível 3)', level: 3 }
};

const tabs = {
    home: () => {
        const randomPhrase = PHRASES[state.currentDay % PHRASES.length];
        const greeting = state.userName ? `Oi, ${state.userName}! ✨` : "Bem-vinda! ✨";
        const currentChallenge = challenges[state.activeChallenge];

        const timelineHTML = `
            <div class="journey-timeline">
                <div class="timeline-track"></div>
                ${currentChallenge.milestones.map(m => {
            const isCompleted = state.currentDay > m.day;
            const isCurrent = state.currentDay === m.day;
            return `
                        <div class="milestone-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                            <div class="node-icon">${m.icon}</div>
                            <div class="node-label">Dia ${m.day}</div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;

        return `
            <div class="motivation-card">
                <h2 style="font-size:1.4rem;">${greeting}</h2>
                <p style="font-size:0.9rem; opacity:0.9; margin-top:8px;">${randomPhrase}</p>
            </div>

            <div class="card journey-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div>
                        <h3 style="font-weight:900; color:var(--primary);">${currentChallenge.name}</h3>
                        <p style="font-size:0.75rem; color:#888;">${currentChallenge.desc}</p>
                    </div>
                    <span class="status-badge" style="background:#FFF; color:var(--primary)">DIA ${state.currentDay}/${currentChallenge.duration}</span>
                </div>
                ${timelineHTML}
            </div>

            <div class="card timer-main-card">
                <div class="timer-circle-container">
                    <div class="timer-circle ${state.isFasting ? 'fasting' : ''}" style="border-top-color: ${state.isFasting ? 'var(--secondary)' : '#F0F0F0'}">
                        <div class="timer-time" id="main-timer">00:00:00</div>
                        <div class="timer-label">${state.isFasting ? 'QUEIMANDO GORDURA' : 'PRONTA?'}</div>
                    </div>
                </div>
                <button class="btn-primary main-cta ${state.isFasting ? 'btn-stop' : ''}" onclick="toggleFasting()">
                    ${state.isFasting ? 'CONCLUIR JEJUM' : 'INICIAR JEJUM AGORA'}
                </button>
            </div>

            <div class="card daily-tip-card">
                <div style="display:flex; gap:15px; align-items:center;">
                    <div class="tip-icon">💡</div>
                    <div>
                        <h4 style="font-size:0.85rem; color:var(--primary); font-weight:900;">DICA DA MAYA</h4>
                        <p style="font-size:0.8rem; color:#666;">Beba 500ml de água com limão agora para acelerar o processo!</p>
                    </div>
                </div>
            </div>
        `;
    },
    timer: () => `
        <div class="card">
            <h2>Efeito no seu Corpo</h2>
            <div class="physics-info" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:15px;">
                <div style="background:#F5F0FF; padding:10px; border-radius:12px; font-size:0.8rem; font-weight:700;">🧠 Foco Mental</div>
                <div style="background:#F5F0FF; padding:10px; border-radius:12px; font-size:0.8rem; font-weight:700;">🔥 Queima Ativa</div>
                <div style="background:#F5F0FF; padding:10px; border-radius:12px; font-size:0.8rem; font-weight:700;">🧼 Detox Celular</div>
                <div style="background:#F5F0FF; padding:10px; border-radius:12px; font-size:0.8rem; font-weight:700;">💖 Pele Jovem</div>
            </div>
        </div>

        <div class="card">
            <h3 style="margin-bottom:15px;">Escolha seu Ritmo</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                ${Object.keys(protocols).map(p => `
                    <div class="image-card ${state.protocol === p ? 'selected' : ''}" 
                         style="padding:15px; cursor:pointer;" 
                         onclick="setProtocol('${p}')">
                        <div style="font-weight:900; color:var(--primary); font-size:1.1rem;">${p}</div>
                        <div style="font-size:0.7rem; color:#666; font-weight:700;">${protocols[p].desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    coach: () => {
        if (!state.isPremium) {
            return `
                <div class="card premium-lock">
                    <span class="lock-icon">🤖</span>
                    <h2 style="font-weight:900; color:var(--primary); line-height:1.2;">Conheça a Maya: <br>Sua Nutri IA Particular</h2>
                    <p style="color:#666; margin-top:15px; font-size:0.95rem; font-weight:600;">
                        Tire dúvidas, peça substituições e receba estímulos reais por apenas <span style="color:var(--success)">R$ 9,90/mês</span>.
                    </p>
                    
                    <div style="background:var(--primary-light); padding:15px; border-radius:20px; margin:20px 0; border:1px dashed var(--primary);">
                        <p style="font-size:0.85rem; color:var(--primary); font-weight:800;">
                            💰 Menos de R$ 0,33 por dia! <br>
                            <span style="font-weight:500; font-size:0.75rem;">(Assinatura mensal recorrente)</span>
                        </p>
                    </div>

                    <button class="btn-primary" onclick="unlockPremium()">ATIVAR MAYA AGORA</button>
                    <button class="btn-secondary" style="margin-top:10px; background:none; border:none; color:var(--text-muted); font-weight:700; font-size:0.8rem; text-decoration:underline; cursor:pointer;" onclick="showCoachMarketing()">Entender melhor como funciona</button>
                </div>
            `;
        }

        return `
            <div class="chat-container">
                <div class="chat-header-maya">
                    <div class="maya-avatar">👩‍⚕️</div>
                    <div class="maya-info">
                        <strong>MAYA</strong>
                        <span>Sua Coach Particular</span>
                    </div>
                </div>
                <div class="chat-messages" id="chat-messages">
                    ${state.chatHistory.map(msg => `
                        <div class="message ${msg.role}">${msg.text}</div>
                    `).join('')}
                </div>
                <div class="chat-input-area">
                    <button class="btn-photo" onclick="triggerPhoto()"><span style="font-size:1.2rem;">📷</span></button>
                    <input type="text" id="chat-input" class="chat-input" placeholder="Oi Maya, pode me ajudar?" onkeypress="handleChatKey(event)">
                    <button class="btn-send" onclick="sendMessage()">➔</button>
                </div>
            </div>
        `;
    },
    meals: () => `
        <div class="card">
            <h2 style="font-weight:900;">🍲 Sua Jornada</h2>
            <p style="color:#666; font-size:0.85rem; margin-bottom:20px;">Cada dia liberado traz um novo cardápio nutritivo.</p>
            
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px;">
                ${Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
        const isLocked = day > state.currentDay;
        const isActive = day === state.currentDay;
        return `
                        <div class="image-card ${isActive ? 'selected' : ''}" 
                             style="padding:15px 10px; cursor:pointer; position:relative; ${isLocked ? 'opacity:0.4; filter:grayscale(1);' : ''}"
                             onclick="${isLocked ? `openModal('<h2 style=&quot;color:var(--primary);&quot;>🔒 Bloqueado</h2><p style=&quot;margin:15px 0;&quot;>Conclua o jejum de hoje para liberar o cardápio do Dia ${day}.</p><button class=&quot;btn-primary&quot; onclick=&quot;closeModal()&quot;>VOLTAR</button>')` : `showMealDetail(${day})`}">
                            <div style="font-weight:900; font-size:1.1rem; color: ${isActive ? 'var(--primary)' : '#444'}">${day}</div>
                            <div style="font-size:0.6rem; font-weight:800; margin-top:4px;">${isLocked ? 'BLOQU.' : 'ABERTO'}</div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `,
    profile: () => {
        let weightDiff = 0;
        let progressHTML = '';

        if (state.initialWeight && state.weight) {
            weightDiff = (parseFloat(state.initialWeight) - parseFloat(state.weight)).toFixed(1);
            const isLoss = weightDiff > 0;
            const isGain = weightDiff < 0;

            progressHTML = `
                <div class="body-state" style="background: ${isLoss ? '#F0FFF9' : isGain ? '#FFF5F5' : '#FDFBFF'}; border-color: ${isLoss ? 'var(--success)' : isGain ? 'var(--secondary)' : '#EEE'};">
                    <span class="state-icon">${isLoss ? '🎉' : isGain ? '⚠️' : '⚖️'}</span>
                    <div class="state-info">
                        <h4>${isLoss ? `Você perdeu ${weightDiff}kg!` : isGain ? `Atenção: +${Math.abs(weightDiff)}kg` : 'Peso estável'}</h4>
                        <p>${isLoss ? 'Incrível! Seu esforço está valendo a pena.' : isGain ? 'Não desanime! O jejum vai te ajudar a voltar aos trilhos.' : 'Mantenha o foco no seu objetivo!'}</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="card">
                <h2 style="color:var(--primary); font-weight:900; margin-bottom:15px;">👤 Seu Perfil</h2>
                
                <div style="margin-bottom:15px;">
                    <label style="font-size:0.7rem; font-weight:900; color:var(--primary); text-transform:uppercase;">Seu Nome</label>
                    <input type="text" id="name-input" value="${state.userName}" placeholder="Ex: Maria" style="width:100%; padding:12px; border:2px solid #F5F0FF; border-radius:12px; font-weight:700; margin-top:5px;">
                </div>

                <div style="margin-bottom:15px;">
                    <label style="font-size:0.7rem; font-weight:900; color:var(--primary); text-transform:uppercase;">Idade</label>
                    <input type="number" id="age-input" value="${state.userAge}" placeholder="Ex: 30" style="width:100%; padding:12px; border:2px solid #F5F0FF; border-radius:12px; font-weight:700; margin-top:5px;">
                </div>

                <div style="margin-bottom:15px;">
                    <label style="font-size:0.7rem; font-weight:900; color:var(--primary); text-transform:uppercase;">Peso Atual (kg)</label>
                    <input type="number" id="weight-input" value="${state.weight}" style="width:100%; padding:12px; border:2px solid #F5F0FF; border-radius:12px; font-weight:700; margin-top:5px;">
                </div>

                <button class="btn-primary" onclick="saveProfile()">SALVAR ALTERAÇÕES</button>
            </div>

            <div class="card">
                <h2 style="color:var(--primary); font-weight:900; margin-bottom:5px;">🎯 Desafio Ativo</h2>
                <div class="challenge-list" style="margin-top:15px;">
                    ${Object.keys(challenges).map(key => `
                        <div class="challenge-card ${state.activeChallenge === key ? 'active' : ''}" onclick="setChallenge('${key}')">
                            <div class="challenge-info">
                                <h4>${challenges[key].name}</h4>
                                <p>${challenges[key].desc}</p>
                            </div>
                            <span style="font-size:1.8rem; margin-left:15px;">${key === '3-day' ? '🌱' : key === '7-day' ? '🧼' : '👑'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${progressHTML}

            <div class="card" style="border: 1px dashed #DDD; background: #FAFAFA;">
                <h3 style="font-size:1rem; margin-bottom:10px;">Precisa de Ajuda?</h3>
                <p style="font-size:0.8rem; color:#666; margin-bottom:15px;">Dúvidas sobre o plano ou substituições? Fale com sua Coach IA.</p>
                <button class="btn-primary" style="background:var(--primary); text-decoration:none; display:block; text-align:center;" onclick="showTab('coach')">FALAR COM COACH IA</button>
            </div>
        `;
    }
};

function saveProfile() {
    const name = document.getElementById('name-input').value.trim();
    const age = document.getElementById('age-input').value.trim();
    const weight = parseFloat(document.getElementById('weight-input').value);

    if (name) {
        state.userName = name;
        localStorage.setItem('userName', name);
    }
    if (age) {
        state.userAge = age;
        localStorage.setItem('userAge', age);
    }
    if (!isNaN(weight)) {
        saveWeight(weight);
    } else {
        showTab('profile');
    }
}

function saveWeight(val) {
    if (!state.initialWeight) {
        state.initialWeight = val;
        localStorage.setItem('initialWeight', val);
    }

    const prevWeight = state.weight;
    state.weight = val;
    localStorage.setItem('userWeight', val);

    let diffFromInitial = (state.initialWeight - val).toFixed(1);
    let diffFromLast = (prevWeight - val).toFixed(1);

    let message = '';
    let title = 'Peso Registrado! ✅';

    if (diffFromLast > 0) {
        title = 'Parabéns! 🎉';
        message = `Você eliminou mais <b>${diffFromLast}kg</b> desde a última pesagem. No total, já são <b>${diffFromInitial}kg</b> a menos!`;
    } else if (diffFromLast < 0) {
        title = 'Não desanime! 💪';
        message = `O peso oscilou um pouco (+${Math.abs(diffFromLast)}kg), mas isso é normal. Mantenha o foco no jejum que amanhã o resultado vem!`;
    } else {
        message = 'Seu peso foi mantido. A constância é a chave para o sucesso!';
    }

    openModal(`
        <h2 style="color:var(--primary);">${title}</h2>
        <p style="margin:20px 0; line-height:1.6;">${message}</p>
        <button class="btn-primary" onclick="closeModal()">CONTINUAR</button>
    `);

    showTab('profile');
}

function showCoachMarketing() {
    openModal(`
        <div style="text-align:left;">
            <h2 style="color:var(--primary); font-weight:900; margin-bottom:15px;">Por que usar a Coach IA?</h2>
            <p style="font-size:0.9rem; line-height:1.6; color:#444; margin-bottom:15px;">
                Muitas pessoas desistem do jejum porque não sabem o que comer ou como lidar com imprevistos. A Coach IA resolve isso:
            </p>
            <ul style="list-style:none; padding:0; margin-bottom:20px;">
                <li style="margin-bottom:10px; font-size:0.85rem;">✅ <b>Substituições:</b> "Não tenho ovo, o que comer?" - Ela responde na hora.</li>
                <li style="margin-bottom:10px; font-size:0.85rem;">✅ <b>Motivação:</b> Está difícil hoje? Ela te dá o empurrão que falta.</li>
                <li style="margin-bottom:10px; font-size:0.85rem;">✅ <b>Ciência:</b> Pergunte o que acontece no seu corpo em cada hora.</li>
            </ul>
            <div style="background:#FFF9E6; padding:15px; border-radius:15px; margin-bottom:20px;">
                <p style="font-size:0.8rem; color:#856404; font-weight:700;">
                    🎁 <b>OFERTA EXCLUSIVA:</b> Como você já é membro do app, liberamos o acesso por apenas <b>R$ 9,90/mês</b> (Preço normal: R$ 29,90).
                </p>
            </div>
            <button class="btn-primary" onclick="unlockPremium()">QUERO MEU DESCONTO</button>
        </div>
    `);
}

function showTab(tabName) {
    state.activeTab = tabName;
    const content = document.getElementById('main-content');
    content.innerHTML = tabs[tabName]();

    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const tabsOrder = ['home', 'timer', 'coach', 'meals', 'profile'];
    const activeBtn = document.querySelector(`.nav-item:nth-child(${tabsOrder.indexOf(tabName) + 1})`);
    if (activeBtn) activeBtn.classList.add('active');

    if (tabName === 'coach' && state.isPremium) {
        scrollToBottom();
    }
}

function handleChatKey(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    state.chatHistory.push({ role: 'user', text: text });
    input.value = '';
    renderMessages();

    setTimeout(() => {
        const name = state.userName || "querida";
        const inputLower = text.toLowerCase();
        const currentDay = state.currentDay;

        let botText = `Estou aqui, ${name}! Vi que você está no Dia ${currentDay} do desafio. Como posso te orientar hoje? Se estiver com dúvida em alguma refeição, pode me falar o que tem em casa que eu resolvo pra você! 😉`;

        const responses = [
            {
                keys: ['fome', 'vontade de comer', 'estomago roncar'],
                text: `Oi ${name}, segura as pontas! No Dia ${currentDay} seu corpo está justamente aprendendo a usar aquela gordurinha acumulada como energia. Bebe um copão de água gelada, sua Maya aqui garante que passa em 10 minutinhos! 💧💪`
            },
            {
                keys: ['quebrar', 'quebra o jejum', 'pode comer', 'posso comer', 'liberado'],
                text: `Olha ${name}, foco total! Qualquer caloria agora quebra a sua autofagia. Café puro ou chá sem nada tá liberado! O resultado vem pra quem resiste a essa tentação agora. Vamos nessa? 🔥`
            },
            {
                keys: ['não tenho', 'substituir', 'trocar', 'outra opção', 'ingrediente', 'comida', 'alimento'],
                text: `Sem problemas, ${name}! Nossa lema é praticidade. Se falta o ingrediente do cardápio, me diz o que você TEM aí na geladeira (pode tirar uma foto se quiser!) que eu adapto pra você agora mesmo. 🥑🍳`
            },
            {
                keys: ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'maya'],
                text: `Oi ${name}! Tudo ótimo por aqui! Pronta para arrasar no seu Dia ${currentDay}? O que a sua Coach favorita pode fazer por você hoje? 😊`
            }
        ];


        for (const res of responses) {
            if (res.keys.some(k => inputLower.includes(k))) {
                botText = res.text;
                break;
            }
        }

        state.chatHistory.push({ role: 'bot', text: botText });
        localStorage.setItem('chatHistory', JSON.stringify(state.chatHistory));
        renderMessages();
    }, 1000);
}

function triggerPhoto() {
    state.chatHistory.push({ role: 'user', text: '(Enviou uma foto 📷)' });
    renderMessages();

    setTimeout(() => {
        const name = state.userName || "querida";
        const botText = `Uau, ${name}! Recebi sua foto. Deixa eu analisar aqui... Hum, vejo ótimas opções! Com esses ingredientes, eu sugiro você montar um prato com 50% de folhas e a proteína que está ali no cantinho. O que acha? 🥗✨`;
        state.chatHistory.push({ role: 'bot', text: botText });
        localStorage.setItem('chatHistory', JSON.stringify(state.chatHistory));
        renderMessages();
    }, 1500);
}


function renderMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML = state.chatHistory.map(msg => `
        <div class="message ${msg.role}">${msg.text}</div>
    `).join('');
    scrollToBottom();
}

function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
}

function unlockPremium() {
    openModal(`
        <h2 style="color:var(--primary);">Acesso Premium 💎</h2>
        <p style="margin:20px 0; line-height:1.6;">Para liberar sua <b>Coach IA Particular</b> e ter acompanhamento 24h, clique no botão abaixo para concluir sua assinatura de apenas R$ 9,90.</p>
        <div style="background:#FDFBFF; padding:15px; border-radius:15px; margin-bottom:20px; border:1px solid #EEE;">
            <p style="font-size:0.8rem; color:#666;">✅ Acesso Instantâneo<br>✅ Dúvidas 24h por dia<br>✅ Substituições de Alimentos</p>
        </div>
        <button class="btn-primary" onclick="redirectToCheckout()">LIBERAR ACESSO AGORA</button>
    `);
}

function redirectToCheckout() {
    if (LINK_CHECKOUT_COACH === "SEU_LINK_DE_PAGAMENTO_AQUI") {
        alert("Atenção: Você precisa configurar seu link de pagamento da Coach IA no topo do arquivo script.js!");
    } else {
        window.location.href = LINK_CHECKOUT_COACH;
    }
}

function toggleFasting() {
    state.isFasting = !state.isFasting;
    if (state.isFasting) {
        state.timerSeconds = 0;
        state.interval = setInterval(() => {
            state.timerSeconds++;
            updateTimerDisplay();
        }, 1000);
    } else {
        clearInterval(state.interval);
        if (state.timerSeconds > 5) {
            showCelebration();
            if (state.currentDay < challenges[state.activeChallenge].duration) {
                state.currentDay++;
                localStorage.setItem('currentDay', state.currentDay);
                state.lastAction = `Concluiu o Jejum do Dia ${state.currentDay - 1}`;
            }
        }
        state.timerSeconds = 0;
    }
    showTab(state.activeTab);
}


function showCelebration() {
    const name = state.userName ? `, ${state.userName}` : "";
    openModal(`
        <div style="text-align:center;">
            <span style="font-size:4rem;">🏆</span>
            <h2 style="color:var(--success); font-weight:900; margin:15px 0;">VITÓRIA${name.toUpperCase()}!</h2>
            <p style="font-size:0.95rem; line-height:1.6; color:#444; margin-bottom:20px;">
                Incrível! Enquanto você descansava, seu corpo fez uma <b>Faxina Metabólica</b>. <br><br>
                🔥 <b>O que aconteceu:</b> Suas células reciclaram proteínas velhas (Autofagia) e sua queima de gordura visceral foi acelerada. <br><br>
                Você está mais perto do seu objetivo hoje!
            </p>
            <button class="btn-primary" onclick="closeModal()">VAMOS CONTINUAR!</button>
        </div>
    `);
}

function updateTimerDisplay() {
    const hours = Math.floor(state.timerSeconds / 3600);
    const mins = Math.floor((state.timerSeconds % 3600) / 60);
    const secs = state.timerSeconds % 60;
    const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const display = document.getElementById('main-timer');
    if (display) display.innerText = timeStr;
}

function setChallenge(c) {
    state.activeChallenge = c;
    state.currentDay = 1;
    localStorage.setItem('activeChallenge', c);
    localStorage.setItem('currentDay', 1);
    showTab('profile');
}

function setProtocol(p) {
    state.protocol = p;
    localStorage.setItem('userProtocol', p);
    showTab('timer');
}

function showMealDetail(day) {
    const dailyMeal = challenges[state.activeChallenge].days[day - 1] || { breakfast: 'Omelete', lunch: 'Salada', dinner: 'Sopa' };
    openModal(`
        <h2 style="color:var(--primary); font-weight:900;">🥗 Cardápio Dia ${day}</h2>
        <div style="text-align:left; margin-top:15px;">
            <p><b>🍳 Café:</b> ${dailyMeal.breakfast}</p>
            <p><b>🥗 Almoço:</b> ${dailyMeal.lunch}</p>
            <p><b>🍲 Jantar:</b> ${dailyMeal.dinner}</p>
        </div>
        
        <div style="background:var(--primary-light); padding:15px; border-radius:15px; margin:20px 0; border:1px dashed var(--primary);">
            <p style="font-size:0.8rem; font-weight:700; color:var(--primary);">💡 Não tem esses itens?</p>
            <button class="btn-primary" style="margin-top:10px; height:40px; font-size:0.8rem;" onclick="closeModal(); showTab('coach');">PEDIR SUBSTITUIÇÃO PARA MAYA</button>
        </div>

        <button class="btn-primary" style="margin-top:0px;" onclick="closeModal()">FECHAR</button>

    `);
}

function openModal(content) {
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

let tutorialStep = 0;
const tutorialSteps = [
    { title: "Bem-vinda ao Método! 🥑", text: "Pronto! Agora você tem o protocolo completo de 28 dias nas mãos. Vamos te mostrar como usar.", icon: "✨" },
    { title: "Timer de Queima 🔥", text: "Na aba 'Jejum', você ativa o cronômetro. É aqui que a mágica da queima de gordura acontece.", icon: "⏱️" },
    { title: "Cardápio Diário 🍲", text: "Cada dia de jejum concluído libera um novo cardápio nutritivo para você não passar fome.", icon: "🥗" },
    { title: "Coach IA Particular 🤖", text: "Dúvidas? Substituições? Nossa IA está disponível 24h para te guiar em cada passo.", icon: "💎" }
];

function startTutorial() {
    tutorialStep = 0;
    showTutorialStep();
}

function showTutorialStep() {
    const step = tutorialSteps[tutorialStep];
    const isLast = tutorialStep === tutorialSteps.length - 1;
    openModal(`
        <div style="text-align:center;">
            <div style="display:flex; justify-content:center; gap:5px; margin-bottom:20px;">
                ${tutorialSteps.map((_, i) => `<div style="width:20px; height:4px; background:${i === tutorialStep ? 'var(--primary)' : '#EEE'}; border-radius:10px;"></div>`).join('')}
            </div>
            <span style="font-size:3.5rem;">${step.icon}</span>
            <h2 style="color:var(--text); font-weight:900; margin:15px 0;">${step.title}</h2>
            <p style="font-size:0.9rem; color:#666; line-height:1.6; margin-bottom:25px;">${step.text}</p>
            <div style="display:flex; gap:10px;">
                ${tutorialStep > 0 ? `<button class="btn-secondary" style="flex:1; background:#F5F0FF; border:none; padding:15px; border-radius:50px; font-weight:700; color:var(--primary);" onclick="prevTutorial()">Anterior</button>` : ''}
                <button class="btn-primary" style="flex:1;" onclick="${isLast ? 'closeModal()' : 'nextTutorial()'}">${isLast ? 'Finalizar' : 'Próximo'}</button>
            </div>
            <button style="background:none; border:none; color:#AAA; font-size:0.75rem; margin-top:15px; cursor:pointer;" onclick="closeModal()">Pular tutorial</button>
        </div>
    `);
}

function nextTutorial() { tutorialStep++; showTutorialStep(); }
function prevTutorial() { tutorialStep--; showTutorialStep(); }

document.addEventListener('DOMContentLoaded', () => {
    showTab('home');
    if (state.isFirstTime) {
        setTimeout(startTutorial, 1000);
        localStorage.setItem('returningUser', 'true');
    }
});

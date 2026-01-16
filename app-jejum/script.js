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
        { role: 'bot', text: 'Oi! Eu sou a Maia, sua nutricionista e coach particular. Estou aqui pra te ajudar a dominar o jejum e transformar seu metabolismo! O que vamos fazer hoje?' }
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
    "A disciplina de hoje é o resultado de amanhã. 🚀",
    "Sente a leveza? Seu corpo está desinflamando. 🍃",
    "Beber água agora vai silenciar a fome em 10min. ⏱️",
    "Você é mais forte que qualquer vontade passageira de comer! 💪"
];

const challenges = {
    '3-day': {
        name: 'DETOX EXPRESS',
        desc: '3 dias para desinflamar',
        duration: 3,
        milestones: [
            { day: 1, icon: '🌱' },
            { day: 2, icon: '🧼' },
            { day: 3, icon: '✨' }
        ],
        days: [
            { breakfast: 'Omelete com espinafre', lunch: 'Salada de frango com abacate', dinner: 'Sopa de abóbora com gengibre' },
            { breakfast: 'Yogurte com sementes de chia', lunch: 'Peixe grelhado com legumes no vapor', dinner: 'Creme de abobrinha' },
            { breakfast: 'Ovos mexidos com tomate', lunch: 'Carne moída com couve-flor', dinner: 'Sopa detox de folhas verdes' }
        ]
    },
    '7-day': {
        name: 'LIMPEZA PROFUNDA',
        desc: '7 dias de renovação atômica',
        duration: 7,
        milestones: [
            { day: 1, icon: '🌱' },
            { day: 4, icon: '🧼' },
            { day: 7, icon: '✨' }
        ],
        days: Array(7).fill({ breakfast: 'Opção Leve Maia', lunch: 'Proteína + Verde', dinner: 'Sopa Nutritiva' })
    },
    '28-day': {
        name: 'METABOLISMO BLINDADO',
        desc: 'Sua nova versão em 28 dias',
        duration: 28,
        milestones: [
            { day: 1, icon: '🚀' },
            { day: 7, icon: '🧼' },
            { day: 14, icon: '🔥' },
            { day: 21, icon: '💎' },
            { day: 28, icon: '👑' }
        ],
        days: Array(28).fill({ breakfast: 'Protocolo VIP Maia', lunch: 'Prato Equilibrado', dinner: 'Ceia Metabólica' })
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
                        <h3 style="font-weight:900; color:var(--primary);">DESAFIO ATIVO - DIA ${state.currentDay}</h3>
                        <p style="font-size:0.75rem; color:#888;">${currentChallenge.name}: ${currentChallenge.desc}</p>
                    </div>
                </div>
                ${timelineHTML}
            </div>

            <div class="card timer-main-card">
                <div class="timer-circle-container">
                    <div class="timer-circle ${state.isFasting ? 'fasting' : ''}">
                        <svg class="timer-svg" viewBox="0 0 100 100">
                            <circle class="timer-bg" cx="50" cy="50" r="45"></circle>
                            <circle class="timer-progress" id="timer-progress" cx="50" cy="50" r="45"></circle>
                        </svg>
                        <div class="timer-inner">
                            <div class="timer-time" id="main-timer">00:00:00</div>
                            <div class="timer-label">${state.isFasting ? 'QUEIMANDO GORDURA' : 'PRONTA?'}</div>
                        </div>
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
                        <p style="font-size:0.8rem; color:#666;" id="maya-dynamic-tip">Beba 500ml de água com limão agora para acelerar o processo!</p>
                    </div>
                </div>
            </div>

            <div class="feedback-section" style="margin-top:20px;">
                <h3 style="font-size:1rem; color:var(--text); margin-bottom:15px; font-weight:900;">O que estão dizendo...</h3>
                <div class="feedback-card">
                    <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
                        <div style="width:30px; height:30px; background:#DDD; border-radius:50%; font-size:0.7rem; display:flex; align-items:center; justify-content:center; font-weight:900;">RC</div>
                        <strong style="font-size:0.8rem;">Rita C.</strong>
                        <span style="color:#FFD700;">★★★★★</span>
                    </div>
                    <p style="font-size:0.75rem; color:#666;">"A Maia me ajudou muito hoje quando eu quase desisti do jejum de 16h. Incrível!"</p>
                </div>
                <div class="feedback-card" style="margin-top:10px;">
                    <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
                        <div style="width:30px; height:30px; background:#F3E5F5; border-radius:50%; font-size:0.7rem; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary);">ML</div>
                        <strong style="font-size:0.8rem;">Maria L.</strong>
                        <span style="color:#FFD700;">★★★★★</span>
                    </div>
                    <p style="font-size:0.75rem; color:#666;">"O cardápio do dia 3 é uma delícia. Nem parece que estou em dieta."</p>
                </div>
            </div>

            <div class="card" style="margin-top:30px; background: #fdfbff; border: 1px solid #eee;">
                <h4 style="font-size:0.8rem; margin-bottom:10px;">Dê sua opinião</h4>
                <textarea id="user-feedback" placeholder="Como está sua experiência?" style="width:100%; border:1px solid #ddd; border-radius:10px; padding:10px; font-size:0.8rem; height:60px; outline:none;"></textarea>
                <button class="btn-primary" style="margin-top:10px; height:35px; font-size:0.75rem;" onclick="sendFeedback()">ENVIAR FEEDBACK</button>
            </div>
        `;
    },
    timer: () => `
        <div class="card">
            <h2 style="font-weight:900;">Escolha seu Ritmo</h2>
            <p style="color:#666; font-size:0.85rem; margin-bottom:15px;">Quanto mais tempo, mais profunda é a faxina celular.</p>
            <div style="display:grid; grid-template-columns: 1fr; gap:12px;">
                ${Object.keys(protocols).map(p => `
                    <div class="protocol-card ${state.protocol === p ? 'selected' : ''}" 
                         onclick="setProtocol('${p}')">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <div style="font-weight:900; color:var(--primary); font-size:1.3rem;">${p}</div>
                                <div style="font-size:0.8rem; color:#555; font-weight:700;">${protocols[p].desc}</div>
                            </div>
                            <span style="font-size:1.5rem;">${protocols[p].level === 1 ? '🌱' : protocols[p].level === 2 ? '🔥' : '⚡'}</span>
                        </div>
                        <div class="protocol-detail" style="margin-top:10px; font-size:0.75rem; line-height:1.4; color:#666;">
                            ${p === '12:12' ? 'Ideal para quem está começando. Mantém o açúcar no sangue estável e introduz o corpo à queima de gordura.' :
            p === '14:10' ? 'Neste nível, a autofagia começa a agir timidamente, acelerando a renovação das células e a perda de peso.' :
                'O Padrão Ouro. Aqui você entra em queima de gordura profunda e ativa a reciclagem proteica total.'}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="card">
            <h3 style="margin-bottom:10px;">O que acontece agora?</h3>
            <div class="physics-info" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
                <div style="background:#F5F0FF; padding:15px; border-radius:18px;">
                    <strong style="font-size:0.8rem; display:block; margin-bottom:5px;">04-08 Horas</strong>
                    <p style="font-size:0.7rem; color:#666;">Insulina cai e o corpo começa a usar reservas.</p>
                </div>
                <div style="background:#F5F0FF; padding:15px; border-radius:18px;">
                    <strong style="font-size:0.8rem; display:block; margin-bottom:5px;">12+ Horas</strong>
                    <p style="font-size:0.7rem; color:#666;">A queima de gordura visceral entra em pico.</p>
                </div>
            </div>
        </div>
    `,
    coach: () => {
        if (!state.isPremium) {
            return `
                <div class="card premium-lock">
                    <div class="maya-avatar-marketing">👩‍⚕️</div>
                    <h2 style="font-weight:900; color:var(--primary); line-height:1.2; margin-top:15px;">Conheça a Maia IA Nutri: <br>Sua Aliada 24h</h2>
                    <p style="color:#666; margin-top:10px; font-size:1rem; font-weight:600;">
                        Diga adeus às dúvidas sobre o que comer! A Maia monta suas refeições, sugere trocas e te motiva a não desistir.
                    </p>
                    
                    <div style="background:var(--primary-light); padding:15px; border-radius:20px; margin:20px 0; border:1px dashed var(--primary);">
                        <p style="font-size:0.9rem; color:var(--primary); font-weight:800;">
                            💎 Assinatura VIP: Apenas R$ 9,90/mês <br>
                            <span style="font-weight:500; font-size:0.75rem;">(Cancele quando quiser, sem perguntas!)</span>
                        </p>
                    </div>

                    <ul style="text-align:left; font-size:0.85rem; padding:0 10px; margin-bottom:20px; list-style:none;">
                        <li style="margin-bottom:10px;">✅ <b>Inteligência Clínica:</b> Respostas baseadas em nutrição real.</li>
                        <li style="margin-bottom:10px;">✅ <b>Análise de Fotos:</b> Mande foto do prato e ela avalia!</li>
                        <li style="margin-bottom:10px;">✅ <b>Suporte Emocional:</b> Nos dias difíceis, a Maia te segura.</li>
                    </ul>

                    <button class="btn-primary" onclick="unlockPremium()">QUERO MINHA ASSINATURA AGORA</button>
                    <p style="font-size:0.7rem; color:#999; margin-top:15px;">Assinatura renovada mensalmente de forma automática.</p>
                </div>
            `;
        }


        return `
            <div class="chat-container">
                <div class="chat-header-maya">
                    <div class="maya-avatar">👩‍⚕️</div>
                    <div class="maya-info">
                        <strong>MAIA IA NUTRI</strong>
                        <span>Sua Coach Particular</span>
                    </div>
                </div>
                <div class="chat-messages" id="chat-messages">
                    ${state.chatHistory.map(msg => `
                        <div class="message ${msg.role}">${msg.text}</div>
                    `).join('')}
                </div>
                <div class="chat-input-area">
                    <input type="file" id="photo-input" style="display:none" accept="image/*" onchange="handlePhotoUpload(event)">
                    <button class="btn-photo" onclick="document.getElementById('photo-input').click()"><span style="font-size:1.2rem;">📷</span></button>
                    <input type="text" id="chat-input" class="chat-input" placeholder="Oi Maia, pode me sugerir uma troca?" onkeypress="handleChatKey(event)">
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
                <div class="body-state" style="background: ${isLoss ? '#F0FFF9' : isGain ? '#FFF5F5' : '#FDFBFF'}; border-color: ${isLoss ? 'var(--success)' : isGain ? 'var(--secondary)' : '#EEE'}; padding: 25px;">
                    <span class="state-icon" style="font-size:2.5rem;">${isLoss ? '🎉' : isGain ? '⚠️' : '⚖️'}</span>
                    <div class="state-info">
                        <h4 style="font-size:1.2rem;">${isLoss ? `Você já eliminou ${weightDiff}kg!` : isGain ? `Atenção: +${Math.abs(weightDiff)}kg` : 'Peso estável'}</h4>
                        <p style="font-size:0.9rem;">${isLoss ? 'Incrível! Seu esforço está transformando seu corpo.' : isGain ? 'Não desanime! Vamos ajustar o foco hoje.' : 'Mantenha o foco no objetivo.'}</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="card" style="padding: 30px;">
                <h2 style="color:var(--primary); font-weight:900; margin-bottom:20px; font-size:1.6rem;">👤 Seu Perfil</h2>
                
                <div style="margin-bottom:20px;">
                    <label style="font-size:0.85rem; font-weight:900; color:var(--primary); text-transform:uppercase;">Seu Nome</label>
                    <input type="text" id="name-input" value="${state.userName}" placeholder="Ex: Maria" style="width:100%; padding:15px; border:2px solid #F5F0FF; border-radius:15px; font-weight:700; margin-top:8px; font-size:1.1rem;">
                </div>

                <div style="margin-bottom:20px;">
                    <label style="font-size:0.85rem; font-weight:900; color:var(--primary); text-transform:uppercase;">Idade</label>
                    <input type="number" id="age-input" value="${state.userAge}" placeholder="Ex: 45" style="width:100%; padding:15px; border:2px solid #F5F0FF; border-radius:15px; font-weight:700; margin-top:8px; font-size:1.1rem;">
                </div>

                <div style="margin-bottom:20px;">
                    <label style="font-size:0.85rem; font-weight:900; color:var(--primary); text-transform:uppercase;">Peso Atual (kg)</label>
                    <input type="number" id="weight-input" value="${state.weight}" style="width:100%; padding:15px; border:2px solid #F5F0FF; border-radius:15px; font-weight:700; margin-top:8px; font-size:1.1rem;">
                </div>

                <button class="btn-primary" onclick="saveProfile()" style="height:65px; font-size:1.2rem;">ATUALIZAR MEUS DADOS</button>
            </div>

            <div class="card" style="padding: 30px;">
                <h2 style="color:var(--primary); font-weight:900; margin-bottom:10px; font-size:1.3rem;">🎯 Alterar Meta</h2>
                <div class="challenge-list" style="margin-top:20px;">
                    ${Object.keys(challenges).map(key => `
                        <div class="challenge-card ${state.activeChallenge === key ? 'active' : ''}" onclick="setChallenge('${key}')" style="padding:22px;">
                            <div class="challenge-info">
                                <h4 style="font-size:1.1rem;">${challenges[key].name}</h4>
                                <p style="font-size:0.85rem;">${challenges[key].desc}</p>
                            </div>
                            <span style="font-size:2rem; margin-left:15px;">${key === '3-day' ? '🌱' : key === '7-day' ? '🧼' : '👑'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${progressHTML}

            <div class="card" style="border: 2px dashed var(--primary-light); background: #fdfbff; padding: 30px; text-align:center;">
                <h3 style="font-size:1.2rem; margin-bottom:12px; font-weight:900;">Precisa de Ajuda?</h3>
                <p style="font-size:0.95rem; color:#666; margin-bottom:20px;">Tem dúvida sobre algum alimento ou efeito colateral?</p>
                <button class="btn-primary" style="background:linear-gradient(90deg, #D845FF, #7C4DFF);" onclick="showTab('coach')">FALAR COM A MAIA IA</button>
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

    // Update labels for TikTok audience
    const labels = {
        'home': 'Início',
        'timer': 'Tempo',
        'coach': 'Maia IA',
        'meals': 'Cardápio',
        'profile': 'Perfil'
    };

    document.querySelectorAll('.nav-item').forEach((item, index) => {
        const tab = tabsOrder[index];
        const label = item.querySelector('.nav-label');
        if (label) label.innerText = labels[tab];
        if (tab === tabName) item.classList.add('active');
    });

    if (tabName === 'coach' && state.isPremium) {
        scrollToBottom();
    }

    if (tabName === 'home') {
        updateTimerDisplay();
        startMayaTips();
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

    // Mostrar estado de digitando
    const typingMsg = { role: 'bot', text: 'Maia está analisando... 💭', isTyping: true };
    state.chatHistory.push(typingMsg);
    renderMessages();

    setTimeout(() => {
        // Remover mensagem de digitando
        state.chatHistory = state.chatHistory.filter(m => !m.isTyping);

        const name = state.userName || "querida";
        const inputLower = text.toLowerCase();
        const currentDay = state.currentDay;

        let botText = `Estou aqui, ${name}! Vi que você está no Dia ${currentDay} do desafio. Como posso te orientar hoje? Se estiver com dúvida em alguma refeição, pode me falar o que tem em casa que eu resolvo pra você! 😉`;

        const responses = [
            {
                keys: ['fome', 'vontade de comer', 'estomago roncar'],
                text: `Oi ${name}, segura as pontas! No Dia ${currentDay} seu corpo está justamente aprendendo a usar aquela gordurinha acumulada como energia. Bebe um copão de água gelada, sua Maia aqui garante que passa em 10 minutinhos! 💧💪`
            },
            {
                keys: ['quebrar', 'quebra o jejum', 'pode comer', 'posso comer', 'liberado', 'leite', 'açúcar', 'adoçante'],
                text: `Olha ${name}, foco total! Qualquer caloria agora quebra a sua autofagia e para a queima de gordura. Água, café puro ou chá sem nada tá liberado! O resultado vem pra quem resiste agora. Vamos juntas? 🔥`
            },
            {
                keys: ['não tenho', 'substituir', 'trocar', 'outra opção', 'ingrediente', 'comida', 'alimento', 'geladeira'],
                text: `Sem problemas, ${name}! Nossa lema é praticidade. Se falta o ingrediente do cardápio, me diz o que você TEM aí na geladeira (pode mandar foto dela!) que eu monto uma combinação nutritiva pra você agora mesmo. 🥑🍳`
            },
            {
                keys: ['dor de cabeça', 'tontura', 'fraqueza'],
                text: `Oi ${name}, isso pode ser falta de eletrólitos! Coloque uma pitadinha de sal integral na língua e beba 300ml de água. Se persistir, coma um pedaço pequeno de proteína leve. Mas geralmente o sal resolve em minutos! 🧂✨`
            },
            {
                keys: ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'maia'],
                text: `Oi ${name}! Tudo incrível por aqui! Pronta para arrasar no seu Dia ${currentDay}? O que a sua nutri favorita pode fazer por você hoje? 😊`
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
    }, 1500);
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    state.chatHistory.push({ role: 'user', text: `📷 Enviou uma foto de: ${file.name}` });
    renderMessages();

    // Simular processamento
    const typingMsg = { role: 'bot', text: 'Maia está escaneando sua foto... 🔍', isTyping: true };
    state.chatHistory.push(typingMsg);
    renderMessages();

    setTimeout(() => {
        state.chatHistory = state.chatHistory.filter(m => !m.isTyping);
        const name = state.userName || "querida";
        const botText = `Uau, ${name}! Recebi sua foto. Deixa eu analisar os ingredientes aqui... Hum, vejo ótimas opções! Com base nisso, eu sugiro você montar um prato com 50% de folhas verdes, a proteína que vi ali e uma gordura boa (azeite ou abacate). O que acha? 🥗✨`;
        state.chatHistory.push({ role: 'bot', text: botText });
        localStorage.setItem('chatHistory', JSON.stringify(state.chatHistory));
        renderMessages();
    }, 2500);
}


function renderMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML = state.chatHistory.map(msg => `
        <div class="message ${msg.role}" ${msg.isTyping ? 'isTyping="true"' : ''}>${msg.text}</div>
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
    if (!state.isFasting) {
        state.isFasting = true;
        state.timerSeconds = 0;
        state.interval = setInterval(() => {
            state.timerSeconds++;
            updateTimerDisplay();
        }, 1000);
        showTab(state.activeTab);
    } else {
        showPauseOptions();
    }
}

function showPauseOptions() {
    openModal(`
        <div style="text-align:center;">
            <span style="font-size:3.5rem;">🛑</span>
            <h2 style="color:var(--primary); font-weight:900; margin:15px 0;">PAUSAR JEJUM?</h2>
            <p style="font-size:0.9rem; color:#666; line-height:1.6; margin-bottom:25px;">
                Você está indo tão bem! Se parar agora, a <b>Faxina Celular</b> será interrompida.
                O que deseja fazer?
            </p>
            <div style="display:flex; flex-direction:column; gap:12px;">
                <button class="btn-primary" onclick="closeModal()">CONTINUAR FIRME 🔥</button>
                <button class="btn-secondary" style="background:#FFF5F5; color:#FF5252; border:none; padding:15px; border-radius:50px; font-weight:700;" onclick="stopFasting()">ZERAR CRONÔMETRO</button>
            </div>
        </div>
    `);
}

function stopFasting() {
    clearInterval(state.interval);
    state.isFasting = false;

    if (state.timerSeconds < 3600) {
        showShortFastMessage();
    } else {
        showCelebration();
        if (state.currentDay < challenges[state.activeChallenge].duration) {
            state.currentDay++;
            localStorage.setItem('currentDay', state.currentDay);
        }
    }
    state.timerSeconds = 0;
    closeModal();
    showTab(state.activeTab);
}

function showShortFastMessage() {
    const name = state.userName ? `, ${state.userName}` : "";
    openModal(`
        <div style="text-align:center;">
            <span style="font-size:4rem;">⏱️</span>
            <h2 style="color:var(--primary); font-weight:900; margin:15px 0;">FILTROU POR HOJE${name.toUpperCase()}?</h2>
            <p style="font-size:0.95rem; line-height:1.6; color:#444; margin-bottom:20px;">
                Você parou o timer antes de completar pelo menos 1 hora de jejum. Para que a sua <b>Queima Metabólica</b> realmente comece, o corpo precisa de um pouco mais de tempo. 
                <br><br>
                Cada minuto conta para desinflamar seu corpo! Quer tentar novamente agora e bater sua meta? 🔥
            </p>
            <button class="btn-primary" onclick="closeModal()">CONTAGEM REGRESSIVA NOVAMENTE</button>
        </div>
    `);
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

    const progressCircle = document.getElementById('timer-progress');
    if (progressCircle) {
        const protocolHours = parseInt(state.protocol.split(':')[0]);
        const targetSeconds = protocolHours * 3600;
        const actualProgress = Math.min(state.timerSeconds / targetSeconds, 1);
        const visualProgress = Math.pow(actualProgress, 0.6);
        const circumference = 283;
        const offset = circumference - (visualProgress * circumference);
        progressCircle.style.strokeDashoffset = offset;
    }
}

function setChallenge(c) {
    state.activeChallenge = c;
    state.currentDay = 1;
    localStorage.setItem('activeChallenge', c);
    localStorage.setItem('currentDay', 1);

    openModal(`
        <div style="text-align:center;">
            <span style="font-size:3.5rem;">🎯</span>
            <h2 style="color:var(--primary); font-weight:900; margin:15px 0;">DESAFIO ATUALIZADO!</h2>
            <p style="font-size:0.9rem; color:#666; margin-bottom:20px;">Você mudou sua meta para o <b>${challenges[c].name}</b>. Seu progresso foi reiniciado para o Dia 1. Vamos com tudo?</p>
            <button class="btn-primary" onclick="closeModal(); showTab('home');">COMECAR AGORA!</button>
        </div>
    `);
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

function sendFeedback() {
    const feedback = document.getElementById('user-feedback').value.trim();
    if (!feedback) return;

    openModal(`
        <div style="text-align:center;">
            <span style="font-size:4rem;">💌</span>
            <h2 style="color:var(--primary); font-weight:900; margin:15px 0;">OBRIGADO!</h2>
            <p style="font-size:0.95rem; color:#444; line-height:1.6;">Seu feedback foi enviado diretamente para nossa equipe de desenvolvimento. Ele ajuda muito a melhorar a Maia!</p>
            <button class="btn-primary" style="margin-top:20px;" onclick="closeModal()">FECHAR</button>
        </div>
    `);
    document.getElementById('user-feedback').value = '';
}

function startMayaTips() {
    if (window.mayaTipsInterval) clearInterval(window.mayaTipsInterval);

    const tips = [
        "Beba 300ml de água agora para silenciar a fome. 💧",
        "O chá de hibisco é ótimo para desinflamar o corpo. ☕",
        "Lembre-se: o resultado vem com a constância! ✨",
        "Sente tontura? Uma pitada de sal na língua ajuda muito. 🧂",
        "A queima de gordura visceral está no pico agora! 🔥"
    ];
    let tipIndex = 0;
    window.mayaTipsInterval = setInterval(() => {
        const tipEl = document.getElementById('maya-dynamic-tip');
        if (!tipEl) {
            clearInterval(window.mayaTipsInterval);
            return;
        }
        tipEl.style.opacity = 0;
        setTimeout(() => {
            tipIndex = (tipIndex + 1) % tips.length;
            tipEl.innerText = tips[tipIndex];
            tipEl.style.opacity = 1;
        }, 500);
    }, 10000);
}

let tutorialStep = 0;
const tutorialSteps = [
    { title: "Bem-vinda ao Método! 🥑", text: "Pronto! Agora você tem o protocolo completo de 28 dias nas mãos. Vamos te mostrar como usar.", icon: "✨" },
    { title: "Timer de Queima 🔥", text: "Na aba 'Tempo', você ativa o cronômetro. É aqui que a mágica da queima de gordura acontece.", icon: "⏱️" },
    { title: "Cardápio Diário 🍲", text: "Cada dia de jejum concluído libera um novo cardápio nutritivo para você não passar fome.", icon: "🥗" },
    { title: "Maia IA Nutri 🤖", text: "Dúvidas? Substituições? Nossa IA está disponível 24h para te guiar em cada passo.", icon: "💎" }
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

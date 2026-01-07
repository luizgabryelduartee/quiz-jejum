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
        days: []
    },
    '28-day': {
        name: 'Transformação Total',
        desc: 'Novo estilo de vida e peso ideal',
        duration: 28,
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
        const greeting = state.userName ? `Olá, ${state.userName}! 👋` : "Bem-vinda! 👋";
        return `
            <div class="motivation-card">
                <h2 style="font-size:1.4rem;">${greeting}</h2>
                <p style="font-size:0.9rem; opacity:0.9; margin-top:8px;">${randomPhrase}</p>
            </div>

            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <span class="status-badge" style="background:#FFF; color:var(--primary)">${challenges[state.activeChallenge].name}</span>
                    <span style="font-weight:800; color:var(--primary); font-size:0.9rem;">DIA ${state.currentDay}/${challenges[state.activeChallenge].duration}</span>
                </div>
                <p style="color:#666; font-size:0.9rem;">Complete o desafio de hoje e sinta a diferença no seu corpo.</p>
            </div>

            <div class="card" style="text-align:center;">
                <div class="timer-circle" style="border-top-color: ${state.isFasting ? 'var(--secondary)' : '#F0F0F0'}">
                    <div class="timer-time" id="main-timer">00:00:00</div>
                    <div class="timer-label">${state.isFasting ? 'EM QUEIMA' : 'COMEÇAR'}</div>
                </div>
                <button class="btn-primary" onclick="toggleFasting()">${state.isFasting ? 'CONCLUIR HOJE' : 'INICIAR JEJUM'}</button>
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
                    <h2 style="font-weight:900; color:var(--primary); line-height:1.2;">Sua Nutricionista IA <br>Particular 24h</h2>
                    <p style="color:#666; margin-top:15px; font-size:0.95rem; font-weight:600;">
                        Tire dúvidas, peça substituições e acelere seus resultados por apenas <span style="color:var(--success)">R$ 9,90/mês</span>.
                    </p>
                    
                    <div style="background:var(--primary-light); padding:15px; border-radius:20px; margin:20px 0; border:1px dashed var(--primary);">
                        <p style="font-size:0.85rem; color:var(--primary); font-weight:800;">
                            💰 Apenas R$ 0,33 por dia! <br>
                            <span style="font-weight:500; font-size:0.75rem;">(Menos que o preço de um cafézinho)</span>
                        </p>
                    </div>

                    <button class="btn-primary" onclick="unlockPremium()">ATIVAR COACH AGORA</button>
                    <button class="btn-secondary" style="margin-top:10px; background:none; border:none; color:var(--text-muted); font-weight:700; font-size:0.8rem; text-decoration:underline; cursor:pointer;" onclick="showCoachMarketing()">Entender melhor como funciona</button>
                </div>
            `;
        }

        return `
            <div class="chat-container">
                <div class="chat-messages" id="chat-messages">
                    ${state.chatHistory.map(msg => `
                        <div class="message ${msg.role}">${msg.text}</div>
                    `).join('')}
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" class="chat-input" placeholder="Pergunte algo ao Coach..." onkeypress="handleChatKey(event)">
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
        let botText = `Entendi sua dúvida, ${name}. Como sua Coach IA, estou aqui para garantir que você tenha sucesso. O jejum intermitente é uma ferramenta poderosa de saúde e queima de gordura. O que mais você gostaria de saber?`;

        const responses = [
            {
                keys: ['fome', 'vontade de comer', 'estomago roncar'],
                text: `Olha, ${name}, sentir fome é sinal de que seu corpo está aprendendo a queimar gordura! Tente beber 300ml de água gelada ou um café preto sem açúcar. Isso costuma passar em 15 minutos.`
            },
            {
                keys: ['quebrar', 'quebra o jejum', 'pode comer', 'posso comer', 'liberado'],
                text: `Para não quebrar o jejum, ${name}, evite qualquer caloria. Café com açúcar, leite ou sucos quebram o processo. Água, chás naturais e café puro são seus melhores amigos.`
            },
            {
                keys: ['beber', 'bebida', 'água', 'café', 'chá', 'suco', 'refrigerante', 'alcool', 'cerveja', 'vinho'],
                text: `Durante o jejum, ${name}, você pode beber água (com ou sem gás), café puro (sem açúcar/adoçante) e chás naturais. Evite sucos, refrigerantes (mesmo zero) e álcool, pois eles podem disparar a insulina ou inflamar o corpo.`
            },
            {
                keys: ['não tenho', 'substituir', 'trocar', 'outra opção', 'ingrediente', 'comida', 'alimento'],
                text: `Sem problemas, ${name}! Se você não tem um ingrediente, foque na proteína. Pode trocar o ovo por frango desfiado ou atum, e o espinafre por qualquer folha verde escura que tiver em casa. O segredo é manter o carboidrato baixo.`
            },
            {
                keys: ['como uso', 'como funciona', 'ajuda', 'tutorial', 'usar o app', 'passo a passo'],
                text: `É simples, ${name}! <br>1. Use o **'Timer'** para marcar seu jejum.<br>2. Siga o **'Cardápio'** do dia liberado.<br>3. Registre seu peso no **'Perfil'** para ver sua evolução.<br>Eu estou aqui 24h para tirar dúvidas específicas!`
            },
            {
                keys: ['dor de cabeça', 'tontura', 'fraqueza', 'mal estar', 'enjoo'],
                text: `Isso pode ser a 'Gripe do Low Carb', ${name}. Geralmente é falta de sais minerais. Tente colocar uma pitada de sal integral na água e beber. A hidratação é fundamental!`
            },
            {
                keys: ['suplemento', 'vitamina', 'remedio', 'medicamento', 'creatina', 'whey'],
                text: `Remédios devem ser tomados conforme orientação médica, ${name}. Suplementos como Creatina não quebram o jejum. Já o Whey Protein quebra, pois contém calorias e proteína. Deixe o Whey para sua janela de alimentação.`
            },
            {
                keys: ['emagrecer', 'perder peso', 'resultado', 'rápido', 'barriga', 'gordura'],
                text: `O Método Jejum 01 é focado em resultados reais, ${name}. Seguindo o protocolo de 28 dias, você vai reprogramar seu metabolismo para queimar gordura como fonte primária de energia. A constância é o segredo!`
            },
            {
                keys: ['exercício', 'treino', 'academia', 'malhar', 'corrida', 'caminhada'],
                text: `Você pode sim treinar em jejum, ${name}, mas comece leve se for sua primeira vez. O treino em jejum potencializa a queima de gordura, mas ouça seu corpo e mantenha a hidratação alta!`
            },
            {
                keys: ['dormir', 'sono', 'insonia', 'noite'],
                text: `O jejum costuma melhorar a qualidade do sono a longo prazo, ${name}. Tente não comer muito perto da hora de dormir para que seu corpo foque no descanso e não na digestão.`
            },
            {
                keys: ['estagnado', 'não emagreço', 'parou de perder', 'balança não mexe'],
                text: `Platôs são normais, ${name}. Às vezes o corpo está se ajustando. Tente mudar seu protocolo (ex: passar de 12h para 16h) ou aumentar a ingestão de água. Não desista!`
            },
            {
                keys: ['doce', 'açucar', 'chocolate', 'sobremesa', 'vontade de doce'],
                text: `A vontade de doce diminui com o tempo de jejum, ${name}. Se estiver muito difícil, coma um pedaço pequeno de chocolate 70% cacau logo após a sua refeição principal.`
            },
            {
                keys: ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'tudo bem'],
                text: `Olá, ${name}! Como está sendo seu dia de jejum hoje? Em que posso te ajudar para garantir que você alcance sua meta?`
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
        <button class="btn-primary" style="margin-top:20px;" onclick="closeModal()">FECHAR</button>
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

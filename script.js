const state = {
    currentStep: 0,
    answers: {},
    userData: {
        height: 165,
        weight: 75,
        targetWeight: 65
    }
};

const questions = [
    {
        id: 'intro',
        type: 'intro',
        title: 'Ative seu metabolismo em 7 dias com o Roteiro das Famosas',
        description: 'Descubra como mulheres 40+ estão equilibrando o peso e recuperando a energia sem restrições drásticas.',
        image: 'inicio.png',
        buttonText: 'EXPERIMENTAR AGORA'
    },
    {
        id: 'satisfaction',
        type: 'single',
        title: 'Qual dessas fases você sente que melhor descreve seu corpo hoje?',
        options: [
            { text: 'Ganho de peso na barriga', emoji: '🤰' },
            { text: 'Fase de Menopausa ativa', emoji: '👩' },
            { text: 'Metabolismo "em greve"', emoji: '🐢' },
            { text: 'Dificuldade em manter o peso', emoji: '⚖️' }
        ]
    },
    {
        id: 'objective',
        type: 'single',
        title: 'Qual é o seu principal objetivo hoje?',
        options: [
            { text: 'Equilíbrio de peso', emoji: '🤩' },
            { text: 'Sentir-se mais disposta', emoji: '💪' },
            { text: 'Apoio à saúde', emoji: '❤️' },
            { text: 'Redução do estresse', emoji: '🧘' }
        ]
    },
    {
        id: 'current_body',
        type: 'grid',
        title: 'E qual desses tipos de corpo você considera mais parecido com o seu?',
        images: ['1quiz4.webp', '2quiz4.webp', '3quiz4.webp', '4quiz4.webp'],
        options: ['Magra', 'Médio', 'Um pouco acima', 'Bem acima']
    },
    {
        id: 'dream_body',
        type: 'grid',
        title: 'Ótimo, e como seria o seu corpo dos sonhos?',
        images: ['1quiz5.webp', '2quiz5.webp', '3quiz5.webp', '4quiz5.webp'],
        options: ['Magro', 'Tonificado', 'Com curvas', 'Médio']
    },
    {
        id: 'metabolism',
        type: 'single',
        title: 'Como você percebe seu ritmo metabólico hoje?',
        options: [
            { text: 'Lento (ganho rápido)', emoji: '🐢' },
            { text: 'Equilibrado', emoji: '⚖️' },
            { text: 'Rápido', emoji: '⚡' }
        ]
    },
    {
        id: 'info_fasting',
        type: 'info',
        title: 'O que é o Jejum Intermitente?',
        description: 'É uma ferramenta para apoiar o equilíbrio natural do seu corpo, auxiliando na regulação do ciclo circadiano e bem-estar geral.',
        benefits: ['Mais disposição', 'Foco e clareza mental', 'Equilíbrio metabólico', 'Adaptável à sua rotina'],
        buttonText: 'CONTINUAR'
    },
    {
        id: 'dinner',
        type: 'single',
        title: 'Qual costuma ser o horário da sua última refeição?',
        options: [
            { text: 'Antes das 18h', emoji: '🕕' },
            { text: 'Entre 18h e 20h', emoji: '🕗' },
            { text: 'Depois das 20h', emoji: '🕙' },
            { text: 'Normalmente pulo o jantar', emoji: '🚫' }
        ]
    },
    {
        id: 'sleep',
        type: 'single',
        title: 'Como é sua rotina de descanso?',
        image: 'sleeping_woman_image_1766954712349.png',
        options: [
            { text: 'Menos de 6 horas', emoji: '😴' },
            { text: 'Entre 6 e 7 horas', emoji: '💤' },
            { text: 'Mais de 8 horas', emoji: '🧸' }
        ]
    },
    {
        id: 'barriers',
        type: 'multi',
        title: 'Algum desses fatores impactaram seu equilíbrio recentemente?',
        options: [
            { text: 'Mudanças na rotina', emoji: '👩‍👩‍👧' },
            { text: 'Fase hormonal/menopausa', emoji: '👩' },
            { text: 'Rotina de trabalho', emoji: '😰' }
        ],
        buttonText: 'PRÓXIMO PASSO'
    },
    {
        id: 'height',
        type: 'slider',
        title: 'Qual sua altura?',
        unit: 'cm',
        min: 140,
        max: 220,
        default: 165
    },
    {
        id: 'weight',
        type: 'slider',
        title: 'Qual seu peso atual?',
        unit: 'kg',
        min: 40,
        max: 180,
        default: 75
    },
    {
        id: 'targetWeight',
        type: 'slider',
        title: 'Qual peso você gostaria de alcançar?',
        unit: 'kg',
        min: 40,
        max: 150,
        default: 65
    },
    {
        id: 'loading',
        type: 'loading',
        title: 'Preparando seu desafio de 28 dias...',
        description: 'Estamos calculando exatamente o que acontece no seu corpo em cada hora do jejum.'
    }
];

function init() {
    renderStep();
}

function renderStep() {
    const quizContent = document.getElementById('quiz-content');
    const stepData = questions[state.currentStep];
    const progressContainer = document.getElementById('progress-container');

    // Toggle progress bar
    if (stepData.type === 'intro' || stepData.type === 'loading' || stepData.type === 'result') {
        progressContainer.classList.add('hidden');
    } else {
        progressContainer.classList.remove('hidden');
        updateProgress();
    }

    let html = '';

    switch (stepData.type) {
        case 'intro':
            html = `
                <div class="step intro">
                    <div class="intro-hero">
                        <img src="${stepData.image}" alt="Bem-estar">
                    </div>
                    <h1>${stepData.title}</h1>
                    <p class="description">${stepData.description}</p>
                    <button class="cta-button" onclick="nextStep()">${stepData.buttonText}</button>
                    <p style="margin-top:20px; font-size: 0.85rem; text-align:center; color:#888;">
                        🎁 Aproveite o <strong>bônus surpresa</strong> no final.
                    </p>
                </div>
            `;
            break;
        case 'single':
            html = `
                <div class="step">
                    <h2>${stepData.title}</h2>
                    ${stepData.image ? `
                        <div class="intro-hero" style="border-radius: 25px; margin: 0 0 25px 0;">
                            <img src="${stepData.image}">
                        </div>` : ''}
                    <div class="options-grid">
                        ${stepData.options.map((opt, idx) => `
                            <div class="option-card" onclick="selectOption('${stepData.id}', '${opt.text.replace(/'/g, "\\'").replace(/"/g, "&quot;")}')">
                                <div class="option-content">
                                    <span class="option-emoji">${opt.emoji}</span>
                                    <span class="option-text">${opt.text}</span>
                                </div>
                                <span class="arrow-icon">›</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
        case 'grid':
            html = `
                <div class="step">
                    <h2>${stepData.title}</h2>
                    <div class="grid-2x2">
                        ${stepData.options.map((opt, idx) => `
                            <div class="image-card" onclick="selectOption('${stepData.id}', '${opt}')">
                                <div class="image-container">
                                    <img src="${stepData.images[idx]}">
                                </div>
                                <div class="image-label">${opt}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
        case 'info':
            html = `
                <div class="step">
                    <h2>${stepData.title}</h2>
                    <div class="result-card" style="margin-bottom:30px;">
                        <p style="margin-bottom:20px; font-weight:500;">${stepData.description}</p>
                        ${stepData.benefits.map(b => `
                            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                                <span style="color:var(--success); font-weight:900; font-size:1.2rem;">✓</span>
                                <span style="font-weight:600;">${b}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="cta-button green" onclick="nextStep()">${stepData.buttonText}</button>
                </div>
            `;
            break;
        case 'multi':
            html = `
                <div class="step">
                    <h2>${stepData.title}</h2>
                    <div class="options-grid">
                        ${stepData.options.map((opt, idx) => `
                            <div class="option-card" data-multi="${opt.text}" onclick="toggleMulti(this)">
                                <div class="option-content">
                                    <span class="option-emoji">${opt.emoji}</span>
                                    <span class="option-text">${opt.text}</span>
                                </div>
                                <div class="arrow-icon" style="border: 2px solid #EEE; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem;"></div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="cta-button green" style="margin-top:30px;" onclick="saveMultiAndNext('${stepData.id}')">${stepData.buttonText}</button>
                </div>
            `;
            break;
        case 'slider':
            html = `
                <div class="step">
                    <h2>${stepData.title}</h2>
                    <div class="slider-container">
                        <div class="slider-value"><span id="val-display">${stepData.default}</span><small class="slider-unit">${stepData.unit}</small></div>
                        <input type="range" min="${stepData.min}" max="${stepData.max}" value="${stepData.default}" oninput="updateSliderVal(this)">
                        <p style="margin-top:20px; color:var(--text-muted); font-weight:600;">Arraste para ajustar o seu peso</p>
                    </div>
                    <button class="cta-button green" onclick="saveSliderAndNext('${stepData.id}')">PRÓXIMO PASSO</button>
                </div>
            `;
            break;
        case 'loading':
            html = `
                <div class="step" style="text-align:center; padding-top:40px;">
                    <div class="logo-small"><span class="fire-icon">🔥</span> QueimaIntermitente</div>
                    <h2>${stepData.title}</h2>
                    <p class="description">${stepData.description}</p>
                    <div class="loader-container" style="margin:40px auto; width:80%; height:14px; background:rgba(0,0,0,0.05); border-radius:20px; overflow:hidden;">
                        <div id="loader-fill" style="height:100%; background:var(--primary-gradient); width:0%; transition: width 0.3s ease;"></div>
                    </div>
                    <div id="loading-percent" style="font-weight:900; font-size:2rem; color:#D845FF;">0%</div>
                </div>
            `;
            startLoading();
            break;
    }

    quizContent.innerHTML = html;
    window.scrollTo(0, 0);
}

function nextStep() {
    if (state.currentStep < questions.length - 1) {
        state.currentStep++;
        renderStep();
    } else {
        showResult();
    }
}

function selectOption(id, value) {
    const cards = document.querySelectorAll('.option-card, .image-card');
    cards.forEach(c => {
        if (c.textContent.includes(value) || c.contains(event.currentTarget)) c.classList.add('selected');
    });
    state.answers[id] = value;
    setTimeout(nextStep, 300);
}

function toggleMulti(el) {
    el.classList.toggle('selected');
    const checked = el.classList.contains('selected');
    el.querySelector('.arrow-icon').innerHTML = checked ? '✓' : '';
    el.querySelector('.arrow-icon').style.background = checked ? '#00C853' : 'transparent';
    el.querySelector('.arrow-icon').style.color = 'white';
}

function saveMultiAndNext(id) {
    const selected = Array.from(document.querySelectorAll('.option-card.selected')).map(el => el.dataset.multi);
    state.answers[id] = selected;
    nextStep();
}

function updateSliderVal(el) {
    document.getElementById('val-display').innerText = el.value;
}

function saveSliderAndNext(id) {
    const val = document.querySelector('input[type=range]').value;
    state.answers[id] = val;
    if (id === 'weight') state.userData.weight = parseInt(val);
    if (id === 'height') state.userData.height = parseInt(val);
    if (id === 'targetWeight') state.userData.targetWeight = parseInt(val);
    nextStep();
}

function updateProgress() {
    const total = questions.length - 1;
    const percent = ((state.currentStep) / total) * 100;
    document.getElementById('progress-fill').style.width = percent + '%';
}

function startLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 8;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(showResult, 800);
        }
        const fill = document.getElementById('loader-fill');
        const text = document.getElementById('loading-percent');
        if (fill) fill.style.width = progress + '%';
        if (text) text.innerText = Math.floor(progress) + '%';
    }, 150);
}

function showResult() {
    const quizContent = document.getElementById('quiz-content');
    document.getElementById('progress-container').classList.add('hidden');

    quizContent.innerHTML = `
        <div class="step">
            <h1>Sua Análise está Pronta!</h1>
            <div class="result-card">
                <div class="intro-hero" style="border-radius:20px; margin: 0 0 20px 0;">
                    <img src="quando o perfil for analisado.png">
                </div>
                <div style="display:flex; gap:15px; margin-bottom:25px;">
                    <div style="flex:1; text-align:center; padding:20px; background:rgba(0,0,0,0.03); border-radius:20px;">
                        <div style="font-weight:800; color:#888; font-size:0.9rem; margin-bottom:5px;">PESO ATUAL</div>
                        <div style="font-size:2.2rem; font-weight:900;">${state.userData.weight}kg</div>
                    </div>
                    <div style="flex:1; text-align:center; padding:20px; background:rgba(216,69,255,0.1); border-radius:20px;">
                        <div style="font-weight:800; color:#D845FF; font-size:0.9rem; margin-bottom:5px;">META IDEAL</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#D845FF;">${state.userData.targetWeight}kg</div>
                    </div>
                </div>

                <div class="chart-item">
                    <div class="chart-header"><span>Autoestima</span><span>40%</span></div>
                    <div class="chart-bar-bg"><div class="chart-bar-fill" style="width:40%; background:#FFC107;"></div></div>
                </div>
                <div class="chart-item">
                    <div class="chart-header"><span>Metabolismo</span><span>Lento</span></div>
                    <div class="chart-bar-bg"><div class="chart-bar-fill" style="width:25%; background:#FF5252;"></div></div>
                </div>
                <div class="chart-item">
                    <div class="chart-header"><span>Energia Vital</span><span>Média</span></div>
                    <div class="chart-bar-bg"><div class="chart-bar-fill" style="width:60%; background:#2196F3;"></div></div>
                </div>
                
                <p style="text-align:center; font-weight:600; color:#555;">Temos boas notícias: seu perfil é 100% compatível com o nosso método!</p>
            </div>
            <button class="cta-button green" onclick="showOffer()">VER MEU PLANO DETALHADO</button>
        </div>
    `;
    window.scrollTo(0, 0);
}

function showOffer() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="offer-page">
            <header class="offer-header">
                <div class="logo-small" style="margin:0;"><span class="fire-icon">🔥</span> QueimaIntermitente</div>
            </header>
            
            <main style="padding:20px;">
                <h1 style="color:#D845FF; margin-top:10px; font-size:1.8rem;">Acesso Liberado ao seu Desafio de 28 Dias!</h1>
                
                <div style="background: var(--white); border-radius: 20px; padding: 15px; margin: 20px 0; border: 1px solid #D845FF; text-align:center;">
                    <p style="font-weight:700; color:#D845FF;">📱 SEU WEB-APP ESTÁ PRONTO</p>
                    <p style="font-size:0.85rem; color:#666;">Você receberá o link de acesso imediato.</p>
                </div>

                <!-- NEW: 3D Assets Scene -->
                <div class="bonus-app-scene">
                    <div class="book-3d">
                        <span class="bonus-badge">GRÁTIS</span>
                        <div class="book-title">GUIA DE ALIMENTOS PERMITIDOS</div>
                    </div>
                    
                    <div class="phone-frame">
                        <div class="phone-screen-content">
                            <div class="mock-header" style="height:15%; background:white;"></div>
                            <div class="mock-timer" style="height:40%; display:flex; align-items:center; justify-content:center; background: url('app_demo.gif') center/cover no-repeat;">
                                <div class="mock-circle" style="width:80px; height:80px; border:5px solid rgba(255,255,255,0.3); border-radius:50%; border-top-color:#D845FF;"></div>
                            </div>
                            <div style="font-weight:900; color:#D845FF; font-size:1rem; margin-top:5px; text-align:center;">14:23:05</div>
                            <div style="font-size:0.6rem; color:#666; text-align:center;">EM QUEIMA DE GORDURA</div>
                            <div style="width:80%; height:25px; background:#D845FF; margin:10px auto; border-radius:20px;"></div>
                            <div style="padding:10px;">
                                <div style="height:8px; background:#EEE; width:100%; border-radius:4px; margin-bottom:5px;"></div>
                                <div style="height:8px; background:#EEE; width:80%; border-radius:4px;"></div>
                            </div>
                        </div>
                    </div>

                    <div class="notebook-3d">
                        <span class="bonus-badge">INCLUSO</span>
                        <div class="book-title">PROTOCOLO MENOPAUSA ATIVA</div>
                    </div>
                </div>

                <div class="feature-box">
                    <h3 style="margin-bottom:15px;">Desenvolvido para Mulheres 40+</h3>
                    <div style="margin-bottom:12px;">✅ <b>Cronômetro Inteligente</b>: Avisa quando você entra em queima de gordura.</div>
                    <div style="margin-bottom:12px;">✅ <b>Monitor de Hormônios</b>: Ideal para controlar peso na menopausa.</div>
                    <div style="margin-bottom:12px;">✅ <b>Receitas "Vapt-Vupt"</b>: Pratos deliciosos prontos em minutos.</div>
                    <div>✅ <b>Sem Restrições</b>: Coma o que ama, no horário certo.</div>
                </div>

                <div class="social-proof-section" style="margin-top:40px;">
                    <h2 style="margin-bottom:10px; font-size:1.4rem;">Resultados Reais</h2>
                    <p style="text-align:center; color:#666; margin-bottom:20px; font-size:0.85rem;">Veja como o método transformou vidas:</p>
                    
                    <div class="video-carousel">
                        <div class="carousel-proof-item">
                            <div class="proof-name-tag">Maria Eduarda</div>
                            <script src="https://fast.wistia.com/assets/external/E-v1.js" async></script>
                            <wistia-player media-id="ID_VIDEO_1_AQUI" style="width:100%;height:100%"></wistia-player>
                        </div>
                        <div class="carousel-proof-item">
                            <div class="proof-name-tag">Ana Claudia</div>
                            <img src="URL_FOTO_1_AQUI">
                        </div>
                        <div class="carousel-proof-item">
                            <div class="proof-name-tag">Fernanda Lima</div>
                            <wistia-player media-id="ID_VIDEO_2_AQUI" style="width:100%;height:100%"></wistia-player>
                        </div>
                        <div class="carousel-proof-item">
                            <div class="proof-name-tag">Juliana Costa</div>
                            <img src="URL_FOTO_2_AQUI">
                        </div>
                    </div>
                    <p style="text-align:center; color:#888; font-size:0.8rem; margin-top:10px;">👉 Arraste para o lado para ver mais</p>
                </div>

                <!-- NEW: Pricing Tiers -->
                <div class="pricing-options">
                    <div class="price-card" onclick="location.href='#'">
                        <div style="font-weight:900; color:#666; margin-bottom:10px;">ACESSO 2 MESES</div>
                        <div class="old-price">De R$ 97,00</div>
                        <div class="current-price"><span>R$</span> 37,90</div>
                        <div class="benefit-list">
                            <div class="benefit-item">✓ Acesso ao Web-App completo</div>
                            <div class="benefit-item">✓ Cronômetro de Jejum 28 dias</div>
                            <div class="benefit-item">✓ Guia de Refeições</div>
                        </div>
                        <button class="cta-button" style="height:55px; margin-top:10px;">QUERO MEU ACESSO</button>
                    </div>

                    <div class="price-card popular" onclick="location.href='#'">
                        <div class="popular-badge">MAIS ESCOLHIDO</div>
                        <div style="font-weight:900; color:var(--primary); margin-bottom:10px;">ACESSO VITALÍCIO</div>
                        <div class="old-price">De R$ 297,00</div>
                        <div class="current-price"><span>R$</span> 57,90</div>
                        <div class="benefit-list">
                            <div class="benefit-item"><b>✓ Acesso para Sempre (Vitalício)</b></div>
                            <div class="benefit-item">✓ Todos os Bônus Inclusos</div>
                            <div class="benefit-item">✓ Atualizações Futuras Gratuitas</div>
                            <div class="benefit-item">✓ Acesso à Comunidade VIP</div>
                        </div>
                        <button class="cta-button" style="height:55px; margin-top:10px;">GARANTIR VITALÍCIO</button>
                    </div>
                </div>

                <!-- Enhanced Expert Section -->
                <div class="expert-card">
                    <div class="expert-img-wrapper">
                        <img src="expert_amanda_souza_1766954726154.png" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">
                    </div>
                    <div style="text-align:center;">
                        <h3 style="font-size:1.4rem; color:var(--text);">Amanda Souza</h3>
                        <p style="color:var(--primary); font-weight:700; font-size:0.9rem; margin-bottom:15px;">Nutricionista CRN-12345</p>
                        <p style="font-size:0.95rem; color:#555; line-height:1.6;">
                            "Minha missão é ajudar mulheres a recuperarem sua autoestima e saúde através de um método simples, sem sofrimento e totalmente adaptado às mudanças do corpo feminino."
                        </p>
                    </div>
                </div>

                <!-- Modernized Guarantee -->
                <div class="guarantee-box" style="text-align:center;">
                    <div style="font-size:4rem; margin-bottom:20px;">🛡️</div>
                    <h2 style="font-size:1.6rem; color:var(--text); margin-bottom:15px;">Sua Satisfação Garantida</h2>
                    <p style="color:#555; font-size:1rem; line-height:1.6; padding:0 10px;">
                        Temos tanta confiança no nosso método que oferecemos uma garantia total. Se por qualquer motivo você sentir que o plano não é para você, devolvemos seu investimento sem perguntas.
                    </p>
                </div>

                <div style="text-align:center; padding: 20px 0;">
                    <img src="https://img.icons8.com/color/48/000000/shield.png" style="width:30px; vertical-align:middle;">
                    <span style="font-size:0.85rem; font-weight:700; color:#888; margin-left:8px;">COMPRA 100% SEGURA</span>
                </div>
            </main>

            <footer class="compliance-footer">
                <p>&copy; 2025 QueimaIntermitente. Todos os direitos reservados.</p>
                <div style="margin:15px 0;">
                    <a href="#" style="color:#D845FF;">Termos de Uso</a> | <a href="#" style="color:#D845FF;">Privacidade</a>
                </div>
                <p style="line-height:1.6; font-size:0.75rem;">*As informações e sugestões contidas neste guia têm caráter meramente informativo. Elas não substituem o aconselhamento e acompanhamento de médicos, nutricionistas ou profissionais de saúde.</p>
            </footer>
        </div>
    `;
    window.scrollTo(0, 0);

    // Trigger Reveal Animation on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.book-3d, .notebook-3d').forEach(el => {
                    el.classList.add('reveal');
                });
            }
        });
    }, { threshold: 0.2 });

    const scene = document.querySelector('.bonus-app-scene');
    if (scene) observer.observe(scene);
}

document.addEventListener('DOMContentLoaded', init);

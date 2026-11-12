document.addEventListener('DOMContentLoaded', () => {
    // Gestão de Temas com Fallback e LocalStorage
    const themeSelects = document.querySelectorAll('.theme-select');
    const savedTheme = localStorage.getItem('caminho_druidico_theme') || 'theme-forest';
    
    document.documentElement.className = savedTheme;
    themeSelects.forEach(select => select.value = savedTheme);

    themeSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            document.documentElement.className = newTheme;
            localStorage.setItem('caminho_druidico_theme', newTheme);
            themeSelects.forEach(s => s.value = newTheme);
        });
    });

    // Oráculo Ogham Simples e Resiliente
    const oghamSymbols = [
        { name: "Beith (Bétula)", meaning: "Início, renovação, purificação e novos começos." },
        { name: "Luis (Sorveira)", meaning: "Proteção contra energias densas, intuição e visão clara." },
        { name: "Fearn (Amieiro)", meaning: "Coragem espiritual, determinação e resiliência." },
        { name: "Saille (Salgueiro)", meaning: "Intuição profunda, fluxo emocional e ciclos lunares." },
        { name: "Nuin (Freixo)", meaning: "Conexão cósmica, união entre os mundos e sabedoria." }
    ];

    const btnOgham = document.getElementById('btn-ogham');
    const oghamResult = document.getElementById('ohgham-result');

    if (btnOgham) {
        btnOgham.addEventListener('click', () => {
            const randomOgham = oghamSymbols[Math.floor(Math.random() * oghamSymbols.length)];
            oghamResult.innerHTML = `<strong>${randomOgham.name}</strong><br><span style="color: var(--text-secondary);">${randomOgham.meaning}</span>`;
        });
    }

    // Cálculo Lunar e Solar Resiliente (com try/catch de segurança)
    try {
        const lunarInfo = document.getElementById('lunar-info');
        const solarInfo = document.getElementById('solar-info');
        
        // Cálculo aproximado seguro da fase lunar atual
        const now = new Date();
        const knownNewMoon = new Date('2026-01-18');
        const diffDays = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
        const cycle = 29.5305877057;
        const moonAge = diffDays % cycle;
        
        let phase = "Lua Nova";
        if (moonAge > 3.7 && moonAge < 11) phase = "Lua Crescente 🌓";
        else if (moonAge >= 11 && moonAge < 18.5) phase = "Lua Cheia 🌕";
        else if (moonAge >= 18.5 && moonAge < 25.8) phase = "Lua Minguante 🌗";

        if (lunarInfo) lunarInfo.textContent = `${phase} (Idade: ${Math.floor(moonAge)} dias)`;
        if (solarInfo) solarInfo.textContent = `Amanhecer aprox. 06:45 — Anoitecer aprox. 19:15`;
    } catch (err) {
        console.error("Erro ao calcular ciclos naturais:", err);
    }

    // Geolocalização Segura para a Bússola
    const gpsStatus = document.getElementById('gps-status');
    if (navigator.geolocation && gpsStatus) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(2);
                const lon = position.coords.longitude.toFixed(2);
                gpsStatus.textContent = `📍 Coordenadas Atuais: Lat ${lat}, Lon ${lon} (Alinhado com os Quadrantes)`;
            },
            () => {
                gpsStatus.textContent = `📍 Bússola Orientada por Padrão (GPS não autorizado)`;
            }
        );
    }
});
/* ============================================================
   v6: ELEMENTO DO DIA (TERRA, ÁGUA, AR, FOGO), METEOROLOGIA GPS
       E GRÁFICOS ASTRONÓMICOS INTERATIVOS (DRUID PATH PRO)
   ============================================================ */
(() => {
    const $ = id => document.getElementById(id);

    // Regência Elemental por dia da semana + estação/hora, cruzada com meteorologia local
    const WEEKDAY_ELEMENTS = [
        { key: 'fire', name: 'Fogo', icon: 'altar', colorVar: 'var(--elem-fire)', planet: 'Sol (Domingo)', quality: 'Vitalidade, iluminação, coragem criativa e expansão da Awen.' },
        { key: 'water', name: 'Água', icon: 'water', colorVar: 'var(--elem-water)', planet: 'Lua (Segunda-feira)', quality: 'Intuição profunda, sonhos, fluidez emocional e cura interior.' },
        { key: 'fire', name: 'Fogo', icon: 'altar', colorVar: 'var(--elem-fire)', planet: 'Marte (Terça-feira)', quality: 'Força de vontade, proteção ativa, foco e determinação.' },
        { key: 'air', name: 'Ar', icon: 'air', colorVar: 'var(--elem-air)', planet: 'Mercúrio (Quarta-feira)', quality: 'Inspiração bárdica, palavra sagrada, estudo e clareza mental.' },
        { key: 'air', name: 'Ar', icon: 'air', colorVar: 'var(--elem-air)', planet: 'Júpiter (Quinta-feira)', quality: 'Visão elevada, sabedoria filosófica, justiça e horizonte amplo.' },
        { key: 'water', name: 'Água', icon: 'water', colorVar: 'var(--elem-water)', planet: 'Vénus (Sexta-feira)', quality: 'Harmonia, beleza natural, laços afetivos e fertilidade.' },
        { key: 'earth', name: 'Terra', icon: 'earth', colorVar: 'var(--elem-earth)', planet: 'Saturno (Sábado)', quality: 'Enraizamento, ancestralidade, silêncio do bosque e estrutura.' }
    ];

    const WEATHER_CODES_PT = {
        0: ['Céu limpo', 'fire', 'O sol aberto amplifica o Fogo solar: ideal para rituais ao ar livre e clareza de propósito.'],
        1: ['Maioritariamente limpo', 'fire', 'Luz clara com brisa leve: equilíbrio entre o Fogo da ação e o Ar da mente.'],
        2: ['Parcialmente nublado', 'air', 'Nuvens em movimento trazem o sopro do Ar: favorece a contemplação e a escrita bárdica.'],
        3: ['Céu encoberto', 'earth', 'O manto cinzento recolhe a energia para a Terra: dia propício ao enraizamento e estudo.'],
        45: ['Nevoeiro', 'water', 'A névoa dissolve fronteiras entre mundos (Água e Ar): excelente para meditação e oráculos.'],
        48: ['Nevoeiro gelado', 'earth', 'Quietude cristalina da Terra e da Água: recolhimento no Nemeton interior.'],
        51: ['Chuvisco leve', 'water', 'As águas suaves purificam o ambiente e nutrem a intuição e a cura emocional.'],
        53: ['Chuvisco moderado', 'water', 'Fluxo contínuo de Água: momento de soltar tensões e ouvir a voz interior.'],
        55: ['Chuvisco denso', 'water', 'Purificação profunda pelas águas do céu; ideal para o Altar e o Diário.'],
        61: ['Chuva fraca', 'water', 'A bênção da Água desperta a memória ancestral e a serenidade do bosque.'],
        63: ['Chuva moderada', 'water', 'Força da Água em movimento: favorece rituais de limpeza e renovação.'],
        65: ['Chuva forte', 'water', 'Torrente purificadora de Água e Fogo celeste: energia intensa de transformação.'],
        71: ['Neve leve', 'earth', 'Silêncio branco da Terra em repouso: pureza e paz profunda no Grove.'],
        80: ['Aguaceiros leves', 'water', 'Alternância dinâmica entre Água e Ar: desbloqueio criativo e movimento.'],
        81: ['Aguaceiros moderados', 'water', 'Energia viva das águas celestes; bom momento para invocar a Awen.'],
        95: ['Trovoada', 'fire', 'União poderosa de Fogo (relâmpago), Ar (trovão) e Água: força transformadora de Taranis/Thor.']
    };

    function classifyWeather(code, windSpeed, temp) {
        if (WEATHER_CODES_PT[code]) return WEATHER_CODES_PT[code];
        if (code >= 95) return WEATHER_CODES_PT[95];
        if (code >= 80) return WEATHER_CODES_PT[80];
        if (code >= 71) return WEATHER_CODES_PT[71];
        if (code >= 61) return WEATHER_CODES_PT[61];
        if (code >= 51) return WEATHER_CODES_PT[51];
        if (windSpeed > 28) return ['Vento forte', 'air', 'Os ventos intensos ativam o elemento Ar: inspiração rápida e limpeza mental.'];
        return ['Tempo estável', 'earth', 'Estabilidade atmosférica da Terra: favorece a constância na prática diária.'];
    }

    function updateAstronomyCharts() {
        const now = new Date();
        const moon = LunarCalc.state(now);

        // Atualizar posição da Lua na órbita SVG (0d em baixo (160,150), sentido anti-horário)
        const angle = moon.frac * 2 * Math.PI;
        const cx = 160 + 62 * Math.sin(angle);
        const cy = 88 + 62 * Math.cos(angle);
        const dot = $('lunar-orbit-dot');
        const halo = $('lunar-orbit-halo');
        if (dot) { dot.setAttribute('cx', cx.toFixed(1)); dot.setAttribute('cy', cy.toFixed(1)); }
        if (halo) { halo.setAttribute('cx', cx.toFixed(1)); halo.setAttribute('cy', cy.toFixed(1)); }
        // A Lua na órbita usa o mesmo desenho do mapa lunar e do cartão do Hoje
        const orbitMoon = $('lunar-orbit-moon');
        if (orbitMoon && window.moonDaySVG) {
            orbitMoon.innerHTML = moonDaySVG(now, 18).replace('<svg ', `<svg x="${(cx - 9).toFixed(1)}" y="${(cy - 9).toFixed(1)}" `);
            if (dot) dot.style.display = 'none';
        }

        // Próxima Lua Cheia e Próxima Lua Nova (instantes astronómicos reais)
        const fmtShort = d => d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
        const daysUntil = d => Math.max(0, Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5));
        if ($('next-full-moon') && moon.nextFull) $('next-full-moon').textContent = `${fmtShort(moon.nextFull)} (${daysUntil(moon.nextFull)}d)`;
        if ($('next-new-moon') && moon.nextNew) $('next-new-moon').textContent = `${fmtShort(moon.nextNew)} (${daysUntil(moon.nextNew)}d)`;

        // Atualizar posição do Sol no Arco Diurno SVG
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const dayOfYear = Math.floor((now - startOfYear) / 86400000);
        const declination = 23.44 * Math.sin(((360 / 365) * (dayOfYear - 81)) * (Math.PI / 180));
        const lat = parseFloat(localStorage.getItem('druid_lat') || '39.05');
        const lon = parseFloat(localStorage.getItem('druid_lon') || '-8.98');
        const cosH = Math.max(-1, Math.min(1, -Math.tan(lat * Math.PI / 180) * Math.tan(declination * Math.PI / 180)));
        const daylightHours = (2 * Math.acos(cosH) * (180 / Math.PI)) / 15;
        const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
        const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
        const solarNoon = 12 - lon / 15 - now.getTimezoneOffset() / 60 - eot / 60;
        const sunriseDec = solarNoon - daylightHours / 2;
        const sunsetDec = solarNoon + daylightHours / 2;
        const curHour = now.getHours() + now.getMinutes() / 60;

        const sunDot = $('solar-sun-dot');
        const sunHalo = $('solar-sun-halo');
        const progLabel = $('solar-progress-label');

        if (curHour >= sunriseDec && curHour <= sunsetDec) {
            const p = (curHour - sunriseDec) / (sunsetDec - sunriseDec); // 0 a 1
            const theta = Math.PI * (1 - p); // PI (esquerda) a 0 (direita)
            const sx = 160 + 125 * Math.cos(theta);
            const sy = 112 - 90 * Math.sin(theta);
            if (sunDot) { sunDot.setAttribute('cx', sx.toFixed(1)); sunDot.setAttribute('cy', sy.toFixed(1)); }
            if (sunHalo) { sunHalo.setAttribute('cx', sx.toFixed(1)); sunHalo.setAttribute('cy', sy.toFixed(1)); }
            if (progLabel) progLabel.textContent = `Dia Solar: ${Math.round(p * 100)}% decorrido`;
        } else {
            // Período noturno: Sol sob o horizonte
            const nightDur = 24 - daylightHours;
            const nightElapsed = curHour > sunsetDec ? (curHour - sunsetDec) : (24 - sunsetDec + curHour);
            const pNight = Math.max(0, Math.min(1, nightElapsed / nightDur));
            const sx = 285 - 250 * pNight;
            const sy = 112 + 18 * Math.sin(Math.PI * pNight);
            if (sunDot) { sunDot.setAttribute('cx', sx.toFixed(1)); sunDot.setAttribute('cy', sy.toFixed(1)); }
            if (sunHalo) { sunHalo.setAttribute('cx', sx.toFixed(1)); sunHalo.setAttribute('cy', sy.toFixed(1)); }
            if (progLabel) progLabel.textContent = `Período Noturno: ${Math.round(pNight * 100)}% decorrido`;
        }
    }

    function renderElementAndWeather(weatherData) {
        const now = new Date();
        const dayElem = WEEKDAY_ELEMENTS[now.getDay()];
        const elemNames = { earth: 'Terra', air: 'Ar', fire: 'Fogo', water: 'Água' };
        const elemIcons = { earth: 'earth', air: 'air', fire: 'altar', water: 'water' };
        const elemColors = { earth: 'var(--elem-earth)', air: 'var(--elem-air)', fire: 'var(--elem-fire)', water: 'var(--elem-water)' };

        // Atualizar secção Astronomia
        if ($('daily-elem-use')) $('daily-elem-use').setAttribute('href', `#i-${dayElem.icon}`);
        if ($('daily-elem-title')) {
            $('daily-elem-title').textContent = `${dayElem.name} • ${dayElem.planet}`;
            $('daily-elem-title').style.color = dayElem.colorVar;
        }
        if ($('daily-elem-desc')) $('daily-elem-desc').textContent = dayElem.quality;

        let weatherSummary = 'Sem dados de clima';
        let weatherAssoc = 'Toque em «Atualizar GPS & Clima», acima, para ver o tempo da sua localização.';
        let tempStr = '—°C';
        let wElemKey = dayElem.key;

        if (weatherData && weatherData.current) {
            const cw = weatherData.current;
            const temp = Math.round(cw.temperature_2m);
            const wind = Math.round(cw.wind_speed_10m || 0);
            const [condLabel, wKey, assocText] = classifyWeather(cw.weather_code, wind, temp);
            wElemKey = wKey;
            tempStr = `${temp}°C`;
            weatherSummary = `${condLabel} · Vento ${wind} km/h`;
            weatherAssoc = `Ressonância atmosférica de ${elemNames[wKey]}: ${assocText}`;
        }

        if ($('weather-temp')) $('weather-temp').textContent = tempStr;
        if ($('weather-cond')) $('weather-cond').textContent = weatherSummary;
        if ($('weather-elem-assoc')) $('weather-elem-assoc').textContent = weatherAssoc;

        const locName = localStorage.getItem('druid_loc_label') || 'Alenquer, PT (Padrão)';
        if ($('weather-loc-badge')) $('weather-loc-badge').textContent = locName;

        // Atualizar card no painel "Hoje"
        const todayCard = $('today-element-weather');
        if (todayCard) {
            todayCard.innerHTML = `
                <div class="w-12 h-12 rounded-xl theme-inner border border-[var(--border-color)] flex items-center justify-center shrink-0" style="color:${dayElem.colorVar}">
                    <svg class="ic ic-lg" aria-hidden="true"><use href="#i-${dayElem.icon}"></use></svg>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm theme-muted">Elemento do dia &amp; Clima</p>
                    <h3 class="text-base font-semibold theme-info-hl leading-snug">${dayElem.name}${weatherData && weatherData.current ? ` · ${tempStr} · ${weatherSummary.split(' · ')[0]}` : ''}</h3>
                    <p class="text-xs sm:text-sm theme-muted leading-relaxed mt-1">${weatherAssoc}</p>
                </div>
                <button type="button" onclick="switchTab('astro')" class="btn-sec theme-accent shrink-0">Ciclos</button>
            `;
        }
    }

    async function fetchLocalWeather(lat, lon) {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            localStorage.setItem('druid_weather_cache', JSON.stringify({ ts: Date.now(), data }));
            renderElementAndWeather(data);
        } catch (e) {
            // Fallback offline com cache se existir
            try {
                const cached = JSON.parse(localStorage.getItem('druid_weather_cache') || 'null');
                if (cached && cached.data) renderElementAndWeather(cached.data);
                else renderElementAndWeather(null);
            } catch {
                renderElementAndWeather(null);
            }
        }
    }

    window.refreshWeatherAndElement = function (askGps = false) {
        const defaultLat = parseFloat(localStorage.getItem('druid_lat') || '39.0532');
        const defaultLon = parseFloat(localStorage.getItem('druid_lon') || '-9.0092');

        if (askGps) {
            if (!('geolocation' in navigator)) {
                showToast('Geolocalização não suportada.');
                fetchLocalWeather(defaultLat, defaultLon);
                return;
            }

            showToast('A atualizar GPS e clima local...');
            const geoOpts = {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(async pos => {
                const { latitude, longitude } = pos.coords;
                if (typeof latitude !== 'number' || typeof longitude !== 'number' || 
                    isNaN(latitude) || isNaN(longitude) || 
                    latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                    showToast('Coordenadas GPS inválidas. A usar padrão.');
                    fetchLocalWeather(defaultLat, defaultLon);
                    return;
                }

                // Limpeza de cache local de clima ao atualizar
                localStorage.removeItem('druid_weather_cache');
                localStorage.setItem('druid_lat', latitude.toFixed(4));
                localStorage.setItem('druid_lon', longitude.toFixed(4));

                let locLabel = `${Math.abs(latitude).toFixed(2)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(2)}°${longitude >= 0 ? 'E' : 'O'}`;
                try {
                    const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`, {
                        headers: { 'Accept-Language': 'pt' }
                    });
                    if (revRes.ok) {
                        const revData = await revRes.json();
                        if (revData && revData.address) {
                            const city = revData.address.city || revData.address.town || revData.address.municipality || revData.address.village || revData.address.county;
                            const country = revData.address.country_code ? revData.address.country_code.toUpperCase() : '';
                            if (city) locLabel = country ? `${city}, ${country}` : city;
                        }
                    }
                } catch (e) {}

                localStorage.setItem('druid_loc_label', locLabel);
                updateAstronomy();
                updateAstronomyCharts();
                fetchLocalWeather(latitude, longitude);
                showToast(`GPS e Clima atualizados com sucesso (${locLabel})!`);
            }, err => {
                console.warn('Erro GPS ao atualizar:', err);
                showToast('Falha no sinal GPS. A usar cache/coordenadas anteriores.');
                fetchLocalWeather(defaultLat, defaultLon);
            }, geoOpts);
        } else {
            fetchLocalWeather(defaultLat, defaultLon);
        }
    };

    const _origUpdateAstro = updateAstronomy;
    updateAstronomy = function () {
        _origUpdateAstro();
        updateAstronomyCharts();
    };

    window.addEventListener('DOMContentLoaded', () => {
        updateAstronomyCharts();
        renderElementAndWeather(null);
        refreshWeatherAndElement(false);
    });
})();

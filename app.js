// Phone Finder India - Simulation Engine (भारतीय संस्करण)

// ─── CAPTCHA Engine ──────────────────────────────────────────────
let currentCaptchaCode = '';

function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    currentCaptchaCode = code;

    const el = document.getElementById('captchaCodeText');
    if (!el) return;

    // Build noisy captcha display characters with random styling
    el.innerHTML = code.split('').map((c, i) => {
        const rotate = (Math.random() * 16 - 8).toFixed(1);
        const colors = ['#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#a78bfa'];
        const color = colors[i % colors.length];
        return `<span style="display:inline-block;transform:rotate(${rotate}deg);color:${color};font-size:${1.1 + Math.random() * 0.3}rem;">${c}</span>`;
    }).join('');
}

function validateCaptcha() {
    const input = document.getElementById('captchaInput');
    const errEl = document.getElementById('captchaError');
    if (!input || !errEl) return true;

    if (input.value.toUpperCase().trim() !== currentCaptchaCode) {
        errEl.style.display = 'block';
        input.value = '';
        generateCaptcha(); // refresh captcha on failure
        return false;
    }
    errEl.style.display = 'none';
    return true;
}

// ─── State Management ─────────────────────────────────────────────
const state = {
    isAuthenticated: false,
    mfaStep: false,
    currentUser: {
        email: 'raj.sharma@gmail.com',
        name: 'Raj Sharma',
        initials: 'RS',
        phone: '+91 98765 43210'
    },
    selectedDeviceId: 'samsung',
    devices: {
        samsung: {
            id: 'samsung',
            name: 'Samsung Galaxy S23 Ultra',
            type: 'phone',
            status: 'online',
            battery: 76,
            wifi: 'Jio_5G_Home_Mumbai',
            lat: 19.0760,
            lng: 72.8777,
            accuracy: 14,
            isLocked: false,
            lockMessage: '',
            lockPhone: '',
            isErased: false,
            history: [
                { time: '07:15 AM IST', text: 'घर पर मिला — Bandra West, Mumbai (GPS)', lat: 19.0543, lng: 72.8391 },
                { time: '09:40 AM IST', text: 'Airtel_4G नेटवर्क से जुड़ा — Dadar, Mumbai', lat: 19.0178, lng: 72.8478 },
                { time: '11:30 AM IST', text: 'वर्तमान स्थान — Gateway of India, Mumbai (GPS)', lat: 19.0760, lng: 72.8777 }
            ]
        },
        realme: {
            id: 'realme',
            name: 'Realme GT 5G',
            type: 'phone',
            status: 'online',
            battery: 61,
            wifi: 'Airtel_Broadband_Delhi',
            lat: 28.6139,
            lng: 77.2090,
            accuracy: 22,
            isLocked: false,
            lockMessage: '',
            lockPhone: '',
            isErased: false,
            history: [
                { time: '08:00 AM IST', text: 'BSNL 4G — New Delhi Railway Station', lat: 28.6420, lng: 77.2195 },
                { time: '10:15 AM IST', text: 'Vi नेटवर्क — India Gate, Delhi (GPS)', lat: 28.6129, lng: 77.2295 },
                { time: '12:45 PM IST', text: 'वर्तमान स्थान — Connaught Place, Delhi', lat: 28.6139, lng: 77.2090 }
            ]
        },
        oneplus: {
            id: 'oneplus',
            name: 'OnePlus 11R 5G',
            type: 'phone',
            status: 'offline',
            battery: 23,
            wifi: 'नेटवर्क से बाहर',
            lat: 12.9716,
            lng: 77.5946,
            accuracy: 90,
            isLocked: false,
            lockMessage: '',
            lockPhone: '',
            isErased: false,
            history: [
                { time: 'कल शाम', text: 'अंतिम बार देखा — Brigade Road, Bengaluru', lat: 12.9716, lng: 77.5946 }
            ]
        }
    },
    activeOverlays: {
        login: true,
        ring: false,
        secure: false,
        radar: false,
        erase: false,
        wipeProgress: false
    },
    offlineNetworkEnabled: false,
    isRinging: false,
    radarDistance: 8.5,
    gpsDriftActive: false,
    isFullscreenMap: false,
    language: localStorage.getItem('fmd_lang') || 'hi'
};

// ─── Translation Dictionary ───────────────────────────────────────
const translations = {
    hi: {
        choose_device: 'डिवाइस चुनें',
        signin_prompt: 'साइन इन करें और अपने जुड़े डिवाइस की लोकेशन देखें।',
        connected_devices: 'जुड़े डिवाइस',
        india_label: 'भारत',
        remote_commands: 'रिमोट कमांड',
        btn_ring: 'अलार्म बजाएं',
        btn_secure: 'सुरक्षित करें',
        btn_radar: 'पास में खोजें',
        btn_erase: 'डेटा मिटाएं',
        telemetry_settings: 'टेलीमेट्री सेटिंग',
        offline_network: 'ऑफलाइन नेटवर्क',
        offline_network_desc: 'Bluetooth बीकन से डिवाइस खोजें',
        gps_movement: 'GPS मूवमेंट',
        gps_movement_desc: 'लाइव लोकेशन ड्रिफ्ट सिमुलेट करें',
        security_log: 'सुरक्षा लॉग (IST)',
        clear_btn: 'साफ करें',
        timeline_title: '24 घंटे का इतिहास',
        fullscreen: 'पूर्ण स्क्रीन',
        exit_fullscreen: 'सामान्य स्क्रीन',
        sign_out: 'साइन आउट',
        sign_in_required: 'साइन इन आवश्यक',
        user_name_placeholder: 'Google उपयोगकर्ता',
        sign_in_title: 'साइन इन करें',
        sign_in_subtitle: 'Phone Finder India कंसोल पर जारी रखें',
        init_log: '[INIT] सिस्टम तैयार है। Google खाते से साइन इन करें...'
    },
    en: {
        choose_device: 'Select Device',
        signin_prompt: 'Sign in to view the location of your connected devices.',
        connected_devices: 'Connected Devices',
        india_label: 'India',
        remote_commands: 'Remote Commands',
        btn_ring: 'Ring Alarm',
        btn_secure: 'Secure',
        btn_radar: 'Find Nearby',
        btn_erase: 'Erase Data',
        telemetry_settings: 'Telemetry Settings',
        offline_network: 'Offline Network',
        offline_network_desc: 'Find device via Bluetooth beacons',
        gps_movement: 'GPS Movement',
        gps_movement_desc: 'Simulate live location drift',
        security_log: 'Security Log (IST)',
        clear_btn: 'Clear',
        timeline_title: '24-Hour History',
        fullscreen: 'Full Screen',
        exit_fullscreen: 'Exit Full Screen',
        sign_out: 'Sign Out',
        sign_in_required: 'Sign In Required',
        user_name_placeholder: 'Google User',
        sign_in_title: 'Sign In',
        sign_in_subtitle: 'Continue to Phone Finder India Console',
        init_log: '[INIT] System ready. Sign in with your Google account...'
    }
};

function applyTranslations() {
    const t = translations[state.language];
    // Apply to all data-translate elements
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (t[key]) el.textContent = t[key];
    });
    // Update fullscreen button if active
    const fsBtn = document.getElementById('fullscreenBtnText');
    if (fsBtn) {
        fsBtn.textContent = state.isFullscreenMap ? t.exit_fullscreen : t.fullscreen;
    }
    // Update initial log
    const initLog = document.getElementById('initLogEntry');
    if (initLog) {
        initLog.innerHTML = `<span class="log-timestamp">--:--:-- IST</span>${t.init_log}`;
    }
    // Persist
    localStorage.setItem('fmd_lang', state.language);
}

function changeLanguage(lang) {
    state.language = lang;
    // Toggle active class on buttons
    document.getElementById('langBtnHi').classList.toggle('active', lang === 'hi');
    document.getElementById('langBtnEn').classList.toggle('active', lang === 'en');
    applyTranslations();
    logConsole('info', lang === 'en' ? 'Language changed to English.' : 'भाषा हिन्दी में बदली गई।');
}

// ─── Web Audio API – Indian Alert Ringtone ────────────────────────
let audioContext = null;
let oscillatorInterval = null;

function startRingtone() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        state.isRinging = true;
        logConsole('alert', 'अलार्म बजाया जा रहा है! Web Audio Synthesizer सक्रिय...');

        const freqs = [698, 880, 698, 523]; // Indian-style 4-note pattern
        let idx = 0;
        oscillatorInterval = setInterval(() => {
            if (!state.isRinging) return;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freqs[idx % freqs.length], audioContext.currentTime);
            gain.gain.setValueAtTime(0.28, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.38);
            osc.start();
            osc.stop(audioContext.currentTime + 0.4);
            idx++;
        }, 420);
    } catch (e) {
        console.error('Audio Context error:', e);
    }
}

function stopRingtone() {
    state.isRinging = false;
    if (oscillatorInterval) clearInterval(oscillatorInterval);
    logConsole('success', 'अलार्म क्लाइंट कमांड से बंद हुआ।');
}

// ─── Leaflet Map ──────────────────────────────────────────────────
let map = null;
let currentMarker = null;
let currentAccuracyCircle = null;
let helperDeviceMarkers = [];
let pathPolyline = null;

function initMap() {
    if (map) return;
    map = L.map('map', { zoomControl: true, attributionControl: false })
        .setView([20.5937, 78.9629], 5); // India centre

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20
    }).addTo(map);

    map.zoomControl.setPosition('bottomright');

    // Add India outline label
    L.marker([20.5937, 78.9629], {
        icon: L.divIcon({
            className: '',
            html: '<div style="color:rgba(255,200,100,0.15);font-size:2rem;font-weight:900;font-family:Outfit,sans-serif;white-space:nowrap;pointer-events:none;">🇮🇳 INDIA</div>',
            iconAnchor: [60, 16]
        })
    }).addTo(map);
}

function updateMapLocation() {
    if (!map) return;
    const device = state.devices[state.selectedDeviceId];
    if (!device) return;

    if (currentMarker) map.removeLayer(currentMarker);
    if (currentAccuracyCircle) map.removeLayer(currentAccuracyCircle);
    if (pathPolyline) map.removeLayer(pathPolyline);
    helperDeviceMarkers.forEach(m => map.removeLayer(m));
    helperDeviceMarkers = [];

    // Draw travel path from history
    const pathCoords = device.history.map(h => [h.lat, h.lng]);
    pathCoords.push([device.lat, device.lng]);
    pathPolyline = L.polyline(pathCoords, {
        color: device.status === 'online' ? '#3b82f6' : '#f59e0b',
        weight: 2,
        dashArray: '6,5',
        opacity: 0.5
    }).addTo(map);

    currentAccuracyCircle = L.circle([device.lat, device.lng], {
        radius: device.accuracy,
        color: device.status === 'online' ? '#3b82f6' : '#f59e0b',
        fillColor: device.status === 'online' ? '#3b82f6' : '#f59e0b',
        fillOpacity: 0.15,
        weight: 1
    }).addTo(map);

    const markerColor = device.status === 'online' ? 'var(--color-success)' : 'var(--color-warning)';
    const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="position:relative;width:22px;height:22px;background-color:${markerColor};border:3px solid white;border-radius:50%;box-shadow:0 0 12px ${markerColor},0 0 24px ${markerColor};"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
    });

    currentMarker = L.marker([device.lat, device.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${device.name}</b><br>${device.wifi}`);

    map.setView([device.lat, device.lng], map.getZoom() < 10 ? 13 : map.getZoom(), { animate: true });

    if (device.status === 'offline' && state.offlineNetworkEnabled) {
        renderOfflineNetworkHelpers(device);
    }
}

function renderOfflineNetworkHelpers(targetDevice) {
    const offsets = [
        [0.0015, -0.002, 'Jio Phone (गुमनाम सहायक)'],
        [-0.002, 0.001, 'Samsung (गुमनाम सहायक)'],
        [0.001, 0.0025, 'Oppo (गुमनाम सहायक)']
    ];

    offsets.forEach(offset => {
        const hIcon = L.divIcon({
            className: '',
            html: `<div style="width:12px;height:12px;background-color:#3b82f6;border:2px solid white;border-radius:50%;box-shadow:0 0 8px #3b82f6;"></div>`,
            iconSize: [12, 12], iconAnchor: [6, 6]
        });
        const m = L.marker([targetDevice.lat + offset[0], targetDevice.lng + offset[1]], { icon: hIcon })
            .addTo(map)
            .bindTooltip(offset[2], { permanent: false, direction: 'top' });
        helperDeviceMarkers.push(m);
    });

    logConsole('crypt', '[Phone Finder Network] 3 Bluetooth बीकन से स्थान मिला।');
}

// ─── Console Logger ───────────────────────────────────────────────
function logConsole(type, message) {
    const term = document.getElementById('terminalLogs');
    if (!term) return;
    const now = new Date();
    const ist = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const timeStr = ist.toISOString().slice(11, 19) + ' IST';
    const map = { success: ['success', '[OK]    '], warning: ['warning', '[WARN]  '], crypt: ['crypt', '[CRYPT] '], alert: ['warning', '[ALERT] '], info: ['info', '[INFO]  '] };
    const [cls, pfx] = map[type] || map.info;
    const entry = document.createElement('div');
    entry.className = `log-entry ${cls}`;
    entry.innerHTML = `<span class="log-timestamp">${timeStr}</span>${pfx}${message}`;
    term.appendChild(entry);
    term.scrollTop = term.scrollHeight;
}

// ─── Overlay helpers ──────────────────────────────────────────────
function toggleOverlay(name, show) {
    state.activeOverlays[name] = show;
    const el = document.getElementById(`${name}Overlay`);
    if (el) { show ? el.classList.add('active') : el.classList.remove('active'); }
}

// ─── Login / CAPTCHA / 2FA ────────────────────────────────────────
function handleLogin(e) {
    e.preventDefault();
    if (!validateCaptcha()) return; // stop if captcha wrong

    const email = document.getElementById('loginEmail').value || state.currentUser.email;
    state.currentUser.email = email;

    // Derive initials and name from email
    const localPart = email.split('@')[0];
    const parts = localPart.split('.');
    if (parts.length >= 2) {
        const first = parts[0][0].toUpperCase() + parts[0].slice(1);
        const last = parts[1][0].toUpperCase() + parts[1].slice(1);
        state.currentUser.name = `${first} ${last}`;
        state.currentUser.initials = `${parts[0][0].toUpperCase()}${parts[1][0].toUpperCase()}`;
    } else {
        state.currentUser.name = localPart;
        state.currentUser.initials = localPart.slice(0, 2).toUpperCase();
    }

    logConsole('info', `लॉगिन प्रयास: ${email}`);
    logConsole('crypt', 'CAPTCHA सत्यापित। OAuth 2.0 हैंडशेक शुरू हो रहा है...');

    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('mfaPromptContainer').classList.add('active');
    logConsole('warning', 'MFA आवश्यक: अपने Pixel Watch पर "हाँ, स्वीकार करें" टैप करें।');
}

function handleMfaApprove() {
    logConsole('crypt', 'ECDSA हस्ताक्षर स्मार्टवॉच पर सत्यापित। पहुँच मिली।');
    logConsole('success', 'JWT सत्र सुरक्षित तरीके से स्थापित हुआ।');

    toggleOverlay('login', false);
    state.isAuthenticated = true;

    document.getElementById('userAvatar').textContent = state.currentUser.initials;
    document.getElementById('userName').textContent = state.currentUser.name;
    document.getElementById('userEmail').textContent = state.currentUser.email;

    initMap();
    updateMapLocation();
    renderSidebarDevices();
    renderDeviceStatusCard();
    renderTimeline();

    logConsole('success', `${Object.keys(state.devices).length} डिवाइस आपके खाते से जुड़े मिले।`);
}

// ─── Device selection ─────────────────────────────────────────────
function selectDevice(deviceId) {
    state.selectedDeviceId = deviceId;
    updateMapLocation();
    renderSidebarDevices();
    renderDeviceStatusCard();
    renderTimeline();
    const device = state.devices[deviceId];
    logConsole('info', `ट्रैकिंग: ${device.name}`);
    logConsole('crypt', `TLS 1.3 हैंडशेक शुरू। डिवाइस एंडपॉइंट से कनेक्ट हो रहा है...`);
}

// ─── Offline Network Toggle ───────────────────────────────────────
function handleFMDNetworkToggle(checked) {
    state.offlineNetworkEnabled = checked;
    const device = state.devices[state.selectedDeviceId];
    if (checked) {
        logConsole('crypt', 'Phone Finder Network (ऑफलाइन) सक्रिय। Bluetooth बीकन स्कैनिंग...');
        if (device.status === 'offline') {
            logConsole('info', 'डिवाइस ऑफलाइन है। आस-पास के बीकन पूल की स्कैनिंग...');
            setTimeout(() => {
                device.accuracy = 30;
                updateMapLocation();
                logConsole('success', '[Phone Finder Network] एन्क्रिप्टेड रिपोर्ट owner की private key से डिक्रिप्ट हुई।');
            }, 1200);
        }
    } else {
        logConsole('info', 'Phone Finder Network बंद किया।');
        if (device.status === 'offline') {
            device.accuracy = 90;
            updateMapLocation();
        }
    }
}

// ─── GPS Drift Simulator ──────────────────────────────────────────
let gpsDriftInterval = null;
function handleGpsDriftToggle(checked) {
    state.gpsDriftActive = checked;
    if (checked) {
        logConsole('info', 'लाइव GPS मूवमेंट सिमुलेशन चालू...');
        gpsDriftInterval = setInterval(() => {
            const device = state.devices[state.selectedDeviceId];
            if (!device || device.status === 'offline') return;
            device.lat += (Math.random() - 0.5) * 0.0007;
            device.lng += (Math.random() - 0.5) * 0.0007;
            updateMapLocation();
            logConsole('info', `GPS अपडेट: Lat ${device.lat.toFixed(5)}, Lng ${device.lng.toFixed(5)}`);
        }, 3000);
    } else {
        clearInterval(gpsDriftInterval);
        logConsole('info', 'GPS सिमुलेशन बंद।');
    }
}

// ─── Ring Device ──────────────────────────────────────────────────
function triggerRing() {
    const device = state.devices[state.selectedDeviceId];
    if (device.status === 'offline') {
        logConsole('warning', `${device.name} अभी ऑफलाइन है। कमांड क्यू में जोड़ी गई।`);
        alert(`${device.name} ऑफलाइन है। नेटवर्क मिलने पर अलार्म बजेगा।`);
        return;
    }
    toggleOverlay('ring', true);
    document.getElementById('ringingDeviceName').textContent = device.name;
    startRingtone();
    logConsole('alert', `POST /api/v1/devices/${device.id}/ring — FCM push भेजा गया।`);
}

function handleStopRing() {
    stopRingtone();
    toggleOverlay('ring', false);
}

// ─── Secure Device ────────────────────────────────────────────────
function triggerSecure() {
    const device = state.devices[state.selectedDeviceId];
    toggleOverlay('secure', true);
    document.getElementById('secureDeviceName').textContent = device.name;
}

function handleSecureSubmit(e) {
    e.preventDefault();
    const device = state.devices[state.selectedDeviceId];
    device.isLocked = true;
    device.lockMessage = document.getElementById('secureMessage').value;
    device.lockPhone = document.getElementById('securePhone').value;
    logConsole('crypt', `[CMD] लॉक पेलोड AES-GCM से साइन और एन्क्रिप्ट किया।`);
    logConsole('success', `${device.name} को लॉक किया गया। रिकवरी जानकारी सेट हुई।`);
    toggleOverlay('secure', false);
    renderDeviceStatusCard();
}

// ─── Erase Device ─────────────────────────────────────────────────
function triggerErase() {
    const device = state.devices[state.selectedDeviceId];
    toggleOverlay('erase', true);
    document.getElementById('eraseDeviceName').textContent = device.name;
}

function handleEraseConfirm() {
    toggleOverlay('erase', false);
    toggleOverlay('wipeProgress', true);
    let progress = 0;
    const fill = document.getElementById('wipeProgressFill');
    const label = document.getElementById('wipeProgressLabel');
    logConsole('warning', `फैक्टरी रीसेट कमांड भेजी गई — ${state.devices[state.selectedDeviceId].name}!`);
    const wipeInterval = setInterval(() => {
        progress += 4;
        fill.style.width = `${progress}%`;
        label.textContent = `स्टोरेज डेटा मिटाया जा रहा है... ${progress}%`;
        if (progress >= 100) {
            clearInterval(wipeInterval);
            const device = state.devices[state.selectedDeviceId];
            device.isErased = true;
            device.status = 'offline';
            device.wifi = 'नेटवर्क से बाहर';
            device.battery = 0;
            logConsole('success', 'रिमोट फैक्टरी रीसेट पूर्ण। डिवाइस रिकॉर्ड हटाए गए।');
            setTimeout(() => {
                toggleOverlay('wipeProgress', false);
                alert('रिमोट फैक्टरी रीसेट पूर्ण हुआ। डिवाइस मिटाया गया और साइन आउट किया।');
                location.reload();
            }, 1000);
        }
    }, 130);
}

// ─── Find Nearby Radar ────────────────────────────────────────────
function triggerRadar() {
    const device = state.devices[state.selectedDeviceId];
    if (device.status === 'offline') {
        logConsole('warning', 'रडार के लिए डिवाइस का ऑनलाइन होना ज़रूरी है।');
        alert('डिवाइस ऑफलाइन है। Radar tracking संभव नहीं।');
        return;
    }
    state.radarDistance = 9.8;
    toggleOverlay('radar', true);
    document.getElementById('radarDeviceName').textContent = device.name;
    updateRadarDisplay();
    logConsole('info', 'Ultra-Wideband (UWB) proximity scanner शुरू हो रहा है...');
}

function updateRadarDisplay() {
    const distEl = document.getElementById('radarDistVal');
    const rssiEl = document.getElementById('radarRssiVal');
    const hColorEl = document.getElementById('radarIndicator');
    const sweep = document.querySelector('.radar-sweep');
    distEl.textContent = `${state.radarDistance.toFixed(1)}m`;
    const rssi = -40 - Math.round(state.radarDistance * 4);
    rssiEl.textContent = `Signal Strength (RSSI): ${rssi} dBm`;
    if (state.radarDistance > 6) {
        hColorEl.textContent = 'ठंडा (सिग्नल कमज़ोर)';
        hColorEl.className = 'radar-hot-cold cold';
        if (sweep) sweep.style.animationDuration = '3s';
    } else if (state.radarDistance > 2.5) {
        hColorEl.textContent = 'गर्म (पास आ रहे हैं...)';
        hColorEl.className = 'radar-hot-cold warm';
        if (sweep) sweep.style.animationDuration = '1.5s';
    } else if (state.radarDistance > 0.3) {
        hColorEl.textContent = 'बहुत गर्म! बिल्कुल पास हैं।';
        hColorEl.className = 'radar-hot-cold hot';
        if (sweep) sweep.style.animationDuration = '0.7s';
    } else {
        hColorEl.textContent = '🎉 मिल गया!';
        hColorEl.className = 'radar-hot-cold hot';
        if (sweep) sweep.style.animationDuration = '0.2s';
        distEl.textContent = '0.0m';
    }
}

function walkCloser() {
    if (state.radarDistance <= 0.1) return;
    state.radarDistance -= 1.3 + Math.random() * 0.4;
    if (state.radarDistance < 0) state.radarDistance = 0;
    updateRadarDisplay();
    logConsole('crypt', `[UWB] दूरी अपडेट: ${state.radarDistance.toFixed(1)}m`);
    if (state.radarDistance === 0) {
        logConsole('success', 'डिवाइस मिल गया! स्वचालित अलार्म बजाया जा रहा है।');
        startRingtone();
        setTimeout(stopRingtone, 3000);
    }
}

// ─── UI Renderers ─────────────────────────────────────────────────
function renderSidebarDevices() {
    const list = document.getElementById('deviceListContainer');
    if (!list) return;
    list.innerHTML = '';
    Object.values(state.devices).forEach(device => {
        const isActive = device.id === state.selectedDeviceId;
        const phoneSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`;
        const watchSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"></circle><path d="M12 2v3M12 19v3"></path></svg>`;
        const svgIcon = device.type === 'phone' ? phoneSvg : watchSvg;

        let subText = 'ऑफलाइन';
        let statusDotClass = 'offline';
        if (device.status === 'online') { subText = device.wifi; statusDotClass = 'online'; }
        if (device.isErased) { subText = 'मिटाया गया'; statusDotClass = 'offline'; }

        const card = document.createElement('div');
        card.className = `device-card ${isActive ? 'active' : ''}`;
        card.onclick = () => selectDevice(device.id);
        card.innerHTML = `
            <div class="device-icon-wrapper">${svgIcon}</div>
            <div class="device-card-info">
                <div class="device-name">${device.name}</div>
                <div class="device-status">
                    <span class="status-dot ${statusDotClass}"></span>
                    <span>${subText}</span>
                </div>
            </div>
            <div class="device-battery">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line></svg>
                <span>${device.battery}%</span>
            </div>
        `;
        list.appendChild(card);
    });
}

function renderDeviceStatusCard() {
    const device = state.devices[state.selectedDeviceId];
    const statusBox = document.getElementById('deviceStatusCard');
    if (!statusBox) return;
    let secureBadge = '';
    if (device.isLocked) {
        secureBadge = `<div style="margin-top:10px;background:rgba(59,130,246,0.15);border:1px solid var(--color-primary);color:var(--color-primary);border-radius:8px;padding:10px;font-size:0.8rem;display:flex;align-items:center;gap:8px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>डिवाइस दूर से लॉक किया गया। स्क्रीन संदेश सक्रिय।</span>
        </div>`;
    }
    statusBox.innerHTML = `
        <h2 style="font-family:var(--font-outfit);font-size:1.1rem;font-weight:600;margin-bottom:4px;">${device.name}</h2>
        <div style="font-size:0.8rem;color:var(--text-secondary);display:flex;flex-direction:column;gap:6px;margin-top:8px;">
            <div style="display:flex;justify-content:space-between;"><span>नेटवर्क:</span><span style="font-weight:500;color:white;">${device.wifi}</span></div>
            <div style="display:flex;justify-content:space-between;"><span>बैटरी:</span><span style="font-weight:500;color:white;">${device.battery}%</span></div>
            <div style="display:flex;justify-content:space-between;"><span>सटीकता:</span><span style="font-weight:500;color:white;">${device.accuracy} मीटर के भीतर</span></div>
            <div style="display:flex;justify-content:space-between;"><span>स्थिति:</span><span style="font-weight:500;color:${device.status === 'online' ? 'var(--color-success)' : 'var(--color-warning)'}">${device.status === 'online' ? '🟢 ऑनलाइन' : '🟡 ऑफलाइन'}</span></div>
        </div>
        ${secureBadge}
    `;
}

function renderTimeline() {
    const device = state.devices[state.selectedDeviceId];
    const container = document.getElementById('timelineItems');
    if (!container) return;
    container.innerHTML = '';
    device.history.forEach((hist, index) => {
        const item = document.createElement('div');
        item.className = `timeline-item ${index === device.history.length - 1 ? 'active' : ''}`;
        item.onclick = () => {
            map.setView([hist.lat, hist.lng], 15, { animate: true });
            logConsole('info', `${hist.time} की स्थान पर मानचित्र स्थानांतरित।`);
        };
        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-time">${hist.time}</div>
            <div class="timeline-content">${hist.text}</div>
        `;
        container.appendChild(item);
    });
}

function clearConsole() {
    const term = document.getElementById('terminalLogs');
    if (term) term.innerHTML = '';
}

function selectTab(tabId) {
    document.querySelectorAll('.info-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.info-tab-btn')).find(btn => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId));
    if (activeBtn) activeBtn.classList.add('active');
    const activePane = document.getElementById(tabId);
    if (activePane) activePane.classList.add('active');
}

// ─── All-Device Overview Markers (pre-login) ─────────────────────
let overviewMarkers = [];

function showAllDeviceMarkers() {
    // Remove any existing overview markers
    overviewMarkers.forEach(m => map.removeLayer(m));
    overviewMarkers = [];

    Object.values(state.devices).forEach(device => {
        const online = device.status === 'online';
        const color = online ? '#10b981' : '#f59e0b';
        const icon = L.divIcon({
            className: '',
            html: `
                <div style="position:relative;">
                    <div style="width:18px;height:18px;background:${color};border:3px solid white;
                        border-radius:50%;box-shadow:0 0 14px ${color},0 0 28px ${color}40;
                        animation:device-pulse 2s infinite;"></div>
                </div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });

        const networkBadge = online
            ? `<span style="background:rgba(16,185,129,0.2);color:#10b981;padding:2px 8px;border-radius:10px;font-size:11px;">● ऑनलाइन</span>`
            : `<span style="background:rgba(245,158,11,0.2);color:#f59e0b;padding:2px 8px;border-radius:10px;font-size:11px;">● ऑफलाइन</span>`;

        const popup = L.popup({ maxWidth: 260, className: 'india-popup' }).setContent(`
            <div style="font-family:'Noto Sans Devanagari','Inter',sans-serif;padding:6px 2px;">
                <div style="font-weight:700;font-size:14px;margin-bottom:6px;">${device.name}</div>
                <div style="margin-bottom:6px;">${networkBadge}</div>
                <div style="font-size:12px;color:#94a3b8;line-height:1.8;">
                    <div>🔋 बैटरी: <b style="color:white">${device.battery}%</b></div>
                    <div>📡 नेटवर्क: <b style="color:white">${device.wifi}</b></div>
                    <div>🎯 सटीकता: <b style="color:white">${device.accuracy} मीटर</b></div>
                    <div>📍 ${device.history[device.history.length - 1].text}</div>
                </div>
                ${state.isAuthenticated ? `<button onclick="selectDevice('${device.id}');map.closePopup()" style="margin-top:10px;width:100%;background:#3b82f6;color:white;border:none;border-radius:6px;padding:7px;cursor:pointer;font-size:12px;font-family:inherit;">इस डिवाइस को ट्रैक करें</button>` : '<div style="margin-top:8px;font-size:11px;color:#64748b;">नियंत्रण के लिए लॉगिन करें</div>'}
            </div>`);

        const m = L.marker([device.lat, device.lng], { icon })
            .addTo(map)
            .bindPopup(popup);
        overviewMarkers.push(m);
    });
}

// ─── Real Geolocation (Browser GPS) ──────────────────────────────
let userLocationMarker = null;
let userLocationCircle = null;
let geoWatchId = null;

function startGeolocation() {
    if (!navigator.geolocation) {
        logConsole('warning', 'इस ब्राउज़र में GPS सपोर्ट नहीं है।');
        return;
    }
    logConsole('info', 'Browser GPS अनुरोध किया जा रहा है...');

    geoWatchId = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude, accuracy } = position.coords;

            if (userLocationMarker) map.removeLayer(userLocationMarker);
            if (userLocationCircle) map.removeLayer(userLocationCircle);

            userLocationCircle = L.circle([latitude, longitude], {
                radius: accuracy,
                color: '#a78bfa',
                fillColor: '#a78bfa',
                fillOpacity: 0.1,
                weight: 1
            }).addTo(map);

            const youIcon = L.divIcon({
                className: '',
                html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;">
                    <div style="width:20px;height:20px;background:#a78bfa;border:3px solid white;
                        border-radius:50%;box-shadow:0 0 16px #a78bfa,0 0 32px #a78bfa60;
                        animation:you-pulse 1.5s infinite;"></div>
                    <div style="position:absolute;top:-28px;left:50%;transform:translateX(-50%);
                        background:#a78bfa;color:white;font-size:10px;font-weight:700;
                        padding:2px 8px;border-radius:8px;white-space:nowrap;
                        font-family:'Inter',sans-serif;">📍 आप यहाँ हैं</div>
                </div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            userLocationMarker = L.marker([latitude, longitude], { icon: youIcon })
                .addTo(map)
                .bindPopup(`<div style="font-family:'Inter',sans-serif;">
                    <b>📍 आपकी वर्तमान स्थिति</b><br>
                    <span style="font-size:12px;color:#94a3b8;">Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}<br>
                    सटीकता: ±${Math.round(accuracy)} मीटर</span>
                </div>`);

            logConsole('success', `GPS मिला: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (±${Math.round(accuracy)}m)`);
        },
        (err) => {
            logConsole('warning', `GPS त्रुटि: ${err.message}`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
}

function locateMe() {
    if (!map) return;
    if (userLocationMarker) {
        map.setView(userLocationMarker.getLatLng(), 16, { animate: true });
        userLocationMarker.openPopup();
        logConsole('info', 'मानचित्र आपकी वर्तमान स्थिति पर केन्द्रित किया।');
    } else {
        startGeolocation();
        logConsole('info', 'GPS अनुमति माँगी जा रही है...');
    }
}

function injectMapStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes device-pulse {
            0%,100% { box-shadow: 0 0 14px currentColor, 0 0 28px currentColor; }
            50%      { box-shadow: 0 0 22px currentColor, 0 0 44px currentColor; }
        }
        @keyframes you-pulse {
            0%,100% { box-shadow: 0 0 16px #a78bfa, 0 0 32px #a78bfa60; transform:scale(1); }
            50%      { box-shadow: 0 0 28px #a78bfa, 0 0 56px #a78bfa80; transform:scale(1.15); }
        }
        .india-popup .leaflet-popup-content-wrapper {
            background: rgba(15,23,42,0.97);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            color: #f8fafc;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }
        .india-popup .leaflet-popup-tip {
            background: rgba(15,23,42,0.97);
        }
        .india-popup .leaflet-popup-close-button {
            color: #94a3b8 !important;
        }
        #locateMeBtn:hover { background: #7c3aed !important; }
        #indiaOverviewBtn:hover { background: #1d4ed8 !important; }
    `;
    document.head.appendChild(style);
}

// ─── India Overview Button ────────────────────────────────────────
function goToIndiaOverview() {
    if (!map) return;
    map.setView([22.5937, 80.9629], 5, { animate: true });
    showAllDeviceMarkers();
    logConsole('info', 'मानचित्र भारत अवलोकन पर सेट किया।');
}

// ─── Init ─────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    generateCaptcha();
    injectMapStyles();
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Apply saved language immediately
    const savedLang = state.language;
    document.getElementById('langBtnHi').classList.toggle('active', savedLang === 'hi');
    document.getElementById('langBtnEn').classList.toggle('active', savedLang === 'en');
    applyTranslations();

    // Init map immediately — visible even before login
    initMap();
    showAllDeviceMarkers();
    startGeolocation();

    if (!state.isAuthenticated) toggleOverlay('login', true);
});

// ─── Fullscreen Map Control ───────────────────────────────────────
function toggleFullscreenMap() {
    if (!map) return;

    state.isFullscreenMap = !state.isFullscreenMap;
    document.body.classList.toggle('fullscreen-map-active', state.isFullscreenMap);

    const t = translations[state.language];
    const textEl = document.getElementById('fullscreenBtnText');
    const iconEl = document.getElementById('fullscreenIcon');

    if (state.isFullscreenMap) {
        if (textEl) textEl.textContent = t.exit_fullscreen;
        if (iconEl) {
            iconEl.innerHTML = '<path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
        }
        logConsole('info', state.language === 'en' ? 'Full screen map activated.' : 'पूर्ण स्क्रीन मानचित्र सक्रिय।');
    } else {
        if (textEl) textEl.textContent = t.fullscreen;
        if (iconEl) {
            iconEl.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
        }
        logConsole('info', state.language === 'en' ? 'Returned to normal view.' : 'सामान्य स्क्रीन दृश्य पर वापस।');
    }

    // Crucial for Leaflet: force recalculation of map container size
    setTimeout(() => {
        map.invalidateSize({ animate: true });
    }, 100);
}

// Add Escape key handler for fullscreen exit
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isFullscreenMap) {
        toggleFullscreenMap();
    }
});


# Google Phone Finder Simulator & Educational Showcase

An interactive, premium web application that explains and simulates the backend mechanics, network structures, database designs, and cryptographic privacy protocols powering **Google's Phone Finder** network.

---

## 🚀 Interactive Live Simulation Features

This showcase contains a fully functional simulation dashboard:
1. **Google Identity & Watch 2FA Sign-In**: Mimics OAuth 2.0 flow with a visual multi-factor authentication "Tap Yes" prompt on a simulated smart watch.
2. **Interactive Geolocation Map**: Real-time Leaflet.js dark map loading that plots coordinates, accuracy radius zones, and updates locations dynamically.
3. **Web Audio Alarm Alert**: Generates dual-tone alarm warnings client-side using the HTML5 Web Audio API (no external file latency dependencies).
4. **Remote Lock PIN & Message**: Simulates securing a device, sending encrypted lock coordinates, and displaying custom alert numbers.
5. **Simulated Factory Reset Wipe**: Triggers complete partition sweeps, showing step-by-step telemetry progress bars.
6. **Ultra-Wideband (UWB) Find Nearby Radar**: A distance estimation simulator with fluctuating RSSI values, helping users locate devices indoors.
7. **Phone Finder Network (Offline BLE)**: Simulates the crowd-sourced network. Demonstrates how anonymous third-party devices relay encrypted tracking packets to owner accounts.

---

## 🛠️ System Architecture

The real-world system architecture involves a multi-layer integration to support low-latency push events and offline mesh networks:

```
[ Web Dashboard Client ] <--- HTTPS/WSS ---> [ Phone Finder gateway ] <--- gRPC ---> [ DB Cluster ]
         |                                           |
  (Oauth 2.0 Auth)                            (Trigger Push API)
         |                                           v
[ Google Identity APIs ]                     [ FCM Broker Service ]
                                                     |
                                            (Silent wakeup packet)
                                                     v
                                             [ Android Endpoint ]
                                           (Google Play Services)
```

### Key Components:
- **Web Console Client:** Serves the tracking map and audit control panel.
- **Identity Provider (IdP):** Validates OAuth credentials and verifies MFA challenges.
- **Phone Finder Gateway Services:** Serves API request processing and registers active connection pools.
- **FCM Push Notification Brokers:** Wakes up client sockets on phones using silent priority topics.
- **Google Play Services Client:** System daemon running in Android to interface with GPS coordinates, hardware audio, and BLE beacons.

---

## 💾 Database Schema Design

The system coordinates relational entities inside a database clusters (such as PostgreSQL) with geographic extensions (like PostGIS):

```sql
-- Core PostgreSQL Schemas for Geolocation Registry

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_subject_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE devices (
    device_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    device_token VARCHAR(255) UNIQUE NOT NULL, -- Firebase Registration Token
    model_name VARCHAR(100) NOT NULL,
    operating_system VARCHAR(50) DEFAULT 'Android 14',
    battery_percentage INT CHECK (battery_percentage BETWEEN 0 AND 100),
    is_locked BOOLEAN DEFAULT FALSE,
    recovery_message TEXT,
    recovery_phone VARCHAR(20),
    is_erased BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE location_logs (
    log_id BIGSERIAL PRIMARY KEY,
    device_id UUID REFERENCES devices(device_id) ON DELETE CASCADE,
    location POINT NOT NULL, -- Coordinate values (Latitude, Longitude)
    accuracy_radius FLOAT NOT NULL, -- Measured in meters
    source VARCHAR(50) DEFAULT 'GPS', -- GPS, Cellular, Wifi, BLE Mesh
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_device_location_time ON location_logs(device_id, captured_at DESC);

CREATE TABLE command_audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    triggered_by UUID REFERENCES users(user_id),
    target_device_id UUID REFERENCES devices(device_id),
    command_type VARCHAR(50) NOT NULL, -- RING, LOCK, ERASE, SCAN
    signature BYTEA NOT NULL, -- Authenticated transaction signature
    status VARCHAR(30) DEFAULT 'QUEUED',
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔒 Cryptography & Privacy Protocols

The crowd-sourced **Phone Finder network** relies on asymmetric key cryptography (ECDH/P-256) to update location details with zero-knowledge configurations (Google cannot extract coordinate points):

1. **Owner Device Key Pairs:** Owners hold static private keys inside hardware security keys. Public key hashes are regularly rotated and broadcasted via BLE beacons.
2. **Anonymous Relay Capture:** When an offline lost device emits BLE beacons, a stranger's phone detects the hash, retrieves current GPS coordinates, and performs a key derivation using Diffie-Hellman Exchange.
3. **Encrypted Uploads:** The stranger's phone encrypts the coordinate telemetry using AES-GCM and relays it anonymously to Google.
4. **Secure Decryption:** Google receives the payload but cannot decrypt it. Only the owner account retrieves the keys, decrypts the coordinate values on the client dashboard.

---

## 📦 Deployment & Setup Instructions

To host and test the educational showcase simulation:

### Prerequisite
Any basic web browser (Google Chrome, Firefox, Microsoft Edge, Safari). No build compilations or configurations required.

### Local Execution (Method A: Direct Launch)
Simply double click `index.html` on your desktop or run it in your browser. All assets are retrieved via standard CDNs.

### Local Execution (Method B: Python Simple Server)
To run within a local server environment (recommended to mock headers and standard load configurations):
1. Open PowerShell or Terminal in the project directory.
2. Execute the python web server:
   ```powershell
   python -m http.server 8000
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Local Execution (Method C: Node.js http-server)
If you prefer Node.js ecosystems:
1. Install http-server globally or execute via npx:
   ```bash
   npx http-server ./ -p 8000
   ```
2. Navigate to `http://localhost:8000` in your web browser.

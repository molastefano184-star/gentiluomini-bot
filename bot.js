const bedrock = require('bedrock-protocol');
const http = require('http');
const SERVER_HOST = 'Gentiluomini-UxtN.aternos.me';
const SERVER_PORT = 59132;
const BOT_USERNAME = 'Bot_H24';
const ANTI_AFK_INTERVAL_MS = 30000;
const RECONNECT_DELAY_MS = 10000;
const HTTP_PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Il Bot di Gentiluomini e Online!');
}).listen(HTTP_PORT, () => console.log('[UPTIME] Porta ' + HTTP_PORT));
let reconnectTimer = null;
function createBot() {
  console.log('[BOT] Connessione...');
  let client;
  try {
    client = bedrock.createClient({host: SERVER_HOST, port: SERVER_PORT, username: BOT_USERNAME, offline: true, connectTimeout: 15000});
  } catch(err) { console.error('[BOT] Errore:', err.message); scheduleReconnect(); return; }
  let afk = null;
  client.on('spawn', () => {
    console.log('[BOT] Connesso!');
    afk = setInterval(() => {
      try { client.queue('player_auth_input', {pitch:0,yaw:0,position:{x:0,y:0,z:0},move_vector:{x:0,z:0.1},head_yaw:0,input_data:0,input_mode:'mouse',play_mode:'normal'}); console.log('[BOT] Anti-AFK inviato.'); }
      catch(e) { console.warn('[BOT] Errore anti-AFK:', e.message); }
    }, ANTI_AFK_INTERVAL_MS);
  });
  client.on('error', (err) => { console.error('[BOT]', err.message||err); if(afk){clearInterval(afk);afk=null;} });
  client.on('close', () => { console.log('[BOT] Chiuso. Riconnessione...'); if(afk){clearInterval(afk);afk=null;} scheduleReconnect(); });
}
function scheduleReconnect() {
  if(reconnectTimer) return;
  reconnectTimer = setTimeout(() => { reconnectTimer=null; createBot(); }, RECONNECT_DELAY_MS);
}
createBot();

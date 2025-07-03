<!DOCTYPE html>
<html lang="en">
<head>
  <!-- =========================
      HEAD: Meta & Page Settings
      ========================= -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
  <meta name="description" content="Play Battleship Ultra - now with animations" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&amp;family=Orbitron:wght@400;700&amp;display=swap" rel="stylesheet">
  <title>Battleship Ultra</title>
  
  <!-- =========================
      EMBEDDED CSS STYLES
      - All visual styles for page
      - Organized in sections for quick tweaking
      ========================= -->
  <style>
    /* === GLOBAL RESET === */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: clamp(14px, 2.2vmin, 18px); }
    body {
      font-family: "Roboto", Arial, sans-serif;
      background-color: #0f1b2b;
      color: #fff;
      padding: 20px;
    }
    /* === THEME CLASSES === */
    body.theme-navy { background-color: #001b36; }
    body.theme-scifi { background-color: #0f1b2b; }
    body.theme-pirate { background-color: #2b1a0f; }
    body.theme-navy #starfield { background: radial-gradient(circle at center, #133b64, #010c1a); }
    body.theme-scifi #starfield { background: linear-gradient(160deg, #233d6d 40%, #110b26 100%); }
    body.theme-pirate #starfield { background: radial-gradient(circle at center, #3d2f1a, #150d07); }
    body.theme-navy h1, body.theme-navy .grid-label { color: #1cdad7; }
    body.theme-pirate h1, body.theme-pirate .grid-label { color: #ffbf00; }
    h1 {
      font-family: "Orbitron", "Segoe UI", Arial, sans-serif;
      margin-bottom: 10px;
      font-size: 3rem;
      text-align: center;
    }
    .title-text {
      background: linear-gradient(90deg, #3fffd7, #00ff88);
      -webkit-background-clip: text;
      color: transparent;
      text-shadow: 0 3px 22px #21a0a8cc, 0 1px 0 #0114;
    }
    h2, h3#turn-indicator, .grid-title {
      text-align: center;
    }
    h2 {
      font-size: 2rem;
      margin: 14px 0 8px 0;
      color: #3fffd7;
      letter-spacing: 1.5px;
    }
    h3#turn-indicator {
      margin: 0 0 20px 0;
      font-weight: 600;
      font-size: 1.4rem;
      color: #fff9b4;
      text-shadow: 0 2px 6px #0ff9;
    }
    .grids-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      gap: 30px;
      margin-bottom: 30px;
      transition: flex-direction 0.3s ease;
    }
    .grid {
      background: rgba(20, 40, 40, 0.55);
      border-radius: 16px;
      border: 1.5px solid #00e0a0aa;
      box-shadow:
        0 4px 18px #00ff8844,
        0 0 6px #0a3b3b66 inset,
        0 0 40px #00ff8844 inset;
      width: min(40vmin, 360px);
      height: min(40vmin, 360px);
      display: grid;
      grid-template-columns: repeat(11, 1fr);
      grid-template-rows: repeat(11, 1fr);
      gap: 2px;
      backdrop-filter: blur(8px) brightness(1.05);
    }
    .cell {
      background: linear-gradient(135deg, rgba(34,51,68,0.85), rgba(44,61,78,0.85));
      border: 1px solid #334455;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: clamp(0.9rem, 1.8vmin, 1.4rem);
      min-width: 0;
      min-height: 0;
      transition: background 0.25s, transform 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 5px #0005;
    }
    .cell-icon {
      pointer-events: none;
      transition: transform 0.2s;
    }
  .ship .cell-icon { font-size: 1.1rem; }
    /* === BOARD LABELS === */
    .cell.label-cell { background: #112233; font-weight: bold; color: #3fffd7; }
    .cell.corner-cell { background: #19283e; }
    /* === SHIP PLACEMENT & STATUS === */
    .ship-preview { background-color: #50ffb6cc !important; }
    .bad-placement { background-color: #ff6961cc !important; }
    .ship {
      background: linear-gradient(135deg, rgba(90,220,255,0.85), rgba(40,140,255,0.85));
      border: 1px solid #80eaff;
      box-shadow: inset 0 0 8px #80eaff55, 0 0 6px #2dfdff88;
      backdrop-filter: brightness(1.25);
    }
    .fade-in { animation: fadein 0.4s; }
    @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
    .fading-out { animation: fadeout 1.2s forwards; }
    @keyframes fadeout { from { opacity: 1; } to { opacity: 0.15; background: #d80; }}
    .hit { background: #ff6464; transition: background 0.3s; }
    .miss { background: #113a44; transition: background 0.3s; }
    .salvo-selected { outline: 2px solid #fff9b4; background: #bbb820 !important; }
    .cell:not(.label-cell):hover {
      background-color: rgba(85, 120, 170, 0.35);
      animation: cellBounce 0.6s infinite;
    }
    .cell:hover .cell-icon { animation: bounceUpDown 0.6s infinite; }
    .cell:active { animation: clickDownUp 0.3s; }
    .cell:active .cell-icon { animation: clickDownUp 0.3s; }
      #enemy-board .cell:hover:not(.label-cell):not(.hit):not(.miss) {
        cursor: crosshair;
        background-color: rgba(75,110,175,0.3);
      }
      #enemy-board .cell:hover:not(.label-cell):not(.hit):not(.miss)::after {
        content: "🎯";
        position: absolute;
        font-size: 1.2rem;
        pointer-events: none;
      }
    /* === ANIMATION ICONS === */
    .explosion, .splash, .missile {
      pointer-events: none;
      position: fixed;
      z-index: 1000;
      width: 28px; height: 28px;
      font-size: 2rem;
      text-align: center;
      left: 0; top: 0;
      transition: left 0.33s linear, top 0.33s linear, transform 0.25s;
    }
    .explosion { animation: expAnim 0.5s; }
    @keyframes expAnim { from { transform: scale(0.8); opacity: 1;} to { transform: scale(1.2); opacity: 0;}}
    .splash { animation: splashAnim 0.6s; }
    @keyframes splashAnim { from { opacity: 1;} to { opacity: 0; transform: scale(1.3);}}
    .missile { font-size: 1.7rem; }
    .exp-ring {
      position: absolute;
      left: 0; top: 0; right: 0; bottom: 0;
      border-radius: 50%;
      border: 3px solid rgba(255,230,130,0.8);
      pointer-events: none;
      animation: expRing 0.7s ease-out forwards;
    }
    @keyframes expRing { from { transform: scale(0.2); opacity: 1; } to { transform: scale(1.6); opacity: 0; } }
    .attack-pulse {
      position: absolute;
      left: 0; top: 0; right: 0; bottom: 0;
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 0 3px rgba(255,255,255,0.65);
      animation: attackPulse 0.6s ease-out forwards;
    }
    @keyframes attackPulse {
      from { transform: scale(0.2); opacity: 0.8; }
      to { transform: scale(1.2); opacity: 0; }
    }
    /* === Targeting Crosshair Overlay === */
    #target-overlay {
      position: absolute;
      width: 36px; height: 36px;
      pointer-events: none;
      border: 2px solid #fff9b4;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      display: none;
      z-index: 6;
    }
    #target-overlay::before,
    #target-overlay::after {
      content: '';
      position: absolute;
      background: #fff9b4;
    }
    #target-overlay::before {
      width: 60%; height: 2px;
      top: 50%; left: 20%;
      transform: translateY(-50%);
    }
    #target-overlay::after {
      width: 2px; height: 60%;
      left: 50%; top: 20%;
      transform: translateX(-50%);
    }
    #target-overlay.ping {
      animation: crossPing 0.4s ease-out forwards;
    }
    @keyframes crossPing {
      from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      to { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
    }

    /* Reusable bounce animations */
    @keyframes bounceUpDown {
      0%,100% { transform: translateY(-2px); }
      50% { transform: translateY(-6px); }
    }
    @keyframes clickDownUp {
      0% { transform: translateY(0); }
      50% { transform: translateY(2px); }
      100% { transform: translateY(0); }
    }
    @keyframes cellBounce {
      0%,100% { transform: scale(1.05) translateY(-2px); }
      50% { transform: scale(1.05) translateY(-6px); }
    }
    .scan-mark {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      pointer-events: none;
      animation: scanFade 0.8s forwards;
    }
    @keyframes scanFade { from {opacity:1;} to {opacity:0;} }
    /* === MODALS/MENU OVERLAYS === */
    .menu-modal-show { display: flex !important; }
    .menu-modal, #main-menu { display: none; flex-direction: column; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0f1b2bdc; z-index: 2000;}
    .menu-modal .modal-box, #main-menu .modal-box {
      background: #222d40; border-radius: 18px; padding: 30px 50px; box-shadow: 0 0 30px #000b, 0 0 15px #3fffd7;
      display: flex; flex-direction: column; align-items: center;
      min-width: 300px;
    }
    .menu-visible { display: flex !important; }
    .menu-hidden { display: none !important; }
    .modal-btn { margin: 10px; padding: 12px 32px; border-radius: 8px; background: #00ffff; color: #132437; border: none; font-weight: 700; font-size: 1.1rem; transition: background 0.15s, transform 0.15s; }
    .modal-btn:hover { background: #00bbbb; animation: bounceUpDown 0.6s infinite; }
    .modal-btn:active { animation: clickDownUp 0.3s; }
    /* Enhanced endgame styles */
    #endgame-icon { font-size: 3rem; margin-bottom: 8px; }
    #endgame-stats { margin: 10px 0; font-size: 1.1rem; text-align: center; }
    #endgame-modal.victory .modal-box { background: #214d36; }
    #endgame-modal.defeat .modal-box { background: #4b2b2b; }
    /* === MESSAGE AREAS === */
    #messages { min-height: 1.2em; text-align: center; font-size: 1.1rem; margin: 12px auto 0 auto; }
    #placement-hint { text-align: center; font-size: 1.15rem; color: #3fffd7; min-height: 1.2em; }
    /* -- Ship Placement Controls -- */
    #placement-controls {
      display: flex;
      gap: 18px;
      justify-content: center;
      align-items: center;
      margin: 16px 0 10px 0;
    }
    #placement-controls label { color: #3fffd7; font-weight: bold; }
    #placement-controls select.placement-select {
      min-width: 160px;
      font-size: 1.05rem;
      padding: 6px 10px;
      color: #e9fcff;
      background: rgba(30,45,64,0.9);
      border: 1px solid #1fffd7aa;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
    }
    #placement-controls button.placement-btn {
      min-width: 130px;
      font-size: 1.05rem;
      padding: 6px 12px;
      color: #e9fcff;
      background: rgba(30,45,64,0.9);
      border: 1px solid #1fffd7aa;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
    }
    #placement-controls select.placement-select:hover,
    #placement-controls button.placement-btn:hover {
      background: rgba(40,60,85,0.95);
    }
    #placement-controls button.placement-btn:active {
      transform: scale(0.95);
    }
    #confirm-salvo { display: none; }
    .menu-select {
      min-width: 170px;
      font-size: 1.05rem;
      padding: 8px 12px;
      color: #e9fcff;
      background: rgba(30,45,64,0.9);
      border: 1px solid #1fffd7aa;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
      appearance: none;
      -webkit-appearance: none;
      padding-right: 28px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'%3E%3Cpath fill='%23e9fcff' d='M0 0L4 5L8 0Z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
    }
    .menu-select:hover,
    .menu-select:focus {
      background: rgba(40,60,85,0.95);
      outline: none;
    }
    .menu-select:active {
      transform: scale(0.97);
    }
    .grid-title {
  color: #00ffff;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 8px;
  text-shadow: 0 1px 8px #22ffd8cc;
  text-align: center;
  text-transform: uppercase;
}

#game-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(16, 27, 44, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 18px #31f4ff44;
position: relative;   /* This is important for z-index to work! */
  z-index: 10;
}


.hud-log-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
  margin-bottom: 16px;
}

#hud-panel {
  min-width: 0;
  max-width: 500px;
  height: 35px;
  font-size: 0.97rem;
  background: rgba(20,38,55,0.82);
  border-radius: 14px;
  box-shadow: 0 4px 14px #21fff655;
  padding: 6px 12px 4px 12px;
  border: 1px solid #00ffeebb;
  box-sizing: border-box;
  backdrop-filter: blur(6px);
  transition: background 0.3s, box-shadow 0.3s;
}

.hud-turn-indicator {
  font-size: 1.08rem;
  font-weight: bold;
  color: #fffcae;
  letter-spacing: 0.8px;
  text-shadow: 0 1.5px 7px #ffe877bb;
  margin-bottom: 2px;
}

#command-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 4px 10px;
  background: rgba(20,38,55,0.85);
  border: 1px solid #00ffeebb;
  border-radius: 12px;
  box-shadow: 0 2px 10px #21fff633;
  font-size: 0.95rem;
}
#combat-panel {
  width: 100%;
  padding: 6px 10px;
  background: rgba(20,38,55,0.85);
  border: 1px solid #00ffeebb;
  border-radius: 12px;
  box-shadow: 0 2px 10px #21fff633;
  font-size: 0.95rem;
  margin-bottom: 10px;
}
#combat-panel .combat-metrics {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 4px;
}
#combat-panel .combat-metrics span {
  font-weight: 600;
}
#fleet-bar {
  width: 100%;
  height: 10px;
  background: rgba(50,80,80,0.45);
  border-radius: 6px;
  overflow: hidden;
}
#fleet-bar-inner {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg,#00ff88,#00e0a0);
  transition: width 0.3s;
}
#fleet-bar-inner.damaged {
  background: linear-gradient(90deg,#ffd447,#ffbb33);
}
#fleet-bar-inner.critical {
  background: linear-gradient(90deg,#ff6b6b,#ff1c1c);
}
#fleet-percentage {
  text-align: center;
  font-weight: 600;
  margin-top: 4px;
}
#fleet-percentage.green { color: #00ff88; }
#fleet-percentage.yellow { color: #ffd447; }
#fleet-percentage.red { color: #ff6b6b; }
#alert-status.green { color: #00ff88; }
#alert-status.yellow { color: #ffd447; }
#alert-status.red { color: #ff6b6b; }

#hud-last-move {
  color: #b9f6ff;
  font-size: 0.96rem;
  min-height: 1.2em;
  margin-top: 1px;
  font-style: italic;
}
#powerups {
  display: flex;
  gap: 6px;
  margin-top: 2px;
}
#powerups .power-icon {
  animation: pulse 1.2s infinite;
}
#powerups .power-icon:hover { animation: bounceUpDown 0.6s infinite; }
#powerups .power-icon:active { animation: clickDownUp 0.3s; }
}
@keyframes pulse {0%{transform:scale(1);}50%{transform:scale(1.2);}100%{transform:scale(1);}}

/* --- Audio Control Styles --- */
#audio-controls {
  position: fixed;
  bottom: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: rgba(20,38,55,0.92);
  border: 1px solid #00ffeebb;
  border-radius: 8px;
  box-shadow: 0 2px 10px #21fff633;
  z-index: 1100;
}
#audio-controls button {
  background: none;
  border: none;
  color: #bbfff6;
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.2s, transform 0.2s;
}
#audio-controls button:hover {
  color: #ffffff;
  transform: scale(1.1);
}
#audio-controls input[type=range] {
  width: 60px;
  margin-left: 4px;
  transition: opacity 0.3s;
}


/* --- Pull Down Action Log Styles --- */
#action-log-panel {
  min-width: 210px;
  max-width: 250px;
  font-size: 0.97rem;
  background: rgba(20,38,55,0.92);
  border-radius: 12px;
  box-shadow: 0 2px 12px #21fff655;
  border: 1.5px solid #00ffeebb;
  margin: 0 0;
  position: static;
  transition: max-height 0.3s cubic-bezier(0.4, 0.2, 0.3, 1), box-shadow 0.2s;
  overflow: hidden;
  max-height: 36px; /* Just the tab visible when collapsed */
  cursor: pointer;
}

#action-log-panel.expanded {
  max-height: 240px; /* Enough for full log content */
  box-shadow: 0 4px 18px #00fff644;
}

#action-log-tab {
  background: #1a3e4a;
  color: #3fffd7;
  font-size: 1.06rem;
  font-weight: 600;
  text-align: center;
  padding: 7px 0 6px 0;
  border-radius: 10px 10px 0 0;
  border-bottom: 1.5px solid #1fffd7aa;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
#action-log-tab:hover { background: #215b68; animation: bounceUpDown 0.6s infinite; }
#action-log-tab:active { animation: clickDownUp 0.3s; }

#action-log-arrow {
  font-size: 1.2em;
  transition: transform 0.2s;
}

#action-log-panel.expanded #action-log-arrow {
  transform: rotate(180deg); /* Up arrow when open */
}

#action-log-content {
  background: rgba(17,42,64,0.93);
  padding: 8px 7px 6px 8px;
  border-radius: 0 0 10px 10px;
}

#action-log {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 130px;
  overflow-y: auto;
}

#action-log li {
  margin-bottom: 4px;
  padding-bottom: 1.5px;
  border-bottom: 1px solid #13505433;
  color: #cdf6fd;
  font-size: 0.93rem;
}
#action-log li.log-player { color: #56fff0; }
#action-log li.log-ai { color: #ffb8b8; }
#action-log li.log-sink { color: #ffe47c; font-weight: bold; }

.grids-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 48px;
  margin-bottom: 30px;
  width: 100%;
z-index: 10;
}

.grid-label {
  display: inline-block;
  width: 225px;
  text-align: center;
  font-weight: bold;
  color: transparent;
  background: linear-gradient(90deg, #20fff6, #00ff88);
  -webkit-background-clip: text;
  font-size: clamp(1rem, 2vmin, 1.4rem);
  margin-bottom: 5px;
  letter-spacing: 1.5px;
  text-shadow: 0 1px 6px #1fffd566;
}

.board-grid {
  margin: 0 8px;
  z-index: 10;
  position: relative;
}

.control-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-top: 28px;
  background: rgba(25,40,62,0.8);
  padding: 14px 20px;
  border-radius: 14px;
  box-shadow: 0 4px 16px #23e0ff33;
}
.control-panel button {
  background: linear-gradient(135deg, #1de9ff, #00bcd4);
  border: none;
  padding: 12px 40px;
  margin: 0 12px;
  color: #042630;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0 3px 12px #00fff566;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}
.control-panel button:hover {
  background: linear-gradient(135deg, #00d4ff, #0099c3);
  animation: bounceUpDown 0.6s infinite;
}
.control-panel button:active {
  animation: clickDownUp 0.3s;
}



  #starfield {
    position: fixed; left:0; top:0; width:100vw; height:100vh;
    z-index: -1;
pointer-events: none;
    background: linear-gradient(160deg, #233d6d 40%, #110b26 100%);
    animation: starBreath 18s ease-in-out infinite;
  }
  body::before, body::after {
    content: '';
    position: fixed;
    left: -25%;
    top: -25%;
    width: 150%;
    height: 150%;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle, rgba(100,180,255,0.07), transparent 70%);
    animation: bgPulse 12s ease-in-out infinite;
    z-index: -2;
  }
  body::after { animation-delay: 6s; }
  @keyframes bgPulse {
    0%,100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.45; }
  }
  @keyframes starBreath {
    0%,100% { transform: scale(1); opacity: 0.9; }
    50% { transform: scale(1.03); opacity: 1; }
  }
  #intro-screen {
    position: fixed;
    left: 0; top: 0;
    width: 100vw; height: 100vh;
    display: flex;
    align-items: center; justify-content: center;
    background: radial-gradient(circle at center, rgba(25,40,62,0.95), #0f1b2b);
    z-index: 2002;
    flex-direction: column;
    color: #aee7ff;
    font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
    animation: fadeInBG 1.2s cubic-bezier(.13,.84,.37,1);
  }
  #intro-screen.hide {
    animation: fadeOutIntro 1s forwards;
  }
  @keyframes fadeOutIntro { to { opacity:0; visibility: hidden; } }
  #intro-screen button {
    margin-top: 28px;
    padding: 14px 36px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg,#1de9ff,#00bcd4);
    color:#042630;
    font-size:1.2rem;
    font-weight:600;
    cursor:pointer;
  }
  #intro-screen button:hover { animation: bounceUpDown 0.6s infinite; }
  #intro-screen button:active { animation: clickDownUp 0.3s; }
  #enemy-board .radar-sweep {
    z-index: 5;
    pointer-events: none;
    position: absolute;
    left:0; top:0;
    width:100%; height:100%;
    border-radius: 12px;
    background: conic-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0) 80%);
    animation: radar 2s linear infinite;
    mix-blend-mode: overlay;
  }
  @keyframes radar { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  .halo-menu {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; z-index: 1001;
    background: #0f1b2be6;
    animation: fadeInBG 1.2s cubic-bezier(.13,.84,.37,1);
  }
  @keyframes fadeInBG { from {opacity:0;} to {opacity:1;} }
  .halo-menu-box {
    min-width: 420px;
    background: rgba(32,42,73,0.83);
    border-radius: 28px;
    box-shadow: 0 8px 44px #112449dd, 0 1.5px 10px #59c6f433;
    border: 1.8px solid #66e0ff99;
    backdrop-filter: blur(11px) brightness(1.1);
    padding: 52px 68px 38px 68px;
    display: flex; flex-direction: column; align-items: center;
    opacity: 0;
    animation: menuIn 1.5s cubic-bezier(.13,.84,.37,1) 0.3s forwards;
    position: relative;
  }
  @keyframes menuIn {
    from { opacity: 0; transform: scale(1.1);}
    60% { opacity: 0.8; }
    to   { opacity: 1; transform: scale(1);}
  }
  .halo-title {
    font-size: 3.4rem;
    font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
    font-weight: bold;
    color: #aee7ff;
    letter-spacing: 0.13em;
    text-shadow: 0 2px 24px #80fcff99, 0 1.5px 7px #2771f9bb, 0 0 10px #fff4;
    margin-bottom: 9px;
    position: relative;
    line-height: 1.1;
    text-align: center;
  }
  .halo-shine {
    position: absolute; left: 0; top: 0; width: 100%; height: 100%;
    pointer-events: none;
    background: linear-gradient(120deg, rgba(255,255,255,0.10) 28%, rgba(255,255,255,0.38) 51%, rgba(255,255,255,0.09) 61%);
    mix-blend-mode: lighten;
    transform: translateX(-120%) skewX(-17deg);
    animation: shineMove 2.7s linear 1.2s infinite;
  }
  @keyframes shineMove {
    from { transform: translateX(-120%) skewX(-17deg);}
    to   { transform: translateX(120%) skewX(-17deg);}
  }
  .halo-subtitle {
    font-size: 1.25rem;
    color: #e6efffcc;
    letter-spacing: 0.06em;
    margin-bottom: 20px;
    text-shadow: 0 1.5px 4px #0ff8, 0 1px 4px #2744bb66;
    font-style: italic;
    text-align: center;
  }
  .halo-menu-options {
    width: 310px; display: flex; flex-direction: row; gap: 18px; margin-bottom: 0;
    flex-wrap: wrap; justify-content: center;
  }
.halo-menu-options + .halo-menu-options { margin-top: 6px; }
.halo-btn {
    min-width: 92px;
    font-size: 1.09rem;
    color: #e9fcff;
    background: rgba(70,113,188,0.10);
    border: 2px solid #3ec3ff33;
    padding: 13px 0 10px 0;
    border-radius: 10px;
    margin-bottom: 0;
    outline: none;
    cursor: pointer;
    text-align: center;
    transition: box-shadow 0.18s, background 0.16s, border 0.19s, color 0.18s, transform 0.12s;
    box-shadow: 0 2.5px 10px #18e5f911;
    position: relative;
    overflow: hidden;
    margin: 0 4px 8px 4px;
  }
  .halo-btn-big { min-width: 220px; font-size: 1.35rem; padding: 17px 0 14px 0; margin: 0 4px;}
  .halo-btn:hover, .halo-btn:focus, .halo-btn.active {
    color: #57c1ff;
    background: rgba(56,127,255,0.17);
    border-color: #51f6ff;
    box-shadow: 0 5px 34px #2ad8ff44, 0 2px 18px #27c7f1bb;
    transform: scale(1.048) translateY(-2px);
    animation: bounceUpDown 0.6s infinite;
    outline: none;
    z-index: 1;
  }
  .halo-btn:active {
    transform: scale(0.98);
    animation: clickDownUp 0.3s;
  }
  .halo-btn::after {
    content: "";
    position: absolute; left: 0; right: 0; top: 0; bottom: 0;
    border-radius: 12px;
    pointer-events: none;
    box-shadow: 0 0 22px 4px #5cfffe33;
    opacity: 0; transition: opacity 0.17s;
  }
  .halo-btn:hover::after, .halo-btn:focus::after, .halo-btn.active::after { opacity: 1; }
  .halo-footer {
    margin-top: 18px;
    font-size: 0.96rem;
    color: #7efcffbb;
    letter-spacing: 0.09em;
    text-align: center;
    text-shadow: 0 1.5px 4px #13b6e088;
    opacity: 0.93;
    user-select: none;
  }
@media (max-width: 650px) {
  .halo-menu-box { min-width: 0; width: 98vw; padding: 7vw 3vw; }
  .halo-title { font-size: 2.1rem; }
  .halo-menu-options { width: 96vw; }
}

/* === RESPONSIVE BOARD LAYOUT === */
@media (orientation: portrait) {
  .grids-row { flex-direction: column; align-items: center; }
  .grid { width: 90vmin; height: 90vmin; max-width: 360px; max-height: 360px; }
}
@media (orientation: landscape) and (max-width: 900px) {
  .grid { width: 45vw; height: 45vw; max-width: 360px; max-height: 360px; }
}



  </style>
</head>
<body>
  <audio id="bg-music" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" preload="auto" loop></audio>
  <audio id="hit-sound" src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" preload="auto"></audio>

  <div id="intro-screen">
    <h1 class="title-text">Battleship Ultra</h1>
    <button id="intro-start" aria-label="Enter game">Enter</button>
  </div>

  <!-- =========================
      ENDGAME MODAL OVERLAY
      ========================= -->
  <div id="endgame-modal" class="menu-modal">
    <div class="modal-box">
      <div id="endgame-icon"></div>
      <h2 id="endgame-title"></h2>
      <p id="endgame-message"></p>
      <div id="endgame-stats"></div>
      <button id="endgame-restart" class="modal-btn" aria-label="Restart game">Restart</button>
      <button id="endgame-mainmenu" class="modal-btn" aria-label="Return to main menu">Main Menu</button>
    </div>
  </div>

<!-- =========================
     HALO 3 STYLE MAIN MENU + STARFIELD
      ========================= -->
<canvas id="starfield"></canvas>

<div class="halo-menu" id="main-menu">
  <div class="halo-menu-box">
    <div class="halo-title">
      <span>BATTLESHIP<br>ULTRA</span>
      <div class="halo-shine"></div>
    </div>
    <div class="halo-menu-options">
      <label for="mode-select">Game Mode</label>
      <select id="mode-select" class="menu-select" aria-label="Game mode">
        <option value="classic" selected>Classic</option>
        <option value="salvo">Salvo</option>
      </select>
    </div>
    <div class="halo-menu-options" style="margin-top:18px;">
      <label for="diff-select">AI Difficulty</label>
      <select id="diff-select" class="menu-select" aria-label="AI difficulty">
        <option value="easy" selected>Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
        <option value="advanced">Advanced</option>
        <option value="god">God</option>
      </select>
    </div>
    <div class="halo-menu-options" style="margin-top:18px;">
      <label for="theme-select">Theme</label>
      <select id="theme-select" class="menu-select" aria-label="Theme">
        <option value="navy" selected>Navy</option>
        <option value="scifi">Sci-Fi</option>
        <option value="pirate">Pirate</option>
      </select>
    </div>
    <div style="margin:30px 0 8px 0;">
      <button class="halo-btn halo-btn-big" id="menu-start" aria-label="Start game">Start Game</button>
    </div>
    <div class="halo-footer">&copy; 2025 Isaac's Game Studio – Inspired by Halo 3 UI</div>
  </div>
</div>

  <!-- =========================
      MAIN GAME CONTAINER (hidden by default)
      ========================= -->
  <div id="game-container" style="display: flex;">
<h1 class="title-text">Battleship Ultra</h1>
  <div id="command-bar">
    <span id="navcom-clock"></span>
    <span id="alert-status" class="green">ALERT: GREEN</span>
    <span id="turn-count">Turn 0</span>
    <span id="accuracy">Accuracy: 0%</span>
    <span id="combat-readiness">Status: OPTIMAL</span>
  </div>
  <div id="combat-panel">
    <div class="combat-metrics">
      <span id="stat-player">Your Ships: 5</span>
      <span id="stat-enemy">Enemy Ships: 5</span>
      <span id="stat-hits">Hits: 0</span>
      <span id="stat-misses">Misses: 0</span>
      <span id="stat-accuracy">Accuracy: 0%</span>
    </div>
    <div id="fleet-bar"><div id="fleet-bar-inner"></div></div>
    <div id="fleet-percentage" class="green">Fleet Integrity: 100%</div>
  </div>
  <h3 id="turn-indicator"></h3>
  <div id="messages" role="status" aria-live="polite"></div>
    <!-- === SHIP PLACEMENT CONTROLS === -->
    <div id="main-controls" style="display: none; flex-direction: column; align-items: center; width: 100%;">
      <div id="placement-controls">
        <label>Ship:
          <select id="ship-select" class="placement-select"></select>
        </label>
        <button id="toggle-orientation" class="placement-btn" aria-label="Toggle ship orientation">Horizontal ↔</button>
        <span id="placement-hint"></span>
      </div>
    </div>
<!-- ======================
     HUD PANEL + ACTION LOG
     ====================== -->
<div class="hud-log-row">
  <div id="hud-panel">
    <div id="hud-turn" class="hud-turn-indicator"></div>
    <div id="powerups" aria-label="Power ups"></div>
    <div id="hud-last-move"></div>
  </div>
  <div id="action-log-panel" class="collapsed">
    <div id="action-log-tab" onclick="toggleLogPanel()">
      <span>Action Log</span>
      <span id="action-log-arrow">&#9660;</span>
    </div>
    <div id="action-log-content">
      <ul id="action-log"></ul>
    </div>
  </div>
</div>

<!-- Game Boards Row -->
<div class="grids-row">
  <div>
    <div class="grid-label">SECTOR ALPHA</div>
    <div id="player-board" class="board-grid" role="grid" aria-label="Sector Alpha"></div>
  </div>
  <div>
    <div class="grid-label">SECTOR OMEGA</div>
    <div id="enemy-board" class="board-grid" role="grid" aria-label="Sector Omega"></div>
  </div>
</div>

<!-- Control Buttons (below boards) -->
<div class="control-panel">
  <button id="restart-game" aria-label="Restart game">Restart</button>
  <button id="go-main-menu" aria-label="Return to main menu">Main Menu</button>
  <button id="confirm-salvo" aria-label="Confirm salvo shots" style="display: none;">Confirm Shots</button>
</div>
<!-- Floating audio controls -->
<div id="audio-controls" aria-label="Audio controls">
  <button id="toggle-mute" aria-label="Mute or unmute sound">🔊</button>
  <label style="font-size:0.85rem;">Music
    <input id="music-volume" type="range" min="0" max="1" step="0.05" value="0.5"/>
  </label>
  <label style="font-size:0.85rem;">SFX
    <input id="sfx-volume" type="range" min="0" max="1" step="0.05" value="1"/>
  </label>
</div>
    </div>

  <!-- =========================
      JAVASCRIPT GAME LOGIC
      ========================= -->
  <script>
  /* =======================
     GAME CONSTANTS & GLOBALS
     ======================= */
  // Why: Define all fixed values, ships, and global state needed throughout game
const mode = window.selectedMode || 'classic';
const difficulty = window.selectedDiff || 'easy';
const theme = localStorage.getItem('bs-theme') || window.selectedTheme || 'navy';
applyTheme(theme);
window.selectedTheme = theme;
  const BOARD_SIZE = 10;
  const SHIPS = [
    { name: "Carrier", size: 5, icon: "🛳", class: "CAPITAL" },
    { name: "Battleship", size: 4, icon: "🚢", class: "HEAVY" },
    { name: "Cruiser", size: 3, icon: "🚤", class: "MEDIUM" },
    { name: "Submarine", size: 3, icon: "🛥", class: "MEDIUM" },
    { name: "Destroyer", size: 2, icon: "⛵", class: "LIGHT" },
  ];

  // Main game state (reset in restartGame)
  let playerBoard = [];
  let enemyBoard = [];
  let shipsToPlace = [...SHIPS];
  let currentShipIndex = 0;
  let placementOrientation = 'horizontal';
  let shipsPlaced = false;
  let aiBoard = [];
  let aiShips = [];
  let aiDifficulty = 'easy';
  let playerShips = [];
  let gameMode = 'classic';
  let pendingPlayerShots = [];
  let hoveredCell = null; // Track which board cell is under the mouse
  let targetOverlay = null; // Crosshair overlay element
  let earnedPowerups = [];
  let activePowerup = null;
  let hitsForPower = 3;
  let turnNumber = 0;
  const powerTypes = ['cluster','sonar'];
  let nextPowerupIndex = 0;
const AI_PROB = {easy:0, medium:0.3, hard:0.5, advanced:0.8, god:0.9};
const createBoard = () =>
  Array.from({length: BOARD_SIZE}, () =>
    Array.from({length: BOARD_SIZE}, () => ({hasShip:false, hit:false, miss:false, cellElem:null}))
  );
const countCells = (board, prop) => board.flat().reduce((n,c)=>n+(c[prop]?1:0),0);
const bgMusic = document.getElementById('bg-music');
const hitSound = document.getElementById('hit-sound');
const muteBtn = document.getElementById('toggle-mute');
const musicSlider = document.getElementById('music-volume');
const sfxSlider = document.getElementById('sfx-volume');
const navcomClock = document.getElementById('navcom-clock');
const alertStatusElem = document.getElementById('alert-status');
const turnCountElem = document.getElementById('turn-count');
const accuracyElem = document.getElementById('accuracy');
const readinessElem = document.getElementById('combat-readiness');
let audioMuted = localStorage.getItem('bs-muted') === 'true';
if(musicSlider){
  const mv = localStorage.getItem('bs-music-vol');
  if(mv !== null) musicSlider.value = mv;
}
if(sfxSlider){
  const sv = localStorage.getItem('bs-sfx-vol');
  if(sv !== null) sfxSlider.value = sv;
}
const confirmSalvoBtn = document.getElementById('confirm-salvo');
// Fire all selected salvo shots when the confirm button is clicked
confirmSalvoBtn.onclick = () => {
  confirmSalvoBtn.style.display = 'none';
  applyPlayerSalvoShots();
};

function updateClock(){
  const now = new Date();
  if(navcomClock) navcomClock.textContent = now.toLocaleTimeString('en-GB', {hour12:false});
}
setInterval(updateClock,1000);
updateClock();

// --- Audio Control Handlers ---
function updateMuteIcon() {
  muteBtn.textContent = audioMuted ? '🔈' : '🔊';
}
muteBtn.onclick = () => {
  audioMuted = !audioMuted;
  if(bgMusic) bgMusic.muted = audioMuted;
  if(hitSound) hitSound.muted = audioMuted;
  localStorage.setItem('bs-muted', audioMuted);
  updateMuteIcon();
}; 
if(musicSlider){
  const applyMusicVolume = () => { if(bgMusic) bgMusic.volume = parseFloat(musicSlider.value); };
  const setMusicVol = () => { applyMusicVolume(); localStorage.setItem('bs-music-vol', musicSlider.value); };
  setMusicVol();
  musicSlider.addEventListener('input', setMusicVol);
}
if(sfxSlider){
  const applySfxVolume = () => { if(hitSound) hitSound.volume = parseFloat(sfxSlider.value); };
  const setSfxVol = () => { applySfxVolume(); localStorage.setItem('bs-sfx-vol', sfxSlider.value); };
  setSfxVol();
  sfxSlider.addEventListener('input', setSfxVol);
}
updateMuteIcon();

document.addEventListener('visibilitychange', () => {
  if(document.hidden) {
    if(bgMusic) bgMusic.pause();
  } else {
    if(bgMusic && !audioMuted) bgMusic.play().catch(()=>{});
  }
});

  /* ==============================
     ANIMATION FUNCTIONS
     ============================== */
  // Why: Show missile, explosion, and splash effects to make hits/misses satisfying!

  // Animate a missile moving from one cell to another
  function animateMissile(fromElem, toElem, callback, rotate = false) {
    if (!fromElem || !toElem) { if (callback) callback(); return; }
    const fromRect = fromElem.getBoundingClientRect();
    const toRect = toElem.getBoundingClientRect();
    const fromX = fromRect.left + fromRect.width / 2;
    const fromY = fromRect.top + fromRect.height / 2;
    const toX = toRect.left + toRect.width / 2;
    const toY = toRect.top + toRect.height / 2;
    let angle = 0;
    if (rotate) angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;

    const missile = document.createElement('div');
    missile.className = 'missile';
    missile.textContent = '🚀';
    missile.style.left = `${fromX - 14}px`;
    missile.style.top = `${fromY - 14}px`;
    missile.style.transform = `rotate(${angle}deg)`;
    missile.style.position = 'fixed';

    document.body.appendChild(missile);
    setTimeout(() => {
      missile.style.left = `${toX - 14}px`;
      missile.style.top = `${toY - 14}px`;
      missile.style.transform = `rotate(${angle}deg)`;
    }, 16);
    setTimeout(() => { missile.remove(); if (callback) callback(); }, 350);
  }

  // Show explosion effect for hits
  function showExplosion(targetElem) {
    const rect = targetElem.getBoundingClientRect();
    const exp = document.createElement('div');
    exp.className = 'explosion';
    exp.textContent = '💥';
    exp.style.left = `${rect.left}px`;
    exp.style.top = `${rect.top}px`;
    exp.style.position = 'fixed';
    document.body.appendChild(exp);
    exp.addEventListener('animationend', () => exp.remove());
    const ring = document.createElement('div');
    ring.className = 'exp-ring';
    targetElem.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove());
    showPulse(targetElem);
    if(hitSound){ hitSound.currentTime = 0; hitSound.play().catch(()=>{}); }
  }

  // Show splash effect for misses
  function showSplash(targetElem) {
    const rect = targetElem.getBoundingClientRect();
    const splash = document.createElement('div');
    splash.className = 'splash';
    splash.textContent = '💦';
    splash.style.left = `${rect.left}px`;
    splash.style.top = `${rect.top}px`;
    splash.style.position = 'fixed';
    document.body.appendChild(splash);
    splash.addEventListener('animationend', () => splash.remove());
    showPulse(targetElem);
    if(hitSound){ hitSound.currentTime = 0; hitSound.play().catch(()=>{}); }
  }
  function showPulse(targetElem) {
    const ring = document.createElement('div');
    ring.className = 'attack-pulse';
    targetElem.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove());
  }
  // Fade out a sunk ship’s cells
  function fadeOutShip(cellElem) {
    cellElem.classList.add('fading-out');
    setTimeout(() => cellElem.classList.remove('fading-out'), 1200);
  }

  // === Target Overlay Helpers ===
  function showTargetOverlay(cell){
    if(!targetOverlay) return;
    const rect = cell.getBoundingClientRect();
    const boardRect = cell.parentElement.getBoundingClientRect();
    targetOverlay.style.left = (rect.left - boardRect.left + rect.width/2) + 'px';
    targetOverlay.style.top = (rect.top - boardRect.top + rect.height/2) + 'px';
    targetOverlay.style.display = 'block';
  }
  function hideTargetOverlay(){
    if(targetOverlay) targetOverlay.style.display = 'none';
  }
  function pingTarget(){
    if(!targetOverlay) return;
    targetOverlay.classList.add('ping');
    targetOverlay.addEventListener('animationend', () => {
      targetOverlay.classList.remove('ping');
      hideTargetOverlay();
    }, {once:true});
  }

  /* ==============================
     ICON HELPER
     ============================== */
  // Why: Central way to set icons in a cell, keeps code DRY
  function setCellIcon(cellElem, icon) {
    cellElem.querySelector('.cell-icon').textContent = icon;
  }

  /* ==============================
     BOARD CREATION & RENDER
     ============================== */
  // Why: Builds both boards (with labels!) each time the game is set up or restarted
  function createEmbeddedLabeledBoard(boardId, isPlayer) {
  // 1. Clear and ensure grid styling
  const boardDiv = document.getElementById(boardId);
  boardDiv.innerHTML = '';
  boardDiv.className = 'grid board-grid';
  let radar;
  if(!isPlayer){
    radar = document.createElement('div');
    radar.className = 'radar-sweep';
    targetOverlay = document.createElement('div');
    targetOverlay.id = 'target-overlay';
  }

  // 2. Build 11x11 grid (first row/col = labels)
  for (let r = 0; r <= BOARD_SIZE; r++) {
    for (let c = 0; c <= BOARD_SIZE; c++) {
      let cell = document.createElement('div');
      if (r === 0 && c === 0) {
        cell.className = 'cell label-cell corner-cell';
      } else if (r === 0) {
        cell.className = 'cell label-cell col-label';
        cell.textContent = c;
      } else if (c === 0) {
        cell.className = 'cell label-cell row-label';
        cell.textContent = String.fromCharCode(64 + r); // 'A', 'B', ...
      } else {
        cell.className = 'cell';
        cell.dataset.row = r - 1;
        cell.dataset.col = c - 1;
        cell.innerHTML = '<span class="cell-icon"></span>';
        cell.tabIndex = 0;
        cell.setAttribute('role','gridcell');
        cell.setAttribute('aria-label', `${String.fromCharCode(64+r)}${c}`);
        // Track hover for keyboard firing/placement
        cell.addEventListener('mouseenter', () => { hoveredCell = cell; });
        cell.addEventListener('mouseleave', () => { if(hoveredCell === cell) hoveredCell = null; });
        // Hook up correct event handlers
        if (isPlayer) {
          playerBoard[r - 1][c - 1].cellElem = cell;
          cell.addEventListener('mouseenter', handleCellHover);
          cell.addEventListener('mouseleave', handleCellUnhover);
          cell.addEventListener('click', handleCellPlace);
          cell.addEventListener('keydown', e => {
            if(e.key==='Enter' || e.key===' ') { e.preventDefault(); handleCellPlace(e); }
          });
        } else {
          enemyBoard[r - 1][c - 1].cellElem = cell;
          cell.addEventListener('mouseenter', () => showTargetOverlay(cell));
          cell.addEventListener('mouseleave', hideTargetOverlay);
          cell.addEventListener('click', handleTargetClick);
          cell.addEventListener('keydown', e => {
            if(e.key==='Enter' || e.key===' ') { e.preventDefault(); handleTargetClick(e); }
          });
        }
      }
      boardDiv.appendChild(cell);
    }
  }
  if(!isPlayer && radar){
    boardDiv.appendChild(radar);
    boardDiv.appendChild(targetOverlay);
  }
}

  /* ==============================
     SHIP PLACEMENT CONTROLS & LOGIC
     ============================== */
  // Why: Controls the dropdown, orientation, and shows placement hints
  function setupPlacementControls() {
    const shipSelect = document.getElementById('ship-select');
    shipSelect.innerHTML = '';
    shipsToPlace.forEach((ship, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `${ship.icon} ${ship.name} (${ship.class}, ${ship.size})`;
      shipSelect.appendChild(opt);
    });
    shipSelect.disabled = shipsToPlace.length === 0;
    shipSelect.onchange = (e) => {
      currentShipIndex = parseInt(e.target.value);
      showPlacementHint();
    };
  const orientBtn = document.getElementById('toggle-orientation');
  const updateOrientationButton = () => {
    orientBtn.textContent = placementOrientation === 'horizontal'
      ? 'Horizontal \u2194'
      : 'Vertical \u2195';
  };
  orientBtn.onclick = () => {
    placementOrientation = placementOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    updateOrientationButton();
    showPlacementHint();
  };
  updateOrientationButton();
  showPlacementHint();
}

  // Updates placement hint text
  function showPlacementHint() {
    if (shipsToPlace.length > 0) {
      const ship = shipsToPlace[currentShipIndex];
      const orientText = placementOrientation === 'horizontal' ? 'Horizontal \u2194' : 'Vertical \u2195';
      const hint = `Placing: ${ship.icon} ${ship.name} (${ship.class}, ${ship.size}) - ${orientText}`;
      document.getElementById('placement-hint').textContent = hint;
    } else {
      document.getElementById('placement-hint').textContent = '';
    }
  }

  // Checks if a ship fits at a given row/col with given orientation
  function canPlaceShip(row, col, size, orientation) {
    for (let i = 0; i < size; i++) {
      let r = row + (orientation === 'vertical' ? i : 0);
      let c = col + (orientation === 'horizontal' ? i : 0);
      if (r >= BOARD_SIZE || c >= BOARD_SIZE || playerBoard[r][c].hasShip) {
        return false;
      }
    }
    return true;
  }

  // === Ship Placement Events ===

  // Preview ship placement on hover
  function handleCellHover(e) {
    hoveredCell = e.target;
    if (shipsPlaced || shipsToPlace.length === 0) return;
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const ship = shipsToPlace[currentShipIndex];
    const canPlace = canPlaceShip(row, col, ship.size, placementOrientation);

    for (let i = 0; i < ship.size; i++) {
      let r = row + (placementOrientation === 'vertical' ? i : 0);
      let c = col + (placementOrientation === 'horizontal' ? i : 0);
      if (r < BOARD_SIZE && c < BOARD_SIZE) {
        const cell = playerBoard[r][c].cellElem;
        if (canPlace) cell.classList.add('ship-preview');
        else cell.classList.add('bad-placement');
      }
    }
  }

  // Remove preview when mouse leaves cell
  function handleCellUnhover(e) {
    if(hoveredCell === e.target) hoveredCell = null;
    if (shipsToPlace.length === 0) return;
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const ship = shipsToPlace[currentShipIndex];
    for (let i = 0; i < ship.size; i++) {
      let r = row + (placementOrientation === 'vertical' ? i : 0);
      let c = col + (placementOrientation === 'horizontal' ? i : 0);
      if (r < BOARD_SIZE && c < BOARD_SIZE) {
        playerBoard[r][c].cellElem.classList.remove('ship-preview', 'bad-placement');
      }
    }
  }

  // Place a ship (if possible) on click
  function handleCellPlace(e) {
    if (shipsPlaced || shipsToPlace.length === 0) return;
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const ship = shipsToPlace[currentShipIndex];
    if (!canPlaceShip(row, col, ship.size, placementOrientation)) {
      showMessage("Position denied. Choose a valid location.");
      return;
    }
    let newShip = { name: ship.name, positions: [] };
    for (let i = 0; i < ship.size; i++) {
      let r = row + (placementOrientation === 'vertical' ? i : 0);
      let c = col + (placementOrientation === 'horizontal' ? i : 0);
      playerBoard[r][c].hasShip = true;
      playerBoard[r][c].cellElem.classList.add('ship');
      setCellIcon(playerBoard[r][c].cellElem, ship.icon);
      fadeInShip(playerBoard[r][c].cellElem); // Placement animation
      playerBoard[r][c].cellElem.classList.remove('ship-preview', 'bad-placement');
      newShip.positions.push({ r, c });
    }
    playerShips.push(newShip);

    shipsToPlace.splice(currentShipIndex, 1);
    currentShipIndex = 0;
    if (shipsToPlace.length === 0) {
  document.getElementById('placement-controls').style.display = 'none';
  shipsPlaced = true;
      showMessage('All ships deployed. Awaiting firing orders.');
      setTurnIndicator("Your Turn");
      if (gameMode === "salvo") {
        pendingPlayerShots = [];
        showMessage(`Your move, Commander. Allocate ${countUnsunkShips(playerShips, playerBoard)} salvo${countUnsunkShips(playerShips, playerBoard) > 1 ? 's' : ''}.`);
      }
    } else {
      setupPlacementControls();
    }
  }

  // Fade-in animation when ship is placed
  function fadeInShip(cellElem) {
    cellElem.classList.add('fade-in');
    setTimeout(() => cellElem.classList.remove('fade-in'), 500);
  }

  /* --- GAME STATE CHECKS --- */
  // Why: Needed to check for win/loss and for Salvo shot count
  function countUnsunkShips(ships, board) {
    let sunk = 0;
    for (const ship of ships) {
      if (ship.positions.every(pos => board[pos.r][pos.c].hit)) sunk++;
    }
    return ships.length - sunk;
  }

  // Checks if all ships on board are sunk (game over)
  function areAllShipsSunk(board) {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c].hasShip && !board[r][c].hit) {
          return false;
        }
      }
    }
    return true;
  }

  // Checks if a specific ship is sunk
  function isShipSunk(ships, row, col, board) {
    for (const ship of ships) {
      if (ship.positions.some(pos => pos.r === row && pos.c === col)) {
        return ship.positions.every(pos => board[pos.r][pos.c].hit);
      }
    }
    return false;
  }

  // Marks a sunk ship (sets icon & animation for all its cells)
  function markSunkShip(ships, board, enemyBoard, row, col) {
    for (const ship of ships) {
      if (ship.positions.some(pos => pos.r === row && pos.c === col)) {
        for (const pos of ship.positions) {
          setCellIcon(enemyBoard[pos.r][pos.c].cellElem, '❌');
          fadeOutShip(enemyBoard[pos.r][pos.c].cellElem);
        }
        return ship.name;
      }
    }
    return null;
  }

const countPlayerHits = () => countCells(enemyBoard, 'hit');
const countPlayerMisses = () => countCells(enemyBoard, 'miss');

  /* ==============================
     END GAME HANDLING
     ============================== */
  function endGame(win) {
    shipsPlaced = false;
    showEndgameModal(win);
  }

  /* ==============================
     MAIN FIRING LOGIC (SHARED)
     ============================== */
  // Why: Central function for handling attacks (used by both player & AI, all modes)
  function fireAtCell(boardToUpdate, enemyBoard, enemyShips, row, col, isPlayer) {
const rowLabel = String.fromCharCode(65 + row);  // 0 -> 'A', 1 -> 'B', etc.
  const colLabel = (col + 1);                      // 0 -> 1, 9 -> 10
    if (enemyBoard[row][col].hasShip) {
      boardToUpdate[row][col].cellElem.classList.add('hit');
      boardToUpdate[row][col].hit = true;
      enemyBoard[row][col].hit = true;
      setCellIcon(boardToUpdate[row][col].cellElem, '💥');
      showExplosion(boardToUpdate[row][col].cellElem);
      logAction(`${isPlayer ? 'Player' : 'AI'} hit at ${rowLabel}${colLabel}`, isPlayer ? "log-player" : "log-ai");
      if(isPlayer){
        hitsForPower--;
        if(hitsForPower<=0){
          grantPowerup();
          hitsForPower = 3;
        }
      }
      if (isShipSunk(enemyShips, row, col, enemyBoard)) {
        let name = markSunkShip(enemyShips, enemyBoard, boardToUpdate, row, col);
        if(isPlayer) {
          showMessage(`Target neutralized! Enemy ${name} destroyed.`);
        } else {
          showMessage(`Our ${name} has been sunk!`);
        }
      } else {
        showMessage(isPlayer ? "Direct hit on enemy vessel!" : "Enemy shot landed on our ship!");
        logAction(`${isPlayer ? "You" : "AI"} sunk a ship!`, "log-sink");
      }
    } else {
      boardToUpdate[row][col].cellElem.classList.add('miss');
      setCellIcon(boardToUpdate[row][col].cellElem, '⚪');
      boardToUpdate[row][col].miss = true;
      enemyBoard[row][col].miss = true;
      showSplash(boardToUpdate[row][col].cellElem);
      showMessage(isPlayer ? "Shot missed the target." : "Enemy shot fell short.");
      logAction(`${isPlayer ? 'Player' : 'AI'} missed at ${rowLabel}${colLabel}`, isPlayer ? "log-player" : "log-ai");
    }
     updateHUD();
  }

  /* ==============================
     PLAYER FIRE HANDLER
     ============================== */
  function handleTargetClick(e) {
    if (!shipsPlaced) return;
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    // Don’t allow repeat shots
    if (enemyBoard[row][col].hit || enemyBoard[row][col].miss) return;
    showTargetOverlay(e.target);
    pingTarget();

    if(activePowerup){
      const type = activePowerup.type;
      const idx = activePowerup.index;
      earnedPowerups.splice(idx,1);
      activePowerup = null;
      updateHUD();
      if(type==='cluster') {
        useClusterBomb(row,col);
      } else {
        useSonarPulse(row,col);
      }
      return;
    }

    if (gameMode === 'salvo') {
      const shotsAllowed = countUnsunkShips(playerShips, playerBoard);

      // Toggle shot selection
      if (pendingPlayerShots.some(pos => pos.r === row && pos.c === col)) {
        pendingPlayerShots = pendingPlayerShots.filter(pos => !(pos.r === row && pos.c === col));
        e.target.classList.remove('salvo-selected');
      } else {
        if (pendingPlayerShots.length >= shotsAllowed) {
          showMessage(`Limit reached: ${shotsAllowed} salvo${shotsAllowed > 1 ? 's' : ''} max.`);
          return;
        }
        pendingPlayerShots.push({ r: row, c: col });
        e.target.classList.add('salvo-selected');
      }
      // Update confirm button display
      if (pendingPlayerShots.length > 0) {
        confirmSalvoBtn.style.display = 'inline-block';
        confirmSalvoBtn.disabled = pendingPlayerShots.length !== shotsAllowed;
      } else {
        confirmSalvoBtn.style.display = 'none';
      }
      if (pendingPlayerShots.length < shotsAllowed) {
        showMessage(`Select ${shotsAllowed - pendingPlayerShots.length} more coordinate${shotsAllowed - pendingPlayerShots.length > 1 ? 's' : ''}.`);
      } else if (pendingPlayerShots.length === shotsAllowed) {
        showMessage(`Press \"Confirm Shots\" to open fire.`);
      }
      return;
    }

    // === CLASSIC MODE: Fire immediately ===
    let fromElem = playerBoard[BOARD_SIZE - 1][0].cellElem;
    let toElem = enemyBoard[row][col].cellElem;
    animateMissile(fromElem, toElem, () => {
      playerFireSingleShot(row, col);
    });
  }

  // Handles firing all salvo shots
  function applyPlayerSalvoShots() {
    let shots = [...pendingPlayerShots];
    let idx = 0;
    function doNextShot() {
      if (idx < shots.length) {
        let { r, c } = shots[idx++];
        let fromElem = playerBoard[BOARD_SIZE - 1][0].cellElem;
        let toElem = enemyBoard[r][c].cellElem;
        animateMissile(fromElem, toElem, () => {
          fireAtCell(enemyBoard, aiBoard, aiShips, r, c, true);
          toElem.classList.remove('salvo-selected');
          setTimeout(doNextShot, 350);
        });
      } else {
        pendingPlayerShots = [];
        document.querySelectorAll('.salvo-selected').forEach(cell => cell.classList.remove('salvo-selected'));
        if (areAllShipsSunk(aiBoard)) {
          endGame(true);
          return;
        }
        setTimeout(aiSalvoTurn, 700);
      }
    }
    doNextShot();
    confirmSalvoBtn.style.display = 'none';
  }

  // Fire a single classic shot
  function playerFireSingleShot(row, col) {
    if (enemyBoard[row][col].hit || enemyBoard[row][col].miss) return;
    fireAtCell(enemyBoard, aiBoard, aiShips, row, col, true);

    if (areAllShipsSunk(aiBoard)) {
      endGame(true);
      return;
    }
    setTurnIndicator("AI's Turn");
    setTimeout(aiAttackPlayer, 500);
  }

  /* ==============================
     AI TURN LOGIC
     ============================== */
  // === Classic Mode ===
  function aiAttackPlayer() {
    let possibleCells = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (!playerBoard[r][c].hit && !playerBoard[r][c].miss) {
          possibleCells.push({ r, c });
        }
      }
    }
    if (possibleCells.length === 0) return;

    let cellToAttack;
    let prob = AI_PROB[aiDifficulty] || 0;
    let shipCells = possibleCells.filter(({ r, c }) => playerBoard[r][c].hasShip);
    if (shipCells.length > 0 && Math.random() < prob) {
      cellToAttack = shipCells[Math.floor(Math.random() * shipCells.length)];
    } else {
      cellToAttack = possibleCells[Math.floor(Math.random() * possibleCells.length)];
    }
    const { r, c } = cellToAttack;

    // Launch missile from top right (AI's perspective)
    let fromElem = enemyBoard[0][BOARD_SIZE - 1].cellElem;
    let toElem = playerBoard[r][c].cellElem;

    animateMissile(fromElem, toElem, () => {
      fireAtCell(playerBoard, playerBoard, playerShips, r, c, false);

      if (areAllShipsSunk(playerBoard)) {
        endGame(false);
        return;
      }
      setTurnIndicator("Your Turn");
      showMessage("Your turn, Commander. Fire when ready!");
    }, true); // ROTATE AI MISSILE!
  }

  // === Salvo Mode ===
  function aiSalvoTurn() {
    let shots = countUnsunkShips(aiShips, aiBoard);
    let options = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (!playerBoard[r][c].hit && !playerBoard[r][c].miss) {
          options.push({ r, c });
        }
      }
    }
    let idx = 0;
    function aiDoNextShot() {
      if (idx < shots && options.length > 0) {
        let cellToAttack;
        let prob = AI_PROB[aiDifficulty] || 0;
        let shipCells = options.filter(({ r, c }) => playerBoard[r][c].hasShip);
        if (shipCells.length > 0 && Math.random() < prob) {
          cellToAttack = shipCells[Math.floor(Math.random() * shipCells.length)];
        } else {
          cellToAttack = options[Math.floor(Math.random() * options.length)];
        }
        const { r, c } = cellToAttack;
        options = options.filter(pos => !(pos.r === r && pos.c === c));

        // Missile from top right
        let fromElem = enemyBoard[0][BOARD_SIZE - 1].cellElem;
        let toElem = playerBoard[r][c].cellElem;
        animateMissile(fromElem, toElem, () => {
          fireAtCell(playerBoard, playerBoard, playerShips, r, c, false);
          if (areAllShipsSunk(playerBoard)) {
            endGame(false);
            return;
          }
          idx++;
          setTimeout(aiDoNextShot, 350);
        }, true); // ROTATE AI MISSILE!
      } else {
setTurnIndicator("Your Turn");
        showMessage(`Commander, select ${countUnsunkShips(playerShips, playerBoard)} target${countUnsunkShips(playerShips, playerBoard) > 1 ? 's' : ''}.`);
      }
    }
    aiDoNextShot();
  }

  /* ==============================
     UI/UTILITY FUNCTIONS
     ============================== */
  // Show a message to the player
  function showMessage(msg) {
    document.getElementById('messages').textContent = `STATUS: ${msg}`;
  }
  function randomInt(max) { return Math.floor(Math.random() * max); }

  // Place AI ships randomly (never overlap)
  function placeAIShips() {
    aiBoard = createBoard();
    aiShips = [];
    for (const ship of SHIPS) {
      let placed = false;
      while (!placed) {
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = randomInt(BOARD_SIZE);
        const col = randomInt(BOARD_SIZE);
        let fits = true;
        for (let i = 0; i < ship.size; i++) {
          let r = row + (orientation === 'vertical' ? i : 0);
          let c = col + (orientation === 'horizontal' ? i : 0);
          if (r >= BOARD_SIZE || c >= BOARD_SIZE || aiBoard[r][c].hasShip) {
            fits = false; break;
          }
        }
        if (fits) {
          let positions = [];
          for (let i = 0; i < ship.size; i++) {
            let r = row + (orientation === 'vertical' ? i : 0);
            let c = col + (orientation === 'horizontal' ? i : 0);
            aiBoard[r][c].hasShip = true;
            positions.push({ r, c });
          }
          aiShips.push({ name: ship.name, positions });
          placed = true;
        }
      }
    }
  }

  /* ==============================
     MAIN MENU & GAME OVER MODALS
     ============================== */
  function showEndgameModal(win) {
    const modal = document.getElementById("endgame-modal");
    modal.classList.add("menu-modal-show");
    modal.classList.toggle("victory", win);
    modal.classList.toggle("defeat", !win);
    document.getElementById("endgame-title").textContent = win ? "Victory!" : "Defeat";
    document.getElementById("endgame-icon").textContent = win ? "🎉" : "💀";
    document.getElementById("endgame-message").textContent = win
      ? "Congratulations, Admiral!" : "The enemy fleet prevailed. Try again!";
    const hits = countPlayerHits();
    const misses = countPlayerMisses();
    const total = hits + misses;
    const acc = total ? Math.round((hits / total) * 100) : 0;
    const playerLeft = playerShips.length;
    const enemyRemain = countUnsunkShips(aiShips, enemyBoard);
    document.getElementById("endgame-stats").textContent =
      `Hits: ${hits} • Misses: ${misses} • Accuracy: ${acc}% • Your Ships: ${playerLeft} • Enemy Remaining: ${enemyRemain}`;
    if(bgMusic) bgMusic.pause();
  }
  function hideEndgameModal() {
    const modal = document.getElementById("endgame-modal");
    modal.classList.remove("menu-modal-show", "victory", "defeat");
    if(bgMusic && document.getElementById('main-menu').style.display === 'flex') {
      bgMusic.volume = parseFloat(musicSlider.value);
      if(!audioMuted) bgMusic.play().catch(()=>{});
    }
  }
  function showMainMenu() {
    document.getElementById("main-menu").style.display = "flex";
    document.getElementById("game-container").style.display = "none";
    hideEndgameModal();
    if(bgMusic) {
      bgMusic.volume = parseFloat(musicSlider.value);
      if(!audioMuted) bgMusic.play().catch(()=>{});
    }
  }
  
  /* ==============================
     FULL GAME RESET/RESTART
     ============================== */
function restartGame() {
  shipsToPlace = [...SHIPS];
  currentShipIndex = 0;
  placementOrientation = 'horizontal';
  shipsPlaced = false;
  playerShips = [];
  aiShips = [];
  pendingPlayerShots = [];
  earnedPowerups = [];
  activePowerup = null;
  hitsForPower = 3;
  nextPowerupIndex = 0;
  turnNumber = 0;
  // Set up boards
  playerBoard = createBoard();
  enemyBoard = createBoard();
  confirmSalvoBtn.style.display = 'none';

  createEmbeddedLabeledBoard('player-board', true);
  createEmbeddedLabeledBoard('enemy-board', false);
  document.getElementById('main-controls').style.display = 'flex';
  document.getElementById('placement-controls').style.display = 'flex';
  setupPlacementControls();
  placeAIShips();
  showMessage('Deploy your fleet to commence battle.');
  setTurnIndicator('');
  hideEndgameModal();
  document.querySelectorAll('.salvo-selected').forEach(cell => cell.classList.remove('salvo-selected'));
  logAction("Game restarted. Place your ships!", "log-player");
  updateHUD();
}
  function setTurnIndicator(msg) {
    document.getElementById('turn-indicator').textContent = msg || '';
    if(msg === 'Your Turn') {
      turnNumber++;
    }
    updateHUD();
  }

  /* ==============================
     BUTTON EVENT HOOKS & INIT
     ============================== */
  document.getElementById("restart-game").onclick = restartGame;
  document.getElementById("go-main-menu").onclick = showMainMenu;
  document.getElementById("endgame-restart").onclick = function() {
    hideEndgameModal();
    restartGame();
  };
  document.getElementById("endgame-mainmenu").onclick = function() {
    hideEndgameModal();
    showMainMenu();
  };
  // On page load: show menu and setup controls
  window.onload = function() {
    document.getElementById('intro-screen').style.display = 'flex';
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
  };
  document.getElementById('intro-start').onclick = function(){
    document.getElementById('intro-screen').classList.add('hide');
    showMainMenu();
    restartGame();
  };
  document.addEventListener('keydown', e => {
    if(e.key === 'Enter' && confirmSalvoBtn.style.display !== 'none') {
      confirmSalvoBtn.click();
    }
  });
  document.addEventListener('keydown', e => {
    if(e.key.toLowerCase() === 'r' && document.getElementById('main-controls').style.display !== 'none') {
      e.preventDefault();
      document.getElementById('toggle-orientation').click();
    }
  });
  document.addEventListener('keydown', e => {
    if((e.key === 'Enter' || e.key === ' ') && hoveredCell && confirmSalvoBtn.style.display === 'none') {
      e.preventDefault();
      hoveredCell.click();
    }
  });
  // Starfield
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [], w = 0, h = 0;
  function resizeStarfield() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    stars = Array.from({length: 170}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.98 + 0.02,
      speed: Math.random() * 0.25 + 0.03
    }));
  }
  window.addEventListener('resize', resizeStarfield); resizeStarfield();
  function drawStarfield() {
    ctx.clearRect(0, 0, w, h);
    for (let s of stars) {
      ctx.save();
      let size = s.z * 2.4 + 0.6;
      ctx.beginPath();
      ctx.arc(s.x, s.y, size, 0, 2 * Math.PI);
      ctx.globalAlpha = 0.53 * s.z + 0.17;
      ctx.fillStyle = `rgba(${95+Math.floor(s.z*75)},${210+Math.floor(s.z*30)},255,1)`;
      ctx.shadowColor = '#75f4ffcc';
      ctx.shadowBlur = 7 * s.z;
      ctx.fill();
      ctx.restore();
      s.x += s.speed * s.z * 0.5;
      s.y += s.speed * s.z * 0.13;
      if (s.x > w + 6) s.x = -6;
      if (s.y > h + 6) s.y = -6;
    }
    requestAnimationFrame(drawStarfield);
  }
  drawStarfield();

  // --- HALO MENU LOGIC ---
  let selectedMode = 'classic';
  let selectedDiff = 'easy';
  let selectedTheme = 'navy';
  applyTheme(selectedTheme);
  // Dropdowns for menu selections
  const modeSelect = document.getElementById('mode-select');
  selectedMode = modeSelect.value;
  modeSelect.onchange = () => { selectedMode = modeSelect.value; };

  const diffSelect = document.getElementById('diff-select');
  selectedDiff = diffSelect.value;
  diffSelect.onchange = () => { selectedDiff = diffSelect.value; };

  const themeSelect = document.getElementById('theme-select');
  selectedTheme = themeSelect.value;
  themeSelect.onchange = () => {
    selectedTheme = themeSelect.value;
    localStorage.setItem('bs-theme', selectedTheme);
    applyTheme(selectedTheme);
  };


  function applyTheme(theme) {
    document.body.classList.remove('theme-navy','theme-scifi','theme-pirate');
    document.body.classList.add('theme-' + theme);
  }



  // Start Game button
  document.getElementById('menu-start').onclick = function() {
    // Set game mode & difficulty in your logic:
    window.selectedMode = selectedMode;
    window.selectedDiff = selectedDiff;
    window.selectedTheme = selectedTheme;
    // Hide menu, show game (insert your code here)
    document.getElementById('main-menu').style.display = "none";
    // Example: Show the main game container
    if(document.getElementById('game-container'))
      document.getElementById('game-container').style.display = "flex";
    // Your start game logic here (call your game init/restart logic as needed)
    if(typeof restartGame === "function") {
      // Assign selected mode/difficulty to your game's variables!
      gameMode = selectedMode;
      aiDifficulty = selectedDiff;
      applyTheme(selectedTheme);
      restartGame();
    }
  };

// Update the HUD stats
function toggleLogPanel() {
  const panel = document.getElementById('action-log-panel');
  panel.classList.toggle('expanded');
  panel.classList.toggle('collapsed');
}



function grantPowerup(){
  const type = powerTypes[nextPowerupIndex];
  nextPowerupIndex = (nextPowerupIndex + 1) % powerTypes.length;
  earnedPowerups.push(type);
  showMessage(type==='cluster' ? 'Cluster Bomb ready!' : 'Sonar Pulse ready!');
  updateHUD();
}

function activatePowerup(index){
  activePowerup = {type: earnedPowerups[index], index};
  showMessage(`Select target for ${activePowerup.type==='cluster'?'Cluster Bomb':'Sonar Pulse'}`);
}

function useClusterBomb(row,col){
  const targets=[];
  for(let dr=-1;dr<=1;dr++){
    for(let dc=-1;dc<=1;dc++){
      const r=row+dr,c=col+dc;
      if(r>=0&&r<BOARD_SIZE&&c>=0&&c<BOARD_SIZE){
        if(!enemyBoard[r][c].hit && !enemyBoard[r][c].miss){
          targets.push({r,c});
        }
      }
    }
  }
  let i=0;
  function next(){
    if(i<targets.length){
      const {r,c}=targets[i++];
      animateMissile(playerBoard[BOARD_SIZE-1][0].cellElem, enemyBoard[r][c].cellElem, ()=>{
        fireAtCell(enemyBoard, aiBoard, aiShips, r, c, true);
        setTimeout(next,200);
      });
    } else {
      if(areAllShipsSunk(aiBoard)){ endGame(true); } else { setTurnIndicator("AI's Turn"); setTimeout(aiAttackPlayer,500); }
    }
  }
  next();
}

function useSonarPulse(row,col){
  const cells=[];
  for(let dr=-1;dr<=1;dr++){
    for(let dc=-1;dc<=1;dc++){
      const r=row+dr,c=col+dc;
      if(r>=0&&r<BOARD_SIZE&&c>=0&&c<BOARD_SIZE){
        cells.push({r,c});
        const el=enemyBoard[r][c].cellElem;
        const mk=document.createElement('div');
        mk.className='scan-mark';
        mk.textContent=enemyBoard[r][c].hasShip?'🚢':'❌';
        el.appendChild(mk);
        mk.addEventListener('animationend',()=>mk.remove());
      }
    }
  }
  setTimeout(()=>{ if(areAllShipsSunk(aiBoard)){ endGame(true); } else { setTurnIndicator("AI's Turn"); setTimeout(aiAttackPlayer,500); } }, 850);
}

// --- Example HUD and Log Functions ---
function updateHUD() {
  // You'll need to implement actual counting logic for your game state!
  // Example for illustration:
    const hits = countPlayerHits();
    const misses = countPlayerMisses();
    const statPlayer = document.getElementById('stat-player');
    const statEnemy = document.getElementById('stat-enemy');
    if(statPlayer) statPlayer.textContent = `Your Ships: ${playerShips.length}`;
    if(statEnemy) statEnemy.textContent = `Enemy Ships: ${countUnsunkShips(aiShips, enemyBoard)}`;
    const total = hits + misses;
    if(accuracyElem) accuracyElem.textContent = `Accuracy: ${total ? Math.round((hits/total)*100) : 0}%`;
    const acc = total ? Math.round((hits/total)*100) : 0;
    const statHits = document.getElementById('stat-hits');
    const statMisses = document.getElementById('stat-misses');
    const statAcc = document.getElementById('stat-accuracy');
    if(statHits) statHits.textContent = `Hits: ${hits}`;
    if(statMisses) statMisses.textContent = `Misses: ${misses}`;
    if(statAcc) statAcc.textContent = `Accuracy: ${acc}%`;
    if(turnCountElem) turnCountElem.textContent = `Turn ${turnNumber}`;
    if(alertStatusElem){
      const remain = playerShips.length;
      let status = remain >= 4 ? 'GREEN' : remain >= 2 ? 'YELLOW' : 'RED';
      alertStatusElem.textContent = `ALERT: ${status}`;
      alertStatusElem.className = status.toLowerCase();
    }
    if(readinessElem){
      const remain = playerShips.length;
      let r = remain === 5 ? 'OPTIMAL' : remain >= 3 ? 'ADEQUATE' : remain >= 1 ? 'CRITICAL' : 'DESTROYED';
      readinessElem.textContent = `Status: ${r}`;
    }
    const fleetBar = document.getElementById('fleet-bar-inner');
    const fleetPct = document.getElementById('fleet-percentage');
    if(fleetBar && fleetPct){
      const totalShips = SHIPS.length;
      const remain = playerShips.length;
      const pct = Math.round((remain/totalShips)*100);
      fleetBar.style.width = pct + '%';
      fleetBar.classList.remove('damaged','critical');
      fleetPct.classList.remove('green','yellow','red');
      fleetPct.textContent = `Fleet Integrity: ${pct}%`;
      if(pct <= 30){
        fleetBar.classList.add('critical');
        fleetPct.classList.add('red');
      } else if(pct <= 60){
        fleetBar.classList.add('damaged');
        fleetPct.classList.add('yellow');
      } else {
        fleetPct.classList.add('green');
      }
    }
    const pwrap = document.getElementById('powerups');
    if(pwrap){
      pwrap.innerHTML = '';
      earnedPowerups.forEach((p,idx)=>{
        const span=document.createElement('span');
        span.className='power-icon';
        span.textContent = p==='cluster'?'💣':'📡';
        span.title = p==='cluster'?'Cluster Bomb':'Sonar Pulse';
        span.onclick=()=>activatePowerup(idx);
        pwrap.appendChild(span);
      });
    }
}

function setHUDTurn(turn) {
  document.getElementById('hud-turn').textContent = turn;
}

function setHUDLastMove(msg) {
  document.getElementById('hud-last-move').textContent = msg;
}

function logAction(msg, type="log-player") {
  const log = document.getElementById('action-log');
  const li = document.createElement('li');
  li.className = type;
  li.textContent = msg;
  log.appendChild(li);
  if (log.children.length > 20) log.removeChild(log.firstChild); // Keep log short
}

  </script>
</body>
</html>


<!DOCTYPE html>
<html lang="en">
<head>
  <!-- =========================
      HEAD: Meta & Page Settings
      ========================= -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
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
      color: #3fffd7;
      text-shadow: 0 3px 22px #21a0a8cc, 0 1px 0 #0114;
      text-align: center;
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
      background: rgba(26, 42, 59, 0.55);
      border-radius: 16px;
      border: 1.5px solid #66e0ffaa;
      box-shadow:
        0 4px 18px #2ad8ff33,
        0 0 6px #113c5a66 inset,
        0 0 40px #1fffd533 inset;
      width: 300px;
      height: 300px;
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
      font-size: 1.2rem;
      min-width: 0;
      min-height: 0;
      transition: background 0.25s, transform 0.2s;
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 5px #0005;
    }
    /* === BOARD LABELS === */
    .cell.label-cell { background: #112233; font-weight: bold; color: #3fffd7; }
    .cell.corner-cell { background: #19283e; }
    /* === SHIP PLACEMENT & STATUS === */
    .ship-preview { background-color: #2efb89cc !important; }
    .bad-placement { background-color: #ff6961cc !important; }
    .ship { background-color: #49a0ff; }
    .fade-in { animation: fadein 0.4s; }
    @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
    .fading-out { animation: fadeout 1.2s forwards; }
    @keyframes fadeout { from { opacity: 1; } to { opacity: 0.15; background: #d80; }}
    .hit { background: #ff6464; }
    .miss { background: #113a44; }
    .salvo-selected { outline: 2px solid #fff9b4; background: #bbb820 !important; }
    .cell:not(.label-cell):hover {
      background-color: rgba(85, 120, 170, 0.35);
      transform: scale(1.05);
    }
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
    /* === RESPONSIVE (STACK GRIDS ON MOBILE) === */
    @media screen and (max-width: 768px) and (orientation: portrait) {
      .grids-wrapper { flex-direction: column; align-items: center; }
      .grid { width: 97vw; height: 97vw; max-width: 360px; max-height: 360px; }
    }
    /* === CONTROL PANEL BUTTONS === */
    .control-panel {
      background: rgba(25, 40, 62, 0.8);
      border-top: 2px solid #66e0ff;
      margin-top: 30px;
      box-shadow: 0 -4px 14px #23e0ff33;
      padding: 20px;
      text-align: center;
      border-radius: 12px;
    }
    .control-panel button {
      background: linear-gradient(135deg, #1de9ff, #00bcd4);
      border: none;
      padding: 12px 40px;
      margin: 0 12px;
      color: #042630;
      font-weight: 600;
      border-radius: 10px;
      box-shadow: 0 3px 10px #00fff566;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background 0.15s, transform 0.15s;
    }
    .control-panel button:hover {
      background: linear-gradient(135deg, #00d4ff, #0099c3);
      transform: translateY(-2px);
    }
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
    .modal-btn { margin: 10px; padding: 12px 32px; border-radius: 8px; background: #00ffff; color: #132437; border: none; font-weight: 700; font-size: 1.1rem;}
    .modal-btn:hover { background: #00bbbb; }
    /* Enhanced endgame styles */
    #endgame-icon { font-size: 3rem; margin-bottom: 8px; }
    #endgame-stats { margin: 10px 0; font-size: 1.1rem; text-align: center; }
    #endgame-modal.victory .modal-box { background: #214d36; }
    #endgame-modal.defeat .modal-box { background: #4b2b2b; }
    /* === MESSAGE AREAS === */
    #messages { min-height: 1.2em; text-align: center; font-size: 1.1rem; margin: 12px auto 0 auto; }
    #placement-hint { text-align: center; font-size: 1.15rem; color: #3fffd7; min-height: 1.2em; }
    #placement-controls { display: flex; gap: 18px; justify-content: center; align-items: center; margin: 16px 0 10px 0;}
    #placement-controls select, #placement-controls button { font-size: 1rem; }
    #confirm-salvo { display: none; }
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
}
#hud-panel .hud-stats {
  line-height: 1.1;  
  display: flex;
  flex-direction: row;
  gap: 10px;              /* More space between stats */
  margin-top: 3px;
  margin-bottom: 2px;
  font-size: 1rem;     /* Slightly larger, adjust as you like */
  color: #bbfff6;
  justify-content: flex-start;
  align-items: baseline;
  white-space: normal;
  flex-wrap: wrap;  /* NEW: allow wrapping if needed */
}

#hud-panel .hud-stats span {
  display: inline-block;
  white-space: nowrap;
  min-width: 0;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.hud-turn-indicator {
  font-size: 1.08rem;
  font-weight: bold;
  color: #fffcae;
  letter-spacing: 0.8px;
  text-shadow: 0 1.5px 7px #ffe877bb;
  margin-bottom: 2px;
}

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
}
#audio-controls input[type=range] {
  width: 60px;
  margin-left: 4px;
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
}

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
  color: #20fff6;
  font-size: 1.16rem;
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
  transform: translateY(-2px);
}


/* Responsive: Stacks on small screens */
@media (max-width: 900px) {
  #game-container { padding: 12px 0; }
  .hud-log-row, .grids-row, .control-panel { flex-direction: column; align-items: center; }
  .grid-label, .board-grid { width: 98vw !important; margin: 0 !important;}
}

@media (max-width: 900px) {
  #game-container { max-width: 99vw; padding: 2vw; }
  .grid { width: 97vw; height: 97vw; max-width: 340px; max-height: 340px; }
}

  #starfield {
    position: fixed; left:0; top:0; width:100vw; height:100vh;
    z-index: -1;
pointer-events: none;
    background: linear-gradient(160deg, #233d6d 40%, #110b26 100%);
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
    transform: scale(1.048);
    outline: none;
    z-index: 1;
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


  </style>
</head>
<body>
  <audio id="bg-music" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" preload="auto" loop></audio>
  <audio id="hit-sound" src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" preload="auto"></audio>

  <div id="intro-screen">
    <h1>Battleship Ultra</h1>
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
    <div class="halo-subtitle">Select Game Mode</div>
    <div class="halo-menu-options">
      <button class="halo-btn" data-mode="classic" autofocus aria-label="Classic mode">Classic</button>
      <button class="halo-btn" data-mode="salvo" aria-label="Salvo mode">Salvo</button>
    </div>
    <div class="halo-subtitle" style="margin-top:18px;">AI Difficulty</div>
    <div class="halo-menu-options">
      <button class="halo-btn" data-diff="easy" aria-label="Easy difficulty">Easy</button>
      <button class="halo-btn" data-diff="medium" aria-label="Medium difficulty">Medium</button>
      <button class="halo-btn" data-diff="hard" aria-label="Hard difficulty">Hard</button>
      <button class="halo-btn" data-diff="advanced" aria-label="Advanced difficulty">Advanced</button>
      <button class="halo-btn" data-diff="god" aria-label="God difficulty">God</button>
    </div>
    <div class="halo-subtitle" style="margin-top:18px;">Theme</div>
    <div class="halo-menu-options">
      <button class="halo-btn" data-theme="navy" aria-label="Navy theme">Navy</button>
      <button class="halo-btn" data-theme="scifi" aria-label="Sci-Fi theme">Sci-Fi</button>
      <button class="halo-btn" data-theme="pirate" aria-label="Pirate theme">Pirate</button>
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
<h1>Battleship Ultra</h1>
  <h3 id="turn-indicator"></h3>
  <div id="messages" role="status" aria-live="polite"></div>
    <!-- === SHIP PLACEMENT CONTROLS === -->
    <div id="main-controls" style="display: none; flex-direction: column; align-items: center; width: 100%;">
      <div id="placement-controls">
        <label>Ship:
          <select id="ship-select"></select>
        </label>
        <button id="toggle-orientation" aria-label="Toggle ship orientation">Horizontal</button>
        <span id="placement-hint"></span>
      </div>
    </div>
<!-- ======================
     HUD PANEL + ACTION LOG
     ====================== -->
<div class="hud-log-row">
  <div id="hud-panel">
    <div id="hud-turn" class="hud-turn-indicator"></div>
    <div class="hud-stats">
      <span id="hud-player-ships">🚢 5</span>
      <span id="hud-enemy-ships">🛳 5</span>
      <span id="hud-hits">🔥 0</span>
      <span id="hud-misses">💦 0</span>
    </div>
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
    <div class="grid-label">YOUR FLEET</div>
    <div id="player-board" class="board-grid" role="grid" aria-label="Your fleet"></div>
  </div>
  <div>
    <div class="grid-label">OPPONENT FLEET</div>
    <div id="enemy-board" class="board-grid" role="grid" aria-label="Opponent fleet"></div>
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
const theme = window.selectedTheme || 'navy';
applyTheme(theme);
  const BOARD_SIZE = 10;
  const SHIPS = [
    { name: "Carrier", size: 5 },
    { name: "Battleship", size: 4 },
    { name: "Cruiser", size: 3 },
    { name: "Submarine", size: 3 },
    { name: "Destroyer", size: 2 },
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
const bgMusic = document.getElementById('bg-music');
const hitSound = document.getElementById('hit-sound');
const muteBtn = document.getElementById('toggle-mute');
const musicSlider = document.getElementById('music-volume');
const sfxSlider = document.getElementById('sfx-volume');
let audioMuted = false;
const confirmSalvoBtn = document.getElementById('confirm-salvo');
// Fire all selected salvo shots when the confirm button is clicked
confirmSalvoBtn.onclick = () => {
  confirmSalvoBtn.style.display = 'none';
  applyPlayerSalvoShots();
};

// --- Audio Control Handlers ---
function updateMuteIcon() {
  muteBtn.textContent = audioMuted ? '🔈' : '🔊';
}
muteBtn.onclick = () => {
  audioMuted = !audioMuted;
  if(bgMusic) bgMusic.muted = audioMuted;
  if(hitSound) hitSound.muted = audioMuted;
  updateMuteIcon();
};
if(musicSlider){
  const applyMusicVolume = () => { if(bgMusic) bgMusic.volume = parseFloat(musicSlider.value); };
  applyMusicVolume();
  musicSlider.addEventListener('input', applyMusicVolume);
}
if(sfxSlider){
  const applySfxVolume = () => { if(hitSound) hitSound.volume = parseFloat(sfxSlider.value); };
  applySfxVolume();
  sfxSlider.addEventListener('input', applySfxVolume);
}
updateMuteIcon();

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
    if(hitSound){ hitSound.currentTime = 0; hitSound.play().catch(()=>{}); }
  }
  // Fade out a sunk ship’s cells
  function fadeOutShip(cellElem) {
    cellElem.classList.add('fading-out');
    setTimeout(() => cellElem.classList.remove('fading-out'), 1200);
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
          cell.addEventListener('click', handleTargetClick);
          cell.addEventListener('keydown', e => {
            if(e.key==='Enter' || e.key===' ') { e.preventDefault(); handleTargetClick(e); }
          });
        }
      }
      boardDiv.appendChild(cell);
    }
  }
  if(!isPlayer && radar) boardDiv.appendChild(radar);
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
      opt.textContent = `${ship.name} (${ship.size})`;
      shipSelect.appendChild(opt);
    });
    shipSelect.disabled = shipsToPlace.length === 0;
    shipSelect.onchange = (e) => {
      currentShipIndex = parseInt(e.target.value);
      showPlacementHint();
    };
  document.getElementById('toggle-orientation').onclick = () => {
    placementOrientation = (placementOrientation === 'horizontal') ? 'vertical' : 'horizontal';
    document.getElementById('toggle-orientation').textContent =
      placementOrientation.charAt(0).toUpperCase() + placementOrientation.slice(1);
    showPlacementHint();
  };
  showPlacementHint();
}

  // Updates placement hint text
  function showPlacementHint() {
    if (shipsToPlace.length > 0) {
      const hint = `Placing: ${shipsToPlace[currentShipIndex].name} (${shipsToPlace[currentShipIndex].size}) - ${placementOrientation}`;
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
      showMessage("Invalid placement. Try again.");
      return;
    }
    let newShip = { name: ship.name, positions: [] };
    for (let i = 0; i < ship.size; i++) {
      let r = row + (placementOrientation === 'vertical' ? i : 0);
      let c = col + (placementOrientation === 'horizontal' ? i : 0);
      playerBoard[r][c].hasShip = true;
      playerBoard[r][c].cellElem.classList.add('ship');
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
      showMessage('All ships placed! Begin attacks.');
      setTurnIndicator("Your Turn");
      if (gameMode === "salvo") {
        pendingPlayerShots = [];
        showMessage(`Your turn! Select ${countUnsunkShips(playerShips, playerBoard)} shots.`);
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

  /* ==============================
     GAME STATE CHECKS
     ============================== */
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

function countPlayerHits() {
  // Returns total number of hits the player has made on AI ships
  let hits = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (enemyBoard[r][c] && enemyBoard[r][c].hit) hits++;
    }
  }
  return hits;
}

function countPlayerMisses() {
  // Returns total number of misses the player has made on AI board
  let misses = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (enemyBoard[r][c] && enemyBoard[r][c].miss) misses++;
    }
  }
  return misses;
}

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
      if (isShipSunk(enemyShips, row, col, enemyBoard)) {
        let name = markSunkShip(enemyShips, enemyBoard, boardToUpdate, row, col);
        showMessage((isPlayer ? "You sank" : "AI sank") + ` the ${isPlayer ? "AI's" : "your"} ${name}!`);
      } else {
        showMessage(isPlayer ? "You hit an AI ship!" : "AI hit your ship!");
        logAction(`${isPlayer ? "You" : "AI"} sunk a ship!`, "log-sink");
      }
    } else {
      boardToUpdate[row][col].cellElem.classList.add('miss');
      setCellIcon(boardToUpdate[row][col].cellElem, '⚪');
      boardToUpdate[row][col].miss = true;
      enemyBoard[row][col].miss = true;
      showSplash(boardToUpdate[row][col].cellElem);
      showMessage(isPlayer ? "You missed!" : "AI missed!");
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

    if (gameMode === 'salvo') {
      const shotsAllowed = countUnsunkShips(playerShips, playerBoard);

      // Toggle shot selection
      if (pendingPlayerShots.some(pos => pos.r === row && pos.c === col)) {
        pendingPlayerShots = pendingPlayerShots.filter(pos => !(pos.r === row && pos.c === col));
        e.target.classList.remove('salvo-selected');
      } else {
        if (pendingPlayerShots.length >= shotsAllowed) {
          showMessage(`You can only select ${shotsAllowed} shot${shotsAllowed > 1 ? 's' : ''} per turn.`);
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
        showMessage(`Select ${shotsAllowed - pendingPlayerShots.length} more shot${shotsAllowed - pendingPlayerShots.length > 1 ? 's' : ''}.`);
      } else if (pendingPlayerShots.length === shotsAllowed) {
        showMessage(`Click "Confirm Shots" to fire!`);
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
    let prob = 0;
    switch (aiDifficulty) {
      case "easy": prob = 0; break;
      case "medium": prob = 0.3; break;
      case "hard": prob = 0.5; break;
      case "advanced": prob = 0.8; break;
      case "god": prob = 0.9; break;
    }
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
      showMessage("Your turn! Take a shot!");
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
        let prob = 0;
        switch (aiDifficulty) {
          case "easy": prob = 0; break;
          case "medium": prob = 0.3; break;
          case "hard": prob = 0.5; break;
          case "advanced": prob = 0.8; break;
          case "god": prob = 0.9; break;
        }
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
        showMessage(`Your turn! Select ${countUnsunkShips(playerShips, playerBoard)} shot(s).`);
      }
    }
    aiDoNextShot();
  }

  /* ==============================
     UI/UTILITY FUNCTIONS
     ============================== */
  // Show a message to the player
  function showMessage(msg) {
    document.getElementById('messages').textContent = msg;
  }
  function randomInt(max) { return Math.floor(Math.random() * max); }

  // Place AI ships randomly (never overlap)
  function placeAIShips() {
    aiBoard = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      aiBoard[r] = [];
      for (let c = 0; c < BOARD_SIZE; c++) {
        aiBoard[r][c] = { hasShip: false, hit: false, miss: false };
      }
    }
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
    document.getElementById("endgame-stats").textContent = `Hits: ${hits} • Misses: ${misses} • Accuracy: ${acc}%`;
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
  // Set up boards
  playerBoard = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    playerBoard[r] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      playerBoard[r][c] = { hasShip: false, hit: false, miss: false, cellElem: null };
    }
  }
  enemyBoard = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    enemyBoard[r] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      enemyBoard[r][c] = { hasShip: false, hit: false, miss: false, cellElem: null };
    }
  }
  confirmSalvoBtn.style.display = 'none';

  createEmbeddedLabeledBoard('player-board', true);
  createEmbeddedLabeledBoard('enemy-board', false);
  document.getElementById('main-controls').style.display = 'flex';
  document.getElementById('placement-controls').style.display = 'flex';
  setupPlacementControls();
  placeAIShips();
  showMessage('Place your ships and start the game!');
  setTurnIndicator('');
  hideEndgameModal();
  document.querySelectorAll('.salvo-selected').forEach(cell => cell.classList.remove('salvo-selected'));
  logAction("Game restarted. Place your ships!", "log-player");
  updateHUD();
}
  function setTurnIndicator(msg) {
    document.getElementById('turn-indicator').textContent = msg || '';
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
  // Mode buttons
  document.querySelectorAll('.halo-btn[data-mode]').forEach((btn, idx, arr) => {
    btn.onclick = () => {
      arr.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMode = btn.getAttribute('data-mode');
    };
    // Default: classic active
    if(idx===0) btn.classList.add('active');
  });
  // Diff buttons
  document.querySelectorAll('.halo-btn[data-diff]').forEach((btn, idx, arr) => {
    btn.onclick = () => {
      arr.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDiff = btn.getAttribute('data-diff');
    };
    // Default: easy active
    if(idx===0) btn.classList.add('active');
  });
  // Theme buttons
  document.querySelectorAll('.halo-btn[data-theme]').forEach((btn, idx, arr) => {
    btn.onclick = () => {
      arr.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTheme = btn.getAttribute('data-theme');
      applyTheme(selectedTheme);
    };
    if(idx===0) btn.classList.add('active');
  });

  function applyTheme(theme) {
    document.body.classList.remove('theme-navy','theme-scifi','theme-pirate');
    document.body.classList.add('theme-' + theme);
  }

  // Keyboard nav
  const allBtns = Array.from(document.querySelectorAll('.halo-btn'));
  let btnIndex = 0;
  function updateBtnFocus(idx) {
    allBtns.forEach((b,i)=>b.classList.toggle('active',i===idx));
    allBtns[idx].focus();
  }
  document.addEventListener('keydown', e => {
    if(document.getElementById('main-menu').style.display === 'none') return;
    if(e.key==="ArrowDown"||e.key==="s") { btnIndex=(btnIndex+1)%allBtns.length; updateBtnFocus(btnIndex);}
    if(e.key==="ArrowUp"||e.key==="w") { btnIndex=(btnIndex-1+allBtns.length)%allBtns.length; updateBtnFocus(btnIndex);}
    if(e.key==="Enter"||e.key===" ") { allBtns[btnIndex].click(); }
  });

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

// --- Example HUD and Log Functions ---
function updateHUD() {
  // You'll need to implement actual counting logic for your game state!
  // Example for illustration:
    document.getElementById("hud-player-ships").textContent = `🚢 ${playerShips.length}`;
    document.getElementById("hud-enemy-ships").textContent = `🛳 ${aiShips.length}`;
    document.getElementById("hud-hits").textContent = `🔥 ${countPlayerHits()}`;
    document.getElementById("hud-misses").textContent = `💦 ${countPlayerMisses()}`;
    const pwrap = document.getElementById('powerups');
    if(pwrap){
      pwrap.innerHTML = '';
      const icons = Math.floor(countPlayerHits()/3);
      for(let i=0;i<icons;i++){
        const span=document.createElement('span');
        span.className='power-icon';
        span.textContent='💡';
        pwrap.appendChild(span);
      }
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


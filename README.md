# FNF: Hello John Doe - Web Port (menu + "John Doe")

Original mod by data, staticfyre, infry (Apache-2.0, Psych Engine 0.7.3 based):
https://github.com/FixedData/fnf-hjd-public  -- keep this credit on your page.

## Setup (GitHub Pages)
1. Unzip this folder on your PC.
2. Open https://github.com/CarterplaysNEW/jd-port -> **Add file -> Upload files**.
3. Drag in `index.html`, `game.js`, `README.md` AND the whole `assets` folder (drag the folder itself). Commit.
4. Repo **Settings -> Pages -> Deploy from a branch -> main / (root) -> Save**.
5. After ~1 minute: https://carterplaysnew.github.io/jd-port/

Test locally: run `python3 -m http.server` in this folder, open http://localhost:8000

## Controls
Arrow keys or WASD to play, Up/Down + Enter in the menu, Esc to leave the song.

## Where each asset came from (repo: FixedData/fnf-hjd-public)
| In your repo (assets/...)            | Original path                                              |
|--------------------------------------|------------------------------------------------------------|
| menu/fire.png/.xml, logo.png/.xml    | assets/shared/images/menu/rolbox/sm/                       |
| music/freakyMenu.ogg                 | assets/shared/music/                                       |
| sounds/click.ogg, bass.ogg           | assets/shared/sounds/                                      |
| characters/jd, jda, die .json        | example_mods/johndoe/characters/                           |
| characters/rbf.json                  | example_mods/characters/                                   |
| songs/johndoe/* (4 files)            | example_mods/johndoe/songs/johndoe/                        |
| images/bgs/sky, floor, home .png     | example_mods/johndoe/images/bgs/                           |
| images/noteSkins/NOTE_assets.*       | example_mods/images/noteSkins/                             |
| images/characters/johndoe, jda, diedoe .png/.xml | example_mods/johndoe/images/characters/        |
| images/characters/boyfriend/rbf.*    | example_mods/images/characters/boyfriend/                  |

## Added in v2
Elevator song select (arrow keys / WASD / mouse, Enter or the Play button; Esc goes back), intro video (Enter skips it),
green code-wall effect, the sky invert-glitch, hold notes drawn as line + end cap (rotated Sparrow frames now handled),
best score saved in your browser.

| Extra assets (assets/...)          | Original path                                                        |
|------------------------------------|----------------------------------------------------------------------|
| menu/elev/* (elevator, doors, tv, play, diffbutton, 360, grad) | assets/shared/images/menu/rolbox/song/    |
| music/free/t0-t3.ogg               | assets/shared/music/free/ (4 clips; list.json holds the names)       |
| videos/oh.mp4                      | example_mods/johndoe/videos/                                         |

## Not ported yet
Other songs (devilish, 1, bloxwatch are shown locked), title screen, members/settings, game over screen,
Roblox HUD art, note-key labels, mobile controls.

## Credits
Mod: data, staticfyre, infry. Engine base: Psych Engine 0.7.3 (Shadow Mario & contributors).
Music clips: "Lobby Time", "Airport Lounge", "Local Forecast" by Kevin MacLeod (incompetech.com), CC BY 4.0;
"Elevator Music" by Julian Avila.

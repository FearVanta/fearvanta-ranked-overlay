===============================================================
  FEARVANTA RANKED OVERLAY — SETUP GUIDE
  Made by FearVanta
===============================================================

REQUIREMENTS
------------
Before you start, make sure you have:
  - OBS Studio (34.0.2 or any recent version)
  - Node.js installed (https://nodejs.org — download the LTS version)

If you're not sure if Node.js is installed, open a terminal and type:
  node --version
If it shows a version number (e.g. v20.0.0), you're good to go.


FOLDER STRUCTURE
----------------
Make sure your overlay folder looks like this:

  FearVanta-Ranked-Overlay/
    install.bat
    README.txt
    overlay/
      fv_overlay.html
      fv_logic.js
      fv_style.css
      fv_dock.html
      server.js
      start_overlay.bat
      start_overlay_startup.bat
      config/
        overlay.json
      assets/
        icons/
          bronze.webm
          silver.webm
          gold.webm
          platinum.webm
          diamond.webm
          crimson.webm
          iridescent.webm
          top250.webm
          sr.png


FIRST TIME SETUP
----------------
1. Place the FearVanta-Ranked-Overlay folder wherever you like
   (Desktop is fine)

2. Right-click install.bat and click "Run as administrator"
   This will automatically:
   - Install Node.js if you don't have it
   - Set up the server to auto-start when Windows boots
   - Start the server immediately

3. Follow the OBS/Meld setup instructions shown at the end


SETTING UP OBS STUDIO
-------------------------------------
1. Add the overlay as a Browser Source:
   - In Sources, click + and choose Browser Source
   - Name it "FearVanta Overlay"
   - Make sure "Local file" is UNCHECKED
   - Set URL to: http://localhost:8080/fv_overlay.html
   - Set Width and Height to fit your layout
   - Click OK

2. Add the control dock (OBS Studio):
   - Go to View -> Docks -> Custom Browser Docks
   - Click + to add a new dock
   - Name: FearVanta
   - URL: http://localhost:8080/fv_dock.html
   - Click Apply
   - Drag the dock anywhere in your OBS layout

   Add the control dock (Meld Studio):
   - Go to your panels/docks settings
   - Add a new Browser Panel
   - URL: http://localhost:8080/fv_dock.html


USING THE OVERLAY DOCK
-----------------------
The dock lets you control your overlay without touching any files.

  Activision Username  Your displayed name on the overlay
  SR                   Your current Skill Rating (0 - 99999)
  Top 250 Position     Your leaderboard placement (unlocks at 10,000 SR)
  Layout               Switch between Horizontal and Vertical overlay
  Background Template  Choose your overlay style
  Background Opacity   Adjust background transparency (0.0 - 1.0)

After changing any settings, click UPDATE OVERLAY to apply instantly.


RANK TIERS & SR RANGES
-----------------------
  Bronze I       0     - 299
  Bronze II      300   - 599
  Bronze III     600   - 899
  Silver I       900   - 1,299
  Silver II      1,300 - 1,699
  Silver III     1,700 - 2,099
  Gold I         2,100 - 2,599
  Gold II        2,600 - 3,099
  Gold III       3,100 - 3,599
  Platinum I     3,600 - 4,199
  Platinum II    4,200 - 4,799
  Platinum III   4,800 - 5,399
  Diamond I      5,400 - 6,099
  Diamond II     6,100 - 6,799
  Diamond III    6,800 - 7,499
  Crimson I      7,500 - 8,299
  Crimson II     8,300 - 9,099
  Crimson III    9,100 - 9,999
  Iridescent     10,000+ (not in Top 250)
  Top 250        10,000+ AND placed on leaderboard (#1 - #250)


TOP 250 SYSTEM
--------------
The overlay automatically handles Iridescent vs Top 250:

  - SR below 10,000     Normal rank badges (Bronze to Crimson)
  - SR 10,000+          Iridescent badge (Top 250 Position locked)
  - SR 10,000+ and      Top 250 badge + your placement shown
    Position 1-250      e.g. "Top 250 #47"

  To use:
  1. Set your SR to 10,000 or above
  2. The Top 250 Position field will unlock automatically
  3. Enter your leaderboard placement (1-250)
  4. Hit Update Overlay -- badge switches to Top 250 instantly
  5. If you drop off the leaderboard, set position back to 0


LAYOUT MODES
------------
  Horizontal   Classic side-by-side layout (icon, rank, SR, username)
  Vertical     Stacked layout (icon on top, rank, SR, divider, username)

  Switch anytime from the dock -- no restart needed.


BACKGROUND TEMPLATES
--------------------
  Classic Dark     Clean black background
  Dark Glass       Frosted glass effect
  Neon Grid        Cyan grid on dark
  Cyber Wave       Blue gradient
  Matrix           Green on black
  Aurora           Purple/blue gradient
  Crimson Flame    Red gradient
  Frozen Ice       Icy blue gradient
  Marble White     Light/white background


AUTO-START ON WINDOWS BOOT
---------------------------
The installer sets this up automatically. The server runs silently
in the background every time your PC starts -- no terminal window,
no manual steps needed before streaming.

To stop the server: Open Task Manager, find node.exe, End Task
To restart manually: Double-click start_overlay.bat in the overlay folder


TROUBLESHOOTING
---------------
Overlay shows blank / not loading:
  -> Make sure the server is running (run start_overlay.bat)
  -> Check the URL in OBS is: http://localhost:8080/fv_overlay.html
  -> Right-click the Browser Source and click Refresh

Dock says "Cannot reach overlay.json":
  -> The server is not running -- double-click start_overlay.bat

Icons not showing / black box:
  -> Make sure all .webm files are in overlay/assets/icons/
  -> File names must be exact and lowercase:
     bronze.webm, silver.webm, gold.webm, platinum.webm,
     diamond.webm, crimson.webm, iridescent.webm, top250.webm

Update button says "Could not save":
  -> The server is not running -- double-click start_overlay.bat
  -> Make sure server.js is in the overlay folder

Port 8080 already in use error:
  -> Open Task Manager, find node.exe or python.exe and end it
  -> Then run start_overlay.bat again

Top 250 Position field is greyed out:
  -> This is normal -- it only unlocks when SR is 10,000 or above


===============================================================
  Need help? Contact FearVanta
===============================================================

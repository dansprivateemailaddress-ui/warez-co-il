'use strict';
// Verified Amazon US listings. Keep prices, reviews and availability on Amazon.
const products = [
  {name:'Anker 332 USB-C Hub (5-in-1)', asin:'B0BQLLB61B', image:'https://m.media-amazon.com/images/I/615HRY2dnML._AC_SX569_.jpg', alt:'Anker 332 5-in-1 USB-C hub in dark gray with attached USB-C cable, HDMI and USB ports', category:'CONNECT YOUR DESK', use:'For a laptop that needs HDMI and extra USB ports for a display, keyboard, or other everyday accessories.', check:'Check that your laptop’s USB-C port supports video output. A USB-C connector alone does not guarantee HDMI compatibility.', detail:'Start with the devices you already own: monitor, keyboard, mouse, and charging cable. This compact hub makes sense when the laptop has fewer ports than your daily setup needs. Confirm the supported display resolution and refresh rate, and whether you need a separate USB-C power supply, before ordering.', source:'https://www.anker.com/products/a8355'},
  {name:'Logitech Pebble Keys 2 K380s', asin:'B0BT4DP7SC', image:'https://m.media-amazon.com/images/I/61whrA5i6YL._AC_SX679_.jpg', alt:'Logitech Pebble Keys 2 K380s compact Bluetooth keyboard in Tonal Graphite with round keys', category:'MAKE ROOM TO WORK', use:'A compact Bluetooth keyboard for writing, admin, and moving between a laptop and another device.', check:'Choose the right keyboard layout. This is a compact design without a separate number pad; check the printed key legends match your preferred language.', detail:'A separate keyboard can make a small desk more flexible, particularly if you put your laptop on a stand or use a larger screen. The K380s suits a portable setup and switching between devices. Check Bluetooth and operating-system compatibility, and choose a full-size alternative if most of your day is spent entering numbers.', source:'https://www.logi.com/en-us/shop/p/pebble-keys-2.920-011775'},
  {name:'Samsung T7 Shield Portable SSD · 1TB', asin:'B09VLK9W3S', image:'https://m.media-amazon.com/images/I/61CKrZWOcrL._AC_SX679_.jpg', alt:'Samsung T7 Shield 1TB portable SSD in black with ribbed casing and USB-C port', category:'TAKE YOUR FILES WITH YOU', use:'Portable storage for design exports, project handoffs, and an extra local copy of important work.', check:'Keep another independent backup. Transfer speed depends on your computer, USB port, and cable; one external drive is not a complete backup plan.', detail:'An external SSD is useful when client assets and exported files need to move between computers. The black 1TB T7 Shield is a portable option for that workflow. Check usable capacity, file-system compatibility, and warranty coverage for your destination. For important files, pair it with a second copy elsewhere and periodically test that you can restore them.', source:'https://www.samsung.com/us/computing/memory-storage/portable-solid-state-drives/portable-ssd-t7-shield-usb-3-2-1tb-black-mu-pe1t0s-am/'}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=p=>`https://www.amazon.com/dp/${p.asin}?tag=warezcoil-20`;
const button=p=>`<a class="gear-link" href="${link(p)}" target="_blank" rel="sponsored noopener noreferrer" aria-label="View ${esc(p.name)} on Amazon (affiliate link)"><span data-t="gearAmazon">View on Amazon ↗</span></a>`;
const photo=p=>`<a class="gear-photo-link" href="${link(p)}" target="_blank" rel="sponsored noopener noreferrer"><img class="gear-photo" src="${esc(p.image)}" alt="${esc(p.alt)}" width="600" height="400" loading="lazy" decoding="async"></a>`;
// Owner requested no recurring affiliate disclosure blocks on 18 October 2026.
const disclosure='';
const guidePath='/guides/small-business-desk-essentials';
const title='Three desk essentials for a small-business laptop';
const description='A USB-C hub, compact keyboard, and portable SSD: practical options for freelancers, with compatibility checks before you buy.';
const home=`<section class="gear-section wrap" id="desk-essentials" aria-labelledby="gear-title"><div class="section-top"><div><div class="eyebrow" data-t="gearLabel">BEYOND THE SOFTWARE</div><h2 id="gear-title" data-t="gearTitle">A small upgrade to your everyday.</h2></div><a class="gear-guide" href="${guidePath}" data-t="gearGuide">Read the buying guide ↗</a></div><p class="gear-intro" data-t="gearIntro">Useful software needs a practical setup. Three considered picks for connecting your desk, getting work done, and keeping files close.</p>${disclosure}<div class="gear-grid">${products.map((p,i)=>`<article class="gear-card"><div class="gear-category">0${i+1} / ${p.category}</div>${photo(p)}<h3 lang="en" dir="ltr">${esc(p.name)}</h3><p lang="en" dir="ltr">${esc(p.use)}</p><p class="gear-check" lang="en" dir="ltr"><strong>Before you buy</strong><br>${esc(p.check)}</p>${button(p)}</article>`).join('')}</div><p class="gear-foot" data-t="gearFoot">These are editorial suggestions, not hands-on reviews. Links open Amazon.com (US). Current prices and availability are shown on Amazon.</p></section>`;
const body=`<p>${description}</p>${disclosure}<p>Start with a real friction in your working day. Buy only the item that solves it; you do not need all three to run a useful software stack.</p>${products.map((p,i)=>`<h2 id="${p.asin}">${i+1}. ${esc(p.name)}</h2>${photo(p)}<p>${esc(p.use)}</p><p>${esc(p.detail)}</p><p><strong>Before you buy:</strong> ${esc(p.check)}</p>${button(p)}`).join('')}<h2>Shopping on Amazon US</h2><p>All product links on this page open Amazon.com, the United States Amazon store. Current prices, availability, delivery options, and seller details are shown on Amazon.</p><p class="source-note">Selected for common freelancer and small-team workflows. Listings checked 17 October 2026. This guide is editorial decision support, not a hands-on test or a claim that these are the cheapest options. Product details and prices can change.</p><p><a href="/#stacks">Pair your desk with a starter software stack</a> · <a href="/#desk-essentials">Back to the desk essentials</a></p>`;
const collections=[
  {
    "id": "israeli-style-security",
    "title": "Israeli Style Security: layers for your home office",
    "description": "Three layers of home-office security: an indoor camera, portable lock box, and USB-C security key. Compare uses and limitations before buying.",
    "intro": "Think in layers: notice what is happening, limit casual access to valuables, and strengthen account sign-in. Start with the gap in your current setup.",
    "products": [
      {
        "name": "eufy Security Indoor Cam C120",
        "asin": "B08571VZ3Q",
        "image": "https://m.media-amazon.com/images/I/51M7meD33sL._AC_SL1500_.jpg",
        "alt": "White eufy Security Indoor Cam C120 with black camera face on a pedestal stand",
        "category": "SEE YOUR WORKSPACE",
        "use": "A plug-in indoor camera for checking a home-office entry or shared work area.",
        "check": "Check Wi-Fi, power, storage options, and privacy settings. An indoor camera is not a monitored alarm service.",
        "detail": "Place the camera where it gives a useful view of your own workspace without recording private activity unnecessarily. Review who can view footage and whether local or cloud recording fits your needs. Test notifications before relying on them, and keep the account and camera software updated."
      },
      {
        "name": "Master Lock 5900D Portable Safe",
        "asin": "B005K6JQXQ",
        "image": "https://m.media-amazon.com/images/I/717DzkodA8L._AC_SL1500_.jpg",
        "alt": "Open gray Master Lock 5900D portable combination safe with a cable and padded interior",
        "category": "LIMIT CASUAL ACCESS",
        "use": "A portable combination lock box for keeping small valuables together at a shared desk or while travelling.",
        "check": "Check the internal dimensions and cable attachment point. This is a portable lock box, not a burglary-rated or fire-rated safe.",
        "detail": "A compact lock box can make casual access less convenient when a phone, keys, or small accessories need a temporary home. Attach it only to a suitable fixed point and keep the combination private. For high-value equipment or critical documents, choose protection designed and rated for that level of risk."
      },
      {
        "name": "Yubico Security Key C NFC",
        "asin": "B0BVNRXFHT",
        "image": "https://m.media-amazon.com/images/I/41DkFsG8yEL._AC_SL1000_.jpg",
        "alt": "Black Yubico Security Key C NFC with a gold touch contact, USB-C connector, and keyring hole",
        "category": "PROTECT ACCOUNT ACCESS",
        "use": "A physical USB-C and NFC security key for supported account sign-in and multi-factor authentication.",
        "check": "Confirm that your services support this key. Register a backup sign-in method and store recovery codes separately.",
        "detail": "Start with your primary email and any supported business accounts. Enrol the key through each service’s own security settings, then test sign-in before changing your recovery options. The Security Key series has different capabilities from the YubiKey 5 series, so check the exact authentication methods your workflow needs."
      }
    ],
    "context": "Here, “Israeli Style Security” is an editorial theme for practical, layered protection. It does not mean these products are Israeli-made, officially endorsed, or certified to an Israeli security standard. Pair equipment with sensible access controls and an account-recovery plan.",
    "guidePath": "/guides/israeli-style-security",
    "label": "Israeli Style Security"
  },
  {
    "id": "video-calls-remote-work",
    "title": "Video Calls & Remote Work",
    "description": "A webcam, speakerphone, and adjustable laptop stand for a practical remote-work setup. Check privacy, audio routing, and desk fit.",
    "intro": "Give calls a dedicated setup: a camera at a useful angle, audio that suits the room, and a screen position you can adjust.",
    "products": [
      {
        "name": "Logitech Brio 100 Webcam · White",
        "asin": "B0BXGCRRLW",
        "image": "https://m.media-amazon.com/images/I/51YvZ8Sd4VL._AC_SL1500_.jpg",
        "alt": "White Logitech Brio 100 webcam with circular lens, privacy shutter, and monitor clip",
        "category": "FRAME THE CONVERSATION",
        "use": "A dedicated webcam for video meetings when your laptop camera angle is awkward.",
        "check": "Check USB connectivity, operating-system support, and how the clip fits your display. Close the privacy shutter between calls.",
        "detail": "A separate camera lets you position the lens independently of the laptop screen. Put it near eye level, light your face from the front, and test the view in your meeting app. A camera upgrade works best when framing and lighting are already sensible."
      },
      {
        "name": "Jabra Speak 510 · 2025 Edition",
        "asin": "B0FC3XV5DK",
        "image": "https://m.media-amazon.com/images/I/61rKycjd27L._AC_SL1400_.jpg",
        "alt": "Black Jabra Speak 510 round portable speakerphone with speaker grille and call controls",
        "category": "GIVE AUDIO ITS OWN SPACE",
        "use": "A portable USB and Bluetooth speakerphone for desk calls and small shared conversations.",
        "check": "Check the exact connection options and meeting-app compatibility. Use headphones when a call needs privacy.",
        "detail": "A speakerphone can be useful when several people need to hear a call without leaning over a laptop. Choose it as the input and output device in your meeting app, then make a short test call. Room noise, distance, and placement still affect what the other person hears."
      },
      {
        "name": "UGREEN Adjustable Laptop Stand",
        "asin": "B0G5XYTQ88",
        "image": "https://m.media-amazon.com/images/I/61iPF3xAixL._AC_SL1500_.jpg",
        "alt": "Silver UGREEN adjustable laptop stand with folding support arms and rectangular base, shown holding a laptop",
        "category": "SET A BETTER CAMERA ANGLE",
        "use": "An adjustable desktop stand for raising a laptop screen and freeing space underneath.",
        "check": "Confirm laptop size, weight limits, desk depth, and stability. An external keyboard and mouse may be useful at higher positions.",
        "detail": "A stand gives you more control over screen and camera height. Try several positions rather than assuming the highest setting is best. Leave ventilation openings clear and check the stand remains stable when you adjust the screen. The laptop shown in the product image is not included."
      }
    ],
    "context": "Build around the calls you actually make. A quiet room, clear lighting, and a test of your app’s microphone settings may solve a problem before any purchase. For confidential meetings, use an appropriate private space.",
    "guidePath": "/guides/video-calls-remote-work",
    "label": "Video Calls & Remote Work"
  },
  {
    "id": "power-travel",
    "title": "Power & Travel for a mobile workspace",
    "description": "A compact USB-C charger, 20,000mAh power bank, and tech organizer for working away from your desk. Check power compatibility before buying.",
    "intro": "Pack around the devices you actually carry. A charger, a reserve battery, and a place for cables can make a temporary workspace easier to set up.",
    "products": [
      {
        "name": "Anker Nano 65W USB-C Charger",
        "asin": "B08T5QN2TR",
        "image": "https://m.media-amazon.com/images/I/61PRvw0FyDL._AC_SL1500_.jpg",
        "alt": "Compact Anker Nano 65W USB-C wall charger with folding plug",
        "category": "LIGHTEN THE CHARGER LOAD",
        "use": "A compact USB-C wall charger for compatible laptops, tablets, and phones.",
        "check": "Confirm your device’s required wattage, charging protocol, cable rating, and plug type. Check what the package includes.",
        "detail": "Look at the charger that came with your laptop before choosing a replacement. Match the device’s power requirements rather than assuming every USB-C charger will run it comfortably. A small adapter is useful for a travel bag, but a high-demand laptop may need a different power supply."
      },
      {
        "name": "Anker 20,000mAh Power Bank · White",
        "asin": "B0CXDMYS8C",
        "image": "https://m.media-amazon.com/images/I/61xX+YJ1TpL._AC_SL1500_.jpg",
        "alt": "White Anker 20,000mAh portable power bank with built-in USB-C cable and battery display",
        "category": "KEEP A RESERVE",
        "use": "A portable battery with a built-in USB-C cable for compatible devices when a wall socket is out of reach.",
        "check": "The 87W figure is shared output; check single-device output and laptop requirements. Review your carrier’s current battery rules before travel.",
        "detail": "Choose reserve power for a specific need: topping up a phone, keeping a tablet available, or supporting a compatible laptop. Capacity labels do not translate directly into full device charges because voltage conversion and operating conditions affect usable energy. Recharge the bank before leaving, and check its size and weight fit the way you travel."
      },
      {
        "name": "tomtoc Electronic Organizer Pouch · Black",
        "asin": "B0BMVR7XW9",
        "image": "https://m.media-amazon.com/images/I/817efLRNdrL._AC_SL1500_.jpg",
        "alt": "Black tomtoc electronic organizer pouch opened to show cable and accessory compartments",
        "category": "GIVE CABLES A HOME",
        "use": "An accessory pouch for keeping chargers, cables, adapters, and small storage devices in one place.",
        "check": "Compare internal dimensions with your largest charger and power bank. The accessories shown in the image are not included.",
        "detail": "A pouch is useful when your workday moves between home, office, and travel. Group cables by the device they serve and keep a small adapter kit ready. Avoid packing so tightly that connectors bend or pressure falls on a portable drive. Choose the smallest organizer that fits your essential kit."
      }
    ],
    "context": "Start with a packing list, then remove duplicates. Check cables and charging compatibility at home before relying on the setup during a trip. These links open Amazon.com in the United States; current package contents and seller details are shown there.",
    "guidePath": "/guides/power-travel",
    "label": "Power & Travel"
  },
  {
    "id": "focus-ergonomics",
    "title": "Focus & Ergonomics for your workday",
    "description": "A vertical mouse, adjustable footrest, and noise-cancelling headphones for a more considered desk setup. Compare fit before you buy.",
    "intro": "Small adjustments work best when they suit the person using them. Choose a different hand position, a place to rest your feet, or a quieter listening setup.",
    "products": [
      {
        "name": "Logitech Lift Vertical Mouse · Off White",
        "asin": "B098JK6G5N",
        "image": "https://m.media-amazon.com/images/I/61y9Mi+FBhL._AC_SL1500_.jpg",
        "alt": "Off-white Logitech Lift vertical wireless mouse with curved thumb rest and scroll wheel",
        "category": "TRY A DIFFERENT GRIP",
        "use": "A vertical wireless mouse for people who prefer a more upright hand position at the desk.",
        "check": "Check right- or left-hand orientation and hand-size guidance. Allow time to try the shape; comfort is individual.",
        "detail": "Mouse shape is a personal fit decision. Compare the Lift with your current mouse during ordinary tasks such as selecting text, dragging windows, and editing spreadsheets. Put it within easy reach and check whether its connection options match your computer. Equipment alone does not guarantee comfort."
      },
      {
        "name": "Kensington SoleMate Comfort Footrest",
        "asin": "B004UQ40IS",
        "image": "https://m.media-amazon.com/images/I/71y5kbXqwqL._AC_SL1500_.jpg",
        "alt": "Kensington SoleMate Comfort adjustable footrest with padded top and supporting base",
        "category": "SUPPORT YOUR FEET",
        "use": "An adjustable under-desk footrest when your chair height leaves your feet without a comfortable resting point.",
        "check": "Measure the space under your desk and check the adjustment range. Choose a position that feels stable and does not obstruct movement.",
        "detail": "Set your chair and work surface first, then see whether a footrest helps the setup fit. Check the width, height, tilt mechanism, and floor grip before choosing. Leave enough room to change position and stand up easily. This is a workstation accessory, not a treatment for pain."
      },
      {
        "name": "Sony WH-CH720N Headphones · Black",
        "asin": "B0BS1QCFHX",
        "image": "https://m.media-amazon.com/images/I/51rpbVmi9XL._AC_SL1200_.jpg",
        "alt": "Black Sony WH-CH720N over-ear wireless headphones with padded earcups and adjustable headband",
        "category": "SETTLE INTO FOCUS",
        "use": "Wireless noise-cancelling headphones for listening and focused work in a shared environment.",
        "check": "Try the fit and check microphone behaviour with your meeting app. Noise cancellation does not remove every sound.",
        "detail": "Headphones can help create a more consistent listening environment while you write or edit. Choose them for the work you do: music, speech, calls, or a mix. Compare comfort, charging needs, and device switching. For calls in a noisy space, test what the microphone sends to the other person rather than judging only what you hear."
      }
    ],
    "context": "Adjust one thing at a time and notice what changes during a normal working day. Take regular movement breaks. These are equipment suggestions rather than medical recommendations or promises of pain relief.",
    "guidePath": "/guides/focus-ergonomics",
    "label": "Focus & Ergonomics"
  },
  {
    "id": "creator-toolkit",
    "title": "Creator Toolkit for small-business content",
    "description": "A portable tripod, USB microphone, and 128GB SD card for a simple content workflow. Check mounting, recording, and storage compatibility.",
    "intro": "Make useful content with a repeatable setup: steady framing, deliberate audio, and a clear route from capture to backed-up files.",
    "products": [
      {
        "name": "ULANZI MT-44 Phone Tripod",
        "asin": "B09T92NK4J",
        "image": "https://m.media-amazon.com/images/I/61MmnxC0C5L._AC_SL1500_.jpg",
        "alt": "Black ULANZI MT-44 extendable phone tripod with three folding legs and adjustable mount",
        "category": "STEADY YOUR FRAME",
        "use": "A portable tripod for product demos, short videos, and a repeatable camera or phone position.",
        "check": "Check mount type, phone width, load limit, and stability at your intended height. Devices shown in product images are not included.",
        "detail": "A fixed camera position can make a series of tutorials or product clips more consistent. Set up on a stable surface, tighten the mount, and check that cables do not pull the tripod over. Use an appropriate support for heavier equipment and avoid extending a light tripod farther than the shot needs."
      },
      {
        "name": "RØDE NT-USB Mini Microphone",
        "asin": "B084P1CXFD",
        "image": "https://m.media-amazon.com/images/I/51mi31NUkvL._AC_SL1080_.jpg",
        "alt": "Black RØDE NT-USB Mini desktop condenser microphone with rounded grille and desk stand",
        "category": "RECORD A CLEAR EXPLANATION",
        "use": "A USB desktop microphone for voiceovers, demonstrations, and spoken content at a computer.",
        "check": "Check your computer connection and recording-app support. Microphone placement and room noise matter as much as the equipment choice.",
        "detail": "Record a short sample in the room where you plan to work. Move the microphone closer if practical, reduce distracting background noise, and listen back for clipping and echo. Confirm the microphone is selected in the recording software. Keep your original recording as well as the exported edit."
      },
      {
        "name": "SanDisk Extreme PRO SD Card · 128GB",
        "asin": "B09X7FXHVJ",
        "image": "https://m.media-amazon.com/images/I/81wwLOgkLgL._AC_SL1500_.jpg",
        "alt": "Black and red SanDisk Extreme PRO 128GB SDXC UHS-I memory card with gold contacts",
        "category": "KEEP CAPTURE MOVING",
        "use": "A full-size SD memory card for compatible cameras and readers in a photo or video workflow.",
        "check": "Check your camera’s card format, capacity support, and recording-speed requirements. This is an SD card, not a microSD card.",
        "detail": "The right card depends on the camera and recording mode. Check sustained video requirements rather than choosing only by headline read speed. Format the card using the camera’s recommended process, copy the files after each session, and verify a second copy before erasing your capture media."
      }
    ],
    "context": "Start with the phone or camera you already own. A quiet location, a short shot list, and a repeatable file-naming routine can help as much as new gear. Buy the missing piece of the workflow instead of treating these three items as a required bundle.",
    "guidePath": "/guides/creator-toolkit",
    "label": "Creator Toolkit"
  }
];
const usNote='<p class="gear-foot">Editorial suggestions, not hands-on reviews. All product links open Amazon.com, the United States Amazon store. Current prices, availability, delivery options, and seller details are shown on Amazon.</p>';
const cards=items=>`<div class="gear-grid">${items.map((p,i)=>`<article class="gear-card"><div class="gear-category">0${i+1} / ${esc(p.category)}</div>${photo(p)}<h3>${esc(p.name)}</h3><p>${esc(p.use)}</p><p class="gear-check"><strong>Before you buy</strong><br>${esc(p.check)}</p>${button(p)}</article>`).join('')}</div>`;
const extraHome=collections.map(c=>`<section class="gear-section wrap gear-collection" id="${c.id}" aria-labelledby="${c.id}-title" lang="en" dir="ltr"><div class="section-top"><div><div class="eyebrow">THE WAREZ EDIT / WORK GEAR</div><h2 id="${c.id}-title">${esc(c.label)}</h2></div><a class="gear-guide" href="${c.guidePath}">Read the buying guide ↗</a></div><p class="gear-intro">${esc(c.intro)}</p>${disclosure}${cards(c.products)}${usNote}<a class="gear-guide" href="#gear-categories">Browse gear categories ↑</a></section>`).join('');
const allSections=[{title,description,guidePath,body,products,id:'desk-essentials',label:'Desk essentials',date:'2026-10-17'},...collections.map(c=>({...c,date:'2026-10-18',body:`<p>${esc(c.description)}</p>${disclosure}<p>${esc(c.intro)}</p><h2>Start with the workflow</h2><p>${esc(c.context)}</p>${c.products.map((p,i)=>`<h2 id="${p.asin}">${i+1}. ${esc(p.name)}</h2>${photo(p)}<p>${esc(p.use)}</p><p>${esc(p.detail)}</p><p><strong>Before you buy:</strong> ${esc(p.check)}</p>${button(p)}`).join('')}<h2>Shopping on Amazon US</h2>${usNote}<h2>Continue building your setup</h2><ul>${collections.filter(x=>x.id!==c.id).map(x=>`<li><a href="${x.guidePath}">${esc(x.label)}</a></li>`).join('')}<li><a href="${guidePath}">Desk essentials for a small-business laptop</a></li></ul><p class="source-note">Warez editorial selection · 18 October 2026. Product listings and images were checked while preparing this guide. These are buying suggestions, not hands-on tests or promises of results. No prices, ratings, or review scores are reproduced here.</p><p><a href="/#${c.id}">Back to ${esc(c.label)}</a> · <a href="/#stacks">Browse starter software stacks</a></p>`}))];
const categoryNav=`<nav class="gear-jump wrap" id="gear-categories" aria-label="Work gear categories"><p class="eyebrow">BUILD YOUR WORKSPACE</p><div>${allSections.map(c=>`<a href="#${c.id}">${esc(c.label)}</a>`).join('')}</div></nav>`;
const digitalProducts=[
  {
    "name": "Building a Second Brain",
    "author": "Tiago Forte",
    "asin": "B09LVVN9L3",
    "image": "https://m.media-amazon.com/images/I/71+IDmZU88L._SL1500_.jpg",
    "alt": "Building a Second Brain ebook cover by Tiago Forte, with the subtitle about organizing your digital life",
    "category": "ORGANIZE YOUR KNOWLEDGE",
    "use": "A framework for capturing and organizing notes, ideas, and reference material so they can support real projects.",
    "check": "A method book, not a note-taking app or software licence. Check the Kindle edition and supported reading devices.",
    "related": "/tools/notion",
    "relatedText": "Pair with your note-taking workflow"
  },
  {
    "name": "Automate the Boring Stuff with Python · 3rd Edition",
    "author": "Al Sweigart",
    "asin": "B0CG8BSP2R",
    "image": "https://m.media-amazon.com/images/I/71h2BKGo97L._SL1500_.jpg",
    "alt": "Automate the Boring Stuff with Python third edition ebook cover by Al Sweigart, showing a robot mowing a lawn",
    "category": "LEARN PRACTICAL AUTOMATION",
    "use": "Learn Python through everyday tasks such as working with files, text, and spreadsheets. A practical next step when a repetitive workflow needs more than manual copying.",
    "check": "A programming ebook, not an automation app. This edition has device restrictions; check Amazon’s supported-device list.",
    "related": "/guides/automate-repetitive-work",
    "relatedText": "Start with a simple automation plan"
  },
  {
    "name": "The Mom Test",
    "author": "Rob Fitzpatrick",
    "asin": "B01H4G2J1U",
    "image": "https://m.media-amazon.com/images/I/71HN4NPDhhL._SL1500_.jpg",
    "alt": "The Mom Test ebook cover by Rob Fitzpatrick on a bright pink background with a small stick-figure illustration",
    "category": "ASK BETTER CUSTOMER QUESTIONS",
    "use": "A guide to customer conversations that help you learn about real needs before choosing what to build or sell.",
    "check": "An English-language business ebook. Confirm the edition and Kindle reading options on Amazon before buying.",
    "related": "/tools/tally",
    "relatedText": "Explore a tool for gathering responses"
  }
];
const digitalHome=`<section class="digital-picks" id="digital-books" aria-labelledby="digital-books-title" lang="en" dir="ltr"><div class="eyebrow">THE TOOLBOX / DIGITAL READING</div><h2 id="digital-books-title">Learn the skills behind your tools.</h2><p class="gear-intro">Three Kindle ebooks for organizing knowledge, automating repetitive work, and understanding customers. Choose the skill you want to build next.</p>${disclosure}<div class="gear-grid">${digitalProducts.map(p=>`<article class="gear-card"><div class="gear-category">${esc(p.category)}</div>${photo(p)}<span class="pill">Kindle ebook · English</span><h3>${esc(p.name)}</h3><p class="digital-author">By ${esc(p.author)}</p><p>${esc(p.use)}</p><p class="gear-check"><strong>Before you buy</strong><br>${esc(p.check)}</p><p><a class="gear-guide" href="${p.related}">${esc(p.relatedText)} ↗</a></p><a class="gear-link" href="${link(p)}" target="_blank" rel="sponsored noopener noreferrer" aria-label="View ${esc(p.name)} Kindle edition on Amazon (affiliate link)">View Kindle edition on Amazon ↗</a></article>`).join('')}</div><p class="gear-foot">Links open Amazon.com, the United States Amazon store. Kindle availability, device support, prices, and account-region eligibility are shown on Amazon. Selected for common small-business workflows.</p></section>`;
module.exports={products,home:categoryNav+home+extraHome,body,title,description,guidePath,sections:allSections,digitalHome,digitalProducts};

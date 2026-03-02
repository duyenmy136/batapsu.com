const fs = require('fs');
const path = require('path');

const categoriesDir = path.join(process.cwd(), 'public/images/categories');

// Create high-quality SVG icons that look cute and polished
const icons = [
    {
        filename: 'sql-data.svg',
        color: '#818CF8',
        bgColor: '#E0E7FF',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <circle cx="128" cy="128" r="120" fill="#E0E7FF"/>
      <circle cx="128" cy="128" r="105" fill="#C7D2FE"/>
      <!-- Database cylinder -->
      <ellipse cx="110" cy="100" rx="40" ry="12" fill="#6366F1" opacity="0.3"/>
      <rect x="70" y="100" width="80" height="50" rx="0" fill="#818CF8"/>
      <ellipse cx="110" cy="100" rx="40" ry="12" fill="#6366F1"/>
      <ellipse cx="110" cy="125" rx="40" ry="12" fill="none" stroke="#6366F1" stroke-width="2" opacity="0.5"/>
      <ellipse cx="110" cy="150" rx="40" ry="12" fill="#6366F1"/>
      <!-- Cute face on database -->
      <circle cx="98" cy="120" r="3" fill="#312E81"/>
      <circle cx="122" cy="120" r="3" fill="#312E81"/>
      <path d="M104 130 Q110 136 116 130" fill="none" stroke="#312E81" stroke-width="2" stroke-linecap="round"/>
      <!-- Mini bar chart -->
      <rect x="165" y="130" width="12" height="30" rx="3" fill="#A5B4FC"/>
      <rect x="180" y="115" width="12" height="45" rx="3" fill="#818CF8"/>
      <rect x="195" y="100" width="12" height="60" rx="3" fill="#6366F1"/>
      <!-- Sparkle -->
      <text x="175" y="95" font-size="20" fill="#6366F1">✦</text>
    </svg>`
    },
    {
        filename: 'soft-skills.svg',
        color: '#FB7185',
        bgColor: '#FFE4E6',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <circle cx="128" cy="128" r="120" fill="#FFE4E6"/>
      <circle cx="128" cy="128" r="105" fill="#FECDD3"/>
      <!-- Speech bubble 1 -->
      <rect x="50" y="70" width="90" height="60" rx="20" fill="#FB7185"/>
      <polygon points="80,130 95,130 75,150" fill="#FB7185"/>
      <!-- Cute dots in bubble 1 -->
      <circle cx="75" cy="95" r="5" fill="white" opacity="0.8"/>
      <circle cx="95" cy="95" r="5" fill="white" opacity="0.8"/>
      <circle cx="115" cy="95" r="5" fill="white" opacity="0.8"/>
      <!-- Speech bubble 2 -->
      <rect x="120" y="110" width="80" height="55" rx="18" fill="#F43F5E"/>
      <polygon points="175,165 160,165 180,185" fill="#F43F5E"/>
      <!-- Cute dots in bubble 2 -->
      <circle cx="145" cy="133" r="4" fill="white" opacity="0.8"/>
      <circle cx="160" cy="133" r="4" fill="white" opacity="0.8"/>
      <circle cx="175" cy="133" r="4" fill="white" opacity="0.8"/>
      <!-- Heart -->
      <text x="108" y="78" font-size="24" fill="#F43F5E">♥</text>
      <!-- Sparkles -->
      <text x="195" y="105" font-size="18" fill="#FB7185">✦</text>
      <text x="42" y="68" font-size="14" fill="#FDA4AF">✦</text>
    </svg>`
    },
    {
        filename: 'career-tips.svg',
        color: '#E879F9',
        bgColor: '#FAE8FF',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <circle cx="128" cy="128" r="120" fill="#FAE8FF"/>
      <circle cx="128" cy="128" r="105" fill="#F0ABFC"/>
      <!-- Light bulb body -->
      <circle cx="128" cy="110" r="45" fill="#FBBF24"/>
      <circle cx="128" cy="110" r="38" fill="#FDE68A"/>
      <!-- Cute face on bulb -->
      <circle cx="115" cy="105" r="4" fill="#92400E"/>
      <circle cx="141" cy="105" r="4" fill="#92400E"/>
      <path d="M120 118 Q128 125 136 118" fill="none" stroke="#92400E" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Blush -->
      <ellipse cx="108" cy="115" rx="6" ry="4" fill="#F59E0B" opacity="0.4"/>
      <ellipse cx="148" cy="115" rx="6" ry="4" fill="#F59E0B" opacity="0.4"/>
      <!-- Bulb base -->
      <rect x="115" y="152" width="26" height="8" rx="3" fill="#D97706"/>
      <rect x="118" y="160" width="20" height="6" rx="3" fill="#B45309"/>
      <rect x="121" y="166" width="14" height="5" rx="3" fill="#92400E"/>
      <!-- Light rays -->
      <line x1="128" y1="50" x2="128" y2="60" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/>
      <line x1="170" y1="68" x2="163" y2="75" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/>
      <line x1="86" y1="68" x2="93" y2="75" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/>
      <line x1="180" y1="110" x2="170" y2="110" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/>
      <line x1="76" y1="110" x2="86" y2="110" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/>
      <!-- Graduation cap -->
      <polygon points="128,42 155,55 128,65 101,55" fill="#7C3AED"/>
      <rect x="126" y="42" width="4" height="5" fill="#7C3AED"/>
      <line x1="155" y1="55" x2="155" y2="70" stroke="#7C3AED" stroke-width="2"/>
      <circle cx="155" cy="72" r="3" fill="#A855F7"/>
      <!-- Sparkles -->
      <text x="60" y="80" font-size="16" fill="#D946EF">✦</text>
      <text x="185" y="145" font-size="14" fill="#E879F9">✦</text>
    </svg>`
    }
];

icons.forEach(icon => {
    const destPath = path.join(categoriesDir, icon.filename);
    fs.writeFileSync(destPath, icon.svg.trim());
    console.log(`Created polished SVG icon: ${icon.filename}`);
});

console.log('All missing icons generated!');

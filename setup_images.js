const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'public/images');
const postsDir = path.join(targetDir, 'posts');
const categoriesDir = path.join(targetDir, 'categories');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
if (!fs.existsSync(categoriesDir)) fs.mkdirSync(categoriesDir, { recursive: true });

// Copy the generated hero images
const artifactsDir = '/Users/joinytran/.gemini/antigravity/brain/e6f6fdaa-d062-4a54-9763-05638b8b9fdb';

const postImages = [
    { file: 'ba_la_gi_thumb_1772468445769.png', dest: 'business-analyst-la-gi.png' },
    { file: 'giao_tiep_thumb_1772468517159.png', dest: 'ky-nang-giao-tiep-cho-ba.png' },
    { file: 'thu_thap_yeu_cau_thumb_1772468536602.png', dest: 'ky-thuat-thu-thap-yeu-cau.png' },
    { file: 'agile_scrum_thumb_1772468557600.png', dest: 'agile-va-vai-tro-ba-trong-scrum.png' },
    { file: 'cong_cu_ba_thumb_1772468599878.png', dest: 'top-10-cong-cu-ba.png' },
    { file: 'sql_co_ban_thumb_1772468615318.png', dest: 'sql-co-ban-cho-ba.png' }
];

postImages.forEach(img => {
    if (fs.existsSync(path.join(artifactsDir, img.file))) {
        fs.copyFileSync(path.join(artifactsDir, img.file), path.join(postsDir, img.dest));
        console.log(`Copied ${img.dest}`);
    }
});

// Copy generated icons
const icons = [
    { file: 'icon_ba_co_ban_1772468659147.png', dest: 'ba-co-ban.png' },
    { file: 'icon_phan_tich_yeu_cau_1772468673425.png', dest: 'phan-tich-yeu-cau.png' },
    { file: 'icon_ux_ui_1772468687354.png', dest: 'ux-ui-cho-ba.png' },
    { file: 'icon_agile_scrum_1772468719521.png', dest: 'agile-scrum.png' }
];

icons.forEach(img => {
    if (fs.existsSync(path.join(artifactsDir, img.file))) {
        fs.copyFileSync(path.join(artifactsDir, img.file), path.join(categoriesDir, img.dest));
        console.log(`Copied icon ${img.dest}`);
    }
});

// Generate SVG placeholders for remaining icons
const missingIcons = [
    { dest: 'cong-cu-ba.png', color: '#10B981', text: '🛠️' },
    { dest: 'sql-data.png', color: '#6366F1', text: '📊' },
    { dest: 'soft-skills.png', color: '#F43F5E', text: '💬' },
    { dest: 'career-tips.png', color: '#D946EF', text: '💡' }
];

missingIcons.forEach(icon => {
    const svgContent = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <circle cx="128" cy="128" r="120" fill="${icon.color}" opacity="0.2"/>
    <circle cx="128" cy="128" r="110" fill="${icon.color}"/>
    <text x="128" y="160" font-size="90" text-anchor="middle" fill="white" font-family="Arial">${icon.text}</text>
  </svg>`;

    // Save as SVG temporarily (in real app we'll use PNGs, but for now this works as placeholder)
    const destPath = path.join(categoriesDir, icon.dest.replace('.png', '.svg'));
    fs.writeFileSync(destPath, svgContent);
    console.log(`Created placeholder svg for ${icon.dest}`);
});

console.log('Image setup complete.');

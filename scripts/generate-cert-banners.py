#!/usr/bin/env python3
"""Generate blog banners for CCBA and CBAP exam series."""

import sys
import time
import base64
from pathlib import Path

import openai
from PIL import Image
from io import BytesIO

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "public" / "images" / "posts"

client = openai.OpenAI(
    api_key="sk-e83f3148c756475386fadebb14f02640",
    base_url="http://127.0.0.1:8045/v1",
    timeout=180.0,
)

items = [
    # === CCBA Series (12 banners) ===
    {
        "filename": "ccba-tong-quan-va-lo-trinh.png",
        "prompt": "A dark navy blue gradient background with a large silver medal icon with CCBA text engraved, surrounded by glowing certification path steps ascending like a staircase. Subtle hexagonal grid pattern in background. Teal and pink accent lights. Business analysis icons (clipboard, chart, gears) floating around. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "ccba-babok-v3-nen-tang.png",
        "prompt": "A dark indigo background with a large glowing open book representing BABOK Guide v3, radiating light beams. Six interconnected hexagonal nodes around the book representing 6 Knowledge Areas, connected by bright teal lines. Dark gradient with subtle circuit board pattern. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "ccba-ba-planning-monitoring.png",
        "prompt": "Dark navy gradient background with a large glowing planning board/kanban board in the center, surrounded by floating dashboard widgets showing charts and metrics. Stakeholder silhouettes connected by glowing lines. Teal and blue accent colors. Subtle geometric patterns. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "ccba-elicitation-p1.png",
        "prompt": "Dark blue-purple gradient background featuring a magnifying glass examining floating speech bubbles and thought clouds. Interview setting with two abstract silhouettes. Workshop table with sticky notes floating upward. Glowing teal and cyan accents. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "ccba-elicitation-p2.png",
        "prompt": "Dark navy background with abstract human silhouettes connected by glowing communication lines forming a network. Handshake icon in center with radiant glow. Collaboration symbols: puzzle pieces fitting together, bridge connecting two sides. Teal and pink gradients. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "ccba-requirements-lifecycle.png",
        "prompt": "Dark gradient background with a glowing circular lifecycle diagram showing connected stages in a ring. Each stage represented by a distinct glowing icon: trace, maintain, prioritize, assess, approve. Flowing data streams connecting them. Blue and teal color palette. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "ccba-strategy-analysis.png",
        "prompt": "Dark indigo background with a chess board and strategic chess pieces in the foreground. SWOT analysis quadrant glowing subtly behind. Upward arrows and target bullseye icon. Strategy and analysis icons. Dark gradient with gold and teal accent lights. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "ccba-radd-p1.png",
        "prompt": "Dark blue gradient with floating 3D wireframe diagrams: flowcharts, entity relationship diagrams, and process models glowing in neon teal. Blueprint-style grid background. Magnifying glass examining a model. Requirements specification documents floating. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "ccba-radd-p2.png",
        "prompt": "Dark navy background with a glowing architectural blueprint showing system components connected by data flows. Building blocks assembling into a solution design. Comparison scales weighing options. Gold and teal accents on dark gradient. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "ccba-solution-evaluation.png",
        "prompt": "Dark gradient background with a large glowing dashboard showing KPI meters, performance gauges, and trend charts. Checkmark and quality assessment icons. Solution evaluation checklist floating. Green and teal accent colors on dark navy. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "ccba-50-techniques.png",
        "prompt": "Dark indigo background with a large glowing toolbox opening to reveal 50 diverse BA tools and techniques icons floating out: interview icons, modeling shapes, analysis charts, brainstorm clouds, survey forms. Organized in a beautiful spiral pattern. Cyan and teal glow. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "ccba-chien-luoc-thi.png",
        "prompt": "Dark navy gradient with a confident figure at a desk taking an exam, surrounded by floating strategy icons: clock, checklist, trophy, target. Glowing path leading to a golden CCBA medal. Motivational energy with pink and teal light beams. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    # === CBAP Series (12 banners) ===
    {
        "filename": "cbap-tong-quan-va-lo-trinh.png",
        "prompt": "Dark gradient background with a large golden crown and CBAP certification badge glowing in the center. A ascending staircase of light leading up to it. Professional business analyst silhouette at the top. Gold, amber and dark navy color scheme. Premium luxury feel. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "cbap-babok-v3-chuyen-sau.png",
        "prompt": "Dark indigo background with a detailed holographic book representing BABOK Guide v3. Five glowing perspective lenses orbiting around it: Agile, BI, IT, Architecture, BPM. Deep knowledge visualization with layered information planes. Gold and blue accents. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "cbap-ba-planning-monitoring.png",
        "prompt": "Dark navy gradient with an advanced enterprise command center dashboard. Multiple screens showing governance frameworks, stakeholder maps, and performance metrics. Strategic planning board with interconnected elements. Gold and teal glow on dark background. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "cbap-elicitation-collaboration.png",
        "prompt": "Dark blue-purple gradient with a large roundtable workshop scene, abstract figures in heated discussion. Complex stakeholder network diagram floating above. Facilitation tools: voting dots, affinity diagram, mind map. Warm amber and cool teal contrast. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "cbap-requirements-lifecycle.png",
        "prompt": "Dark gradient with a large enterprise-scale traceability web connecting business goals to requirements to test cases. Glowing nodes and flowing data streams. Change impact ripple effect visualization. Blue and gold enterprise-level aesthetic. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "cbap-strategy-analysis-p1.png",
        "prompt": "Dark navy background with two large contrasting holographic cityscapes: current state (dimmer, older) and future state (brighter, modern). A glowing bridge connecting them with analysis data flowing across. Gap analysis visualization. Gold and teal accents. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "cbap-strategy-analysis-p2.png",
        "prompt": "Dark indigo background with a large risk assessment matrix glowing in center. Shield icon representing risk mitigation. Change strategy roadmap with phased approach arrows. Kotter's 8 steps subtly represented as ascending platforms. Amber warning glow with teal accents. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "cbap-radd-p1.png",
        "prompt": "Dark blue gradient with advanced 3D modeling visualizations: BPMN diagrams, ERD with entities floating in space, use case diagrams, state machine transitions. Holographic blueprint aesthetic. Verification checkmarks. Bright teal wireframe glow on dark navy. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "cbap-radd-p2.png",
        "prompt": "Dark navy gradient with enterprise architecture visualization: building blocks assembling into a large system, integration connectors between components. Financial analysis charts (NPV, ROI). Decision scales weighing build vs buy. Gold and blue enterprise aesthetic. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "cbap-solution-evaluation.png",
        "prompt": "Dark gradient with a large holographic balanced scorecard dashboard: four quadrants showing financial, customer, process, and learning metrics. Performance gauges and trend lines. Enterprise value optimization cycle. Green success indicators with gold accents on dark navy. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "cbap-perspectives.png",
        "prompt": "Dark indigo background with five distinct glowing crystal lenses arranged in a circle, each representing a BA perspective: Agile sprint board, BI data visualization, IT system diagram, Architecture capability map, BPM process flow. Center convergence point where all perspectives meet. Rainbow spectrum on dark background. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
    {
        "filename": "cbap-chien-luoc-thi.png",
        "prompt": "Dark navy gradient with a triumphant figure holding up a golden CBAP crown trophy. Case study documents and strategic analysis floating around. Exam mastery visualization with confidence indicators. Golden light beams radiating outward. Premium gold and dark navy aesthetic. 16:9 aspect ratio. No text, no words, no letters. Ultra high quality digital art.",
    },
]


def generate_banner(item, index, total):
    """Generate a single banner image."""
    filename = item["filename"]
    prompt = item["prompt"]
    output_path = OUTPUT_DIR / filename

    if output_path.exists():
        print(f"[{index}/{total}] SKIP (exists): {filename}")
        return True

    print(f"[{index}/{total}] Generating: {filename}")

    try:
        response = client.images.generate(
            model="gemini-3.1-flash-image",
            prompt=prompt,
            size="1792x1024",
            n=1,
            response_format="b64_json",
        )
        b64 = response.data[0].b64_json
        img_data = base64.b64decode(b64)
        img = Image.open(BytesIO(img_data)).convert("RGB")

        # Resize to 1920x1080 (16:9)
        img = img.resize((1920, 1080), Image.LANCZOS)

        # Save optimized PNG
        img.save(str(output_path), "PNG", optimize=True)
        file_size = output_path.stat().st_size / 1024
        print(
            f"  ✅ Saved: {filename} ({img.size[0]}x{img.size[1]}, {file_size:.0f}KB)")
        return True

    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False


def main():
    start_index = int(sys.argv[1]) - 1 if len(sys.argv) > 1 else 0
    total = len(items)

    print(
        f"=== Generating {total - start_index} banners (starting from #{start_index + 1}) ===\n")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    success = 0
    for i in range(start_index, total):
        if generate_banner(items[i], i + 1, total):
            success += 1
        if i < total - 1:
            time.sleep(3)

    print(f"\n=== Done: {success}/{total - start_index} banners generated ===")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Generate cute/kawaii style blog banners for batapsu.com."""

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

CUTE_STYLE = (
    "Cute kawaii chibi illustration style, pastel colors with soft gradients, "
    "adorable round characters with big sparkly eyes, soft shadows, "
    "dreamy atmosphere with tiny stars and sparkles floating around. "
    "Clean composition on dark navy-indigo gradient background. "
    "No text, no words, no letters. Ultra high quality digital art."
)

items = [
    # === Standalone blog posts (6 banners) ===
    {
        "filename": "business-analyst-la-gi.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi business analyst character wearing glasses and a blazer, holding a clipboard and magnifying glass, surrounded by floating kawaii icons: tiny charts, gears, lightbulbs, and sparkles. Pastel pink and teal accents on dark navy gradient. {CUTE_STYLE}",
    },
    {
        "filename": "agile-va-vai-tro-ba-trong-scrum.png",
        "logo_position": "bottom-right",
        "prompt": f"Cute chibi characters in a Scrum team huddle: a tiny Product Owner with a crown, a Scrum Master with a shield, and a BA with a notebook, standing around an adorable kanban board with colorful sticky notes. Sprint arrows and tiny clocks floating. {CUTE_STYLE}",
    },
    {
        "filename": "ky-nang-giao-tiep-cho-ba.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi BA character speaking into a megaphone with colorful speech bubbles floating out, while tiny chibi stakeholders listen with heart eyes. Communication icons: handshake, chat bubbles, email envelope with wings. {CUTE_STYLE}",
    },
    {
        "filename": "ky-thuat-thu-thap-yeu-cau.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi BA detective character with a magnifying glass collecting floating requirement stars into a magical basket. Interview microphone, survey clipboard, and observation binoculars scattered around as kawaii objects. {CUTE_STYLE}",
    },
    {
        "filename": "sql-co-ban-cho-ba.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi BA character sitting at a computer with tiny kawaii database cylinders stacked like building blocks. SQL query sparkles flowing between character and database. Little data tables with tiny hearts. {CUTE_STYLE}",
    },
    {
        "filename": "top-10-cong-cu-ba.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute kawaii toolbox overflowing with adorable BA tools: tiny Jira board, cute Confluence notebook, chibi Visio flowchart, miniature Excel spreadsheet, tiny Figma pen, all with happy faces. Tool icons floating in a circle. {CUTE_STYLE}",
    },
    # === CCBA Series (12 banners) ===
    {
        "filename": "ccba-tong-quan-va-lo-trinh.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi student character climbing a kawaii staircase of glowing steps toward a shiny silver CCBA medal at the top. Each step has a tiny star. Road map with cute milestone flags. Encouraging sparkle effects. {CUTE_STYLE}",
    },
    {
        "filename": "ccba-babok-v3-nen-tang.png",
        "logo_position": "bottom-right",
        "prompt": f"A large adorable kawaii book (BABOK) glowing softly, with 6 cute chibi characters representing Knowledge Areas emerging from its pages. Tiny hexagonal nodes connected by sparkly lines orbiting the book. {CUTE_STYLE}",
    },
    {
        "filename": "ccba-ba-planning-monitoring.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi BA character at a kawaii planning desk with an adorable kanban board. Tiny dashboard widgets with happy-face charts floating. Cute calendar with stickers. Planning checklist with sparkle checkmarks. {CUTE_STYLE}",
    },
    {
        "filename": "ccba-elicitation-p1.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi BA interviewer character with a notebook, sitting across from a happy chibi stakeholder. Floating speech bubbles with tiny lightbulbs inside. Kawaii sticky notes, cute workshop table. {CUTE_STYLE}",
    },
    {
        "filename": "ccba-elicitation-p2.png",
        "logo_position": "bottom-right",
        "prompt": f"Cute chibi characters holding hands in a circle, forming a collaboration network. Tiny puzzle pieces fitting together with sparkle effects. Kawaii handshake icon. Heart-shaped communication bubbles. {CUTE_STYLE}",
    },
    {
        "filename": "ccba-requirements-lifecycle.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute kawaii circular lifecycle wheel with adorable icons at each stage: tiny trace magnifier, maintain wrench, prioritize stars, assess clipboard, approve stamp. Chibi character spinning the wheel. {CUTE_STYLE}",
    },
    {
        "filename": "ccba-strategy-analysis.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi strategist character playing with kawaii chess pieces on a tiny board. Adorable SWOT quadrant with cute icons in each section. Tiny target bullseye with arrows and sparkles. {CUTE_STYLE}",
    },
    {
        "filename": "ccba-radd-p1.png",
        "logo_position": "bottom-right",
        "prompt": f"Cute kawaii 3D wireframe diagrams floating: adorable flowchart with round shapes, tiny ERD with heart-connected entities, chibi process model. Blueprint grid background with soft glow. Cute magnifying glass examining models. {CUTE_STYLE}",
    },
    {
        "filename": "ccba-radd-p2.png",
        "logo_position": "bottom-right",
        "prompt": f"Cute chibi architect character stacking colorful kawaii building blocks into a solution design. Tiny comparison scale weighing options with sparkles. Adorable blueprint scroll and architectural components. {CUTE_STYLE}",
    },
    {
        "filename": "ccba-solution-evaluation.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi analyst character looking at an adorable dashboard with kawaii KPI gauges showing happy faces at high values. Tiny trend charts going up with star effects. Cute checkmark stamp. {CUTE_STYLE}",
    },
    {
        "filename": "ccba-50-techniques.png",
        "logo_position": "bottom-right",
        "prompt": f"A magical kawaii treasure chest opening with 50 tiny cute BA technique icons spiraling out in a sparkly vortex: mini interview mic, tiny brainstorm cloud, cute survey form, adorable modeling shapes. Rainbow sparkle trail. {CUTE_STYLE}",
    },
    {
        "filename": "ccba-chien-luoc-thi.png",
        "logo_position": "bottom-right",
        "prompt": f"A confident cute chibi student at a desk with exam paper, surrounded by floating strategy icons: kawaii clock, adorable checklist, shiny trophy, target with arrow. Golden CCBA medal waiting at the finish line with sparkles. {CUTE_STYLE}",
    },
    # === CBAP Series (12 banners) ===
    {
        "filename": "cbap-tong-quan-va-lo-trinh.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi professional BA character wearing a tiny crown, climbing a golden kawaii staircase toward a glowing CBAP golden badge. Premium sparkle effects, tiny stars, and achievement ribbons. Gold and deep navy tones. {CUTE_STYLE}",
    },
    {
        "filename": "cbap-babok-v3-chuyen-sau.png",
        "logo_position": "bottom-right",
        "prompt": f"A large adorable holographic kawaii BABOK book with 5 cute perspective lens characters orbiting: tiny Agile ninja, cute BI scientist, chibi IT robot, mini Architecture builder, kawaii BPM flow master. Golden glow. {CUTE_STYLE}",
    },
    {
        "filename": "cbap-ba-planning-monitoring.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi BA leader at an adorable enterprise command center with multiple kawaii screens showing governance dashboards. Tiny strategic planning board with interconnected cute elements. Gold and teal sparkles. {CUTE_STYLE}",
    },
    {
        "filename": "cbap-elicitation-collaboration.png",
        "logo_position": "bottom-right",
        "prompt": f"Cute chibi characters at a kawaii roundtable workshop: adorable stakeholders in animated discussion with floating facilitation tools — tiny voting dots, cute affinity diagram, mini mind map. Warm amber sparkles. {CUTE_STYLE}",
    },
    {
        "filename": "cbap-requirements-lifecycle.png",
        "logo_position": "bottom-right",
        "prompt": f"A large adorable traceability web with kawaii nodes connected by sparkly threads. Cute chibi requirements flowing through lifecycle stages. Change impact ripple shown as cute water rings. Gold and blue cues. {CUTE_STYLE}",
    },
    {
        "filename": "cbap-strategy-analysis-p1.png",
        "logo_position": "bottom-right",
        "prompt": f"Two cute kawaii cityscapes side by side: a sleepy older town (current state) and a sparkly modern city (future state). An adorable glowing rainbow bridge connecting them with tiny data sparkles flowing across. Gap analysis stars. {CUTE_STYLE}",
    },
    {
        "filename": "cbap-strategy-analysis-p2.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi risk manager character with a tiny shield, surrounded by a kawaii risk matrix with adorable warning icons. Change roadmap as cute stepping stones leading forward. Amber glow with sparkle effects. {CUTE_STYLE}",
    },
    {
        "filename": "cbap-radd-p1.png",
        "logo_position": "bottom-right",
        "prompt": f"Cute kawaii 3D holographic models floating: adorable BPMN diagram, chibi ERD entities holding hands, tiny use case bubbles, kawaii state machine transitions. Cute verification checkmarks with sparkles. {CUTE_STYLE}",
    },
    {
        "filename": "cbap-radd-p2.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi enterprise architect stacking golden kawaii building blocks into a grand system design. Tiny financial charts (NPV, ROI) with happy faces. Adorable decision scales. Gold and blue premium sparkles. {CUTE_STYLE}",
    },
    {
        "filename": "cbap-solution-evaluation.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute kawaii balanced scorecard dashboard with four adorable quadrants: tiny financial coin stack, chibi customer hearts, cute process gears, kawaii learning brain. Performance gauges with sparkly effects. Green and gold accents. {CUTE_STYLE}",
    },
    {
        "filename": "cbap-perspectives.png",
        "logo_position": "bottom-right",
        "prompt": f"Five cute kawaii crystal lens characters arranged in a circle: chibi Agile sprinter, adorable BI data fairy, tiny IT robot, kawaii Architecture builder, cute BPM flow dancer. Center convergence point with rainbow sparkle. {CUTE_STYLE}",
    },
    {
        "filename": "cbap-chien-luoc-thi.png",
        "logo_position": "bottom-right",
        "prompt": f"A triumphant cute chibi character holding up a golden CBAP crown trophy with sparkle explosion. Case study documents and strategy stars floating around. Golden light beams radiating. Premium celebration confetti. {CUTE_STYLE}",
    },
]


def generate_banner(item, index, total):
    """Generate a single banner image."""
    filename = item["filename"]
    prompt = item["prompt"]
    output_path = OUTPUT_DIR / filename

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
        f"=== Generating {total - start_index} cute banners (starting from #{start_index + 1}) ===\n")
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

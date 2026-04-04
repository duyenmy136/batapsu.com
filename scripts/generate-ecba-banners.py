#!/usr/bin/env python3
"""Generate cute/kawaii style blog banners for ECBA series on batapsu.com."""

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
    # 1. Tổng quan ECBA và lộ trình ôn thi
    {
        "filename": "ecba-tong-quan.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi beginner BA student character with big sparkly eyes, standing at the entrance of a kawaii magical learning path. A glowing green ECBA badge floats at the end of the path. Tiny milestone flags along cute stepping stones, a road map scroll, sparkly compass, and achievement stars. Encouraging warm teal and green tones. {CUTE_STYLE}",
    },
    # 2. BABOK Guide v3 — Cấu trúc nền tảng
    {
        "filename": "ecba-babok-v3.png",
        "logo_position": "bottom-right",
        "prompt": f"A large adorable kawaii BABOK guidebook glowing with soft green light, with 6 cute chibi Knowledge Area characters popping out of its pages. Tiny hexagonal BACCM nodes orbiting the book connected by sparkly lines. A cute chibi student reading with wonder. Green and teal accents. {CUTE_STYLE}",
    },
    # 3. BA Planning & Monitoring
    {
        "filename": "ecba-ba-planning.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi BA planner character at an adorable desk with a kawaii kanban board showing 5 colorful task columns. Tiny dashboard widgets with happy-face pie charts, a cute calendar with star stickers, sparkly governance shield, and tiny stakeholder list. Teal and mint green tones. {CUTE_STYLE}",
    },
    # 4. Elicitation & Collaboration P1 — Thu thập yêu cầu
    {
        "filename": "ecba-elicitation-p1.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi BA interviewer character with a tiny notebook and pen, sitting across from a happy chibi stakeholder at a kawaii round table. Floating speech bubbles with tiny lightbulbs inside. Adorable sticky notes, cute workshop whiteboard, and sparkly requirement stars being collected. {CUTE_STYLE}",
    },
    # 5. Elicitation & Collaboration P2 — Kỹ thuật Elicitation
    {
        "filename": "ecba-elicitation-p2.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi BA character surrounded by floating kawaii elicitation tools: an adorable interview microphone, tiny workshop table with mini people, cute observation binoculars, kawaii document with magnifying glass, a chibi prototype screen, and a sparkly survey clipboard. Each tool has a happy face. {CUTE_STYLE}",
    },
    # 6. Requirements Life Cycle Management
    {
        "filename": "ecba-requirements-lifecycle.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute kawaii circular lifecycle wheel with 5 adorable stages: tiny trace magnifier, maintain wrench, prioritize stars arranged by size, assess changes clipboard, and approve stamp with sparkle. A chibi BA character in the center spinning the wheel gently. Soft teal and purple gradient. {CUTE_STYLE}",
    },
    # 7. Strategy Analysis
    {
        "filename": "ecba-strategy-analysis.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi strategist character with a tiny telescope, looking at two kawaii cityscapes: a sleepy small town (current state) and a sparkly futuristic city (future state). A glowing rainbow bridge connects them with flowing sparkles. Adorable SWOT quadrant floating nearby with cute icons. {CUTE_STYLE}",
    },
    # 8. RADD Part 1 — Specify & Model
    {
        "filename": "ecba-radd-p1.png",
        "logo_position": "bottom-right",
        "prompt": f"Cute kawaii 3D holographic models floating around a chibi BA analyst: an adorable flowchart with round shapes and arrows, tiny ERD entities holding hands, cute use case bubbles, and a kawaii data dictionary book. Verification checkmarks with sparkles. Blueprint grid glow. {CUTE_STYLE}",
    },
    # 9. RADD Part 2 — Design & Recommend
    {
        "filename": "ecba-radd-p2.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi architect BA stacking colorful kawaii building blocks into a solution design tower. A tiny adorable comparison scale weighing three design options with sparkles. Cute recommendation ribbon badge glowing. Blueprint scroll and architectural components floating. {CUTE_STYLE}",
    },
    # 10. Solution Evaluation
    {
        "filename": "ecba-solution-evaluation.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi analyst character holding a kawaii magnifying glass, examining an adorable dashboard with performance gauges showing happy and neutral faces. Tiny trend charts going up with star effects. Cute KPI meters, limitation warning signs, and a sparkly recommendation lightbulb. {CUTE_STYLE}",
    },
    # 11. 50 Kỹ thuật BA
    {
        "filename": "ecba-50-techniques.png",
        "logo_position": "bottom-right",
        "prompt": f"A magical kawaii treasure chest bursting open with 50 tiny cute BA technique icons spiraling out in a sparkly vortex: mini interview mic, tiny brainstorm cloud, cute survey form, adorable modeling shapes, kawaii decision table, tiny acceptance criteria card. Rainbow sparkle trail. {CUTE_STYLE}",
    },
    # 12. Chiến lược thi ECBA
    {
        "filename": "ecba-chien-luoc-thi.png",
        "logo_position": "bottom-right",
        "prompt": f"A confident cute chibi student at an exam desk with a pencil, surrounded by floating strategy icons: kawaii clock showing time management, adorable checklist with sparkle checkmarks, target bullseye with arrow, tiny brain with gears. A shiny green ECBA badge waiting at the finish line. {CUTE_STYLE}",
    },
    # 13. Đề thi thử ECBA
    {
        "filename": "ecba-de-thi-thu.png",
        "logo_position": "bottom-right",
        "prompt": f"A cute chibi student character intensely focused on a kawaii computer screen showing a mock exam interface with colorful multiple-choice options. A tiny adorable timer clock counting down, score meter rising with sparkles, and a celebration confetti ready to burst. Green ECBA medal gleaming nearby. {CUTE_STYLE}",
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
        f"=== Generating {total - start_index} ECBA cute banners (starting from #{start_index + 1}) ===\n")
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

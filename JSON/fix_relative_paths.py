import os
import re

root_dir = r"C:\Users\Wyatt\Documents\GitHub\Megalo Docs\MegaloDocs"

def fix_paths(file_path):
    rel_path = os.path.relpath(file_path, root_dir)
    depth = rel_path.count(os.sep)
    prefix = "../" * depth if depth > 0 else "./"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace absolute patterns in HTML
    patterns = [
        (r'href="/css/', f'href="{prefix}css/'),
        (r'src="/JS/', f'src="{prefix}JS/'),
        (r'href="/res/', f'href="{prefix}res/'),
        (r'src="/res/', f'src="{prefix}res/'),
        (r'href="/index\.html"', f'href="{prefix}index.html"'),
        (r'href="/megaloedit/', f'href="{prefix}megaloedit/'),
        (r'href="/rvt/', f'href="{prefix}rvt/'),
        (r'href="/tips/', f'href="{prefix}tips/'),
    ]
    
    new_content = content
    for old, new in patterns:
        new_content = re.sub(old, new, new_content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed paths in {rel_path} (Depth: {depth})")

# 1. Fix HTML Files
for root, dirs, files in os.walk(root_dir):
    for name in files:
        if name.endswith(".html"):
            fix_paths(os.path.join(root, name))

# 2. Fix sidebar.json (Convert "/path" to "path" for JS rootPath prepending)
sidebar_json = os.path.join(root_dir, "JSON", "sidebar.json")
if os.path.exists(sidebar_json):
    with open(sidebar_json, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = re.sub(r'"path": "/', '"path": "', content)
    if new_content != content:
        with open(sidebar_json, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Fixed paths in sidebar.json")

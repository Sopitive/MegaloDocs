import os
import json
from bs4 import BeautifulSoup

rvt_doc_root = r"c:\Users\Wyatt\Documents\GitHub\RVTDoc\ReachVariantEditor"
output_json = r"c:\Users\Wyatt\Documents\GitHub\Megalo Docs\MegaloDocs\JSON\rvt_docs.json"

docs_data = []

for root, dirs, files in os.walk(rvt_doc_root):
    for file in files:
        if file.endswith(".html"):
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, rvt_doc_root)
            
            try:
                with open(full_path, "r", encoding="utf-8") as f:
                    soup = BeautifulSoup(f, "html.parser")
                    
                    title_tag = soup.find("title")
                    title = title_tag.get_text() if title_tag else file
                    # Clean up title
                    title = title.replace(" | ReachVariantTool Documentation", "")
                    
                    main_tag = soup.find("main")
                    if not main_tag:
                        content = ""
                    else:
                        content = "".join([str(item) for item in main_tag.contents])
                    
                    docs_data.append({
                        "rel_path": rel_path.replace("\\", "/"),
                        "title": title,
                        "content": content
                    })
            except Exception as e:
                print(f"Error reading {full_path}: {e}")

# Create directory if it doesn't exist
os.makedirs(os.path.dirname(output_json), exist_ok=True)

with open(output_json, "w", encoding="utf-8") as f:
    json.dump(docs_data, f, indent=2)

print(f"Extracted {len(docs_data)} files to {output_json}")

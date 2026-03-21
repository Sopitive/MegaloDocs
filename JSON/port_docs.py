import os
import json
import shutil

input_json = r"c:\Users\Wyatt\Documents\GitHub\Megalo Docs\MegaloDocs\JSON\rvt_docs.json"
output_root = r"c:\Users\Wyatt\Documents\GitHub\Megalo Docs\MegaloDocs\rvt"
rvt_doc_root = r"c:\Users\Wyatt\Documents\GitHub\RVTDoc\ReachVariantEditor"

with open(input_json, "r", encoding="utf-8") as f:
    docs_data = json.load(f)

for doc in docs_data:
    rel_path = doc["rel_path"]
    title = doc["title"]
    content = doc["content"]
    
    # Target path
    target_file = os.path.join(output_root, rel_path)
    os.makedirs(os.path.dirname(target_file), exist_ok=True)
    
    # Calculate relative depth for styles/scripts
    # rel_path is like "script/api/bool.html" -> 2 levels deep
    depth = rel_path.count("/")
    base_href = "../" * depth if depth > 0 else "./"
    
    html = f"""<!doctype html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <title>{title} | Megalo Docs</title>
      <link rel="stylesheet" type="text/css" href="/css/main.css">
      <link rel="icon" href="/res/favicon.svg" sizes="any" type="image/svg+xml">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
      <base href="{base_href}" />
   </head>
   <body>
      <header>
         <div>
            <div>
               <a href="/index.html" class="logo">
                  Megalo Docs
               </a>
            </div>
            <div>
               <nav aria-label="Main menu">
                  <ul>
                     <li><a href="/tips/scripts.html">Scripts</a></li>
                     <li><a href="https://discord.gg/Z2ZvPsCbcc" target="_blank">Discord</a></li>
                     <li><a href="https://halocustoms.com/maps/categories/gametypes.40/" target="_blank">Gametypes</a></li>
                  </ul>
               </nav>
               <div>
                  <button id="theme-toggle" title="Theme" type="button"><i class="fas fa-adjust"></i></button>
               </div>
            </div>
         </div>
      </header>
      <div id="breadcrumb"></div>
      <div id="sidebar-wrapper">
         <div id="sidebar"></div>
      </div>
      <main id="main">
         {content}
      </main>
      <script src="/JS/sidebar.js"></script>
   </body>
</html>"""
    
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(html)

# Copy all images/non-html assets
for root, dirs, files in os.walk(rvt_doc_root):
    for file in files:
        if not file.endswith(".html"):
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, rvt_doc_root)
            target_path = os.path.join(output_root, rel_path)
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            shutil.copy2(full_path, target_path)

print(f"Ported {len(docs_data)} files to {output_root}")

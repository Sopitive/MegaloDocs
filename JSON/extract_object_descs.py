import re
import json

def extract_descriptions(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the DL block
    dl_match = re.search(r'<dl class="object-type-list">(.*?)</dl>', content, re.DOTALL)
    if not dl_match:
        return {}

    dl_content = dl_match.group(1)

    # Use regex to find pairs of <dt> and <dd>
    # Note: This is a bit fragile but should work for this specific HTML structure
    pairs = re.findall(r'<dt.*?<code>(.*?)</code>.*?\((.*?)\).*?</dt>\s*<dd>(.*?)</dd>', dl_content, re.DOTALL)

    mapping = {}
    for name, title, desc in pairs:
        # Clean up desc (remove HTML tags)
        clean_desc = re.sub(r'<.*?>', '', desc).strip().replace('\n', ' ').replace('  ', ' ')
        mapping[name.strip()] = {
            "title": title.strip(),
            "desc": clean_desc,
            "syntax": f'action create_object "{name.strip()}" at ...'
        }
    
    return mapping

if __name__ == "__main__":
    rvt_path = r"C:\Users\Wyatt\Documents\GitHub\Megalo Docs\MegaloDocs\rvt\script\api\object-type.html"
    data = extract_descriptions(rvt_path)
    
    out_path = r"C:\Users\Wyatt\Documents\GitHub\Megalo Docs\MegaloDocs\JSON\object_data.json"
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=3)
    print(f"Data saved to {out_path}")

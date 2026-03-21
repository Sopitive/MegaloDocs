def get_list(path):
    with open(path, 'r') as f:
        return [line.strip() for line in f if line.strip()]

reach_objs = set(get_list(r"C:\Program Files (x86)\Steam\steamapps\common\HREK\data\multiplayer\megalo\object_lists\objects.txt"))
h2a_objs = set(get_list(r"C:\Program Files (x86)\Steam\steamapps\common\H2AMPEK\data\multiplayer\megalo\object_lists\objects.txt"))

unique_h2a = h2a_objs - reach_objs

# Also check other files in H2A
h2a_other_files = [
    "customapps.txt", "effects.txt", "equipment.txt", "ordnances.txt", "vehicles.txt", "weapons.txt"
]

all_h2a_ids = set(h2a_objs)
for f_name in h2a_other_files:
    try:
        ids = get_list(rf"C:\Program Files (x86)\Steam\steamapps\common\H2AMPEK\data\multiplayer\megalo\object_lists\{f_name}")
        all_h2a_ids.update(ids)
    except:
        pass

unique_h2a_total = all_h2a_ids - reach_objs

out_path = r"C:\Users\Wyatt\Documents\GitHub\Megalo Docs\MegaloDocs\JSON\h2a_tags.txt"
with open(out_path, 'w') as f:
    for item in sorted(unique_h2a_total):
        f.write(f'<span class="object-tag" data-name="{item}">{item}</span>\n')

print(f"Tags written to {out_path}")

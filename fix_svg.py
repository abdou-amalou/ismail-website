import os

file_path = r'c:\Users\ASUS\Desktop\THE COMPLETE VIDEO EDITING MASTERCLASS\landing page.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False

for line in lines:
    if '<svg class="bullets"' in line or '<svg class="bullets-puchase"' in line:
        skip = True
        cls = 'bullets' if 'class="bullets"' in line else 'bullets-puchase'
        new_lines.append(f'        <div class="{cls}"></div>\n')
        continue
        
    if skip and '</svg>' in line:
        skip = False
        continue
        
    if not skip:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("SVG substitution complete.")

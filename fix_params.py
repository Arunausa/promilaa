import os
import glob
import re

controllers = glob.glob('apps/backend/src/controllers/*.ts')

for file in controllers:
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace const { xyz } = req.params; with const xyz = req.params.xyz as string;
    content = re.sub(r'const\s*\{\s*([a-zA-Z0-9_]+)\s*\}\s*=\s*req\.params\s*;', r'const \1 = req.params.\1 as string;', content)
    
    with open(file, 'w') as f:
        f.write(content)

print("Fixed req.params")

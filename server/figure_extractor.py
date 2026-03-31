# figure_extractor.py
import sys
import fitz  # PyMuPDF
import json
import base64

def extract_figures(pdf_path):
    doc = fitz.open(pdf_path)
    figures = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        page_width = page.rect.width
        page_height = page.rect.height
        
        # 1. Extract Images
        for img in page.get_images(full=True):
            xref = img[0]
            bbox = page.get_image_bbox(img)
            
            # Filter Noise: Ignore tiny images (< 5% of page) or header/footer locations
            if bbox.width < page_width * 0.05 or bbox.height < page_height * 0.05:
                continue
            if bbox.y0 < page_height * 0.08 or bbox.y1 > page_height * 0.92:
                continue
                
            # Crop and encode
            pix = page.get_pixmap(clip=bbox, matrix=fitz.Matrix(2, 2))
            b64 = base64.b64encode(pix.tobytes("png")).decode('utf-8')
            figures.append({
                "page_index": page_num,
                "type": "image",
                "imageBase64": f"data:image/png;base64,{b64}"
            })
            
        # 2. Extract Tables
        tables = page.find_tables()
        if tables.tables:
            for tab in tables.tables:
                bbox = tab.bbox
                # Crop and encode
                pix = page.get_pixmap(clip=bbox, matrix=fitz.Matrix(2, 2))
                b64 = base64.b64encode(pix.tobytes("png")).decode('utf-8')
                figures.append({
                    "page_index": page_num,
                    "type": "table",
                    "imageBase64": f"data:image/png;base64,{b64}"
                })

    print(json.dumps(figures))

if __name__ == '__main__':
    extract_figures(sys.argv[1])
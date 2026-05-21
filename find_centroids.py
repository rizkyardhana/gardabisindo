import cv2
import numpy as np

# Load the image
img_path = "public/peta pulau indonesia.jpg"
img = cv2.imread(img_path)

if img is None:
    # Try PIL if cv2 is not available
    from PIL import Image
    img_pil = Image.open(img_path)
    width, height = img_pil.size
    print(f"Image loaded with PIL. Size: {width}x{height}")
    # Convert to numpy array
    img = np.array(img_pil)
    # Convert RGB to BGR for compatibility with cv2 code below
    img = img[:, :, ::-1]
else:
    height, width, _ = img.shape
    print(f"Image loaded with OpenCV. Size: {width}x{height}")

# The image has a light grey/white background (typically RGB/BGR > 230).
# The islands are colored red (top half) and white/red-bordered (bottom half).
# Let's find all pixels that are not the background.
# Let's convert to grayscale or check if pixels are different from background.
# The background is light grey: let's assume background is around [240, 240, 240].
# Let's print out some sample pixel values to verify.
bg_color = img[0, 0]
print(f"Background pixel color at (0,0): {bg_color}")

# Let's threshold the image to find the islands.
# Since the background is very light grey (all channels close to each other and > 220),
# and the red islands have high red channel, and white islands have high channels too but are bounded by red borders.
# Let's find any pixel that is not the background.
# We can define background as having R, G, B all > 230 and |R-G| < 15, |G-B| < 15.
# Let's make a mask of non-background pixels.
mask = np.zeros((height, width), dtype=np.uint8)
for y in range(height):
    for x in range(width):
        b, g, r = img[y, x]
        # If it's not light grey/white background
        # Let's check if the pixel belongs to the island.
        # Background is around 240,240,240.
        if not (b > 230 and g > 230 and r > 230 and abs(int(r)-int(g)) < 10 and abs(int(g)-int(b)) < 10):
            mask[y, x] = 255

# Now we define bounding boxes for each of the 6 regions in terms of width percentage:
# 1. Sumatera: left 0% to 30%, top 10% to 70%
# 2. Jawa: left 25% to 55%, top 60% to 85%
# 3. Kalimantan: left 30% to 50%, top 20% to 60%
# 4. Sulawesi: left 50% to 68%, top 25% to 65%
# 5. Bali & Nusa Tenggara: left 50% to 75%, top 70% to 85%
# 6. Maluku & Papua: left 68% to 100%, top 30% to 75%

regions = {
    'Sumatera': {'x1': 0.0, 'x2': 0.28, 'y1': 0.1, 'y2': 0.7},
    'Jawa': {'x1': 0.25, 'x2': 0.52, 'y1': 0.6, 'y2': 0.85},
    'Kalimantan': {'x1': 0.30, 'x2': 0.50, 'y1': 0.2, 'y2': 0.6},
    'Sulawesi': {'x1': 0.50, 'x2': 0.68, 'y1': 0.25, 'y2': 0.65},
    'Bali & Nusa Tenggara': {'x1': 0.50, 'x2': 0.75, 'y1': 0.68, 'y2': 0.85},
    'Maluku & Papua': {'x1': 0.68, 'x2': 1.0, 'y1': 0.3, 'y2': 0.75}
}

print("\n--- Centroids in original 3:2 image ---")
centroids = {}
for name, box in regions.items():
    # Convert relative box to pixel coords
    px1, px2 = int(box['x1'] * width), int(box['x2'] * width)
    py1, py2 = int(box['y1'] * height), int(box['y2'] * height)
    
    # Get the region of interest from the mask
    roi = mask[py1:py2, px1:px2]
    
    # Find coordinates of all active pixels in this ROI
    ys, xs = np.where(roi > 0)
    if len(xs) > 0:
        # Calculate centroid in pixel coords
        cx = px1 + int(np.mean(xs))
        cy = py1 + int(np.mean(ys))
        
        # Convert back to percentages of original image
        pct_x = (cx / width) * 100
        pct_y = (cy / height) * 100
        centroids[name] = (pct_x, pct_y)
        print(f"{name:20s}: left = {pct_x:.2f}%, top = {pct_y:.2f}%")
    else:
        print(f"{name:20s}: No pixels found")

# Now let's calculate the positions in the 2.2:1 cropped container.
# Aspect ratio of original image is 1.5:1 (or 3:2).
# Aspect ratio of container is 2.2:1.
# Since 2.2 > 1.5, the container is wider than the image.
# Under 'object-cover', the image is scaled to match container width.
# This means height is cropped from top and bottom.
# Crop factor on height = (height_original - height_needed_for_2.2_aspect) / 2
# Height needed = width_original / 2.2
# Crop percentage from top = (1 - (1.5 / 2.2)) / 2 = (1 - 0.6818) / 2 = 0.159 = 15.9% !!
# Let's verify this mathematically:
# If width is W, original height is H_orig = W / 1.5.
# Container height is H_cont = W / 2.2.
# So H_cont / H_orig = 1.5 / 2.2 = 0.6818 (68.18% of original height is visible).
# Cut off height is H_orig - H_cont = W/1.5 - W/2.2 = W * (2.2 - 1.5) / (1.5 * 2.2) = W * 0.7 / 3.3 = 0.212 * W.
# Crop top = (H_orig - H_cont) / 2 = 0.106 * W = 0.106 * 1.5 * H_orig = 0.159 * H_orig = 15.9% of H_orig!
# Let's print out the exact crop top.
crop_top_pct = (1.0 - (1.5 / 2.2)) / 2 * 100
visible_height_pct = (1.5 / 2.2) * 100
print(f"\nCrop top percentage: {crop_top_pct:.2f}%")
print(f"Visible height percentage: {visible_height_pct:.2f}%")

print("\n--- Recalculated coordinates for aspect-[2.2/1] container (with object-cover) ---")
for name, (pct_x, pct_y) in centroids.items():
    # If pct_y is within the visible area:
    if crop_top_pct <= pct_y <= (100 - crop_top_pct):
        # Map pct_y from original image to container height percentage
        cont_y = ((pct_y - crop_top_pct) / visible_height_pct) * 100
        print(f"{name:20s}: left = {pct_x:.1f}%, top = {cont_y:.1f}%")
    else:
        print(f"{name:20s}: Outside visible area (pct_y = {pct_y:.2f}%)")

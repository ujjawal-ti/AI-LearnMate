#!/usr/bin/env python3
"""
Script to create Chrome extension icons with AI assistant chat logo design
"""

def create_assistant_icon(size):
    """Create a PNG icon with AI assistant chat design"""
    try:
        from PIL import Image, ImageDraw
        import math
        
        # Create a new image with transparent background
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Colors
        black = (0, 0, 0, 255)
        white = (255, 255, 255, 255)
        
        # Scale factors based on size
        scale = size / 128.0
        padding = int(8 * scale)
        
        # Main chat bubble dimensions
        bubble_width = size - (padding * 2)
        bubble_height = int(bubble_width * 0.8)
        bubble_x = padding
        bubble_y = padding + int(10 * scale)
        
        # Draw main chat bubble with rounded corners
        corner_radius = int(20 * scale)
        
        # Create rounded rectangle for chat bubble
        bubble_rect = [bubble_x, bubble_y, bubble_x + bubble_width, bubble_y + bubble_height]
        draw.rounded_rectangle(bubble_rect, radius=corner_radius, fill=black, outline=None)
        
        # Inner white area (smaller rounded rectangle)
        inner_padding = int(8 * scale)
        inner_rect = [
            bubble_x + inner_padding, 
            bubble_y + inner_padding,
            bubble_x + bubble_width - inner_padding,
            bubble_y + bubble_height - inner_padding
        ]
        inner_radius = int(12 * scale)
        draw.rounded_rectangle(inner_rect, radius=inner_radius, fill=white, outline=None)
        
        # Draw chat bubble "tail" (small rectangle at top)
        tail_width = int(16 * scale)
        tail_height = int(12 * scale)
        tail_x = bubble_x + (bubble_width // 2) - (tail_width // 2)
        tail_y = bubble_y - tail_height + int(2 * scale)
        tail_rect = [tail_x, tail_y, tail_x + tail_width, tail_y + tail_height]
        draw.rounded_rectangle(tail_rect, radius=int(4 * scale), fill=black, outline=None)
        
        # Draw eyes (two black circles)
        eye_radius = int(8 * scale)
        eye_y = bubble_y + int(25 * scale)
        
        # Left eye
        left_eye_x = bubble_x + int(30 * scale)
        left_eye_rect = [
            left_eye_x - eye_radius, eye_y - eye_radius,
            left_eye_x + eye_radius, eye_y + eye_radius
        ]
        draw.ellipse(left_eye_rect, fill=black)
        
        # Right eye
        right_eye_x = bubble_x + bubble_width - int(30 * scale)
        right_eye_rect = [
            right_eye_x - eye_radius, eye_y - eye_radius,
            right_eye_x + eye_radius, eye_y + eye_radius
        ]
        draw.ellipse(right_eye_rect, fill=black)
        
        # Draw sparkle/star (4-pointed star)
        star_size = int(20 * scale)
        star_x = bubble_x + bubble_width + int(5 * scale)
        star_y = bubble_y + bubble_height - int(15 * scale)
        
        # Create 4-pointed star shape
        star_points = []
        for i in range(8):
            angle = i * math.pi / 4
            if i % 2 == 0:
                # Outer points
                radius = star_size
            else:
                # Inner points
                radius = star_size * 0.4
            
            x = star_x + radius * math.cos(angle)
            y = star_y + radius * math.sin(angle)
            star_points.extend([x, y])
        
        draw.polygon(star_points, fill=black)
        
        return img
        
    except ImportError:
        # Fallback: create a simple PNG without PIL
        return create_simple_assistant_png(size)

def create_simple_assistant_png(size):
    """Create a simple assistant icon without PIL dependency"""
    import zlib
    
    # Create a basic PNG with chat bubble pattern
    width = height = size
    
    # PNG file signature
    png_sig = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = width.to_bytes(4, 'big') + height.to_bytes(4, 'big') + b'\x08\x06\x00\x00\x00'  # RGBA
    ihdr_chunk = b'IHDR' + ihdr_data
    ihdr_crc = zlib.crc32(ihdr_chunk) & 0xffffffff
    ihdr = len(ihdr_data).to_bytes(4, 'big') + ihdr_chunk + ihdr_crc.to_bytes(4, 'big')
    
    # Create image data with chat bubble pattern
    image_data = bytearray()
    
    black = (0, 0, 0, 255)
    white = (255, 255, 255, 255)
    transparent = (0, 0, 0, 0)
    
    center_x = width // 2
    center_y = height // 2
    
    for y in range(height):
        # Filter byte for each scanline
        image_data.append(0)
        
        for x in range(width):
            pixel = transparent
            
            # Simple chat bubble shape
            bubble_left = width // 6
            bubble_right = width - width // 6
            bubble_top = height // 4
            bubble_bottom = height - height // 6
            
            # Main bubble area
            if (bubble_left < x < bubble_right and bubble_top < y < bubble_bottom):
                # Inner white area
                if (bubble_left + 6 < x < bubble_right - 6 and bubble_top + 6 < y < bubble_bottom - 6):
                    pixel = white
                else:
                    pixel = black
            
            # Chat tail
            elif (center_x - 8 < x < center_x + 8 and bubble_top - 8 < y < bubble_top + 2):
                pixel = black
            
            # Eyes
            elif ((abs(x - (center_x - 20)) < 6 and abs(y - (center_y - 10)) < 6) or
                  (abs(x - (center_x + 20)) < 6 and abs(y - (center_y - 10)) < 6)):
                if (bubble_left + 6 < x < bubble_right - 6 and bubble_top + 6 < y < bubble_bottom - 6):
                    pixel = black
            
            # Star/sparkle
            elif (x > bubble_right and y > center_y):
                if (abs(x - (bubble_right + 15)) < 3 or abs(y - (center_y + 15)) < 3):
                    if abs(x - (bubble_right + 15)) < 8 and abs(y - (center_y + 15)) < 8:
                        pixel = black
            
            # Add RGBA bytes
            image_data.extend(pixel)
    
    # Compress the image data
    compressed_data = zlib.compress(bytes(image_data))
    
    # IDAT chunk
    idat_chunk = b'IDAT' + compressed_data
    idat_crc = zlib.crc32(idat_chunk) & 0xffffffff
    idat = len(compressed_data).to_bytes(4, 'big') + idat_chunk + idat_crc.to_bytes(4, 'big')
    
    # IEND chunk
    iend_chunk = b'IEND'
    iend_crc = zlib.crc32(iend_chunk) & 0xffffffff
    iend = b'\x00\x00\x00\x00' + iend_chunk + iend_crc.to_bytes(4, 'big')
    
    return png_sig + ihdr + idat + iend

def save_icon(size, filename):
    """Save an icon of the specified size"""
    try:
        # Try to create with PIL first
        img = create_assistant_icon(size)
        if hasattr(img, 'save'):
            img.save(filename, 'PNG')
            return True
    except:
        pass
    
    # Fallback to simple PNG creation
    try:
        png_data = create_simple_assistant_png(size)
        with open(filename, 'wb') as f:
            f.write(png_data)
        return True
    except Exception as e:
        print(f"Error creating {filename}: {e}")
        return False

if __name__ == "__main__":
    import os
    
    # Create icons directory if it doesn't exist
    os.makedirs('icons', exist_ok=True)
    
    # Create the three required icon sizes
    sizes = [16, 48, 128]
    
    print("Creating new AI assistant chat icons...")
    
    for size in sizes:
        filename = f'icons/icon{size}.png'
        if save_icon(size, filename):
            print(f"✓ Created {filename}")
        else:
            print(f"✗ Failed to create {filename}")
    
    print("\nIcon creation complete!")
    print("The new icons feature an AI assistant chat design with friendly face and sparkle.")

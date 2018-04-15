def rgb_to_ycbcr(img):
    out = {
        "y": [],
        "cb": [],
        "cr": []
    }
    pixels = list(img.getdata())
    out["width"], out["height"] = img.size
    for px in pixels:
        r = px[0]
        g = px[1]
        b = px[2]
        y = 0.299 * r + 0.587 * g + .114 * b
        cb = 128 + -.169 * r + -.331 * g + .5 * b
        cr = 128 + .5 * r + -.419 * g + .081 * b
        out["y"].append(int(y))
        out["cb"].append(int(cb))
        out["cr"].append(int(cr))
    return out


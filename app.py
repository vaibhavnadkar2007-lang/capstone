import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="Phone Finder", page_icon="📱", layout="wide")

# Load original files
with open("index.html", "r", encoding="utf-8") as f:
    html_file = f.read()
with open("styles.css", "r", encoding="utf-8") as f:
    css = f.read()
with open("app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Combine properly
full_html = f"""
<html>
<head><style>{css}</style></head>
<body>
{html_file}
<script>{js}</script>
</body>
</html>
"""

st.title("📱 Google Phone Finder - LIVE")
components.html(full_html, height=850, scrolling=True)
st.success("App loaded! If map not working, enable GitHub Pages for 100% working.")

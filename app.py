import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="Google Phone Finder Simulator", page_icon="📱", layout="wide")

st.title("📱 Google Phone Finder Simulator")
st.markdown("### & Educational Showcase")
st.markdown("---")

# Read project.md if exists
try:
    with open("project.md", "r") as f:
        project_desc = f.read()
except:
    project_desc = "Capstone project showcasing Google's Find My Device concept"

col1, col2 = st.columns([2,1])

with col1:
    st.markdown("## 🎯 Project Overview")
    st.markdown(project_desc[:2000])
    
    st.markdown("## 🚀 Live Demo")
    st.info("This is the original HTML/JS version embedded below:")
    
    # Embed the original index.html
    try:
        with open("index.html", "r") as f:
            html_content = f.read()
        components.html(html_content, height=600, scrolling=True)
    except Exception as e:
        st.warning("Original demo files will be shown after deployment")

with col2:
    st.markdown("## 🛠️ Tech Stack")
    st.markdown("""
    - **Frontend:** HTML, CSS, JavaScript
    - **Concept:** Google Find My Device Simulator
    - **Type:** Capstone Project
    - **Purpose:** Educational Showcase
    """)
    
    st.markdown("## 📂 Files")
    st.code("""
    index.html
    app.js
    styles.css
    project.md
    app.py (Streamlit demo)
    """)
    
    st.markdown("## 🔗 Links")
    st.markdown("[GitHub Repo](https://github.com/vaibhavnadkar2007-lang/capstone)")

st.markdown("---")
st.markdown("Built by Vaibhav | CSE(AIML)")

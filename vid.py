import streamlit as st
from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.youtube_tools import YouTubeTools
import google.generativeai as genai

import time
from pathlib import Path
import tempfile

from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

# Page configuration
st.set_page_config(
    page_title="Multimodal AI Agent - Video Summarizer",
    page_icon="🎥",
    layout="wide"
)

st.title("Phidata Video AI Summarizer Agent 🎥🎤🖬")
st.header("Powered by Gemini 2.0 Flash Exp")


@st.cache_resource
def initialize_agent():
    return Agent(
        name="Video AI Summarizer",
        model=Gemini(id="gemini-2.0-flash-exp"),
        tools=[YouTubeTools()],
        markdown=True,
        instructions=[
            "You are a YouTube agent. First check the length of the video. Then get the detailed timestamps for a YouTube video corresponding to correct timestamps.",
            "Don't hallucinate timestamps.",
            "Make sure to return the timestamps in the format of `[start_time, end_time, summary]`.",
        ],
    )

# Initialize the agent
multimodal_agent = initialize_agent()

# Video file uploader
video_file = st.file_uploader(
    "Upload a video file", type=['mp4', 'mov', 'avi'], help="Upload a video for AI analysis"
)

if video_file:
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
        temp_video.write(video_file.read())
        video_path = temp_video.name

    st.video(video_path, format="video/mp4", start_time=0)

    user_query = st.text_area(
        "What insights are you seeking from the video?",
        placeholder="Ask anything about the video content. The AI agent will analyze and gather additional context if needed.",
        help="Provide specific questions or insights you want from the video."
    )

    if st.button("🔍 Analyze Video", key="analyze_video_button"):
        if not user_query:
            st.warning("Please enter a question or insight to analyze the video.")
        else:
            try:
                with st.spinner("Processing video and gathering insights..."):
                    # Upload and process video file
                    processed_video = genai.upload_file(video_path)
                    while processed_video.state.name == "PROCESSING":
                        time.sleep(1)
                        processed_video = genai.get_file(processed_video.name)

                    # Prompt generation for analysis
                    analysis_prompt = (
                        f"""
                        Analyze the uploaded video for content and context.
                        Respond to the following query using video insights and supplementary web research:
                        {user_query}

                        Provide a detailed, user-friendly, and actionable response.
                        """
                    )

                    # AI agent processing
                    response = multimodal_agent.run(analysis_prompt, videos=[processed_video])

                # Display the result
                st.subheader("Analysis Result")
                st.markdown(response.content)

            except Exception as error:
                st.error(f"An error occurred during analysis: {error}")
            finally:
                # Clean up temporary video file
                Path(video_path).unlink(missing_ok=True)
else:
    st.info("Upload a video file to begin analysis.")


# YouTube URL input
video_url = st.text_input(
    "Enter YouTube video URL",
    placeholder="Paste a YouTube video link for summary generation."
)

if video_url:
    try:
        # Using the YouTubeTools to fetch and analyze video for summary
        response = multimodal_agent.run(
            f"Analyze the video and provide a concise summary for the video: {video_url}"
        )

        st.subheader("Video Summary")
        st.markdown(response.content)

    except Exception as error:
        st.error(f"An error occurred during analysis: {error}")

else:
    st.info("Enter a YouTube video URL to generate a summary.")


# Customize text area height
st.markdown(
    """
    <style>
    .stTextArea textarea {
        height: 100px;
    }
    </style>
    """,
    unsafe_allow_html=True
)



import gradio as gr

def chat(message, history):
    question = message.lower()

    if "project" in question:
        return (
            "Surya has worked on NOC Post-Patch Reporting Automation, "
            "the SDM Intelligence Agent project, and IT operations "
            "reporting automation."
        )

    if "experience" in question or "about" in question:
        return (
            "Surya is an Operations Manager with 13+ years of "
            "experience in SaaS Service Delivery, IT Operations, "
            "Customer Success, and automation."
        )

    if "github" in question:
        return "Explore Surya's projects: https://github.com/suryark88"

    return (
        "Hello! I'm Surya AI. Ask me about Surya's professional "
        "experience, technical skills, or GitHub projects."
    )

demo = gr.ChatInterface(
    fn=chat,
    title="Surya AI Agent",
    description=(
        "Ask me about Surya's professional experience, "
        "technical expertise, and GitHub projects."
    ),
    examples=[
        "Tell me about Surya's experience",
        "What projects has Surya worked on?",
        "Show me his GitHub projects"
    ]
)

if __name__ == "__main__":
    demo.launch()

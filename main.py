import eel
import platform
import traceback
import sys

eel.init('web')

@eel.expose
def save_code(filename, code):
    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(code)
        return f"Saved to {filename}"
    except Exception as e:
        return f"Save failed: {str(e)}"

@eel.expose
def run_code(cmd):
    try:
        os.system(cmd)
        return f"Command executed: {cmd}"
    except Exception as e:
        return f"Execution failed: {str(e)}"

def start_gui():
    try:
        system = platform.system()
        eel.start('splash.html', port=8000, mode='edge' if system == 'Windows' else 'default')
    except Exception:
        print("Failed to launch GUI.")
        traceback.print_exc()
        eel.start('index.html', mode='none', port=8000)

if __name__ == "__main__":
    try:
        start_gui()
    except KeyboardInterrupt:
        print("\nExiting IDE...")
        sys.exit(0)

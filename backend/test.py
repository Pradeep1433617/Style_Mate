print("Python is working!")
print("Testing...")

try:
    import flask
    print("Flask is installed!")
    print(f"Flask version: {flask.__version__}")
except ImportError:
    print("Flask is NOT installed!")

try:
    import flask_cors
    print("Flask-CORS is installed!")
except ImportError:
    print("Flask-CORS is NOT installed!")
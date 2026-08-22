from flask import Flask, request, jsonify
import os
import requests
from dotenv import load_dotenv
from deep_translator import GoogleTranslator
from google import genai


# =========================================
# LOAD ENVIRONMENT VARIABLES
# =========================================

load_dotenv()


# =========================================
# CREATE FLASK APP
# =========================================

app = Flask(__name__)


# =========================================
# API KEYS
# =========================================

ocr_api_key = os.environ.get("OCR_API_KEY")
gemini_api_key = os.environ.get("GEMINI_API_KEY")


print("OCR API KEY LOADED:", bool(ocr_api_key))
print("GEMINI API KEY LOADED:", bool(gemini_api_key))


# =========================================
# GEMINI CLIENT
# =========================================

gemini_client = None

if gemini_api_key:

    try:

        gemini_client = genai.Client(
            api_key=gemini_api_key
        )

        print("GEMINI CLIENT: READY")

    except Exception as error:

        print(
            "GEMINI CLIENT ERROR:",
            str(error)
        )


# =========================================
# CORS
# =========================================

@app.after_request
def add_cors_headers(response):

    response.headers["Access-Control-Allow-Origin"] = "*"

    response.headers["Access-Control-Allow-Headers"] = (
        "Content-Type"
    )

    response.headers["Access-Control-Allow-Methods"] = (
        "GET, POST, OPTIONS"
    )

    return response


# =========================================
# HOME
# =========================================

@app.route("/")
def home():

    return jsonify({

        "status": "success",

        "message":
            "FormHelp AI backend is running!"

    })


# =========================================
# UPLOAD + OCR
# =========================================

@app.route(
    "/upload",
    methods=["POST", "OPTIONS"]
)
def upload_file():

    if request.method == "OPTIONS":

        return jsonify({
            "status": "success"
        })


    if "file" not in request.files:

        return jsonify({

            "status": "error",

            "message":
                "No file uploaded"

        }), 400


    file = request.files["file"]


    if file.filename == "":

        return jsonify({

            "status": "error",

            "message":
                "No file selected"

        }), 400


    if not ocr_api_key:

        return jsonify({

            "status": "error",

            "message":
                "OCR API key is not configured"

        }), 500


    try:

        response = requests.post(

            "https://api.ocr.space/parse/image",

            files={

                "file": (

                    file.filename,

                    file.stream,

                    file.content_type

                )

            },

            data={

                "apikey":
                    ocr_api_key,

                "language":
                    "eng",

                "isOverlayRequired":
                    "false",

                "OCREngine":
                    "2"

            },

            timeout=60

        )


        ocr_data = response.json()


        if ocr_data.get(
            "IsErroredOnProcessing"
        ):

            return jsonify({

                "status":
                    "error",

                "message":
                    "OCR processing failed",

                "details":
                    ocr_data.get(
                        "ErrorMessage"
                    )

            }), 500


        parsed_results = ocr_data.get(

            "ParsedResults",

            []

        )


        extracted_text = ""


        for result in parsed_results:

            extracted_text += (

                result.get(
                    "ParsedText",
                    ""
                )

                + "\n"

            )


        return jsonify({

            "status":
                "success",

            "message":
                "OCR completed successfully!",

            "filename":
                file.filename,

            "text":
                extracted_text.strip()

        })


    except Exception as error:

        print(
            "OCR ERROR:",
            str(error)
        )


        return jsonify({

            "status":
                "error",

            "message":
                "Could not connect to OCR service",

            "details":
                str(error)

        }), 500


# =========================================
# TRANSLATION
# =========================================

@app.route(
    "/translate",
    methods=["POST", "OPTIONS"]
)
def translate_text():

    if request.method == "OPTIONS":

        return jsonify({

            "status":
                "success"

        })


    try:

        data = request.get_json()


        if not data:

            return jsonify({

                "status":
                    "error",

                "message":
                    "No translation data received"

            }), 400


        text = data.get(
            "text",
            ""
        ).strip()


        target_language = data.get(
            "target_language",
            "en"
        )


        if not text:

            return jsonify({

                "status":
                    "error",

                "message":
                    "No text provided"

            }), 400


        # =====================================
        # ENGLISH
        # =====================================

        if target_language == "en":

            return jsonify({

                "status":
                    "success",

                "translated_text":
                    text,

                "target_language":
                    "en"

            })


        # =====================================
        # LANGUAGE CODES
        # =====================================

        language_codes = {

            "te": "te",
            "hi": "hi",
            "ta": "ta",
            "kn": "kn",
            "ml": "ml",
            "mr": "mr",
            "gu": "gu",
            "bn": "bn",
            "pa": "pa",
            "ur": "ur"

        }


        destination = language_codes.get(
            target_language
        )


        if not destination:

            return jsonify({

                "status":
                    "error",

                "message":
                    "Unsupported language"

            }), 400


        # =====================================
        # TRANSLATE
        # =====================================

        translated_text = GoogleTranslator(

            source="auto",

            target=destination

        ).translate(text)


        return jsonify({

            "status":
                "success",

            "translated_text":
                translated_text,

            "target_language":
                target_language

        })


    except Exception as error:

        print(
            "TRANSLATION ERROR:",
            str(error)
        )


        return jsonify({

            "status":
                "error",

            "message":
                "Translation failed",

            "details":
                str(error)

        }), 500


# =========================================
# ASK AI
# =========================================

@app.route(
    "/ask-ai",
    methods=["POST", "OPTIONS"]
)
def ask_ai():

    # =====================================
    # CORS OPTIONS
    # =====================================

    if request.method == "OPTIONS":

        return jsonify({

            "status":
                "success"

        })


    try:

        # =================================
        # GET REQUEST DATA
        # =================================

        data = request.get_json()


        if not data:

            return jsonify({

                "status":
                    "error",

                "error":
                    "No AI request received"

            }), 400


        question = data.get(
            "question",
            ""
        ).strip()


        language = data.get(
            "language",
            "en"
        )


        # =================================
        # CHECK QUESTION
        # =================================

        if not question:

            return jsonify({

                "status":
                    "error",

                "error":
                    "Please enter a question"

            }), 400


        # =================================
        # CHECK GEMINI API KEY
        # =================================

        if not gemini_api_key:

            return jsonify({

                "status":
                    "error",

                "error":
                    "Gemini API key is not configured"

            }), 500


        # =================================
        # CHECK GEMINI CLIENT
        # =================================

        if gemini_client is None:

            return jsonify({

                "status":
                    "error",

                "error":
                    "Gemini AI client is not available"

            }), 500


        # =================================
        # LANGUAGE NAMES
        # =================================

        language_names = {

            "en": "English",

            "te": "Telugu",

            "hi": "Hindi",

            "ta": "Tamil",

            "kn": "Kannada",

            "ml": "Malayalam",

            "mr": "Marathi",

            "bn": "Bengali"

        }


        selected_language = language_names.get(

            language,

            "English"

        )


        # =================================
        # AI PROMPT
        # =================================

        prompt = f"""

You are FormHelp AI.

Your job is to help users understand
and fill application forms.

Answer the user's question clearly,
simply, and helpfully.

The user selected language is:

{selected_language}

Always answer in:

{selected_language}

If the question is about a form field:

1. Explain what the field means.
2. Explain what information should be entered.
3. Give a simple example when useful.

If the question is about required documents:

1. Explain what the document is.
2. Explain why it may be required.

If the question is about eligibility,
government rules, deadlines, or official requirements,
do not invent information.

If the answer depends on a particular form,
government department, institution, or authority,
tell the user to verify the official information.

Keep the answer easy to understand.

User question:

{question}

"""


        # =================================
        # SEND REQUEST TO GEMINI
        # =================================

        print("")
        print("================================")
        print("ASK AI REQUEST")
        print("Question:", question)
        print("Language:", selected_language)
        print("================================")


        response = gemini_client.models.generate_content(

            model="gemini-3.6-flash",

            contents=prompt

        )


        # =================================
        # GET AI RESPONSE
        # =================================

        if not response:

            raise Exception(
                "Gemini returned an empty response"
            )


        answer = response.text


        if not answer:

            raise Exception(
                "Gemini returned empty text"
            )


        answer = answer.strip()


        # =================================
        # RETURN SUCCESS
        # =================================

        print("AI RESPONSE RECEIVED")


        return jsonify({

            "status":
                "success",

            "answer":
                answer,

            "language":
                language

        })


    except Exception as error:

        # =================================
        # SHOW ACTUAL ERROR
        # =================================

        print("")
        print("================================")
        print("ASK AI ERROR")
        print(str(error))
        print("================================")
        print("")


        return jsonify({

            "status":
                "error",

            "error":
                str(error)

        }), 500


# =========================================
# START SERVER
# =========================================

if __name__ == "__main__":

    print("")
    print("================================")
    print("FORMHELP AI SERVER")
    print("================================")
    print("OCR:", bool(ocr_api_key))
    print("GEMINI:", bool(gemini_api_key))
    print("================================")
    print("")


    app.run(
        debug=True
    )
